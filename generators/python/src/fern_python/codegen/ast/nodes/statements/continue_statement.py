from __future__ import annotations

from typing import Optional

from fern_python.codegen.ast.ast_node import AstNode, AstNodeMetadata, NodeWriter


class ContinueStatement(AstNode):
    """
    AST node representing a 'continue' statement in Python.
    """
    
    def get_metadata(self) -> AstNodeMetadata:
        return AstNodeMetadata()
    
    def write(self, writer: NodeWriter, should_write_as_snippet: Optional[bool] = None) -> None:
        """Write the continue statement to the provided writer."""
        writer.write("continue")
        writer.write_newline_if_last_line_not() 