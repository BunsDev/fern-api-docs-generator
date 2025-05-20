import { Auth } from "./auth/Auth.js";
import { BaseCoreUtilities } from "./base/BaseCoreUtilities.js";
import { CallbackQueue } from "./callback-queue/CallbackQueue.js";
import { Fetcher } from "./fetcher/Fetcher.js";
import { FormDataUtils } from "./form-data-utils/FormDataUtils.js";
import { Pagination } from "./pagination/Pagination.js";
import { Runtime } from "./runtime/Runtime.js";
import { StreamUtils } from "./stream-utils/StreamUtils.js";
import { Utils } from "./utils/Utils.js";
import { Websocket } from "./websocket/Websocket.js";
import { Zurg } from "./zurg/Zurg.js";

export interface CoreUtilities {
    zurg: Zurg;
    fetcher: Fetcher;
    streamUtils: StreamUtils;
    callbackQueue: CallbackQueue;
    auth: Auth;
    base: BaseCoreUtilities;
    formDataUtils: FormDataUtils;
    runtime: Runtime;
    pagination: Pagination;
    utils: Utils;
    websocket: Websocket;
}
