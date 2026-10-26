import js from "@eslint/js";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import prettierPlugin from "eslint-plugin-prettier";
import importPlugin from "eslint-plugin-import";
import importSortPlugin from "eslint-plugin-simple-import-sort";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";

export default [
    {
        ignores: [
            "**/node_modules/**",
            "**/.next/**",
            "**/dist/**",
            "**/build/**",
            "**/coverage/**",
            "**/out/**",
            "**/*.config.js",
            "**/*.config.mjs",
        ],
    },

    // Common rules for the entire project
    {
        files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"],

        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ...globals.es2021,
            },
        },

        plugins: {
            prettier: prettierPlugin,
            import: importPlugin,
            "simple-import-sort": importSortPlugin,
        },

        rules: {
            ...js.configs.recommended.rules,

            "prettier/prettier": "error",
            "simple-import-sort/imports": "error",
            "simple-import-sort/exports": "error",
            "import/first": "error",
            "import/newline-after-import": ["error", { count: 1 }],
            "import/no-duplicates": "error",
            "no-console": "warn",
        },
    },

    // Shared TypeScript rules
    {
        files: ["**/*.{ts,tsx}"],

        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },

        plugins: {
            "@typescript-eslint": tsPlugin,
        },

        rules: {
            ...tsPlugin.configs.recommended.rules,

            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^(req|res|next|_)$",
                    varsIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_",
                },
            ],
        },
    },

    // Backend and shared Node.js code
    {
        files: ["backend/**/*.{js,mjs,cjs,ts}", "shared/**/*.{js,mjs,cjs,ts}"],

        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
    },

    // Frontend: browser globals and React
    {
        files: ["frontend/**/*.{js,jsx,ts,tsx}"],

        languageOptions: {
            globals: {
                ...globals.browser,
            },
        },

        plugins: {
            react: reactPlugin,
            "react-hooks": reactHooksPlugin,
        },

        settings: {
            react: {
                version: "detect",
            },
        },

        rules: {
            ...reactPlugin.configs.recommended.rules,
            ...reactHooksPlugin.configs.recommended.rules,

            "react/react-in-jsx-scope": "off",
            "react/prop-types": "off",
        },
    },

    // Next.js configuration runs in Node.js
    {
        files: ["frontend/next.config.{js,mjs,ts}"],

        languageOptions: {
            globals: {
                ...globals.node,
                process: "readonly",
            },
        },
    },
];
