const restrictedGlobals = require('confusing-browser-globals');

module.exports = {
    'parser': 'babel-eslint',
    'plugins': [
        'flowtype',
        'react',
        'jsx-a11y'
    ],
    'extends': [
        'eslint:recommended',
        'plugin:flowtype/recommended',
        'plugin:react/recommended',
        'react-app',
        'plugin:jsx-a11y/recommended'
    ],
    'parserOptions': {
        'ecmaVersion': 8,
        'sourceType': 'module',
        'ecmaFeatures': {
            'impliedStrict': true,
            'experimentalObjectRestSpread': true,
            'jsx': true,
        }
    },
    'env': {
        'es6': true,
        'node': true,
        'jest': true,
        'browser': true,
        'webextensions': true,
    },
    'rules': {
        'flowtype/space-after-type-colon': 'off',
        'no-console': 'off',
        'no-unused-vars': 'warn',
        'no-restricted-globals': ['warn'].concat(restrictedGlobals),
    }
};
