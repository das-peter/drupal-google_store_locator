;(function($) {
  google.maps.event.addDomListener(window, 'load', function() {
    var map = new google.maps.Map(document.getElementById('map-canvas'), {
      //Default center on North America.
      center: new google.maps.LatLng(Drupal.settings.gsl['maplong'],
        Drupal.settings.gsl['maplat']),
      zoom: Drupal.settings.gsl['mapzoom'],
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var panelDiv = document.getElementById('panel');

    var data = new GSLdataSource;

    var view = new storeLocator.View(map, data, {
      geolocation: false,
      features: data.getFeatures()
    });

    new storeLocator.Panel(panelDiv, {
      view: view
    });
  });
})(jQuery);
