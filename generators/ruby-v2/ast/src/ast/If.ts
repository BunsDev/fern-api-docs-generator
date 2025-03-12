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

    public elsif_({ conditional, consequent }: If.Args): void {
        this.conditionalChain.conditions.push({ conditional, consequent });
    }

    public else_({ consequent }: Pick<If.Args, "consequent">): void {
        this.conditionalChain.otherwise = consequent;
    }

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

                    if (consequent) {
                        appendEnd = true;

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
                }

                i++;
            }
        }

        const { otherwise } = this.conditionalChain;

        if (otherwise) {
            appendEnd = true;

            writer.write("else");
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
            writer.dedent();
            writer.write("end");
        }
    }
}
