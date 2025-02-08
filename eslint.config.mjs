import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from "globals";

export default [
  {
    ignores: ["dist/*"]
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.browser,
      }
    },
    rules: {
      "no-irregular-whitespace": [
        "error", {
          "skipComments": true,
          "skipRegExps": true,
          "skipTemplates": true
        }
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          "args": "all",
          "argsIgnorePattern": "^_",
          "caughtErrors": "all",
          "caughtErrorsIgnorePattern": "^_",
          "destructuredArrayIgnorePattern": "^_",
          "varsIgnorePattern": "^_",
          "ignoreRestSiblings": true
        }
      ]
    }
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended
];