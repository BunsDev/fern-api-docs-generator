/* eslint-disable @typescript-eslint/no-extraneous-class */
import * as Ast from "./ast";

export default class Lang {

  static indentSize = 4;

  public static makeFileHeader(args: Ast.FileHeader.Args): Ast.FileHeader {
    return new Ast.FileHeader(args);
  }
  
  public static makeImport(args: Ast.Import.Args): Ast.Import {
    return new Ast.Import(args);
  }
  
  public static makeParam(args: Ast.Param.Args): Ast.Param {
    return new Ast.Param(args);
  }
  
  public static makeFunc(args: Ast.Func.Args): Ast.Func {
    return new Ast.Func(args);
  }
  
  public static makeClass(args: Ast.Class.Args): Ast.Class {
    return new Ast.Class(args);
  }
  
  public static makeFile(args: Ast.File.Args): Ast.File {
    return new Ast.File(args);
  }

}