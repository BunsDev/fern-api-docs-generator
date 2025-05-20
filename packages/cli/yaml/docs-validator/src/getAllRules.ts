import { Rule } from "./Rule.js";
import { AccentColorContrastRule } from "./rules/accent-color-contrast/index.js";
import { AllRolesMustBeDeclaredRule } from "./rules/all-roles-must-be-declared/index.js";
import { FilepathsExistRule } from "./rules/filepaths-exist/index.js";
import { OnlyVersionedNavigation } from "./rules/only-versioned-navigation/index.js";
import { ValidDocsEndpoints } from "./rules/valid-docs-endpoints/index.js";
import { ValidFileTypes } from "./rules/valid-file-types/index.js";
import { ValidFrontmatter } from "./rules/valid-frontmatter/index.js";
import { ValidMarkdownLinks } from "./rules/valid-markdown-link/index.js";
import { ValidateProductFileRule } from "./rules/validate-product-file/index.js";
import { ValidateVersionFileRule } from "./rules/validate-version-file/index.js";

const allRules = [
    FilepathsExistRule,
    OnlyVersionedNavigation,
    ValidateVersionFileRule,
    ValidateProductFileRule,
    AccentColorContrastRule,
    ValidMarkdownLinks,
    ValidFileTypes,
    ValidDocsEndpoints,
    AllRolesMustBeDeclaredRule,
    ValidFrontmatter
    // ValidMarkdownFileReferences
];

export function getAllRules(exclusions?: string[]): Rule[] {
    if (!exclusions) {
        return allRules;
    }
    const set = new Set(exclusions);
    return allRules.filter((r) => !set.has(r.name));
}
