import { basename } from 'path';

import type { PackageJson } from 'type-fest';
import type { WorkspacePackage } from 'pkgverse/core/src/project-utils';

/**
 * A type representing a dummy monorepo or polyrepo project's metadata.
 */
export type Fixture = {
  root: string;
  json: PackageJson | undefined;
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
  | 'badMonorepoNonPackageDir'
  | 'badPolyrepo'
  | 'badPolyrepoDocsEntry'
  | 'badPolyrepoEmptyMdFiles'
  | 'badPolyrepoEngines'
  | 'badPolyrepoEngines2'
  | 'badPolyrepoExports'
  | 'badPolyrepoExports2'
  | 'badPolyrepoExports3'
  | 'badPolyrepoExportsOutdated'
  | 'badPolyrepoFiles'
  | 'badPolyrepoImporter'
  | 'badPolyrepoLicense'
  | 'badPolyrepoNoPackageJson'
  | 'badPolyrepoPrivate'
  | 'badPolyrepoVersion1'
  | 'badPolyrepoVersion2'
  | 'goodMonorepo'
  | 'goodMonorepoDuplicateId'
  | 'goodMonorepoNegatedPaths'
  | 'goodMonorepoSimplePaths'
  | 'goodMonorepoVersion'
  | 'goodMonorepoWeirdAbsolute'
  | 'goodMonorepoWeirdBoneless'
  | 'goodMonorepoWeirdOverlap'
  | 'goodMonorepoWeirdYarn'
  | 'goodMonorepoWindows'
  | 'goodPackageJson'
  | 'goodPolyrepo';

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

const createFixture = ({
  fixtureName,
  root,
  namedPkgMapData = [],
  unnamedPkgMapData = [],
  brokenPkgRoots = []
}: {
  fixtureName: FixtureName;
  root: string;
  namedPkgMapData?: PkgMapDatum[];
  unnamedPkgMapData?: PkgMapDatum[];
  brokenPkgRoots?: Fixture['brokenPkgRoots'];
}) => {
  root = `${__dirname}/${root}`;

  const expandDatumToEntry = ({ name, root: subRoot }: PkgMapDatum): PkgMapEntry => {
    return [
      name,
      {
        id: basename(subRoot),
        root: `${root}/${subRoot}`,
        json: require(`${root}/${subRoot}/package.json`)
      } as WorkspacePackage
    ];
  };

  Fixtures[fixtureName] = {
    root,
    json: (() => {
      try {
        return require(`${root}/package.json`);
      } catch {}
    })(),
    namedPkgMapData: namedPkgMapData.map(expandDatumToEntry),
    unnamedPkgMapData: unnamedPkgMapData.map(expandDatumToEntry),
    brokenPkgRoots: brokenPkgRoots.map((path) => `${root}/${path}`)
  };
};

createFixture({
  fixtureName: 'badMonorepo',
  root: 'bad-monorepo',
  unnamedPkgMapData: [
    { name: 'empty', root: 'packages/empty' },
    { name: 'tsbuildinfo', root: 'packages/tsbuildinfo' },
    { name: 'x-private', root: 'packages/x-private' },
    { name: 'xx-bad-deps', root: 'packages/xx-bad-deps' },
    { name: 'xx-bad-engines', root: 'packages/xx-bad-engines' },
    { name: 'xx-bad-exports', root: 'packages/xx-bad-exports' },
    { name: 'xx-bad-exports-2', root: 'packages/xx-bad-exports-2' },
    { name: 'xx-bad-exports-3', root: 'packages/xx-bad-exports-3' },
    { name: 'xx-bad-exports-outdated', root: 'packages/xx-bad-exports-outdated' },
    { name: 'xx-bad-files', root: 'packages/xx-bad-files' },
    { name: 'xx-bad-importer', root: 'packages/xx-bad-importer' },
    { name: 'xx-bad-license', root: 'packages/xx-bad-license' },
    { name: 'xx-bad-version-1', root: 'packages/xx-bad-version-1' },
    { name: 'xx-bad-version-2', root: 'packages/xx-bad-version-2' },
    { name: 'xxx-bad-engines-2', root: 'packages/xxx-bad-engines-2' },
    { name: 'xxy-bad-docs-entry', root: 'packages/xxy-bad-docs-entry' }
  ]
});

createFixture({
  fixtureName: 'badMonorepoDuplicateId',
  root: 'bad-monorepo-duplicate-id'
});

createFixture({
  fixtureName: 'badMonorepoDuplicateName',
  root: 'bad-monorepo-duplicate-name'
});

createFixture({
  fixtureName: 'badMonorepoEmptyMdFiles',
  root: 'bad-monorepo-empty-md-files',
  unnamedPkgMapData: [{ name: 'md-empty', root: 'packages/md-empty' }]
});

createFixture({
  fixtureName: 'badMonorepoNonPackageDir',
  root: 'bad-monorepo-non-package-dir',
  namedPkgMapData: [{ name: 'pkg-1', root: 'pkgs/pkg-1' }],
  brokenPkgRoots: ['pkgs/pkg-10', 'pkgs/pkg-100']
});

createFixture({
  fixtureName: 'badPolyrepo',
  root: 'bad-polyrepo'
});

createFixture({
  fixtureName: 'badPolyrepoDocsEntry',
  root: 'bad-polyrepo-docs-entry'
});

createFixture({
  fixtureName: 'badPolyrepoEmptyMdFiles',
  root: 'bad-polyrepo-empty-md-files'
});

createFixture({
  fixtureName: 'badPolyrepoEngines',
  root: 'bad-polyrepo-engines'
});

createFixture({
  fixtureName: 'badPolyrepoEngines2',
  root: 'bad-polyrepo-engines-2'
});

createFixture({
  fixtureName: 'badPolyrepoExports',
  root: 'bad-polyrepo-exports'
});

createFixture({
  fixtureName: 'badPolyrepoExports2',
  root: 'bad-polyrepo-exports-2'
});

createFixture({
  fixtureName: 'badPolyrepoExports3',
  root: 'bad-polyrepo-exports-3'
});

createFixture({
  fixtureName: 'badPolyrepoExportsOutdated',
  root: 'bad-polyrepo-exports-outdated'
});

createFixture({
  fixtureName: 'badPolyrepoFiles',
  root: 'bad-polyrepo-files'
});

createFixture({
  fixtureName: 'badPolyrepoImporter',
  root: 'bad-polyrepo-importer'
});

createFixture({
  fixtureName: 'badPolyrepoLicense',
  root: 'bad-polyrepo-license'
});

createFixture({
  fixtureName: 'badPolyrepoNoPackageJson',
  root: 'bad-polyrepo-no-package-json'
});

createFixture({
  fixtureName: 'badPolyrepoPrivate',
  root: 'bad-polyrepo-private'
});

createFixture({
  fixtureName: 'badPolyrepoVersion1',
  root: 'bad-polyrepo-version-1'
});

createFixture({
  fixtureName: 'badPolyrepoVersion2',
  root: 'bad-polyrepo-version-2'
});

createFixture({
  fixtureName: 'goodMonorepo',
  root: 'good-monorepo',
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
  root: 'good-monorepo-duplicate-id',
  namedPkgMapData: [
    { name: 'pkg-1', root: 'packages-1/pkg-1' },
    { name: 'pkg-2', root: 'packages-2/pkg-1' }
  ]
});

createFixture({
  fixtureName: 'goodMonorepoNegatedPaths',
  root: 'good-monorepo-negated-paths',
  namedPkgMapData: [
    { name: 'pkg-1', root: 'packages/pkg-1' },
    { name: '@namespace/pkg-3', root: 'packages/pkg-3-x' }
  ]
});

createFixture({
  fixtureName: 'goodMonorepoSimplePaths',
  root: 'good-monorepo-simple-paths',
  namedPkgMapData: [
    { name: 'pkg-1', root: 'pkgs/pkg-1' },
    { name: 'pkg-10', root: 'pkgs/pkg-10' }
  ]
});

createFixture({
  fixtureName: 'goodMonorepoVersion',
  root: 'good-monorepo-version',
  namedPkgMapData: [{ name: 'pkg-1', root: 'packages/pkg-1' }]
});

createFixture({
  fixtureName: 'goodMonorepoWeirdAbsolute',
  root: 'good-monorepo-weird-absolute',
  namedPkgMapData: [
    { name: 'pkg-1', root: 'packages/pkg-1' },
    { name: 'pkg-2', root: 'packages/pkg-2' }
  ]
});

createFixture({
  fixtureName: 'goodMonorepoWeirdBoneless',
  root: 'good-monorepo-weird-boneless',
  namedPkgMapData: [{ name: 'pkg-1', root: 'pkg-1' }]
});

createFixture({
  fixtureName: 'goodMonorepoWeirdOverlap',
  root: 'good-monorepo-weird-overlap',
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
  fixtureName: 'goodMonorepoWeirdYarn',
  root: 'good-monorepo-weird-yarn',
  namedPkgMapData: [
    { name: 'pkg-1', root: 'packages/pkg-1' },
    { name: 'pkg-2', root: 'packages/pkg-2' }
  ]
});

createFixture({
  fixtureName: 'goodMonorepoWindows',
  root: 'good-monorepo-windows',
  namedPkgMapData: [
    { name: 'pkg-1', root: 'packages/deep/pkg' },
    { name: 'pkg-2', root: 'packages/deep/wkg' }
  ]
});

createFixture({ fixtureName: 'goodPackageJson', root: 'good-package-json' });
createFixture({ fixtureName: 'goodPolyrepo', root: 'good-polyrepo' });
