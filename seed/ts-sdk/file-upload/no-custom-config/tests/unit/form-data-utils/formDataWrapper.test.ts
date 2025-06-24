/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Readable, Writable } from "stream";
import { OldNodeFormData, WebFormData } from "../../../src/core/form-data-utils/FormDataWrapper";
import { File, Blob } from "buffer";
import { pipeline } from "stream/promises";

describe("CrossPlatformFormData", () => {
    describe("OldNodeFormData", () => {
        let formData: any;

        beforeEach(async () => {
            formData = new OldNodeFormData();
            await formData.setup();
        });

        it("should append a Readable stream with a specified filename", async () => {
            const value = Readable.from(["file content"]);
            const filename = "testfile.txt";

            await formData.appendFile("file", value, filename);

            const { body } = (await formData.getRequest()) as { body: Readable };
            const data = await streamToString(body);
            expect(data).toContain(filename);
        });

        it("should append a Blob with a specified filename", async () => {
            const value = new Blob(["file content"], { type: "text/plain" });
            const filename = "testfile.txt";

            await formData.appendFile("file", value, filename);

            const request = await formData.getRequest();
            const buffer = request.body.getBuffer();
            const data = buffer.toString("utf8");
            expect(data).toContain(filename);
        });

        it("should append stream with path", async () => {
            const expectedFileName = "testfile.txt";
            const filePath = "/test/testfile.txt";
            const stream = Readable.from(["file content"]);
            (stream as any).path = filePath;
            await formData.appendFile("file", stream);

            const request = (await formData.getRequest()) as { body: Readable };
            const data = await streamToString(request.body);
            expect(data).toContain('Content-Disposition: form-data; name="file"; filename="' + expectedFileName + '"');
        });
    });

    describe("WebFormData", () => {
        let formData: any;

        beforeEach(async () => {
            formData = new WebFormData();
            await formData.setup();
        });

        it("should append a Readable stream with a specified filename", async () => {
            const value = Readable.from(["file content"]);
            const filename = "testfile.txt";

            await formData.appendFile("file", value, filename);

            const request = formData.getRequest();
            expect(request.body.get("file").name).toBe(filename);
        });

        it("should append a Blob with a specified filename", async () => {
            const value = new Blob(["file content"], { type: "text/plain" });
            const filename = "testfile.txt";

            await formData.appendFile("file", value, filename);

            const request = formData.getRequest();

            expect(request.body.get("file").name).toBe(filename);
        });

        it("should append a File with a specified filename", async () => {
            const filename = "testfile.txt";
            const value = new File(["file content"], filename);

            await formData.appendFile("file", value);

            const request = formData.getRequest();
            expect(request.body.get("file").name).toBe(filename);
        });

        it("should append a File with an explicit filename", async () => {
            const filename = "testfile.txt";
            const value = new File(["file content"], filename);

            await formData.appendFile("file", value, "test.txt");

            const request = formData.getRequest();
            expect(request.body.get("file").name).toBe("test.txt");
        });
    });
});

async function streamToString(readable: NodeJS.ReadableStream): Promise<string> {
    const chunks: Buffer[] = [];
    const writable = new Writable({
        write(chunk, _encoding, callback) {
            chunks.push(chunk);
            callback();
        },
    });

    await pipeline(readable, writable);
    return Buffer.concat(chunks).toString("utf8");
}
