import { Reference } from "@fern-typescript/commons";

import { DeclaredErrorName, ErrorDeclaration } from "@fern-fern/ir-sdk/api";

import { GeneratedExpressError } from "./GeneratedExpressError.js";

export interface ExpressErrorContext {
    getReferenceToError: (errorName: DeclaredErrorName) => Reference;
    getErrorClassName: (errorName: DeclaredErrorName) => string;
    getGeneratedExpressError: (errorName: DeclaredErrorName) => GeneratedExpressError;
    getErrorDeclaration: (errorName: DeclaredErrorName) => ErrorDeclaration;
}
