/* eslint-disable @typescript-eslint/no-extraneous-class */
import { Enum } from "./ast/Enum.js";
import { EnumCase } from "./ast/EnumCase.js";
import { Field } from "./ast/Field.js";
import { File } from "./ast/File.js";
import { FileHeader } from "./ast/FileHeader.js";
import { Func } from "./ast/Func.js";
import { Import } from "./ast/Import.js";
import { Param } from "./ast/Param.js";
import { Primitive } from "./ast/Primitive.js";
import { Struct } from "./ast/Struct.js";
import { Type } from "./ast/Type.js";
import { TypeAlias } from "./ast/TypeAlias.js";

export { AccessLevel } from "./ast/AccessLevel.js";
export { ClassLevel } from "./ast/ClassLevel.js";
export { Enum } from "./ast/Enum.js";
export { EnumCase } from "./ast/EnumCase.js";
export { File } from "./ast/File.js";
export { FileHeader } from "./ast/FileHeader.js";
export { Func } from "./ast/Func.js";
export { FunctionModifier } from "./ast/FunctionModifier.js";
export { Import } from "./ast/Import.js";
export { Param } from "./ast/Param.js";
export { Primitive } from "./ast/Primitive.js";
export type { PrimitiveKey } from "./ast/Primitive.js";
export { Struct } from "./ast/Struct.js";
export { Type } from "./ast/Type.js";
export { VariableType } from "./ast/VariableType.js";
export { SwiftFile } from "./project/SwiftFile.js";

export default class Swift {
    static indentSize = 4;

    public static makeFileHeader(args: FileHeader.Args): FileHeader {
        return new FileHeader(args);
    }

    public static makeTypeAlias(args: TypeAlias.Args): TypeAlias {
        return new TypeAlias(args);
    }

    public static makeImport(args: Import.Args): Import {
        return new Import(args);
    }

    public static makeField(args: Field.Args): Field {
        return new Field(args);
    }

    public static makeParam(args: Param.Args): Param {
        return new Param(args);
    }

    public static makeEnumCase(args: EnumCase.Args): EnumCase {
        return new EnumCase(args);
    }

    public static makeEnum(args: Enum.Args): Enum {
        return new Enum(args);
    }

    public static makeFunc(args: Func.Args): Func {
        return new Func(args);
    }

    public static makePrimitive(args: Primitive.Args): Primitive {
        return new Primitive(args);
    }

    public static makeStruct(args: Struct.Args): Struct {
        return new Struct(args);
    }

    public static makeType(args: Type.Args): Type {
        return new Type(args);
    }

    public static makeFile(args: File.Args): File {
        return new File(args);
    }
}
