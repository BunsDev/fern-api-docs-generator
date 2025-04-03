from __future__ import annotations

from typing import Optional, Union

from ...ast_node import AstNode, AstNodeMetadata, NodeWriter
from fern_python.codegen.ast.nodes.expressions import Expression


class ReturnStatement(AstNode):
    """
    AST node representing a 'return' statement in Python.
    Can be used with or without a value to return.
    """
    
    def __init__(
        self,
        value: Optional[Union[AstNode, str, Expression]] = None
    ):
        """
        Initialize a return statement.
        
        Args:
            value: The optional value to return. Can be an AstNode, Expression, or str.
                  If None, generates a plain 'return' statement.
        """
        self.value = Expression(value) if value is not None and not isinstance(value, Expression) else value
        
    def get_metadata(self) -> AstNodeMetadata:
        if self.value is None:
            return AstNodeMetadata()
        return self.value.get_metadata()
    
    def write(self, writer: NodeWriter, should_write_as_snippet: Optional[bool] = None) -> None:
        """Write the return statement to the provided writer."""
        writer.write("return")
        if self.value is not None:
            writer.write(" ")
            self.value.write(writer=writer)
        writer.write_newline_if_last_line_not()