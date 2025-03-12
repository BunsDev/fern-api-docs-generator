import { ControlFlow } from "./ControlFlow";
import { AstNode } from "./core/AstNode";
import { Writer } from "./core/Writer";

export declare namespace If {
    export interface Args extends ControlFlow.Conditional {}
}

export class If extends ControlFlow {
    constructor({ expression, then }: If.Args) {
        super({
            chain: {
                conditionals: [{ expression, then }],
                otherwise: undefined
            }
        });
    }

    elsif_({ expression, then }: If.Args): this {
        return this.appendConditional({ expression, then });
    }

    else_(otherwise: AstNode[]): this {
        return this.setOtherwise(otherwise);
    }

    protected writeFirstConditional(writer: Writer, { expression, then }: ControlFlow.Conditional): void {
        writer.write("if ");
        expression.write(writer);

        if (then.length) {
            writer.indent();
            then.forEach((node, index) => {
                node.write(writer);
                if (index !== then.length - 1) {
                    writer.newLine();
                }
            });
            writer.dedent();
        }
    }
}
