import { ruby } from "../..";
import { BaseRubyCustomConfigSchema } from "../../custom-config/BaseRubyCustomConfigSchema";
import { Expression } from "../Expression";
import { Writer } from "../core/Writer";

describe("If", () => {
    let writerConfig: Writer.Args;

    beforeEach(() => {
        writerConfig = { customConfig: BaseRubyCustomConfigSchema.parse({ clientClassName: "Example" }) };
    });

    describe("write", () => {
        test("writes trailing if", () => {
            const if_ = ruby.if_({ conditional: Expression.boolean(true) });

            expect(if_.toString(writerConfig)).toMatchSnapshot();
        });

        test("writes if", () => {
            const if_ = ruby.if_({
                conditional: Expression.boolean(true),
                consequent: [Expression.string("It works!")]
            });

            expect(if_.toString(writerConfig)).toMatchSnapshot();
        });

        test("writes if/else", () => {
            const if_ = ruby
                .if_({
                    conditional: Expression.boolean(true),
                    consequent: [Expression.string("It works!")]
                })
                .else_({ consequent: [Expression.string("It doesn't work")] });

            expect(if_.toString(writerConfig)).toMatchSnapshot();
        });

        test("writes if/elsif/else", () => {
            const if_ = ruby
                .if_({ conditional: Expression.boolean(true), consequent: [Expression.string("in the if")] })
                .elsif_({ conditional: Expression.numeric(1), consequent: [Expression.string("in the elsif")] })
                .else_({ consequent: [Expression.string("in the else")] });

            expect(if_.toString(writerConfig)).toMatchSnapshot();
        });
    });
});
