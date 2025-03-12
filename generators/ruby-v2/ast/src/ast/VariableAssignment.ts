import { Expression } from "./Expression";
import { AstNode } from "./core/AstNode";
import { Writer } from "./core/Writer";

export declare namespace VariableAssignment {
    export interface Args {
        variable: string;
        // TODO: This can be an expression or a control structure (if/unless/while/loop, etc)
        expression: Expression;
    }
}

export class VariableAssignment extends AstNode {
    public readonly variable: string;
    public readonly expression: Expression;

    constructor({ variable, expression }: VariableAssignment.Args) {
        super();

        this.variable = variable;
        this.expression = expression;
    }

    public write(writer: Writer): void {
        writer.write(`${this.variable} = `);
        this.expression.write(writer);
    }
}
