import { OSM } from 'ol/source.js';
import { Style, Icon, Circle, Fill, Stroke } from 'ol/style.js'

const white   = 'rgba(255, 255, 255, 0.85)';
const blue    = '#1267FF';

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
    new Style({
      stroke: new Stroke({
        color: white,
        width: 6,
      }),
      image: new Circle({
        radius: 6,
        fill: new Fill({
          color: white
        })
      })
    }),
    new Style({
      stroke: new Stroke({
        color: blue,
        width: 5
      }),
      image: new Circle({
        radius: 4,
        stroke: new Stroke({
          color: blue,
          width: 2
        })
      })
    }),
    new Style({
      image: new Icon({
        scale: 0.5,
        rotateWithView: false,
        anchor: [0.5, 1],
        opacity: 1,
        src: 'https://app.gpxlab.net/assets/pin.png'
      })
    })  
  ],
  padding: [50, 50, 50, 50],
  timeout: 30
};
