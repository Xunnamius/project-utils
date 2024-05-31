'use strict';

// This webpack config is used to transpile src to dist, compile externals,
// compile executables, etc

const { makeNamedError } = require('named-app-errors');
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

class PkgverseResolverError extends Error {}
makeNamedError(PkgverseResolverError, 'PkgverseResolverError');

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
    } else if (
      options?.externalizePkgverse !== false &&
      request.startsWith('pkgverse/')
    ) {
      // ? Transform "pkgverse" imports into externalized (named) module imports
      // TODO: document: pkgConfigName is the name of the config that is used to
      // TODO: build the pkgverse packages. Also document any transient
      // TODO: expectations/requirements, if any.
      let pkgImport = undefined;
      let error = undefined;

      try {
        if (!options?.pkgverseConfigName) {
          throw new PkgverseResolverError(
            'must call externals function with required option "pkgverseConfigName"'
          );
        }

        const config = availableConfigs.find(
          ({ name }) => name == options.pkgverseConfigName
        );

        if (!config?.output?.path || !config?.output?.filename) {
          throw new PkgverseResolverError(
            `webpack configuration "${options.pkgverseConfigName}" must define "output.path" and "output.filename" fields`
          );
        } else if (!config.output.path.startsWith(`${cwd}/`)) {
          throw new PkgverseResolverError(
            `webpack configuration "${options.pkgverseConfigName}" must define a "output.path" field that starts with "${cwd}/"`
          );
        }

        const match = request.match(
          /pkgverse\/(?<pkgName>[^/]+)(\/(?<targetPath>.+))?\/(?<targetFile>.+?)$/
        );
        const pkgJsonPath = `${IMPORT_ALIASES.pkgverse}${match.groups.pkgName}/package.json`;
        const pkg = require(pkgJsonPath);

        if (!pkg.name || !pkg.exports) {
          throw new PkgverseResolverError(
            `${pkgJsonPath} must have "name" and "exports" fields`
          );
        } else if (typeof pkg.exports == 'string' || Array.isArray(pkg.exports)) {
          throw new PkgverseResolverError(
            `${pkgJsonPath} must have a "exports" field with an object value (saw a string instead)`
          );
        }

        const exportPaths = [
          // ? First check for the file exactly as requested
          `./${match.groups.targetPath ? `${match.groups.targetPath}/` : ''}${
            match.groups.targetFile
          }`,
          // ? Next, try looking for the compiled version of its output
          `${config.output.path.replace(cwd, '.')}/${config.output.filename.replace(
            '[name]',
            match.groups.targetFile
          )}`
        ];

        // ? If the config ends in an extension, also try an extensionless path
        if (config.output.filename.includes('.')) {
          exportPaths.push(exportPaths.at(-1).split('.').slice(0, -1).join('.'));
        }

        const entry = Object.entries(pkg.exports).find(([, exportedPathSpec]) => {
          const check = (pathSpec) => {
            if (!pathSpec) {
              return false;
            } else if (typeof pathSpec == 'string') {
              return exportPaths.includes(pathSpec);
            } else {
              return (
                check(pathSpec.node) ||
                check(pathSpec.import) ||
                check(pathSpec.require) ||
                check(pathSpec.default)
              );
            }
          };

          return check(exportedPathSpec);
        });

        if (!entry) {
          throw new PkgverseResolverError(
            `unable to find an "exports" field entry point in ${pkgJsonPath} that maps to one of the following: \n  -> ${exportPaths.join(
              '\n  -> '
            )}`
          );
        }

        pkgImport = `${pkg.name}${entry[0].slice(1)}`;
      } catch (e) {
        error = e;
      }

      error ? cb(error) : cb(null, `commonjs ${pkgImport}`);
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

    externals: externals({ pkgverseConfigName: 'cjs-static' }),
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

    externals: externals({ pkgverseConfigName: 'cjs-static' }),
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
      pkgverseConfigName: 'cjs-static',
      additionalExternals: [
        // ? Externalize all relative (local) imports
        // ! WARNING: all local imports must have accompanying CJS bundles and
        // ! corresponding entries under the package.json `exports` field!
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
