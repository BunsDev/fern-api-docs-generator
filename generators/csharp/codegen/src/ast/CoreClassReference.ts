import { AstNode } from "./core/AstNode.js";
import { Writer } from "./core/Writer.js";

export declare namespace CoreClassReference {
    interface Args {
        /* The name of the C# class */
        name: string;
    }
}

export class CoreClassReference extends AstNode {
    public readonly name: string;

    constructor({ name }: CoreClassReference.Args) {
        super();
        this.name = name;
    }

    public write(writer: Writer): void {
        writer.write(`${this.name}`);
    }
}
