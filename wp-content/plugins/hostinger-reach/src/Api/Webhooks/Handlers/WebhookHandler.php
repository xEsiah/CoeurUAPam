<?php

namespace Hostinger\Reach\Api\Webhooks\Handlers;

use Hostinger\Reach\Api\Handlers\ReachApiHandler;
use Hostinger\Reach\Repositories\FormRepository;

abstract class WebhookHandler {

    protected ReachApiHandler $reach_api_handler;
    protected FormRepository $form_repository;

    public function __construct( ReachApiHandler $reach_api_handler, FormRepository $form_repository ) {
        $this->reach_api_handler = $reach_api_handler;
        $this->form_repository   = $form_repository;
    }

    public function init(): void {
        add_action( 'init', array( $this, 'init_hooks' ) );
    }

    public function is_enabled(): bool {
        return $this->reach_api_handler->is_connected() && $this->is_automation_active();
    }

    public function is_automation_active(): bool {
        return $this->form_repository->is_form_active( $this->get_name() );
    }

    public function increase_automation_submission_counter(): bool {
        return $this->form_repository->submit( array( 'form_id' => $this->get_name() ) );
    }

    public function handle( string $email, mixed $data ): bool {
        $webhook_payload = array(
            'name'     => $this->get_name(),
            'contact'  => array(
                'email' => $email,
            ),
            'metadata' => $this->get_metadata( $data ),
        );

        $response = $this->reach_api_handler->post_webhook_event( $webhook_payload );
        if ( ! $response->is_error() ) {
            $this->increase_automation_submission_counter();
            return true;
        }

        return false;
    }

    abstract public function init_hooks(): void;
    abstract public function get_metadata( mixed $data ): array;
    abstract public function get_name(): string;
}
