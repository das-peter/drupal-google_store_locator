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

  $.getJSON(Drupal.settings.gsl['datapath'], function(json) {

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

    //build all our stores
    for (var i=0; i < json.features.length; i++){

      var prefix = json.features[i];
      var Xcoord = prefix.geometry.coordinates[0];
      var Ycoord = prefix.geometry.coordinates[1];
      var street_add = prefix.properties.gsl_addressfield_rendered;
      var city = prefix.properties.gsl_addressfield_1_rendered;
      var state = prefix.properties.gsl_addressfield_2_rendered;
      var zip_code = prefix.properties.gsl_addressfield_3_rendered;
      var store_id = prefix.properties.nid_rendered;
      var store_name = prefix.properties.title_rendered;

      var position = new google.maps.LatLng(Ycoord, Xcoord);
      var locality = [city, state, zip_code];
      var address = [street_add, locality.join(', ')];

      //create an empty FeatureSet since features are required by storeLocator.Store()
      var features = new storeLocator.FeatureSet;

      //create our new store
      var store = new storeLocator.Store(store_id, position, features,  {
          title: store_name,
          address: address.join('<br>')
        });

      stores.push(store);
    }

    return stores;
};


  /**
   * Create map on window load
   */
  google.maps.event.addDomListener(window, 'load', function() {
    var map = new google.maps.Map(document.getElementById('map-canvas'), {
      //Default center on North America.
      center: new google.maps.LatLng(Drupal.settings.gsl['maplong'],
        Drupal.settings.gsl['maplat']),
      zoom: Drupal.settings.gsl['mapzoom'],
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var panelDiv = document.getElementById('panel');

    var data = new Drupal.GSL.dataSource;

    var view = new storeLocator.View(map, data, {
      geolocation: false,
    });

    new storeLocator.Panel(panelDiv, {
      view: view
    });
  });

})(jQuery);
