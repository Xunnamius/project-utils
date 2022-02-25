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
  | 'badMonorepoDuplicateId'
  | 'badMonorepoDuplicateName'
  | 'badPolyrepoNoPackageJson'
  | 'goodMonorepo'
  | 'goodMonorepoDuplicateId'
  | 'goodMonorepoNegatedPaths'
  | 'goodMonorepoNonPackageDir'
  | 'goodMonorepoSimplePaths'
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
  fixtureName: 'badMonorepoDuplicateId',
  root: `bad-monorepo-duplicate-id`
});

createFixture({
  fixtureName: 'badMonorepoDuplicateName',
  root: `bad-monorepo-duplicate-name`
});

createFixture({
  fixtureName: 'badPolyrepoNoPackageJson',
  root: `bad-polyrepo-no-package-json`
});

createFixture({
  fixtureName: 'goodMonorepo',
  root: `good-monorepo`,
  namedPkgMapData: [
    { name: 'pkg-1', root: 'packages/pkg-1' },
    { name: '@namespaced/pkg', root: 'packages/pkg-2' }
  ],
  unnamedPkgMapData: [
    { name: 'unnamed-pkg-1', root: 'packages/unnamed-pkg-1' },
    { name: 'unnamed-pkg-2', root: 'packages/unnamed-pkg-2' }
  ],
  brokenPkgRoots: ['packages/not-a-package']
});

createFixture({
  fixtureName: 'goodMonorepoDuplicateId',
  root: `good-monorepo-duplicate-id`,
  namedPkgMapData: [
    { name: 'pkg-1', root: 'packages-1/pkg-1' },
    { name: 'pkg-2', root: 'packages-2/pkg-1' }
  ]
});

createFixture({
  fixtureName: 'goodMonorepoNegatedPaths',
  root: `good-monorepo-negated-paths`,
  namedPkgMapData: [
    { name: 'pkg-1', root: 'packages/pkg-1' },
    { name: '@namespace/pkg-3', root: 'packages/pkg-3-x' }
  ]
});

createFixture({
  fixtureName: 'goodMonorepoNonPackageDir',
  root: `good-monorepo-non-package-dir`,
  namedPkgMapData: [{ name: 'pkg-1', root: 'pkgs/pkg-1' }],
  brokenPkgRoots: ['pkgs/pkg-10']
});

createFixture({
  fixtureName: 'goodMonorepoSimplePaths',
  root: `good-monorepo-simple-paths`,
  namedPkgMapData: [
    { name: 'pkg-1', root: 'pkgs/pkg-1' },
    { name: 'pkg-10', root: 'pkgs/pkg-10' }
  ]
});

createFixture({
  fixtureName: 'goodMonorepoWeirdAbsolute',
  root: `good-monorepo-weird-absolute`,
  namedPkgMapData: [
    { name: 'pkg-1', root: 'packages/pkg-1' },
    { name: 'pkg-2', root: 'packages/pkg-2' }
  ]
});

createFixture({
  fixtureName: 'goodMonorepoWeirdBoneless',
  root: `good-monorepo-weird-boneless`,
  namedPkgMapData: [{ name: 'pkg-1', root: 'pkg-1' }]
});

createFixture({
  fixtureName: 'goodMonorepoWeirdOverlap',
  root: `good-monorepo-weird-overlap`,
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
  root: `good-monorepo-weird-yarn`,
  namedPkgMapData: [
    { name: 'pkg-1', root: 'packages/pkg-1' },
    { name: 'pkg-2', root: 'packages/pkg-2' }
  ]
});

createFixture({
  fixtureName: 'goodMonorepoWindows',
  root: `good-monorepo-windows`,
  namedPkgMapData: [
    { name: 'pkg-1', root: 'packages/deep/pkg' },
    { name: 'pkg-2', root: 'packages/deep/wkg' }
  ]
});

createFixture({ fixtureName: 'goodPackageJson', root: `good-package-json` });
createFixture({ fixtureName: 'goodPolyrepo', root: `good-polyrepo` });
