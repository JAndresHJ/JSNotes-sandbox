"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serve = void 0;
const serve = (port, filename, dir) => {
    console.log('Serving traffic at port: ', port);
    console.log('Saving/Fetching cells from: ', filename);
    console.log('That file is in dir: ', dir);
};
exports.serve = serve;
