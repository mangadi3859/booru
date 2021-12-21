import prompt from "./tools/prompt";
import { getImageChar } from "./tools/Danbooru";
import axios from "axios";
import { writeFileSync } from "fs";
import JsZip from "jszip";

main();

async function main() {
    let date = new Date();
    let fileName = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}/${date.getMinutes()}/${date.getSeconds()}.zip`;

    console.log("============== Download Danbooru ===============");
    let [tags, limit, safe] = await prompt([
        { type: "string", question: "Tags (max: 2):" },
        { type: "number", question: "Limit (1-100): ", range: [1, 100] },
        { type: "boolean", question: "Is Safe? (Yes): ", truthy: "yes" },
    ]);
    console.log("============== Downloading... ===============");

    try {
        let zip = new JsZip();
        zip.folder("images");
        let posts = await getImageChar(tags, safe, limit || 1);
        let promises = posts.map(async ({ large_file_url }, i) => {
            console.log(`Getting data for`);
            return (await axios.get(large_file_url, { timeout: 10000, responseType: "arraybuffer" }).catch(() => null))?.data;
        });

        let resolve = await Promise.all(promises);
        console.log("Processing...");
        resolve.forEach((file, i) => {
            zip.file(`images/${i}.${posts[i].file_ext}`, Buffer.from(file));
        });

        let out = await zip.generateAsync({ type: "arraybuffer" });
        writeFileSync(`out/${fileName}`, Buffer.from(out));
        console.log(`File successfuly downloaded named '${fileName}'`);
    } catch (err) {
        console.error(err);
    }
}
