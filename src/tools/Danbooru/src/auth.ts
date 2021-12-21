import { URL } from "url";
import { config } from "dotenv";
config();
const DANBOORU_USERNAME = process.env.DANBOORU_USERNAME;

export default (server?: string): URL => new URL(`https://${DANBOORU_USERNAME}:${process.env.DANBOORU_TOKEN}@${server || "danbooru"}.donmai.us/`);
