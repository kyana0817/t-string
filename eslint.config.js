import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import importNewlines from "eslint-plugin-import-newlines";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import stylistic from '@stylistic/eslint-plugin'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default defineConfig([globalIgnores(["node_modules/*", "esm/*", "lib/*"]), {
  extends: compat.extends("eslint:recommended"),
  languageOptions: {
    globals: {
      ...globals.node,
    },
    
    ecmaVersion: 2022,
    sourceType: "module",
  },
}, {
  files: ["**/*.ts", "**/*.tsx"],
  extends: fixupConfigRules(compat.extends(
    "eslint:recommended",
    "plugin:import/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:@typescript-eslint/recommended",
  )),
  plugins: {
    '@stylistic': stylistic,
    "import-newlines": importNewlines,
  },
  languageOptions: {
    globals: {
      ...globals.browser,
      ...globals.node,
    },
    parser: tsParser,
  },
  settings: {
    react: {
      version: "detect",
    },    
    "import/resolver": {
      typescript: {},
    },
  },
  rules: {
    "@stylistic/newline-per-chained-call": ["error", {
      ignoreChainWithDepth: 2,
    }],
    "@stylistic/indent": ["error", 2, {
      SwitchCase: 1,
    }],
    "@stylistic/max-len": ["error", 80, 2, {
      tabWidth: 2,
      ignoreUrls: true,
      ignoreComments: false,
      ignoreRegExpLiterals: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
    }],
    "@stylistic/semi": ["error", "always"],
    "@stylistic/quotes": ["error", "single", {
      allowTemplateLiterals: "always",
    }],
    "@stylisticlinebreak-style": 0,
    "@stylistic/eol-last": ["error", "always"],
    "@stylistic/object-curly-spacing": ["error", "always"],
    "no-use-before-define": "error",    
    "@stylistic/no-multiple-empty-lines": ["error", {
      max: 2,
      maxEOF: 1,
    }],    
    "@stylistic/array-bracket-newline": ["error", {
      multiline: true,
      minItems: 3,
    }],    
    "@stylistic/object-curly-newline": ["error", {
      ObjectExpression: {
        minProperties: 3,
        multiline: true,
        consistent: true,
      },      
      ObjectPattern: {
        multiline: true,
        minProperties: 2,
      },      
      ImportDeclaration: {
        multiline: true,
      },      
      ExportDeclaration: {
        multiline: true,
        minProperties: 3,
      },
    }],
    "no-duplicate-imports": "off",
    "import/order": ["error", {
      groups: [
        "builtin",
        "external",
        "internal",
        "parent",
        "sibling",
        "index",
        "object",
        "type",
      ],
      "newlines-between": "never",
      alphabetize: {
        order: "asc",
        caseInsensitive: true,
      },
    }],
    "import/newline-after-import": ["error", {
      count: 2,
    }],
    "import/no-duplicates": ["error", {
      "prefer-inline": true,
    }],
    "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
    "import/default": "off",
    "import/no-named-as-default-member": "off",
    "import/no-named-as-default": "off",
    "@typescript-eslint/no-unused-vars": ["error", {
      argsIgnorePattern: "^_",
      varsIgnorePattern: "^_",
      caughtErrorsIgnorePattern: "^_",
    }],
    "@typescript-eslint/consistent-type-imports": ["error", {
      prefer: "type-imports",
      fixStyle: "separate-type-imports",
    }],
    "@typescript-eslint/no-import-type-side-effects": "error",
    "@typescript-eslint/explicit-function-return-type": ["off"],
    "@typescript-eslint/explicit-module-boundary-types": ["off"],
    "@typescript-eslint/no-empty-function": ["off"],
    "@typescript-eslint/no-explicit-any": ["off"],
    "@typescript-eslint/consistent-type-assertions": ["off"],
    "import-newlines/enforce": ["error", {
      "max-len": 80,
      semi: true
    }],
  },
}]);
