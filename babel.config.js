const sourceMapPlugin = 'babel-plugin-source-map-support';
const sourceMapValue = 'inline';

// ? Next.js-specific Babel settings
const devNextBabelPreset = ['next/babel', {
    'preset-env': {
        // ! MUST BE FALSE (see: https://nextjs.org/docs/#customizing-babel-config)
        modules: false
    },
    'transform-runtime': {},
    'styled-jsx': {},
    'class-properties': {}
}];

// ? Transpile targets for jest tests
const testTargets = 'last 2 chrome versions';

module.exports = {
    plugins: [
        '@babel/plugin-proposal-export-default-from',
        '@babel/plugin-proposal-numeric-separator',
        '@babel/plugin-proposal-throw-expressions',
        '@babel/plugin-proposal-nullish-coalescing-operator',
        '@babel/plugin-proposal-json-strings',
        // * https://babeljs.io/blog/2018/09/17/decorators
        ['@babel/plugin-proposal-decorators', { 'decoratorsBeforeExport': true }],
        '@babel/plugin-proposal-optional-chaining'
    ],
    presets: [
        ['@babel/preset-flow'],
        ['@babel/preset-react']
    ],
    env: {
        production: {},
        debug: { /* defined elsewhere */ },
        test: {
            sourceMaps: sourceMapValue,
            plugins: [sourceMapPlugin],
            presets: [
                ['@babel/preset-env', { targets: testTargets }],
                ['@babel/preset-react', { development: true }]
            ]
        },
        development: {
            // ? Handled by Next.js and Webpack
            /* sourceMaps: sourceMapValue,
            plugins: [sourceMapPlugin], */
            presets: [devNextBabelPreset]
        },
        generator: {
            sourceMaps: sourceMapValue,
            plugins: [sourceMapPlugin],
            comments: false,
            presets: [
                ['@babel/preset-env', {
                    targets: {
                        node: true
                    }
                }]
            ]
        }
    }
};

// ? The "debug" environment copies the "development" environment, with a twist!
module.exports.env.debug = Object.assign({}, module.exports.env.development);
module.exports.env.debug.presets = [
    ...module.exports.env.debug.presets,
    ['@babel/preset-react', { development: true }],
];
