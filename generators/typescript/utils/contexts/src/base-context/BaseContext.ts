import { ExternalDependencies } from "@fern-typescript/commons";
import { CoreUtilities } from "@fern-typescript/commons/src/core-utilities";
import { SourceFile } from "ts-morph";

import { Logger } from "@fern-api/logger";

import { Constants } from "@fern-fern/ir-sdk/api";

import { TypeContext, TypeSchemaContext } from "../model-context/index.js";
import { JsonContext } from "./json/index.js";

export interface BaseContext {
    logger: Logger;
    sourceFile: SourceFile;
    externalDependencies: ExternalDependencies;
    coreUtilities: CoreUtilities;
    fernConstants: Constants;
    type: TypeContext;
    typeSchema: TypeSchemaContext;
    includeSerdeLayer: boolean;
    jsonContext: JsonContext;
}
