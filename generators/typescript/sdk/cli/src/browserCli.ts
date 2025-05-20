import { JavaScriptRuntime } from "@fern-typescript/commons";

import { SdkGeneratorCli } from "./SdkGeneratorCli.js";

void new SdkGeneratorCli({ targetRuntime: JavaScriptRuntime.BROWSER }).runCli();
