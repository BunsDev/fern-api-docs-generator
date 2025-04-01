import typing
from dataclasses import dataclass
from typing import List, Optional

import fern.ir.resources as ir_types

from fern_python.codegen import AST, SourceFile
from fern_python.codegen.ast.nodes.code_writer.code_writer import CodeWriterFunction
from fern_python.generators.sdk.client_generator.endpoint_metadata_collector import (
    EndpointMetadataCollector,
)
from fern_python.generators.sdk.client_generator.endpoint_response_code_writer import (
    EndpointResponseCodeWriter,
)
from fern_python.snippet import SnippetRegistry, SnippetWriter

from ..context.sdk_generator_context import SdkGeneratorContext
from .constants import DEFAULT_BODY_PARAMETER_VALUE
from .endpoint_function_generator import EndpointFunctionGenerator
from .generated_root_client import GeneratedRootClient
from .websocket_connect_method_generator import WebsocketConnectMethodGenerator


@dataclass
class ConstructorParameter:
    constructor_parameter_name: str
    type_hint: AST.TypeHint
    private_member_name: typing.Optional[str] = None
    initializer: Optional[AST.Expression] = None


HTTPX_PRIMITIVE_DATA_TYPES = set(
    [
        ir_types.PrimitiveTypeV1.STRING,
        ir_types.PrimitiveTypeV1.INTEGER,
        ir_types.PrimitiveTypeV1.DOUBLE,
        ir_types.PrimitiveTypeV1.BOOLEAN,
    ]
)


class ClientGenerator:
    RESPONSE_VARIABLE = EndpointResponseCodeWriter.RESPONSE_VARIABLE
    RESPONSE_JSON_VARIABLE = EndpointResponseCodeWriter.RESPONSE_JSON_VARIABLE

    TOKEN_CONSTRUCTOR_PARAMETER_NAME = "token"
    TOKEN_MEMBER_NAME = "_token"

    def __init__(
        self,
        *,
        context: SdkGeneratorContext,
        package: ir_types.Package,
        subpackage_id: ir_types.SubpackageId,
        class_name: str,
        async_class_name: str,
        generated_root_client: GeneratedRootClient,
        snippet_registry: SnippetRegistry,
        snippet_writer: SnippetWriter,
        endpoint_metadata_collector: EndpointMetadataCollector,
        websocket: Optional[ir_types.WebSocketChannel],
    ):
        self._context = context
        self._package = package
        self._subpackage_id = subpackage_id
        self._class_name = class_name
        self._async_class_name = async_class_name
        self._generated_root_client = generated_root_client
        self._snippet_registry = snippet_registry
        self._snippet_writer = snippet_writer
        self._endpoint_metadata_collector = endpoint_metadata_collector
        self._websocket = websocket

    def generate(self, source_file: SourceFile) -> None:
        # Add imports for raw client classes first (at the top of the file)
        raw_client_class_name = self._context.get_raw_client_class_name_for_subpackage_service(self._subpackage_id)
        async_raw_client_class_name = self._context.get_async_raw_client_class_name_for_subpackage_service(self._subpackage_id)
        
        def write_imports(writer: AST.NodeWriter) -> None:
            writer.write_line(f"from .raw_client import {raw_client_class_name}, {async_raw_client_class_name}")
            
        source_file.add_arbitrary_code(AST.CodeWriter(write_imports))
        
        # Then add class declarations
        class_declaration = self._create_class_declaration(is_async=False)
        source_file.add_class_declaration(
            declaration=class_declaration,
            should_export=False,
        )
        source_file.add_class_declaration(
            declaration=self._create_class_declaration(is_async=True),
            should_export=False,
        )

    def _create_class_declaration(self, *, is_async: bool) -> AST.ClassDeclaration:
        constructor_parameters = self._get_constructor_parameters(is_async=is_async)

        named_parameters = [
            AST.NamedFunctionParameter(
                name=param.constructor_parameter_name,
                type_hint=param.type_hint,
                initializer=param.initializer,
            )
            for param in constructor_parameters
        ]

        class_declaration = AST.ClassDeclaration(
            name=self._async_class_name if is_async else self._class_name,
            constructor=AST.ClassConstructor(
                signature=AST.FunctionSignature(
                    named_parameters=named_parameters,
                ),
                body=AST.CodeWriter(self._get_write_constructor_body(is_async=is_async)),
            ),
        )
        
        # Add with_raw_response property (method with @property decorator)
        class_declaration.add_method(self._create_with_raw_response_method(is_async=is_async))

        if self._package.service is not None:
            service = self._context.ir.services[self._package.service]
            for endpoint in service.endpoints:
                endpoint_function_generator = EndpointFunctionGenerator(
                    context=self._context,
                    package=self._package,
                    service=service,
                    endpoint=endpoint,
                    idempotency_headers=self._context.ir.idempotency_headers,
                    is_async=is_async,
                    client_wrapper_member_name=self._get_client_wrapper_member_name(),
                    generated_root_client=self._generated_root_client,
                    snippet_writer=self._snippet_writer,
                    endpoint_metadata_collector=self._endpoint_metadata_collector,
                    is_raw_client=False,
                )
                generated_endpoint_functions = endpoint_function_generator.generate()
                for generated_endpoint_function in generated_endpoint_functions:
                    # Instead of using the generated function directly, we'll create a wrapper
                    # that delegates to the raw client and extracts the data
                    function_name = generated_endpoint_function.function.name
                    endpoint_method = self._create_endpoint_wrapper_method(
                        endpoint=endpoint,
                        is_async=is_async,
                        raw_function=generated_endpoint_function.function
                    )
                    class_declaration.add_method(endpoint_method)

        if self._websocket is not None and self._context.custom_config.should_generate_websocket_clients:
            websocket_connect_method_generator = WebsocketConnectMethodGenerator(
                context=self._context,
                package=self._package,
                subpackage_id=self._subpackage_id,
                websocket=self._websocket,
                client_wrapper_member_name=self._get_client_wrapper_member_name(),
                is_async=is_async,
            )
            generated_connect_method = websocket_connect_method_generator.generate()
            class_declaration.add_method(generated_connect_method.function)
            
        return class_declaration

    def _create_with_raw_response_method(self, *, is_async: bool) -> AST.FunctionDeclaration:
        """Create a method that returns the raw client for more control over the response."""
        # Create a reference to the appropriate raw client class
        raw_client_class_name = self._context.get_async_raw_client_class_name_for_subpackage_service(self._subpackage_id) if is_async else self._context.get_raw_client_class_name_for_subpackage_service(self._subpackage_id)
        
        raw_client_type = AST.ClassReference(
            qualified_name_excluding_import=(raw_client_class_name,),
        )
        
        def write_method_body(writer: AST.NodeWriter) -> None:
            writer.write_line('"""')
            writer.write_line("Retrieves a raw implementation of this client that returns raw responses.")
            writer.write_line("")
            writer.write_line("Returns")
            writer.write_line("-------")
            writer.write(f"{raw_client_class_name}")
            writer.write_line("")
            writer.write_line('"""')
            writer.write_line("return self._raw_client")
            
        return AST.FunctionDeclaration(
            name="with_raw_response",
            is_async=False,
            signature=AST.FunctionSignature(
                parameters=[],
                return_type=AST.TypeHint(raw_client_type)
            ),
            body=AST.CodeWriter(write_method_body),
            decorators=[
                AST.Expression(
                    AST.Reference(
                        qualified_name_excluding_import=("property",),
                        import_=None
                    )
                )
            ]
        )

    def _create_endpoint_wrapper_method(
        self, 
        endpoint: ir_types.HttpEndpoint, 
        is_async: bool,
        raw_function: AST.FunctionDeclaration
    ) -> AST.FunctionDeclaration:
        """Create a method that delegates to the raw client and extracts the data property."""
        
        # Build parameters string for the function call
        parameters = []
        for param in raw_function.signature.parameters:
            if isinstance(param, AST.FunctionParameter):
                parameters.append(param.name)
                
        for param in raw_function.signature.named_parameters:
            if param.name != "self":
                parameters.append(f"{param.name}={param.name}")
        
        parameters_str = ", ".join(parameters)
        
        # Extract return type for docstring - we want the inner type from HttpResponse[T]
        return_type_str = "None"
        if raw_function.signature.return_type:
            # Safe way to get the return type string without accessing type_parameters directly
            try:
                return_type_str = str(raw_function.signature.return_type)
                # If this looks like HttpResponse[SomeType] or AsyncHttpResponse[SomeType], extract SomeType
                if "HttpResponse[" in return_type_str:
                    start_idx = return_type_str.find("[") + 1
                    end_idx = return_type_str.rfind("]")
                    if start_idx > 0 and end_idx > start_idx:
                        return_type_str = return_type_str[start_idx:end_idx]
            except Exception:
                return_type_str = str(raw_function.signature.return_type)
        
        # For docstring, create our own clean version rather than copying from raw client
        def write_docstring(writer: AST.NodeWriter) -> None:
            writer.write_line('"""')
            # Add description if available
            if endpoint.docs is not None:
                writer.write_line(endpoint.docs)
                writer.write_line("")
                
            # Add parameter documentation
            writer.write_line("Parameters")
            writer.write_line("----------")
            for param in raw_function.signature.parameters:
                if isinstance(param, AST.FunctionParameter):
                    writer.write(f"{param.name} : ")
                    if param.type_hint:
                        # Use write_node to properly render TypeHint objects
                        writer.write_node(param.type_hint)
                    else:
                        writer.write("Any")
                    writer.write_line("")
                    writer.write_line("")
                    
            for param in raw_function.signature.named_parameters:
                if param.name != "self":
                    writer.write(f"{param.name} : ")
                    if param.type_hint:
                        # Use write_node to properly render TypeHint objects
                        writer.write_node(param.type_hint)
                    else:
                        writer.write("Any")
                    writer.write_line("")
                    if param.docs:
                        writer.write_line(f"    {param.docs}")
                    writer.write_line("")
            
            # Add return type documentation
            writer.write_line("Returns")
            writer.write_line("-------")
            
            # Use write_node for the return type if it's an AST.TypeHint object
            if isinstance(raw_function.signature.return_type, AST.TypeHint):
                try:
                    # Try to extract the inner type from HttpResponse[T]
                    type_str = str(raw_function.signature.return_type)
                    if "HttpResponse[" in type_str:
                        # This is likely HttpResponse[T], so let's try to get T
                        start_idx = type_str.find("[") + 1
                        end_idx = type_str.rfind("]")
                        if start_idx > 0 and end_idx > start_idx:
                            inner_type_str = type_str[start_idx:end_idx]
                            writer.write(inner_type_str)
                        else:
                            writer.write_node(raw_function.signature.return_type)
                    else:
                        writer.write_node(raw_function.signature.return_type)
                except Exception:
                    # Fallback to just showing whatever string we have
                    writer.write(str(raw_function.signature.return_type))
            else:
                # Use our pre-extracted string if the return type isn't a TypeHint
                writer.write(return_type_str)
                
            writer.write_line("")
            writer.write_line('"""')
        
        def write_method_body(writer: AST.NodeWriter) -> None:
            # Use our clean docstring instead of copying from raw function
            write_docstring(writer)
            
            # Call raw client method and extract data
            if is_async:
                writer.write_line(f"response = await self._raw_client.{endpoint.name.snake_case.safe_name}(")
                with writer.indent():
                    for param in parameters_str.split(", "):
                        if param:
                            writer.write_line(f"{param},")
                writer.write_line(")")
                writer.write_line("return response.data")
            else:
                # Alternative approach for the non-async case to avoid potential formatting issues
                writer.write_line(f"response = self._raw_client.{endpoint.name.snake_case.safe_name}(")
                with writer.indent():
                    for param in parameters_str.split(", "):
                        if param:
                            writer.write_line(f"{param},")
                writer.write_line(")")
                writer.write_line("return response.data")
                
        return AST.FunctionDeclaration(
            name=endpoint.name.snake_case.safe_name,
            is_async=is_async,
            signature=raw_function.signature,
            body=AST.CodeWriter(write_method_body)
        )

    def _get_constructor_parameters(self, *, is_async: bool) -> List[ConstructorParameter]:
        parameters: List[ConstructorParameter] = []
        
        # Instead of client_wrapper, now we take a raw client
        raw_client_class_name = self._context.get_async_raw_client_class_name_for_subpackage_service(self._subpackage_id) if is_async else self._context.get_raw_client_class_name_for_subpackage_service(self._subpackage_id)
        
        raw_client_type = AST.ClassReference(
            qualified_name_excluding_import=(raw_client_class_name,),
        )
        
        parameters.append(
            ConstructorParameter(
                constructor_parameter_name="raw_client",
                private_member_name="_raw_client",
                type_hint=AST.TypeHint(raw_client_type),
            )
        )

        return parameters

    def _get_write_constructor_body(self, *, is_async: bool) -> CodeWriterFunction:
        def _write_constructor_body(writer: AST.NodeWriter) -> None:
            constructor_parameters = self._get_constructor_parameters(is_async=is_async)
            for param in constructor_parameters:
                if param.private_member_name is not None:
                    writer.write_line(f"self.{param.private_member_name} = {param.constructor_parameter_name}")

        return _write_constructor_body

    def _get_client_wrapper_member_name(self) -> str:
        return "_client_wrapper"
