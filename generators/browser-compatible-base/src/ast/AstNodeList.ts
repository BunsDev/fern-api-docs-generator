import { AbstractAstNode } from "./AbstractAstNode";
import { AbstractWriter } from "./AbstractWriter";

export class AstNodeList<T extends AbstractWriter> extends AbstractAstNode {
    constructor(private nodes: AbstractAstNode[]) {
        super();
    }
    public write(writer: T) {
        for (const node of this.nodes) {
            {
                writer.writeNode(node);
            }
        }
    }
}
