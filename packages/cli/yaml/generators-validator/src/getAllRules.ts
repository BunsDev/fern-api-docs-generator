import { Rule } from "./Rule.js";
import { CompatibleIrVersionsRule } from "./rules/compatible-ir-versions/index.js";

export function getAllRules(): Rule[] {
    return [CompatibleIrVersionsRule];
}
