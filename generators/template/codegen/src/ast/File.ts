import { AstNode, Writer } from "@fern-api/generator-commons";
import { INDENT_SIZE } from "../lang";
import { Class } from "./Class";

export declare namespace File {
    interface Args {
        name: string,
        class: Class
    }
}

export class File extends AstNode {

    public readonly name: string;
    public readonly class: Class;

    constructor({ 
        name,
        class: classInstance,
    }: File.Args) {
        super(INDENT_SIZE);
        this.name = name;
        this.class = classInstance;
    }

    public write(writer: Writer): void {

        writer.write(`// 🌿 ${this.name}`);

        writer.newLine();

        writer.writeNode(this.class);

        writer.newLine();

    }
}
