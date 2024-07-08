import { AstNode, Writer } from "@fern-api/generator-commons";
import { INDENT_SIZE } from "../lang";

export declare namespace Param {
    interface Args {
        title: string;
        type: string; // TODO
        defaultValue?: string; // TODO
    }
}

export class Param extends AstNode {

    public readonly title: string;
    public readonly type: string;
    public readonly defaultValue?: string;

    constructor({ 
        title,
        type,
        defaultValue,
    }: Param.Args) {
        super(INDENT_SIZE);
        this.title = title;
        this.type = type;
        this.defaultValue = defaultValue;
    }

    public write(writer: Writer): void {

        let title = [`${this.title}:`, this.type].join(" ");

        if (this.defaultValue) {
            title += ` = ${this.defaultValue}`;
        }

        writer.write(title);
        
    }
}
