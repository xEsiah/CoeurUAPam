<?php

namespace Hostinger\Reach\Integrations\Forminator;

use Hostinger\Reach\Dto\PluginData;
use Hostinger\Reach\Integrations\Integration;
use Hostinger\Reach\Integrations\IntegrationInterface;

class ForminatorIntegration extends Integration implements IntegrationInterface {

    public const INTEGRATION_NAME = 'forminator';

    public static function get_name(): string {
        return self::INTEGRATION_NAME;
    }

    public function get_post_type(): string {
        return 'forminator_forms';
    }

    public function get_plugin_data(): PluginData {
        return PluginData::from_array(
            array(
                'id'           => self::INTEGRATION_NAME,
                'folder'       => 'forminator',
                'file'         => 'forminator.php',
                'admin_url'    => 'admin.php?page=forminator',
                'add_form_url' => 'admin.php?page=forminator-cform',
                'edit_url'     => 'admin.php?page=forminator-cform-wizard&id={post_id}',
                'url'          => 'https://wordpress.org/plugins/forminator/',
                'download_url' => 'https://downloads.wordpress.org/plugin/forminator.zip',
                'title'        => __( 'Forminator', 'hostinger-reach' ),
                'icon'         => 'https://ps.w.org/forminator/assets/icon-256x256.png',
            )
        );
    }

    public function active_integration_hooks(): void {
        add_action( 'forminator_form_after_save_entry', array( $this, 'handle_submission' ), 1, 2 );
    }

    public function handle_submission( int $form_id, array $submission_data ): void {
        if ( ! $this->is_form_enabled( $form_id ) ) {
            return;
        }

        if ( ! function_exists( 'forminator_get_form_name' ) ) {
            return;
        }

        $name  = forminator_get_form_name( $form_id );
        $email = $this->find_email();
        if ( empty( $email ) ) {
            return;
        }

        do_action(
            'hostinger_reach_submit',
            array(
                'group'    => $name ?? self::INTEGRATION_NAME,
                'email'    => $email,
                'metadata' => array(
                    'plugin'  => self::INTEGRATION_NAME,
                    'form_id' => $form_id,
                ),
            )
        );
    }

    private function find_email(): string {
        foreach ( $_POST as $key => $value ) {
            $sanitized_value = sanitize_email( $value );
            if ( filter_var( $sanitized_value, FILTER_VALIDATE_EMAIL ) ) {
                return $value;
            }
        }

        return '';
    }
}
