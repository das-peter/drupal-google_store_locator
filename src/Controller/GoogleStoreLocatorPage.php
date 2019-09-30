<?php

namespace Drupal\google_store_locator\Controller;

use Drupal\Component\Utility\Html;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Field\FieldFilteredMarkup;

/**
 * Returns responses for Google Store Locator module routes.
 */
class GoogleStoreLocatorPage extends ControllerBase {

  /**
   * Display store locator page.
   *
   * @return array
   *   A render array containing the listing.
   */
  public function index() {
    $settings = [];

    // Add the feature list if some exist.
    $feature_field = \Drupal\field\Entity\FieldStorageConfig::loadByName('node', 'field_gsl_feature_filter_list');
    if (isset($feature_field)) {
      $feature_list = options_allowed_values($feature_field);
      if (!empty($feature_list)) {
        // Need to sanitize the keys and labels returned from
        // options_allowed_values().
        foreach ($feature_list as $key => $label) {
          $skey = (string) FieldFilteredMarkup::create($key);
          $settings['feature_list'][$skey] = (string) FieldFilteredMarkup::create($label);
        }
      }
    }

    $gsl = ['#theme' => 'google_store_locator', '#settings' => $settings];
    return $gsl;
  }

}
