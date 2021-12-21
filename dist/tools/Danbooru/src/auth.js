"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = require("url");
const dotenv_1 = require("dotenv");
dotenv_1.config();
const DANBOORU_USERNAME = process.env.DANBOORU_USERNAME;
exports.default = (server) => new url_1.URL(`https://${DANBOORU_USERNAME}:${process.env.DANBOORU_TOKEN}@${server || "danbooru"}.donmai.us/`);
