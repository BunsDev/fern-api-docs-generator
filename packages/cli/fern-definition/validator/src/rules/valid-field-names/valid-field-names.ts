import { visitRawTypeDeclaration } from "@fern-api/fern-definition-schema";

import { Rule, RuleViolation } from "../../Rule.js";
import { validateEnumNames } from "./validateEnumNames.js";
import { validateUnionNames } from "./validateUnionNames.js";

export const ValidFieldNamesRule: Rule = {
    name: "valid-field-names",
    create: () => {
        return {
            definitionFile: {
                typeDeclaration: ({ declaration }) => {
                    return visitRawTypeDeclaration<RuleViolation[]>(declaration, {
                        alias: () => [],
                        enum: validateEnumNames,
                        object: () => [],
                        undiscriminatedUnion: () => [],
                        discriminatedUnion: validateUnionNames
                    });
                }
            }
        };
    }
};
