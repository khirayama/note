module.exports = {
  clearMocks: true,
  coverageDirectory: "coverage",
  globals: {
    "ts-jest": {
      "tsConfigFile": "tsconfig.json"
    }
  },
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "json"
  ],
  testEnvironment: "node",
  testMatch: [
    "**/*.test.+(ts|tsx|js)"
  ],
  testPathIgnorePatterns: [
    "/node_modules",
    "/src",
    "/libs"
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
};
