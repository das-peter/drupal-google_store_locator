*******************************************************************************
                   DRUPAL MODULE
*******************************************************************************
Name: Google Store Locator
Maintainers: Michael Fuerstnau (michfuer), Dave Pullen (AngryWookie)
Version: 7.x-1.x
*******************************************************************************

DESCRIPTION:
This project uses Google's Store Locator Utility Library and Google Maps to
create a 'Store Locator' page that your site visitors can use to find and get
directions to one of your physical stores. It was born out of a need for a
simple to install and easy to use locator feature for Drupal 7.

*******************************************************************************

HOW IT WORKS:
Google Store Locator creates a data export View called 'Location Export' that
generates a csv file of all the location nodes you create. It provides a content
type called 'Store Location' that is composed of addressfield and geofield
fields. Current workflow is to add your locations as nodes of type 'Store
Location' and then navigate to [site_name/store_locator] to see the map.
Configuration settings can be changed at:

admin/configuration/google_store_locator

under the 'Search' heading.


*******************************************************************************

INSTALLATION:
1) Use git to clone the 'storelocator' library into sites/all/libraries
(http://code.google.com/p/storelocator/source/checkout)

2) Download and enable the module and all dependencies. Required modules are:
     -views_data_export
     -geofield
     -addressfield
     -geocoder
        -geoPHP


*******************************************************************************

CREDIT:
1) Google and Chris Broadfoot's 'Store Locator Utility Library' screencast
(http://tinyurl.com/8slmeln)

2) Method for adding locations was borrowed from the ol_locator module with its
  'Location' content type.


*******************************************************************************

RESOURCES:
Google Store Locator ref: http://storelocator.googlecode.com/git/index.html
