;(function ($, Drupal, window, document, undefined) {
  // module global namespace
  Drupal.GSL = Drupal.GSL || {};
  Drupal.GSL.homeMarkers = Drupal.GSL.homeMarkers || [];

  Drupal.GSL.currentMap = Drupal.GSL.currentMap || {};
  Drupal.GSL.currentCluster = Drupal.GSL.currentCluster || {};

  /**
   * Set the current map.
   */
  Drupal.GSL.setCurrentMap = function(map, mapid) {
    Drupal.GSL.currentMap = map;
    Drupal.GSL.currentMap.mapid = mapid;
  };

  /**
   * Get the current map
   */
  Drupal.GSL.getCurrentMap = function(view) {
    if (view) {
      return view.getMap();
    }

    return Drupal.GSL.currentMap || {};
  };

  /**
   * Remove a marker from the map.
   */
  Drupal.GSL.removeMarker = function(marker) {
    if (marker instanceof google.maps.Marker) {
      marker.setMap(null);
      marker.unbindAll();
    }
  };

  /**
   * Returns the most recent home marker.
   */
  Drupal.GSL.getHomeMarker = function() {
    if (Drupal.GSL.homeMarkers.length) {
      var homeMarker = Drupal.GSL.homeMarkers[Drupal.GSL.homeMarkers.length - 1]
      if (homeMarker && (homeMarker instanceof google.maps.Marker)) {
        return homeMarker;
      }
    }
    return null;
  };

  /**
   * Set the home marker.
   */
  Drupal.GSL.setHomeMarker = function(marker) {
    Drupal.GSL.removeHomeMarker();
    Drupal.GSL.homeMarkers.push(marker);
  };

  /**
   * Update the map for all of the home markers.
   */
  Drupal.GSL.updateHomeMarkerMap = function(map) {
    if (Drupal.GSL.homeMarkers.length) {
      for (var i = 0; i < Drupal.GSL.homeMarkers.length; i++) {
        Drupal.GSL.homeMarkers[i].setMap(map);
      }
    }
  };

  /**
   * Remove the home marker from the map.
   */
  Drupal.GSL.removeHomeMarker = function() {
    if (Drupal.GSL.homeMarkers.length) {
      for (var i = 0; i < Drupal.GSL.homeMarkers.length; i++) {
         Drupal.GSL.removeMarker(Drupal.GSL.homeMarkers[i]);
      }

      Drupal.GSL.homeMarkers = [];
    }
  };

  /**
   * Get the zoom level for the home marker / location search.
   */
  Drupal.GSL.getHomeMarkerZoomSetting = function(map) {
    if (Drupal.settings.gsl && Drupal.GSL.currentMap.mapid && Drupal.settings.gsl[Drupal.GSL.currentMap.mapid]) {
      var mapSettings = Drupal.settings.gsl[Drupal.GSL.currentMap.mapid];
      if (isFinite(mapSettings['loc_search_zoom'])) {
        return mapSettings['loc_search_zoom'];
      }
      else if (isFinite(mapSettings['loc_aware_zoom'])) {
        return mapSettings['loc_aware_zoom'];
      }
    }

    return undefined;
  };

  /**
   * @extends storeLocator.StaticDataFeed
   * @constructor
   */
  Drupal.GSL.dataSource = function (datapath) {
    this.parent = Drupal.GSL.dataSource.parent;
    // call the parent constructor
    this.parent.call(this);

    // initialize variables
    this._datapath = datapath;
    this._stores = [];
    this._storesCache = [];

    // The parent class calls this but sets this.firstCallback_ in it's
    // getStores() which would be minified and is now overridden by a custom
    // getStores().
    // if (this.firstCallback_) {
    //   this.firstCallback_();
    // } else {
    //   delete this.firstCallback_;
    // }
  };

  // Set parent class
  Drupal.GSL.dataSource.parent = storeLocator.StaticDataFeed;

  // Inherit parent's prototype
  Drupal.GSL.dataSource.prototype = Object.create(Drupal.GSL.dataSource.parent.prototype);

  // Correct the constructor pointer
  Drupal.GSL.dataSource.prototype.constructor = Drupal.GSL.dataSource;

  /**
   * Retrieves the parsed stores cached for a given url.
   */
  Drupal.GSL.dataSource.prototype.getStoresCache = function(url) {
    for (var i in this._storesCache) {
      if (this._storesCache[i].url == url) {
        return ('stores' in this._storesCache[i]) ? this._storesCache[i].stores : [];
      }
    }

    return [];
  };

  /**
   * Retrieves the parsed stores cached for a given url.
   */
  Drupal.GSL.dataSource.prototype.getStoresCacheIndex = function(url) {
    for (var i in this._storesCache) {
      if (this._storesCache[i].url == url) {
        return i;
      }
    }

    return -1;
  };

  /**
   * Sets the parsed stores cached for a given url.
   */
  Drupal.GSL.dataSource.prototype.setStoresCache = function(url, stores) {
    if (this._storesCache.length == 3) {
      var expiredCache = this._storesCache.shift();
    }

    this._storesCache.push({'url': url, 'stores': stores});
    return this;
  };

  /**
   * Sets the parsed stores cached for a given url.
   */
  Drupal.GSL.dataSource.prototype.clearStoresCache = function(url) {
    if (url) {
      var urlIndex = this.getStoresCacheIndex(url);
      if (urlIndex > -1) {
        this._storesCache.splice(urlIndex, 1);
      }
    }
    else {
      this._storesCache = [];
    }

    return this;
  };

  /**
   * Overrides getStores().
   */
  Drupal.GSL.dataSource.prototype.getStores = function(bounds, features, callback) {
    // Prevent race condition - if getStores is called before stores are
    // loaded.
    // Parent class does this so it might be needed here.
    // if (!this._stores.length) {
    //  var that = this;
    //  this.firstCallback_ = function() {
    //    that.getStores(bounds, features, callback);
    //  };
    //  return;
    // }

    var gslSettings = Drupal.settings.gsl[Drupal.GSL.currentMap.mapid];
    var dataCacheEnabled = gslSettings['dataCacheEnabled'];
    var markerClusterEnabled = gslSettings['mapcluster'];
    var markerClusterZoom = gslSettings['mapclusterzoom'];
    var switchToMarkerCluster = (Drupal.GSL.currentMap.getZoom() < markerClusterZoom);
    var viewportEnabled = gslSettings['viewportManage'];
    var viewportMarkerLimit = gslSettings['viewportMarkerLimit'];
    var viewportNoMarkers = (Drupal.GSL.currentMap.getZoom() < viewportMarkerLimit);

    if ((markerClusterEnabled && switchToMarkerCluster && !$.isEmptyObject(Drupal.GSL.currentCluster)) || (viewportEnabled && viewportNoMarkers)) {
      // Once cluster has been initialized we don't even need to fetch data, or
      // if Viewport is enabled, and the map zoom is less then the viewport zoom
      // limit.
      return;
    }

    if (!viewportEnabled) {
      // Viewport marker management isn't enabled. We're gonna load all the
      // stores.
      var url = this._datapath;
    }
    else {
      // Marker management is enabled. Load only some of the stores.
      var swPoint = bounds.getSouthWest();
      var nePoint = bounds.getNorthEast();

      var swLat = swPoint.lat();
      var swLng = swPoint.lng();
      var neLat = nePoint.lat();
      var neLng = nePoint.lng();
      if (swLat < neLat) {
        var latRange = swLat + '--' + neLat;
      }
      else {
        // This case is never triggered since the Google Map doesn't allow you to revolve vertically
        var latRange = swLat + '--90+-90--' + neLat;
      }
      if (swLng < neLng) {
        var lonRange = swLng + '--' + neLng;
      }
      else {
        var lonRange = swLng + '--180+-180--' + neLng;
      }

      var url = this._datapath + '/' + latRange + '/' + lonRange;
    }

    var that = this;

    var cachedStores = this.getStoresCache(url);
    if (dataCacheEnabled && cachedStores.length > 0) {
      // If cache is enabled and url in cache.
      this.processParsedStores(cachedStores, bounds, features, callback);
    }
    else {
      // Loading all stores can take a while, display a loading overlay.
      if ($("#cluster-loading").length == 0) {
        $('#' + Drupal.GSL.currentMap.mapid).append('<div id="cluster-loading" class="ajax-progress ajax-progress-throbber"><div>' + Drupal.t('Loading') + '<span class="throbber"></span></div></div>');
      }
      $.getJSON(url, function(json) {
        //defining our success handler, i.e. if the path we're passing to $.getJSON
        //is legit and returns a JSON file then this runs.

        // These will be either all stores, or those within the viewport.
        var parsedStores = that.parseStores_(json);
        that.setStoresCache(url, parsedStores);
        that.processParsedStores(parsedStores, bounds, features, callback);
        $("#cluster-loading").remove();
      });
    }
  };

  /**
   * Process parsed stores.
   */
  Drupal.GSL.dataSource.prototype.processParsedStores = function(stores, bounds, features, callback) {
    if (stores && stores.length > 0) {
      var that = this;
      var gslSettings = Drupal.settings.gsl[Drupal.GSL.currentMap.mapid];
      var markerClusterEnabled = gslSettings['mapcluster'];
      var markerClusterZoom = gslSettings['mapclusterzoom'];
      var switchToMarkerCluster = (Drupal.GSL.currentMap.getZoom() < markerClusterZoom);

      // Filter stores for features.
      var filtered_stores = [];
      for (var i = 0, store; store = stores[i]; i++) {
        if (store.hasAllFeatures(features)) {
          filtered_stores.push(store);
        }
      }

      this.sortByDistance_(bounds.getCenter(), filtered_stores);

      if (markerClusterEnabled && switchToMarkerCluster) {
        if ($.isEmptyObject(Drupal.GSL.currentCluster)) {
          Drupal.GSL.initializeCluster(filtered_stores, that);
        }
      }

      // The callback sets the stores on the main object.
      callback(filtered_stores);
    }
  };

  /**
   * Overridden: Sorts a list of given stores by distance from a point in ascending order.
   * Directly manipulates the given array (has side effects).
   * @private
   * @param {google.maps.LatLng} latLng the point to sort from.
   * @param {!Array.<!storeLocator.Store>} stores  the stores to sort.
   */
  Drupal.GSL.dataSource.prototype.sortByDistance_ = function(latLng,
                                                             stores) {
    stores.sort(function(a, b) {
      return a.distanceTo(latLng) - b.distanceTo(latLng);
    });
  };

  /**
   * Overridden: Set the stores for this data feed.
   * @param {!Array.<!storeLocator.Store>} stores the stores for this data feed.
   *
   * - Sets _stores since storeLocator variable is minified
   */
  Drupal.GSL.dataSource.prototype.setStores = function(stores) {
    this._stores = stores;
    this.parent.prototype.setStores.apply(this, arguments);
  };

  /**
   * Parse data feed
   * @param {object} JSON
   * @return {!Array.<!storeLocator.Store>}
   */
  Drupal.GSL.dataSource.prototype.parseStores_ = function(json) {
    var stores = [];
    if (!('features' in json)) {
      return stores;
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
      var store_id = '';

      if (itemFeatures.uniqueid) {
        // Allow the response to provide an id.
        store_id = itemFeatures.uniqueid;
      }
      else if (itemFeatures.nid) {
        // Legacy support: nid field name.
        store_id = itemFeatures.nid;
      }
      else if (itemFeatures.Nid) {
        // Legacy support: Nid Label.
        store_id = itemFeatures.Nid;
      }
      else {
        store_id = this.uniqueStoreId();
      }

      // Prepend store to ensure it's a valid id name.
      store_id = 'store-' + store_id;

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

      // create a FeatureSet since features are required by storeLocator.Store()
      var storeFeatureSet = new storeLocator.FeatureSet;
      for (var prop in itemFeatures) {
        // only add rendered features
        if (prop.search(/_rendered$/i) > 0 && itemFeatures[prop]) {
          switch(prop) {
            case "gsl_feature_filter_list_rendered":
              // It's a non-empty feature filter list. We need to create an id and
              // display name for it. It will be coming in as a comma separated
              // string.
              var list = itemFeatures[prop].split(',');
              for(var j = 0; j < list.length; j++) {
                // Go through each feature and add it.
                var label = list[j].trim();
                // Generate the id from the label by getting rid of all the
                // whitespace in it.
                var id = label.replace(/\s/g,'');
                var storeFeature = new storeLocator.Feature(id, label);
                storeFeatureSet.add(storeFeature);
              }
              break;

            case "gsl_props_misc_rendered":
              storeProps.misc = itemFeatures.gsl_props_misc_rendered;
              break;

            case "gsl_props_phone_rendered":
              storeProps.phone = itemFeatures.gsl_props_phone_rendered;
              break;

            case "gsl_props_web_rendered":
              var url = itemFeatures.gsl_props_web_rendered.split(',');
              storeProps.web = '<a href="' + url[1] + '">' + url[0] + '</a>';
              break;

          }
        }
      }
      // create our new store
      var store = new storeLocator.Store(store_id, position, storeFeatureSet, storeProps);
      stores.push(store);
    }

    return stores;
  };

  /**
   * Generate a unique id for a store.
   * @ref: http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
   */
  Drupal.GSL.dataSource.prototype.uniqueStoreId = function(store) {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
                 .toString(16)
                 .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  };

  /**
   * @extends storeLocator.Panel
   * @constructor
   */
  Drupal.GSL.Panel = function (el, opt_options) {
    this.parent = Drupal.GSL.Panel.parent;
    this.panelElement = el;

    // set items per panel
    if (opt_options['items_per_panel'] && !isNaN(opt_options['items_per_panel'])) {
      this.set('items_per_panel', opt_options['items_per_panel']);
    }
    else {
      // use default items per panel
      this.set('items_per_panel', Drupal.GSL.Panel.ITEMS_PER_PANEL_DEFAULT);
    }

    // call the parent constructor (in compiled format)
    this.parent.call(this, el, opt_options);

    // ensure this variable is set
    this.storeList_ = $('.store-list', el);
  };

  // Set parent class
  Drupal.GSL.Panel.parent = storeLocator.Panel;

  // Extend object.
  Drupal.GSL.Panel.prototype = Object.create(Drupal.GSL.Panel.parent.prototype);

  // Correct the constructor pointer.
  Drupal.GSL.Panel.prototype.constructor = Drupal.GSL.Panel;

  Drupal.GSL.Panel.ITEMS_PER_PANEL_DEFAULT = 10;

  /**
   * Overridden storeLocator.Panel.prototype.stores_changed
   */
  Drupal.GSL.Panel.prototype.stores_changed = function() {
    if (!this.get('stores')) {
      return;
    }

    var view = this.get('view');
    var bounds = view && view.getMap().getBounds();

    var that = this;
    var stores = this.get('stores');
    var selectedStore = this.get('selectedStore');
    this.storeList_.empty();

    if (!stores.length) {
      this.storeList_.append('<li class="no-stores">' + Drupal.t('There are no stores in this area.') + '</li>');
    } else if (bounds && !bounds.contains(stores[0].getLocation())) {
      this.storeList_.append('<li class="no-stores">' + Drupal.t('There are no stores in this area. However, stores closest to you are listed below.') + '</li>');
    }

    var clickHandler = function() {
      view.highlight(this['store'], true);
    };

    // Add stores to list
    var items_per_panel = this.get('items_per_panel');
    // Initialize the map value in order to get proximity
    var map = view.getMap() || Drupal.GSL.currentMap;

    // Set proximity variables.
    var metricText, proximityMultiplier;
    var proximityEnabled = Drupal.settings.gsl.proximity;
    if (proximityEnabled) {
      // Determine if the user wants values converted to MI or KM.
      // As the base value is in KM, apply a multiplier for KM to MI if desired.
      if (Drupal.settings.gsl.metric == 'mi'){
        proximityMultiplier = .621371;
        metricText = 'miles';
      }
      else{
        proximityMultiplier = 1;
        metricText = 'km';
      }
    }

    // Updates the home marker every single time there is a refresh.
    that.updateHomeMarker();

    // Set before stores loop so it can be used for distance calculations.
    // Use home marker if exists and is on a map, else
    var originLatLng = null;
    var homeMarker = Drupal.GSL.getHomeMarker();
    if (homeMarker) {
      originLatLng = homeMarker.getPosition();
    }
    else {
      originLatLng = map.getCenter();
    }

    // loop through all store values
    for (var i = 0, ii = Math.min(items_per_panel, stores.length); i < ii; i++) {
      // Get store data
      var storeLi = stores[i].getInfoPanelItem();

     // Check if proximity was desired, and if so render it.
      if (proximityEnabled) {
        // Calculate distance to the store

        var storeDistance = Number((stores[i].distanceTo(originLatLng) * proximityMultiplier).toFixed(2));

        // add distance to HTML
        if ($('.distance', storeLi).length > 0) {
          //if distance field already there, change text.
          $('.distance', storeLi).text(storeDistance + ' miles');
        }
        else {
          // No distance field yet! APPEND full HTML!
          $('.address', storeLi).append('<div class="distance">' + storeDistance + ' ' + metricText + '</div>');
        }
      }

      storeLi['store'] = stores[i];
      if (selectedStore && stores[i].getId() == selectedStore.getId()) {
        $(storeLi).addClass('highlighted');
      }

      if (!storeLi.clickHandler_) {
        storeLi.clickHandler_ = google.maps.event.addDomListener(
          storeLi, 'click', clickHandler);
      }

      that.storeList_.append(storeLi);
    }
  };

  /**
   * Overridden storeLocator.Panel.prototype.selectedStore_changed
   */
  Drupal.GSL.Panel.prototype.selectedStore_changed = function() {
    // Call the parent method in the context of this object using 'this'.
    this.parent.prototype.selectedStore_changed.apply(this, arguments);

    // Remember that this method runs on the initial map build. Then it runs
    // again when you select a store in the panel. We only care about the latter
    // event for disabling the Street View link.

    // We use store to determine if it's the initial map build or the 'select a
    // store' in the panel event. We only care about the event.
    var store = this.get('selectedStore');
    if (store) {
      // At this point all the links are added to the selected store. We should
      // first check that the Street View imagery exists: if no then disable the
      // link.

      // Create a StreetViewService object that we use to check if the Street
      // View imagery associated with the selected store is available.
      var sv = new google.maps.StreetViewService();
      // We're gonna limit the search for imagery to 50 meters.
      sv.getPanoramaByLocation(store.getLocation(),  50, function(data, status) {
        if (status != google.maps.StreetViewStatus.OK) {

          $("a[class='action streetview']").after($('<span>').attr({
            'class': 'action streetview',
            'style': 'color:#C9C9C9'
          }).html($("a[class='action streetview']").text()));

          $("a[class='action streetview']").remove();
        }
      });
    }
  };

  /**
   * Overridden storeLocator.Panel.prototype.view_changed.
   */
  Drupal.GSL.Panel.prototype.view_changed = function() {
    var that = this;
    this.parent.prototype.view_changed.apply(this, arguments);
    var view = this.get('view');
    var map = view.getMap();

    // Remove zoom listener to fix bug that causes the map to center on the
    // selected store after zooming.
    google.maps.event.clearListeners(map, 'zoom_changed');

    this.zoomListener_ = google.maps.event.addListener(map, 'zoom_changed', function() {
      that.stores_changed();
    });
  }

 /**
  * Semi hacky method of placing a marker for the users location.
  * This fires everytime the map is updated.
  *
  * The correct method apparantly involves line 490 of panel.js and
  * adding an event listener. I was unable to abstract how to make it work
  * in that fashion.
  *
  * @return boolean
  *   Returns true if marker was updated.
  */
  Drupal.GSL.Panel.prototype.updateHomeMarker = function() {
    // Search for location input in the this panel.
    var $locationInput = $('.storelocator-filter .location-search input', this.panelElement);

    var locationValue = '';
    if ($locationInput && $locationInput.length) {
      locationValue = $locationInput.val();
    }

    // If the location value is empty.
    if (!locationValue.length) {
      // Clear the home marker.
      Drupal.GSL.removeHomeMarker();
      return true;
    }

    var view = this.get('view');
    var markerMap = Drupal.GSL.getCurrentMap(view);
    var homeMarker = Drupal.GSL.getHomeMarker();
    var showMarker = Drupal.settings.gsl && Drupal.settings.gsl.display_search_marker;

    // Skip if marker is the same.
    if (homeMarker && homeMarker.getMap() == markerMap &&
        (homeMarker.get('locEntry') == locationValue || homeMarker.getTitle() == locationValue)) {
      return false;
    }

    Drupal.GSL.removeHomeMarker();

    // Bring in maps geocoder
    var geo = new google.maps.Geocoder;

    // Geocode entered address location
    geo.geocode({'address':locationValue}, function(results, status) {
      if (results && results.length) {
        var markerOptions = {
          position: results[0].geometry.location,
          title: locationValue,
          // Use Google's default blue marker.
          icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
        };

        if (showMarker && markerMap) {
          markerOptions.map = markerMap;
        }

        var marker = new google.maps.Marker(markerOptions);
        marker.set('locEntry', locationValue)
        if (results[0].formatted_address) {
          marker.setTitle(results[0].formatted_address);
        }

        Drupal.GSL.setHomeMarker(marker);
        if (markerMap) {
          var markerZoom = Drupal.GSL.getHomeMarkerZoomSetting();
          if (isFinite(markerZoom)) {
            markerMap.setZoom(markerZoom);
          }
        }
      }
    });

    return true;
  };

  /**
   * Override addStoreToMap() to implement marker cluster.
   *
   * Add a store to the map.
   * @param {storeLocator.Store} store the store to add.
   */
  storeLocator.View.prototype.addStoreToMap = function(store) {
    var marker = this.getMarker(store);
    store.setMarker(marker);
    var that = this;

    marker.clickListener_ = google.maps.event.addListener(marker, 'click',
      function() {
        that.highlight(store, false);
      });

    if (marker.getMap() != this.getMap()) {
      // Marker hasn't been added to the map before. Decide what to do with it.
      var markerClusterEnabled = Drupal.settings.gsl[Drupal.GSL.currentMap.mapid]['mapcluster'];
      var markerClusterZoom = Drupal.settings.gsl[Drupal.GSL.currentMap.mapid]['mapclusterzoom'];
      var switchToMarkerCluster = (Drupal.GSL.currentMap.getZoom() < markerClusterZoom);
      if (markerClusterEnabled && switchToMarkerCluster) {
        // Marker is added to the cluster.
        Drupal.GSL.currentCluster.addMarker(marker);
      }
      else {
        // Marker is added directly to the map.
        marker.setMap(this.getMap());
      }
    }
  };

  /**
   * Create the marker cluster.
   */
  Drupal.GSL.initializeCluster = function (stores, that) {
    var map = Drupal.GSL.currentMap;
    var markerClusterZoom = Drupal.settings.gsl[Drupal.GSL.currentMap.mapid]['mapclusterzoom'];
    var markerClusterGrid = Drupal.settings.gsl[Drupal.GSL.currentMap.mapid]['mapclustergrid'];
    var mcOptions = {gridSize: markerClusterGrid, maxZoom: Drupal.settings.gsl.max_zoom};
    // We populate it later in addStoreToMap().
    Drupal.GSL.currentCluster = new MarkerClusterer(map, [], mcOptions);
  };

  /**
   * Create map on window load
   */
  Drupal.behaviors.googleStoreLocator = {
    attach: function (context, context_settings) {

      // Process all maps on the page
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

        // Get data
        locator.data = new Drupal.GSL.dataSource(map_settings['datapath']);

        locator.elements = {
          canvas: $canvas.get(0),
          panel: $panel.get(0)
        };

        locator.map = new google.maps.Map(locator.elements.canvas, {
          // Default center on North America.
          center: new google.maps.LatLng(map_settings['maplat'], map_settings['maplong']),
          zoom: map_settings['mapzoom'],
          maxZoom: Drupal.settings.gsl.max_zoom,
          mapTypeId: map_settings['maptype'] || google.maps.MapTypeId.ROADMAP
        });

        Drupal.GSL.setCurrentMap(locator.map, mapid);

        var feature_list = map_settings['feature_list'];
        var storeFeatureSet = new storeLocator.FeatureSet;
        // Loop through the feature list and add each from the admin provided allowed values.
        for(var feature in feature_list) {
          // Mimic the id creation we did when parsing the stores.
          var id = feature_list[feature].replace(/\s/g,'');
          var storeFeature = new storeLocator.Feature(id, feature_list[feature]);
          storeFeatureSet.add(storeFeature);
        }

        locator.view = new storeLocator.View(locator.map, locator.data, {
          markerIcon: map_settings['marker_url'],
          geolocation: false,
          features: storeFeatureSet
        });

        locator.panel = new Drupal.GSL.Panel(locator.elements.panel, {
          view: locator.view,
          items_per_panel: map_settings['items_per_panel'],
          locationSearch: true,
          locationSearchLabel: map_settings['search_label'],
          featureFilter: true
        });

        // Register a change event since Panel does not.
        $('.storelocator-filter input', locator.elements.panel)
          .change(function(changeEvent) {
            var $t = $(this);
            var panel = $t.data('panel');
            if (panel) {
              // Update homemarker.
              var updated = panel.updateHomeMarker();

              // Trigger stores changed since this refreshes the home marker
              // and updates the distance calculations.
              var view = panel.get('view');
              if (updated && view) {
                panel.stores_changed();
              }
            }
          })
          .data('panel', locator.panel);
      } // mapid loop

      locator = null;
    }
  };
})(jQuery, Drupal, this, this.document);
