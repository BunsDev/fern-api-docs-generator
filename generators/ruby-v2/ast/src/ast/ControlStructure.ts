import { Expression } from "./Expression";
import { AstNode } from "./core/AstNode";

export declare namespace ControlStructure {
    export interface ConditionalConsequencePair {
        conditional: Expression;
        consequent?: AstNode[];
    }

    export interface ConditionalChain {
        conditions: ConditionalConsequencePair[];
        otherwise?: AstNode[];
    }
}

export abstract class ControlStructure extends AstNode {}
