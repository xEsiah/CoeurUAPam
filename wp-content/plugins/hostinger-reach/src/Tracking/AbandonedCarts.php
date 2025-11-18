<?php

namespace Hostinger\Reach\Tracking;

use Hostinger\Reach\Api\Webhooks\Handlers\CartAbandoned;
use Exception;
use Hostinger\Reach\Functions;
use Hostinger\Reach\Models\Cart;
use Hostinger\Reach\Repositories\CartRepository;
use WC_Cart;

class AbandonedCarts {

    private CartRepository $cart_repository;
    private CartAbandoned $cart_abandoned;
    private WC_Cart|null $cart = null;
    private string|null $hash  = null;
    private Functions $functions;

    public function __construct( CartRepository $cart_repository, CartAbandoned $cart_abandoned, Functions $functions ) {
        $this->cart_repository = $cart_repository;
        $this->cart_abandoned  = $cart_abandoned;
        $this->functions       = $functions;
    }

    public function init(): void {
        add_action( 'woocommerce_store_api_cart_update_order_from_request', array( $this, 'capture_cart' ), 99 );
        add_action( 'woocommerce_cart_item_set_quantity', array( $this, 'capture_cart' ), 99 );
        add_action( 'woocommerce_add_to_cart', array( $this, 'capture_cart' ), 99 );
        add_action( 'woocommerce_after_calculate_totals', array( $this, 'capture_cart' ), 99 );
        add_action( 'woocommerce_cart_item_removed', array( $this, 'capture_cart' ), 99 );
        add_action( 'woocommerce_cart_item_restored', array( $this, 'capture_cart' ), 99 );
        add_action( 'woocommerce_thankyou', array( $this, 'clear_cart' ), 99 );
        add_action( 'woocommerce_checkout_order_processed', array( $this, 'clear_cart' ), 99 );
        add_action( 'woocommerce_checkout_update_order_review', array( $this, 'capture_guest_email' ), 99 );
        add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_cart_tracker_script' ) );
        add_action( 'wp_ajax_nopriv_abandoned-carts', array( $this, 'handle_ajax_action' ) );
    }

    public function handle_ajax_action(): void {
        check_ajax_referer( 'abandoned-carts', 'nonce' );
        $email = sanitize_text_field( $_POST['email'] );
        $this->track_abandoned_cart( $email );
    }

    public function enqueue_cart_tracker_script(): void {

        if ( ! $this->should_track() ) {
            return;
        }

        $file_name = 'abandoned-carts';
        $js_file   = $this->functions->get_frontend_dir() . $file_name . '.js';

        if ( $js_file ) {
            wp_enqueue_script(
                $file_name,
                $this->functions->get_frontend_url() . $file_name . '.js',
                array(),
                filemtime( $this->functions->get_frontend_dir() . $file_name . '.js' ),
                true
            );

            wp_localize_script(
                $file_name,
                'hostinger_reach_email_capture_data',
                array(
                    'action'  => $file_name,
                    'nonce'   => wp_create_nonce( $file_name ),
                    'ajaxurl' => admin_url( 'admin-ajax.php' ),
                )
            );
        }
    }


    public function capture_guest_email( string $post_data ): void {
        if ( is_user_logged_in() ) {
            return;
        }

        parse_str( $post_data, $fields );
        $this->track_abandoned_cart( $fields['billing_email'] ?? '' );
    }

    public function capture_cart(): void {
        $this->track_abandoned_cart();
    }


    public function track_abandoned_cart( string $email = '' ): void {
        if ( ! $this->should_track() ) {
            return;
        }

        $cart = WC()->cart;

        if ( $cart ) {
            $this->cart = $cart;
            $this->hash = $this->get_cart_hash( $email );
        }

        try {
            if ( ! $this->hash ) {
                $tracked_cart = false;
            } else {
                $tracked_cart = $this->cart_repository->get( $this->hash ?? '' );
            }
        } catch ( Exception $e ) {
            $tracked_cart = false;
        }

        if ( $tracked_cart ) {
            $this->update_or_delete_cart( $email );
        } else {
            $this->maybe_create_cart( $email );
        }
    }

    public function clear_cart(): void {
        $this->hash = $this->get_cart_hash();
        if ( $this->hash ) {
            $this->cart_repository->delete( $this->hash );
        }
    }

    private function update_or_delete_cart( string $email = '' ): void {
        $fields = $this->get_cart_fields( $email );
        if ( $this->cart->is_empty() ) {
            $this->cart_repository->delete( $this->hash );
        } else {
            $this->cart_repository->update( $fields );
        }
    }

    private function maybe_create_cart( string $email = '' ): void {
        if ( $this->cart->is_empty() ) {
            return;
        }

        $this->set_cart_hash();
        $fields = $this->get_cart_fields( $email );
        if ( empty( $fields ) ) {
            return;
        }
        $this->cart_repository->insert( $fields );
    }

    private function get_cart_fields( string $guest_email = '' ): array {
        $customer = WC()->customer;

        if ( ! $customer || ! $this->cart || ! $this->hash ) {
            return array();
        }

        $email = $this->get_email( $guest_email );

        if ( ! $email ) {
            return array();
        }

        return array(
            'hash'           => $this->hash,
            'customer_id'    => $customer->get_id(),
            'customer_email' => $email,
            'totals'         => wp_json_encode( $this->cart->get_totals() ),
            'items'          => $this->get_cart_items(),
            'updated_at'     => current_time( 'mysql' ),
            'status'         => Cart::STATUS_ACTIVE,
            'currency'       => get_woocommerce_currency(),
        );
    }

    private function get_email( string $fallback_email = '' ): string {
        $customer = WC()->customer;

        if ( ! $customer ) {
            return $fallback_email;
        }

        $email = $customer->get_email();

        if ( ! $email ) {
            $email = $customer->get_billing_email();
        }

        if ( ! $email ) {
            $changes = $customer->get_changes();
            $email   = $changes['billing']['email'] ?? false;
        }

        if ( ! $email ) {
            $email = $fallback_email;
        }

        return $email;
    }

    private function get_cart_items(): string {
        $cart_data = array();

        if ( $this->cart ) {
            foreach ( $this->cart->get_cart_contents() as $item ) {
                $cart_data[] = $this->cart_repository->get_cart_item( $item );
            }
        }

        return wp_json_encode( $cart_data );
    }

    private function get_cart_hash( string $fallback_email = '' ): ?string {

        $hash = $this->get_cart_hash_from_session();

        if ( $hash ) {
            return $hash;
        }

        $customer = WC()->customer;
        if ( $customer ) {
            $cart = $this->cart_repository->get_by_customer( $customer, $fallback_email );

            return $cart['hash'] ?? null;
        }

        return null;
    }

    private function get_cart_hash_from_session(): string {
        $session = WC()?->session ?? null;
        if ( ! $session ) {
            return '';
        }

        return $session->get_customer_unique_id();
    }

    private function set_cart_hash(): void {
        $cart_hash = $this->get_cart_hash_from_session();

        if ( $cart_hash ) {
            $this->hash = $cart_hash;

            return;
        }

        $this->hash = wp_generate_uuid4();
    }

    private function should_track(): bool {
        return $this->cart_abandoned->is_enabled();
    }
}
