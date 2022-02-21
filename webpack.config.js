'use strict';

// This webpack config is used to transpile src to dist, compile externals,
// compile executables, etc

const { toss } = require('toss-expression');
const { EnvironmentPlugin, DefinePlugin, BannerPlugin } = require('webpack');
const { verifyEnvironment } = require('./expect-env');
const nodeExternals = require('webpack-node-externals');

// TODO: warn when defaulting to process.cwd (when no PKGROOT is given)
const cwd = process.env.PKGROOT || process.cwd();
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

// TODO: when generalizing this, the below is no longer an error, just a
// TODO: polyrepo 😉
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

const envPlugins = () => [
  // ? NODE_ENV is not a "default" (unlike below) but an explicit overwrite
  new DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(nodeEnv)
  }),
  // ? Load our .env results as the defaults (overridden by process.env)
  new EnvironmentPlugin({ ...sanitizedEnv, ...sanitizedProcessEnv }),
  // ? Create shim process.env for undefined vars
  // ! The above already replaces all process.env.X occurrences in the code
  // ! first, so plugin order is important here
  new DefinePlugin({ 'process.env': '{}' })
];

// TODO: export this too and all the others (config-webpack)
const externals = (options) => [
  ...(options?.externalizeNodeModules !== false
    ? [nodeExternals({ importType: 'commonjs', ...options })]
    : []),
  ({ request }, cb) => {
    if (request == 'package') {
      // ? Externalize special "package" (alias of package.json) imports
      cb(null, `commonjs ${pkgName}/package.json`);
    } else if (options?.externalizeJson !== false && request.endsWith('.json')) {
      // ? Externalize all other .json imports
      cb(null, `commonjs ${request}`);
    } else cb();
  },
  ...(options?.additionalExternals || [])
];

const selectAndCustomizeConfigs = (selectedConfigs) => {
  const availableConfigNames = availableConfigs.map((config) => config.name);

  Object.entries(selectedConfigs).forEach(([targetConfigName, configModifier]) => {
    const targetConfigIndex = availableConfigNames.indexOf(targetConfigName);

    if (targetConfigIndex == -1) {
      typeof configModifier == 'object' && configModifier
        ? // ? Must be a totally new custom configuration
          module.exports.push(configModifier)
        : toss(new Error(`webpack configuration "${targetConfigName}" is not available`));
    } else {
      const targetConfig = availableConfigs[targetConfigIndex];

      module.exports.push(
        typeof configModifier == 'function'
          ? (configModifier(targetConfig), targetConfig)
          : typeof configModifier == 'object' && configModifier
          ? configModifier
          : !configModifier
          ? toss(new Error(`invalid webpack configuration value: ${configModifier}`))
          : targetConfig
      );
    }
  });
};

const availableConfigs = [
  {
    name: 'cjs-static',
    mode: 'production',
    target: 'node',
    node: false,

    entry: {},

    output: {
      filename: '[name].js',
      path: `${cwd}/dist/cjs-static`,
      library: {
        type: 'commonjs-static'
      }
    },

    externals: externals(),
    externalsPresets: { node: true },

    stats: {
      orphanModules: true,
      providedExports: true,
      usedExports: true,
      errorDetails: true
    },

    resolve: {
      extensions: ['.ts', '.wasm', '.mjs', '.cjs', '.js', '.json'],
      alias: IMPORT_ALIASES
    },
    module: {
      rules: [{ test: /\.(ts|js)x?$/, loader: 'babel-loader', exclude: /node_modules/ }]
    },
    optimization: { usedExports: true },
    plugins: [...envPlugins()]
  },
  {
    name: 'externals',
    mode: 'production',
    target: 'node',
    node: false,

    entry: {},

    output: {
      filename: '[name].js',
      path: `${cwd}/external-scripts/bin`
    },

    externals: externals(),
    externalsPresets: { node: true },

    stats: {
      orphanModules: true,
      providedExports: true,
      usedExports: true,
      errorDetails: true
    },

    resolve: {
      extensions: ['.ts', '.wasm', '.mjs', '.cjs', '.js', '.json'],
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
      ...envPlugins(),
      // * ▼ For non-bundled externals, make entry file executable w/ shebang
      new BannerPlugin({ banner: '#!/usr/bin/env node', raw: true, entryOnly: true })
    ]
  },
  {
    name: 'cli',
    mode: 'production',
    target: 'node',
    node: false,

    entry: { cli: `${cwd}/src/cli.ts` },

    output: {
      filename: '[name].js',
      path: `${cwd}/dist`
    },

    externals: externals({
      additionalExternals: [
        // ? Externalize all relative (local) imports
        // ! WARNING: all local imports must have accompanying CJS bundles and
        // ! corresponding entries under the package.json `exports` key!
        ({ request, contextInfo: { issuer } }, cb) => {
          if (issuer == `${cwd}/src/cli.ts` && request.startsWith('./')) {
            cb(
              null,
              `commonjs ${pkgName}${request == './index' ? '' : `/${request.slice(2)}`}`
            );
          } else cb();
        }
      ]
    }),
    externalsPresets: { node: true },

    stats: {
      orphanModules: true,
      providedExports: true,
      usedExports: true,
      errorDetails: true
    },

    resolve: {
      extensions: ['.ts', '.wasm', '.mjs', '.cjs', '.js', '.json'],
      alias: IMPORT_ALIASES
    },
    module: {
      rules: [{ test: /\.(ts|js)x?$/, loader: 'babel-loader', exclude: /node_modules/ }]
    },
    optimization: { usedExports: true },
    plugins: [
      ...envPlugins(),
      // * ▼ For bundled CLI applications, make entry file executable w/ shebang
      new BannerPlugin({ banner: '#!/usr/bin/env node', raw: true, entryOnly: true })
    ]
  }
];

module.exports = [];
let monorepoConfigs = undefined;

try {
  // ? Attempt to load monorepo-specific webpack configs if in monorepo context
  if (__dirname != cwd) {
    monorepoConfigs = require(`${cwd}/webpack.config.js`);
  }
} catch (ignored) {}

selectAndCustomizeConfigs(
  monorepoConfigs ?? {
    // TODO: generalize this? Is a fallback here even necessary? Maybe remove...
    'cjs-static': (config) => (config.entry['index'] = `${cwd}/src/index.ts`)
  }
);

if (!module.exports.length) {
  throw new Error('webpack was not configured');
}

debug('exports: %O', module.exports);
