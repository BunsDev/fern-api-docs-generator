import { any } from "../../builders/index.js";
import { itSchemaIdentity } from "../utils/itSchema.js";

describe("any", () => {
    itSchemaIdentity(any(), true);
});
