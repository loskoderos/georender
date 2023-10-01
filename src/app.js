import { parseArgs } from 'node:util';

const help = '\
Usage: georender --width <w> --height <h>\n \
  --width  - Image width in pixels, default 500px\n \
  --height - Image height in pixels, default 500px\n \
';

const options = {
  'width': { type: 'string', default: '500' },
  'height': { type: 'string', default: '500' },
};

class Application {
  constructor(args) {
    this.args = args;
  }

  async run() {
    console.log('Georender - Render GPS data as image');

    if (this.args.length == 0) {
      console.log(help);
      return;
    }

    const args = parseArgs({ options, args: this.args });
    console.log(args);
  }
}

export { Application };
