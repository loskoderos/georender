import { OSM, XYZ } from 'ol/source.js';
import { Style, Icon, Circle, Fill, Stroke } from 'ol/style.js'

const white   = 'rgba(255, 255, 255, 0.85)';
const blue    = '#1267FF';

export const defaults = {
  width: 500,
  height: 500,
  tile: {
    osm: new OSM({
      url: 'https://cdn.devgrid.net/osm/{z}/{x}/{y}.png',
      crossOrigin: 'anonymous'
    }),
    otm: new XYZ({
      url: 'https://cdn.devgrid.net/otm/{z}/{x}/{y}.png',
      maxZoom: 17,
      crossOrigin: 'anonymous'
    }),
    esri: new XYZ({
      url: 'https://server.arcgisonline.com//ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      maxZoom: 23,
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
