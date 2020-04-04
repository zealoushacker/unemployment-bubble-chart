# unemployment-bubble-chart

This will display the unemployment data for all US states as a bubble chart, cumulative, used to display effects of COVID-19.

Current weeks included: week ending 03/28/2020 and 03/21/2020.

## Build instructions

* Pull down this repo
* `$ make clean && make all`
* For development, make sure that you have an HTTP Server that can serve up `index.html` 
  * example: `$ python -m SimpleHTTPServer 7800`, if you have python SimpleHTTPServer
* Fire up your favorite HTTP server in the root directory 
* Fire up index.html - if you use the example above, then it's: `http://localhost:7800/`

## Deploy instructions

* Deploy `index.html` and `build/` to your favorite static site host

## Attributions

This draws inspiration from the following:

* https://apps.npr.org/dailygraphics/graphics/coronavirus-d3-us-map-20200312/?initialWidth=1238&childId=responsive-embed-coronavirus-d3-us-map-20200312&parentTitle=Map%3A%20How%20Many%20Cases%20Of%20Coronavirus%20Are%20There%20In%20Each%20U.S.%20State%3F%20%3A%20Shots%20-%20Health%20News%20%3A%20NPR&parentUrl=https%3A%2F%2Fwww.npr.org%2Fsections%2Fhealth-shots%2F2020%2F03%2F16%2F816707182%2Fmap-tracking-the-spread-of-the-coronavirus-in-the-u-s
* https://bost.ocks.org/mike/bubble-map/  
