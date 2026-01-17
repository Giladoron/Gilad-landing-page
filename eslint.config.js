import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off', // React 19 doesn't need import
      'react/prop-types': 'off', // Using TypeScript
      'react/no-unescaped-entities': 'off', // Allow Hebrew text and quotes in JSX
      '@typescript-eslint/no-unused-vars': 'warn', // Warn only, don't break build
      '@typescript-eslint/no-explicit-any': 'warn', // Warn only (Vimeo API uses any)
      // jsx-a11y: Allow interactive divs where semantically appropriate (we'll fix modal overlays)
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/no-static-element-interactions': 'warn',
      'jsx-a11y/no-noninteractive-element-interactions': 'warn',
    },
  },
  prettier,
  {
    ignores: ['dist', 'node_modules', '*.config.js', '*.config.ts'],
  }
);

