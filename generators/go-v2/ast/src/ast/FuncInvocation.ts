import { GoTypeReference } from "./GoTypeReference.js";
import { AstNode } from "./core/AstNode.js";
import { Writer } from "./core/Writer.js";
import { writeArguments } from "./utils/writeArguments.js";

export declare namespace FuncInvocation {
    interface Args {
        /* The function to invoke */
        func: GoTypeReference;
        /* The arguments passed to the method */
        arguments_: AstNode[];
    }
}

export class FuncInvocation extends AstNode {
    private func: GoTypeReference;
    private arguments_: AstNode[];

    constructor({ func, arguments_ }: FuncInvocation.Args) {
        super();

        this.func = func;
        this.arguments_ = arguments_;
    }

    public write(writer: Writer): void {
        writer.writeNode(this.func);
        writeArguments({ writer, arguments_: this.arguments_ });
    }
}
