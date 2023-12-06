module.exports = {
  env: {
    es2022: true,
    node: true,
  },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
  overrides: [],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  rules: {
    indent: ["warn", 2],
    semi: ["warn", "always"],
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        ignoreRestSiblings: true,
        destructuredArrayIgnorePattern: "^_.*",
        argsIgnorePattern: "^_.*",
        caughtErrors: "none",
      },
    ],
  },
};
