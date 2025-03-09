import { AbstractAstNode } from "./AbstractAstNode";
import { AbstractWriter } from "./AbstractWriter";

export class Text<T extends AbstractWriter> extends AbstractAstNode {
    constructor(private value: string) {
        super();
        this.value = value;
    }

    public write(writer: T): void {
        writer.write(this.value);
    }
}
