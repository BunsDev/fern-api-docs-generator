import { BaseRubyCustomConfigSchema } from "../../custom-config/BaseRubyCustomConfigSchema.js";
import { ruby } from "../../index.js";
import { MethodKind, MethodVisibility } from "../Method.js";
import { Writer } from "../core/Writer.js";

describe("Comment", () => {
    let writerConfig: Writer.Args;

    beforeEach(() => {
        writerConfig = { customConfig: BaseRubyCustomConfigSchema.parse({ clientClassName: "Example" }) };
    });

    test("does not write a comment with no content", () => {
        const comment = ruby.comment({});

        expect(comment.toString(writerConfig)).toMatchSnapshot();
    });

    test("writes single-line comments", () => {
        const comment = ruby.comment({ docs: "Hello there" });

        expect(comment.toString(writerConfig)).toMatchSnapshot();
    });

    test("writes multi-line comments", () => {
        const comment = ruby.comment({ docs: "Hello\nthere" });

        expect(comment.toString(writerConfig)).toMatchSnapshot();
    });
});
