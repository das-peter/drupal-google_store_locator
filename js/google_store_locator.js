;(function($) {
  // module global namespace
  Drupal.GSL = {};

/**
 * @extends storeLocator.StaticDataFeed
 * @constructor
 */
  Drupal.GSL.dataSource = function (datapath) {
    // call the parent constructor
    Drupal.GSL.dataSource.parent.call(this);

    // initialize variables
    this._stores = [];

    var that = this;
    $.getJSON(datapath, function(json) {

      //defining our success handler, i.e. if the path we're passing to $.getJSON
      //is legit and returns a JSON file then this runs.
      var stores = that.parseStores_(json);
      that.setStores(stores);
    });
  };

  // Set parent class
  Drupal.GSL.dataSource.parent = storeLocator.StaticDataFeed;

  // Inherit parent's prototype
  Drupal.GSL.dataSource.prototype = new Drupal.GSL.dataSource.parent;

  // Correct the constructor pointer
  Drupal.GSL.dataSource.prototype.constructor = Drupal.GSL.dataSource;

  // Global store counter for unique ids
  Drupal.GSL.dataSource.storeCount = 0;

  /**
   * Overriden: Set the stores for this data feed.
   * @param {!Array.<!storeLocator.Store>} stores the stores for this data feed.
   *
   * - Sets _stores since storeLocator variable is minified
   */
  Drupal.GSL.dataSource.prototype.setStores = function(stores) {
    this._stores = stores;
    Drupal.GSL.dataSource.parent.prototype.setStores.apply(this, arguments);
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
      var store_id = 'store-' + (Drupal.GSL.dataSource.storeCount++);

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
 * @extends storeLocator.Panel
 * @constructor
 */
  Drupal.GSL.Panel = function (el, opt_options) {
    // set items per panel
    if (opt_options['items_per_panel'] && !isNaN(opt_options['items_per_panel'])) {
      this.set('items_per_panel', opt_options['items_per_panel']);
    }
    else {
      // use default items per panel
      this.set('items_per_panel', Drupal.GSL.Panel.ITEMS_PER_PANEL_DEFAULT);
    }

    // call the parent constructor (in compiled format)
    storeLocator.Panel.call(this, el, opt_options);

    // ensure this variable is set
    this.storeList_ = $('.store-list', el);
  };

  // When we create a new object of type Drupal.GSL.Panel that object will
  // inherit all the properties of it's constructor prototype i.e.
  // Drupal.GSL.Panel.prototype. Thus we need to properly set the prototype.
  // Object.create() creates a new object with the specified prototype object
  // and properties.
  Drupal.GSL.Panel.prototype = Object.create(storeLocator.Panel.prototype);

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
    for (var i = 0, ii = Math.min(items_per_panel, stores.length); i < ii; i++) {
      var storeLi = stores[i].getInfoPanelItem();
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
    storeLocator.Panel.prototype.selectedStore_changed.call(this);

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

  //Initialize variable for
  Drupal.GSL.currentMap = {};

  Drupal.GSL.setCurrentMap = function(map, mapid) {
    Drupal.GSL.currentMap = map;
    Drupal.GSL.currentMap.mapid = mapid;
  }

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
          locationSearchLabel: map_settings['search_label']
        });

      } // mapid loop

      locator = null;
    }
  };
})(jQuery);
