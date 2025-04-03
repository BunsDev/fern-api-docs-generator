from __future__ import annotations

from typing import Optional

from fern_python.codegen.ast.ast_node import AstNode, AstNodeMetadata, NodeWriter


class PassStatement(AstNode):
    """
    AST node representing a 'pass' statement in Python.
    """
    
    def get_metadata(self) -> AstNodeMetadata:
        """Return empty metadata as 'pass' statement doesn't reference anything."""
        return AstNodeMetadata()
    
    def write(self, writer: NodeWriter, should_write_as_snippet: Optional[bool] = None) -> None:
        """Write the pass statement to the provided writer."""
        writer.write("pass")
        writer.write_newline_if_last_line_not() 