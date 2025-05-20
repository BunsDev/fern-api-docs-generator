import { AbsoluteFilePath, RelativeFilePath, join } from "@fern-api/fs-utils";

import { ValidationViolation } from "../../../ValidationViolation.js";
import { getViolationsForRule } from "../../../testing-utils/getViolationsForRule.js";
import { ValidExampleErrorRule } from "../valid-example-error.js";

describe("valid-example-error", () => {
    it("simple", async () => {
        const violations = await getViolationsForRule({
            rule: ValidExampleErrorRule,
            absolutePathToWorkspace: join(
                AbsoluteFilePath.of(__dirname),
                RelativeFilePath.of("fixtures"),
                RelativeFilePath.of("simple")
            )
        });

        const expectedViolations: ValidationViolation[] = [
            {
                severity: "fatal",
                relativeFilepath: RelativeFilePath.of("error.yml"),
                nodePath: ["errors", "ForbiddenError", "type"],
                message: 'Expected example to be a string. Example is: {"foo":{"bar":"baz"}}'
            }
        ];

        expect(violations).toEqual(expectedViolations);
    });
});
