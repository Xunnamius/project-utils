/* @flow */

import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import { promisify } from 'util'
import { readdirSync, lstatSync } from 'fs'
import path from 'path'

const { ANALYZE_WEBPACK_BUNDLES } = process.env

const paths = {
    components: `${__dirname}/components`,
};

module.exports = (phase: string, { defaultConfig }: Object) => { // eslint-disable-line no-unused-vars
    return {
        webpack: (config: Object, { isServer }: Object) => {
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

            readdirSync(paths.components)
                .map(dir => [ path.resolve(paths.components, dir), dir ])
                .filter(([ dirpath ]) => lstatSync(dirpath).isDirectory())
                .forEach(([ dirpath, dirname ]) => config.resolve.alias[dirname] = dirpath);

            return config;
        },

        // ? Will only be available on the server side
        serverRuntimeConfig: {
            // ...
        },

        // ? Will be available on both server and client
        publicRuntimeConfig: {
            // ...
        }
    }
};
