import { number } from "../../builders/index.js";
import { itSchemaIdentity } from "../utils/itSchema.js";
import { itValidate } from "../utils/itValidate.js";

describe("number", () => {
    itSchemaIdentity(number(), 42);

    itValidate("non-number", number(), "hello", [
        {
            path: [],
            message: 'Expected number. Received "hello".'
        }
    ]);
});
