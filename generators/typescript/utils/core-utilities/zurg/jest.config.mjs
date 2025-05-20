/** @type {import('jest').Config} */
export default {
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: [ "**/__tests__/**/*.ts?(x)", "**/?(*.)+(spec|test).ts?(x)" ],
    moduleNameMapper: {
      "^(\\.{1,2}/.*)\\.js$": "$1"
    },
};
