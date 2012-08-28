<?php
/**
 * @file
 * google_store_locator.views_default.inc
 */

/**
 * Implements hook_views_default_views().
 */
function google_store_locator_views_default_views() {
  $export = array();

  $view = new view();
  $view->name = 'json_export';
  $view->description = '';
  $view->tag = 'default';
  $view->base_table = 'node';
  $view->human_name = 'Location Export';
  $view->core = 7;
  $view->api_version = '3.0';
  $view->disabled = FALSE; /* Edit this to true to make a default view disabled initially */

  /* Display: Master */
  $handler = $view->new_display('default', 'Master', 'default');
  $handler->display->display_options['title'] = 'JSON Feed Test';
  $handler->display->display_options['use_more_always'] = FALSE;
  $handler->display->display_options['access']['type'] = 'perm';
  $handler->display->display_options['cache']['type'] = 'none';
  $handler->display->display_options['query']['type'] = 'views_query';
  $handler->display->display_options['exposed_form']['type'] = 'basic';
  $handler->display->display_options['pager']['type'] = 'full';
  $handler->display->display_options['pager']['options']['items_per_page'] = '10';
  $handler->display->display_options['style_plugin'] = 'views_geojson';
  $handler->display->display_options['style_options']['data_source']['value'] = 'geofield';
  $handler->display->display_options['style_options']['data_source']['latitude'] = 'gsl_geofield';
  $handler->display->display_options['style_options']['data_source']['longitude'] = 'gsl_geofield';
  $handler->display->display_options['style_options']['data_source']['bbox_top'] = 'gsl_geofield';
  $handler->display->display_options['style_options']['data_source']['bbox_right'] = 'gsl_geofield';
  $handler->display->display_options['style_options']['data_source']['bbox_bottom'] = 'gsl_geofield';
  $handler->display->display_options['style_options']['data_source']['bbox_left'] = 'gsl_geofield';
  $handler->display->display_options['style_options']['data_source']['name_field'] = '';
  $handler->display->display_options['style_options']['data_source']['description_field'] = '';
  $handler->display->display_options['style_options']['jsonp_prefix'] = '';
  $handler->display->display_options['style_options']['using_views_api_mode'] = 0;
  /* Field: Content: Title */
  $handler->display->display_options['fields']['title']['id'] = 'title';
  $handler->display->display_options['fields']['title']['table'] = 'node';
  $handler->display->display_options['fields']['title']['field'] = 'title';
  $handler->display->display_options['fields']['title']['label'] = 'Store Name';
  $handler->display->display_options['fields']['title']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['title']['link_to_node'] = FALSE;
  /* Field: Content: Store Locator Address */
  $handler->display->display_options['fields']['gsl_addressfield']['id'] = 'gsl_addressfield';
  $handler->display->display_options['fields']['gsl_addressfield']['table'] = 'field_data_gsl_addressfield';
  $handler->display->display_options['fields']['gsl_addressfield']['field'] = 'gsl_addressfield';
  $handler->display->display_options['fields']['gsl_addressfield']['label'] = 'Street Address';
  $handler->display->display_options['fields']['gsl_addressfield']['alter']['alter_text'] = TRUE;
  $handler->display->display_options['fields']['gsl_addressfield']['alter']['text'] = '[gsl_addressfield-thoroughfare]';
  $handler->display->display_options['fields']['gsl_addressfield']['click_sort_column'] = 'country';
  $handler->display->display_options['fields']['gsl_addressfield']['settings'] = array(
    'use_widget_handlers' => 1,
    'format_handlers' => array(
      'address' => 'address',
    ),
  );
  /* Field: Content: Store Locator Address */
  $handler->display->display_options['fields']['gsl_addressfield_1']['id'] = 'gsl_addressfield_1';
  $handler->display->display_options['fields']['gsl_addressfield_1']['table'] = 'field_data_gsl_addressfield';
  $handler->display->display_options['fields']['gsl_addressfield_1']['field'] = 'gsl_addressfield';
  $handler->display->display_options['fields']['gsl_addressfield_1']['label'] = 'City';
  $handler->display->display_options['fields']['gsl_addressfield_1']['alter']['alter_text'] = TRUE;
  $handler->display->display_options['fields']['gsl_addressfield_1']['alter']['text'] = '[gsl_addressfield_1-locality]';
  $handler->display->display_options['fields']['gsl_addressfield_1']['click_sort_column'] = 'country';
  $handler->display->display_options['fields']['gsl_addressfield_1']['settings'] = array(
    'use_widget_handlers' => 1,
    'format_handlers' => array(
      'address' => 'address',
    ),
  );
  /* Field: Content: Store Locator Address */
  $handler->display->display_options['fields']['gsl_addressfield_2']['id'] = 'gsl_addressfield_2';
  $handler->display->display_options['fields']['gsl_addressfield_2']['table'] = 'field_data_gsl_addressfield';
  $handler->display->display_options['fields']['gsl_addressfield_2']['field'] = 'gsl_addressfield';
  $handler->display->display_options['fields']['gsl_addressfield_2']['label'] = 'State';
  $handler->display->display_options['fields']['gsl_addressfield_2']['alter']['alter_text'] = TRUE;
  $handler->display->display_options['fields']['gsl_addressfield_2']['alter']['text'] = '[gsl_addressfield_2-administrative_area]';
  $handler->display->display_options['fields']['gsl_addressfield_2']['click_sort_column'] = 'country';
  $handler->display->display_options['fields']['gsl_addressfield_2']['settings'] = array(
    'use_widget_handlers' => 1,
    'format_handlers' => array(
      'address' => 'address',
    ),
  );
  /* Field: Content: Store Locator Address */
  $handler->display->display_options['fields']['gsl_addressfield_3']['id'] = 'gsl_addressfield_3';
  $handler->display->display_options['fields']['gsl_addressfield_3']['table'] = 'field_data_gsl_addressfield';
  $handler->display->display_options['fields']['gsl_addressfield_3']['field'] = 'gsl_addressfield';
  $handler->display->display_options['fields']['gsl_addressfield_3']['label'] = 'Zip Code';
  $handler->display->display_options['fields']['gsl_addressfield_3']['alter']['alter_text'] = TRUE;
  $handler->display->display_options['fields']['gsl_addressfield_3']['alter']['text'] = '[gsl_addressfield_3-postal_code]';
  $handler->display->display_options['fields']['gsl_addressfield_3']['click_sort_column'] = 'country';
  $handler->display->display_options['fields']['gsl_addressfield_3']['settings'] = array(
    'use_widget_handlers' => 1,
    'format_handlers' => array(
      'address' => 'address',
    ),
  );
  /* Field: Content: Store Locator Geofield */
  $handler->display->display_options['fields']['gsl_geofield']['id'] = 'gsl_geofield';
  $handler->display->display_options['fields']['gsl_geofield']['table'] = 'field_data_gsl_geofield';
  $handler->display->display_options['fields']['gsl_geofield']['field'] = 'gsl_geofield';
  $handler->display->display_options['fields']['gsl_geofield']['label'] = 'Coordinates';
  $handler->display->display_options['fields']['gsl_geofield']['click_sort_column'] = 'wkt';
  $handler->display->display_options['fields']['gsl_geofield']['type'] = 'geofield_geojson';
  $handler->display->display_options['fields']['gsl_geofield']['settings'] = array(
    'data' => 'full',
  );
  /* Field: Content: Nid */
  $handler->display->display_options['fields']['nid']['id'] = 'nid';
  $handler->display->display_options['fields']['nid']['table'] = 'node';
  $handler->display->display_options['fields']['nid']['field'] = 'nid';
  $handler->display->display_options['fields']['nid']['label'] = 'Unique Store ID';
  /* Sort criterion: Content: Post date */
  $handler->display->display_options['sorts']['created']['id'] = 'created';
  $handler->display->display_options['sorts']['created']['table'] = 'node';
  $handler->display->display_options['sorts']['created']['field'] = 'created';
  $handler->display->display_options['sorts']['created']['order'] = 'DESC';
  /* Filter criterion: Content: Type */
  $handler->display->display_options['filters']['type']['id'] = 'type';
  $handler->display->display_options['filters']['type']['table'] = 'node';
  $handler->display->display_options['filters']['type']['field'] = 'type';
  $handler->display->display_options['filters']['type']['value'] = array(
    'store_location' => 'store_location',
  );

  /* Display: Page */
  $handler = $view->new_display('page', 'Page', 'page');
  $handler->display->display_options['defaults']['hide_admin_links'] = FALSE;
  $handler->display->display_options['path'] = 'json-export';
  $export['json_export'] = $view;

  return $export;
}
