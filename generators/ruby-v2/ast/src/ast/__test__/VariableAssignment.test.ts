import { ruby } from "../..";
import { BaseRubyCustomConfigSchema } from "../../custom-config/BaseRubyCustomConfigSchema";
import { Expression } from "../Expression";
import { Writer } from "../core/Writer";

describe("VariableAssignment", () => {
    let writerConfig: Writer.Args;

    beforeEach(() => {
        writerConfig = { customConfig: BaseRubyCustomConfigSchema.parse({ clientClassName: "Example" }) };
    });

    describe("write", () => {
        test("writes basic variable assignments", () => {
            const variable = ruby.variableAssignment({ variable: "foo", expression: Expression.string("bar") });

            expect(variable.toString(writerConfig)).toMatchSnapshot();
        });
    });
});
