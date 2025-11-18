<?php

namespace Hostinger\Reach\Setup;

class Encrypt {
    public const ENCRYPT_METHOD = 'AES-256-CBC';

    public static function encrypt( string $value ): string {
        if ( ! self::can_encrypt() ) {
            return base64_encode( $value );
        }

        $key       = hash( 'sha256', AUTH_KEY, true );
        $iv        = openssl_random_pseudo_bytes( openssl_cipher_iv_length( self::ENCRYPT_METHOD ) );
        $encrypted = openssl_encrypt( $value, self::ENCRYPT_METHOD, $key, 0, $iv );

        return base64_encode( $iv . $encrypted );
    }

    public static function decrypt( string $value ): string {
        if ( ! self::can_encrypt() ) {
            return base64_decode( $value );
        }
        $iv_length = openssl_cipher_iv_length( self::ENCRYPT_METHOD );
        $data      = base64_decode( $value );
        $iv        = substr( $data, 0, $iv_length );
        $encrypted = substr( $data, $iv_length );
        $key       = hash( 'sha256', AUTH_KEY, true );

        return openssl_decrypt( $encrypted, self::ENCRYPT_METHOD, $key, 0, $iv );
    }

    private static function get_auth_key(): string {
        if ( ! DEFINED( 'AUTH_KEY' ) ) {
            return '';
        }

        return AUTH_KEY;
    }

    private static function can_encrypt(): bool {
        return extension_loaded( 'openssl' ) && self::get_auth_key();
    }
}
