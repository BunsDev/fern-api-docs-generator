import { FernIr, IntermediateRepresentation } from "@fern-api/ir-sdk";
import { AbstractConverter, ErrorCollector } from "@fern-api/v2-importer-commons";

import { OpenRPCConverterContext } from "./OpenRPCConverterContext";
import { SchemaConverter } from "./schema/SchemaConverter";

export type BaseIntermediateRepresentation = Omit<IntermediateRepresentation, "apiName" | "constants">;

export declare namespace OpenRPCConverter {
    export interface Args {
        breadcrumbs: string[];
        context: OpenRPCConverterContext;
    }
}

export class OpenRPCConverter extends AbstractConverter<OpenRPCConverterContext, IntermediateRepresentation> {
    private ir: BaseIntermediateRepresentation;

    constructor({ breadcrumbs, context }: OpenRPCConverter.Args) {
        super({ breadcrumbs });
        this.ir = {
            auth: {
                docs: undefined,
                requirement: FernIr.AuthSchemesRequirement.All,
                schemes: []
            },
            types: {},
            services: {},
            errors: {},
            webhookGroups: {},
            websocketChannels: undefined,
            headers: [],
            idempotencyHeaders: [],
            apiVersion: undefined,
            apiDisplayName: undefined,
            apiDocs: undefined,
            basePath: undefined,
            pathParameters: [],
            errorDiscriminationStrategy: FernIr.ErrorDiscriminationStrategy.statusCode(),
            variables: [],
            serviceTypeReferenceInfo: {
                sharedTypes: [],
                typesReferencedOnlyByService: {}
            },
            readmeConfig: undefined,
            sourceConfig: undefined,
            publishConfig: undefined,
            dynamic: undefined,
            environments: undefined,
            fdrApiDefinitionId: undefined,
            rootPackage: context.createPackage(),
            subpackages: {},
            sdkConfig: {
                hasFileDownloadEndpoints: false,
                hasPaginatedEndpoints: false,
                hasStreamingEndpoints: false,
                isAuthMandatory: true,
                platformHeaders: {
                    language: "",
                    sdkName: "",
                    sdkVersion: "",
                    userAgent: undefined
                }
            }
        };
    }

    public async convert({
        context,
        errorCollector
    }: {
        context: OpenRPCConverterContext;
        errorCollector: ErrorCollector;
    }): Promise<IntermediateRepresentation> {
        // TODO: Implement
        throw new Error("Not Implemented");
    }

    private async convertSchemas({
        context,
        errorCollector
    }: {
        context: OpenRPCConverterContext;
        errorCollector: ErrorCollector;
    }): Promise<void> {
        for (const [id, schema] of Object.entries(context.spec.components?.schemas ?? {})) {
            const schemaConverter = new SchemaConverter({
                id,
                breadcrumbs: ["components", "schemas", id],
                schema
            });
            const convertedSchema = await schemaConverter.convert({ context, errorCollector });
            if (convertedSchema != null) {
                this.ir.rootPackage.types.push(id);
                this.ir.types = {
                    ...this.ir.types,
                    ...convertedSchema.inlinedTypes,
                    [id]: convertedSchema.typeDeclaration
                };
            }
        }
    }
}
