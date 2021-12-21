"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prompt_1 = __importDefault(require("./tools/prompt"));
const Danbooru_1 = require("./tools/Danbooru");
const axios_1 = __importDefault(require("axios"));
const fs = __importStar(require("fs"));
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
        let write = fs.createWriteStream(process.cwd() + "/out/" + fileName);
        out.pipe(write, { end: true }).once("end", () => console.log(`File successfuly downloaded named '${fileName}'`));
    }
    catch (err) {
        console.error(err);
    }
}
