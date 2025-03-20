import { OpenrpcDocument } from "@open-rpc/meta-schema";
import { OpenAPIV3, OpenAPIV3_1 } from "openapi-types";

import type { Logger } from "@fern-api/logger";
import { AbstractConverterContext } from "@fern-api/v2-importer-commons";

export declare namespace OpenrpcContext {
    interface Args {
        openrpc: OpenrpcDocument;
        logger: Logger;
    }
}

/**
 * Context class for converting OpenAPI 3.1 specifications
 */
export class OpenRPCConverterContext extends AbstractConverterContext<OpenrpcDocument> {
    public isReferenceObject(
        parameter:
            | OpenAPIV3_1.ReferenceObject
            | OpenAPIV3_1.ParameterObject
            | OpenAPIV3_1.SchemaObject
            | OpenAPIV3_1.RequestBodyObject
            | OpenAPIV3_1.SecuritySchemeObject
            | OpenAPIV3.ReferenceObject
            | OpenAPIV3.ParameterObject
            | OpenAPIV3.SchemaObject
            | OpenAPIV3.RequestBodyObject
            | OpenAPIV3.SecuritySchemeObject
    ): parameter is OpenAPIV3.ReferenceObject | OpenAPIV3_1.ReferenceObject {
        return parameter != null && "$ref" in parameter;
    }
}
