# Georender

Georender is a command line utility for rendering GPS data as image.
Program was created for server side rendering of GPX files for [GPXLAB](https://gpxlab.net) - GPS Track Editor.

Following data formats are supported:
- GeoJSON
- GPX
- KML / KMZ

Georender can render multiple input files at once to an image of specified width and height in pixels.
You can select the tile source and modify style (see defaults.js).

## Examples

## How to use it?
Checkout this repository and install dependencies with:
~~~
npm install
~~~

Render sample GPX file with Georender:
~~~
./georender -i samples/vesuvio.gpx -o out.png
~~~

You should get the following image:

![](samples/vesuvio.png)

## How does it work?
Georender is built with OpenLayers, server side rendering (SSR) is implemented with JSDom.
Application creates a virtual DOM structure to allow OpenLayers render a map. The DOM is monkey patched for missing dependencies to make it work. Once completed the canvas is saved to the output image.

## Credits
- [OpenLayers](https://github.com/openlayers/openlayers)
- [JSDom](https://github.com/jsdom/jsdom)
- [JSZip](https://github.com/Stuk/jszip)
- [ol-ssr](https://github.com/mmomtchev/ol-ssr)

## License
MIT

