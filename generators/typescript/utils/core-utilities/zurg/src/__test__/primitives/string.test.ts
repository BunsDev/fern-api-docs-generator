import { string } from "../../builders/index.js";
import { itSchemaIdentity } from "../utils/itSchema.js";
import { itValidate } from "../utils/itValidate.js";

describe("string", () => {
    itSchemaIdentity(string(), "hello");

    itValidate("non-string", string(), 42, [
        {
            path: [],
            message: "Expected string. Received 42."
        }
    ]);
});
