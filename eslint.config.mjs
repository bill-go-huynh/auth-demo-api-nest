// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // External packages (libs) - @nestjs, @types, express, etc. (non-type imports)
            ['^@nestjs', '^@types', '^@', '^[a-z]'],
            ['^type @nestjs', '^type @types', '^type @', '^type [a-z]'],
            // Internal app imports (alias paths) - @auth, @users, @tasks, etc. (non-type imports)
            ['^@auth', '^@users', '^@tasks', '^@config', '^@database'],
            ['^type @auth', '^type @users', '^type @tasks', '^type @config', '^type @database'],
            // Relative imports (same folder or parent) (non-type imports)
            ['^\\.\\.?/'],
            ['^type \\.\\.?/'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
    },
  },
  {
    files: ['**/auth/**/serializers/**/*.ts', '**/auth/**/strategies/**/*.ts'],
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
    },
  },
);
