from __future__ import annotations

from typing import Optional, Union

from fern_python.codegen.ast.ast_node import AstNode, AstNodeMetadata, NodeWriter
from fern_python.codegen.ast.nodes.expressions import Expression
from fern_python.codegen.ast.references import Reference


class RaiseStatement(AstNode):
    """
    AST node representing a 'raise' statement in Python.
    
    This supports all forms of the raise statement:
    - raise                  # re-raise current exception
    - raise ExceptionType    # raise with type
    - raise exception_inst   # raise with instance
    - raise ExceptionType from cause   # raise with cause
    """
    
    def __init__(
        self,
        exception: Optional[Union[AstNode, str, Expression, Reference]] = None,
        cause: Optional[Union[AstNode, str, Expression, Reference]] = None
    ):
        """
        Initialize a raise statement.
        
        Args:
            exception: The exception to raise. Can be None (to re-raise the current exception),
                      a string, an Expression, a Reference, or any AstNode.
            cause: Optional cause for the exception (for "raise X from Y" syntax).
        """
        self.exception = Expression(exception) if exception is not None and not isinstance(exception, Expression) else exception
        self.cause = Expression(cause) if cause is not None and not isinstance(cause, Expression) else cause
    
    def get_metadata(self) -> AstNodeMetadata:
        metadata = AstNodeMetadata()
        
        if self.exception is not None:
            exception_metadata = self.exception.get_metadata()
            metadata.update(exception_metadata)
        
        if self.cause is not None:
            cause_metadata = self.cause.get_metadata()
            metadata.update(cause_metadata)
            
        return metadata
    
    def write(self, writer: NodeWriter, should_write_as_snippet: Optional[bool] = None) -> None:
        """Write the raise statement to the provided writer."""
        writer.write("raise")
        
        if self.exception is not None:
            writer.write(" ")
            self.exception.write(writer=writer)
        
        if self.cause is not None:
            writer.write(" from ")
            self.cause.write(writer=writer)
            
        writer.write_newline_if_last_line_not() 