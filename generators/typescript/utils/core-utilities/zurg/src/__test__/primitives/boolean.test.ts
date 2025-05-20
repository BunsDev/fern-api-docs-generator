import { boolean } from "../../builders/index.js";
import { itSchemaIdentity } from "../utils/itSchema.js";
import { itValidate } from "../utils/itValidate.js";

describe("boolean", () => {
    itSchemaIdentity(boolean(), true);

    itValidate("non-boolean", boolean(), {}, [
        {
            path: [],
            message: "Expected boolean. Received object."
        }
    ]);
});
