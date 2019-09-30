<?php
namespace Drupal\google_store_locator\Routing;

use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\Routing\Route;

/**
 * Defines dynamic routes.
 */
class Routes implements ContainerInjectionInterface {

  /**
   * The config factory.
   *
   * @var \Drupal\Core\Config\ConfigFactoryInterface
   */
  protected $configFactory;

  /**
   * Constructs a settings controller.
   *
   * @param \Drupal\Core\Config\ConfigFactoryInterface $config_factory
   *   The factory for configuration objects.
   */
  public function __construct(ConfigFactoryInterface $config_factory) {
    $this->configFactory = $config_factory;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('config.factory')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function routes() {
    $routes = [];
    // Check if dedicated store locator page is enabled.
    if ($display_path = $this->configFactory->get('google_store_locator.settings')->get('display_path')) {
      // Returns an array of Route objects.
      $routes['google_store_locator.display'] = new Route(
        // Path to attach this route to:
        $display_path,
        // Route defaults:
        [
          '_controller' => '\Drupal\google_store_locator\Controller\GoogleStoreLocatorPage::index',
          '_title' => $this->configFactory->get('google_store_locator.settings')->get('title')
        ],
        [
          '_permission'  => 'access content',
        ]
      );
    }
    return $routes;
  }

}
