import { Blob_ } from "./blob/index.js";
import { Express } from "./express/Express.js";
import { Fs } from "./fs/index.js";
import { qs } from "./qs/index.js";
import { Stream } from "./stream/index.js";
import { UrlJoin } from "./url-join/UrlJoin.js";

export interface ExternalDependencies {
    urlJoin: UrlJoin;
    express: Express;
    fs: Fs;
    blob: Blob_;
    stream: Stream;
    qs: qs;
}
