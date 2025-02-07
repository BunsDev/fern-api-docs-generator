import { isNull, isPlainObject, mergeWith, omitBy } from "lodash-es";

export function mergeWithOverrides<T extends object>({ data, overrides, explicitNullIgnores }: { data: T; overrides: object; explicitNullIgnores?: string[] }): T {
    const merged = mergeWith(data, mergeWith, overrides, (obj, src) =>
        Array.isArray(obj) && Array.isArray(src)
            ? src.every((element) => typeof element === "object") && obj.every((element) => typeof element === "object")
                ? // nested arrays of objects are merged
                  undefined
                : // nested arrays of primitives are replaced
                  [...src]
            : undefined
    ) as T;
    // Remove any nullified values
    const filtered = omitDeepBy(merged, (value, _key, path) => isNull(value) && !(explicitNullIgnores ?? []).some(ignore => path.toLowerCase().includes(ignore.toLowerCase()))) as T;
    return filtered;
}

// This is essentially lodash's omitBy, but actually running through your object tree.
// The logic has been adapted from https://github.com/siberiacancode/lodash-omitdeep/tree/main.
interface OmitDeepBy {
    <T extends object>(
        object: T | null | undefined,
        predicate: (value: unknown, key: string, path: string) => boolean
    ): T;
}

type PredicateFunction = (value: unknown, key: string, path: string) => boolean;

export const omitDeepBy: OmitDeepBy = (object: unknown, cb: PredicateFunction): any => {
    function omitByDeepByOnOwnProps(object: unknown, parentPath: string = ''): unknown {
        if (Array.isArray(object)) {
            return object.map((element, index) => 
                omitByDeepByOnOwnProps(element, 
                    parentPath ? `${parentPath}.${index}` : index.toString()
                )
            );
        }

        if (isPlainObject(object)) {
            const temp: Record<string, unknown> = {};
            for (const [key, value] of Object.entries(object as Record<string, unknown>)) {
                const currentPath = parentPath ? `${parentPath}.${key}` : key;
                temp[key] = omitByDeepByOnOwnProps(value, currentPath);
            }
            return omitBy(temp, (value, key) => 
                cb(value, key, parentPath ? `${parentPath}.${key}` : key)
            );
        }

        return object;
    }

    return omitByDeepByOnOwnProps(object);
};
