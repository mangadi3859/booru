import axios from "axios";
import * as Utils from "../utils";
import { URL } from "url";
import getAuthUrl from "./auth";

const BASE_URL = getAuthUrl("danbooru");

enum EndPoint {
    Post = "posts.json",
    RandomPost = "posts/random.json",
}

/** GenericFunction For Request
 *
 * @param endpoint EndPoint
 * @param query Query for the Request
 * @returns Response
 */
const request = async <Res = any>(endpoint: EndPoint, query: Object = {}): Promise<Res> => {
    let url = new URL(BASE_URL.href + endpoint);
    Object.keys(query).forEach((key) => url.searchParams.append(key, query[key]));
    let response = await axios.get<Res>(url.href, {
        // proxy: {
        //     host: "68.183.55.25",
        //     port: 3128,
        // },
    });

    return response.data || null;
};

export interface IPostQuery {
    tags?: string;
    safe?: boolean;
    limit?: number;
    status?: string;
}

/** Get Posts
 *
 * @param tags Tags String, Every Tag is separated by spaces.
 * @param query Optional query.
 * @returns
 */
export async function getPosts(query: IPostQuery = {}): Promise<Utils.Post[]> {
    let { tags, safe, limit, status } = query;
    let params = `${tags || ""} ${safe == undefined ? "" : `${safe ? "" : "-"}rating:s`} ${"limit"}:${limit ? limit : 10} ${status ? `status:${status}` : ""}`.replace(/ {2,}/, " ");
    let option = { tags: params };
    let res = await request<Utils.IPost[]>(EndPoint.Post, option);

    return res?.map((post) => new Utils.Post(post)) || [];
}

interface IRandomPostQuery {
    tags?: string;
    safe?: boolean;
    status?: string;
}

/** Get Random Post
 *
 * @param query Request Query Containing Metdata and Tags
 * @returns
 */
export async function getRandomPost(query: IRandomPostQuery = {}): Promise<Utils.Post> {
    let { tags, safe, status } = query;
    tags = tags
        .split(/\s*;\s*/)
        .map((str) => str.trim().replace(/ +/g, "_"))
        .join(" ");
    let params = `${tags || ""} ${safe == undefined ? "" : `${safe ? "" : "-"}rating:s`} ${status ? `status:${status}` : ""}`.replace(/ {2,}/, " ");
    let option = { tags: params };
    let res: Utils.IPost = await request<Utils.IPost>(EndPoint.RandomPost, option).catch(() => null);

    return res ? new Utils.Post(res) : null;
}
