const jestConfig = require('./jest.config');

jestConfig.testPathIgnorePatterns = [
  "/node_modules",
  "/src",
  "/libs"
];

module.exports = jestConfig;
