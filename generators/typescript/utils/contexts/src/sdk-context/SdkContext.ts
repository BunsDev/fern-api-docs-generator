import { JavaScriptRuntime, NpmPackage } from "@fern-typescript/commons";
import { ts } from "ts-morph";

import { GeneratorNotificationService } from "@fern-api/base-generator";
import { Logger } from "@fern-api/logger";

import { FernGeneratorExec } from "@fern-fern/generator-exec-sdk";
import { IntermediateRepresentation } from "@fern-fern/ir-sdk/api";

import { BaseContext } from "../base-context/index.js";
import { EndpointErrorUnionContext } from "./endpoint-error-union/index.js";
import { EnvironmentsContext } from "./environments/index.js";
import { GenericAPISdkErrorContext } from "./generic-api-sdk-error/index.js";
import { RequestWrapperContext } from "./request-wrapper/index.js";
import { SdkClientClassContext } from "./sdk-client-class/index.js";
import { SdkEndpointTypeSchemasContext } from "./sdk-endpoint-type-schemas/index.js";
import { SdkErrorSchemaContext } from "./sdk-error-schema/index.js";
import { SdkErrorContext } from "./sdk-error/index.js";
import { SdkInlinedRequestBodySchemaContext } from "./sdk-inlined-request-body-schema/index.js";
import { TimeoutSdkErrorContext } from "./timeout-sdk-error/index.js";
import { VersionContext } from "./version/index.js";
import { WebsocketClassContext } from "./websocket-class/index.js";
import { WebsocketTypeSchemaContext } from "./websocket-type-schema/index.js";

export interface SdkContext extends BaseContext {
    logger: Logger;
    version: string | undefined;
    ir: IntermediateRepresentation;
    config: FernGeneratorExec.GeneratorConfig;
    generatorNotificationService: GeneratorNotificationService;
    npmPackage: NpmPackage | undefined;
    sdkInstanceReferenceForSnippet: ts.Identifier;
    namespaceExport: string;
    endpointErrorUnion: EndpointErrorUnionContext;
    environments: EnvironmentsContext;
    genericAPISdkError: GenericAPISdkErrorContext;
    sdkEndpointTypeSchemas: SdkEndpointTypeSchemasContext;
    sdkError: SdkErrorContext;
    sdkErrorSchema: SdkErrorSchemaContext;
    sdkInlinedRequestBodySchema: SdkInlinedRequestBodySchemaContext;
    timeoutSdkError: TimeoutSdkErrorContext;
    requestWrapper: RequestWrapperContext;
    sdkClientClass: SdkClientClassContext;
    websocket: WebsocketClassContext;
    websocketTypeSchema: WebsocketTypeSchemaContext;
    versionContext: VersionContext;
    targetRuntime: JavaScriptRuntime;
    includeSerdeLayer: boolean;
    retainOriginalCasing: boolean;
    generateOAuthClients: boolean;
    inlineFileProperties: boolean;
    omitUndefined: boolean;
    neverThrowErrors: boolean;
}
