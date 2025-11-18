<?php

namespace Hostinger\Reach\Integrations\SureForms;

use Hostinger\Reach\Dto\PluginData;
use Hostinger\Reach\Integrations\Integration;
use Hostinger\Reach\Integrations\IntegrationInterface;
use SRFM\Inc\Helper;

class SureFormsIntegration extends Integration implements IntegrationInterface {

    public const INTEGRATION_NAME = 'sureforms';

    public static function get_name(): string {
        return self::INTEGRATION_NAME;
    }

    public function get_post_type(): string {
        return 'sureforms_form';
    }

    public function get_plugin_data(): PluginData {
        return PluginData::from_array(
            array(
                'id'           => self::INTEGRATION_NAME,
                'folder'       => 'sureforms',
                'file'         => 'sureforms.php',
                'admin_url'    => 'admin.php?page=sureforms_menu',
                'add_form_url' => 'admin.php?page=add-new-form',
                'edit_url'     => 'post.php?post={post_id}&action=edit',
                'url'          => 'https://wordpress.org/plugins/sureforms/',
                'download_url' => 'https://downloads.wordpress.org/plugin/sureforms.zip',
                'title'        => __( 'Sure Forms', 'hostinger-reach' ),
                'icon'         => 'https://ps.w.org/sureforms/assets/icon-256x256.gif',
            )
        );
    }

    public function init(): void {
        parent::init();
        add_action( 'hostinger_reach_integration_activated', array( $this, 'set_onboarding_skipped' ) );
    }

    public function set_onboarding_skipped( string $name ): void {
        if ( $name !== self::INTEGRATION_NAME || ! class_exists( 'SRFM\Inc\Helper' ) ) {
            return;
        }
        update_option( '__srfm_do_redirect', false );
        Helper::update_srfm_option( 'onboarding_completed', 'yes' );
    }

    public function active_integration_hooks(): void {
        add_action( 'srfm_form_submit', array( $this, 'handle_submission' ) );
    }

    public function handle_submission( array $submission_data ): void {
        if ( ! $this->is_form_enabled( $submission_data['form_id'] ) ) {
            return;
        }

        $data  = $submission_data['data'] ?? array();
        $email = $data['email'] ?? null;

        if ( $email ) {
            do_action(
                'hostinger_reach_submit',
                array(
                    'group'    => $submission_data['form_name'] ?? self::INTEGRATION_NAME,
                    'email'    => $email,
                    'metadata' => array(
                        'plugin'  => self::INTEGRATION_NAME,
                        'form_id' => $submission_data['form_id'],
                    ),
                )
            );
        }
    }
}
