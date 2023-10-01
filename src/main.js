import { Application } from "./app.js";
await (new Application(process.argv.slice(2))).run();  
