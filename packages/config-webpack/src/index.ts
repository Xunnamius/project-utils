import { EnvironmentPlugin, DefinePlugin, BannerPlugin } from 'webpack';
import nodeExternals from 'webpack-node-externals';
import debugFactory from 'debug';
import { getWebpackAliases } from '@projector-js/core/import-aliases';
import { getRunContext } from '@projector-js/core/monorepo-utils';

const configName = 'config-webpack';

export type Options = {
  pkgName?: string;
  cwd?: string;
  monorepo?: boolean;
  customize?: (
    config: Record<string, unknown>,
    debug: ReturnType<typeof debugFactory>
  ) => ReturnType<typeof main>;
};

export default function main(options?: Options): Record<string, unknown> {
  let { pkgName, cwd, monorepo: monorepoMode, customize } = options || {};

  cwd = cwd ?? process.cwd();
  pkgName = pkgName ?? require(`${cwd}/package.json`).name;
  monorepoMode = !!monorepoMode;
  customize = customize ?? ((c) => c);

  const debug = debugFactory(`${pkgName}:${configName}`);

  // TODO: break off this code into separate monorepo tooling (along with other)
  const pathParts = cwd.replace(`${__dirname}/`, '').split('/');

  debug('NODE_ENV: %O', process.env.NODE_ENV);

  const config = customize(
    {
      endOfLine: 'lf',
      printWidth: 80,
      proseWrap: 'always',
      semi: true,
      singleQuote: true,
      tabWidth: 2,
      trailingComma: 'none',
      overrides: [
        {
          files: '**/*.@(ts|?(@(c|m))js)?(x)',
          options: {
            parser: 'babel-ts',
            printWidth: 90
          }
        }
      ]
    },
    debug
  );

  debug.extend('exports')('%O', config);
  return config;
}
