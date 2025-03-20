import { AbstractConverter } from "@fern-api/v2-importer-commons";
import { ErrorCollector } from "@fern-api/v2-importer-commons";

import { OpenRPCConverterContext } from "../OpenRPCConverterContext";

export declare namespace SchemaConverter {
    export interface Output {
        typeDeclaration: any;
        inlinedTypes: Record<string, any>;
    }

    export interface Args {
        id: string;
        breadcrumbs: string[];
        schema: any;
    }
}

export class SchemaConverter extends AbstractConverter<OpenRPCConverterContext, SchemaConverter.Output> {
    private readonly id: string;
    private readonly schema: any;

    constructor({ id, breadcrumbs, schema }: SchemaConverter.Args) {
        super({ breadcrumbs });
        this.id = id;
        this.schema = schema;
    }

    public async convert({
        context,
        errorCollector
    }: {
        context: OpenRPCConverterContext;
        errorCollector: ErrorCollector;
    }): Promise<SchemaConverter.Output> {
        // TODO: Implement schema conversion
        return {
            typeDeclaration: {},
            inlinedTypes: {}
        };
    }
}
