import { parseArgs } from 'node:util';
import { Renderer } from './renderer.js';

const help = '\
Usage: georender [options] \n \
  -w, --width <px> - Image width in pixels\n \
  -h, --height <px> - Image height in pixels\n \
  -i, --in <input file>, --in ... - Path to input file (.geojson, .gpx, .kml, .kmz)\n \
  -o, --out <output file> - Path to output file (.png or .jpg)\n \
';

const options = {
  'width': { type: 'string', short: 'w' },
  'height': { type: 'string', short: 'h' },
  'in': { type: 'string', short: 'i', multiple: true },
  'out': { type: 'string', short: 'o' }
};

export class Application {
  constructor(args) {
    this.args = args;
    this.renderer = new Renderer();
  }

  async run() {
    console.log('Georender - Render GPS data as image');

    if (this.args.length == 0) {
      console.log(help);
      return -1;
    }

    let args;
    try {
      args = parseArgs({ options, args: this.args });
      if (!args.values.in) {
        console.log('No input files');
        return -1;
      }
      if (!args.values.out) {
        console.log('No output file');
        return -1;
      }
      if (!args.values.out.toLowerCase().endsWith('.png') && 
          !args.values.out.toLowerCase().endsWith('.jpg') &&
          !args.values.out.toLowerCase().endsWith('.jpeg')) {
        throw new Error("Output file must be either .png or .jpg");
        return -1;
      }
    } catch (err) {
      console.error(err.message);
      return -1;
    }

    await this.renderer.render({
      width: +args.values.width,
      height: +args.values.height,
      in: args.values.in,
      out: args.values.out
    });

    return 0;
  }
}
