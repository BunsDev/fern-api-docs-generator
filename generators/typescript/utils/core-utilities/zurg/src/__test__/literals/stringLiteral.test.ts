import { stringLiteral } from "../../builders/index.js";
import { itSchemaIdentity } from "../utils/itSchema.js";
import { itValidate } from "../utils/itValidate.js";

describe("stringLiteral", () => {
    itSchemaIdentity(stringLiteral("A"), "A");

    itValidate("incorrect string", stringLiteral("A"), "B", [
        {
            path: [],
            message: 'Expected "A". Received "B".'
        }
    ]);

    itValidate("non-string", stringLiteral("A"), 42, [
        {
            path: [],
            message: 'Expected "A". Received 42.'
        }
    ]);
});
