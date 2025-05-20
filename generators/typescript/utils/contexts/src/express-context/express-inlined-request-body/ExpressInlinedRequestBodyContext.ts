import { PackageId, Reference } from "@fern-typescript/commons";

import { Name } from "@fern-fern/ir-sdk/api";

import { GeneratedExpressInlinedRequestBody } from "./GeneratedExpressInlinedRequestBody.js";

export interface ExpressInlinedRequestBodyContext {
    getGeneratedInlinedRequestBody: (packageId: PackageId, endpointName: Name) => GeneratedExpressInlinedRequestBody;
    getReferenceToInlinedRequestBodyType: (packageId: PackageId, endpointName: Name) => Reference;
}
