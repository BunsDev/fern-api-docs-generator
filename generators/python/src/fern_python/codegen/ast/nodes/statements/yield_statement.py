from __future__ import annotations

from typing import Optional, Union

from fern_python.codegen.ast.ast_node import AstNode, AstNodeMetadata, NodeWriter
from fern_python.codegen.ast.nodes.expressions import Expression


class YieldStatement(AstNode):
    """
    AST node representing a 'yield' statement in Python.
    Can be used with or without a value to yield.
    """
    
    def __init__(
        self,
        value: Optional[Union[AstNode, str, Expression]] = None
    ):
        """
        Initialize a yield statement.
        
        Args:
            value: The optional value to yield. Can be an AstNode, Expression, or str.
                  If None, generates a plain 'yield' statement.
        """
        self.value = Expression(value) if value is not None and not isinstance(value, Expression) else value
        
    def get_metadata(self) -> AstNodeMetadata:
        if self.value is None:
            return AstNodeMetadata()
        return self.value.get_metadata()
    
    def write(self, writer: NodeWriter, should_write_as_snippet: Optional[bool] = None) -> None:
        """Write the yield statement to the provided writer."""
        writer.write("yield")
        if self.value is not None:
            writer.write(" ")
            self.value.write(writer=writer)
        writer.write_newline_if_last_line_not()