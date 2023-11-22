module.exports = {
  extends: ['react-app', 'react-app/jest', 'plugin:unicorn/recommended'],
  plugins: ['unicorn'],
  rules: {
    'import/no-webpack-loader-syntax': 'off', // We do not use webpack
    'no-restricted-imports': [
      'warn',
      {
        paths: [
          {
            name: '@vegaprotocol/types',
            message: 'Please use @vegaprotocol/rest-clients instead'
          }, // These types come from GQL but are a hard dep of UI toolkit. The rest client types are accurate.
          {
            name: 'lodash',
            message:
              "Import the specific methods you need from lodash e.g. `import get from 'lodash/get'`. This helps with bundle sizing."
          }
        ]
      }
    ],
    'unicorn/no-null': 'off',
    'unicorn/no-array-reduce': 'off'
  },
  overrides: [
    // Jest files
    {
      extends: ['plugin:jest/style'],
      files: ['**/*.spec.ts', '**/*.spec.tsx'],
      plugins: ['jest'],
      rules: {
        'jest/consistent-test-it': 'warn',
        'unicorn/no-useless-undefined': 'off'
      }
    },
    // JSX files
    {
      files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
      extends: ['plugin:jsx-a11y/strict'],
      rules: {
        'jsx-a11y/no-autofocus': 'off'
      }
    }
  ]
}