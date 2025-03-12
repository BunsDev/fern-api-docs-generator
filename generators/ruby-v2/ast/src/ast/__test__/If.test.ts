import { ruby } from "../..";
import { BaseRubyCustomConfigSchema } from "../../custom-config/BaseRubyCustomConfigSchema";
import { Expression } from "../Expression";
import { Writer } from "../core/Writer";

describe("If", () => {
    let writerConfig: Writer.Args;

    beforeEach(() => {
        writerConfig = { customConfig: BaseRubyCustomConfigSchema.parse({ clientClassName: "Example" }) };
    });

    test("writes trailing if", () => {
        const if_ = ruby.if_({ conditional: Expression.boolean(true) });

        expect(if_.toString(writerConfig)).toMatchSnapshot();
    });
});
