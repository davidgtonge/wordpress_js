<?php
/*
Plugin Name: Wordpress JS
Plugin URI: http://simplecreativity.co.uk/
Description: Fast JS interface to Wordpress
Version: 0.1
Author: Dave Tonge
License: GPLv2 or later
*/

/*
This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
*/


/* CONSTANTS */
define(WJS_BASE, plugins_url('wordpress_js'));
define(WJS_LIBS, WJS_BASE . "/js/libs/");





add_action('init','wjs_setup');
function wjs_setup(){
    /*
     * Set up all of our scripts to load
     * Todo: Only run this code conditionally
     */
    if(is_admin() && $_REQUEST['page'] === "wordpress_js"){
        wp_enqueue_script('underscore',WJS_LIBS . "underscore.js");
        wp_enqueue_script('underscore_string', WJS_LIBS . "underscore.string.min.js", array('underscore'));
        wp_enqueue_script('backbone', WJS_LIBS . "backbone.js", array('underscore'));
        wp_enqueue_script('xdate', WJS_LIBS . "xdate.js");
        wp_enqueue_script('wjs_plugins', WJS_LIBS . "plugins.js");
        wp_enqueue_script('wjs_init', WJS_BASE . "/js/init.js?time=" . time());
        wp_enqueue_script('wjs_models', WJS_BASE . "/js/models.js?time=" . time());
        wp_enqueue_script('wjs_views', WJS_BASE . "/js/views.js?time=" . time());

    }

    //wp_deregister_script('jquery');
    //wp_register_script('jquery', WJS_LIBS . "jquery.js");
    //wp_enqueue_script('jquery');
    //wp_enqueue_script('jquery_ui', WJS_LIBS . "jquery-ui-1.8.16.custom.min.js", array('jquery'));

    //wp_enqueue_style('jquery_ui', WJS_BASE . "/css/ui-lightness/jquery-ui-1.8.16.custom.css");


}

add_action("admin_menu", "wjs_menu" );
function wjs_menu(){
    add_menu_page('WordPress JS', 'WordPress JS', 'manage_options','wordpress_js','wjs_show_page');
}
function wjs_show_page(){
    echo "<div id='wjs_app'></div>";
}


class WjsBase
{
    public $var = "Test";

}

class WjsPost extends WjsBase
{
    var $current_id;

    public function get_all(){
        // Gets all posts
        $args = array(
              'post_type' => 'any',
              'post_status' => 'any',
              'posts_per_page' => -1
        );
        $query = new WP_Query($args);
        return $query->posts;
    }

    public function get($id = "current"){
        if($id === "current") $id = $this->current_id;
        // Gets a single post based on its id
        return get_post($id);
    }

    public function set($post_data){
        $this->current_id = $post_data['ID'];
        return wp_update_post($post_data);
    }

    public function create($post_data){
        return wp_insert_post($post_data);
    }
}

class WjsImage extends WjsBase
{
    public function get_all(){
        // Gets all posts
        $args = array(
            'post_type' => 'attachment',
            'post_status' => NULL,
            'posts_per_page' => -1
            );
        $query = new WP_Query($args);
        return $query->posts;
    }

    public function get($id){
        // Gets a single post based on its id
        return get_post($id);
    }

    public function set($post_data){
        return wp_update_post($post_data);
    }

    public function create($post_data){
        return wp_insert_post($post_data);
    }
}


$wjs_post = new WjsPost();
$wjs_image = new WjsImage();



function wjs_check_permissions(){
    //todo: add security checks
    return true;
}


add_action('wp_ajax_wjs','wjs_ajax_handler');

function wjs_ajax_handler(){
    wjs_check_permissions();
    global $wjs_post;
    $response = array();

    switch($_REQUEST['wjs_action']){
        case "init":
            $response = wjs_init_data();
            break;

        case "bulk":
            $operations = json_decode(stripslashes($_REQUEST['content']),true);
            $response = array();
            foreach($operations as $cid => $vars){
                switch($vars['action']){
                    case "update":
                        $wjs_post->set($vars['values']);
                        $response[$cid] = $wjs_post->get();
                        break;
                }

            }
            break;

    }

    echo json_encode($response);
    exit;
}

function wjs_init_data(){
    global $wjs_post, $wjs_image;
    return array(
        'posts' => $wjs_post->get_all(),
        'images' => $wjs_image->get_all(),
        'post_types' => get_post_types()
    );
}