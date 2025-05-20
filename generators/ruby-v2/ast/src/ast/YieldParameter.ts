import { AstNode } from "../ruby.js";
import { Parameter } from "./Parameter.js";
import { Writer } from "./core/Writer.js";

export declare namespace YieldParameter {
    interface Args extends Parameter.Args {}
}

export class YieldParameter extends Parameter {
    public readonly initializer: AstNode | undefined;

    public write(writer: Writer): void {
        writer.write(`&${this.name}`);
    }
}
