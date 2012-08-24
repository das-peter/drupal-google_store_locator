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

  $view = new view;
  $view->name = 'clone_of_location_export';
  $view->description = '';
  $view->tag = 'default';
  $view->base_table = 'node';
  $view->human_name = 'Clone of Location Export';
  $view->core = 7;
  $view->api_version = '3.0';
  $view->disabled = FALSE; /* Edit this to true to make a default view disabled initially */

  /* Display: Master */
  $handler = $view->new_display('default', 'Master', 'default');
  $handler->display->display_options['title'] = 'Location Export';
  $handler->display->display_options['access']['type'] = 'perm';
  $handler->display->display_options['cache']['type'] = 'none';
  $handler->display->display_options['query']['type'] = 'views_query';
  $handler->display->display_options['query']['options']['query_comment'] = FALSE;
  $handler->display->display_options['exposed_form']['type'] = 'basic';
  $handler->display->display_options['pager']['type'] = 'full';
  $handler->display->display_options['pager']['options']['items_per_page'] = '10';
  $handler->display->display_options['style_plugin'] = 'default';
  $handler->display->display_options['row_plugin'] = 'node';
  /* Field: Content: Title */
  $handler->display->display_options['fields']['title']['id'] = 'title';
  $handler->display->display_options['fields']['title']['table'] = 'node';
  $handler->display->display_options['fields']['title']['field'] = 'title';
  $handler->display->display_options['fields']['title']['label'] = 'Store_name';
  $handler->display->display_options['fields']['title']['alter']['alter_text'] = 0;
  $handler->display->display_options['fields']['title']['alter']['make_link'] = 0;
  $handler->display->display_options['fields']['title']['alter']['absolute'] = 0;
  $handler->display->display_options['fields']['title']['alter']['external'] = 0;
  $handler->display->display_options['fields']['title']['alter']['replace_spaces'] = 0;
  $handler->display->display_options['fields']['title']['alter']['trim_whitespace'] = 0;
  $handler->display->display_options['fields']['title']['alter']['nl2br'] = 0;
  $handler->display->display_options['fields']['title']['alter']['word_boundary'] = 0;
  $handler->display->display_options['fields']['title']['alter']['ellipsis'] = 0;
  $handler->display->display_options['fields']['title']['alter']['more_link'] = 0;
  $handler->display->display_options['fields']['title']['alter']['strip_tags'] = 0;
  $handler->display->display_options['fields']['title']['alter']['trim'] = 0;
  $handler->display->display_options['fields']['title']['alter']['html'] = 0;
  $handler->display->display_options['fields']['title']['element_label_colon'] = 1;
  $handler->display->display_options['fields']['title']['element_default_classes'] = 1;
  $handler->display->display_options['fields']['title']['hide_empty'] = 0;
  $handler->display->display_options['fields']['title']['empty_zero'] = 0;
  $handler->display->display_options['fields']['title']['hide_alter_empty'] = 1;
  $handler->display->display_options['fields']['title']['link_to_node'] = 1;
  /* Field: Content: Store Locator Address */
  $handler->display->display_options['fields']['store_locator_addressfield']['id'] = 'store_locator_addressfield';
  $handler->display->display_options['fields']['store_locator_addressfield']['table'] = 'field_data_store_locator_addressfield';
  $handler->display->display_options['fields']['store_locator_addressfield']['field'] = 'store_locator_addressfield';
  $handler->display->display_options['fields']['store_locator_addressfield']['label'] = 'Street_add';
  $handler->display->display_options['fields']['store_locator_addressfield']['alter']['alter_text'] = 1;
  $handler->display->display_options['fields']['store_locator_addressfield']['alter']['text'] = '[store_locator_addressfield-thoroughfare]';
  $handler->display->display_options['fields']['store_locator_addressfield']['alter']['make_link'] = 0;
  $handler->display->display_options['fields']['store_locator_addressfield']['alter']['absolute'] = 0;
  $handler->display->display_options['fields']['store_locator_addressfield']['alter']['external'] = 0;
  $handler->display->display_options['fields']['store_locator_addressfield']['alter']['replace_spaces'] = 0;
  $handler->display->display_options['fields']['store_locator_addressfield']['alter']['trim_whitespace'] = 0;
  $handler->display->display_options['fields']['store_locator_addressfield']['alter']['nl2br'] = 0;
  $handler->display->display_options['fields']['store_locator_addressfield']['alter']['word_boundary'] = 1;
  $handler->display->display_options['fields']['store_locator_addressfield']['alter']['ellipsis'] = 1;
  $handler->display->display_options['fields']['store_locator_addressfield']['alter']['more_link'] = 0;
  $handler->display->display_options['fields']['store_locator_addressfield']['alter']['strip_tags'] = 0;
  $handler->display->display_options['fields']['store_locator_addressfield']['alter']['trim'] = 0;
  $handler->display->display_options['fields']['store_locator_addressfield']['alter']['html'] = 0;
  $handler->display->display_options['fields']['store_locator_addressfield']['element_label_colon'] = 1;
  $handler->display->display_options['fields']['store_locator_addressfield']['element_default_classes'] = 1;
  $handler->display->display_options['fields']['store_locator_addressfield']['hide_empty'] = 0;
  $handler->display->display_options['fields']['store_locator_addressfield']['empty_zero'] = 0;
  $handler->display->display_options['fields']['store_locator_addressfield']['hide_alter_empty'] = 1;
  $handler->display->display_options['fields']['store_locator_addressfield']['click_sort_column'] = 'country';
  $handler->display->display_options['fields']['store_locator_addressfield']['settings'] = array(
    'use_widget_handlers' => 1,
    'format_handlers' => array(
      'address' => 'address',
    ),
  );
  $handler->display->display_options['fields']['store_locator_addressfield']['field_api_classes'] = 0;
  /* Field: Content: Store Locator Address */
  $handler->display->display_options['fields']['store_locator_addressfield_1']['id'] = 'store_locator_addressfield_1';
  $handler->display->display_options['fields']['store_locator_addressfield_1']['table'] = 'field_data_store_locator_addressfield';
  $handler->display->display_options['fields']['store_locator_addressfield_1']['field'] = 'store_locator_addressfield';
  $handler->display->display_options['fields']['store_locator_addressfield_1']['label'] = 'City';
  $handler->display->display_options['fields']['store_locator_addressfield_1']['alter']['alter_text'] = 1;
  $handler->display->display_options['fields']['store_locator_addressfield_1']['alter']['text'] = '[store_locator_addressfield_1-locality]';
  $handler->display->display_options['fields']['store_locator_addressfield_1']['alter']['make_link'] = 0;
  $handler->display->display_options['fields']['store_locator_addressfield_1']['alter']['absolute'] = 0;
  $handler->display->display_options['fields']['store_locator_addressfield_1']['alter']['external'] = 0;
  $handler->display->display_options['fields']['store_locator_addressfield_1']['alter']['replace_spaces'] = 0;
  $handler->display->display_options['fields']['store_locator_addressfield_1']['alter']['trim_whitespace'] = 0;
  $handler->display->display_options['fields']['store_locator_addressfield_1']['alter']['nl2br'] = 0;
  $handler->display->display_options['fields']['store_locator_addressfield_1']['alter']['word_boundary'] = 1;
  $handler->display->display_options['fields']['store_locator_addressfield_1']['alter']['ellipsis'] = 1;
  $handler->display->display_options['fields']['store_locator_addressfield_1']['alter']['more_link'] = 0;
  $handler->display->display_options['fields']['store_locator_addressfield_1']['alter']['strip_tags'] = 0;
  $handler->display->display_options['fields']['store_locator_addressfield_1']['alter']['trim'] = 0;
  $handler->display->display_options['fields']['store_locator_addressfield_1']['alter']['html'] = 0;
  $handler->display->display_options['fields']['store_locator_addressfield_1']['element_label_colon'] = 1;
  $handler->display->display_options['fields']['store_locator_addressfield_1']['element_default_classes'] = 1;
  $handler->display->display_options['fields']['store_locator_addressfield_1']['hide_empty'] = 0;
  $handler->display->display_options['fields']['store_locator_addressfield_1']['empty_zero'] = 0;
  $handler->display->display_options['fields']['store_locator_addressfield_1']['hide_alter_empty'] = 1;
  $handler->display->display_options['fields']['store_locator_addressfield_1']['click_sort_column'] = 'country';
  $handler->display->display_options['fields']['store_locator_addressfield_1']['settings'] = array(
    'use_widget_handlers' => 1,
    'format_handlers' => array(
      'address' => 'address',
    ),
  );
  $handler->display->display_options['fields']['store_locator_addressfield_1']['field_api_classes'] = 0;
  /* Field: Content: Store Locator Address */
  $handler->display->display_options['fields']['store_locator_addressfield_2']['id'] = 'store_locator_addressfield_2';
  $handler->display->display_options['fields']['store_locator_addressfield_2']['table'] = 'field_data_store_locator_addressfield';
  $handler->display->display_options['fields']['store_locator_addressfield_2']['field'] = 'store_locator_addressfield';
  $handler->display->display_options['fields']['store_locator_addressfield_2']['label'] = 'State';
  $handler->display->display_options['fields']['store_locator_addressfield_2']['alter']['alter_text'] = 1;
  $handler->display->display_options['fields']['store_locator_addressfield_2']['alter']['text'] = '[store_locator_addressfield_2-administrative_area]';
  $handler->display->display_options['fields']['store_locator_addressfield_2']['alter']['make_link'] = 0;
  $handler->display->display_options['fields']['store_locator_addressfield_2']['alter']['absolute'] = 0;
  $handler->display->display_options['fields']['store_locator_addressfield_2']['alter']['external'] = 0;
  $handler->display->display_options['fields']['store_locator_addressfield_2']['alter']['replace_spaces'] = 0;
  $handler->display->display_options['fields']['store_locator_addressfield_2']['alter']['trim_whitespace'] = 0;
  $handler->display->display_options['fields']['store_locator_addressfield_2']['alter']['nl2br'] = 0;
  $handler->display->display_options['fields']['store_locator_addressfield_2']['alter']['word_boundary'] = 1;
  $handler->display->display_options['fields']['store_locator_addressfield_2']['alter']['ellipsis'] = 1;
  $handler->display->display_options['fields']['store_locator_addressfield_2']['alter']['more_link'] = 0;
  $handler->display->display_options['fields']['store_locator_addressfield_2']['alter']['strip_tags'] = 0;
  $handler->display->display_options['fields']['store_locator_addressfield_2']['alter']['trim'] = 0;
  $handler->display->display_options['fields']['store_locator_addressfield_2']['alter']['html'] = 0;
  $handler->display->display_options['fields']['store_locator_addressfield_2']['element_label_colon'] = 1;
  $handler->display->display_options['fields']['store_locator_addressfield_2']['element_default_classes'] = 1;
  $handler->display->display_options['fields']['store_locator_addressfield_2']['hide_empty'] = 0;
  $handler->display->display_options['fields']['store_locator_addressfield_2']['empty_zero'] = 0;
  $handler->display->display_options['fields']['store_locator_addressfield_2']['hide_alter_empty'] = 1;
  $handler->display->display_options['fields']['store_locator_addressfield_2']['click_sort_column'] = 'country';
  $handler->display->display_options['fields']['store_locator_addressfield_2']['settings'] = array(
    'use_widget_handlers' => 1,
    'format_handlers' => array(
      'address' => 'address',
    ),
  );
  $handler->display->display_options['fields']['store_locator_addressfield_2']['field_api_classes'] = 0;
  /* Field: Content: Store Locator Address */
  $handler->display->display_options['fields']['store_locator_addressfield_3']['id'] = 'store_locator_addressfield_3';
  $handler->display->display_options['fields']['store_locator_addressfield_3']['table'] = 'field_data_store_locator_addressfield';
  $handler->display->display_options['fields']['store_locator_addressfield_3']['field'] = 'store_locator_addressfield';
  $handler->display->display_options['fields']['store_locator_addressfield_3']['label'] = 'Zip_code';
  $handler->display->display_options['fields']['store_locator_addressfield_3']['alter']['alter_text'] = 1;
  $handler->display->display_options['fields']['store_locator_addressfield_3']['alter']['text'] = '[store_locator_addressfield_3-postal_code]';
  $handler->display->display_options['fields']['store_locator_addressfield_3']['alter']['make_link'] = 0;
  $handler->display->display_options['fields']['store_locator_addressfield_3']['alter']['absolute'] = 0;
  $handler->display->display_options['fields']['store_locator_addressfield_3']['alter']['external'] = 0;
  $handler->display->display_options['fields']['store_locator_addressfield_3']['alter']['replace_spaces'] = 0;
  $handler->display->display_options['fields']['store_locator_addressfield_3']['alter']['trim_whitespace'] = 0;
  $handler->display->display_options['fields']['store_locator_addressfield_3']['alter']['nl2br'] = 0;
  $handler->display->display_options['fields']['store_locator_addressfield_3']['alter']['word_boundary'] = 1;
  $handler->display->display_options['fields']['store_locator_addressfield_3']['alter']['ellipsis'] = 1;
  $handler->display->display_options['fields']['store_locator_addressfield_3']['alter']['more_link'] = 0;
  $handler->display->display_options['fields']['store_locator_addressfield_3']['alter']['strip_tags'] = 0;
  $handler->display->display_options['fields']['store_locator_addressfield_3']['alter']['trim'] = 0;
  $handler->display->display_options['fields']['store_locator_addressfield_3']['alter']['html'] = 0;
  $handler->display->display_options['fields']['store_locator_addressfield_3']['element_label_colon'] = 1;
  $handler->display->display_options['fields']['store_locator_addressfield_3']['element_default_classes'] = 1;
  $handler->display->display_options['fields']['store_locator_addressfield_3']['hide_empty'] = 0;
  $handler->display->display_options['fields']['store_locator_addressfield_3']['empty_zero'] = 0;
  $handler->display->display_options['fields']['store_locator_addressfield_3']['hide_alter_empty'] = 1;
  $handler->display->display_options['fields']['store_locator_addressfield_3']['click_sort_column'] = 'country';
  $handler->display->display_options['fields']['store_locator_addressfield_3']['settings'] = array(
    'use_widget_handlers' => 1,
    'format_handlers' => array(
      'address' => 'address',
    ),
  );
  $handler->display->display_options['fields']['store_locator_addressfield_3']['field_api_classes'] = 0;
  /* Field: Content: Store Locator Geofield */
  $handler->display->display_options['fields']['store_locator_geofield']['id'] = 'store_locator_geofield';
  $handler->display->display_options['fields']['store_locator_geofield']['table'] = 'field_data_store_locator_geofield';
  $handler->display->display_options['fields']['store_locator_geofield']['field'] = 'store_locator_geofield';
  $handler->display->display_options['fields']['store_locator_geofield']['label'] = 'Xcoord';
  $handler->display->display_options['fields']['store_locator_geofield']['alter']['alter_text'] = 0;
  $handler->display->display_options['fields']['store_locator_geofield']['alter']['make_link'] = 0;
  $handler->display->display_options['fields']['store_locator_geofield']['alter']['absolute'] = 0;
  $handler->display->display_options['fields']['store_locator_geofield']['alter']['external'] = 0;
  $handler->display->display_options['fields']['store_locator_geofield']['alter']['replace_spaces'] = 0;
  $handler->display->display_options['fields']['store_locator_geofield']['alter']['trim_whitespace'] = 0;
  $handler->display->display_options['fields']['store_locator_geofield']['alter']['nl2br'] = 0;
  $handler->display->display_options['fields']['store_locator_geofield']['alter']['word_boundary'] = 1;
  $handler->display->display_options['fields']['store_locator_geofield']['alter']['ellipsis'] = 1;
  $handler->display->display_options['fields']['store_locator_geofield']['alter']['more_link'] = 0;
  $handler->display->display_options['fields']['store_locator_geofield']['alter']['strip_tags'] = 0;
  $handler->display->display_options['fields']['store_locator_geofield']['alter']['trim'] = 0;
  $handler->display->display_options['fields']['store_locator_geofield']['alter']['html'] = 0;
  $handler->display->display_options['fields']['store_locator_geofield']['element_label_colon'] = 1;
  $handler->display->display_options['fields']['store_locator_geofield']['element_default_classes'] = 1;
  $handler->display->display_options['fields']['store_locator_geofield']['hide_empty'] = 0;
  $handler->display->display_options['fields']['store_locator_geofield']['empty_zero'] = 0;
  $handler->display->display_options['fields']['store_locator_geofield']['hide_alter_empty'] = 1;
  $handler->display->display_options['fields']['store_locator_geofield']['click_sort_column'] = 'geom';
  $handler->display->display_options['fields']['store_locator_geofield']['type'] = 'geofield_lon';
  $handler->display->display_options['fields']['store_locator_geofield']['settings'] = array(
    'data' => 'full',
    'format' => 'decimal_degrees',
  );
  $handler->display->display_options['fields']['store_locator_geofield']['field_api_classes'] = 0;
  /* Field: Content: Store Locator Geofield */
  $handler->display->display_options['fields']['store_locator_geofield_1']['id'] = 'store_locator_geofield_1';
  $handler->display->display_options['fields']['store_locator_geofield_1']['table'] = 'field_data_store_locator_geofield';
  $handler->display->display_options['fields']['store_locator_geofield_1']['field'] = 'store_locator_geofield';
  $handler->display->display_options['fields']['store_locator_geofield_1']['label'] = 'Ycoord';
  $handler->display->display_options['fields']['store_locator_geofield_1']['alter']['alter_text'] = 0;
  $handler->display->display_options['fields']['store_locator_geofield_1']['alter']['make_link'] = 0;
  $handler->display->display_options['fields']['store_locator_geofield_1']['alter']['absolute'] = 0;
  $handler->display->display_options['fields']['store_locator_geofield_1']['alter']['external'] = 0;
  $handler->display->display_options['fields']['store_locator_geofield_1']['alter']['replace_spaces'] = 0;
  $handler->display->display_options['fields']['store_locator_geofield_1']['alter']['trim_whitespace'] = 0;
  $handler->display->display_options['fields']['store_locator_geofield_1']['alter']['nl2br'] = 0;
  $handler->display->display_options['fields']['store_locator_geofield_1']['alter']['word_boundary'] = 1;
  $handler->display->display_options['fields']['store_locator_geofield_1']['alter']['ellipsis'] = 1;
  $handler->display->display_options['fields']['store_locator_geofield_1']['alter']['more_link'] = 0;
  $handler->display->display_options['fields']['store_locator_geofield_1']['alter']['strip_tags'] = 0;
  $handler->display->display_options['fields']['store_locator_geofield_1']['alter']['trim'] = 0;
  $handler->display->display_options['fields']['store_locator_geofield_1']['alter']['html'] = 0;
  $handler->display->display_options['fields']['store_locator_geofield_1']['element_label_colon'] = 1;
  $handler->display->display_options['fields']['store_locator_geofield_1']['element_default_classes'] = 1;
  $handler->display->display_options['fields']['store_locator_geofield_1']['hide_empty'] = 0;
  $handler->display->display_options['fields']['store_locator_geofield_1']['empty_zero'] = 0;
  $handler->display->display_options['fields']['store_locator_geofield_1']['hide_alter_empty'] = 1;
  $handler->display->display_options['fields']['store_locator_geofield_1']['click_sort_column'] = 'geom';
  $handler->display->display_options['fields']['store_locator_geofield_1']['type'] = 'geofield_lat';
  $handler->display->display_options['fields']['store_locator_geofield_1']['settings'] = array(
    'data' => 'full',
    'format' => 'decimal_degrees',
  );
  $handler->display->display_options['fields']['store_locator_geofield_1']['field_api_classes'] = 0;
  /* Field: Content: Nid */
  $handler->display->display_options['fields']['nid']['id'] = 'nid';
  $handler->display->display_options['fields']['nid']['table'] = 'node';
  $handler->display->display_options['fields']['nid']['field'] = 'nid';
  $handler->display->display_options['fields']['nid']['label'] = 'uuid';
  $handler->display->display_options['fields']['nid']['alter']['alter_text'] = 0;
  $handler->display->display_options['fields']['nid']['alter']['make_link'] = 0;
  $handler->display->display_options['fields']['nid']['alter']['absolute'] = 0;
  $handler->display->display_options['fields']['nid']['alter']['external'] = 0;
  $handler->display->display_options['fields']['nid']['alter']['replace_spaces'] = 0;
  $handler->display->display_options['fields']['nid']['alter']['trim_whitespace'] = 0;
  $handler->display->display_options['fields']['nid']['alter']['nl2br'] = 0;
  $handler->display->display_options['fields']['nid']['alter']['word_boundary'] = 1;
  $handler->display->display_options['fields']['nid']['alter']['ellipsis'] = 1;
  $handler->display->display_options['fields']['nid']['alter']['more_link'] = 0;
  $handler->display->display_options['fields']['nid']['alter']['strip_tags'] = 0;
  $handler->display->display_options['fields']['nid']['alter']['trim'] = 0;
  $handler->display->display_options['fields']['nid']['alter']['html'] = 0;
  $handler->display->display_options['fields']['nid']['element_label_colon'] = 1;
  $handler->display->display_options['fields']['nid']['element_default_classes'] = 1;
  $handler->display->display_options['fields']['nid']['hide_empty'] = 0;
  $handler->display->display_options['fields']['nid']['empty_zero'] = 0;
  $handler->display->display_options['fields']['nid']['hide_alter_empty'] = 1;
  $handler->display->display_options['fields']['nid']['link_to_node'] = 0;
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
  $handler->display->display_options['filters']['type']['group'] = 1;

  /* Display: Page */
  $handler = $view->new_display('page', 'Page', 'page');
  $handler->display->display_options['path'] = 'location-export';

  /* Display: Data export */
  $handler = $view->new_display('views_data_export', 'Data export', 'views_data_export_1');
  $handler->display->display_options['pager']['type'] = 'some';
  $handler->display->display_options['style_plugin'] = 'views_data_export_csv';
  $handler->display->display_options['path'] = 'download/location-export';
  $export['clone_of_location_export'] = $view;

  return $export;
}
