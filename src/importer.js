import GeoJSON from 'ol/format/GeoJSON.js';
import GPX from 'ol/format/GPX.js';
import KML from 'ol/format/KML.js';
import * as fs from 'fs';

export class Importer {
  importFile(filename) {
    const f = filename.toLowerCase();
    if (f.endsWith('.geojson')) return this.importGeoJSON(filename);
    if (f.endsWith('.gpx')) return this.importGPX(filename);
    if (f.endsWith('.kml')) return this.importKML(filename);
    throw new Error("Unsupported file format: " + filename);
  }

  importGeoJSON(filename) {
    console.log('Import GeoJSON: ' + filename);
    const data = this._readFile(filename);
    const format = new GeoJSON();
    return format.readFeatures(data, {
      featureProjection: 'EPSG:3857'
    });
  }

  importGPX(filename) {
    console.log('Import GPX: ' + filename);
    const data = this._readFile(filename);
    const format = new GPX();
    return format.readFeatures(data, {
      featureProjection: 'EPSG:3857'
    });
  }

  importKML(filename) {
    console.log('Import KML: ' + filename);
    const data = this._readFile(filename);
    const format = new KML({
      extractStyles: false,
    });
    return format.readFeatures(data, {
      featureProjection: 'EPSG:3857'
    });
  }

  _readFile(filename) {
    return fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' });
  }
}
