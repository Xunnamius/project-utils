const sourceMapPlugin = 'babel-plugin-source-map-support';
const sourceMapValue = 'inline';

const devNextBabel = ['next/babel', {
    '@babel/preset-env': {
        // targets: {
        //     node: true
        // }
    }
}];

module.exports = {
    plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-export-default-from',
        '@babel/plugin-proposal-numeric-separator',
        '@babel/plugin-proposal-throw-expressions',
        '@babel/plugin-proposal-nullish-coalescing-operator',
        '@babel/plugin-proposal-optional-chaining'
    ],
    presets: [
        ['@babel/preset-flow'],
        ['@babel/preset-react'],
        ['next/babel']
    ],
    env: {
        production: {},
        development: {
            /* sourceMaps: sourceMapValue,
            plugins: [sourceMapPlugin], */
            presets: [devNextBabel]
        },
        debug: {
            /* sourceMaps: sourceMapValue,
            plugins: [sourceMapPlugin], */
            presets: [
                devNextBabel,
                ['@babel/preset-react', { development: true }],
            ]
        },
        generator: {
            comments: false,
            presets: ['@babel/preset-env']
        }
    }
};
