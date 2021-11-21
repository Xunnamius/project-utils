'use strict';

// This webpack config is used to transpile src to dist, compile externals,
// compile executables, etc

const { EnvironmentPlugin, DefinePlugin, BannerPlugin } = require('webpack');
const { verifyEnvironment } = require('./expect-env');
const nodeExternals = require('webpack-node-externals');

const cwd = process.env.PKGROOT;
const pkgName = require(`${cwd}/package.json`).name;
const debug = require('debug')(`${pkgName}:webpack-config`);

// ! If changed, also update these aliases in tsconfig.json,
// ! jest.config.js, next.config.ts, and .eslintrc.js
const IMPORT_ALIASES = {
  universe: `${cwd}/src/`,
  multiverse: `${__dirname}/lib/`,
  testverse: `${__dirname}/test/`,
  pkgverse: `${__dirname}/packages/`,
  externals: `${__dirname}/external-scripts/`,
  types: `${__dirname}/types/`,
  package: `${cwd}/package.json`
};

// TODO: break off this code into separate monorepo tooling (along with other)
const pathParts = cwd.replace(`${__dirname}/`, '').split('/');

debug('pathParts: %O', pathParts);

if (pathParts.length < 2 || pathParts[0] != 'packages') {
  throw new Error(`assert failed: illegal cwd: ${cwd}`);
}

const pkgBasename = pathParts[1];
debug('target package: %O', pkgBasename);

let sanitizedEnv = {};
let { NODE_ENV: nodeEnv, ...sanitizedProcessEnv } = {
  ...process.env,
  NODE_ENV: 'production'
};

try {
  const envPath = `${__dirname}/.env`;
  require('fs').accessSync(envPath);
  const { NODE_ENV: forceEnv, ...parsedEnv } = require('dotenv').config({
    path: envPath
  }).parsed;
  nodeEnv = forceEnv || nodeEnv;
  sanitizedEnv = parsedEnv;
  debug(`NODE_ENV: ${nodeEnv}`);
  debug('sanitized env: %O', sanitizedEnv);
} catch (e) {
  debug(`env support disabled; reason: ${e}`);
}

debug('sanitized process env: %O', sanitizedProcessEnv);
verifyEnvironment();

const envPlugins = ({ esm /*: boolean */ }) => [
  // ? NODE_ENV is not a "default" (unlike below) but an explicit overwrite
  new DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(nodeEnv)
  }),
  // ? NODE_ESM is true when we're compiling in ESM mode (useful in source)
  ...(esm
    ? [
        new DefinePlugin({
          'process.env.NODE_ESM': String(esm)
        })
      ]
    : []),
  // ? Load our .env results as the defaults (overridden by process.env)
  new EnvironmentPlugin({ ...sanitizedEnv, ...sanitizedProcessEnv }),
  // ? Create shim process.env for undefined vars
  // ! The above already replaces all process.env.X occurrences in the code
  // ! first, so plugin order is important here
  new DefinePlugin({ 'process.env': '{}' })
];

const externals = ({ esm /*: boolean */ }) => [
  nodeExternals({ importType: esm ? 'node-commonjs' : 'commonjs' }),
  ({ request }, cb) => {
    if (request == 'package') {
      // ? Externalize special "package" (alias of package.json) imports
      cb(null, `${esm ? 'node-commonjs' : 'commonjs'} ${pkgName}/package.json`);
    } else if (/\.json$/.test(request)) {
      // ? Externalize all other .json imports
      cb(null, `${esm ? 'node-commonjs' : 'commonjs'} ${request}`);
    } else cb();
  }
];

const libCjsConfig = {
  name: 'cjs',
  mode: 'production',
  target: 'node',
  node: false,

  entry: `${cwd}/src/index.ts`,

  output: {
    filename: 'index.js',
    path: `${cwd}/dist/cjs`,
    library: {
      type: 'commonjs2'
    }
  },

  externals: externals({ esm: false }),
  externalsPresets: { node: true },

  stats: {
    orphanModules: true,
    providedExports: true,
    usedExports: true,
    errorDetails: true
  },

  resolve: {
    extensions: ['.ts', '.wasm', '.mjs', '.cjs', '.js', '.json'],
    // ! If changed, also update these aliases in tsconfig.json,
    // ! jest.config.js, next.config.ts, and .eslintrc.js
    alias: IMPORT_ALIASES
  },
  module: {
    rules: [{ test: /\.(ts|js)x?$/, loader: 'babel-loader', exclude: /node_modules/ }]
  },
  optimization: { usedExports: true },
  plugins: [...envPlugins({ esm: false })]
};

const libEsmConfig = {
  name: 'esm',
  mode: 'production',
  target: 'node',
  node: false,

  entry: `${cwd}/src/index.ts`,

  output: {
    module: true,
    filename: 'index.mjs',
    path: `${cwd}/dist/esm`,
    chunkFormat: 'module',
    library: {
      type: 'module'
    }
  },

  experiments: {
    outputModule: true
  },

  externals: externals({ esm: true }),
  externalsPresets: { node: true },

  stats: {
    orphanModules: true,
    providedExports: true,
    usedExports: true,
    errorDetails: true
  },

  resolve: {
    extensions: ['.ts', '.wasm', '.mjs', '.cjs', '.js', '.json'],
    // ! If changed, also update these aliases in tsconfig.json,
    // ! jest.config.js, next.config.ts, and .eslintrc.js
    alias: IMPORT_ALIASES
  },
  module: {
    rules: [{ test: /\.(ts|js)x?$/, loader: 'babel-loader', exclude: /node_modules/ }]
  },
  optimization: { usedExports: true },
  plugins: [...envPlugins({ esm: true })]
};

const externalsConfig = {
  name: 'externals',
  mode: 'production',
  target: 'node',
  node: false,

  entry: {
    'is-next-compat': `${cwd}/external-scripts/is-next-compat.ts`
  },

  output: {
    filename: '[name].js',
    path: `${cwd}/external-scripts/bin`
  },

  externals: externals({ esm: false }),
  externalsPresets: { node: true },

  stats: {
    orphanModules: true,
    providedExports: true,
    usedExports: true,
    errorDetails: true
  },

  resolve: {
    extensions: ['.ts', '.wasm', '.mjs', '.cjs', '.js', '.json'],
    // ! If changed, also update these aliases in tsconfig.json,
    // ! jest.config.js, next.config.ts, and .eslintrc.js
    alias: IMPORT_ALIASES
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      }
    ]
  },
  optimization: { usedExports: true },
  plugins: [
    ...envPlugins({ esm: false }),
    // * ▼ For non-bundled externals, make entry file executable w/ shebang
    new BannerPlugin({ banner: '#!/usr/bin/env node', raw: true, entryOnly: true })
  ]
};

const cliConfig = {
  name: 'cli',
  mode: 'production',
  target: 'node',
  node: false,

  entry: `${cwd}/src/cli.ts`,

  output: {
    filename: 'cli.js',
    path: `${cwd}/dist`
  },

  externals: externals({ esm: false }),
  externalsPresets: { node: true },

  stats: {
    orphanModules: true,
    providedExports: true,
    usedExports: true,
    errorDetails: true
  },

  resolve: {
    extensions: ['.ts', '.wasm', '.mjs', '.cjs', '.js', '.json'],
    // ! If changed, also update these aliases in tsconfig.json,
    // ! jest.config.js, next.config.ts, and .eslintrc.js
    alias: IMPORT_ALIASES
  },
  module: {
    rules: [{ test: /\.(ts|js)x?$/, loader: 'babel-loader', exclude: /node_modules/ }]
  },
  optimization: { usedExports: true },
  plugins: [
    ...envPlugins({ esm: false }),
    // * ▼ For bundled CLI applications, make entry file executable w/ shebang
    new BannerPlugin({ banner: '#!/usr/bin/env node', raw: true, entryOnly: true })
  ]
};

void externalsConfig, cliConfig;
module.exports = [libCjsConfig, libEsmConfig];
debug('exports: %O', module.exports);
