import { Readable, PassThrough } from "stream";

/** Trait Stream data like buffer or Uint8Array
 *
 * @param readable
 *
 */
export default function promiseStream(readable: Readable) {
    return new Promise<Buffer>((resolve, reject) => {
        let duplex = new PassThrough();
        let uint8: Buffer[] = [];

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
