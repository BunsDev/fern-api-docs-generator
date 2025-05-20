import { AbstractWriter } from "./AbstractWriter.js";

export abstract class AbstractAstNode {
    /**
     * Every AST node knows how to write itself to a string.
     */
    public abstract write(writer: AbstractWriter): void;
}
