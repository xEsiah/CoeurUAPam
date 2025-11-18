<?php

namespace Hostinger\Reach\Providers;

use Hostinger\Reach\Api\Webhooks\Handlers\CartAbandoned;
use Hostinger\Reach\Container;
use Hostinger\Reach\Functions;
use Hostinger\Reach\Repositories\CartRepository;
use Hostinger\Reach\Tracking\AbandonedCarts;

if ( ! defined( 'ABSPATH' ) ) {
    die;
}

class TrackingProvider implements ProviderInterface {
    public function register( Container $container ): void {
        $container->set(
            AbandonedCarts::class,
            function () use ( $container ) {
                return new AbandonedCarts(
                    $container->get( CartRepository::class ),
                    $container->get( CartAbandoned::class ),
                    $container->get( Functions::class )
                );
            }
        );

        $abandoned_carts = $container->get( AbandonedCarts::class );
        $abandoned_carts->init();
    }
}
