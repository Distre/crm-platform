module.exports = {
    root: true,
    env: {
      node: true,      // ← sier at Node-globale som module, require osv. er tillatt
      es2022: true
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: ['@typescript-eslint'],
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
    ],
    rules: {
      'no-console': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
    },
    ignorePatterns: ['dist/', 'node_modules/', 'web-frontend/dist/'],
  };