<?php

namespace Hostinger\Reach\Api\Handlers;

use Hostinger\Reach\Api\ApiKeyManager;
use Hostinger\Reach\Functions;
use Hostinger\Reach\Integrations\Reach\ReachFormIntegration;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;

if ( ! defined( 'ABSPATH' ) ) {
    die;
}

class ReachApiHandler extends ApiHandler {
    protected string $hostinger_auth_url;
    protected string $reach_domain;
    public ApiKeyManager $api_key_manager;

    public function __construct( Functions $functions, ApiKeyManager $api_key_manager ) {
        parent::__construct( $functions );
        $this->api_key_manager = $api_key_manager;
        $this->set_api_base_name();
        $this->init_hooks();
    }

    public function init_hooks(): void {

        add_filter(
            'allowed_http_origins',
            function ( $origins ) {
                $origins[] = HOSTINGER_REACH_REST_URI;

                return $origins;
            }
        );

        /**
         * Submits a contact to Reach
         *
         * @param array $data The data to be sent
         * email: string - - Contact email
         * name: string (optional) - Contact name
         * surname: string (optional) - Contact surname
         * group: string (optional) - The group to which the contact belongs WordPress by default
         * metadata: array (optional) - Additional metadata to be sent with the contact
         *    - plugin: string - The name of the plugin sending the contact
         *
         * example of usage:
         *
         * do_action( 'hostinger_reach_submit', array(
         *     'email' => 'john.doe@example.com',
         *     'name' => 'John',
         *     'surname' => 'Doe',
         *     'group' => 'your plugin name',
         *     'metadata' => array(
         *         'plugin' => 'your plugin name',
         *     )
         * ))
         *
         * @fires hostinger_reach_contact_submitted when the contact is submitted successfully
         * @fires hostinger_reach_contact_failed when the contact submission fails
         * @since 1.1.0
         *
         */
        if ( ! has_action( 'hostinger_reach_submit' ) ) {
            add_action( 'hostinger_reach_submit', array( $this, 'post_contact' ) );
        }
    }

    public function get_default_headers(): array {
        return array(
            'Authorization' => 'Bearer ' . $this->api_key_manager->get_token(),
        );
    }

    public function is_connected(): bool {
        return ! empty( $this->api_key_manager->get_token() );
    }

    public function post_contact_handler( WP_REST_Request $request ): WP_REST_Response {
        if ( ! $this->is_authorized( $request ) ) {
            return $this->handle_wp_error( new WP_Error( 'Not authorized', 'You cannot perform this action' ) );
        }

        $email    = $request->get_param( 'email' );
        $name     = $request->get_param( 'name' );
        $surname  = $request->get_param( 'surname' );
        $form_id  = $request->get_param( 'id' );
        $metadata = $request->get_param( 'metadata' );
        $group    = apply_filters( 'hostinger_reach_get_group', $request->get_param( 'group' ), $form_id );

        return $this->post_contact(
            array(
                'form_id'  => $form_id,
                'group'    => $group,
                'email'    => $email,
                'name'     => $name,
                'surname'  => $surname,
                'metadata' => $metadata,
            )
        );
    }

    public function is_authorized( WP_REST_Request $request ): bool {
        $nonce = $request->get_header( 'X-WP-Nonce' );
        return wp_verify_nonce( $nonce, 'wp_rest' ) && $this->get_connection_status_handler();
    }

    public function post_generate_auth_url( WP_REST_Request $request = null ): WP_REST_Response {
        $this->api_key_manager->generate_csrf();

        $query_params = array(
            'fromPlugin' => true,
            'type'       => 'wordpress',
            'userType'   => $this->get_functions()->is_hostinger_user() ? 'internal' : 'external',
            'token'      => urlencode( $this->api_key_manager->get_csrf() ),
            'domain'     => $this->get_functions()->get_host_info(),
        );

        $reach_url = add_query_arg( $query_params, $this->reach_domain . 'settings/connect-site' );
        $auth_url  = add_query_arg(
            array(
                'redirectUrl' => urlencode( $reach_url ),
            ),
            $this->hostinger_auth_url
        );

        return new WP_REST_Response(
            array(
                'auth_url' => $auth_url,
                'success'  => true,
            ),
            200
        );
    }

    public function get_connection_status_handler(): bool {
        if ( ! $this->is_connected() ) {
            return false;
        }

        $status = $this->get( 'connection/status' );
        if ( is_wp_error( $status ) || wp_remote_retrieve_response_code( $status ) >= 400 ) {
            return false;
        }

        return true;
    }

    public function post_token_handler( WP_REST_Request $request ): WP_REST_Response {
        $csrf_field = $request->get_param( 'csrf_field' );
        $token      = $request->get_param( 'token' );
        if ( ! $this->api_key_manager->validate_csrf( $csrf_field ) ) {
            return $this->handle_wp_error( new WP_Error( 'Not authorized', 'You cannot perform this action' ) );
        }

        $this->api_key_manager->store_token( $token );
        $this->api_key_manager->clear_csrf();

        return new WP_REST_Response( array( 'success' => true ) );
    }

    public function get_overview_handler(): WP_REST_Response {
        if ( ! $this->get_connection_status_handler() ) {
            $this->api_key_manager->clear_token();

            return $this->handle_wp_error( new WP_Error( 'Not authorized', 'You cannot perform this action', array( 'status' => 403 ) ) );
        }

        $response = $this->get( 'overview' );

        if ( is_wp_error( $response ) ) {
            return $this->handle_wp_error( $response );
        }

        return $this->handle_response( $response );
    }

    public function post_contact( array $data ): WP_REST_Response {
        if ( ! $this->get_connection_status_handler() ) {
            $this->api_key_manager->clear_token();
            return $this->handle_wp_error( new WP_Error( 'Not authorized', 'You cannot perform this action' ) );
        }

        $contact = array(
            'email' => sanitize_email( $data['email'] ),
        );

        if ( ! empty( $data['name'] ) ) {
            $contact['name'] = $data['name'];
        }

        if ( ! empty( $data['surname'] ) ) {
            $contact['surname'] = $data['surname'];
        }

        $metadata = $data['metadata'] ?? array();
        if ( ! is_array( $metadata ) ) {
            $metadata = array();
        }

        // phpcs:ignore WordPress.WP.CapitalPDangit.MisspelledInText -- Internal metadata key.
        $metadata['platform'] = 'wordpress';

        if ( ! isset( $metadata['plugin'] ) ) {
            $metadata['plugin'] = ReachFormIntegration::INTEGRATION_NAME;
        }

        $contact['metadata'] = $metadata;
        $args                = array(
            'groupName' => $data['group'] ? $data['group'] : HOSTINGER_REACH_DEFAULT_CONTACT_LIST,
            'contacts'  => array( $contact ),
        );

        $response = $this->post(
            'contacts',
            $args
        );

        if ( is_wp_error( $response ) ) {
            do_action( 'hostinger_reach_contact_failed', $data );

            return $this->handle_wp_error( $response );
        }

        do_action( 'hostinger_reach_contact_submitted', $data );

        return $this->handle_response( $response );
    }

    public function post_webhook_event( array $webhook_payload ): WP_REST_Response {
        if ( ! $this->get_connection_status_handler() ) {
            $this->api_key_manager->clear_token();

            return $this->handle_wp_error( new WP_Error( 'Not authorized', 'You cannot perform this action' ) );
        }

        if ( ! isset( $webhook_payload['name'] ) ) {
            return $this->handle_wp_error( new WP_Error( 'Bad request', 'Missing parameter [name] in the WebHook data' ) );
        }

        if ( ! isset( $webhook_payload['contact']['email'] ) ) {
            return $this->handle_wp_error( new WP_Error( 'Bad request', 'Missing parameter [contact.email] in the WebHook data' ) );
        }

        $webhook_payload['timestamp'] = gmdate( 'Y-m-d\TH:i:s\Z' );

        $response = $this->post(
            'webhooks',
            $webhook_payload
        );

        if ( is_wp_error( $response ) ) {
            return $this->handle_wp_error( $response );
        }

        return $this->handle_response( $response );
    }

    private function set_api_base_name(): void {
        if ( $this->get_functions()->is_staging() ) {
            $this->hostinger_auth_url = 'https://auth.hostinger.dev/login';
            $this->reach_domain       = 'https://reach.hostinger.dev/';
        } else {
            $this->hostinger_auth_url = 'https://auth.hostinger.com/login';
            $this->reach_domain       = 'https://reach.hostinger.com/';
        }

        $this->api_base_name = $this->reach_domain . 'api/public/v1/';
    }
}
