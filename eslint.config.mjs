// import globals from 'globals';
// import pluginJs from '@eslint/js';
// import tseslint from 'typescript-eslint';
// import tseslintParser from '@typescript-eslint/parser';

// /** @type {import('eslint').Linter.Config[]} */
// export default [
//   { files: ['src/**/*.ts'] },
//   {
//     languageOptions: { parser: tseslintParser, globals: { ...globals.node } },
//     rules: {
//       semi: 'error',
//       'no-unused-vars': ['error', { args: 'none' }],
//       'no-undef': 'error',
//       '@typescript-eslint/no-explicit-any': 'error',
//     },
//   },
//   pluginJs.configs.recommended,
//   ...tseslint.configs.recommended,
// ];

import eslintParser from '@typescript-eslint/parser';
import eslintPlugin from '@typescript-eslint/eslint-plugin';

const config = {
  files: ['**/*.ts', '**/*.js'],
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    parser: eslintParser,
    parserOptions: {
      project: './tsconfig.json',
    },
  },
  plugins: {
    '@typescript-eslint': eslintPlugin,
  },
  rules: {
    semi: ['error', 'always'],
    // quotes: ["error", "single"],
    '@typescript-eslint/no-unused-vars': ['warn'],
    '@typescript-eslint/no-explicit-any': ['error'],
  },
  ignorePatterns: ['src/types/**'],
};

export default config;

// import globals from 'globals';
// // import pluginJs from '@eslint/js';
// // import tseslint from '@typescript-eslint/eslint-plugin';
// import tseslintParser from '@typescript-eslint/parser';

// /** @type {import('eslint').Linter.Config} */
// export default {
//   files: ['src/**/*.ts'],
//   languageOptions: {
//     parser: tseslintParser,
//     globals: { ...globals.node },
//   },
//   plugins: ['@typescript-eslint'],
//   extends: [
//     'eslint:recommended',
//     'plugin:@typescript-eslint/recommended', // Используем рекомендованную конфигурацию TypeScript
//   ],
//   rules: {
//     semi: 'error', // Обязательная точка с запятой
//     '@typescript-eslint/no-unused-vars': ['error', { args: 'none' }], // Проверка неиспользуемых переменных
//     '@typescript-eslint/no-explicit-any': 'error', // Запрет на использование `any`
//   },
// };
