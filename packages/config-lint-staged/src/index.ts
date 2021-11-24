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
      restoreMocks: true,
      resetMocks: true,
      testEnvironment: 'node',
      testRunner: 'jest-circus/runner',
      // ? 1 hour so MMS and other tools don't choke during debugging
      testTimeout: 60000,
      verbose: false,
      testPathIgnorePatterns: ['/node_modules/'],
      // TODO: merge these
      // ! If changed, also update these aliases in tsconfig.json,
      // ! webpack.config.js, next.config.ts, and .eslintrc.js
      moduleNameMapper: {
        '^universe/(.*)$': '<rootDir>/src/$1',
        '^multiverse/(.*)$': '<rootDir>/lib/$1',
        '^testverse/(.*)$': '<rootDir>/test/$1',
        '^pkgverse/(.*)$': '<rootDir>/packages/$1',
        '^externals/(.*)$': '<rootDir>/external-scripts/$1',
        '^types/(.*)$': '<rootDir>/types/$1',
        '^package$': '<rootDir>/package.json'
      },
      setupFilesAfterEnv: ['./test/setup.ts'],
      collectCoverageFrom: ['src/**/*.ts?(x)', 'external-scripts/**/*.ts?(x)']
    },
    debug
  );

  debug.extend('exports')('%O', config);
  return config;
}
