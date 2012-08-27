/**
 * @extends storeLocator.StaticDataFeed
 * @constructor
 */
function GSLdataSource() {
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

GSLdataSource.prototype.getFeatures = function() {
  return this.FEATURES_;
};

/**
 * @private
 * @param {string} csv
 * @return {!Array.<!storeLocator.Store>}
 */
GSLdataSource.prototype.parse_ = function(csv) {
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
GSLdataSource.prototype.join_ = function(arr, sep) {
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
GSLdataSource.prototype.parseRow_ = function(row) {
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
GSLdataSource.prototype.toObject_ = function(headings, row) {
  var result = {};
  for (var i = 0, ii = row.length; i < ii; i++) {
    result[headings[i]] = row[i];
  }
  return result;
};
