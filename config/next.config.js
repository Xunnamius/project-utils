/* @flow */

import withBundleAnalyzer from '@zeit/next-bundle-analyzer'
import styledJsxWebpack from 'styled-jsx/webpack'
// flow-disable-line
import { populateEnv } from './src/dev-utils'

populateEnv();

const {
    BUNDLE_ANALYZE
} = process.env;

const paths = {
    universe: `${__dirname}/src/`,
    components: `${__dirname}/src/components/`,
};

module.exports = (/* phase: string, { defaultConfig }: Object */) => {
    return withBundleAnalyzer({
        // ? Renames the build dir "build" instead of ".next"
        distDir: 'build',

        // ? Selectively enables bundle analysis. See dist.env or README for details
        analyzeServer: ['server', 'both'].includes(BUNDLE_ANALYZE),
        analyzeBrowser: ['browser', 'both'].includes(BUNDLE_ANALYZE),
        bundleAnalyzerConfig: {
            server: {
                analyzerMode: 'static',
                reportFilename: 'bundle-analysis-server.html'
            },
            browser: {
                analyzerMode: 'static',
                reportFilename: 'bundle-analysis-client.html'
            }
        },

        // ? Webpack configuration
        // ! Note that the webpack configuration is executed twice: once
        // ! server-side and once client-side!
        webpack: (config: Object, { /* isServer, */ defaultLoaders }: Object) => {
            // ? Anytime we import a file that ends in `.css`, run the special
            // ? JSX loader so we can do cool css-in-js stuff
            config.module.rules.push({
                test: /\.css$/,
                use: [
                    defaultLoaders.babel,
                    {
                        loader: styledJsxWebpack.loader,
                        options: {
                            type: 'scoped'
                        }
                    }
                ]
            });

            // ? These are aliases that can be used during JS import calls
            // ! Note that you must also change these same aliases in .flowconfig
            // ! Note that you must also change these same aliases in package.json (jest)
            config.resolve.alias = Object.assign({}, config.resolve.alias, {
                universe$: paths.universe,
                components$: paths.components,
                universe: paths.universe,
                components: paths.components
            });

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
    });
};
