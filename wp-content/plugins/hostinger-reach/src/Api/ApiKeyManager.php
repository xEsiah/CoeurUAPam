<?php

namespace Hostinger\Reach\Api;

use Hostinger\Reach\Admin\Notices\ConnectionNotice;
use Hostinger\Reach\Setup\Encrypt;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class ApiKeyManager {
    public const CSRF_TRANSIENT            = 'hostinger_reach_csrf_token';
    public const CSRF_TRANSIENT_EXPIRATION = 500;
    public const API_KEY_NAME              = 'hostinger_reach_api_key';
    public const API_CONNECTION_TIME_NAME  = 'hostinger_reach_api_connection_time';

    public function store_token( string $token ): bool {
        add_option( self::API_CONNECTION_TIME_NAME, time() );

        return update_option( self::API_KEY_NAME, $this->encrypt_token( $token ) );
    }

    public function get_token(): string {
        return $this->decrypt_token( get_option( self::API_KEY_NAME, '' ) );
    }

    public function encrypt_token( string $token ): string {
        return Encrypt::encrypt( $token );
    }

    public function decrypt_token( string $token ): string {
        return Encrypt::decrypt( $token );
    }

    public function validate_csrf( string $csrf ): bool {
        $transient_csrf = $this->get_csrf();
        $order_id       = $this->get_order_id();
        if ( $transient_csrf && $transient_csrf === $csrf ) {
            return true;
        }

        if ( $order_id && $order_id === $csrf ) {
            return true;
        }

        return false;
    }

    public function generate_csrf(): void {
        set_transient( self::CSRF_TRANSIENT, wp_generate_password( 12, false ), self::CSRF_TRANSIENT_EXPIRATION );
    }

    public function get_csrf(): string {
        return get_transient( self::CSRF_TRANSIENT );
    }

    public function clear_csrf(): void {
        delete_transient( self::CSRF_TRANSIENT );
    }

    public function clear_token(): void {
        delete_option( self::API_KEY_NAME );
        delete_transient( ConnectionNotice::NOTICE_DISMISS_TRANSIENT );
    }

    protected function get_order_id(): string {
        $api_token_path = $this->get_api_token_path();
        if ( file_exists( $api_token_path ) ) {
            $order_id = trim( file_get_contents( $api_token_path ) );
        }

        if ( ! empty( $order_id ) ) {
            return $order_id;
        }

        return '';
    }

    private function get_api_token_path(): string {
        $hostinger_parts = explode( '/', __DIR__ );
        if ( count( $hostinger_parts ) >= 3 ) {
            $hostinger_root = '/' . $hostinger_parts[1] . '/' . $hostinger_parts[2];

            return $hostinger_root . '/.api_token';
        }

        return '';
    }
}
