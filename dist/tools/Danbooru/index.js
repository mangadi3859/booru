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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImageChar = exports.getRandomPost = exports.getPosts = exports.Utils = void 0;
const src_1 = require("./src");
Object.defineProperty(exports, "getPosts", { enumerable: true, get: function () { return src_1.getPosts; } });
Object.defineProperty(exports, "getRandomPost", { enumerable: true, get: function () { return src_1.getRandomPost; } });
const Utils = __importStar(require("./utils"));
exports.Utils = Utils;
const getImageChar = async (name, safe = false, limit = 20) => {
    if (!name || !name.trim() || typeof name !== "string")
        throw new TypeError("name must be a string");
    if (typeof limit !== "number" || limit < 1)
        throw new TypeError("limit must be a number and greater than zero");
    let query = name.split(/\s*;\s*/).map((str) => str.trim().replace(/ +/g, "_"));
    let option = {
        random: true,
        tags: `${query.join(" ")}`,
        safe,
        limit,
    };
    let result = await src_1.getPosts(option);
    return result;
};
exports.getImageChar = getImageChar;
