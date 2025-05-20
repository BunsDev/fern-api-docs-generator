import { GeneratorNotificationService } from "@fern-api/base-generator";
import { AbstractGoGeneratorContext } from "@fern-api/go-ast";
import { GoProject } from "@fern-api/go-base";

import { FernGeneratorExec } from "@fern-fern/generator-exec-sdk";
import { IntermediateRepresentation } from "@fern-fern/ir-sdk/api";

import { GoGeneratorAgent } from "./GoGeneratorAgent.js";
import { SdkCustomConfigSchema } from "./SdkCustomConfig.js";
import { ReadmeConfigBuilder } from "./readme/ReadmeConfigBuilder.js";

export class SdkGeneratorContext extends AbstractGoGeneratorContext<SdkCustomConfigSchema> {
    public readonly generatorAgent: GoGeneratorAgent;
    public readonly project: GoProject;

    public constructor(
        public readonly ir: IntermediateRepresentation,
        public readonly config: FernGeneratorExec.config.GeneratorConfig,
        public readonly customConfig: SdkCustomConfigSchema,
        public readonly generatorNotificationService: GeneratorNotificationService
    ) {
        super(ir, config, customConfig, generatorNotificationService);
        this.project = new GoProject({ context: this });
        this.generatorAgent = new GoGeneratorAgent({
            logger: this.logger,
            config: this.config,
            readmeConfigBuilder: new ReadmeConfigBuilder(),
            ir
        });
    }
}
