import { OpenAPIV3 } from "openapi-types";

import { RawSchemas } from "@fern-api/fern-definition-schema";
import { EndpointExample } from "@fern-api/openapi-ir";

import { getExtension, getExtensionAndValidate } from "../../../getExtension.js";
import { AbstractOpenAPIV3ParserContext } from "../AbstractOpenAPIV3ParserContext.js";
import { OperationContext } from "../converters/contexts.js";
import { RedoclyCodeSampleArraySchema, RedoclyCodeSampleSchema } from "../schemas/RedoclyCodeSampleSchema.js";
import { OpenAPIExtension } from "./extensions.js";
import { FernOpenAPIExtension } from "./fernExtensions.js";
import { getRawReadmeCodeSamples } from "./getReadmeCodeSamples.js";

export function getExamplesFromExtension(
    operationContext: OperationContext,
    operationObject: OpenAPIV3.OperationObject,
    context: AbstractOpenAPIV3ParserContext
): EndpointExample[] {
    const exampleEndpointCalls = getExtension<RawSchemas.ExampleEndpointCallSchema[]>(
        operationObject,
        FernOpenAPIExtension.EXAMPLES
    );

    const validatedExampleEndpointCalls: RawSchemas.ExampleEndpointCallArraySchema = (
        exampleEndpointCalls ?? []
    ).filter((example) => {
        const maybeFernExample = RawSchemas.serialization.ExampleEndpointCallSchema.parse(example);
        if (!maybeFernExample.ok) {
            context.logger.error(
                `Failed to parse x-fern-example in ${operationContext.path}/${operationContext.method}`
            );
        }
        return maybeFernExample.ok;
    });

    const redoclyCodeSamplesKebabCase =
        getExtensionAndValidate<RedoclyCodeSampleArraySchema>(
            operationObject,
            OpenAPIExtension.REDOCLY_CODE_SAMPLES_KEBAB,
            RedoclyCodeSampleArraySchema,
            context.logger,
            [...operationContext.baseBreadcrumbs, `${operationContext.method} ${operationContext.path}`]
        ) ?? [];

    const redoclyCodeSamplesCamelCase =
        getExtensionAndValidate<RedoclyCodeSampleArraySchema>(
            operationObject,
            OpenAPIExtension.REDOCLY_CODE_SAMPLES_CAMEL,
            RedoclyCodeSampleArraySchema,
            context.logger,
            [...operationContext.baseBreadcrumbs, `${operationContext.method} ${operationContext.path}`]
        ) ?? [];

    const redoclyCodeSamples: RedoclyCodeSampleSchema[] = [
        ...redoclyCodeSamplesCamelCase,
        ...redoclyCodeSamplesKebabCase
    ];

    if (redoclyCodeSamples.length > 0) {
        validatedExampleEndpointCalls.push({
            "code-samples": redoclyCodeSamples.map(
                (value): RawSchemas.ExampleCodeSampleSchema => ({
                    name: value.label ?? value.lang,
                    language: value.lang,
                    code: value.source,
                    install: undefined,
                    docs: undefined
                })
            )
        });
    }

    const readmeCodeSamples = getRawReadmeCodeSamples(operationObject);
    if (readmeCodeSamples.length > 0) {
        validatedExampleEndpointCalls.push({
            "code-samples": readmeCodeSamples
        });
    }

    return validatedExampleEndpointCalls.map(EndpointExample.unknown);
}
