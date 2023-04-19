module.exports = {
  root: true,
  plugins: ['@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  extends: ['eslint:recommended', 'prettier'],
  env: {
    browser: true,
    node: true,
  },
  overrides: [
    {
      files: ['*.ts'],
      parserOptions: {
        sourceType: 'module',
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
      },
      extends: ['plugin:@typescript-eslint/recommended'],
      rules: {
        '@typescript-eslint/switch-exhaustiveness-check': 'error',
      },
    },
  ],
};
