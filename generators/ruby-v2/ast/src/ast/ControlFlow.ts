import { AstNode } from "../ruby";
import { Expression } from "./Expression";
import { Writer } from "./core/Writer";

export declare namespace ControlFlow {
    export type Otherwise = AstNode[] | undefined;

    export interface Args {
        chain: Chain;
    }

    export interface Conditional {
        /* The condition to check. */
        expression: Expression;
        /* What is then executed if above condition is truthy. */
        then: AstNode[];
    }

    export interface Chain {
        /* A set of conditional statements (e.g., the first element is the "if", subsequent elements are the "elsif"s). */
        conditionals: Conditional[];
        /* What is executed if none of the above conditions are truthy (the "else"). */
        otherwise: Otherwise;
    }
}

export abstract class ControlFlow extends AstNode {
    private readonly chain: ControlFlow.Chain;

    constructor({ chain }: ControlFlow.Args) {
        super();

        this.chain = chain;
    }

    protected appendConditional(conditional: ControlFlow.Conditional): this {
        this.chain.conditionals.push(conditional);

        return this;
    }

    protected setOtherwise(nodes: AstNode[]): this {
        this.chain.otherwise = nodes;

        return this;
    }

    protected abstract writeFirstConditional(writer: Writer, conditional: ControlFlow.Conditional): void;

    protected abstract writeSubsequentConditional(writer: Writer, conditional: ControlFlow.Conditional): void;

    protected abstract writeOtherwise(writer: Writer, otherwise: ControlFlow.Otherwise): void;

    write(writer: Writer): void {
        this.chain.conditionals.forEach((conditional, index) => {
            if (index === 0) {
                this.writeFirstConditional(writer, conditional);
            } else {
                this.writeSubsequentConditional(writer, conditional);
            }
        });

        if (this.chain.otherwise) {
            this.writeOtherwise(writer, this.chain.otherwise);
        }
    }
}
