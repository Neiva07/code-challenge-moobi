module.exports = {
  globals: {
    "ts-jest": {
      tsConfigFile: "tsconfig.json"
    }
  },
  moduleFileExtensions: ["ts", "js"],
  setupTestFrameworkScriptFile: "<rootDir>/jest.setup.ts",
  transform: {
    "^.+\\.(ts|tsx)$": "./node_modules/ts-jest/preprocessor.js"
  },
  testMatch: ["**/test/**/*.test.(ts|js)"],
  testEnvironment: "node"
};
