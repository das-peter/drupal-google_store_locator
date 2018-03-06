<?php

/**
 * @file
 * Google Store Locator variables info.
 */

/**
 * Implements hook_variable_group_info().
 */
function google_store_locator_variable_group_info() {
  $groups['google_store_locator'] = array(
    'title' => t('Google Store Locator'),
    'description' => t('Google Store Locator configuration'),
    'path' => array('admin/config/search/google_store_locator'),
  );
  return $groups;
}

/**
 * Implements hook_variable_info().
 */
function google_store_locator_variable_info($options) {
  $variable['gsl_search_label'] = array(
    'type' => 'string',
    'title' => t('What should the search label say?', array(), $options),
    'description' => t('The label shown above the search input box.', array(), $options),
    'default' => 'Where are you?',
    'required' => TRUE,
    'localize' => TRUE,
    'group' => 'google_store_locator',
  );
  $variable['gsl_noresults_in_view'] = array(
    'type' => 'string',
    'title' => t('What should be displayed if no stores are found after searching a location?', array(), $options),
    'description' => t('The message displayed if no stores are found after searching.', array(), $options),
    'default' => 'There are no stores in this area. However, stores closest to you are listed below.',
    'required' => TRUE,
    'localize' => TRUE,
    'group' => 'google_store_locator',
  );
  $variable['gsl_noresults'] = array(
    'type' => 'string',
    'title' => t('What should be displayed if no stores are available?', array(), $options),
    'description' => t('The message displayed if no stores are available and when loading the data failed.', array(), $options),
    'default' => 'There are no stores available.',
    'required' => TRUE,
    'localize' => TRUE,
    'group' => 'google_store_locator',
  );

  return $variable;
}
