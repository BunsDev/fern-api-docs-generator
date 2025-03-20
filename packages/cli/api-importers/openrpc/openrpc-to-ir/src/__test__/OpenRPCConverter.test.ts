import { OpenrpcDocument } from "@open-rpc/meta-schema";
import * as fs from "fs";
import yaml from "js-yaml";
import * as path from "path";
import { describe, expect, it } from "vitest";

import { OpenRPCConverterContext } from "../OpenRPCConverterContext";

function replaceEndpointUUIDs(json: string): string {
    return json.replace(/"[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}"/g, '"test-uuid-replacement"');
}

describe("OpenRPCConverterContext", async () => {
    const fixturesDir = path.join(__dirname, "fixtures");
    const files = fs.readdirSync(fixturesDir);

    files.forEach((directory) => {
        it(`generates snapshot for ${directory}`, async () => {
            // Read and parse YAML file
            const filePath = path.join(fixturesDir, directory, "openrpc.json");
            const fileContents = fs.readFileSync(filePath, "utf8");
            const parsed = yaml.load(fileContents) as OpenrpcDocument;

            const context = new OpenRPCConverterContext({
                spec: parsed,
                logger: undefined as any,
                generationLanguage: undefined,
                smartCasing: false
            });

            // Test local reference resolution
            const result = await context.resolveReference<OpenrpcDocument>({
                $ref: "https://raw.githubusercontent.com/OpenAPITools/openapi-petstore/refs/heads/master/src/main/resources/openapi.yaml#/components/schemas/Pet"
            });

            await expect(replaceEndpointUUIDs(JSON.stringify(result, null, 2))).toMatchFileSnapshot(
                `./__snapshots__/${directory}.json`
            );
        }, 100_000);
    });
});
