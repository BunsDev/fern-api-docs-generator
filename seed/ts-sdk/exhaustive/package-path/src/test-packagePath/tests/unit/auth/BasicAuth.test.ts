import { BasicAuth } from "../../../../../src/test-packagePath/core/auth/BasicAuth.js";

describe("BasicAuth", () => {
    describe("toAuthorizationHeader", () => {
        it("correctly converts to header", () => {
            expect(
                BasicAuth.toAuthorizationHeader({
                    username: "username",
                    password: "password",
                }),
            ).toBe("Basic dXNlcm5hbWU6cGFzc3dvcmQ=");
        });
    });
    describe("fromAuthorizationHeader", () => {
        it("correctly parses header", () => {
            expect(BasicAuth.fromAuthorizationHeader("Basic dXNlcm5hbWU6cGFzc3dvcmQ=")).toEqual({
                username: "username",
                password: "password",
            });
        });
    });
});
