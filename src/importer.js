import GeoJSON from 'ol/format/GeoJSON.js';
import GPX from 'ol/format/GPX.js';
import KML from 'ol/format/KML.js';
import JSZip from 'jszip';
import * as fs from 'fs';

export class Importer {
  async importFile(filename) {
    const f = filename.toLowerCase();
    if (f.endsWith('.geojson')) return await this.importGeoJSON(filename);
    if (f.endsWith('.gpx')) return await this.importGPX(filename);
    if (f.endsWith('.kml')) return await this.importKML(filename);
    if (f.endsWith('.kmz')) return await this.importKMZ(filename);
    throw new Error("Unsupported file format: " + filename);
  }

  async importGeoJSON(filename) {
    console.log('Import GeoJSON: ' + filename);
    const data = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' });
    const format = new GeoJSON();
    return format.readFeatures(data, {
      featureProjection: 'EPSG:3857'
    });
  }

  async importGPX(filename) {
    console.log('Import GPX: ' + filename);
    const data = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' });
    const format = new GPX();
    return format.readFeatures(data, {
      featureProjection: 'EPSG:3857'
    });
  }

  async importKML(filename) {
    console.log('Import KML: ' + filename);
    const data = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' });
    const format = new KML({
      extractStyles: false,
    });
    return format.readFeatures(data, {
      featureProjection: 'EPSG:3857'
    });
  }

  async importKMZ(filename) {
    console.log('Import KMZ: ' + filename);
    const zip = fs.readFileSync(filename, { encoding: 'binary', flag: 'r' });;
    const loaded = await JSZip.loadAsync(zip);
    for (const [path, file] of Object.entries(loaded.files)) {
      if (path.endsWith('.kml')) {
        let data = await file.async('string');

        // Dirty hack to fix ERR_INVALID_URL while parsing Icon with local (zip) urls.
        // Just remove links.
        data = data.replace(/<href>(.*?)<\/href>/g, '')

        const format = new KML({
          extractStyles: false,
        });
        return format.readFeatures(data, {
          featureProjection: 'EPSG:3857'
        });            
      }
    }
    return [];
  }
}
