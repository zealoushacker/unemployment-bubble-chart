# unemployment-bubble-chart

* This will display the aggregate unemployment data for all US states as a choropleth.
* Used to display effects of COVID-19 on unemployment claims.
* We pull data weekly from https://www.dol.gov/ui/data.pdf and aggregate it.

## Build instructions

* Pull down this repo
* For development, make sure that you have an HTTP Server that can serve up `index.html` 
  * example: `$ python -m SimpleHTTPServer 7800`, if you have python SimpleHTTPServer
* Fire up your favorite HTTP server in the root directory 
* Fire up index.html - if you use the example above, then it's: `http://localhost:7800/`

## Deploy instructions

* Deploy `index.html` and `./css` to your favorite static site host.

## Attributions

This draws inspiration from the following:

* https://apps.npr.org/dailygraphics/graphics/coronavirus-d3-us-map-20200312/ 
* https://bost.ocks.org/mike/bubble-map/  
* https://gist.github.com/bradoyler/5adf1567be59283d3e882035e0371ed1
