import { HttpPathParameterSchema } from "../schemas/index.js";
import { TypeReferenceSchema } from "../schemas/index.js";
import { VariableReferenceSchema } from "../schemas/index.js";

export interface PathParameterDeclarationVisitor<R> {
    nonVariable: (pathParameter: TypeReferenceSchema) => R;
    variable: (pathParameter: VariableReferenceSchema | string) => R;
}

export function visitRawPathParameter<R>(
    rawPathParameter: HttpPathParameterSchema,
    visitor: PathParameterDeclarationVisitor<R>
): R {
    if (isVariablePathParameter(rawPathParameter)) {
        return visitor.variable(rawPathParameter);
    } else {
        return visitor.nonVariable(rawPathParameter);
    }
}

export function isVariablePathParameter(
    rawPathParameter: HttpPathParameterSchema
): rawPathParameter is VariableReferenceSchema | string {
    if (typeof rawPathParameter === "string") {
        return rawPathParameter.startsWith("$");
    }
    return "variable" in rawPathParameter;
}
