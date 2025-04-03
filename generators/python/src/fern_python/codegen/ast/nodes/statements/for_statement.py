from __future__ import annotations

from typing import List, Optional, Union

from fern_python.codegen.ast.ast_node import AstNode, AstNodeMetadata, NodeWriter
from fern_python.codegen.ast.nodes.expressions import Expression


class ForStatement(AstNode):
    """
    AST node representing a 'for' loop statement in Python.
    """
    
    def __init__(
        self,
        target: str,
        iterable: Union[AstNode, str, Expression],
        body: List[AstNode],
        is_async: bool = False
    ):
        """
        Initialize a for statement.
        
        Args:
            target: The target variable name(s) that will receive values from the iterable.
            iterable: The iterable to loop over.
            body: The list of AST nodes representing the body of the for loop.
            is_async: Whether this is an 'async for' statement.
        """
        self.target = target
        self.iterable = Expression(iterable) if not isinstance(iterable, Expression) else iterable
        self.body = body
        self.is_async = is_async
        
    def get_metadata(self) -> AstNodeMetadata:
        metadata = self.iterable.get_metadata()
        for node in self.body:
            node_metadata = node.get_metadata()
            metadata.update(node_metadata)
        return metadata
    
    def write(self, writer: NodeWriter, should_write_as_snippet: Optional[bool] = None) -> None:
        """Write the for statement to the provided writer."""
        if self.is_async:
            writer.write("async ")
        
        writer.write(f"for {self.target} in ")
        self.iterable.write(writer=writer)
        writer.write(":")
        writer.write_newline_if_last_line_not()
        
        with writer.indent():
            if not self.body:
                writer.write_line("pass")
            else:
                for node in self.body:
                    node.write(writer=writer) 