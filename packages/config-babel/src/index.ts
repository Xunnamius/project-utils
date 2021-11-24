// * Every now and then, we adopt best practices from CRA
// * https://tinyurl.com/yakv4ggx

import { relative as absToRelPath } from 'path';
import debugFactory from 'debug';

const configName = 'babel-config';

export type Options = {
  pkgName?: string;
  cwd?: string;
  monorepo?: boolean;
  customize?: (
    config: Record<string, unknown>,
    debug: ReturnType<typeof debugFactory>
  ) => ReturnType<typeof main>;
};

type TransformDefaultNamedImports = [
  pluginName: 'transform-default-named-imports',
  options: {
    monorepo: boolean | string;
    exclude: (string | RegExp)[];
  }
];

export default function main(options?: Options): Record<string, unknown> {
  let { pkgName, cwd, monorepo: monorepoMode, customize } = options || {};

  cwd = cwd ?? process.cwd();
  pkgName = pkgName ?? require(`${cwd}/package.json`).name;
  monorepoMode = !!monorepoMode;
  customize = customize ?? ((c) => c);

  const debug = debugFactory(`${pkgName}:${configName}`);

  debug('NODE_ENV: %O', process.env.NODE_ENV);
  debug('monorepo mode: %O', monorepoMode);

  // ? https://nodejs.org/en/about/releases
  const NODE_LTS = 'maintained node versions';

  // ? Fix relative local imports referencing package.json (.dist/bundle/...)
  const transformRenameImport = [
    'transform-rename-import',
    {
      // ? See: https://bit.ly/38hFTa8
      replacements: [{ original: 'package', replacement: `${pkgName}/package.json` }]
    }
  ];

  // ? Interoperable named CJS imports for free
  const transformDefaultNamedImports: TransformDefaultNamedImports = [
    'transform-default-named-imports',
    {
      monorepo: false,
      exclude: [/^next([/?#].+)?/, /^mongodb([/?#].+)?/]
    }
  ];

  if (monorepoMode) {
    debug('PKGROOT: %O', process.env.PKGROOT);

    // ? !PKGROOT means we're in package subdirectory under root; monorepo === true
    transformDefaultNamedImports[1].monorepo = process.env.PKGROOT
      ? `./${absToRelPath('.', process.env.PKGROOT + '/node_modules')}`
      : true;
  }

  debug('transformDefaultNamedImports: %O', transformDefaultNamedImports);

  const config = customize(
    {
      parserOpts: { strictMode: true },
      plugins: [
        '@babel/plugin-proposal-export-default-from',
        '@babel/plugin-proposal-function-bind',
        '@babel/plugin-proposal-nullish-coalescing-operator',
        '@babel/plugin-transform-typescript'
      ],
      // ? Sub-keys under the "env" config key will augment the above
      // ? configuration depending on the value of NODE_ENV and friends. Default
      // ? is: development
      env: {
        // * Used by Jest and `npm test`
        test: {
          sourceMaps: 'both',
          presets: [
            ['@babel/preset-env', { targets: { node: true } }],
            ['@babel/preset-typescript', { allowDeclareFields: true }]
            // ? We don't care about minification
          ],
          plugins: [
            // ? Only active when testing, the plugin solves the following problem:
            // ? https://stackoverflow.com/q/40771520/1367414
            'explicit-exports-references'
          ]
        },
        // * Used by `npm run build`
        production: {
          presets: [
            // ? https://nodejs.org/en/about/releases
            ['@babel/preset-env', { targets: NODE_LTS }],
            ['@babel/preset-typescript', { allowDeclareFields: true }]
            // ? Minification is handled by Webpack
          ],
          plugins: [transformDefaultNamedImports]
        },
        // * Used by `npm run build-externals`
        external: {
          presets: [
            ['@babel/preset-env', { targets: { node: true } }],
            ['@babel/preset-typescript', { allowDeclareFields: true }]
            // ? Minification is handled by Webpack
          ],
          plugins: [transformDefaultNamedImports]
        },
        // * Used for compiling ESM code output in ./dist/esm
        esm: {
          presets: [
            [
              '@babel/preset-env',
              {
                // ? https://babeljs.io/docs/en/babel-preset-env#modules
                modules: false,
                targets: NODE_LTS
              }
            ],
            ['@babel/preset-typescript', { allowDeclareFields: true }]
            // ? Minification is handled by Webpack
          ],
          plugins: [transformDefaultNamedImports]
        },
        // * Used for compiling ESM code output in .dist/bundle
        bundle: {
          presets: [
            [
              '@babel/preset-env',
              {
                // ? https://babeljs.io/docs/en/babel-preset-env#modules
                modules: false,
                targets: NODE_LTS
              }
            ],
            ['@babel/preset-typescript', { allowDeclareFields: true }]
            // ? The end user will handle minification
          ],
          plugins: [
            // ? Ensure all local imports without extensions now end in .mjs
            ['add-import-extension', { extension: 'mjs' }],
            transformRenameImport,
            transformDefaultNamedImports
          ]
        }
      }
    },
    debug
  );

  debug.extend('exports')('%O', config);
  return config;
}
