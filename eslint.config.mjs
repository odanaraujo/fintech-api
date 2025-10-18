import js from "@eslint/js";
import globals from "globals";
import reactPlugin from "eslint-plugin-react";

export default [
  // Arquivos que o ESLint deve ignorar
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/out/**",
      "**/dist/**",
      "**/build/**",
    ],
  },

  // Configuração base recomendada do ESLint
  js.configs.recommended,

  // Configuração para todos os arquivos JavaScript
  {
    files: ["**/*.js", "**/*.jsx"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: reactPlugin,
    },
    rules: {
      // Regras de qualidade de código
      semi: ["error", "always"], // Obriga uso de ponto e vírgula
      quotes: ["error", "double"], // Usa aspas duplas
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }], // Avisa sobre variáveis não usadas
      "no-console": "off", // Permite console.log por enquanto (vamos restringir depois)
      "prefer-const": "error", // Prefere const quando variável não é reatribuída
      "no-var": "error", // Proíbe uso de var (usar let/const)

      // Regras do React
      "react/react-in-jsx-scope": "off", // Next.js não precisa importar React
      "react/prop-types": "off", // Desativa validação de PropTypes (pode usar TypeScript futuramente)
      "react/jsx-uses-react": "off",
      "react/jsx-uses-vars": "error",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },

  // Configuração específica para arquivos de teste
  {
    files: ["**/*.test.js", "**/*.spec.js", "tests/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      "no-console": "off", // Permite console.log em testes
    },
  },

  // Configuração específica para scripts e configurações
  {
    files: ["infra/**/*.js", "*.config.js", "*.config.mjs"],
    rules: {
      "no-console": "off", // Permite console.log em scripts
    },
  },
];
