import { document } from "./dom.js";
import { defaults } from "./defaults.js";
import { Map, View } from "ol";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer.js";
import { Vector as VectorSource } from "ol/source.js";
import { Importer } from "./importer.js";
import * as fs from 'fs';

export class Renderer {
  async render(options) {
    await new Promise(async (resolve, reject) => {
      try {
        console.log('Rendering...');

        const width = options.width || defaults.width;
        const height = options.height || defaults.height;
        const inputFiles = options.in || [];
        const outputFile = options.out || "out.png";
        const source = defaults.source.osm;
        const style = defaults.style;
        const padding = defaults.padding;
    
        console.log('  width:', width);
        console.log('  height:', height);
        console.log('  input files:', inputFiles);
        console.log('  output file:', outputFile);
    
        const timeout = setTimeout(reject, defaults.timeout * 1000);
  
        const element = document.createElement('div');
        element.style.width = `${width}px`;
        element.style.height = `${height}px`;
        document.body.appendChild(element);
    
        const map = new Map({ target: element });
        map.addLayer(new TileLayer({ source }));
    
        const featureSource = new VectorSource();
        const featureLayer = new VectorLayer({
          source: featureSource,
          style
        });
        map.addLayer(featureLayer);
  
        const view = new View();
        map.setView(view); 
        
        const importer = new Importer();
        inputFiles.forEach(filename => {
          featureSource.addFeatures(importer.importFile(filename));
        });
  
        view.fit(featureSource.getExtent(), {
          size: map.getSize(),
          padding
        });
  
        map.on('postrender', async () => process.stdout.write("."));
  
        map.once('rendercomplete', async () => {
          console.log("\nRender completed, saving image to", outputFile);
          clearTimeout(timeout);
  
          const canvas = await this._processCanvas(map);
          await this._saveImage(canvas, outputFile)
  
          resolve();
        })
  
        map.renderSync();
  
      } catch (err) {
        reject(err);
      }
    })
    .then(() => console.log("Done!"))
    .catch(err => console.error(err instanceof Error ? err.message : "\nTimeout!"))
    ;
  }

  async _processCanvas(map) {
    // OpenLayers can use multiple canvases however it seems in Node.js 
    // only one Canvas object is being used for rendering.
    // @TODO: May be needed to fix this in future.
    const canvases = map.getViewport().querySelectorAll('.ol-layer canvas, canvas.ol-layer');
    return canvases[0];
  }

  async _saveImage(canvas, filename) {
    let mimetype;
    if (filename.toLowerCase().endsWith('.png'))
      mimetype = 'image/png';
    else if (filename.toLowerCase().endsWith('.jpg') || filename.toLowerCase().endsWith('.jpeg'))
      mimetype = 'image/jpeg';
    else
      throw new Error("Only PNG and JPEG output files are supported");
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        blob => { 
          const reader = new FileReader();
          reader.onloadend = () => {
            fs.writeFileSync(filename, reader.result, 'binary');
            resolve();
          };
          reader.readAsBinaryString(blob);
        },
        mimetype
      )
    });
  }
}
