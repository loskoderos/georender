import { OSM } from 'ol/source.js';

export const defaults = {
  width: 500,
  height: 500,
  source: {
    osm: new OSM({
      url: 'https://cdn.devgrid.net/osm/{z}/{x}/{y}.png',
      crossOrigin: 'anonymous'
    })
  },
  style: [

  ],
  timeout: 5
};
