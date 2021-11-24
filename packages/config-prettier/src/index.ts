import debugFactory from 'debug';

const configName = 'config-prettier';

export type Options = {
  pkgName?: string;
  cwd?: string;
  customize?: (
    config: Record<string, unknown>,
    debug: ReturnType<typeof debugFactory>
  ) => ReturnType<typeof main>;
};

export default function main(options?: Options): Record<string, unknown> {
  let { pkgName, cwd, customize } = options || {};

  cwd = cwd ?? process.cwd();
  pkgName = pkgName ?? require(`${cwd}/package.json`).name;
  customize = customize ?? ((c) => c);

  const debug = debugFactory(`${pkgName}:${configName}`);

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
