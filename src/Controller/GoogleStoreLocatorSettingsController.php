<?php

namespace Drupal\google_store_locator\Controller;

use Drupal\Core\Cache\CacheBackendInterface;
use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\Entity\EntityTypeBundleInfoInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Extension\ModuleHandlerInterface;
use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\google_store_locator\Util;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Returns responses for Google Store Locator module routes.
 */
class GoogleStoreLocatorSettingsController extends ConfigFormBase {

  /**
   * The module handler service.
   *
   * @var \Drupal\Core\Extension\ModuleHandlerInterface
   */
  protected $moduleHandler;

  /**
   * The entity type manager.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  /**
   * The entity type bundle info service.
   *
   * @var \Drupal\Core\Entity\EntityTypeBundleInfoInterface
   */
  protected $entityTypeBundleInfo;

  /**
   * A cache backend interface.
   *
   * @var \Drupal\Core\Cache\CacheBackendInterface
   */
  protected $cache;

  /**
   * Constructs a settings controller.
   *
   * @param \Drupal\Core\Config\ConfigFactoryInterface $config_factory
   *   The factory for configuration objects.
   * @param \Drupal\Core\Extension\ModuleHandlerInterface $module_handler
   *   The module handler.
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager.
   * @param \Drupal\Core\Entity\EntityTypeBundleInfoInterface $entity_type_bundle_info
   *   The entity type bundle info service.
   * @param \Drupal\Core\Cache\CacheBackendInterface $cache_backend
   *   The cache backend interface.
   */
  public function __construct(ConfigFactoryInterface $config_factory, ModuleHandlerInterface $module_handler, EntityTypeManagerInterface $entity_type_manager, EntityTypeBundleInfoInterface $entity_type_bundle_info, CacheBackendInterface $cache_backend) {
    parent::__construct($config_factory);
    $this->moduleHandler = $module_handler;
    $this->entityTypeManager = $entity_type_manager;
    $this->entityTypeBundleInfo = $entity_type_bundle_info;
    $this->cache = $cache_backend;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('config.factory'),
      $container->get('module_handler'),
      $container->get('entity_type.manager'),
      $container->get('entity_type.bundle.info'),
      $container->get('cache.default')
    );
  }

  /**
   * Get a value from the retrieved form settings array.
   */
  public function getFormSettingsValue($form_settings, $form_id) {
    // If there are settings in the array and the form ID already has a setting,
    // return the saved setting for the form ID.
    if (!empty($form_settings) && isset($form_settings[$form_id])) {
      return $form_settings[$form_id];
    }
    // Default to false.
    return 0;
  }

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return ['google_store_locator.settings'];
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'gsl_settings_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $form['configuration'] = [
      '#type' => 'fieldset',
      '#title' => $this->t('Google Store Locator Administrator Settings'),
    ];

    $gslSettings = $this->config('google_store_locator.settings');

    $form['configuration']['google_api_key'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Google Maps API key'),
      '#description' => $this->t(
        'Google Maps requires an API key to ensure you can use all features. @link.',
        [
          '@link' => \Drupal\Core\Link::fromTextAndUrl(
            'Get API key',
            \Drupal\Core\Url::fromUri(
              'https://developers.google.com/maps/documentation/javascript/get-api-key?hl=en'
            )
          )->toString(),
        ]
      ),
      '#default_value' => $gslSettings->get('google_api_key'),
      '#size' => 50,
      '#required' => TRUE,
    ];
    $form['configuration'] += Util::create()->getSettingsFormStructure($gslSettings->getRawData());

    $form['configuration']['max_zoom'] = [
      '#type' => 'number',
      '#min' => 0,
      '#max' => 21,
      '#title' => $this->t('Maximum zoom level'),
      '#default_value' => $gslSettings->get('max_zoom'),
      '#size' => 5,
      '#description' => $this->t(
        'Enter a value from 0-21 with 0 being the farthest distance from the earth. This will be the closest a user can zoom in.'
      ),
      '#required' => TRUE,
    ];
    $form['configuration']['display_search_marker'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Display "You are Here" marker on the map?'),
      '#default_value' => $gslSettings->get('display_search_marker'),
    ];

    // Add distance functionality to the module.
    $form['configuration']['proximity'] = [
      '#type' => 'details',
      '#title' => $this->t('Proximity settings'),
      '#open' => FALSE,
    ];

    $form['configuration']['proximity']['proximity_enabled'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Display proximity in google search.'),
      '#default_value' => $gslSettings->get('proximity_enabled'),
    ];

    // Allow the user to choose whether or not KM or MI are used.
    $form['configuration']['proximity']['proximity_metric'] = [
      '#type' => 'select',
      '#title' => $this->t('Metric'),
      '#options' => [
        'km' => $this->t('Kilometres'),
        'mi' => $this->t('Miles'),
      ],
      '#default_value' => $gslSettings->get('proximity_metric'),
      '#description' => $this->t(
        'Determines whether distance is measured and displayed in MI or KM.'
      ),
      '#states' => [
        'visible' => [
          ':input[name="proximity_enabled"],:input[name~="[proximity_enabled]"]' => ['checked' => TRUE],
        ],
      ],
    ];

    // Store the keys we want to save in configuration when form is submitted.
    $keys_to_save = array_keys($form['configuration']);
    $keys_to_save = array_combine($keys_to_save, $keys_to_save);
    unset($keys_to_save['web_link_custom_target']);
    foreach ($keys_to_save as $key => $key_to_save) {
      if (strpos($key_to_save, '#') !== FALSE) {
        unset($keys_to_save[$key]);
      }
    }
    $form_state->setStorage(['keys' => $keys_to_save]);

    // For now, manually add submit button. Hopefully, by the time D8 is
    // released, there will be something like system_settings_form() in D7.
    $form['actions']['#type'] = 'container';
    $form['actions']['submit'] = [
      '#type' => 'submit',
      '#value' => $this->t('Save configuration'),
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $config = $this->config('google_store_locator.settings');
    $storage = $form_state->getStorage();

    // Set link target property.
    if ($form_state->getValue('web_link_target') == 'custom') {
      $form_state->setValue('web_link_target', $form_state->getValue('web_link_custom_target'));
    }

    // Save all the GSL configuration items from $form_state.
    foreach ($form_state->getValues() as $key => $value) {
      if (in_array($key, $storage['keys'])) {
        $config->set($key, $value);
      }
    }

    $config->save();

    // Tell the user the settings have been saved.
    \Drupal::messenger()->addMessage($this->t('The configuration options have been saved.'));
  }

}
