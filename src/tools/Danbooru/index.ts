import { getPosts, getRandomPost } from "./src";
import * as Utils from "./utils";

export { Utils, getPosts, getRandomPost };

export const getImageChar = async (name: string, safe: boolean = false, limit: number = 20): Promise<Utils.Post[]> => {
    if (!name || !name.trim() || typeof name !== "string") throw new TypeError("name must be a string");
    if (typeof limit !== "number" || limit < 1) throw new TypeError("limit must be a number and greater than zero");

    let query = name.split(/\s*;\s*/).map((str) => str.trim().replace(/ +/g, "_"));

    let option = {
        random: true,
        tags: `${query.join(" ")}`,
        safe,
        limit,
    };
    let result = await getPosts(option);

    return result;
};
