import * as Utils from "../utils";
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
export declare function getPosts(query?: IPostQuery): Promise<Utils.Post[]>;
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
export declare function getRandomPost(query?: IRandomPostQuery): Promise<Utils.Post>;
export {};
