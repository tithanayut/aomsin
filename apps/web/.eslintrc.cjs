module.exports = {
  root: true,
  extends: ['airbnb', 'airbnb-typescript', 'custom'],
  parserOptions: {
    project: ['./apps/web/tsconfig.json'],
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
  },
};
