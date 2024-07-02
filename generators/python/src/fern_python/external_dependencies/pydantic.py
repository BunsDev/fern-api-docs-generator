
import enum

from fern_python.codegen import AST

PYDANTIC_DEPENDENCY = AST.Dependency(name="pydantic", version=">= 1.9.2")
PYDANTIC_V1_DEPENDENCY = AST.Dependency(name="pydantic", version=">= 1.9.2,<= 1.10.14")
PYDANTIC_V2_DEPENDENCY = AST.Dependency(name="pydantic", version=">= 2.0.0")


class PydanticVersionCompatibility(str, enum.Enum):
    V1 = "v1"
    V2 = "v2"
    Both = "both"


def _export(*export: str) -> AST.ClassReference:
    return AST.ClassReference(
        import_=AST.ReferenceImport(
            module=AST.Module.external(
                dependency=PYDANTIC_DEPENDENCY,
                module_path=("pydantic",),
            ),
        ),
        qualified_name_excluding_import=export,
    )

class Pydantic:
    @staticmethod
    def Field() -> AST.ClassReference:
        return _export("Field")

    @staticmethod
    def BaseModel() -> AST.ClassReference:
        return _export("BaseModel")
    
    @staticmethod
    def ConfigDict() -> AST.ClassReference:
        return _export("ConfigDict")

    @staticmethod
    def PrivateAttr() -> AST.ClassReference:
        return _export("PrivateAttr")

    class Extra:
        @staticmethod
        def forbid() -> AST.Expression:
            return AST.Expression(_export("Extra", "forbid"))

        @staticmethod
        def allow() -> AST.Expression:
            return AST.Expression(_export("Extra", "allow"))
