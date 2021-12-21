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
exports.getRandomPost = exports.getPosts = void 0;
const axios_1 = __importDefault(require("axios"));
const Utils = __importStar(require("../utils"));
const url_1 = require("url");
const auth_1 = __importDefault(require("./auth"));
const BASE_URL = auth_1.default("danbooru");
var EndPoint;
(function (EndPoint) {
    EndPoint["Post"] = "posts.json";
    EndPoint["RandomPost"] = "posts/random.json";
})(EndPoint || (EndPoint = {}));
/** GenericFunction For Request
 *
 * @param endpoint EndPoint
 * @param query Query for the Request
 * @returns Response
 */
const request = async (endpoint, query = {}) => {
    let url = new url_1.URL(BASE_URL.href + endpoint);
    Object.keys(query).forEach((key) => url.searchParams.append(key, query[key]));
    let response = await axios_1.default.get(url.href, {
    // proxy: {
    //     host: "68.183.55.25",
    //     port: 3128,
    // },
    });
    return response.data || null;
};
/** Get Posts
 *
 * @param tags Tags String, Every Tag is separated by spaces.
 * @param query Optional query.
 * @returns
 */
async function getPosts(query = {}) {
    let { tags, safe, limit, status } = query;
    let params = `${tags || ""} ${safe == undefined ? "" : `${safe ? "" : "-"}rating:s`} ${"limit"}:${limit ? limit : 10} ${status ? `status:${status}` : ""}`.replace(/ {2,}/, " ");
    let option = { tags: params };
    let res = await request(EndPoint.Post, option);
    return res?.map((post) => new Utils.Post(post)) || [];
}
exports.getPosts = getPosts;
/** Get Random Post
 *
 * @param query Request Query Containing Metdata and Tags
 * @returns
 */
async function getRandomPost(query = {}) {
    let { tags, safe, status } = query;
    tags = tags
        .split(/\s*;\s*/)
        .map((str) => str.trim().replace(/ +/g, "_"))
        .join(" ");
    let params = `${tags || ""} ${safe == undefined ? "" : `${safe ? "" : "-"}rating:s`} ${status ? `status:${status}` : ""}`.replace(/ {2,}/, " ");
    let option = { tags: params };
    let res = await request(EndPoint.RandomPost, option).catch(() => null);
    return res ? new Utils.Post(res) : null;
}
exports.getRandomPost = getRandomPost;
