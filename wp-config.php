<?php
define( 'WP_CACHE', true );

/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * Localized language
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'u409631934_WKjDw' );

/** Database username */
define( 'DB_USER', 'u409631934_rKHK6' );

/** Database password */
define( 'DB_PASSWORD', 'n1IdiPsdYz' );

/** Database hostname */
define( 'DB_HOST', '127.0.0.1' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',          'oZq.[[_8o8l^&2I%!rvY[)LR#xkrWSxT.Dvu55u;c0:1Db/B-Oy2ssNRT/1|(1)@' );
define( 'SECURE_AUTH_KEY',   ',*]#wKlB Sc:y+lS/]&t9H*Z{(M8fUx>}`mb+|.u-RvRwjT:Sog-erwpxyV%2>j:' );
define( 'LOGGED_IN_KEY',     ']nOJR>QgBg{rnqf_|44<[qe>[BHC+~nhyY_&uFWDgHy6A`a2XM*&5!Rwgd|9Q|q}' );
define( 'NONCE_KEY',         ',}}$+Fv,ZV_4H]tq8nkt$|Y]@j@vq~!{K$~1#&~/%C87 Ii:UGeL}DzY34Y11p-|' );
define( 'AUTH_SALT',         '.,)@_8+W!WL}7x[o_[M+J7SLMJ6:o$q?YY[&=XnUMu*mi-#k(Zd5+>3#vXv_JYh(' );
define( 'SECURE_AUTH_SALT',  'i()@k`8/f>lZdO5o*]#zMLwtIL_0%C52d$y-1i7!8uE)@[%goOT6hs)uAR!Qe-AR' );
define( 'LOGGED_IN_SALT',    ']a65{ 1S<wzUnMyu%I&Kw9o6FFLxE9>K~`T$5tmCvL~^djD5dMm}NyMEBuuXUI3U' );
define( 'NONCE_SALT',        'UdDn7g7=gV.j?>?W@6z-rJP$k_wSFpBQ%!H0gK==Z}S(lf/G](UGW]83*WQEaHcR' );
define( 'WP_CACHE_KEY_SALT', 'Nk5*mKT%/}OzS0t`/&m<fryH#73p@kdSL(__kwS xGM^P)s3-lJHEa,HRxoktKNF' );


/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';


/* Add any custom values between this line and the "stop editing" line. */



/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
if ( ! defined( 'WP_DEBUG' ) ) {
	define( 'WP_DEBUG', false );
}

define( 'FS_METHOD', 'direct' );
define( 'COOKIEHASH', '9fe9bff77c124fc2e556937c9bf224ce' );
define( 'WP_AUTO_UPDATE_CORE', 'minor' );
/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
