module.exports = {
    env: {
      browser: true,
      node: false,
    },
    globals: {
      getInitEnv: true,
      InitEnv: true,
      Promise: true,
    },
    parser: '@typescript-eslint/parser',
    extends: [
      'plugin:react/recommended',
      'plugin:@typescript-eslint/recommended',
      'prettier/@typescript-eslint', //屏蔽eslint
      'plugin:prettier/recommended', //转eslint
      'prettier/react',
    ],
    plugins: ['@typescript-eslint/eslint-plugin'],
    parserOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
      },
    },
    rules: {
      'no-undef': 'error',
      'sort-imports': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-parameter-properties': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    overrides: [
      {
        files: ['**/*.js'],
        env: {
          browser: false,
          node: true,
        },
        rules: {
          '@typescript-eslint/no-var-requires': 'off',
        },
      },
    ],
  };
