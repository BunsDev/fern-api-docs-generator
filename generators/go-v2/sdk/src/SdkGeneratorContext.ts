import { GeneratorNotificationService } from "@fern-api/base-generator";
import { assertNever } from "@fern-api/core-utils";
import { RelativeFilePath } from "@fern-api/fs-utils";
import { AbstractGoGeneratorContext, FileLocation, go } from "@fern-api/go-ast";
import { GoProject } from "@fern-api/go-base";

import { FernGeneratorExec } from "@fern-fern/generator-exec-sdk";
import { GithubOutputMode, OutputMode } from "@fern-fern/generator-exec-sdk/api";
import {
    EnvironmentId,
    EnvironmentUrl,
    HttpEndpoint,
    HttpMethod,
    IntermediateRepresentation,
    Name,
    SdkRequestBodyType,
    SdkRequestWrapper,
    ServiceId,
    StreamingResponse,
    Subpackage
} from "@fern-fern/ir-sdk/api";

import { GoGeneratorAgent } from "./GoGeneratorAgent";
import { SdkCustomConfigSchema } from "./SdkCustomConfig";
import { EndpointGenerator } from "./endpoint/EndpointGenerator";
import { Caller } from "./internal/Caller";
import { ModuleConfig } from "./module/ModuleConfig";
import { ReadmeConfigBuilder } from "./readme/ReadmeConfigBuilder";

export class SdkGeneratorContext extends AbstractGoGeneratorContext<SdkCustomConfigSchema> {
    public readonly project: GoProject;
    public readonly caller: Caller;
    public readonly endpointGenerator: EndpointGenerator;
    public readonly generatorAgent: GoGeneratorAgent;

    public constructor(
        public readonly ir: IntermediateRepresentation,
        public readonly config: FernGeneratorExec.config.GeneratorConfig,
        public readonly customConfig: SdkCustomConfigSchema,
        public readonly generatorNotificationService: GeneratorNotificationService
    ) {
        super(ir, config, customConfig, generatorNotificationService);
        this.project = new GoProject({ context: this });
        this.endpointGenerator = new EndpointGenerator(this);
        this.caller = new Caller(this);
        this.generatorAgent = new GoGeneratorAgent({
            logger: this.logger,
            config: this.config,
            readmeConfigBuilder: new ReadmeConfigBuilder(),
            ir
        });
    }

    public getClientClassName(): string {
        return "Client";
    }

    public getClientPackageName(): string {
        return "client";
    }

    public getClientFilename(): string {
        return "client.go";
    }

    public getRawClientClassName(): string {
        return "RawClient";
    }

    public getRawClientFilename(): string {
        return "raw_client.go";
    }

    public getMethodName(name: Name): string {
        return name.pascalCase.unsafeName;
    }

    public getReceiverName(name: Name): string {
        return name.camelCase.unsafeName.charAt(0);
    }

    public getDefaultBaseUrlTypeInstantiation(endpoint: HttpEndpoint): go.TypeInstantiation {
        const defaultBaseUrl = this.getDefaultBaseUrl(endpoint);
        if (defaultBaseUrl == null) {
            return go.TypeInstantiation.string("");
        }
        return go.TypeInstantiation.string(defaultBaseUrl);
    }

    public getDefaultBaseUrl(endpoint: HttpEndpoint): EnvironmentUrl | undefined {
        if (endpoint.baseUrl != null) {
            return this.getEnvironmnetUrlFromId(endpoint.baseUrl);
        }
        if (this.ir.environments?.defaultEnvironment != null) {
            return this.getEnvironmnetUrlFromId(this.ir.environments.defaultEnvironment);
        }
        return undefined;
    }

    public getEnvironmnetUrlFromId(id: EnvironmentId): EnvironmentUrl | undefined {
        if (this.ir.environments == null) {
            return undefined;
        }
        const environments = this.ir.environments.environments;
        switch (environments.type) {
            case "singleBaseUrl":
                return environments.environments.find((environment) => environment.id === id)?.url;
            case "multipleBaseUrls": {
                for (const environment of environments.environments) {
                    const url = environment.urls[id];
                    if (url != null) {
                        return url;
                    }
                }
                return undefined;
            }
            default:
                assertNever(environments);
        }
    }

    public getModuleConfig({ outputMode }: { outputMode: OutputMode }): ModuleConfig | undefined {
        const githubConfig = this.getGithubOutputMode({ outputMode });
        if (githubConfig == null && this.customConfig.module == null) {
            return undefined;
        }
        if (githubConfig == null) {
            return this.customConfig.module;
        }
        if (this.customConfig.module == null) {
            // A GitHub configuration was provided, so the module config should use
            // the GitHub configuration's repository url.
            const modulePath = githubConfig.repoUrl.replace("https://", "");
            return {
                ...ModuleConfig.DEFAULT,
                path: modulePath
            };
        }
        return {
            path: this.customConfig.module.path,
            version: this.customConfig.module.version,
            imports: this.customConfig.module.imports ?? ModuleConfig.DEFAULT.imports
        };
    }

    private getGithubOutputMode({ outputMode }: { outputMode: OutputMode }): GithubOutputMode | undefined {
        switch (outputMode.type) {
            case "github":
                return outputMode;
            case "publish":
            case "downloadFiles":
                return undefined;
            default:
                assertNever(outputMode);
        }
    }

    public getRootClientDirectory(): RelativeFilePath {
        return RelativeFilePath.of(this.getClientPackageName());
    }

    public getRootClientImportPath(): string {
        return `${this.getRootImportPath()}/${this.getClientPackageName()}`;
    }

    public getRootClientClassReference(): go.TypeReference {
        return go.typeReference({
            name: this.getClientClassName(),
            importPath: this.getRootClientImportPath()
        });
    }

    public getRootRawClientClassReference(): go.TypeReference {
        return go.typeReference({
            name: this.getRawClientClassName(),
            importPath: this.getRootClientImportPath()
        });
    }

    public getSubpackageClientClassReference(subpackage: Subpackage): go.TypeReference {
        return go.typeReference({
            name: this.getClientClassName(),
            importPath: this.getSubpackageClientFileLocation(subpackage).importPath
        });
    }

    public getSubpackageRawClientClassReference(subpackage: Subpackage): go.TypeReference {
        return go.typeReference({
            name: this.getRawClientClassName(),
            importPath: this.getSubpackageClientFileLocation(subpackage).importPath
        });
    }

    public getSubpackageClientPackageName(subpackage: Subpackage): string {
        return this.getFileLocation(subpackage.fernFilepath).importPath.split("/").pop() ?? "";
    }

    public getSubpackageClientFileLocation(subpackage: Subpackage): FileLocation {
        // TODO: Add support for conditionally including the nested 'client' package element.
        return this.getFileLocation(subpackage.fernFilepath);
    }

    public getSubpackageClientField(subpackage: Subpackage): go.Field {
        return go.field({
            name: this.getClientClassName(),
            type: go.Type.reference(this.getSubpackageClientClassReference(subpackage))
        });
    }

    public shouldGenerateSubpackageClient(subpackage: Subpackage): boolean {
        if (subpackage.service != null) {
            return true;
        }
        for (const subpackageId of subpackage.subpackages) {
            const subpackage = this.getSubpackageOrThrow(subpackageId);
            if (this.shouldGenerateSubpackageClient(subpackage)) {
                return true;
            }
        }
        return false;
    }

    public getContextParameter(): go.Parameter {
        return go.parameter({
            name: "ctx",
            type: go.Type.reference(this.getContextTypeReference())
        });
    }

    public getErrorCodesTypeReference(): go.TypeReference {
        return go.typeReference({
            name: "ErrorCodes",
            importPath: this.getInternalImportPath()
        });
    }

    public getCoreApiErrorTypeReference(): go.TypeReference {
        return go.typeReference({
            name: "APIError",
            importPath: this.getCoreImportPath()
        });
    }

    public getVariadicRequestOptionParameter(): go.Parameter {
        return go.parameter({
            name: "opts",
            type: this.getVariadicRequestOptionType()
        });
    }

    public getVariadicIdempotentRequestOptionParameter(): go.Parameter {
        return go.parameter({
            name: "opts",
            type: this.getVariadicIdempotentRequestOptionType()
        });
    }

    public getVariadicRequestOptionType(): go.Type {
        return go.Type.variadic(go.Type.reference(this.getRequestOptionTypeReference()));
    }

    public getVariadicIdempotentRequestOptionType(): go.Type {
        return go.Type.variadic(go.Type.reference(this.getIdempotentRequestOptionTypeReference()));
    }

    public getRequestOptionTypeReference(): go.TypeReference {
        return go.typeReference({
            name: "RequestOption",
            importPath: this.getOptionImportPath()
        });
    }

    public getIdempotentRequestOptionTypeReference(): go.TypeReference {
        return go.typeReference({
            name: "IdempotentRequestOption",
            importPath: this.getOptionImportPath()
        });
    }

    public callBytesNewBuffer(): go.FuncInvocation {
        return go.invokeFunc({
            func: go.typeReference({ name: "NewBuffer", importPath: "bytes" }),
            arguments_: [go.codeblock("nil")]
        });
    }

    public callNewRequestOptions(argument: go.AstNode): go.FuncInvocation {
        return go.invokeFunc({
            func: go.typeReference({
                name: "NewRequestOptions",
                importPath: this.getCoreImportPath()
            }),
            arguments_: [argument]
        });
    }

    public callResolveBaseURL(arguments_: go.AstNode[]): go.FuncInvocation {
        return this.callInternalFunc("ResolveBaseURL", arguments_);
    }

    public callQueryValues(arguments_: go.AstNode[]): go.FuncInvocation {
        return this.callInternalFunc("QueryValues", arguments_);
    }

    public callMergeHeaders(arguments_: go.AstNode[]): go.FuncInvocation {
        return this.callInternalFunc("MergeHeaders", arguments_);
    }

    public getRawResponseTypeReference(valueType: go.Type): go.TypeReference {
        return go.typeReference({
            name: "Response",
            importPath: this.getCoreImportPath(),
            generics: [valueType]
        });
    }

    public getStreamTypeReference(valueType: go.Type): go.TypeReference {
        return go.typeReference({
            name: "Stream",
            importPath: this.getCoreImportPath(),
            generics: [valueType]
        });
    }

    public getStreamPayload(streamingResponse: StreamingResponse): go.Type {
        switch (streamingResponse.type) {
            case "json":
            case "sse":
                return this.goTypeMapper.convert({ reference: streamingResponse.payload });
            case "text":
                return go.Type.string();
            default:
                assertNever(streamingResponse);
        }
    }

    public getRequestWrapperTypeReference(serviceId: ServiceId, requestName: Name): go.TypeReference {
        return go.typeReference({
            name: this.getClassName(requestName),
            importPath: this.getLocationForWrappedRequest(serviceId).importPath
        });
    }

    public getEndpointRequestType({
        endpoint,
        serviceId
    }: {
        endpoint: HttpEndpoint;
        serviceId: ServiceId;
    }): go.Type | undefined {
        const sdkRequest = endpoint.sdkRequest;
        if (sdkRequest == null) {
            return undefined;
        }
        switch (sdkRequest.shape.type) {
            case "justRequestBody":
                return this.getEndpointRequestBodyType(sdkRequest.shape.value);
            case "wrapper": {
                const location = this.getLocationForWrappedRequest(serviceId);
                return go.Type.pointer(
                    go.Type.reference(
                        go.typeReference({
                            name: this.getClassName(sdkRequest.shape.wrapperName),
                            importPath: location.importPath
                        })
                    )
                );
            }
            default:
                assertNever(sdkRequest.shape);
        }
    }

    public shouldSkipWrappedRequest({
        endpoint,
        wrapper
    }: {
        endpoint: HttpEndpoint;
        wrapper: SdkRequestWrapper;
    }): boolean {
        return (
            (wrapper.onlyPathParameters ?? false) && !this.includePathParametersInWrappedRequest({ endpoint, wrapper })
        );
    }

    public includePathParametersInWrappedRequest({
        endpoint,
        wrapper
    }: {
        endpoint: HttpEndpoint;
        wrapper: SdkRequestWrapper;
    }): boolean {
        const inlinePathParameters = this.customConfig.inlinePathParameters;
        if (inlinePathParameters == null) {
            return false;
        }
        const wrapperShouldIncludePathParameters = wrapper.includePathParameters ?? false;
        return endpoint.allPathParameters.length > 0 && inlinePathParameters && wrapperShouldIncludePathParameters;
    }

    public accessRequestProperty({
        requestParameterName,
        propertyName
    }: {
        requestParameterName: Name;
        propertyName: Name;
    }): string {
        const requestParameter = this.getParameterName(requestParameterName);
        return `${requestParameter}.${this.getFieldName(propertyName)}`;
    }

    public getNetHttpHeaderTypeReference(): go.TypeReference {
        return go.typeReference({
            name: "Header",
            importPath: "net/http"
        });
    }

    public getNetHttpMethodTypeReference(method: HttpMethod): go.TypeReference {
        return go.typeReference({
            name: this.getNetHttpMethodTypeReferenceName(method),
            importPath: "net/http"
        });
    }

    private getEndpointRequestBodyType(requestBodyType: SdkRequestBodyType): go.Type {
        switch (requestBodyType.type) {
            case "typeReference":
                return this.goTypeMapper.convert({ reference: requestBodyType.requestBodyType });
            case "bytes": {
                return go.Type.reference(this.getIoReaderTypeReference());
            }
            default:
                assertNever(requestBodyType);
        }
    }

    private callInternalFunc(name: string, arguments_: go.AstNode[]): go.FuncInvocation {
        return go.invokeFunc({
            func: go.typeReference({
                name,
                importPath: this.getInternalImportPath()
            }),
            arguments_
        });
    }

    private getNetHttpMethodTypeReferenceName(method: HttpMethod): string {
        switch (method) {
            case "GET":
                return "MethodGet";
            case "POST":
                return "MethodPost";
            case "PUT":
                return "MethodPut";
            case "PATCH":
                return "MethodPatch";
            case "DELETE":
                return "MethodDelete";
            case "HEAD":
                return "MethodHead";
            default:
                assertNever(method);
        }
    }

    private getLocationForWrappedRequest(serviceId: ServiceId): FileLocation {
        const httpService = this.getHttpServiceOrThrow(serviceId);
        return this.getPackageLocation(httpService.name.fernFilepath);
    }
}
