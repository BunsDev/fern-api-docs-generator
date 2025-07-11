import { Node18UniversalStreamWrapper } from "../../../../../../src/test-packagePath/core/fetcher/stream-wrappers/Node18UniversalStreamWrapper.js";
import { NodePre18StreamWrapper } from "../../../../../../src/test-packagePath/core/fetcher/stream-wrappers/NodePre18StreamWrapper.js";
import { UndiciStreamWrapper } from "../../../../../../src/test-packagePath/core/fetcher/stream-wrappers/UndiciStreamWrapper.js";
import { chooseStreamWrapper } from "../../../../../../src/test-packagePath/core/fetcher/stream-wrappers/chooseStreamWrapper.js";
import { RUNTIME } from "../../../../../../src/test-packagePath/core/runtime/index.js";

describe("chooseStreamWrapper", () => {
    beforeEach(() => {
        RUNTIME.type = "unknown";
        RUNTIME.parsedVersion = 0;
    });

    it('should return a Node18UniversalStreamWrapper when RUNTIME.type is "node" and RUNTIME.parsedVersion is not null and RUNTIME.parsedVersion is greater than or equal to 18', async () => {
        const expected = new Node18UniversalStreamWrapper(new ReadableStream());
        RUNTIME.type = "node";
        RUNTIME.parsedVersion = 18;

        const result = await chooseStreamWrapper(new ReadableStream());

        expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
    });

    it('should return a NodePre18StreamWrapper when RUNTIME.type is "node" and RUNTIME.parsedVersion is not null and RUNTIME.parsedVersion is less than 18', async () => {
        const stream = await import("readable-stream");
        const expected = new NodePre18StreamWrapper(new stream.Readable());

        RUNTIME.type = "node";
        RUNTIME.parsedVersion = 16;

        const result = await chooseStreamWrapper(new stream.Readable());

        expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
    });

    it('should return a Undici when RUNTIME.type is not "node"', async () => {
        const expected = new UndiciStreamWrapper(new ReadableStream());
        RUNTIME.type = "browser";

        const result = await chooseStreamWrapper(new ReadableStream());

        expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
    });
});
