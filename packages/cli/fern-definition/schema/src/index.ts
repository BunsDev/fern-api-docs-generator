export { EXAMPLE_REFERENCE_PREFIX, YAML_SCHEMA_VERSION } from "./constants.js";
export { type NodePath, type NodePathItem } from "./NodePath.js";
export * as RawSchemas from "./schemas/index.js";
export { type DefinitionFileSchema, type RootApiFileSchema, type PackageMarkerFileSchema } from "./schemas/index.js";
export * from "./utils/generics/index.js";
export * from "./utils/auth/index.js";
export { getRequestBody } from "./utils/getRequestBody.js";
export { isInlineRequestBody } from "./utils/isInlineRequestBody.js";
export { isRawProtobufSourceSchema } from "./utils/isRawProtobufSourceSchema.js";
export { isOpenApiSourceSchema } from "./utils/isOpenApiSourceSchema.js";
export { isRawTextType } from "./utils/isRawTextType.js";
export { parseBytesRequest, type BytesRequest } from "./utils/parseBytesRequest.js";
export { parseFileUploadRequest, type RawFileUploadRequest } from "./utils/parseFileUploadRequest.js";
export { parseRawBytesType, type RawBytesType } from "./utils/parseRawBytesType.js";
export { parseRawFileType, type RawFileType } from "./utils/parseRawFileType.js";
export { parseRawTextType, type RawTextType } from "./utils/parseRawTextType.js";
export { RawPrimitiveType } from "./utils/RawPrimitiveType.js";
export { recursivelyVisitRawTypeReference } from "./utils/recursivelyVisitRawTypeReference.js";
export { visitExampleCodeSampleSchema } from "./utils/visitExampleCodeSampleSchema.js";
export { visitExampleResponseSchema, type ExampleResponseSchemaVisitor } from "./utils/visitExampleResponseSchema.js";
export {
    isAnyAuthSchemes,
    isSingleAuthScheme,
    visitRawApiAuth,
    type RawApiAuthVisitor
} from "./utils/visitRawApiAuth.js";
export {
    isHeaderAuthScheme,
    visitRawAuthSchemeDeclaration,
    type AuthSchemeDeclarationVisitor
} from "./utils/visitRawAuthSchemeDeclaration.js";
export {
    isRawMultipleBaseUrlsEnvironment,
    isRawSingleBaseUrlEnvironment,
    visitRawEnvironmentDeclaration
} from "./utils/visitRawEnvironmentDeclaration.js";
export {
    isVariablePathParameter,
    visitRawPathParameter,
    type PathParameterDeclarationVisitor
} from "./utils/visitRawPathParameter.js";
export {
    isRawAliasDefinition,
    isRawDiscriminatedUnionDefinition,
    isRawEnumDefinition,
    isRawObjectDefinition,
    isRawUndiscriminatedUnionDefinition,
    visitRawTypeDeclaration,
    type RawTypeDeclarationVisitor
} from "./utils/visitRawTypeDeclaration.js";
export { FernContainerRegex, visitRawTypeReference } from "./utils/visitRawTypeReference.js";
export { HttpEndpointReferenceParser } from "./utils/HttpEndpointReferenceParser.js";
