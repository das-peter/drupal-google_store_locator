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
    //
    $.get(Drupal.settings.gsl['datapath'], function(data) {
      that.setStores(that.parse_(data));
    });
  }

  /**
   * @return {!storeLocator.FeatureSet}
   */

  Drupal.GSL.dataSource.prototype.getFeatures = function() {
    return this.FEATURES_;
  };

  /**
   * @private
   * @param {string} csv
   * @return {!Array.<!storeLocator.Store>}
   */
  Drupal.GSL.dataSource.prototype.parse_ = function(csv) {
    var stores = [];
    var rows = csv.split('\n');
    var headings = this.parseRow_(rows[0]);

    for (var i = 1, row; row = rows[i]; i++) {
      row = this.toObject_(headings, this.parseRow_(row));

      var position = new google.maps.LatLng(row.Ycoord, row.Xcoord);
      var features = new storeLocator.FeatureSet;
      var locality = this.join_([row.City, row.State, row.Zip_code], ', ');

      var store = new storeLocator.Store(row.uuid, position, features,  {
        title: row.Store_name,
        address: this.join_([row.Street_add, locality], '<br>')
      });
      stores.push(store);
    }
    return stores;
  };

  /**
   * Joins elements of an array that are non-empty and non-null.
   * @private
   * @param {!Array} arr array of elements to join.
   * @param {string} sep the separator.
   * @return {string}
   */
  Drupal.GSL.dataSource.prototype.join_ = function(arr, sep) {
    var parts = [];
    for (var i = 0, ii = arr.length; i < ii; i++) {
      arr[i] && parts.push(arr[i]);
    }
    return parts.join(sep);
  };

  /**
   * Very rudimentary CSV parsing - we know how this particular CSV is formatted.
   * IMPORTANT: Don't use this for general CSV parsing!
   * @private
   * @param {string} row
   * @return {Array.<string>}
   */
  Drupal.GSL.dataSource.prototype.parseRow_ = function(row) {
    // Strip leading quote.
    if (row.charAt(0) == '"') {
      row = row.substring(1);
    }
    // Strip trailing quote. There seems to be a character between the last quote
    // and the line ending, hence 2 instead of 1.
    if (row.charAt(row.length - 2) == '"') {
      row = row.substring(0, row.length - 2);
    }

    row = row.split('","');

    return row;
  };

  /**
   * Creates an object mapping headings to row elements.
   * @private
   * @param {Array.<string>} headings
   * @param {Array.<string>} row
   * @return {Object}
   */
  Drupal.GSL.dataSource.prototype.toObject_ = function(headings, row) {
    var result = {};
    for (var i = 0, ii = row.length; i < ii; i++) {
      result[headings[i]] = row[i];
    }
    return result;
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
      features: data.getFeatures()
    });

    new storeLocator.Panel(panelDiv, {
      view: view
    });
  });

})(jQuery);
