"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prompt_1 = __importDefault(require("./tools/prompt"));
const Danbooru_1 = require("./tools/Danbooru");
const axios_1 = __importDefault(require("axios"));
const fs_1 = require("fs");
const jszip_1 = __importDefault(require("jszip"));
main();
async function main() {
    let date = new Date();
    let fileName = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}/${date.getMinutes()}/${date.getSeconds()}.zip`;
    console.log("============== Download Danbooru ===============");
    let [tags, limit, safe] = await prompt_1.default([
        { type: "string", question: "Tags (max: 2):" },
        { type: "number", question: "Limit (1-100): ", range: [1, 100] },
        { type: "boolean", question: "Is Safe? (Yes): ", truthy: "yes" },
    ]);
    console.log("============== Downloading... ===============");
    try {
        let zip = new jszip_1.default();
        zip.folder("images");
        let posts = await Danbooru_1.getImageChar(tags, safe, limit || 1);
        let promises = posts.map(async ({ large_file_url }, i) => {
            console.log(`Getting data for`);
            return (await axios_1.default.get(large_file_url, { timeout: 10000, responseType: "arraybuffer" }).catch(() => null))?.data;
        });
        let resolve = await Promise.all(promises);
        console.log("Processing...");
        resolve.forEach((file, i) => {
            zip.file(`images/${i}.${posts[i].file_ext}`, Buffer.from(file));
        });
        let out = zip.generateNodeStream();
        let write = fs_1.createWriteStream("./out/" + fileName);
        out.pipe(write, { end: true }).once("end", () => console.log(`File successfuly downloaded named '${fileName}'`));
    }
    catch (err) {
        console.error(err);
    }
}
