import debugFactory from 'debug';

const configName = 'config-commitlint';

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
      extends: ['@commitlint/config-conventional'],
      rules: {
        'body-leading-blank': [2, 'always'],
        'footer-leading-blank': [2, 'always'],
        'type-enum': [
          2,
          'always',
          [
            'feat',
            'feature',
            'fix',
            'perf',
            'revert',
            'build',
            'docs',
            'style',
            'refactor',
            'test',
            'ci',
            'cd',
            'chore'
          ]
        ]
      }
    },
    debug
  );

  debug.extend('exports')('%O', config);
  return config;
}
