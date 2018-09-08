const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const { ANALYZE_WEBPACK_BUNDLES } = process.env

module.exports = (phase, {defaultConfig}) => { // eslint-disable-line no-unused-vars
    return {
        webpack: (config, { isServer }) => {
            if(ANALYZE_WEBPACK_BUNDLES) {
                config.plugins.push(new BundleAnalyzerPlugin({
                    analyzerMode: 'server',
                    analyzerPort: isServer ? 8888 : 8889,
                    openAnalyzer: true
                }))
            }

            // config.entry = './src/index.js';
            // config.output = {
            //     path: __dirname + '/dist',
            //     publicPath: '/',
            //     filename: 'bundle.js'
            // };

            // config.devServer = {
            //     contentBase: './dist'
            // };

            // config.module.rules.push({
            //     test: /\.js$/,
            //     exclude: /node_modules/,
            //     use: {
            //         loader: 'babel-loader'
            //     }
            // });

            return config;
        }
    }
};
