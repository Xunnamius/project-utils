import debugFactory from 'debug';

const configName = 'config-tsconfig';

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
      compilerOptions: {
        allowJs: true,
        allowSyntheticDefaultImports: true,
        alwaysStrict: true,
        baseUrl: '.',
        checkJs: false,
        // ? Only for Next.js
        // "jsx": "preserve",
        declaration: true,
        esModuleInterop: true,
        forceConsistentCasingInFileNames: true,
        inlineSourceMap: true,
        isolatedModules: true,
        lib: ['ESNext', 'DOM', 'WebWorker.ImportScripts', 'ScriptHost', 'DOM.Iterable'],
        module: 'esnext',
        moduleResolution: 'node',
        noEmit: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        paths: {
          // ! If changed, also update these aliases in jest.config.js,
          // ! webpack.config.js, next.config.ts, and .eslintrc.js
          'externals/*': ['external-scripts/*'],
          'multiverse/*': ['lib/*'],
          package: ['package.json'],
          'pkgverse/*': ['packages/*'],
          'testverse/*': ['test/*'],
          'types/*': ['types/*'],
          'universe/*': ['src/*']
        },
        resolveJsonModule: true,
        skipLibCheck: true,
        strict: true,
        target: 'esnext'
      },
      exclude: ['node_modules'],
      include: [
        'types/**/*',
        'lib/**/*',
        'src/**/*',
        'test/**/*',
        'external-scripts/**/*',
        'packages/**/*'
      ]
    },
    debug
  );

  debug.extend('exports')('%O', config);
  return config;
}
