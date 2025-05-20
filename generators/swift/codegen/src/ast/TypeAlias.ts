import Swift from "../index.js";
import { AccessLevel } from "./AccessLevel.js";
import { Type } from "./Type.js";
import { AstNode, Writer } from "./core/index.js";

export declare namespace TypeAlias {
    interface Args {
        accessLevel?: AccessLevel;
        name: string;
        type: Type;
    }
}

export class TypeAlias extends AstNode {
    public readonly accessLevel?: AccessLevel;
    public readonly name: string;
    public readonly type: Type;

    constructor(args: TypeAlias.Args) {
        super();
        this.accessLevel = args.accessLevel;
        this.name = args.name;
        this.type = args.type;
    }

    public write(writer: Writer): void {
        const title = [this.accessLevel, "typealias", this.name, "=", this.type.name]
            .filter((value) => value !== undefined)
            .join(" ");
        writer.write(title);
    }
}
