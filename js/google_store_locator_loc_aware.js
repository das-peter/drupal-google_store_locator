(function ($, Drupal, window, document, undefined) {
  Drupal.GSL = Drupal.GSL || {};

  window.onload = function() {
    if (window.navigator && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(positionSuccess, positionError, ({
        maximumAge: 60 * 1000,
        timeout: 10 * 1000
      }));
    }
  };

  /**
   * Success callback if we're able to obtain lat/lng coordinates for a user.
   */
  function positionSuccess(position) {

    // Centre the map on the new location
    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    Drupal.GSL.currentMap.panTo(latLng);

    var zoom = Drupal.settings.gsl[Drupal.GSL.currentMap.mapid]['loc_aware_zoom'];

    Drupal.GSL.currentMap.setZoom(zoom);

    var showMarker = Drupal.settings.gsl && Drupal.settings.gsl.display_search_marker;
    var markerOptions = {
      position: latLng,
      title: 'You are here!',
      // Use Google's default blue marker.
      icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
    };

    if (showMarker) {
      markerOptions.map = Drupal.GSL.currentMap;
    }

    var marker = new google.maps.Marker(markerOptions);
    Drupal.GSL.setHomeMarker(marker);

    // And reverse geocode.
    $.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latLng.toUrlValue() + "&sensor=true",
      function(response) {
        // Parse the JSON response object.
        if (response.results.length) {
          // There's at least one human-readable address. Note the response is
          // returned from most specific to least specific. We go with most
          // specific.
          marker.setTitle(response.results[0].formatted_address);
          var $searchBox = $('input','.storelocator-filter');
          if ($searchBox.length && !$searchBox.val()) {
            $searchBox.val(response.results[0].formatted_address);
            $searchBox.change();
          }
        }
      }, "json");
  }

  /**
   * Error callback if for some reason we can't get the users location.
   */
  function positionError(err) {
    var msg;
    switch(err.code) {
      case err.UNKNOWN_ERROR:
        msg = "Unable to find your location";
        break;
      case err.PERMISSION_DENIED:
        msg = "Permission denied in finding your location";
        break;
      case err.POSITION_UNAVAILABLE:
        msg = "Your location is currently unknown";
        break;
      case err.BREAK:
        msg = "Attempt to find location took too long";
        break;
      default:
        msg = "Location detection not supported in browser";
  }
    document.getElementById('info').innerHTML = msg;
  }

})(jQuery, Drupal, this, this.document);
