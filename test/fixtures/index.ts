import { basename } from 'path';
import * as Core from 'pkgverse/core/src/project-utils';

import type { PackageJson } from 'type-fest';
import type { WorkspacePackage } from 'pkgverse/core/src/project-utils';

const actualReadPkgJson = jest.requireActual<
  typeof import('pkgverse/core/src/project-utils')
>('pkgverse/core/src/project-utils').readPackageJson;

/**
 * Patch the package.json data returned by the `readPackageJson` function.
 * Successive calls to this function overwrite previous calls.
 */
export function patchReadPackageJsonData(
  /**
   * The `package.json` patches to apply per root path. When `root` is equal to
   * `"*"`, it will be used to patch all `package.json` imports but can be
   * overwritten by a more specific `root` string.
   */
  spec: { [root: string]: PackageJson },
  /**
   * Options that influence the patching process.
   */
  options?: {
    /**
     * Whether to merely patch the actual package.json contents (`undefined`),
     * completely replace them (`true`), or only overwrite them if they don't
     * already exist (`false`).
     *
     * @default undefined
     */
    replace?: boolean;
  }
) {
  jest.spyOn(Core, 'readPackageJson').mockImplementation(({ root }) => {
    return options?.replace === false
      ? {
          ...spec['*'],
          ...spec[root],
          ...actualReadPkgJson({ root })
        }
      : {
          ...(options?.replace ? {} : actualReadPkgJson({ root })),
          ...spec['*'],
          ...spec[root]
        };
  });
  return spec;
}

/**
 * A type representing a dummy monorepo or polyrepo project's metadata.
 */
export type Fixture = {
  root: string;
  json: PackageJson;
  namedPkgMapData: PkgMapEntry[];
  unnamedPkgMapData: PkgMapEntry[];
  brokenPkgRoots: string[];
};

/**
 * A type representing the name of an available fixture.
 */
export type FixtureName =
  | 'badMonorepo'
  | 'badMonorepoDuplicateId'
  | 'badMonorepoDuplicateName'
  | 'badMonorepoEmptyMdFiles'
  | 'badMonorepoNextjsProject'
  | 'badMonorepoNonPackageDir'
  | 'badPolyrepo'
  | 'badPolyrepoEmptyMdFiles'
  | 'badPolyrepoImporter'
  | 'badPolyrepoNextjsProject'
  | 'badPolyrepoNonPackageDir'
  | 'badPolyrepoTsbuildinfo'
  | 'goodMonorepo'
  | 'goodMonorepoDuplicateId'
  | 'goodMonorepoNegatedPaths'
  | 'goodMonorepoNextjsProject'
  | 'goodMonorepoSimplePaths'
  | 'goodMonorepoWeirdAbsolute'
  | 'goodMonorepoWeirdBoneless'
  | 'goodMonorepoWeirdOverlap'
  | 'goodMonorepoWeirdSameNames'
  | 'goodMonorepoWeirdYarn'
  | 'goodMonorepoWindows'
  | 'goodPolyrepo'
  | 'goodPolyrepoNextjsProject'
  | 'repoThatDoesNotExist';

/**
 * A type represents an object that will be expanded into a `PkgMapEntry`.
 */
export type PkgMapDatum = { name: string; root: string };

/**
 * A type represents a single entry of a packages map.
 */
export type PkgMapEntry = [name: string, workspacePackage: WorkspacePackage];

/**
 * A collection of fixtures representing dummy monorepo and polyrepo projects.
 * Useful for testing purposes.
 */
export const Fixtures = {} as Record<FixtureName, Fixture>;

Fixtures['repoThatDoesNotExist'] = {
  root: '/does/not/exist',
  json: {},
  namedPkgMapData: [],
  unnamedPkgMapData: [],
  brokenPkgRoots: []
};

/**
 * Create a new dummy test fixture based on a fixture prototype and with
 * optionally patched package.json data.
 */
const createFixture = ({
  fixtureName,
  prototypeRoot,
  namedPkgMapData = [],
  unnamedPkgMapData = [],
  brokenPkgRoots = []
}: {
  fixtureName: FixtureName;
  prototypeRoot: string;
  namedPkgMapData?: PkgMapDatum[];
  unnamedPkgMapData?: PkgMapDatum[];
  brokenPkgRoots?: Fixture['brokenPkgRoots'];
}) => {
  prototypeRoot = `${__dirname}/${prototypeRoot}`;

  const expandDatumToEntry = ({ name, root: subRoot }: PkgMapDatum): PkgMapEntry => {
    return [
      name,
      {
        id: basename(subRoot),
        root: `${prototypeRoot}/${subRoot}`,
        json: require(`${prototypeRoot}/${subRoot}/package.json`)
      } as WorkspacePackage
    ];
  };

  Fixtures[fixtureName] = {
    root: prototypeRoot,
    json:
      (() => {
        try {
          return require(`${prototypeRoot}/package.json`);
        } catch {}
      })() || {},
    namedPkgMapData: namedPkgMapData.map(expandDatumToEntry),
    unnamedPkgMapData: unnamedPkgMapData.map(expandDatumToEntry),
    brokenPkgRoots: brokenPkgRoots.map((path) => `${prototypeRoot}/${path}`)
  };
};

createFixture({
  fixtureName: 'badMonorepo',
  prototypeRoot: 'bad-monorepo',
  unnamedPkgMapData: [
    { name: 'empty', root: 'packages/0-empty' },
    { name: 'tsbuildinfo', root: 'packages/1-tsbuildinfo' },
    { name: 'bad-importer', root: 'packages/2-bad-importer' }
  ]
});

createFixture({
  fixtureName: 'badMonorepoDuplicateId',
  prototypeRoot: 'bad-monorepo-duplicate-id'
});

createFixture({
  fixtureName: 'badMonorepoDuplicateName',
  prototypeRoot: 'bad-monorepo-duplicate-name'
});

createFixture({
  fixtureName: 'badMonorepoEmptyMdFiles',
  prototypeRoot: 'bad-monorepo-empty-md-files',
  unnamedPkgMapData: [{ name: 'md-empty', root: 'packages/md-empty' }]
});

createFixture({
  fixtureName: 'badMonorepoNextjsProject',
  prototypeRoot: 'bad-monorepo-nextjs-project',
  unnamedPkgMapData: [{ name: 'empty', root: 'packages/empty' }]
});

createFixture({
  fixtureName: 'badMonorepoNonPackageDir',
  prototypeRoot: 'bad-monorepo-non-package-dir',
  namedPkgMapData: [{ name: 'pkg-1', root: 'pkgs/pkg-1' }],
  brokenPkgRoots: ['pkgs/pkg-10', 'pkgs/pkg-100']
});

createFixture({
  fixtureName: 'badPolyrepo',
  prototypeRoot: 'bad-polyrepo'
});

createFixture({
  fixtureName: 'badPolyrepoEmptyMdFiles',
  prototypeRoot: 'bad-polyrepo-empty-md-files'
});

createFixture({
  fixtureName: 'badPolyrepoImporter',
  prototypeRoot: 'bad-polyrepo-importer'
});

createFixture({
  fixtureName: 'badPolyrepoNextjsProject',
  prototypeRoot: 'bad-polyrepo-nextjs-project'
});

createFixture({
  fixtureName: 'badPolyrepoNonPackageDir',
  prototypeRoot: 'bad-polyrepo-non-package-dir'
});

createFixture({
  fixtureName: 'badPolyrepoTsbuildinfo',
  prototypeRoot: 'bad-polyrepo-tsbuildinfo'
});

createFixture({
  fixtureName: 'goodMonorepo',
  prototypeRoot: 'good-monorepo',
  namedPkgMapData: [
    { name: 'pkg-1', root: 'packages/pkg-1' },
    { name: '@namespaced/pkg', root: 'packages/pkg-2' },
    { name: '@namespaced/importer', root: 'packages/pkg-import' }
  ],
  unnamedPkgMapData: [
    { name: 'unnamed-pkg-1', root: 'packages/unnamed-pkg-1' },
    { name: 'unnamed-pkg-2', root: 'packages/unnamed-pkg-2' }
  ]
});

createFixture({
  fixtureName: 'goodMonorepoDuplicateId',
  prototypeRoot: 'good-monorepo-duplicate-id',
  namedPkgMapData: [
    { name: 'pkg-1', root: 'packages-1/pkg-1' },
    { name: 'pkg-2', root: 'packages-2/pkg-1' }
  ]
});

createFixture({
  fixtureName: 'goodMonorepoNegatedPaths',
  prototypeRoot: 'good-monorepo-negated-paths',
  namedPkgMapData: [
    { name: 'pkg-1', root: 'packages/pkg-1' },
    { name: '@namespace/pkg-3', root: 'packages/pkg-3-x' }
  ]
});

createFixture({
  fixtureName: 'goodMonorepoNextjsProject',
  prototypeRoot: 'good-monorepo-nextjs-project',
  namedPkgMapData: [
    { name: 'pkg-1', root: 'packages/pkg-1' },
    { name: '@namespaced/pkg', root: 'packages/pkg-2' },
    { name: '@namespaced/importer', root: 'packages/pkg-import' }
  ],
  unnamedPkgMapData: [
    { name: 'unnamed-pkg-1', root: 'packages/unnamed-pkg-1' },
    { name: 'unnamed-pkg-2', root: 'packages/unnamed-pkg-2' }
  ]
});

createFixture({
  fixtureName: 'goodMonorepoSimplePaths',
  prototypeRoot: 'good-monorepo-simple-paths',
  namedPkgMapData: [
    { name: 'pkg-1', root: 'pkgs/pkg-1' },
    { name: 'pkg-10', root: 'pkgs/pkg-10' }
  ]
});

createFixture({
  fixtureName: 'goodMonorepoWeirdAbsolute',
  prototypeRoot: 'good-monorepo-weird-absolute',
  namedPkgMapData: [
    { name: 'pkg-1', root: 'packages/pkg-1' },
    { name: 'pkg-2', root: 'packages/pkg-2' }
  ]
});

createFixture({
  fixtureName: 'goodMonorepoWeirdBoneless',
  prototypeRoot: 'good-monorepo-weird-boneless',
  namedPkgMapData: [{ name: 'pkg-1', root: 'pkg-1' }]
});

createFixture({
  fixtureName: 'goodMonorepoWeirdOverlap',
  prototypeRoot: 'good-monorepo-weird-overlap',
  namedPkgMapData: [
    { name: 'pkg-1', root: 'pkgs/pkg-1' },
    { name: 'pkg-2', root: 'pkgs/pkg-20' }
  ],
  // I can't imagine a project having such weird (useless) overlapping paths...
  brokenPkgRoots: [
    'pkgs',
    'pkgs/pkg-1/dist',
    'pkgs/pkg-1/src',
    'pkgs/pkg-20/dist',
    'pkgs/pkg-20/src'
  ]
});

createFixture({
  fixtureName: 'goodMonorepoWeirdSameNames',
  prototypeRoot: 'good-monorepo-weird-same-names',
  namedPkgMapData: [
    { name: 'good-monorepo-weird-same-names', root: 'packages/pkg-1' },
    { name: 'pkg-2', root: 'packages/pkg-2' }
  ]
});

createFixture({
  fixtureName: 'goodMonorepoWeirdYarn',
  prototypeRoot: 'good-monorepo-weird-yarn',
  namedPkgMapData: [
    { name: 'pkg-1', root: 'packages/pkg-1' },
    { name: 'pkg-2', root: 'packages/pkg-2' }
  ]
});

createFixture({
  fixtureName: 'goodMonorepoWindows',
  prototypeRoot: 'good-monorepo-windows',
  namedPkgMapData: [
    { name: 'pkg-1', root: 'packages/deep/pkg' },
    { name: 'pkg-2', root: 'packages/deep/wkg' }
  ]
});

createFixture({ fixtureName: 'goodPolyrepo', prototypeRoot: 'good-polyrepo' });

createFixture({
  fixtureName: 'goodPolyrepoNextjsProject',
  prototypeRoot: 'good-polyrepo-nextjs-project'
});
