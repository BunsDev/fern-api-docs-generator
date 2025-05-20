import { SourceFile, ts } from "ts-morph";

import {
    ExportedDirectory,
    ExportedFilePath,
    convertExportedFilePathToFilePath
} from "../exports-manager/ExportedFilePath.js";
import { ImportsManager } from "../imports-manager/ImportsManager.js";
import { GetReferenceOpts, Reference } from "./Reference.js";
import { getEntityNameOfDirectory } from "./getEntityNameOfDirectory.js";
import { getExpressionToDirectory } from "./getExpressionToDirectory.js";
import { getRelativePathAsModuleSpecifierTo } from "./getRelativePathAsModuleSpecifierTo.js";

export function getReferenceToExportViaNamespaceImport({
    exportedName,
    filepathToNamespaceImport,
    filepathInsideNamespaceImport,
    namespaceImport,
    importsManager,
    referencedIn,
    subImport = []
}: {
    exportedName: string;
    filepathToNamespaceImport: ExportedFilePath;
    filepathInsideNamespaceImport: ExportedDirectory[] | ExportedFilePath | undefined;
    namespaceImport: string;
    importsManager: ImportsManager;
    referencedIn: SourceFile;
    subImport?: string[];
}): Reference {
    const addImport = () => {
        importsManager.addImport(
            getRelativePathAsModuleSpecifierTo({
                from: referencedIn,
                to: convertExportedFilePathToFilePath(filepathToNamespaceImport)
            }),
            { namespaceImport }
        );
    };

    const pathToDirectoryInsideNamespaceImport =
        filepathInsideNamespaceImport != null
            ? Array.isArray(filepathInsideNamespaceImport)
                ? filepathInsideNamespaceImport
                : filepathInsideNamespaceImport.directories
            : [];

    const entityName = [exportedName, ...subImport].reduce<ts.EntityName>(
        (acc, part) => ts.factory.createQualifiedName(acc, part),
        getEntityNameOfDirectory({
            pathToDirectory: pathToDirectoryInsideNamespaceImport,
            prefix: ts.factory.createIdentifier(namespaceImport)
        })
    );

    const expression = [exportedName, ...subImport].reduce<ts.Expression>(
        (acc, part) => ts.factory.createPropertyAccessExpression(acc, part),
        getExpressionToDirectory({
            pathToDirectory: pathToDirectoryInsideNamespaceImport,
            prefix: ts.factory.createIdentifier(namespaceImport)
        })
    );

    return {
        getTypeNode: ({ isForComment = false }: GetReferenceOpts = {}) => {
            if (!isForComment) {
                addImport();
            }
            return ts.factory.createTypeReferenceNode(entityName);
        },
        getEntityName: ({ isForComment = false }: GetReferenceOpts = {}) => {
            if (!isForComment) {
                addImport();
            }
            return entityName;
        },
        getExpression: ({ isForComment = false }: GetReferenceOpts = {}) => {
            if (!isForComment) {
                addImport();
            }
            return expression;
        }
    };
}
