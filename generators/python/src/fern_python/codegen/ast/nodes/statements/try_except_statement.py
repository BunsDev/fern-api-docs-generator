from __future__ import annotations

from dataclasses import dataclass, field
from typing import List, Optional, Union

from fern_python.codegen.ast.ast_node import AstNode, AstNodeMetadata, NodeWriter
from fern_python.codegen.ast.nodes.expressions import Expression
from fern_python.codegen.ast.references import Reference


@dataclass
class ExceptClause:
    """
    Represents a single except clause in a try-except statement.
    """
    # The exception type to catch (can be a reference or expression)
    exception_type: Optional[Union[AstNode, str, Expression, Reference]] = None
    # Optional variable name to store the exception
    as_name: Optional[str] = None
    # The body of the except clause
    body: List[AstNode] = field(default_factory=list)
    
    def __post_init__(self):
        # Convert string or reference exception type to Expression
        if self.exception_type is not None and not isinstance(self.exception_type, Expression):
            self.exception_type = Expression(self.exception_type)


class TryExceptStatement(AstNode):
    """
    AST node representing a try-except statement in Python.
    Supports optional else and finally blocks.
    """
    
    def __init__(
        self,
        try_body: List[AstNode],
        except_clauses: Optional[List[ExceptClause]] = None,
        else_body: Optional[List[AstNode]] = None, 
        finally_body: Optional[List[AstNode]] = None
    ):
        """
        Initialize a try-except statement.
        
        Args:
            try_body: List of statements in the try block
            except_clauses: List of ExceptClause objects representing except blocks
            else_body: Optional list of statements for the else block (executed if no exception)
            finally_body: Optional list of statements for the finally block
        """
        self.try_body = try_body or []
        self.except_clauses = except_clauses or []
        self.else_body = else_body or []
        self.finally_body = finally_body or []
    
    def get_metadata(self) -> AstNodeMetadata:
        metadata = AstNodeMetadata()
        
        # Process all try body nodes
        for node in self.try_body:
            node_metadata = node.get_metadata()
            metadata.update(node_metadata)
        
        # Process all except clauses
        for clause in self.except_clauses:
            if clause.exception_type is not None:
                exception_metadata = clause.exception_type.get_metadata()
                metadata.update(exception_metadata)
            
            for node in clause.body:
                node_metadata = node.get_metadata()
                metadata.update(node_metadata)
        
        # Process else body if present
        for node in self.else_body:
            node_metadata = node.get_metadata()
            metadata.update(node_metadata)
        
        # Process finally body if present
        for node in self.finally_body:
            node_metadata = node.get_metadata()
            metadata.update(node_metadata)
            
        return metadata
    
    def write(self, writer: NodeWriter, should_write_as_snippet: Optional[bool] = None) -> None:
        """Write the try-except statement to the provided writer."""
        writer.write("try:")
        writer.write_newline_if_last_line_not()
        
        # Write try block
        with writer.indent():
            if not self.try_body:
                writer.write_line("pass")
            else:
                for node in self.try_body:
                    node.write(writer=writer)
        
        # Write except blocks
        for clause in self.except_clauses:
            writer.write("except")
            
            if clause.exception_type is not None:
                writer.write(" ")
                clause.exception_type.write(writer=writer)
                
                if clause.as_name is not None:
                    writer.write(f" as {clause.as_name}")
            
            writer.write(":")
            writer.write_newline_if_last_line_not()
            
            with writer.indent():
                if not clause.body:
                    writer.write_line("pass")
                else:
                    for node in clause.body:
                        node.write(writer=writer)
        
        # Write else block if present
        if self.else_body:
            writer.write("else:")
            writer.write_newline_if_last_line_not()
            
            with writer.indent():
                for node in self.else_body:
                    node.write(writer=writer)
        
        # Write finally block if present
        if self.finally_body:
            writer.write("finally:")
            writer.write_newline_if_last_line_not()
            
            with writer.indent():
                for node in self.finally_body:
                    node.write(writer=writer) 