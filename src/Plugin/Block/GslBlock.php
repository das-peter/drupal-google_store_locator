<?php

namespace Drupal\google_store_locator\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\DependencyInjection\Container;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\google_store_locator\Util;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Provides a 'gsl_block' block.
 *
 * @Block(
 *  id = "gsl_block",
 *  admin_label = @Translation("GSL Block"),
 * )
 */
class GslBlock extends BlockBase implements ContainerFactoryPluginInterface {

  /**
   * Drupal\Core\DependencyInjection\Container  definition.
   *
   * @var \Drupal\Core\DependencyInjection\Container
   */
  protected $serviceContainer;

  /**
   * Constructs a new GSLBlock object.
   *
   * @param array $configuration
   *   A configuration array containing information about the plugin instance.
   * @param string $plugin_id
   *   The plugin_id for the plugin instance.
   * @param string $plugin_definition
   *   The plugin implementation definition.
   * @param \Drupal\Core\DependencyInjection\Container  $service_container
   *   The ContainerBuilder definition.
   */
  public function __construct(
    array $configuration,
    $plugin_id,
    $plugin_definition,
    Container  $service_container
  ) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
    $this->serviceContainer = $service_container;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->get('service_container')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration() {
    return ['customize_gsl_settings' => FALSE, 'gsl_settings' => Util::getGlobalSettings()->getRawData()] + parent::defaultConfiguration();
  }

  /**
   * {@inheritdoc}
   */
  public function blockForm($form, FormStateInterface $form_state) {
    $form['customize_gsl_settings'] = [
      '#type' => 'checkbox',
      '#title' => $this->t(
        'Customize Google Store Locator config of this block'
      ),
      '#description' => $this->t(
        'If enabled, you can adjust some of the google store locator settings. Disable this to reset to the default settings.'
      ),
      '#default_value' => !empty($this->configuration['customize_gsl_settings']),
    ];
    $form['gsl_settings'] = [
      '#type' => 'fieldset',
      '#title' => $this->t('Google Store Locator Settings'),
      '#states' => [
        'visible' => [
          ':input[name="settings[customize_gsl_settings]"]' => ['checked' => TRUE],
        ],
      ],
      '#tree' => TRUE,
    ];
    $form['gsl_settings'] += Util::create()->getSettingsFormStructure($this->configuration['gsl_settings']);
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function blockSubmit($form, FormStateInterface $form_state) {
    $this->configuration['customize_gsl_settings'] = !empty($form_state->getValue('customize_gsl_settings'));
    $this->configuration['gsl_settings'] = [];
    if (!empty($this->configuration['customize_gsl_settings'])) {
      $this->configuration['gsl_settings'] = $form_state->getValue('gsl_settings');
    }
  }

  /**
   * {@inheritdoc}
   */
  public function build() {
    $settings = [];
    if (!empty($this->configuration['customize_gsl_settings'])) {
      $settings = $this->configuration['gsl_settings'];
    }
    $gsl = ['#theme' => 'google_store_locator', '#settings' => $settings];
    return $gsl;
  }

}
