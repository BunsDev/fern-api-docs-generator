import { FERN_PACKAGE_MARKER_FILENAME } from "@fern-api/configuration";
import { Schema } from "@fern-api/openapi-ir";
import { RelativeFilePath } from "@fern-api/path-utils";

import { OpenApiIrConverterContext } from "./OpenApiIrConverterContext.js";
import { buildTypeReference } from "./buildTypeReference.js";
import { getGroupNameForSchema } from "./utils/getGroupNameForSchema.js";
import { getNamespaceFromGroup } from "./utils/getNamespaceFromGroup.js";
import { getTypeFromTypeReference } from "./utils/getTypeFromTypeReference.js";

export function buildVariables(context: OpenApiIrConverterContext): void {
    for (const [variable, variableSchema] of Object.entries(context.ir.variables)) {
        const namespace =
            variableSchema.groupName != null ? getNamespaceFromGroup(variableSchema.groupName) : undefined;
        const typeReference = buildTypeReference({
            schema: Schema.primitive(variableSchema),
            context,
            fileContainingReference: RelativeFilePath.of(FERN_PACKAGE_MARKER_FILENAME),
            namespace,
            declarationDepth: 0
        });
        context.builder.addVariable({
            name: variable,
            schema: {
                type: getTypeFromTypeReference(typeReference),
                docs: variableSchema.description ?? undefined
            }
        });
    }
}
