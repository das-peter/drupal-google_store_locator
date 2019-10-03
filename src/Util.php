<?php

namespace Drupal\google_store_locator;

use Drupal\Component\Utility\Html;
use Drupal\Core\Config\Config;
use Drupal\Core\StringTranslation\StringTranslationTrait;

class Util {

  use StringTranslationTrait;

  /**
   * Constructs a \Drupal\google_store_locator\Util object.
   */
  public function __construct() {
  }

  public static function create() {
    return new static();
  }

  /**
   * @return \Drupal\Core\Config\Config|\Drupal\Core\Config\ImmutableConfig
   */
  public static function getGlobalSettings() {
    /** @var \Drupal\Core\Config\ConfigFactory $config */
    $config = \Drupal::service('config.factory');
    /** @var \Drupal\Core\Config\Config|\Drupal\Core\Config\ImmutableConfig $gslSettings */
    return $config->get('google_store_locator.settings');
  }

  /**
   * @param \Drupal\Core\Config\Config $config
   *
   * @return array
   * @throws \Drupal\Core\Entity\EntityMalformedException
   */
  public static function getDefaultSettings(Config $config) {
    $settings = [
      'datapath' => \Drupal\Core\Url::fromUri($config->get('json_path'))
        ->toString(),
      'dataCacheEnabled' => (bool) $config->get('data_cache_enabled'),
      'mapzoom' => intval($config->get('map_zoom')),
      'mapcluster' => intval($config->get('map_cluster')),
      'mapclusterzoom' => intval($config->get('map_cluster_zoom')),
      'mapclustergrid' => intval($config->get('map_cluster_grid')),
      'mapclusterimagepath' => Html::escape(
        $config->get('map_cluster_image_path')
      ),
      'map_style' => json_decode($config->get('map_style')),
      'viewportManage' => (bool) $config->get('viewport_manage'),
      'viewportMarkerLimit' => intval($config->get('viewport_marker_limit')),
      'maplong' => (float) $config->get('map_long'),
      'maplat' => (float) $config->get('map_lat'),
      'search_label' => (string) $config->get('search_label'),
      'search_placeholder' => (string) $config->get('search_placeholder'),
      'no_results' => (string) $config->get('noresults'),
      'no_results_in_view' => (string) $config->get('noresults_in_view'),
      'loc_search_zoom' => (int) $config->get('loc_search_zoom'),
      'link_target' => (string) $config->get('link_target'),
    ];

    if (!empty($config->get('items_per_panel'))) {
      $settings['items_per_panel'] = $config->get('items_per_panel');
    }

    if (!empty($config->get('marker_path'))) {
      $settings['marker_url'] = file_create_url($config->get('marker_path'));
    }

    if (!empty($config->get('feature_list'))) {
      $settings['feature_list'] = $config->get('feature_list');
    }

    if (!empty($config->get('loc_aware'))) {
      $settings['loc_aware_zoom'] = (int) $config->get('loc_aware_zoom');
    }

    $marker_icon_fid = $config->get('marker_icon');
    if (!empty($marker_icon_fid)) {
      $marker_file = \Drupal\file\Entity\File::load($marker_icon_fid);
      $settings['marker_path'] = $marker_file->toUrl();
    }

    return $settings;
  }

  /**
   * @param array $settings
   *
   * @return array
   */
  public function getSettingsFormStructure(array $settings) {
    $form['title'] = [
      '#type' => 'textfield',
      '#title' => $this->t('What should the title be?'),
      '#description' => $this->t('The title for your locator'),
      '#default_value' => $settings['title'],
      '#size' => 30,
    ];

    $form['search_label'] = [
      '#type' => 'textfield',
      '#title' => $this->t('What should the search label say?'),
      '#description' => $this->t('The label shown above the search input box.'),
      '#default_value' => $settings['search_label'],
      '#size' => 30,
    ];

    $form['search_placeholder'] = [
      '#type' => 'textfield',
      '#title' => $this->t('What should the search box placeholder say?'),
      '#description' => $this->t(
        'The placeholder shown inside the search input box.'
      ),
      '#default_value' => $settings['search_placeholder'],
      '#size' => 30,
    ];

    $form['noresults_in_view'] = [
      '#type' => 'textfield',
      '#title' => $this->t(
        'What should be displayed if no stores are found after searching a location?'
      ),
      '#description' => $this->t(
        'The message displayed if no stores are found after searching.'
      ),
      '#default_value' => $settings['noresults_in_view'],
      '#size' => 70,
    ];

    $form['noresults'] = [
      '#type' => 'textfield',
      '#title' => $this->t(
        'What should be displayed if no stores are available?'
      ),
      '#description' => $this->t(
        'The message displayed if no stores are available or when loading the data failed.'
      ),
      '#default_value' => $settings['noresults'],
      '#size' => 70,
    ];

    $gsl_web_link_target = Html::escape($settings['web_link_target']);

    $gsl_web_link_target_select_options = [
      '' => $this->t('Not defined'),
      '_blank' => $this->t('New Window - new browsing context'),
      '_self' => $this->t('Current browsing context'),
      '_parent' => $this->t('Parent browsing context'),
      '_top' => $this->t('Top browsing context'),
      'custom' => $this->t('Custom'),
    ];
    $gsl_web_link_target_select_option = (!isset($gsl_web_link_target_select_options[$gsl_web_link_target])) ? 'custom' : $gsl_web_link_target;
    $form['web_link_target'] = [
      '#type' => 'select',
      '#title' => $this->t('Target to open result links'),
      '#options' => $gsl_web_link_target_select_options,
      '#default_value' => $gsl_web_link_target_select_option,
    ];
    $form['web_link_custom_target'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Define the custom target to open links'),
      '#default_value' => $gsl_web_link_target,
      '#states' => [
        'visible' => [
          ':input[name="web_link_target"],:input[name$="[web_link_target]"]' => ['value' => 'custom'],
        ],
      ],
    ];
    $form['items_per_panel'] = [
      '#type' => 'number',
      '#min' => 1,
      '#title' => $this->t('How many stores should show in the panel?'),
      '#description' => $this->t(
        'The panel shows the X closest locations where X is the value entered above.'
      ),
      '#default_value' => $settings['items_per_panel'],
      '#size' => 5,
      '#required' => TRUE,
    ];

    $form['map_lat'] = [
      '#type' => 'number',
      '#min' => -90,
      '#max' => 90,
      '#title' => $this->t('Default Map center point (Latitude)'),
      '#default_value' => $settings['map_lat'],
      '#size' => 5,
      '#required' => TRUE,
    ];

    $form['map_long'] = [
      '#type' => 'number',
      '#min' => -180,
      '#max' => 180,
      '#title' => $this->t('Default Map center point (Longitude)'),
      '#default_value' => $settings['map_long'],
      '#size' => 5,
      '#required' => TRUE,
    ];

    $form['map_zoom'] = [
      '#type' => 'number',
      '#min' => 0,
      '#max' => 21,
      '#title' => $this->t('Default zoom level'),
      '#default_value' => $settings['map_zoom'],
      '#size' => 5,
      '#description' => $this->t(
        'Enter a value from 0-21 with 0 being the farthest distance from the earth'
      ),
      '#required' => TRUE,
    ];

    $form['loc_search_zoom'] = [
      '#type' => 'float',
      '#title' => $this->t('Location search zoom level'),
      '#default_value' => $settings['loc_search_zoom'],
      '#size' => 5,
      '#description' => $this->t(
        'The zoom level to use when a user enters a location into the panel\'s search box. Enter a value from 0-21 with 0 being the farthest distance from the earth'
      ),
    ];

    if (\Drupal::moduleHandler()->moduleExists('file')) {
      $form['marker_icon'] = [
        '#title' => $this->t('Marker Icon'),
        '#type' => 'managed_file',
        '#description' => $this->t(
          'The uploaded image will be displayed as the store location icon in the map.'
        ),
        '#default_value' => $settings['marker_icon'],
        '#upload_location' => 'public://gsl_marker_icon/',
      ];
    }
    else {
      $form['marker_icon'] = [
        '#markup' => '<h6>' . $this->t(
            'To enable the custom marker icon feature please install the file module'
          ) . '</h6>',
      ];
    }

    // We put all advanced features into a details.
    $form['advanced'] = [
      '#type' => 'details',
      '#title' => $this->t('Advanced settings'),
      '#open' => FALSE,
    ];

    $form['advanced']['json_path'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Path to Store Location data'),
      '#description' => $this->t(
        "Warning: by default this points to the Location Export View which provides the Store data in the proper JSON format. Do not change this path unless you're sure it points to a properly formatted source."
      ),
      '#default_value' => $settings['json_path'],
      '#required' => TRUE,
    ];

    $form['advanced']['data_cache_enabled'] = [
      '#type' => 'checkbox',
      '#title' => $this->t(
        'Enable client-side caching for the store data response'
      ),
      '#description' => $this->t(
        'If enabled, the response from the path above is cached on the client side per request url. The caching is per url to support marker management urls in the form of "data-path/{latitude}/{longitude}". Only the last 3 responses will be cached.'
      ),
      '#default_value' => $settings['data_cache_enabled'],
    ];

    $form['advanced']['display_path'] = [
      '#type' => 'textfield',
      '#title' => $this->t('What is the desired path for the store locator?'),
      '#default_value' => $settings['display_path'],
      '#description' => $this->t(
        'By default it will be served from /store-locator. Leave empty to disable dedicated page.'
      ),
    ];

    $form['advanced']['loc_aware'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Enable Map with Location Awareness'),
      '#description' => $this->t(
        'This allows users to share their location via the browser, and then center the map view on that location'
      ),
      '#default_value' => $settings['loc_aware'],
    ];

    $form['advanced']['loc_aware_zoom'] = [
      '#type' => 'number',
      '#min' => 0,
      '#max' => 21,
      '#title' => $this->t('Set Location Awareness Zoom Level'),
      '#description' => $this->t(
        'Enter a value from 0-21 with 0 being the farthest distance from the earth'
      ),
      '#size' => 5,
      '#default_value' => $settings['loc_aware_zoom'],
      '#states' => [
        'visible' => [
          ':input[name="loc_aware"],:input[name$="[loc_aware]"]' => ['checked' => TRUE],
        ],
        'required' => [
          ':input[name="loc_aware"],:input[name$="[loc_aware]"]' => ['checked' => TRUE],
        ],
      ],
    ];

    $form['advanced']['lang_aware'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Enable language awareness for the map controls'),
      '#description' => $this->t(
        'If your site is multilingual (or use a language other than English as primary language) this will pass on the user\'s active language setting when requesting the map from google, translating various map controls.'
      ),
      '#default_value' => $settings['lang_aware'],
    ];

    $form['advanced']['map_cluster'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Enable marker clustering'),
      '#default_value' => $settings['map_cluster'],
      '#description' => $this->t(
        "WARNING: Using this option alone won't necessarily improve performance when viewing >1k markers. To improve performance use this in conjunction with Viewport Marker Management. (see the README.txt)"
      ),
    ];

    $form['advanced']['map_cluster_grid'] = [
      '#type' => 'number',
      '#title' => $this->t('Cluster Grid size'),
      '#description' => $this->t('The grid size of a cluster in pixels.'),
      '#size' => 5,
      '#default_value' => $settings['map_cluster_grid'],
      '#states' => [
        'visible' => [
          ':input[name="map_cluster"],:input[name$="[map_cluster]"]' => ['checked' => TRUE],
        ],
        'required' => [
          ':input[name="map_cluster"],:input[name$="[map_cluster]"]' => ['checked' => TRUE],
        ],
      ],
    ];

    $form['advanced']['cluster_zoom_limit'] = [
      '#type' => 'number',
      '#min' => 0,
      '#max' => 21,
      '#title' => $this->t('Cluster Zoom limit'),
      '#description' => $this->t(
          'The zoom level at which clusters are no longer displayed.'
        ) . '<br />' .
        $this->t(
          'Enter a value from 0-21 with 0 being the farthest distance from the earth'
        ),
      '#size' => 5,
      '#default_value' => $settings['cluster_zoom_limit'],
      '#states' => [
        'visible' => [
          ':input[name="map_cluster"],:input[name$="[map_cluster]"]' => ['checked' => TRUE],
        ],
        'required' => [
          ':input[name="map_cluster"],:input[name$="[map_cluster]"]' => ['checked' => TRUE],
        ],
      ],
    ];

    $form['advanced']['cluster_image_path'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Path the the cluster images'),
      '#description' => $this->t('Path to the cluster images ([1-5].png)'),
      '#default_value' => $settings['cluster_image_path'],
      '#states' => [
        'visible' => [
          ':input[name="map_cluster"],:input[name$="[map_cluster]"]' => ['checked' => TRUE],
        ],
        'required' => [
          ':input[name="map_cluster"],:input[name$="[map_cluster]"]' => ['checked' => TRUE],
        ],
      ],
    ];

    // Create the Viewport marker management element
    $form['advanced']['viewport'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Enable Viewport Marker Management'),
      '#default_value' => $settings['viewport'],
      '#description' => $this->t(
        "Recommended for performance if number of stores is >1k"
      ),
    ];

    // If not all dependencies are met then disable.
    $contextual_module_enabled = \Drupal::moduleHandler()->moduleExists(
      'contextual_range_filter'
    );
    if (!$contextual_module_enabled) {
      $form['advanced']['viewport']['#value'] = FALSE;
      $form['advanced']['viewport']['#disabled'] = TRUE;
      $form['advanced']['viewport']['#description'] = $this->t(
        'Must download and enable Views Contextual Range Filter module. see @reports',
        [
          '@reports' => \Drupal\Core\Link::fromTextAndUrl(
            t('reports'),
            \Drupal\Core\Url::fromRoute('system.status')
          )->toString(),
        ]
      );
    }

    // If marker management is enabled then we need to capture zoom limit.
    $form['advanced']['marker_zoom_limit'] = [
      '#type' => 'number',
      '#min' => 0,
      '#max' => 21,
      '#title' => $this->t('Marker Zoom limit'),
      '#description' => $this->t(
          'The zoom level at which to start displaying markers. For example, if set to 5, the map must be zoomed to greater than 5 for stores to be loaded. Set to 0 to always load stores.'
        ) . '<br />' .
        $this->t(
          'Enter a value from 0-21 with 0 being the farthest distance from the earth'
        ),
      '#size' => 5,
      '#default_value' => $settings['marker_zoom_limit'],
      '#states' => [
        'visible' => [
          ':input[name="viewport"],:input[name$="[viewport]"]' => ['checked' => TRUE],
        ],
        'required' => [
          ':input[name="viewport"],:input[name$="[viewport]"]' => ['checked' => TRUE],
        ],
      ],
    ];

    // Google Map styles.
    $form['advanced']['map_style'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Google map style'),
      '#description' => $this->t(
        'Tip: Try <a href="@url">Snazzy Maps</a> for ready to use map styles.',
        ['@url' => 'https://snazzymaps.com/']
      ),
      '#default_value' => $settings['map_style'],
      '#rows' => 5,
    ];

    return $form;
  }

}
