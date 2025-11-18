<?php

namespace Hostinger\Reach\Integrations\WSForms;

use Hostinger\Reach\Dto\PluginData;
use Hostinger\Reach\Integrations\Integration;
use Hostinger\Reach\Integrations\IntegrationInterface;

class WSFormsIntegration extends Integration implements IntegrationInterface {

    public const INTEGRATION_NAME = 'ws-form';

    public static function get_name(): string {
        return self::INTEGRATION_NAME;
    }

    public function get_plugin_data(): PluginData {

        return PluginData::from_array(
            array(
                'id'               => $this->get_name(),
                'title'            => __( 'WS Form', 'hostinger-reach' ),
                'folder'           => 'ws-form',
                'file'             => 'ws-form.php',
                'admin_url'        => 'admin.php?page=ws-form',
                'add_form_url'     => 'admin.php?page=ws-form-add',
                'edit_url'         => 'admin.php?page=ws-form-edit&id={form_id}',
                'url'              => 'https://wordpress.org/plugins/ws-form/',
                'download_url'     => 'https://downloads.wordpress.org/plugin/ws-form.zip',
                'icon'             => 'https://plugins.svn.wordpress.org/ws-form/assets/icon-256x256.jpg',
                'can_toggle_forms' => false,
            )
        );
    }

    public function active_integration_hooks(): void {
        return;
    }

    public function get_forms(): array {
        return array();
    }
}
