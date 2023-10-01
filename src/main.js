import { Application } from "./app.js";
const app = new Application(process.argv.slice(2));
process.exit(await app.run());  
