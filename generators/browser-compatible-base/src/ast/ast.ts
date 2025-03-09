import { AbstractAstNode } from "./AbstractAstNode";
import { AstNodeList } from "./AstNodeList";
import { Text } from "./Text";

export function ast(strings: TemplateStringsArray, ...values: (AbstractAstNode | string)[]): AbstractAstNode {
    const nodes: AbstractAstNode[] = [];
    for (let i = 0; i < strings.length; i++) {
        if (i > 0) {
            const value = values[i - 1];
            if (value instanceof AbstractAstNode) {
                nodes.push(value);
            } else if (typeof value === "string") {
                nodes.push(new Text(value));
            } else {
                throw new Error(`Unsupported value type: ${typeof value}`);
            }
        }
        nodes.push(new Text(strings[i] as string));
    }
    return new AstNodeList(nodes);
}
