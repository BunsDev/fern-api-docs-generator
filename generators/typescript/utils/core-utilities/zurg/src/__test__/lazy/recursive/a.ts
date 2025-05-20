import { object } from "../../../builders/object/index.js";
import { schemaB } from "./b.js";

// @ts-expect-error
export const schemaA = object({
    b: schemaB
});
