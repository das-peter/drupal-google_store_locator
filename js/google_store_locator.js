;(function($) {
  // module global namespace
  Drupal.GSL = {};

/**
 * @extends storeLocator.StaticDataFeed
 * @constructor
 */
  Drupal.GSL.dataSource = function (datapath) {
    $.extend(this, new storeLocator.StaticDataFeed);

    var that = this;

    $.getJSON(datapath, function(json) {

      //defining our success handler, i.e. if the path we're passing to $.getJSON
      //is legit and returns a JSON file then this runs.
      var stores = that.parseStores_(json);
      that.setStores(stores);
    });
  }


/**
 * @private
 * @param {object} JSON
 * @return {!Array.<!storeLocator.Store>}
 */
  Drupal.GSL.dataSource.prototype.parseStores_ = function(json) {
    var stores = [];

    if (!('features' in json)) {
      return;
    }

    // build all our stores
    for (var i in json.features) {

      var item = json.features[i];

      if (!item) {
        continue;
      }

      // clone item properties so we can alter for features
      var itemFeatures = ('properties' in item) ? $.extend({}, item.properties) : {};

      // initialize store properties
      var storeProps = {};

      // extract coordinates
      var Xcoord = item.geometry.coordinates[0];
      var Ycoord = item.geometry.coordinates[1];

      // create a unique id
      var store_id = 'store_' + i;

      // set title to views_geojson 'name'
      if ('name' in itemFeatures) {
        storeProps.title = itemFeatures.name;
        delete itemFeatures.name;
      }
      else {
        storeProps.title = store_id;
      }

      // set address to views_geojson 'description'
      if ('description' in itemFeatures) {
        storeProps.address = itemFeatures.description;
        delete itemFeatures.description;
      }

      // set latitude and longitude
      var position = new google.maps.LatLng(Ycoord, Xcoord);

      // create an FeatureSet since features are required by storeLocator.Store()
      var storeFeatureSet = new storeLocator.FeatureSet;
      for (var prop in itemFeatures) {
        // only add rendered features
        if (prop.search(/_rendered$/i) > 0) {
          var storeFeature = new storeLocator.Feature(prop, itemFeatures[prop]);
          storeFeatureSet.add(storeFeature);
        }
      }

      // create our new store
      var store = new storeLocator.Store(store_id, position, storeFeatureSet, storeProps);

      stores.push(store);
    }

    return stores;
  };


  /**
   * Create map on window load
   */
  //google.maps.event.addDomListener(window, 'load', function() {
  Drupal.behaviors.googleStoreLocator = {
    attach: function (context, context_settings) {
      for (var mapid in Drupal.settings.gsl) {
        if (!(mapid in Drupal.settings.gsl)) {
          continue;
        }

        var $container = $('#' + mapid, context);
        if (!$container.length) {
          continue;
        }

        var $canvas = $('.google-store-locator-map', $container);
        if (!$canvas.length) {
          continue;
        }

        var $panel = $('.google-store-locator-panel', $container);
        if (!$panel.length) {
          continue;
        }

        var map_settings = Drupal.settings.gsl[mapid];
        var locator = {};

        locator.data = new Drupal.GSL.dataSource(map_settings['datapath']);
        if (!locator.data || locator.data === undefined) {
          // @todo: show empty message
          continue;
        }

        locator.elements = {
          canvas: $canvas.get(0),
          panel: $panel.get(0)
        };

        locator.map = new google.maps.Map(locator.elements.canvas, {
          //Default center on North America.
          center: new google.maps.LatLng(map_settings['maplat'], map_settings['maplong']),
          zoom: map_settings['mapzoom'],
          mapTypeId: map_settings['maptype'] || google.maps.MapTypeId.ROADMAP
        });

        locator.view = new storeLocator.View(locator.map, locator.data, {
          geolocation: false
        });


        locator.panel = new storeLocator.Panel(locator.elements.panel, {
          view: locator.view
        });

      } // /mapid loop

      locator = null;
    }
  };
  //});
})(jQuery);
