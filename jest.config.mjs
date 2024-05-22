/** @type {import('jest').Config} */
const config = {
  passWithNoTests: true,
  transform: {
    "^.+\\.(t|j)sx?$": ["@swc/jest", { sourceMaps: "inline" }],
  },
  testPathIgnorePatterns: ["/node_modules/"],
  coveragePathIgnorePatterns: ["/node_modules/"],
};
export default config;
