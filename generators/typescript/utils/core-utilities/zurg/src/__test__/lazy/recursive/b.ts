import { object } from "../../../builders/object/index.js";
import { optional } from "../../../builders/schema-utils/index.js";
import { schemaA } from "./a.js";

// @ts-expect-error
export const schemaB = object({
    a: optional(schemaA)
});
