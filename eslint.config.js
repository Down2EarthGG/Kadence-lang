import js from "@eslint/js";

export default [
    js.configs.recommended,
    {
        ignores: [
            "**/node_modules/",
            "**/*.kade",
            "**/*.kade.js",
            "examples/**/*.js",
            "tests/**/*.js",
            "stdlib/**/*.js",
            "kadence-vscode/**/*.js",
            "apps/**/*.js",
            "dist/",
            "build/",
            "apps/**/public/**",
            "*.log",
            "*.txt",
            ".vscode/",
        ],
    },
    {
        files: ["**/*.js", "**/*.mjs"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                // Node.js
                process: "readonly",
                require: "readonly",
                module: "readonly",
                __dirname: "readonly",
                __filename: "readonly",
                exports: "writable",
                // Browser
                window: "readonly",
                document: "readonly",
                console: "readonly",
                fetch: "readonly",
                prompt: "readonly",
                setTimeout: "readonly",
                setInterval: "readonly",
                clearTimeout: "readonly",
                clearInterval: "readonly",
                JSON: "readonly",
                Math: "readonly",
                Object: "readonly",
                Array: "readonly",
                Number: "readonly",
                String: "readonly",
                Boolean: "readonly",
                RegExp: "readonly",
            },
        },
        rules: {
            "no-unused-vars": ["warn", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_", "caughtErrorsIgnorePattern": "^_" }],
            "no-console": "off",
            "no-undef": "warn",
            "no-inner-declarations": "off",
        },
    },
];
