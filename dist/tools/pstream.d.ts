/// <reference types="node" />
import { Readable } from "stream";
/** Trait Stream data like buffer or Uint8Array
 *
 * @param readable
 *
 */
export default function promiseStream(readable: Readable): Promise<Buffer>;
