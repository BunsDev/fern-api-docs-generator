import { AbstractPythonGeneratorContext } from "@fern-api/python-base";

import { PydanticModelCustomConfigSchema } from "./ModelCustomConfig.js";

export class PydanticModelGeneratorContext extends AbstractPythonGeneratorContext<PydanticModelCustomConfigSchema> {}
