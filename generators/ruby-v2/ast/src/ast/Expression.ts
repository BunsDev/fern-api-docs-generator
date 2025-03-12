import { assertNever } from "@fern-api/core-utils";

import { AstNode } from "./core/AstNode";
import { Writer } from "./core/Writer";

export interface String_ {
    type: "string";
    value: string;
}

export interface Numeric {
    type: "numeric";
    value: number;
}

export interface Boolean_ {
    type: "boolean";
    value: boolean;
}

type InternalExpression = String_ | Numeric | Boolean_;

export class Expression extends AstNode {
    private constructor(public readonly internalExpression: InternalExpression) {
        super();
    }

    public write(writer: Writer): void {
        switch (this.internalExpression.type) {
            case "string":
                writer.write(`"${this.internalExpression.value}"`);
                break;
            case "numeric":
                writer.write(`${this.internalExpression.value}`);
                break;
            case "boolean":
                writer.write(`${this.internalExpression.value}`);
                break;
            default:
                assertNever(this.internalExpression);
        }
    }

    public static string(value: String_["value"]): Expression {
        return new this({ type: "string", value });
    }

    public static numeric(value: Numeric["value"]): Expression {
        return new this({ type: "numeric", value });
    }

    public static boolean(value: Boolean_["value"]): Expression {
        return new this({ type: "boolean", value });
    }
}
