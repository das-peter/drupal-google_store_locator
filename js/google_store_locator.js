;(function($) {
  // module global namespace
  Drupal.GSL = {};

/**
 * @extends storeLocator.StaticDataFeed
 * @constructor
 */
  Drupal.GSL.dataSource = function () {
  $.extend(this, new storeLocator.StaticDataFeed);

  var that = this;

  $.getJSON(Drupal.settings.gsl['google-store-locator-map-container']['datapath'], function(json) {

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
  google.maps.event.addDomListener(window, 'load', function() {
    var canvas = $('#google-store-locator-map-container .google-store-locator-map');
    if(canvas.length) {
      var map = new google.maps.Map(canvas.get(0), {
        //Default center on North America.
        center: new google.maps.LatLng(Drupal.settings.gsl['google-store-locator-map-container']['maplat'],
          Drupal.settings.gsl['google-store-locator-map-container']['maplong']),
        zoom: Drupal.settings.gsl['google-store-locator-map-container']['mapzoom'],
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });
      alert(Drupal.settings.gsl['google-store-locator-map-container']['maplat']);

      var panelDiv = ($('#google-store-locator-map-container .google-store-locator-panel').get(0));

      var data = new Drupal.GSL.dataSource;

      var view = new storeLocator.View(map, data, {
        geolocation: false
      });

      new storeLocator.Panel(panelDiv, {
        view: view
      });
    }
  });
})(jQuery);
