import { Rule } from "../../Rule.js";
import { validateVersionConfigFileSchema } from "../../docsAst/validateVersionConfig.js";

export const ValidateVersionFileRule: Rule = {
    name: "validate-version-file",
    create: () => {
        return {
            versionFile: async ({ path, content }) => {
                const parseResult = await validateVersionConfigFileSchema({ value: content });
                if (parseResult.type === "success") {
                    return [];
                }
                return [
                    {
                        severity: "fatal",
                        message: `${parseResult.message}`
                    }
                ];
            }
        };
    }
};
