import { ControlStructure } from "./ControlStructure";
import { Expression } from "./Expression";
import { AstNode } from "./core/AstNode";
import { Writer } from "./core/Writer";

export declare namespace If {
    export interface Args {
        conditional: Expression;
        consequent: AstNode[];
    }
}

export class If extends ControlStructure {
    public conditionalChain: ControlStructure.ConditionalChain = { conditions: [] };

    constructor({ conditional, consequent }: ControlStructure.ConditionalConsequencePair) {
        super();

        this.conditionalChain = { conditions: [{ conditional, consequent }] };
    }

    public elsif_({ conditional, consequent }: If.Args): this {
        this.conditionalChain.conditions.push({ conditional, consequent });
        return this;
    }

    public else_({ consequent }: Pick<If.Args, "consequent">): this {
        this.conditionalChain.otherwise = consequent;
        return this;
    }

    // TODO: Whew, this is gnarly. Abstract out for other conditionals (unless, case, while, until)
    write(writer: Writer): void {
        const queue = this.conditionalChain.conditions;

        let i = 0;
        let appendEnd = false;

        while (queue.length) {
            const condition = queue.shift();

            if (condition) {
                const { conditional, consequent } = condition;

                if (i === 0) {
                    writer.write("if ");
                    conditional.write(writer);
                } else {
                    writer.newLine();
                    writer.write("elsif ");
                    conditional.write(writer);
                }

                if (consequent) {
                    if (i === 0) {
                        appendEnd = true;
                    }

                    writer.newLine();
                    writer.indent();
                    consequent.forEach((node, index) => {
                        node.write(writer);
                        if (index !== consequent.length - 1) {
                            writer.newLine();
                        }
                    });
                    writer.dedent();
                }

                i++;
            }
        }

        const { otherwise } = this.conditionalChain;

        if (otherwise) {
            appendEnd = true;

            writer.newLine();
            writer.write("else");
            writer.newLine();
            writer.indent();
            otherwise.forEach((node, index) => {
                node.write(writer);
                if (index !== otherwise.length - 1) {
                    writer.newLine();
                }
            });
            writer.dedent();
        }

        if (appendEnd) {
            writer.newLine();
            writer.write("end");
        }
    }
}
