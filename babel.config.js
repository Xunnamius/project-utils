// * Every now and then, we adopt best practices from CRA
// * https://tinyurl.com/yakv4ggx
// TODO: when this is used with a react project, we'll need to enable more stuff
'use strict';

// ? https://nodejs.org/en/about/releases
const NODE_LTS = 'maintained node versions';

// TODO: turn this into an enum
const ALLOWED_ENV = [
  'test',
  'development',
  'production-cjs',
  'production-esm',
  'production-external',
  'production-types'
];

const debug = require('debug')(`${require('./package.json').name}:babel-config`);

verifyEnvironment();
module.exports = generateConfigObject();

// TODO: export all functions

function verifyEnvironment() {
  debug('NODE_ENV: %O', process.env.NODE_ENV);
  debug('ALLOWED_ENV: %O', ALLOWED_ENV);

  if (!ALLOWED_ENV.includes(process.env.NODE_ENV)) {
    throw new Error(
      `babel expects NODE_ENV to be one of either: ${ALLOWED_ENV.join(', ')}. Saw "${
        process.env.NODE_ENV
      }" instead`
    );
  }
}

function generateConfigObject() {
  /**
   * @type {import('@babel/core').TransformOptions}
   */
  const config = {
    babelrcRoots: [
      // ? Keep the root as a root
      '.',
      // ? Also consider monorepo packages' .babelrc.json files
      './packages/*'
    ],
    comments: false,
    parserOpts: { strictMode: true },
    assumptions: {
      constantReexports: true
    },
    plugins: [
      '@babel/plugin-proposal-export-default-from',
      '@babel/plugin-syntax-import-assertions',
      [
        'module-resolver',
        {
          root: '.',
          extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
          // ! If changed, also update these aliases in tsconfig.json,
          // ! webpack.config.js, next.config.ts, eslintrc.js, and jest.config.js
          alias: {
            '^universe/(.*)$': './src/\\1',
            '^multiverse/(.*)$': './lib/\\1',
            '^testverse/(.*)$': './test/\\1',
            // ? pkgverse is handled by babel-plugin-transform-rewrite-imports
            '^externals/(.*)$': './external-scripts/\\1',
            '^types/(.*)$': './types/\\1',
            '^package$': `./package.json`
          }
        }
      ]
    ],
    // ? Sub-keys under the "env" config key will augment the above
    // ? configuration depending on the value of NODE_ENV (or BABEL_ENV).
    // TODO: use enum
    env: {
      // * Used by Jest and `npm test`
      test: generateTestConfigObject(),
      // * Used by eslint's module resolver during linting
      development: generateTestConfigObject(),
      // * Used by `npm run build` for compiling CJS to ./dist
      'production-cjs': generateProductionConfigObject('cjs'),
      // * Used by `npm run build` for compiling ESM to ./dist
      'production-esm': generateProductionConfigObject('esm'),
      // * Used by `npm run build-externals` for compiling ESM to ./external-scripts/bin
      'production-external': generateProductionConfigObject('esm', (config) => {
        const presetEnvironment = config.presets.find(
          (preset) => preset[0] == '@babel/preset-env'
        );

        presetEnvironment[1] = {
          ...presetEnvironment[1],
          targets: { node: 'current' }
        };
      }),
      // * Used by `npm run build` for fixing declaration file imports in ./dist
      'production-types': generateDtsFixConfigObject()
    }
  };

  debug('final config: %O', config);
  return config;
}

function generateDtsFixConfigObject(mutateConfigFn) {
  const config = {
    comments: true,
    plugins: [
      ['@babel/plugin-syntax-typescript', { dts: true }],
      [
        'transform-rewrite-imports',
        {
          replaceExtensions: {
            // ? Ensure deep package.json imports resolve properly
            '^../../../package.json$': '../../package.json',
            // ? Ensure deep imports resolve properly
            '^../../../(.*)$': '../$1'
          }
        }
      ]
    ]
  };

  // TODO: all mutateConfigFn functions must return void
  if (mutateConfigFn) {
    mutateConfigFn(config);
  }

  return config;
}

function generateTestConfigObject(mutateConfigFn) {
  const config = {
    comments: true,
    sourceMaps: 'both',
    presets: [
      ['@babel/preset-env', { targets: { node: 'current' } }],
      ['@babel/preset-typescript', { allowDeclareFields: true }]
      // ? We don't care about minification
    ],
    plugins: [
      // ? Only active when testing, the plugin solves the following problem:
      // ? https://stackoverflow.com/q/40771520/1367414
      'explicit-exports-references'
    ]
  };

  // TODO: all mutateConfigFn functions must return void
  if (mutateConfigFn) {
    mutateConfigFn(config);
  }

  return config;
}

function generateProductionConfigObject(moduleSystem, mutateConfigFn) {
  const config = {
    presets: [
      [
        '@babel/preset-env',
        {
          // ? https://babeljs.io/docs/en/babel-preset-env#modules
          modules: moduleSystem == 'esm' ? false : 'cjs',
          targets: NODE_LTS,
          useBuiltIns: 'usage',
          // TODO: use the core-js major and minor version from package.json and
          // TODO: error if a major and minor are not both specified or dep is missing
          corejs: '3.27',
          shippedProposals: true,
          exclude: [
            // ? Do not transform import() statements into require() statements
            ...(moduleSystem == 'cjs' ? ['proposal-dynamic-import'] : []),
            // ? Pretty sure everyone supports async/await and generators by now
            'transform-regenerator'
          ]
        }
      ],
      ['@babel/preset-typescript', { allowDeclareFields: true }]
      // ? We don't care about minification
    ],
    plugins: [
      [
        // ? Ensure babel does not pollute the global scope (great for libs)
        '@babel/plugin-transform-runtime',
        {
          corejs: { version: 3, proposals: true },
          helpers: true,
          // ? Pretty sure everyone supports async/await and generators by now
          regenerator: false,
          absoluteRuntime: false,
          // ? By default, babel assumes babel/runtime version 7.0.0,
          // ? explicitly resolving to match the provided helper functions.
          // ? https://babeljs.io/docs/en/babel-plugin-transform-runtime#version
          // TODO: use the @babel/runtime-corejs3 version from package.json and
          // TODO: error if dep is missing
          version: '^7.20.13'
        }
      ],
      [
        'transform-rewrite-imports',
        {
          // ? Ensure all local imports without extensions now end in .mjs
          ...(moduleSystem == 'esm' ? { appendExtension: '.mjs' } : {}),
          replaceExtensions: {
            // ? Ensure built distributables can locate the package.json file
            '^../package.json$': '../../package.json',
            // ? Replace pkgverse imports with their runtime equivalents
            '^pkgverse/([^/]+)/src/index$': '$1'
          }
        }
      ]
    ]
  };

  if (mutateConfigFn) {
    mutateConfigFn(config);
  }

  return config;
}
