import { enum_ } from "../../builders/enum/index.js";
import { itSchemaIdentity } from "../utils/itSchema.js";
import { itValidate } from "../utils/itValidate.js";

describe("enum", () => {
    itSchemaIdentity(enum_(["A", "B", "C"]), "A");

    itSchemaIdentity(enum_(["A", "B", "C"]), "D" as any, {
        opts: { allowUnrecognizedEnumValues: true }
    });

    itValidate("invalid enum", enum_(["A", "B", "C"]), "D", [
        {
            message: 'Expected enum. Received "D".',
            path: []
        }
    ]);

    itValidate(
        "non-string",
        enum_(["A", "B", "C"]),
        [],
        [
            {
                message: "Expected string. Received list.",
                path: []
            }
        ]
    );
});
