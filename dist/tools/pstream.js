"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = require("stream");
/** Trait Stream data like buffer or Uint8Array
 *
 * @param readable
 *
 */
function promiseStream(readable) {
    return new Promise((resolve, reject) => {
        let duplex = new stream_1.PassThrough();
        let uint8 = [];
        readable.once("end", () => {
            duplex.end();
        });
        duplex.on("data", (chunk) => {
            uint8.push(chunk);
        });
        duplex.once("error", (err) => {
            reject(err);
        });
        duplex.once("end", () => {
            resolve(Buffer.concat(uint8));
        });
        readable.pipe(duplex, { end: true });
    });
}
exports.default = promiseStream;
