<?php
/**
 * Created by JetBrains PhpStorm.
 * Author: David Tonge
 * Author Email: dave (at) simplecreativity.co.uk
 * Date: 23/12/11
 * Time: 07:04
 */
 

function wjs_check_permissions(){


}






function wjs_init_data(){

    wjs_check_permissions();

    $args = array(
      'post_type' => 'any',
      'post_status' => 'any',
      'posts_per_page' => -1
    );
    //Todo: limit amount of posts to 100 at a time and loop through pages

    function wjs_group_by_custom($groupby_statement){
        $groupby_statement = "GROUP BY post_type";
        return $groupby_statement;
    }

    add_filter('posts_groupby','wjs_group_by_custom');

    $query = new WP_Query($args);

    remove_filter('posts_groupby','wjs_group_by_custom');

    echo json_encode($query->posts);

}