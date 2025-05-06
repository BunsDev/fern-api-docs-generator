import { ExportedFilePath } from "@fern-typescript/commons";
import { SdkContext } from "@fern-typescript/contexts";

import { AbstractGeneratorAgent } from "@fern-api/base-generator";
import { Logger } from "@fern-api/logger";

import { FernGeneratorCli } from "@fern-fern/generator-cli-sdk";
import { FernGeneratorExec } from "@fern-fern/generator-exec-sdk";
import { PublishingConfig } from "@fern-fern/ir-sdk/api";

import { ReadmeConfigBuilder } from "./readme/ReadmeConfigBuilder";

export class TypeScriptGeneratorAgent extends AbstractGeneratorAgent<SdkContext> {
    private readmeConfigBuilder: ReadmeConfigBuilder;
    private publishingConfig: PublishingConfig | undefined;

    public constructor({
        logger,
        config,
        readmeConfigBuilder,
        publishingConfig
    }: {
        logger: Logger;
        config: FernGeneratorExec.GeneratorConfig;
        readmeConfigBuilder: ReadmeConfigBuilder;
        publishingConfig: PublishingConfig | undefined;
    }) {
        super({ logger, config });
        this.readmeConfigBuilder = readmeConfigBuilder;
        this.publishingConfig = publishingConfig;
    }

    public getReadmeConfig(args: AbstractGeneratorAgent.ReadmeConfigArgs<SdkContext>): FernGeneratorCli.ReadmeConfig {
        return this.readmeConfigBuilder.build({
            context: args.context,
            remote: args.remote,
            featureConfig: args.featureConfig
        });
    }

    public getLanguage(): FernGeneratorCli.Language {
        return FernGeneratorCli.Language.Typescript;
    }

    public getExportedReadmeFilePath(): ExportedFilePath {
        return {
            directories: [],
            file: {
                nameOnDisk: this.README_FILENAME
            },
            rootDir: ""
        };
    }

    public getExportedReferenceFilePath(): ExportedFilePath {
        return {
            directories: [],
            file: {
                nameOnDisk: this.REFERENCE_FILENAME
            },
            rootDir: ""
        };
    }

    public getGitHubConfig(args: AbstractGeneratorAgent.GitHubConfigArgs<SdkContext>): FernGeneratorCli.GitHubConfig {
        // TODO: get from env
        return {
            sourceDirectory: "NONE",
            uri: "NONE",
            token: "token",
            branch: "NONE"
        };
    }
}
