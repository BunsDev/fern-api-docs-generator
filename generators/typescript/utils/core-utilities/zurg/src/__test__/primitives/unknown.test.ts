import { unknown } from "../../builders/index.js";
import { itSchemaIdentity } from "../utils/itSchema.js";

describe("unknown", () => {
    itSchemaIdentity(unknown(), true);
});
