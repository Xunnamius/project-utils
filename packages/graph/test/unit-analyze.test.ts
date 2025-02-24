// * These tests ensure the exported interface under test functions as expected.

import assert from 'node:assert';

import { getDummyImportPath } from '@-xun/common-dummies/imports';
import { getDummyDecoratedPath } from '@-xun/common-dummies/pseudodecorators';

import {
  dummyToProjectMetadata,
  patchJsonObjectReaders,
  repositories
} from '@-xun/common-dummies/repositories';

import { toPath } from '@-xun/fs';
import { memoizer } from '@-xun/memoize';
import { runNoRejectOnBadExit } from '@-xun/run';
import { toss } from 'toss-expression';

import { FsErrorMessage } from 'multiverse+fs:error.ts';
import { ProjectAttribute } from 'multiverse+types';

import {
  analyzeProjectStructure,
  gatherImportEntriesFromFiles,
  gatherPackageBuildTargets,
  gatherPackageFiles,
  gatherProjectFiles,
  gatherPseudodecoratorEntriesFromFiles,
  generatePackageJsonEngineMaintainedNodeVersions,
  packageJsonConfigPackageBase,
  packageRootToId,
  pathToPackage,
  prefixAssetImport,
  prefixExternalImport,
  prefixInternalImport,
  prefixNormalImport,
  prefixTypeOnlyImport,
  PseudodecoratorTag,
  sortPackagesTopologically
} from 'universe+graph';

import { GraphErrorMessage } from 'universe+graph:error.ts';

import { asMocked } from 'testverse:util.ts';

import type { RepositoryName } from '@-xun/common-dummies/repositories';
import type { AbsolutePath, RelativePath } from '@-xun/fs';
import type { GenericProjectMetadata } from '@-xun/project-types';

import type {
  GenericPackage,
  GenericWorkspacePackage,
  WorkspacePackage
} from 'multiverse+types';

import type { PackageBuildTargets } from 'universe+graph';

jest.mock<typeof import('browserslist')>('browserslist', () => {
  return mockShouldReturnBrowserslistMock
    ? mockBrowserslist
    : jest.requireActual('browserslist');
});

jest.mock('@-xun/run');

// eslint-disable-next-line jest/require-hook
let mockShouldReturnBrowserslistMock = false;

const mockBrowserslist = asMocked<typeof import('browserslist')>();
// ? We mock this so we can control what external calls to git/npx/etc do
const mockRunNoRejectOnBadExit = asMocked(runNoRejectOnBadExit);

beforeEach(() => {
  jest.spyOn(process, 'cwd').mockImplementation(() => '/fake/cwd');
});

afterEach(() => {
  mockShouldReturnBrowserslistMock = false;
  memoizer.clearAll();
});

describe('::generatePackageJsonEngineMaintainedNodeVersions', () => {
  it('returns maintained node versions in engine format by default', async () => {
    expect.hasAssertions();

    jest.isolateModules(() => {
      mockShouldReturnBrowserslistMock = true;

      mockBrowserslist.mockImplementationOnce(() => [
        'node 1.2.3',
        'node 4.5.6',
        'node 7.8.9'
      ]);

      expect(generatePackageJsonEngineMaintainedNodeVersions()).toBe(
        '^1.2.3 || ^4.5.6 || >=7.8.9'
      );
    });
  });

  it('can return maintained node versions in array format', async () => {
    expect.hasAssertions();

    jest.isolateModules(() => {
      mockShouldReturnBrowserslistMock = true;

      mockBrowserslist.mockImplementationOnce(() => [
        'node 1.2.3',
        'node 4.5.6',
        'node 7.8.9'
      ]);

      expect(
        generatePackageJsonEngineMaintainedNodeVersions({ format: 'array' })
      ).toStrictEqual(['1.2.3', '4.5.6', '7.8.9']);
    });
  });

  it('always lists versions in ascending semver order (highest last)', async () => {
    expect.hasAssertions();

    jest.isolateModules(() => {
      mockShouldReturnBrowserslistMock = true;

      mockBrowserslist.mockImplementationOnce(() => [
        'node 4.5.6',
        'node 7.8.9',
        'node 1.2.3'
      ]);

      expect(generatePackageJsonEngineMaintainedNodeVersions()).toBe(
        '^1.2.3 || ^4.5.6 || >=7.8.9'
      );
    });
  });
});

describe('::packageRootToId', () => {
  it('translates a path to a package id', async () => {
    expect.hasAssertions();

    expect(packageRootToId('/repo/path/packages/pkg-1' as AbsolutePath)).toBe('pkg-1');
  });

  it('replaces non-alphanumeric characters with hyphens', async () => {
    expect.hasAssertions();

    expect(packageRootToId('/repo/path/packages/bad& pack@g3!d' as AbsolutePath)).toBe(
      'bad--pack-g3-d'
    );
  });
});

describe('::pathToPackage', () => {
  it('translates a path to the root package in a polyrepo', () => {
    expect.hasAssertions();

    const projectMetadata = dummyToProjectMetadata('goodPolyrepo');

    expect(pathToPackage(repositories.goodPolyrepo.root, projectMetadata)).toStrictEqual(
      projectMetadata.rootPackage
    );

    expect(
      pathToPackage(
        (repositories.goodPolyrepo.root + '/some/path/to/somewhere.ts') as AbsolutePath,
        projectMetadata
      )
    ).toStrictEqual(projectMetadata.rootPackage);
  });

  it('translates a path to the root package in a hybridrepo', () => {
    expect.hasAssertions();

    const projectMetadata = dummyToProjectMetadata('goodHybridrepo');

    expect(
      pathToPackage(repositories.goodHybridrepo.root, projectMetadata)
    ).toStrictEqual(projectMetadata.rootPackage);

    expect(
      pathToPackage(
        (repositories.goodHybridrepo.root + '/package.json') as AbsolutePath,
        projectMetadata
      )
    ).toStrictEqual(projectMetadata.rootPackage);
  });

  it('translates a path to a sub-root package in a monorepo', () => {
    expect.hasAssertions();

    const projectMetadata = dummyToProjectMetadata('goodHybridrepo');
    const firstPackage = repositories.goodHybridrepo.namedPackageMapData[0]![1];
    const secondPackage = repositories.goodHybridrepo.unnamedPackageMapData[0]![1];

    expect(pathToPackage(firstPackage.root, projectMetadata)).toStrictEqual(
      firstPackage
    );

    expect(
      pathToPackage(
        (firstPackage.root + '/package.json') as AbsolutePath,
        projectMetadata
      )
    ).toStrictEqual(firstPackage);

    expect(
      pathToPackage(
        (firstPackage.root + '/some/path/to/somewhere.ts') as AbsolutePath,
        projectMetadata
      )
    ).toStrictEqual(firstPackage);

    expect(pathToPackage(secondPackage.root, projectMetadata)).toStrictEqual(
      secondPackage
    );

    expect(
      pathToPackage(
        (secondPackage.root + '/package.json') as AbsolutePath,
        projectMetadata
      )
    ).toStrictEqual(secondPackage);

    expect(
      pathToPackage(
        (secondPackage.root + '/some/path/to/somewhere.ts') as AbsolutePath,
        projectMetadata
      )
    ).toStrictEqual(secondPackage);
  });

  it('throws if path is not within project', () => {
    expect.hasAssertions();

    const projectMetadata = dummyToProjectMetadata('goodHybridrepo');

    expect(() => pathToPackage('/dev/null' as AbsolutePath, projectMetadata)).toThrow(
      GraphErrorMessage.PathOutsideRoot('/')
    );
  });
});

describe('::gatherProjectFiles', () => {
  describe('<synchronous>', () => {
    it('returns ProjectFiles result with expected paths for polyrepo without duplicates in packageJsonFiles.elsewhere vs atProjectRoot/atWorkspaceRoot', () => {
      expect.hasAssertions();

      const root = repositories.goodPolyrepo.root;

      expect(
        gatherProjectFiles.sync(dummyToProjectMetadata('goodPolyrepo'), {
          useCached: true
        })
      ).toStrictEqual({
        mainBinFiles: {
          atAnyRoot: [],
          atProjectRoot: undefined,
          atWorkspaceRoot: new Map()
        },
        markdownFiles: {
          all: [
            `${root}/.vercel/something.md`,
            `${root}/README.md`,
            `${root}/something-else.md`
          ],
          inRoot: [
            `${root}/.vercel/something.md`,
            `${root}/README.md`,
            `${root}/something-else.md`
          ],
          inWorkspace: new Map()
        },
        packageJsonFiles: {
          atAnyRoot: [`${root}/package.json`],
          atProjectRoot: `${root}/package.json`,
          atWorkspaceRoot: new Map(),
          elsewhere: [`${root}/.vercel/package.json`, `${root}/src/package.json`]
        },
        typescriptSrcFiles: {
          all: [
            `${root}/src/1.ts`,
            `${root}/src/2.mts`,
            `${root}/src/3.cts`,
            `${root}/src/4.tsx`
          ],
          inRootSrc: [
            `${root}/src/1.ts`,
            `${root}/src/2.mts`,
            `${root}/src/3.cts`,
            `${root}/src/4.tsx`
          ],
          inWorkspaceSrc: new Map()
        },
        typescriptTestFiles: {
          all: [
            `${root}/test/nested/type-2.test.tsx`,
            `${root}/test/type-1.test.ts`,
            `${root}/test/unit-jest.test.ts`
          ],
          inRootTest: [
            `${root}/test/nested/type-2.test.tsx`,
            `${root}/test/type-1.test.ts`,
            `${root}/test/unit-jest.test.ts`
          ],
          inWorkspaceTest: new Map()
        }
      });
    });

    it('returns ProjectFiles result with expected paths for monorepo without duplicates in packageJsonFiles.elsewhere vs atProjectRoot/atWorkspaceRoot', () => {
      expect.hasAssertions();

      const root = repositories.goodMonorepo.root;

      expect(
        gatherProjectFiles.sync(dummyToProjectMetadata('goodMonorepo'), {
          useCached: true
        })
      ).toStrictEqual({
        mainBinFiles: {
          atAnyRoot: [
            `${root}/packages/pkg-1/dist/index.js`,
            `${root}/packages/pkg-2/dist/x.js`
          ],
          atProjectRoot: undefined,
          atWorkspaceRoot: new Map([
            ['pkg-1', `${root}/packages/pkg-1/dist/index.js`],
            ['pkg-2', `${root}/packages/pkg-2/dist/x.js`],
            ['pkg-import', undefined]
          ])
        },
        markdownFiles: {
          all: [
            `${root}/README.md`,
            `${root}/something-else.md`,
            `${root}/packages/pkg-1/README.md`,
            `${root}/packages/pkg-2/some-other-file.md`,
            `${root}/packages/pkg-import/README.md`
          ],
          inRoot: [`${root}/README.md`, `${root}/something-else.md`],
          inWorkspace: new Map([
            ['pkg-1', [`${root}/packages/pkg-1/README.md`]],
            ['pkg-2', [`${root}/packages/pkg-2/some-other-file.md`]],
            ['pkg-import', [`${root}/packages/pkg-import/README.md`]]
          ])
        },
        packageJsonFiles: {
          atAnyRoot: [
            `${root}/package.json`,
            `${root}/packages/pkg-1/package.json`,
            `${root}/packages/pkg-2/package.json`,
            `${root}/packages/pkg-import/package.json`
          ],
          atProjectRoot: `${root}/package.json`,
          atWorkspaceRoot: new Map([
            ['pkg-1', `${root}/packages/pkg-1/package.json`],
            ['pkg-2', `${root}/packages/pkg-2/package.json`],
            ['pkg-import', `${root}/packages/pkg-import/package.json`]
          ]),
          elsewhere: [
            `${root}/packages/pkg-2/src/package.json`,
            `${root}/packages/pkg-import/src/package.json`,
            `${root}/packages/unnamed-pkg-1/package.json`,
            `${root}/packages/unnamed-pkg-2/package.json`
          ]
        },
        typescriptSrcFiles: {
          all: [
            `${root}/packages/pkg-2/src/4.tsx`,
            `${root}/packages/pkg-import/src/index.ts`
          ],
          inRootSrc: [],
          inWorkspaceSrc: new Map([
            ['pkg-1', []],
            ['pkg-2', [`${root}/packages/pkg-2/src/4.tsx`]],
            ['pkg-import', [`${root}/packages/pkg-import/src/index.ts`]]
          ])
        },
        typescriptTestFiles: {
          all: [],
          inRootTest: [],
          inWorkspaceTest: new Map([
            ['pkg-1', []],
            ['pkg-2', []],
            ['pkg-import', []]
          ])
        }
      });
    });

    it('returns ProjectFiles result with expected paths for hybridrepo (monorepo) without duplicates in packageJsonFiles.elsewhere vs atProjectRoot/atWorkspaceRoot', () => {
      expect.hasAssertions();

      const root = repositories.goodHybridrepo.root;

      expect(
        gatherProjectFiles.sync(dummyToProjectMetadata('goodHybridrepo'), {
          useCached: true
        })
      ).toStrictEqual({
        mainBinFiles: {
          atAnyRoot: [`${root}/dist/src/cli.js`, `${root}/packages/cli/dist/index.js`],
          atProjectRoot: `${root}/dist/src/cli.js`,
          atWorkspaceRoot: new Map([
            ['cli', `${root}/packages/cli/dist/index.js`],
            ['private', undefined],
            ['webpack', undefined]
          ])
        },
        markdownFiles: {
          all: [
            `${root}/.git-ignored/nope.md`,
            `${root}/packages/cli/README.md`,
            `${root}/packages/private/src/markdown/1.md`,
            `${root}/packages/private/src/markdown/2.md`,
            `${root}/packages/private/src/markdown/3.md`,
            `${root}/packages/webpack/README.md`
          ],
          inRoot: [`${root}/.git-ignored/nope.md`],
          inWorkspace: new Map([
            ['cli', [`${root}/packages/cli/README.md`]],
            [
              'private',
              [
                `${root}/packages/private/src/markdown/1.md`,
                `${root}/packages/private/src/markdown/2.md`,
                `${root}/packages/private/src/markdown/3.md`
              ]
            ],
            ['webpack', [`${root}/packages/webpack/README.md`]]
          ])
        },
        packageJsonFiles: {
          atAnyRoot: [
            `${root}/package.json`,
            `${root}/packages/cli/package.json`,
            `${root}/packages/private/package.json`,
            `${root}/packages/webpack/package.json`
          ],
          atProjectRoot: `${root}/package.json`,
          atWorkspaceRoot: new Map([
            ['cli', `${root}/packages/cli/package.json`],
            ['private', `${root}/packages/private/package.json`],
            ['webpack', `${root}/packages/webpack/package.json`]
          ]),
          elsewhere: [
            `${root}/packages/cli/src/package.json`,
            `${root}/packages/private/src/markdown/package.json`,
            `${root}/packages/unnamed-cjs/package.json`,
            `${root}/packages/unnamed-cjs/src/package.json`,
            `${root}/packages/unnamed-esm/package.json`,
            `${root}/src/package.json`
          ]
        },
        typescriptSrcFiles: {
          all: [
            `${root}/src/2.mts`,
            `${root}/src/3.cts`,
            `${root}/src/4.tsx`,
            `${root}/src/index.ts`,
            `${root}/packages/cli/src/som-file.tsx`
          ],
          inRootSrc: [
            `${root}/src/2.mts`,
            `${root}/src/3.cts`,
            `${root}/src/4.tsx`,
            `${root}/src/index.ts`
          ],
          inWorkspaceSrc: new Map([
            ['cli', [`${root}/packages/cli/src/som-file.tsx`]],
            ['private', []],
            ['webpack', []]
          ])
        },
        typescriptTestFiles: {
          all: [
            `${root}/test/nested/type-2.test.tsx`,
            `${root}/test/type-1.test.ts`,
            `${root}/test/unit-jest.test.ts`,
            `${root}/packages/cli/test/my.unit.test.ts`,
            `${root}/packages/cli/test/nested/type-3.test.ts`,
            `${root}/packages/cli/test/type-4.test.ts`,
            `${root}/packages/private/test/my.unit.test.ts`,
            `${root}/packages/private/test/nested/my.unit.test.ts`,
            `${root}/packages/private/test/type-5.test.ts`
          ],
          inRootTest: [
            `${root}/test/nested/type-2.test.tsx`,
            `${root}/test/type-1.test.ts`,
            `${root}/test/unit-jest.test.ts`
          ],
          inWorkspaceTest: new Map([
            [
              'cli',
              [
                `${root}/packages/cli/test/my.unit.test.ts`,
                `${root}/packages/cli/test/nested/type-3.test.ts`,
                `${root}/packages/cli/test/type-4.test.ts`
              ]
            ],
            [
              'private',
              [
                `${root}/packages/private/test/my.unit.test.ts`,
                `${root}/packages/private/test/nested/my.unit.test.ts`,
                `${root}/packages/private/test/type-5.test.ts`
              ]
            ],
            ['webpack', []]
          ])
        }
      });
    });

    it('returns result from internal cache if available unless useCached is false (new result is always added to internal cache)', () => {
      expect.hasAssertions();

      const dummyMetadata = dummyToProjectMetadata('goodPolyrepo');
      const projectFiles = gatherProjectFiles.sync(dummyMetadata, { useCached: false });

      expect(projectFiles).toBe(
        gatherProjectFiles.sync(dummyMetadata, { useCached: true })
      );

      const updatedProjectFiles = gatherProjectFiles.sync(dummyMetadata, {
        useCached: false
      });

      expect(updatedProjectFiles).not.toBe(projectFiles);

      expect(gatherProjectFiles.sync(dummyMetadata, { useCached: true })).toBe(
        updatedProjectFiles
      );
    });

    it('uses entire call signature when constructing internal cache key', () => {
      expect.hasAssertions();

      const projectMetadata = dummyToProjectMetadata('goodHybridrepo');

      const result1 = gatherProjectFiles.sync(projectMetadata, {
        ignoreUnsupportedFeatures: true,
        useCached: true
      });

      const result2 = gatherProjectFiles.sync(projectMetadata, {
        ignoreUnsupportedFeatures: false,
        useCached: true
      });

      expect(result1).not.toBe(result2);
    });

    it('does not ignore files in prettier when "skipPrettierIgnored" is false', () => {
      expect.hasAssertions();

      const root = repositories.goodPolyrepo.root;

      expect(
        gatherProjectFiles.sync(dummyToProjectMetadata('goodPolyrepo'), {
          skipPrettierIgnored: false,
          useCached: true
        })
      ).toStrictEqual({
        mainBinFiles: {
          atAnyRoot: [],
          atProjectRoot: undefined,
          atWorkspaceRoot: new Map()
        },
        markdownFiles: {
          all: [
            `${root}/.vercel/something.md`,
            `${root}/dist/should-be-ignored.md`,
            `${root}/README.md`,
            `${root}/something-else.md`
          ],
          inRoot: [
            `${root}/.vercel/something.md`,
            `${root}/dist/should-be-ignored.md`,
            `${root}/README.md`,
            `${root}/something-else.md`
          ],
          inWorkspace: new Map()
        },
        packageJsonFiles: {
          atAnyRoot: [`${root}/package.json`],
          atProjectRoot: `${root}/package.json`,
          atWorkspaceRoot: new Map(),
          elsewhere: [
            `${root}/.vercel/package.json`,
            `${root}/dist/package.json`,
            `${root}/src/package.json`
          ]
        },
        typescriptSrcFiles: {
          all: [
            `${root}/src/1.ts`,
            `${root}/src/2.mts`,
            `${root}/src/3.cts`,
            `${root}/src/4.tsx`
          ],
          inRootSrc: [
            `${root}/src/1.ts`,
            `${root}/src/2.mts`,
            `${root}/src/3.cts`,
            `${root}/src/4.tsx`
          ],
          inWorkspaceSrc: new Map()
        },
        typescriptTestFiles: {
          all: [
            `${root}/test/nested/type-2.test.tsx`,
            `${root}/test/type-1.test.ts`,
            `${root}/test/unit-jest.test.ts`
          ],
          inRootTest: [
            `${root}/test/nested/type-2.test.tsx`,
            `${root}/test/type-1.test.ts`,
            `${root}/test/unit-jest.test.ts`
          ],
          inWorkspaceTest: new Map()
        }
      });
    });

    it('throws given bad sync options', () => {
      expect.hasAssertions();

      expect(() =>
        gatherProjectFiles.sync(dummyToProjectMetadata('goodPolyrepo'), {
          // @ts-expect-error: we expect this to fail or something's wrong
          skipUnknown: true,
          useCached: true
        })
      ).toThrow(GraphErrorMessage.DeriverAsyncConfigurationConflict());
    });

    it('throws if a root or workspace package.json file contains "directories"', () => {
      expect.hasAssertions();

      const projectMetadata = dummyToProjectMetadata('goodPolyrepo');

      projectMetadata.rootPackage.json.directories = { bin: 'bad' };

      expect(() =>
        gatherProjectFiles.sync(projectMetadata, { useCached: true })
      ).toThrow(GraphErrorMessage.UnsupportedFeature(''));

      delete projectMetadata.rootPackage.json.directories;

      projectMetadata.subRootPackages = new Map([
        [
          'id',
          {
            root: 'fake/package',
            json: { directories: { bin: 'bad' } }
          } as WorkspacePackage
        ]
      ]) as typeof projectMetadata.subRootPackages;

      expect(() =>
        gatherProjectFiles.sync(projectMetadata, { useCached: true })
      ).toThrow(GraphErrorMessage.UnsupportedFeature(''));

      expect(() =>
        gatherProjectFiles.sync(dummyToProjectMetadata('goodPolyrepo'), {
          useCached: true
        })
      ).not.toThrow(GraphErrorMessage.UnsupportedFeature(''));

      expect(() =>
        gatherProjectFiles.sync(dummyToProjectMetadata('goodMonorepo'), {
          useCached: true
        })
      ).not.toThrow(GraphErrorMessage.UnsupportedFeature(''));
    });
  });

  describe('<asynchronous>', () => {
    it('returns ProjectFiles result with expected paths for polyrepo without duplicates in packageJsonFiles.elsewhere vs atProjectRoot/atWorkspaceRoot', async () => {
      expect.hasAssertions();

      const root = repositories.goodPolyrepo.root;

      await expect(
        gatherProjectFiles(dummyToProjectMetadata('goodPolyrepo'), { useCached: true })
      ).resolves.toStrictEqual({
        mainBinFiles: {
          atAnyRoot: [],
          atProjectRoot: undefined,
          atWorkspaceRoot: new Map()
        },
        markdownFiles: {
          all: [
            `${root}/.vercel/something.md`,
            `${root}/README.md`,
            `${root}/something-else.md`
          ],
          inRoot: [
            `${root}/.vercel/something.md`,
            `${root}/README.md`,
            `${root}/something-else.md`
          ],
          inWorkspace: new Map()
        },
        packageJsonFiles: {
          atAnyRoot: [`${root}/package.json`],
          atProjectRoot: `${root}/package.json`,
          atWorkspaceRoot: new Map(),
          elsewhere: [`${root}/.vercel/package.json`, `${root}/src/package.json`]
        },
        typescriptSrcFiles: {
          all: [
            `${root}/src/1.ts`,
            `${root}/src/2.mts`,
            `${root}/src/3.cts`,
            `${root}/src/4.tsx`
          ],
          inRootSrc: [
            `${root}/src/1.ts`,
            `${root}/src/2.mts`,
            `${root}/src/3.cts`,
            `${root}/src/4.tsx`
          ],
          inWorkspaceSrc: new Map()
        },
        typescriptTestFiles: {
          all: [
            `${root}/test/nested/type-2.test.tsx`,
            `${root}/test/type-1.test.ts`,
            `${root}/test/unit-jest.test.ts`
          ],
          inRootTest: [
            `${root}/test/nested/type-2.test.tsx`,
            `${root}/test/type-1.test.ts`,
            `${root}/test/unit-jest.test.ts`
          ],
          inWorkspaceTest: new Map()
        }
      });
    });

    it('returns ProjectFiles result with expected paths for monorepo without duplicates in packageJsonFiles.elsewhere vs atProjectRoot/atWorkspaceRoot', async () => {
      expect.hasAssertions();

      const root = repositories.goodMonorepo.root;

      await expect(
        gatherProjectFiles(dummyToProjectMetadata('goodMonorepo'), { useCached: true })
      ).resolves.toStrictEqual({
        mainBinFiles: {
          atAnyRoot: [
            `${root}/packages/pkg-1/dist/index.js`,
            `${root}/packages/pkg-2/dist/x.js`
          ],
          atProjectRoot: undefined,
          atWorkspaceRoot: new Map([
            ['pkg-1', `${root}/packages/pkg-1/dist/index.js`],
            ['pkg-2', `${root}/packages/pkg-2/dist/x.js`],
            ['pkg-import', undefined]
          ])
        },
        markdownFiles: {
          all: [
            `${root}/README.md`,
            `${root}/something-else.md`,
            `${root}/packages/pkg-1/README.md`,
            `${root}/packages/pkg-2/some-other-file.md`,
            `${root}/packages/pkg-import/README.md`
          ],
          inRoot: [`${root}/README.md`, `${root}/something-else.md`],
          inWorkspace: new Map([
            ['pkg-1', [`${root}/packages/pkg-1/README.md`]],
            ['pkg-2', [`${root}/packages/pkg-2/some-other-file.md`]],
            ['pkg-import', [`${root}/packages/pkg-import/README.md`]]
          ])
        },
        packageJsonFiles: {
          atAnyRoot: [
            `${root}/package.json`,
            `${root}/packages/pkg-1/package.json`,
            `${root}/packages/pkg-2/package.json`,
            `${root}/packages/pkg-import/package.json`
          ],
          atProjectRoot: `${root}/package.json`,
          atWorkspaceRoot: new Map([
            ['pkg-1', `${root}/packages/pkg-1/package.json`],
            ['pkg-2', `${root}/packages/pkg-2/package.json`],
            ['pkg-import', `${root}/packages/pkg-import/package.json`]
          ]),
          elsewhere: [
            `${root}/packages/pkg-2/src/package.json`,
            `${root}/packages/pkg-import/src/package.json`,
            `${root}/packages/unnamed-pkg-1/package.json`,
            `${root}/packages/unnamed-pkg-2/package.json`
          ]
        },
        typescriptSrcFiles: {
          all: [
            `${root}/packages/pkg-2/src/4.tsx`,
            `${root}/packages/pkg-import/src/index.ts`
          ],
          inRootSrc: [],
          inWorkspaceSrc: new Map([
            ['pkg-1', []],
            ['pkg-2', [`${root}/packages/pkg-2/src/4.tsx`]],
            ['pkg-import', [`${root}/packages/pkg-import/src/index.ts`]]
          ])
        },
        typescriptTestFiles: {
          all: [],
          inRootTest: [],
          inWorkspaceTest: new Map([
            ['pkg-1', []],
            ['pkg-2', []],
            ['pkg-import', []]
          ])
        }
      });
    });

    it('returns ProjectFiles result with expected paths for hybridrepo (monorepo) without duplicates in packageJsonFiles.elsewhere vs atProjectRoot/atWorkspaceRoot', async () => {
      expect.hasAssertions();

      const root = repositories.goodHybridrepo.root;

      await expect(
        gatherProjectFiles(dummyToProjectMetadata('goodHybridrepo'), {
          useCached: true
        })
      ).resolves.toStrictEqual({
        mainBinFiles: {
          atAnyRoot: [`${root}/dist/src/cli.js`, `${root}/packages/cli/dist/index.js`],
          atProjectRoot: `${root}/dist/src/cli.js`,
          atWorkspaceRoot: new Map([
            ['cli', `${root}/packages/cli/dist/index.js`],
            ['private', undefined],
            ['webpack', undefined]
          ])
        },
        markdownFiles: {
          all: [
            `${root}/.git-ignored/nope.md`,
            `${root}/packages/cli/README.md`,
            `${root}/packages/private/src/markdown/1.md`,
            `${root}/packages/private/src/markdown/2.md`,
            `${root}/packages/private/src/markdown/3.md`,
            `${root}/packages/webpack/README.md`
          ],
          inRoot: [`${root}/.git-ignored/nope.md`],
          inWorkspace: new Map([
            ['cli', [`${root}/packages/cli/README.md`]],
            [
              'private',
              [
                `${root}/packages/private/src/markdown/1.md`,
                `${root}/packages/private/src/markdown/2.md`,
                `${root}/packages/private/src/markdown/3.md`
              ]
            ],
            ['webpack', [`${root}/packages/webpack/README.md`]]
          ])
        },
        packageJsonFiles: {
          atAnyRoot: [
            `${root}/package.json`,
            `${root}/packages/cli/package.json`,
            `${root}/packages/private/package.json`,
            `${root}/packages/webpack/package.json`
          ],
          atProjectRoot: `${root}/package.json`,
          atWorkspaceRoot: new Map([
            ['cli', `${root}/packages/cli/package.json`],
            ['private', `${root}/packages/private/package.json`],
            ['webpack', `${root}/packages/webpack/package.json`]
          ]),
          elsewhere: [
            `${root}/packages/cli/src/package.json`,
            `${root}/packages/private/src/markdown/package.json`,
            `${root}/packages/unnamed-cjs/package.json`,
            `${root}/packages/unnamed-cjs/src/package.json`,
            `${root}/packages/unnamed-esm/package.json`,
            `${root}/src/package.json`
          ]
        },
        typescriptSrcFiles: {
          all: [
            `${root}/src/2.mts`,
            `${root}/src/3.cts`,
            `${root}/src/4.tsx`,
            `${root}/src/index.ts`,
            `${root}/packages/cli/src/som-file.tsx`
          ],
          inRootSrc: [
            `${root}/src/2.mts`,
            `${root}/src/3.cts`,
            `${root}/src/4.tsx`,
            `${root}/src/index.ts`
          ],
          inWorkspaceSrc: new Map([
            ['cli', [`${root}/packages/cli/src/som-file.tsx`]],
            ['private', []],
            ['webpack', []]
          ])
        },
        typescriptTestFiles: {
          all: [
            `${root}/test/nested/type-2.test.tsx`,
            `${root}/test/type-1.test.ts`,
            `${root}/test/unit-jest.test.ts`,
            `${root}/packages/cli/test/my.unit.test.ts`,
            `${root}/packages/cli/test/nested/type-3.test.ts`,
            `${root}/packages/cli/test/type-4.test.ts`,
            `${root}/packages/private/test/my.unit.test.ts`,
            `${root}/packages/private/test/nested/my.unit.test.ts`,
            `${root}/packages/private/test/type-5.test.ts`
          ],
          inRootTest: [
            `${root}/test/nested/type-2.test.tsx`,
            `${root}/test/type-1.test.ts`,
            `${root}/test/unit-jest.test.ts`
          ],
          inWorkspaceTest: new Map([
            [
              'cli',
              [
                `${root}/packages/cli/test/my.unit.test.ts`,
                `${root}/packages/cli/test/nested/type-3.test.ts`,
                `${root}/packages/cli/test/type-4.test.ts`
              ]
            ],
            [
              'private',
              [
                `${root}/packages/private/test/my.unit.test.ts`,
                `${root}/packages/private/test/nested/my.unit.test.ts`,
                `${root}/packages/private/test/type-5.test.ts`
              ]
            ],
            ['webpack', []]
          ])
        }
      });
    });

    it('returns result from internal cache if available unless useCached is false (new result is always added to internal cache)', async () => {
      expect.hasAssertions();

      const dummyMetadata = dummyToProjectMetadata('goodPolyrepo');
      const projectFiles = await gatherProjectFiles(dummyMetadata, { useCached: false });

      expect(projectFiles).toBe(
        await gatherProjectFiles(dummyMetadata, { useCached: true })
      );

      const updatedProjectFiles = await gatherProjectFiles(dummyMetadata, {
        useCached: false
      });

      expect(updatedProjectFiles).not.toBe(projectFiles);

      await expect(gatherProjectFiles(dummyMetadata, { useCached: true })).resolves.toBe(
        updatedProjectFiles
      );
    });

    it('uses entire call signature when constructing internal cache key', async () => {
      expect.hasAssertions();

      const projectMetadata = dummyToProjectMetadata('goodHybridrepo');

      const result1 = await gatherProjectFiles(projectMetadata, {
        ignoreUnsupportedFeatures: true,
        useCached: true
      });

      const result2 = await gatherProjectFiles(projectMetadata, {
        ignoreUnsupportedFeatures: false,
        useCached: true
      });

      expect(result1).not.toBe(result2);
    });

    it('does not ignore files in prettier when "skipPrettierIgnored" is false', async () => {
      expect.hasAssertions();

      const root = repositories.goodPolyrepo.root;

      await expect(
        gatherProjectFiles(dummyToProjectMetadata('goodPolyrepo'), {
          skipPrettierIgnored: false,
          useCached: true
        })
      ).resolves.toStrictEqual({
        mainBinFiles: {
          atAnyRoot: [],
          atProjectRoot: undefined,
          atWorkspaceRoot: new Map()
        },
        markdownFiles: {
          all: [
            `${root}/.vercel/something.md`,
            `${root}/dist/should-be-ignored.md`,
            `${root}/README.md`,
            `${root}/something-else.md`
          ],
          inRoot: [
            `${root}/.vercel/something.md`,
            `${root}/dist/should-be-ignored.md`,
            `${root}/README.md`,
            `${root}/something-else.md`
          ],
          inWorkspace: new Map()
        },
        packageJsonFiles: {
          atAnyRoot: [`${root}/package.json`],
          atProjectRoot: `${root}/package.json`,
          atWorkspaceRoot: new Map(),
          elsewhere: [
            `${root}/.vercel/package.json`,
            `${root}/dist/package.json`,
            `${root}/src/package.json`
          ]
        },
        typescriptSrcFiles: {
          all: [
            `${root}/src/1.ts`,
            `${root}/src/2.mts`,
            `${root}/src/3.cts`,
            `${root}/src/4.tsx`
          ],
          inRootSrc: [
            `${root}/src/1.ts`,
            `${root}/src/2.mts`,
            `${root}/src/3.cts`,
            `${root}/src/4.tsx`
          ],
          inWorkspaceSrc: new Map()
        },
        typescriptTestFiles: {
          all: [
            `${root}/test/nested/type-2.test.tsx`,
            `${root}/test/type-1.test.ts`,
            `${root}/test/unit-jest.test.ts`
          ],
          inRootTest: [
            `${root}/test/nested/type-2.test.tsx`,
            `${root}/test/type-1.test.ts`,
            `${root}/test/unit-jest.test.ts`
          ],
          inWorkspaceTest: new Map()
        }
      });
    });

    it('ignores files unknown to git when "skipUnknown" is true', async () => {
      expect.hasAssertions();

      const root = repositories.goodPolyrepo.root;

      mockRunNoRejectOnBadExit.mockImplementation(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        () => Promise.resolve({ stdout: 'something-else*' } as any)
      );

      await expect(
        gatherProjectFiles(dummyToProjectMetadata('goodPolyrepo'), {
          skipUnknown: true,
          useCached: true
        })
      ).resolves.toStrictEqual({
        mainBinFiles: {
          atAnyRoot: [],
          atProjectRoot: undefined,
          atWorkspaceRoot: new Map()
        },
        markdownFiles: {
          all: [`${root}/.vercel/something.md`, `${root}/README.md`],
          inRoot: [`${root}/.vercel/something.md`, `${root}/README.md`],
          inWorkspace: new Map()
        },
        packageJsonFiles: {
          atAnyRoot: [`${root}/package.json`],
          atProjectRoot: `${root}/package.json`,
          atWorkspaceRoot: new Map(),
          elsewhere: [`${root}/.vercel/package.json`, `${root}/src/package.json`]
        },
        typescriptSrcFiles: {
          all: [
            `${root}/src/1.ts`,
            `${root}/src/2.mts`,
            `${root}/src/3.cts`,
            `${root}/src/4.tsx`
          ],
          inRootSrc: [
            `${root}/src/1.ts`,
            `${root}/src/2.mts`,
            `${root}/src/3.cts`,
            `${root}/src/4.tsx`
          ],
          inWorkspaceSrc: new Map()
        },
        typescriptTestFiles: {
          all: [
            `${root}/test/nested/type-2.test.tsx`,
            `${root}/test/type-1.test.ts`,
            `${root}/test/unit-jest.test.ts`
          ],
          inRootTest: [
            `${root}/test/nested/type-2.test.tsx`,
            `${root}/test/type-1.test.ts`,
            `${root}/test/unit-jest.test.ts`
          ],
          inWorkspaceTest: new Map()
        }
      });
    });

    it('generates a type error if "skipUnknown" is true when "skipPrettierIgnored" is false', async () => {
      expect.hasAssertions();

      await expect(
        gatherProjectFiles(
          dummyToProjectMetadata('goodPolyrepo'),
          // @ts-expect-error: if this doesn't cause an error, something's wrong
          {
            skipPrettierIgnored: false,
            skipUnknown: true,
            useCached: true
          }
        )
      ).resolves.toBeDefined();
    });

    it('throws if a root or workspace package.json file contains "directories"', async () => {
      expect.hasAssertions();

      const projectMetadata = dummyToProjectMetadata('goodPolyrepo');

      projectMetadata.rootPackage.json.directories = { bin: 'bad' };

      await expect(
        gatherProjectFiles(projectMetadata, { useCached: true })
      ).rejects.toThrow(GraphErrorMessage.UnsupportedFeature(''));

      delete projectMetadata.rootPackage.json.directories;

      projectMetadata.subRootPackages = new Map([
        [
          'id',
          {
            root: 'fake/package',
            json: { directories: { bin: 'bad' } }
          } as WorkspacePackage
        ]
      ]) as typeof projectMetadata.subRootPackages;

      await expect(
        gatherProjectFiles(projectMetadata, { useCached: true })
      ).rejects.toThrow(GraphErrorMessage.UnsupportedFeature(''));

      await expect(
        gatherProjectFiles(dummyToProjectMetadata('goodPolyrepo'), { useCached: true })
      ).resolves.toBeDefined();

      await expect(
        gatherProjectFiles(dummyToProjectMetadata('goodMonorepo'), { useCached: true })
      ).resolves.toBeDefined();
    });
  });
});

describe('::gatherImportEntriesFromFiles', () => {
  describe('<synchronous>', () => {
    it('returns an array of import specifier entries from esm-style imports without type imports', () => {
      expect.hasAssertions();

      const fileOne = getDummyImportPath('ts');
      const fileTwo = getDummyImportPath('mts');
      const fileThree = getDummyImportPath('cts');
      const fileFour = getDummyImportPath('tsx');

      const fileOneResult = {
        normal: new Set([
          'react',
          './some-utils.js',
          'side-effects.js',
          './styles.css',
          'some-lib',
          'package.json',
          'my-neat-lib',
          './source.js',
          './another-source.js',
          'my-neat-lib-2',
          'dynamic',
          'package.json'
        ]),
        typeOnly: new Set([
          'type-fest-1',
          'type-fest-2',
          './type-fest-3.js',
          '@type/fest4',
          'this-is-a-typeof-import',
          'this-is-a-type-import'
        ])
      };

      const fileTwoResult = {
        normal: new Set(['./tool.js', '../path/to/import.js', 'string-literal']),
        typeOnly: new Set([])
      };

      const fileThreeResult = fileTwoResult;
      const fileFourResult = fileOneResult;

      expect(
        gatherImportEntriesFromFiles.sync([fileOne], { useCached: true })
      ).toStrictEqual([[fileOne, fileOneResult]]);

      expect(
        gatherImportEntriesFromFiles.sync([fileTwo], { useCached: true })
      ).toStrictEqual([[fileTwo, fileTwoResult]]);

      expect(
        gatherImportEntriesFromFiles.sync([fileThree], { useCached: true })
      ).toStrictEqual([[fileThree, fileThreeResult]]);

      expect(
        gatherImportEntriesFromFiles.sync([fileFour], { useCached: true })
      ).toStrictEqual([[fileFour, fileFourResult]]);

      expect(
        gatherImportEntriesFromFiles.sync(
          [fileOne, fileTwo, fileOne, fileThree, fileFour],
          { useCached: true }
        )
      ).toStrictEqual([
        [fileOne, fileOneResult],
        [fileTwo, fileTwoResult],
        [fileOne, fileOneResult],
        [fileThree, fileThreeResult],
        [fileFour, fileFourResult]
      ]);
    });

    it('returns an array of import specifier entries from cjs-style require calls without type imports', () => {
      expect.hasAssertions();

      const fileOne = getDummyImportPath('js');
      const fileTwo = getDummyImportPath('mjs');
      const fileThree = getDummyImportPath('cjs');
      const fileFour = getDummyImportPath('jsx');

      const fileResult = {
        normal: new Set([
          'react',
          './some-utils.js',
          'side-effects.js',
          './styles.css',
          'some-lib',
          './source.js',
          './another-source.js',
          './tool.js',
          '../path/to/import.js',
          'string-literal'
        ]),
        typeOnly: new Set([])
      };

      expect(
        gatherImportEntriesFromFiles.sync([fileOne], { useCached: true })
      ).toStrictEqual([[fileOne, fileResult]]);

      expect(
        gatherImportEntriesFromFiles.sync([fileTwo], { useCached: true })
      ).toStrictEqual([[fileTwo, fileResult]]);

      expect(
        gatherImportEntriesFromFiles.sync([fileThree], { useCached: true })
      ).toStrictEqual([[fileThree, fileResult]]);

      expect(
        gatherImportEntriesFromFiles.sync([fileFour], { useCached: true })
      ).toStrictEqual([[fileFour, fileResult]]);

      expect(
        gatherImportEntriesFromFiles.sync(
          [fileOne, fileTwo, fileOne, fileThree, fileFour],
          { useCached: true }
        )
      ).toStrictEqual([
        [fileOne, fileResult],
        [fileTwo, fileResult],
        [fileOne, fileResult],
        [fileThree, fileResult],
        [fileFour, fileResult]
      ]);
    });

    it('returns empty set for non-typescript files', () => {
      expect.hasAssertions();

      const fileOne = `/fake/file/path/package.json` as AbsolutePath;

      expect(
        gatherImportEntriesFromFiles.sync([fileOne], { useCached: true })
      ).toStrictEqual([[fileOne, { normal: new Set(), typeOnly: new Set() }]]);

      expect(
        gatherImportEntriesFromFiles.sync([fileOne, fileOne, fileOne], {
          useCached: true
        })
      ).toStrictEqual([
        [fileOne, { normal: new Set(), typeOnly: new Set() }],
        [fileOne, { normal: new Set(), typeOnly: new Set() }],
        [fileOne, { normal: new Set(), typeOnly: new Set() }]
      ]);
    });

    it('throws if @babel/core is not available', () => {
      expect.hasAssertions();

      jest.doMock<typeof import('@babel/core')>('@babel/core', () => {
        throw new Error('fake import failure!');
      });

      expect(() =>
        gatherImportEntriesFromFiles.sync(['/file.ts' as AbsolutePath], {
          useCached: true
        })
      ).toThrow(
        GraphErrorMessage.MissingOptionalBabelDependency('gatherImportEntriesFromFiles')
      );

      jest.dontMock('@babel/core');
    });

    it('throws if @babel/plugin-syntax-typescript is not available', () => {
      expect.hasAssertions();

      // eslint-disable-next-line jest/no-untyped-mock-factory
      jest.doMock('@babel/plugin-syntax-typescript', () => {
        throw new Error('fake import failure!');
      });

      expect(() =>
        gatherImportEntriesFromFiles.sync(['/file.ts' as AbsolutePath], {
          useCached: true
        })
      ).toThrow(
        GraphErrorMessage.MissingOptionalBabelDependency('gatherImportEntriesFromFiles')
      );

      jest.dontMock('@babel/plugin-syntax-typescript');
    });

    it('returns result from internal cache if available unless useCached is false (new result is always added to internal cache)', () => {
      expect.hasAssertions();

      const fileOne = getDummyImportPath('ts');

      const importEntries = gatherImportEntriesFromFiles.sync([fileOne], {
        useCached: false
      });

      expect(importEntries[0]![1]).toBe(
        gatherImportEntriesFromFiles.sync([fileOne], { useCached: true })[0]![1]
      );

      const updatedImportEntries = gatherImportEntriesFromFiles.sync([fileOne], {
        useCached: false
      });

      expect(updatedImportEntries[0]![1]).not.toBe(importEntries[0]![1]);

      expect(
        gatherImportEntriesFromFiles.sync([fileOne], { useCached: true })[0]![1]
      ).toBe(updatedImportEntries[0]![1]);
    });
  });

  describe('<asynchronous>', () => {
    it('returns an array of import specifier entries from esm-style imports without type imports', async () => {
      expect.hasAssertions();

      const fileOne = getDummyImportPath('ts');
      const fileTwo = getDummyImportPath('mts');
      const fileThree = getDummyImportPath('cts');
      const fileFour = getDummyImportPath('tsx');

      const fileOneResult = {
        normal: new Set([
          'react',
          './some-utils.js',
          'side-effects.js',
          './styles.css',
          'some-lib',
          'package.json',
          'my-neat-lib',
          './source.js',
          './another-source.js',
          'my-neat-lib-2',
          'dynamic',
          'package.json'
        ]),
        typeOnly: new Set([
          'type-fest-1',
          'type-fest-2',
          './type-fest-3.js',
          '@type/fest4',
          'this-is-a-typeof-import',
          'this-is-a-type-import'
        ])
      };

      const fileTwoResult = {
        normal: new Set(['./tool.js', '../path/to/import.js', 'string-literal']),
        typeOnly: new Set([])
      };

      const fileThreeResult = fileTwoResult;
      const fileFourResult = fileOneResult;

      await expect(
        gatherImportEntriesFromFiles([fileOne], { useCached: true })
      ).resolves.toStrictEqual([[fileOne, fileOneResult]]);

      await expect(
        gatherImportEntriesFromFiles([fileTwo], { useCached: true })
      ).resolves.toStrictEqual([[fileTwo, fileTwoResult]]);

      await expect(
        gatherImportEntriesFromFiles([fileThree], { useCached: true })
      ).resolves.toStrictEqual([[fileThree, fileThreeResult]]);

      await expect(
        gatherImportEntriesFromFiles([fileFour], { useCached: true })
      ).resolves.toStrictEqual([[fileFour, fileFourResult]]);

      await expect(
        gatherImportEntriesFromFiles([fileOne, fileTwo, fileOne, fileThree, fileFour], {
          useCached: true
        })
      ).resolves.toStrictEqual([
        [fileOne, fileOneResult],
        [fileTwo, fileTwoResult],
        [fileOne, fileOneResult],
        [fileThree, fileThreeResult],
        [fileFour, fileFourResult]
      ]);
    });

    it('returns an array of import specifier entries from cjs-style require calls without type imports', async () => {
      expect.hasAssertions();

      const fileOne = getDummyImportPath('js');
      const fileTwo = getDummyImportPath('mjs');
      const fileThree = getDummyImportPath('cjs');
      const fileFour = getDummyImportPath('jsx');

      const fileResult = {
        normal: new Set([
          'react',
          './some-utils.js',
          'side-effects.js',
          './styles.css',
          'some-lib',
          './source.js',
          './another-source.js',
          './tool.js',
          '../path/to/import.js',
          'string-literal'
        ]),
        typeOnly: new Set([])
      };

      await expect(
        gatherImportEntriesFromFiles([fileOne], { useCached: true })
      ).resolves.toStrictEqual([[fileOne, fileResult]]);

      await expect(
        gatherImportEntriesFromFiles([fileTwo], { useCached: true })
      ).resolves.toStrictEqual([[fileTwo, fileResult]]);

      await expect(
        gatherImportEntriesFromFiles([fileThree], { useCached: true })
      ).resolves.toStrictEqual([[fileThree, fileResult]]);

      await expect(
        gatherImportEntriesFromFiles([fileFour], { useCached: true })
      ).resolves.toStrictEqual([[fileFour, fileResult]]);

      await expect(
        gatherImportEntriesFromFiles([fileOne, fileTwo, fileOne, fileThree, fileFour], {
          useCached: true
        })
      ).resolves.toStrictEqual([
        [fileOne, fileResult],
        [fileTwo, fileResult],
        [fileOne, fileResult],
        [fileThree, fileResult],
        [fileFour, fileResult]
      ]);
    });

    it('returns empty set for non-typescript files', async () => {
      expect.hasAssertions();

      const fileOne = `/fake/file/path/package.json` as AbsolutePath;

      await expect(
        gatherImportEntriesFromFiles([fileOne], { useCached: true })
      ).resolves.toStrictEqual([[fileOne, { normal: new Set(), typeOnly: new Set() }]]);

      await expect(
        gatherImportEntriesFromFiles([fileOne, fileOne, fileOne], { useCached: true })
      ).resolves.toStrictEqual([
        [fileOne, { normal: new Set(), typeOnly: new Set() }],
        [fileOne, { normal: new Set(), typeOnly: new Set() }],
        [fileOne, { normal: new Set(), typeOnly: new Set() }]
      ]);
    });

    it('throws if @babel/core is not available', async () => {
      expect.hasAssertions();

      jest.doMock<typeof import('@babel/core')>('@babel/core', () => {
        throw new Error('fake import failure!');
      });

      await expect(
        gatherImportEntriesFromFiles(['/file.ts' as AbsolutePath], { useCached: true })
      ).rejects.toThrow(
        GraphErrorMessage.MissingOptionalBabelDependency('gatherImportEntriesFromFiles')
      );

      jest.dontMock('@babel/core');
    });

    it('throws if @babel/plugin-syntax-typescript is not available', async () => {
      expect.hasAssertions();

      // eslint-disable-next-line jest/no-untyped-mock-factory
      jest.doMock('@babel/plugin-syntax-typescript', () => {
        throw new Error('fake import failure!');
      });

      await expect(
        gatherImportEntriesFromFiles(['/file.ts' as AbsolutePath], { useCached: true })
      ).rejects.toThrow(
        GraphErrorMessage.MissingOptionalBabelDependency('gatherImportEntriesFromFiles')
      );

      jest.dontMock('@babel/plugin-syntax-typescript');
    });

    it('returns result from internal cache if available unless useCached is false (new result is always added to internal cache)', async () => {
      expect.hasAssertions();

      const fileOne = getDummyImportPath('ts');

      const importEntries = await gatherImportEntriesFromFiles([fileOne], {
        useCached: false
      });

      expect(importEntries[0]![1]).toBe(
        (await gatherImportEntriesFromFiles([fileOne], { useCached: true }))[0]![1]
      );

      const updatedImportEntries = await gatherImportEntriesFromFiles([fileOne], {
        useCached: false
      });

      expect(updatedImportEntries[0]![1]).not.toBe(importEntries[0]![1]);

      expect(
        (await gatherImportEntriesFromFiles([fileOne], { useCached: true }))[0]![1]
      ).toBe(updatedImportEntries[0]![1]);
    });
  });
});

describe('::gatherPseudodecoratorEntriesFromFiles', () => {
  const tsFile = getDummyDecoratedPath('ts');
  const jsFile = getDummyDecoratedPath('js');
  const jsonFile = getDummyDecoratedPath('json');
  const mdFile = getDummyDecoratedPath('md');
  const ymlFile = getDummyDecoratedPath('yml');
  const superPinnedFile = getDummyDecoratedPath('extensionless');

  describe('<synchronous>', () => {
    it('returns an array of pseudodecorator entries from a variety of files', () => {
      expect.hasAssertions();

      expect(
        gatherPseudodecoratorEntriesFromFiles.sync(
          [tsFile, jsFile, jsonFile, mdFile, ymlFile],
          { useCached: true }
        )
      ).toStrictEqual(
        getExpectedPseudodecorators(tsFile, jsFile, jsonFile, mdFile, ymlFile)
      );
    });

    it('accepts technically-invalid super-pinned dependencies (containing tilde)', () => {
      expect.hasAssertions();

      expect(
        gatherPseudodecoratorEntriesFromFiles.sync([superPinnedFile], {
          useCached: true
        })
      ).toStrictEqual([
        [
          superPinnedFile,
          [
            {
              tag: PseudodecoratorTag.NotExtraneous,
              items: [
                'all~contributors~cli',
                'remark~7',
                '@jest/something~dev',
                '@babel/cli~5'
              ]
            },
            {
              tag: PseudodecoratorTag.NotInvalid,
              items: [
                'all~contributors~cli',
                'remark~7',
                '@jest/something~dev',
                '@babel/cli~5'
              ]
            }
          ]
        ]
      ]);
    });

    it('returns result from internal cache if available unless useCached is false (new result is always added to internal cache)', () => {
      expect.hasAssertions();

      const fileOne = getDummyImportPath('ts');

      const decoratorEntries = gatherPseudodecoratorEntriesFromFiles.sync([fileOne], {
        useCached: false
      });

      expect(decoratorEntries[0]![1]).toBe(
        gatherPseudodecoratorEntriesFromFiles.sync([fileOne], { useCached: true })[0]![1]
      );

      const updatedDecoratorEntries = gatherPseudodecoratorEntriesFromFiles.sync(
        [fileOne],
        { useCached: false }
      );

      expect(updatedDecoratorEntries[0]![1]).not.toBe(decoratorEntries[0]![1]);

      expect(
        gatherPseudodecoratorEntriesFromFiles.sync([fileOne], { useCached: true })[0]![1]
      ).toBe(updatedDecoratorEntries[0]![1]);
    });
  });

  describe('<asynchronous>', () => {
    it('returns an array of pseudodecorator entries from a variety of files', async () => {
      expect.hasAssertions();

      await expect(
        gatherPseudodecoratorEntriesFromFiles(
          [tsFile, jsFile, jsonFile, mdFile, ymlFile],
          { useCached: true }
        )
      ).resolves.toStrictEqual(
        getExpectedPseudodecorators(tsFile, jsFile, jsonFile, mdFile, ymlFile)
      );
    });

    it('accepts technically-invalid super-pinned dependencies (containing tilde)', async () => {
      expect.hasAssertions();

      await expect(
        gatherPseudodecoratorEntriesFromFiles([superPinnedFile], { useCached: true })
      ).resolves.toStrictEqual([
        [
          superPinnedFile,
          [
            {
              tag: PseudodecoratorTag.NotExtraneous,
              items: [
                'all~contributors~cli',
                'remark~7',
                '@jest/something~dev',
                '@babel/cli~5'
              ]
            },
            {
              tag: PseudodecoratorTag.NotInvalid,
              items: [
                'all~contributors~cli',
                'remark~7',
                '@jest/something~dev',
                '@babel/cli~5'
              ]
            }
          ]
        ]
      ]);
    });

    it('returns result from internal cache if available unless useCached is false (new result is always added to internal cache)', async () => {
      expect.hasAssertions();

      const fileOne = getDummyImportPath('ts');

      const decoratorEntries = await gatherPseudodecoratorEntriesFromFiles([fileOne], {
        useCached: false
      });

      expect(decoratorEntries[0]![1]).toBe(
        (
          await gatherPseudodecoratorEntriesFromFiles([fileOne], { useCached: true })
        )[0]![1]
      );

      const updatedDecoratorEntries = await gatherPseudodecoratorEntriesFromFiles(
        [fileOne],
        { useCached: false }
      );

      expect(updatedDecoratorEntries[0]![1]).not.toBe(decoratorEntries[0]![1]);

      expect(
        (
          await gatherPseudodecoratorEntriesFromFiles([fileOne], { useCached: true })
        )[0]![1]
      ).toBe(updatedDecoratorEntries[0]![1]);
    });
  });
});

describe('::gatherPackageFiles', () => {
  describe('<synchronous>', () => {
    it('returns expected file paths for polyrepo root package', () => {
      expect.hasAssertions();

      const { rootPackage } = dummyToProjectMetadata('goodPolyrepo');
      const { root } = rootPackage;

      expect(gatherPackageFiles.sync(rootPackage, { useCached: true })).toStrictEqual({
        dist: [
          `${root}/dist/index.js`,
          `${root}/dist/package.json`,
          `${root}/dist/should-be-ignored.md`
        ],
        docs: [],
        other: [
          `${root}/.env`,
          `${root}/.prettierignore`,
          `${root}/.vercel/package.json`,
          `${root}/.vercel/project.json`,
          `${root}/.vercel/something.md`,
          `${root}/package.json`,
          `${root}/README.md`,
          `${root}/something-else.md`,
          `${root}/types/global.ts`
        ],
        src: [
          `${root}/src/1.ts`,
          `${root}/src/2.mts`,
          `${root}/src/3.cts`,
          `${root}/src/4.tsx`,
          `${root}/src/index.js`,
          `${root}/src/package.json`
        ],
        test: [
          `${root}/test/nested/type-2.test.tsx`,
          `${root}/test/something-else.ts`,
          `${root}/test/type-1.test.ts`,
          `${root}/test/unit-jest.test.ts`
        ]
      });
    });

    it('returns expected file paths for hybridrepo (monorepo) root package', () => {
      expect.hasAssertions();

      const { rootPackage } = dummyToProjectMetadata('goodHybridrepo');
      const { root } = rootPackage;

      expect(gatherPackageFiles.sync(rootPackage, { useCached: true })).toStrictEqual({
        dist: [],
        docs: [],
        other: [
          `${root}/.gitignore`,
          `${root}/.prettierignore`,
          `${root}/package.json`,
          `${root}/vercel.json`,
          `${root}/webpack.config.mjs`
        ],
        src: [
          `${root}/src/1.js`,
          `${root}/src/2.mts`,
          `${root}/src/3.cts`,
          `${root}/src/4.tsx`,
          `${root}/src/index.ts`,
          `${root}/src/package.json`
        ],
        test: [
          `${root}/test/nested/type-2.test.tsx`,
          `${root}/test/something-else.ts`,
          `${root}/test/type-1.test.ts`,
          `${root}/test/unit-jest.test.ts`
        ]
      });
    });

    it('returns expected file paths for hybridrepo sub-root packages (named and unnamed)', () => {
      expect.hasAssertions();

      const projectMetadata = dummyToProjectMetadata('goodHybridrepo');

      {
        const workspacePackage = projectMetadata.subRootPackages!.get('cli')!;
        const { root } = workspacePackage;

        expect(
          gatherPackageFiles.sync(workspacePackage, { useCached: true })
        ).toStrictEqual({
          dist: [`${root}/dist/index.js`],
          docs: [`${root}/docs/docs.md`],
          other: [`${root}/package.json`, `${root}/README.md`],
          src: [
            `${root}/src/index.js`,
            `${root}/src/package.json`,
            `${root}/src/som-file.tsx`
          ],
          test: [
            `${root}/test/my.unit.test.ts`,
            `${root}/test/nested/type-3.test.ts`,
            `${root}/test/something-else.ts`,
            `${root}/test/type-4.test.ts`
          ]
        });
      }

      {
        const workspacePackage =
          projectMetadata.subRootPackages!.unnamed.get('unnamed-cjs')!;
        const { root } = workspacePackage;

        expect(
          gatherPackageFiles.sync(workspacePackage, { useCached: true })
        ).toStrictEqual({
          dist: [`${root}/dist/index.js`],
          docs: [],
          other: [`${root}/package.json`, `${root}/README.md`],
          src: [`${root}/src/index.js`, `${root}/src/package.json`],
          test: []
        });
      }
    });

    it('respects "ignore" option including negation', () => {
      expect.hasAssertions();

      {
        const { rootPackage } = dummyToProjectMetadata('goodPolyrepo');
        const { root } = rootPackage;

        expect(
          gatherPackageFiles.sync(rootPackage, {
            ignore: ['*.mts', '/4.tsx', '.vercel'],
            useCached: true
          })
        ).toStrictEqual({
          dist: [
            `${root}/dist/index.js`,
            `${root}/dist/package.json`,
            `${root}/dist/should-be-ignored.md`
          ],
          docs: [],
          other: [
            `${root}/.env`,
            `${root}/.prettierignore`,
            `${root}/package.json`,
            `${root}/README.md`,
            `${root}/something-else.md`,
            `${root}/types/global.ts`
          ],
          src: [
            `${root}/src/1.ts`,
            `${root}/src/3.cts`,
            `${root}/src/4.tsx`,
            `${root}/src/index.js`,
            `${root}/src/package.json`
          ],
          test: [
            `${root}/test/nested/type-2.test.tsx`,
            `${root}/test/something-else.ts`,
            `${root}/test/type-1.test.ts`,
            `${root}/test/unit-jest.test.ts`
          ]
        });
      }

      {
        const { rootPackage } = dummyToProjectMetadata('goodHybridrepo');
        const { root } = rootPackage;

        expect(
          gatherPackageFiles.sync(rootPackage, {
            ignore: ['package.json'],
            useCached: true
          })
        ).toStrictEqual({
          dist: [],
          docs: [],
          other: [
            `${root}/.gitignore`,
            `${root}/.prettierignore`,
            `${root}/vercel.json`,
            `${root}/webpack.config.mjs`
          ],
          src: [
            `${root}/src/1.js`,
            `${root}/src/2.mts`,
            `${root}/src/3.cts`,
            `${root}/src/4.tsx`,
            `${root}/src/index.ts`
          ],
          test: [
            `${root}/test/nested/type-2.test.tsx`,
            `${root}/test/something-else.ts`,
            `${root}/test/type-1.test.ts`,
            `${root}/test/unit-jest.test.ts`
          ]
        });
      }

      {
        const { rootPackage } = dummyToProjectMetadata('goodHybridrepo');
        const { root } = rootPackage;

        expect(
          gatherPackageFiles.sync(rootPackage, {
            ignore: [`!.git-ignored/nope.md`],
            useCached: true
          })
        ).toStrictEqual({
          dist: [],
          docs: [],
          other: [
            `${root}/.git-ignored/nope.md`,
            `${root}/.gitignore`,
            `${root}/.prettierignore`,
            `${root}/package.json`,
            `${root}/vercel.json`,
            `${root}/webpack.config.mjs`
          ],
          src: [
            `${root}/src/1.js`,
            `${root}/src/2.mts`,
            `${root}/src/3.cts`,
            `${root}/src/4.tsx`,
            `${root}/src/index.ts`,
            `${root}/src/package.json`
          ],
          test: [
            `${root}/test/nested/type-2.test.tsx`,
            `${root}/test/something-else.ts`,
            `${root}/test/type-1.test.ts`,
            `${root}/test/unit-jest.test.ts`
          ]
        });
      }
    });

    it('respects "skipGitIgnored" option', () => {
      expect.hasAssertions();

      const { rootPackage } = dummyToProjectMetadata('goodHybridrepo');
      const { root } = rootPackage;

      expect(
        gatherPackageFiles.sync(rootPackage, { skipGitIgnored: true, useCached: true })
      ).toStrictEqual({
        dist: [],
        docs: [],
        other: [
          `${root}/.gitignore`,
          `${root}/.prettierignore`,
          `${root}/package.json`,
          `${root}/vercel.json`,
          `${root}/webpack.config.mjs`
        ],
        src: [
          `${root}/src/1.js`,
          `${root}/src/2.mts`,
          `${root}/src/3.cts`,
          `${root}/src/4.tsx`,
          `${root}/src/index.ts`,
          `${root}/src/package.json`
        ],
        test: [
          `${root}/test/nested/type-2.test.tsx`,
          `${root}/test/something-else.ts`,
          `${root}/test/type-1.test.ts`,
          `${root}/test/unit-jest.test.ts`
        ]
      });

      expect(
        gatherPackageFiles.sync(rootPackage, { skipGitIgnored: false, useCached: true })
      ).toStrictEqual({
        dist: [],
        docs: [],
        other: [
          `${root}/.git-ignored/nope.md`,
          `${root}/.git/.gitkeep`,
          `${root}/.gitignore`,
          `${root}/.prettierignore`,
          `${root}/package.json`,
          `${root}/vercel.json`,
          `${root}/webpack.config.mjs`
        ],
        src: [
          `${root}/src/1.js`,
          `${root}/src/2.mts`,
          `${root}/src/3.cts`,
          `${root}/src/4.tsx`,
          `${root}/src/index.ts`,
          `${root}/src/package.json`
        ],
        test: [
          `${root}/test/nested/type-2.test.tsx`,
          `${root}/test/something-else.ts`,
          `${root}/test/type-1.test.ts`,
          `${root}/test/unit-jest.test.ts`
        ]
      });
    });

    it('returns result from internal cache if available unless useCached is false (new result is always added to internal cache)', () => {
      expect.hasAssertions();

      const dummyMetadata = dummyToProjectMetadata('goodPolyrepo');
      const packageFiles = gatherPackageFiles.sync(dummyMetadata.rootPackage, {
        useCached: false
      });

      expect(packageFiles).toBe(
        gatherPackageFiles.sync(dummyMetadata.rootPackage, { useCached: true })
      );

      const updatedPackageFiles = gatherPackageFiles.sync(dummyMetadata.rootPackage, {
        useCached: false
      });

      expect(updatedPackageFiles).not.toBe(packageFiles);

      expect(
        gatherPackageFiles.sync(dummyMetadata.rootPackage, { useCached: true })
      ).toBe(updatedPackageFiles);
    });

    it('uses entire call signature when constructing internal cache key', () => {
      expect.hasAssertions();

      const { rootPackage } = dummyToProjectMetadata('goodHybridrepo');
      const result1 = gatherPackageFiles.sync(rootPackage, {
        skipGitIgnored: true,
        useCached: true
      });
      const result2 = gatherPackageFiles.sync(rootPackage, {
        skipGitIgnored: false,
        useCached: true
      });

      expect(result1).not.toBe(result2);
    });
  });

  describe('<asynchronous>', () => {
    it('returns expected file paths for polyrepo root package', async () => {
      expect.hasAssertions();

      const { rootPackage } = dummyToProjectMetadata('goodPolyrepo');
      const { root } = rootPackage;

      await expect(
        gatherPackageFiles(rootPackage, { useCached: true })
      ).resolves.toStrictEqual({
        dist: [
          `${root}/dist/index.js`,
          `${root}/dist/package.json`,
          `${root}/dist/should-be-ignored.md`
        ],
        docs: [],
        other: [
          `${root}/.env`,
          `${root}/.prettierignore`,
          `${root}/.vercel/package.json`,
          `${root}/.vercel/project.json`,
          `${root}/.vercel/something.md`,
          `${root}/package.json`,
          `${root}/README.md`,
          `${root}/something-else.md`,
          `${root}/types/global.ts`
        ],
        src: [
          `${root}/src/1.ts`,
          `${root}/src/2.mts`,
          `${root}/src/3.cts`,
          `${root}/src/4.tsx`,
          `${root}/src/index.js`,
          `${root}/src/package.json`
        ],
        test: [
          `${root}/test/nested/type-2.test.tsx`,
          `${root}/test/something-else.ts`,
          `${root}/test/type-1.test.ts`,
          `${root}/test/unit-jest.test.ts`
        ]
      });
    });

    it('returns expected file paths for hybridrepo (monorepo) root package', async () => {
      expect.hasAssertions();

      const { rootPackage } = dummyToProjectMetadata('goodHybridrepo');
      const { root } = rootPackage;

      await expect(
        gatherPackageFiles(rootPackage, { useCached: true })
      ).resolves.toStrictEqual({
        dist: [],
        docs: [],
        other: [
          `${root}/.gitignore`,
          `${root}/.prettierignore`,
          `${root}/package.json`,
          `${root}/vercel.json`,
          `${root}/webpack.config.mjs`
        ],
        src: [
          `${root}/src/1.js`,
          `${root}/src/2.mts`,
          `${root}/src/3.cts`,
          `${root}/src/4.tsx`,
          `${root}/src/index.ts`,
          `${root}/src/package.json`
        ],
        test: [
          `${root}/test/nested/type-2.test.tsx`,
          `${root}/test/something-else.ts`,
          `${root}/test/type-1.test.ts`,
          `${root}/test/unit-jest.test.ts`
        ]
      });
    });

    it('returns expected file paths for hybridrepo sub-root packages (named and unnamed)', async () => {
      expect.hasAssertions();

      const projectMetadata = dummyToProjectMetadata('goodHybridrepo');

      {
        const workspacePackage = projectMetadata.subRootPackages!.get('cli')!;
        const { root } = workspacePackage;

        await expect(
          gatherPackageFiles(workspacePackage, { useCached: true })
        ).resolves.toStrictEqual({
          dist: [`${root}/dist/index.js`],
          docs: [`${root}/docs/docs.md`],
          other: [`${root}/package.json`, `${root}/README.md`],
          src: [
            `${root}/src/index.js`,
            `${root}/src/package.json`,
            `${root}/src/som-file.tsx`
          ],
          test: [
            `${root}/test/my.unit.test.ts`,
            `${root}/test/nested/type-3.test.ts`,
            `${root}/test/something-else.ts`,
            `${root}/test/type-4.test.ts`
          ]
        });
      }

      {
        const workspacePackage =
          projectMetadata.subRootPackages!.unnamed.get('unnamed-cjs')!;
        const { root } = workspacePackage;

        await expect(
          gatherPackageFiles(workspacePackage, { useCached: true })
        ).resolves.toStrictEqual({
          dist: [`${root}/dist/index.js`],
          docs: [],
          other: [`${root}/package.json`, `${root}/README.md`],
          src: [`${root}/src/index.js`, `${root}/src/package.json`],
          test: []
        });
      }
    });

    it('respects "ignore" option including negation', async () => {
      expect.hasAssertions();

      {
        const { rootPackage } = dummyToProjectMetadata('goodPolyrepo');
        const { root } = rootPackage;

        await expect(
          gatherPackageFiles(rootPackage, {
            ignore: ['*.mts', '/4.tsx', '.vercel'],
            useCached: true
          })
        ).resolves.toStrictEqual({
          dist: [
            `${root}/dist/index.js`,
            `${root}/dist/package.json`,
            `${root}/dist/should-be-ignored.md`
          ],
          docs: [],
          other: [
            `${root}/.env`,
            `${root}/.prettierignore`,
            `${root}/package.json`,
            `${root}/README.md`,
            `${root}/something-else.md`,
            `${root}/types/global.ts`
          ],
          src: [
            `${root}/src/1.ts`,
            `${root}/src/3.cts`,
            `${root}/src/4.tsx`,
            `${root}/src/index.js`,
            `${root}/src/package.json`
          ],
          test: [
            `${root}/test/nested/type-2.test.tsx`,
            `${root}/test/something-else.ts`,
            `${root}/test/type-1.test.ts`,
            `${root}/test/unit-jest.test.ts`
          ]
        });
      }

      {
        const { rootPackage } = dummyToProjectMetadata('goodHybridrepo');
        const { root } = rootPackage;

        await expect(
          gatherPackageFiles(rootPackage, { ignore: ['package.json'], useCached: true })
        ).resolves.toStrictEqual({
          dist: [],
          docs: [],
          other: [
            `${root}/.gitignore`,
            `${root}/.prettierignore`,
            `${root}/vercel.json`,
            `${root}/webpack.config.mjs`
          ],
          src: [
            `${root}/src/1.js`,
            `${root}/src/2.mts`,
            `${root}/src/3.cts`,
            `${root}/src/4.tsx`,
            `${root}/src/index.ts`
          ],
          test: [
            `${root}/test/nested/type-2.test.tsx`,
            `${root}/test/something-else.ts`,
            `${root}/test/type-1.test.ts`,
            `${root}/test/unit-jest.test.ts`
          ]
        });
      }

      {
        const { rootPackage } = dummyToProjectMetadata('goodHybridrepo');
        const { root } = rootPackage;

        await expect(
          gatherPackageFiles(rootPackage, {
            ignore: [`!.git-ignored/nope.md`],
            useCached: true
          })
        ).resolves.toStrictEqual({
          dist: [],
          docs: [],
          other: [
            `${root}/.git-ignored/nope.md`,
            `${root}/.gitignore`,
            `${root}/.prettierignore`,
            `${root}/package.json`,
            `${root}/vercel.json`,
            `${root}/webpack.config.mjs`
          ],
          src: [
            `${root}/src/1.js`,
            `${root}/src/2.mts`,
            `${root}/src/3.cts`,
            `${root}/src/4.tsx`,
            `${root}/src/index.ts`,
            `${root}/src/package.json`
          ],
          test: [
            `${root}/test/nested/type-2.test.tsx`,
            `${root}/test/something-else.ts`,
            `${root}/test/type-1.test.ts`,
            `${root}/test/unit-jest.test.ts`
          ]
        });
      }
    });

    it('respects "skipGitIgnored" option', async () => {
      expect.hasAssertions();

      const { rootPackage } = dummyToProjectMetadata('goodHybridrepo');
      const { root } = rootPackage;

      await expect(
        gatherPackageFiles(rootPackage, { skipGitIgnored: true, useCached: true })
      ).resolves.toStrictEqual({
        dist: [],
        docs: [],
        other: [
          `${root}/.gitignore`,
          `${root}/.prettierignore`,
          `${root}/package.json`,
          `${root}/vercel.json`,
          `${root}/webpack.config.mjs`
        ],
        src: [
          `${root}/src/1.js`,
          `${root}/src/2.mts`,
          `${root}/src/3.cts`,
          `${root}/src/4.tsx`,
          `${root}/src/index.ts`,
          `${root}/src/package.json`
        ],
        test: [
          `${root}/test/nested/type-2.test.tsx`,
          `${root}/test/something-else.ts`,
          `${root}/test/type-1.test.ts`,
          `${root}/test/unit-jest.test.ts`
        ]
      });

      await expect(
        gatherPackageFiles(rootPackage, { skipGitIgnored: false, useCached: true })
      ).resolves.toStrictEqual({
        dist: [],
        docs: [],
        other: [
          `${root}/.git-ignored/nope.md`,
          `${root}/.git/.gitkeep`,
          `${root}/.gitignore`,
          `${root}/.prettierignore`,
          `${root}/package.json`,
          `${root}/vercel.json`,
          `${root}/webpack.config.mjs`
        ],
        src: [
          `${root}/src/1.js`,
          `${root}/src/2.mts`,
          `${root}/src/3.cts`,
          `${root}/src/4.tsx`,
          `${root}/src/index.ts`,
          `${root}/src/package.json`
        ],
        test: [
          `${root}/test/nested/type-2.test.tsx`,
          `${root}/test/something-else.ts`,
          `${root}/test/type-1.test.ts`,
          `${root}/test/unit-jest.test.ts`
        ]
      });
    });

    it('returns result from internal cache if available unless useCached is false (new result is always added to internal cache)', async () => {
      expect.hasAssertions();

      const dummyMetadata = dummyToProjectMetadata('goodPolyrepo');
      const projectFiles = await gatherPackageFiles(dummyMetadata.rootPackage, {
        useCached: false
      });

      expect(projectFiles).toBe(
        await gatherPackageFiles(dummyMetadata.rootPackage, { useCached: true })
      );

      const updatedProjectFiles = await gatherPackageFiles(dummyMetadata.rootPackage, {
        useCached: false
      });

      expect(updatedProjectFiles).not.toBe(projectFiles);

      await expect(
        gatherPackageFiles(dummyMetadata.rootPackage, { useCached: true })
      ).resolves.toBe(updatedProjectFiles);
    });

    it('uses entire call signature when constructing internal cache key', async () => {
      expect.hasAssertions();

      const { rootPackage } = dummyToProjectMetadata('goodHybridrepo');
      const result1 = await gatherPackageFiles(rootPackage, {
        skipGitIgnored: true,
        useCached: true
      });
      const result2 = await gatherPackageFiles(rootPackage, {
        skipGitIgnored: false,
        useCached: true
      });

      expect(result1).not.toBe(result2);
    });
  });
});

describe('::gatherPackageBuildTargets', () => {
  describe('<synchronous>', () => {
    it('returns expected build targets for polyrepo root package', () => {
      expect.hasAssertions();

      expect(
        gatherPackageBuildTargets.sync(
          dummyToProjectMetadata('goodPolyrepo').rootPackage,
          { allowMultiversalImports: true, useCached: true }
        )
      ).toStrictEqual({
        targets: {
          external: {
            normal: new Set(['types/global.ts'] as RelativePath[]),
            typeOnly: new Set([] as RelativePath[])
          },
          internal: new Set([
            'src/1.ts',
            'src/2.mts',
            'src/3.cts',
            'src/4.tsx',
            'src/index.js',
            'src/package.json'
          ] as RelativePath[])
        },
        metadata: {
          imports: {
            aliasCounts: {
              typeverse: {
                count: 2,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixInternalImport,
                  prefixTypeOnlyImport
                ])
              },
              universe: {
                count: 4,
                prefixes: new Set([prefixNormalImport, prefixInternalImport])
              }
            },
            dependencyCounts: {}
          }
        }
      } satisfies PackageBuildTargets);
    });

    it('returns expected build targets for multiversal hybridrepo root package', () => {
      expect.hasAssertions();

      expect(
        gatherPackageBuildTargets.sync(
          dummyToProjectMetadata('goodHybridrepoMultiversal').rootPackage,
          { allowMultiversalImports: true, useCached: true }
        )
      ).toStrictEqual({
        targets: {
          external: {
            normal: new Set([
              'packages/cli/src/index.ts',
              'packages/private/src/index.ts',
              'packages/private/package.json',
              'packages/webpack/webpack.config.ts',
              'packages/private/src/lib/library.ts',
              'packages/webpack/src/webpack-lib.ts',
              'packages/webpack/package.json',
              'packages/private/src/lib/library2.ts',
              'packages/webpack/src/webpack-lib2.ts'
            ] as RelativePath[]),
            typeOnly: new Set([
              'src/index.ts',
              'src/others.ts',
              'types/global.ts',
              'types/others.ts'
            ] as RelativePath[])
          },
          internal: new Set(['src/index.ts', 'src/others.ts'] as RelativePath[])
        },
        metadata: {
          imports: {
            aliasCounts: {
              'multiverse+cli': {
                count: 2,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixInternalImport,
                  prefixTypeOnlyImport
                ])
              },
              'multiverse+private': {
                count: 6,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixInternalImport,
                  prefixExternalImport,
                  prefixTypeOnlyImport
                ])
              },
              'multiverse+webpack': {
                count: 2,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixExternalImport,
                  prefixTypeOnlyImport
                ])
              },
              'rootverse+private': {
                count: 4,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixInternalImport,
                  prefixExternalImport,
                  prefixTypeOnlyImport
                ])
              },
              'rootverse+webpack': {
                count: 6,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixInternalImport,
                  prefixExternalImport,
                  prefixTypeOnlyImport
                ])
              },
              typeverse: {
                count: 3,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixTypeOnlyImport,
                  prefixExternalImport
                ])
              },
              universe: {
                count: 4,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixInternalImport,
                  prefixTypeOnlyImport
                ])
              },
              'universe+private': {
                count: 2,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixExternalImport,
                  prefixTypeOnlyImport
                ])
              },
              'universe+webpack': {
                count: 2,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixExternalImport,
                  prefixTypeOnlyImport
                ])
              }
            },
            dependencyCounts: {
              '@babel/core': {
                count: 2,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixInternalImport,
                  prefixTypeOnlyImport
                ])
              },
              '@black-flag/core': {
                count: 2,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixExternalImport,
                  prefixTypeOnlyImport
                ])
              },
              'another-package': {
                count: 2,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixExternalImport,
                  prefixTypeOnlyImport
                ])
              },
              'node:path': {
                count: 2,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixInternalImport,
                  prefixTypeOnlyImport
                ])
              },
              'some-package': {
                count: 2,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixExternalImport,
                  prefixTypeOnlyImport
                ])
              },
              'type-fest': {
                count: 2,
                prefixes: new Set([prefixTypeOnlyImport, prefixExternalImport])
              },
              webpack: {
                count: 2,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixExternalImport,
                  prefixTypeOnlyImport
                ])
              },
              'webpack~2': {
                count: 2,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixExternalImport,
                  prefixTypeOnlyImport
                ])
              }
            }
          }
        }
      } satisfies PackageBuildTargets);
    });

    it('returns expected build targets for multiversal hybridrepo sub-root "cli" package', () => {
      expect.hasAssertions();

      expect(
        gatherPackageBuildTargets.sync(
          dummyToProjectMetadata('goodHybridrepoMultiversal').subRootPackages!.get(
            'cli'
          )!,
          { allowMultiversalImports: true, useCached: true }
        )
      ).toStrictEqual({
        targets: {
          external: {
            normal: new Set([
              'packages/private/src/index.ts',
              'packages/private/src/lib/library.ts',
              'packages/webpack/src/webpack-lib.ts',
              'packages/webpack/package.json',
              'packages/private/src/lib/library2.ts',
              'packages/private/package.json'
            ] as RelativePath[]),
            typeOnly: new Set(['types/global.ts', 'types/others.ts'] as RelativePath[])
          },
          internal: new Set(['packages/cli/src/index.ts'] as RelativePath[])
        },
        metadata: {
          imports: {
            aliasCounts: {
              'multiverse+private': {
                count: 2,
                prefixes: new Set([prefixNormalImport, prefixInternalImport])
              },
              'multiverse+webpack': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixInternalImport])
              },
              'rootverse+private': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixExternalImport])
              },
              'rootverse+webpack': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixInternalImport])
              },
              typeverse: {
                count: 2,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixTypeOnlyImport,
                  prefixExternalImport
                ])
              },
              'universe+private': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixExternalImport])
              }
            },
            dependencyCounts: {
              '@black-flag/core': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixInternalImport])
              },
              'another-package': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixExternalImport])
              },
              'some-package': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixExternalImport])
              },
              'type-fest': {
                count: 2,
                prefixes: new Set([prefixTypeOnlyImport, prefixExternalImport])
              },
              webpack: {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixExternalImport])
              }
            }
          }
        }
      } satisfies PackageBuildTargets);
    });

    it('returns expected build targets for multiversal hybridrepo sub-root "private" package', () => {
      expect.hasAssertions();

      try {
        repositories.goodHybridrepoMultiversal.namedPackageMapData.push(
          repositories.goodHybridrepoMultiversal.unnamedPackageMapData[0]!
        );

        expect(
          gatherPackageBuildTargets.sync(
            dummyToProjectMetadata('goodHybridrepoMultiversal').subRootPackages!.get(
              'private'
            )!,
            { allowMultiversalImports: true, useCached: true }
          )
        ).toStrictEqual({
          targets: {
            external: {
              normal: new Set(['packages/private/package.json'] as RelativePath[]),
              typeOnly: new Set(['types/global.ts', 'types/others.ts'] as RelativePath[])
            },
            internal: new Set([
              'packages/private/src/index.ts',
              'packages/private/src/lib/library.ts',
              'packages/private/src/lib/library2.ts',
              'packages/private/src/markdown/1.md',
              'packages/private/src/markdown/2.md',
              'packages/private/src/markdown/3.md'
            ] as RelativePath[])
          },
          metadata: {
            imports: {
              aliasCounts: {
                'rootverse+private': {
                  count: 1,
                  prefixes: new Set([prefixNormalImport, prefixInternalImport])
                },
                typeverse: {
                  count: 2,
                  prefixes: new Set([
                    prefixTypeOnlyImport,
                    prefixNormalImport,
                    prefixInternalImport,
                    prefixExternalImport
                  ])
                },
                'universe+private': {
                  count: 1,
                  prefixes: new Set([prefixNormalImport, prefixInternalImport])
                }
              },
              dependencyCounts: {
                'another-package': {
                  count: 1,
                  prefixes: new Set([prefixNormalImport, prefixInternalImport])
                },
                'some-package': {
                  count: 1,
                  prefixes: new Set([prefixNormalImport, prefixInternalImport])
                },
                'type-fest': {
                  count: 2,
                  prefixes: new Set([prefixTypeOnlyImport, prefixExternalImport])
                }
              }
            }
          }
        } satisfies PackageBuildTargets);
      } finally {
        repositories.goodHybridrepoMultiversal.namedPackageMapData.pop();
      }
    });

    it('returns expected build targets for multiversal hybridrepo sub-root "package-one" package (where package name differs from its id)', () => {
      expect.hasAssertions();

      expect(
        gatherPackageBuildTargets.sync(
          dummyToProjectMetadata('goodHybridrepoSelfRef').subRootPackages!.get(
            'package-one'
          )!,
          { allowMultiversalImports: true, useCached: true }
        )
      ).toStrictEqual({
        targets: {
          external: {
            normal: new Set(['packages/pkg-1/package.json'] as RelativePath[]),
            typeOnly: new Set([] as RelativePath[])
          },
          internal: new Set([
            'packages/pkg-1/src/index.ts',
            'packages/pkg-1/src/lib.ts'
          ] as RelativePath[])
        },
        metadata: {
          imports: {
            aliasCounts: {
              'rootverse+pkg-1': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixInternalImport])
              },
              'universe+pkg-1': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixInternalImport])
              }
            },
            dependencyCounts: {
              '@black-flag/core': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixInternalImport])
              }
            }
          }
        }
      } satisfies PackageBuildTargets);
    });

    it('returns result from internal cache if available unless useCached is false (new result is always added to internal cache)', () => {
      expect.hasAssertions();

      const dummyMetadata = dummyToProjectMetadata('goodPolyrepo');
      const packageBuildTargets = gatherPackageBuildTargets.sync(
        dummyMetadata.rootPackage,
        { allowMultiversalImports: true, useCached: false }
      );

      expect(packageBuildTargets).toBe(
        gatherPackageBuildTargets.sync(dummyMetadata.rootPackage, {
          allowMultiversalImports: true,
          useCached: true
        })
      );

      const updatedPackageBuildTargets = gatherPackageBuildTargets.sync(
        dummyMetadata.rootPackage,
        { allowMultiversalImports: true, useCached: false }
      );

      expect(updatedPackageBuildTargets).not.toBe(packageBuildTargets);

      expect(
        gatherPackageBuildTargets.sync(dummyMetadata.rootPackage, {
          allowMultiversalImports: true,
          useCached: true
        })
      ).toBe(updatedPackageBuildTargets);
    });

    it('uses entire call signature when constructing internal cache key', () => {
      expect.hasAssertions();

      const { rootPackage } = dummyToProjectMetadata('goodHybridrepo');
      const result1 = gatherPackageBuildTargets.sync(rootPackage, {
        allowMultiversalImports: true,
        useCached: true
      });
      const result2 = gatherPackageBuildTargets.sync(rootPackage, {
        allowMultiversalImports: true,
        excludeInternalsPatterns: ['/fake/exclude'],
        useCached: true
      });

      expect(result1).not.toBe(result2);
    });

    it('returns same results regardless of explicitly empty includes/excludes', () => {
      expect.hasAssertions();

      const { rootPackage } = dummyToProjectMetadata('goodHybridrepoMultiversal');

      expect(
        gatherPackageBuildTargets.sync(rootPackage, {
          allowMultiversalImports: true,
          excludeInternalsPatterns: [],
          includeExternalsPatterns: [],
          useCached: true
        })
      ).toStrictEqual(
        gatherPackageBuildTargets.sync(rootPackage, {
          allowMultiversalImports: true,
          useCached: true
        })
      );
    });

    it('respects includeExternalsPatterns relative to project root', () => {
      expect.hasAssertions();

      const { subRootPackages = toss(new Error('assertion failed')) } =
        dummyToProjectMetadata('goodHybridrepoMultiversal');

      expect(
        gatherPackageBuildTargets.sync(
          subRootPackages.get('@namespaced/webpack-common-config')!,
          {
            allowMultiversalImports: true,
            includeExternalsPatterns: ['packages/private/src/index.ts'],
            useCached: true
          }
        )
      ).toStrictEqual({
        targets: {
          external: {
            normal: new Set([
              'packages/private/src/index.ts',
              'packages/private/src/lib/library2.ts',
              'packages/private/package.json'
            ] as RelativePath[]),
            typeOnly: new Set([] as RelativePath[])
          },
          internal: new Set([
            'packages/webpack/src/webpack-lib.ts',
            'packages/webpack/src/webpack-lib2.ts'
          ] as RelativePath[])
        },
        metadata: {
          imports: {
            aliasCounts: {
              'rootverse+private': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixExternalImport])
              },
              'universe+private': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixExternalImport])
              }
            },
            dependencyCounts: {
              'some-package': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixExternalImport])
              },
              webpack: {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixInternalImport])
              },
              'webpack~2': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixInternalImport])
              }
            }
          }
        }
      } satisfies PackageBuildTargets);

      expect(
        gatherPackageBuildTargets.sync(
          subRootPackages.get('@namespaced/webpack-common-config')!,
          {
            allowMultiversalImports: true,
            includeExternalsPatterns: ['**/private/*/index.ts'],
            useCached: true
          }
        )
      ).toStrictEqual({
        targets: {
          external: {
            normal: new Set([
              'packages/private/src/index.ts',
              'packages/private/src/lib/library2.ts',
              'packages/private/package.json'
            ] as RelativePath[]),
            typeOnly: new Set([] as RelativePath[])
          },
          internal: new Set([
            'packages/webpack/src/webpack-lib.ts',
            'packages/webpack/src/webpack-lib2.ts'
          ] as RelativePath[])
        },
        metadata: {
          imports: {
            aliasCounts: {
              'rootverse+private': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixExternalImport])
              },
              'universe+private': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixExternalImport])
              }
            },
            dependencyCounts: {
              'some-package': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixExternalImport])
              },
              webpack: {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixInternalImport])
              },
              'webpack~2': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixInternalImport])
              }
            }
          }
        }
      } satisfies PackageBuildTargets);
    });

    it('respects excludeInternalsPatterns relative to project root', () => {
      expect.hasAssertions();

      const { subRootPackages = toss(new Error('assertion failed')) } =
        dummyToProjectMetadata('goodHybridrepoMultiversal');

      expect(
        gatherPackageBuildTargets.sync(
          subRootPackages.get('@namespaced/webpack-common-config')!,
          {
            allowMultiversalImports: true,
            excludeInternalsPatterns: [
              'packages/webpack/src/webpack-lib.ts',
              'src/webpack-lib2.ts'
            ],
            useCached: true
          }
        )
      ).toStrictEqual({
        targets: {
          external: {
            normal: new Set([] as RelativePath[]),
            typeOnly: new Set([] as RelativePath[])
          },
          internal: new Set(['packages/webpack/src/webpack-lib2.ts'] as RelativePath[])
        },
        metadata: {
          imports: {
            aliasCounts: {},
            dependencyCounts: {
              'webpack~2': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixInternalImport])
              }
            }
          }
        }
      } satisfies PackageBuildTargets);
    });

    it('return an empty result if there is nothing to return', () => {
      expect.hasAssertions();

      const { subRootPackages = toss(new Error('assertion failed')) } =
        dummyToProjectMetadata('goodHybridrepoMultiversal');

      expect(
        gatherPackageBuildTargets.sync(
          subRootPackages.get('@namespaced/webpack-common-config')!,
          {
            allowMultiversalImports: true,
            excludeInternalsPatterns: ['webpack-lib*'],
            useCached: true
          }
        )
      ).toStrictEqual({
        metadata: { imports: { aliasCounts: {}, dependencyCounts: {} } },
        targets: {
          external: { normal: new Set(), typeOnly: new Set([] as RelativePath[]) },
          internal: new Set()
        }
      });
    });

    it('respects excludeInternalsPatterns + includeExternalsPatterns', () => {
      expect.hasAssertions();

      const { subRootPackages = toss(new Error('assertion failed')) } =
        dummyToProjectMetadata('goodHybridrepoMultiversal');

      expect(
        gatherPackageBuildTargets.sync(
          subRootPackages.get('@namespaced/webpack-common-config')!,
          {
            allowMultiversalImports: true,
            excludeInternalsPatterns: ['packages/webpack/src/webpack-lib2.ts'],
            includeExternalsPatterns: ['packages/webpack/src/webpack-lib2.ts'],
            useCached: true
          }
        )
      ).toStrictEqual({
        targets: {
          external: {
            normal: new Set(['packages/webpack/src/webpack-lib2.ts'] as RelativePath[]),
            typeOnly: new Set([] as RelativePath[])
          },
          internal: new Set(['packages/webpack/src/webpack-lib.ts'] as RelativePath[])
        },
        metadata: {
          imports: {
            aliasCounts: {},
            dependencyCounts: {
              webpack: {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixInternalImport])
              },
              'webpack~2': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixExternalImport])
              }
            }
          }
        }
      } satisfies PackageBuildTargets);
    });

    it('prefixes but does not perform well-formedness checks on specifiers from assets', () => {
      expect.hasAssertions();

      const { subRootPackages = toss(new Error('assertion failed')) } =
        dummyToProjectMetadata('goodHybridrepoMultiversal');

      expect(
        gatherPackageBuildTargets.sync(
          subRootPackages.get('@namespaced/webpack-common-config')!,
          {
            allowMultiversalImports: true,
            includeExternalsPatterns: ['packages/webpack/webpack.config.mjs'],
            useCached: true
          }
        )
      ).toStrictEqual({
        targets: {
          external: {
            normal: new Set(['packages/webpack/webpack.config.mjs'] as RelativePath[]),
            typeOnly: new Set([] as RelativePath[])
          },
          internal: new Set([
            'packages/webpack/src/webpack-lib.ts',
            'packages/webpack/src/webpack-lib2.ts'
          ] as RelativePath[])
        },
        metadata: {
          imports: {
            aliasCounts: {},
            dependencyCounts: {
              '../webpack/src/webpack-lib2.js': {
                count: 1,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixExternalImport,
                  prefixAssetImport
                ])
              },
              './package.json': {
                count: 1,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixExternalImport,
                  prefixAssetImport
                ])
              },
              './package2.json': {
                count: 1,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixExternalImport,
                  prefixAssetImport
                ])
              },
              '@some/namespaced': {
                count: 1,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixExternalImport,
                  prefixAssetImport
                ])
              },
              webpack: {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixInternalImport])
              },
              'webpack~2': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixInternalImport])
              },
              'webpack~3': {
                count: 1,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixExternalImport,
                  prefixAssetImport
                ])
              }
            }
          }
        }
      } satisfies PackageBuildTargets);
    });

    it('catches suboptimal multiverse imports deep in import tree', () => {
      expect.hasAssertions();

      expect(() =>
        gatherPackageBuildTargets.sync(
          dummyToProjectMetadata('badHybridrepoBadSpecifiers').rootPackage,
          { allowMultiversalImports: true, useCached: true }
        )
      ).toThrow(
        GraphErrorMessage.SpecifierNotOkSelfReferential('multiverse+pkg-1:lib.ts')
      );
    });
  });

  describe('<asynchronous>', () => {
    it('returns expected build targets for polyrepo root package', async () => {
      expect.hasAssertions();

      await expect(
        gatherPackageBuildTargets(dummyToProjectMetadata('goodPolyrepo').rootPackage, {
          allowMultiversalImports: true,
          useCached: true
        })
      ).resolves.toStrictEqual({
        targets: {
          external: {
            normal: new Set(['types/global.ts'] as RelativePath[]),
            typeOnly: new Set([] as RelativePath[])
          },
          internal: new Set([
            'src/1.ts',
            'src/2.mts',
            'src/3.cts',
            'src/4.tsx',
            'src/index.js',
            'src/package.json'
          ] as RelativePath[])
        },
        metadata: {
          imports: {
            aliasCounts: {
              typeverse: {
                count: 2,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixInternalImport,
                  prefixTypeOnlyImport
                ])
              },
              universe: {
                count: 4,
                prefixes: new Set([prefixNormalImport, prefixInternalImport])
              }
            },
            dependencyCounts: {}
          }
        }
      } satisfies PackageBuildTargets);
    });

    it('returns expected build targets for multiversal hybridrepo root package', async () => {
      expect.hasAssertions();

      await expect(
        gatherPackageBuildTargets(
          dummyToProjectMetadata('goodHybridrepoMultiversal').rootPackage,
          { allowMultiversalImports: true, useCached: true }
        )
      ).resolves.toStrictEqual({
        targets: {
          external: {
            normal: new Set([
              'packages/cli/src/index.ts',
              'packages/private/src/index.ts',
              'packages/private/package.json',
              'packages/webpack/webpack.config.ts',
              'packages/private/src/lib/library.ts',
              'packages/webpack/src/webpack-lib.ts',
              'packages/webpack/package.json',
              'packages/private/src/lib/library2.ts',
              'packages/webpack/src/webpack-lib2.ts'
            ] as RelativePath[]),
            typeOnly: new Set([
              'src/index.ts',
              'src/others.ts',
              'types/global.ts',
              'types/others.ts'
            ] as RelativePath[])
          },
          internal: new Set(['src/index.ts', 'src/others.ts'] as RelativePath[])
        },
        metadata: {
          imports: {
            aliasCounts: {
              'multiverse+cli': {
                count: 2,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixInternalImport,
                  prefixTypeOnlyImport
                ])
              },
              'multiverse+private': {
                count: 6,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixInternalImport,
                  prefixExternalImport,
                  prefixTypeOnlyImport
                ])
              },
              'multiverse+webpack': {
                count: 2,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixExternalImport,
                  prefixTypeOnlyImport
                ])
              },
              'rootverse+private': {
                count: 4,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixInternalImport,
                  prefixExternalImport,
                  prefixTypeOnlyImport
                ])
              },
              'rootverse+webpack': {
                count: 6,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixInternalImport,
                  prefixExternalImport,
                  prefixTypeOnlyImport
                ])
              },
              typeverse: {
                count: 3,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixTypeOnlyImport,
                  prefixExternalImport
                ])
              },
              universe: {
                count: 4,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixInternalImport,
                  prefixTypeOnlyImport
                ])
              },
              'universe+private': {
                count: 2,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixExternalImport,
                  prefixTypeOnlyImport
                ])
              },
              'universe+webpack': {
                count: 2,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixExternalImport,
                  prefixTypeOnlyImport
                ])
              }
            },
            dependencyCounts: {
              '@babel/core': {
                count: 2,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixInternalImport,
                  prefixTypeOnlyImport
                ])
              },
              '@black-flag/core': {
                count: 2,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixExternalImport,
                  prefixTypeOnlyImport
                ])
              },
              'another-package': {
                count: 2,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixExternalImport,
                  prefixTypeOnlyImport
                ])
              },
              'node:path': {
                count: 2,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixInternalImport,
                  prefixTypeOnlyImport
                ])
              },
              'some-package': {
                count: 2,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixExternalImport,
                  prefixTypeOnlyImport
                ])
              },
              'type-fest': {
                count: 2,
                prefixes: new Set([prefixTypeOnlyImport, prefixExternalImport])
              },
              webpack: {
                count: 2,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixExternalImport,
                  prefixTypeOnlyImport
                ])
              },
              'webpack~2': {
                count: 2,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixExternalImport,
                  prefixTypeOnlyImport
                ])
              }
            }
          }
        }
      } satisfies PackageBuildTargets);
    });

    it('returns expected build targets for multiversal hybridrepo sub-root package', async () => {
      expect.hasAssertions();

      await expect(
        gatherPackageBuildTargets(
          dummyToProjectMetadata('goodHybridrepoMultiversal').subRootPackages!.get(
            'cli'
          )!,
          { allowMultiversalImports: true, useCached: true }
        )
      ).resolves.toStrictEqual({
        targets: {
          external: {
            normal: new Set([
              'packages/private/src/index.ts',
              'packages/private/src/lib/library.ts',
              'packages/webpack/src/webpack-lib.ts',
              'packages/webpack/package.json',
              'packages/private/src/lib/library2.ts',
              'packages/private/package.json'
            ] as RelativePath[]),
            typeOnly: new Set(['types/global.ts', 'types/others.ts'] as RelativePath[])
          },
          internal: new Set(['packages/cli/src/index.ts'] as RelativePath[])
        },
        metadata: {
          imports: {
            aliasCounts: {
              'multiverse+private': {
                count: 2,
                prefixes: new Set([prefixNormalImport, prefixInternalImport])
              },
              'multiverse+webpack': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixInternalImport])
              },
              'rootverse+private': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixExternalImport])
              },
              'rootverse+webpack': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixInternalImport])
              },
              typeverse: {
                count: 2,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixTypeOnlyImport,
                  prefixExternalImport
                ])
              },
              'universe+private': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixExternalImport])
              }
            },
            dependencyCounts: {
              '@black-flag/core': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixInternalImport])
              },
              'another-package': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixExternalImport])
              },
              'some-package': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixExternalImport])
              },
              'type-fest': {
                count: 2,
                prefixes: new Set([prefixTypeOnlyImport, prefixExternalImport])
              },
              webpack: {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixExternalImport])
              }
            }
          }
        }
      } satisfies PackageBuildTargets);
    });

    it('returns expected build targets for multiversal hybridrepo sub-root "private" package', async () => {
      expect.hasAssertions();

      try {
        repositories.goodHybridrepoMultiversal.namedPackageMapData.push(
          repositories.goodHybridrepoMultiversal.unnamedPackageMapData[0]!
        );

        await expect(
          gatherPackageBuildTargets(
            dummyToProjectMetadata('goodHybridrepoMultiversal').subRootPackages!.get(
              'private'
            )!,
            { allowMultiversalImports: true, useCached: true }
          )
        ).resolves.toStrictEqual({
          targets: {
            external: {
              normal: new Set(['packages/private/package.json'] as RelativePath[]),
              typeOnly: new Set(['types/global.ts', 'types/others.ts'] as RelativePath[])
            },
            internal: new Set([
              'packages/private/src/index.ts',
              'packages/private/src/lib/library.ts',
              'packages/private/src/lib/library2.ts',
              'packages/private/src/markdown/1.md',
              'packages/private/src/markdown/2.md',
              'packages/private/src/markdown/3.md'
            ] as RelativePath[])
          },
          metadata: {
            imports: {
              aliasCounts: {
                'rootverse+private': {
                  count: 1,
                  prefixes: new Set([prefixNormalImport, prefixInternalImport])
                },
                typeverse: {
                  count: 2,
                  prefixes: new Set([
                    prefixTypeOnlyImport,
                    prefixNormalImport,
                    prefixInternalImport,
                    prefixExternalImport
                  ])
                },
                'universe+private': {
                  count: 1,
                  prefixes: new Set([prefixNormalImport, prefixInternalImport])
                }
              },
              dependencyCounts: {
                'another-package': {
                  count: 1,
                  prefixes: new Set([prefixNormalImport, prefixInternalImport])
                },
                'some-package': {
                  count: 1,
                  prefixes: new Set([prefixNormalImport, prefixInternalImport])
                },
                'type-fest': {
                  count: 2,
                  prefixes: new Set([prefixTypeOnlyImport, prefixExternalImport])
                }
              }
            }
          }
        } satisfies PackageBuildTargets);
      } finally {
        repositories.goodHybridrepoMultiversal.namedPackageMapData.pop();
      }
    });

    it('returns expected build targets for multiversal hybridrepo sub-root "package-one" package (where package name differs from its id)', async () => {
      expect.hasAssertions();

      await expect(
        gatherPackageBuildTargets(
          dummyToProjectMetadata('goodHybridrepoSelfRef').subRootPackages!.get(
            'package-one'
          )!,
          { allowMultiversalImports: true, useCached: true }
        )
      ).resolves.toStrictEqual({
        targets: {
          external: {
            normal: new Set(['packages/pkg-1/package.json'] as RelativePath[]),
            typeOnly: new Set([] as RelativePath[])
          },
          internal: new Set([
            'packages/pkg-1/src/index.ts',
            'packages/pkg-1/src/lib.ts'
          ] as RelativePath[])
        },
        metadata: {
          imports: {
            aliasCounts: {
              'rootverse+pkg-1': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixInternalImport])
              },
              'universe+pkg-1': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixInternalImport])
              }
            },
            dependencyCounts: {
              '@black-flag/core': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixInternalImport])
              }
            }
          }
        }
      } satisfies PackageBuildTargets);
    });

    it('returns result from internal cache if available unless useCached is false (new result is always added to internal cache)', async () => {
      expect.hasAssertions();

      const dummyMetadata = dummyToProjectMetadata('goodPolyrepo');
      const packageBuildTargets = await gatherPackageBuildTargets(
        dummyMetadata.rootPackage,
        { allowMultiversalImports: true, useCached: false }
      );

      expect(packageBuildTargets).toBe(
        await gatherPackageBuildTargets(dummyMetadata.rootPackage, {
          allowMultiversalImports: true,
          useCached: true
        })
      );

      const updatedPackageBuildTargets = await gatherPackageBuildTargets(
        dummyMetadata.rootPackage,
        { allowMultiversalImports: true, useCached: false }
      );

      expect(updatedPackageBuildTargets).not.toBe(packageBuildTargets);

      await expect(
        gatherPackageBuildTargets(dummyMetadata.rootPackage, {
          allowMultiversalImports: true,
          useCached: true
        })
      ).resolves.toBe(updatedPackageBuildTargets);
    });

    it('uses entire call signature when constructing internal cache key', async () => {
      expect.hasAssertions();

      const { rootPackage } = dummyToProjectMetadata('goodHybridrepo');
      const result1 = await gatherPackageBuildTargets(rootPackage, {
        allowMultiversalImports: true,
        useCached: true
      });
      const result2 = await gatherPackageBuildTargets(rootPackage, {
        allowMultiversalImports: true,
        excludeInternalsPatterns: ['/fake/exclude'],
        useCached: true
      });

      expect(result1).not.toBe(result2);
    });

    it('returns same results regardless of explicitly empty includes/excludes', async () => {
      expect.hasAssertions();

      const { rootPackage } = dummyToProjectMetadata('goodHybridrepoMultiversal');

      await expect(
        gatherPackageBuildTargets(rootPackage, {
          allowMultiversalImports: true,
          excludeInternalsPatterns: [],
          includeExternalsPatterns: [],
          useCached: true
        })
      ).resolves.toStrictEqual(
        await gatherPackageBuildTargets(rootPackage, {
          allowMultiversalImports: true,
          useCached: true
        })
      );
    });

    it('respects includeExternalsPatterns relative to project root', async () => {
      expect.hasAssertions();

      const { subRootPackages = toss(new Error('assertion failed')) } =
        dummyToProjectMetadata('goodHybridrepoMultiversal');

      await expect(
        gatherPackageBuildTargets(
          subRootPackages.get('@namespaced/webpack-common-config')!,
          {
            allowMultiversalImports: true,
            includeExternalsPatterns: ['packages/private/src/index.ts'],
            useCached: true
          }
        )
      ).resolves.toStrictEqual({
        targets: {
          external: {
            normal: new Set([
              'packages/private/src/index.ts',
              'packages/private/src/lib/library2.ts',
              'packages/private/package.json'
            ] as RelativePath[]),
            typeOnly: new Set([] as RelativePath[])
          },
          internal: new Set([
            'packages/webpack/src/webpack-lib.ts',
            'packages/webpack/src/webpack-lib2.ts'
          ] as RelativePath[])
        },
        metadata: {
          imports: {
            aliasCounts: {
              'rootverse+private': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixExternalImport])
              },
              'universe+private': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixExternalImport])
              }
            },
            dependencyCounts: {
              'some-package': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixExternalImport])
              },
              webpack: {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixInternalImport])
              },
              'webpack~2': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixInternalImport])
              }
            }
          }
        }
      } satisfies PackageBuildTargets);

      await expect(
        gatherPackageBuildTargets(
          subRootPackages.get('@namespaced/webpack-common-config')!,
          {
            allowMultiversalImports: true,
            includeExternalsPatterns: ['**/private/*/index.ts'],
            useCached: true
          }
        )
      ).resolves.toStrictEqual({
        targets: {
          external: {
            normal: new Set([
              'packages/private/src/index.ts',
              'packages/private/src/lib/library2.ts',
              'packages/private/package.json'
            ] as RelativePath[]),
            typeOnly: new Set([] as RelativePath[])
          },
          internal: new Set([
            'packages/webpack/src/webpack-lib.ts',
            'packages/webpack/src/webpack-lib2.ts'
          ] as RelativePath[])
        },
        metadata: {
          imports: {
            aliasCounts: {
              'rootverse+private': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixExternalImport])
              },
              'universe+private': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixExternalImport])
              }
            },
            dependencyCounts: {
              'some-package': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixExternalImport])
              },
              webpack: {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixInternalImport])
              },
              'webpack~2': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixInternalImport])
              }
            }
          }
        }
      } satisfies PackageBuildTargets);
    });

    it('respects excludeInternalsPatterns relative to project root', async () => {
      expect.hasAssertions();

      const { subRootPackages = toss(new Error('assertion failed')) } =
        dummyToProjectMetadata('goodHybridrepoMultiversal');

      await expect(
        gatherPackageBuildTargets(
          subRootPackages.get('@namespaced/webpack-common-config')!,
          {
            allowMultiversalImports: true,
            excludeInternalsPatterns: [
              'packages/webpack/src/webpack-lib.ts',
              'src/webpack-lib2.ts'
            ],
            useCached: true
          }
        )
      ).resolves.toStrictEqual({
        targets: {
          external: {
            normal: new Set([] as RelativePath[]),
            typeOnly: new Set([] as RelativePath[])
          },
          internal: new Set(['packages/webpack/src/webpack-lib2.ts'] as RelativePath[])
        },
        metadata: {
          imports: {
            aliasCounts: {},
            dependencyCounts: {
              'webpack~2': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixInternalImport])
              }
            }
          }
        }
      } satisfies PackageBuildTargets);
    });

    it('return an empty result if there is nothing to return', async () => {
      expect.hasAssertions();

      const { subRootPackages = toss(new Error('assertion failed')) } =
        dummyToProjectMetadata('goodHybridrepoMultiversal');

      await expect(
        gatherPackageBuildTargets(
          subRootPackages.get('@namespaced/webpack-common-config')!,
          {
            allowMultiversalImports: true,
            excludeInternalsPatterns: ['webpack-lib*'],
            useCached: true
          }
        )
      ).resolves.toStrictEqual({
        metadata: { imports: { aliasCounts: {}, dependencyCounts: {} } },
        targets: {
          external: { normal: new Set(), typeOnly: new Set([] as RelativePath[]) },
          internal: new Set()
        }
      });
    });

    it('respects excludeInternalsPatterns + includeExternalsPatterns', async () => {
      expect.hasAssertions();

      const { subRootPackages = toss(new Error('assertion failed')) } =
        dummyToProjectMetadata('goodHybridrepoMultiversal');

      await expect(
        gatherPackageBuildTargets(
          subRootPackages.get('@namespaced/webpack-common-config')!,
          {
            allowMultiversalImports: true,
            excludeInternalsPatterns: ['packages/webpack/src/webpack-lib2.ts'],
            includeExternalsPatterns: ['packages/webpack/src/webpack-lib2.ts'],
            useCached: true
          }
        )
      ).resolves.toStrictEqual({
        targets: {
          external: {
            normal: new Set(['packages/webpack/src/webpack-lib2.ts'] as RelativePath[]),
            typeOnly: new Set([] as RelativePath[])
          },
          internal: new Set(['packages/webpack/src/webpack-lib.ts'] as RelativePath[])
        },
        metadata: {
          imports: {
            aliasCounts: {},
            dependencyCounts: {
              webpack: {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixInternalImport])
              },
              'webpack~2': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixExternalImport])
              }
            }
          }
        }
      } satisfies PackageBuildTargets);
    });

    it('prefixes but does not perform well-formedness checks on specifiers from assets', async () => {
      expect.hasAssertions();

      const { subRootPackages = toss(new Error('assertion failed')) } =
        dummyToProjectMetadata('goodHybridrepoMultiversal');

      await expect(
        gatherPackageBuildTargets(
          subRootPackages.get('@namespaced/webpack-common-config')!,
          {
            allowMultiversalImports: true,
            includeExternalsPatterns: ['packages/webpack/webpack.config.mjs'],
            useCached: true
          }
        )
      ).resolves.toStrictEqual({
        targets: {
          external: {
            normal: new Set(['packages/webpack/webpack.config.mjs'] as RelativePath[]),
            typeOnly: new Set([] as RelativePath[])
          },
          internal: new Set([
            'packages/webpack/src/webpack-lib.ts',
            'packages/webpack/src/webpack-lib2.ts'
          ] as RelativePath[])
        },
        metadata: {
          imports: {
            aliasCounts: {},
            dependencyCounts: {
              '../webpack/src/webpack-lib2.js': {
                count: 1,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixExternalImport,
                  prefixAssetImport
                ])
              },
              './package.json': {
                count: 1,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixExternalImport,
                  prefixAssetImport
                ])
              },
              './package2.json': {
                count: 1,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixExternalImport,
                  prefixAssetImport
                ])
              },
              '@some/namespaced': {
                count: 1,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixExternalImport,
                  prefixAssetImport
                ])
              },
              webpack: {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixInternalImport])
              },
              'webpack~2': {
                count: 1,
                prefixes: new Set([prefixNormalImport, prefixInternalImport])
              },
              'webpack~3': {
                count: 1,
                prefixes: new Set([
                  prefixNormalImport,
                  prefixExternalImport,
                  prefixAssetImport
                ])
              }
            }
          }
        }
      } satisfies PackageBuildTargets);
    });

    it('catches suboptimal multiverse imports deep in import tree', async () => {
      expect.hasAssertions();

      await expect(
        gatherPackageBuildTargets(
          dummyToProjectMetadata('badHybridrepoBadSpecifiers').rootPackage,
          { allowMultiversalImports: true, useCached: true }
        )
      ).rejects.toThrow(
        GraphErrorMessage.SpecifierNotOkSelfReferential('multiverse+pkg-1:lib.ts')
      );
    });
  });
});

describe('::analyzeProjectStructure', () => {
  describe('<synchronous>', () => {
    it('accepts workspaces.packages array in package.json', () => {
      expect.hasAssertions();

      expect(
        analyzeProjectStructure.sync({
          cwd: repositories.goodMonorepoWeirdYarn.root,
          useCached: true,
          allowUnnamedPackages: true
        })
      ).toBeDefined();
    });

    it('returns expected metadata when cwd is polyrepo project root', () => {
      expect.hasAssertions();

      const result = analyzeProjectStructure.sync({
        cwd: repositories.goodPolyrepo.root,
        useCached: true,
        allowUnnamedPackages: true
      });

      expect(result.cwdPackage).toBe(result.rootPackage);
      expect(result.subRootPackages).toBeUndefined();
      expect(result.type).toStrictEqual(ProjectAttribute.Polyrepo);

      expect(result.rootPackage.attributes).toStrictEqual(
        repositories.goodPolyrepo.attributes
      );

      expect(result.rootPackage.json).toStrictEqual(repositories.goodPolyrepo.json);
      expect(result.rootPackage.root).toBe(repositories.goodPolyrepo.root);
      expect(result.rootPackage.projectMetadata).toBe(result);
    });

    it('returns expected metadata when cwd is monorepo project root', () => {
      expect.hasAssertions();

      const result = analyzeProjectStructure.sync({
        cwd: repositories.goodMonorepo.root,
        useCached: true,
        allowUnnamedPackages: true
      });

      expect(result.cwdPackage).toBe(result.rootPackage);
      expect(result.subRootPackages).toBeDefined();
      expect(result.type).toStrictEqual(ProjectAttribute.Monorepo);

      expect(result.rootPackage.attributes).toStrictEqual(
        repositories.goodMonorepo.attributes
      );

      expect(result.rootPackage.json).toStrictEqual(repositories.goodMonorepo.json);
      expect(result.rootPackage.root).toBe(repositories.goodMonorepo.root);
      expect(result.rootPackage.projectMetadata).toBe(result);

      checkForExpectedPackages(result.subRootPackages, 'goodMonorepo');
    });

    it('returns expected metadata when cwd is hybridrepo project root', () => {
      expect.hasAssertions();

      const result = analyzeProjectStructure.sync({
        cwd: repositories.goodHybridrepo.root,
        useCached: true,
        allowUnnamedPackages: true
      });

      expect(result.cwdPackage).toBe(result.rootPackage);
      expect(result.subRootPackages).toBeDefined();
      expect(result.type).toStrictEqual(ProjectAttribute.Monorepo);

      expect(result.rootPackage.attributes).toStrictEqual(
        repositories.goodHybridrepo.attributes
      );

      expect(result.rootPackage.json).toStrictEqual(repositories.goodHybridrepo.json);
      expect(result.rootPackage.root).toBe(repositories.goodHybridrepo.root);
      expect(result.rootPackage.projectMetadata).toBe(result);

      checkForExpectedPackages(result.subRootPackages, 'goodHybridrepo');
    });

    it('returns expected project and workspace attributes for various Next.js projects', () => {
      expect.hasAssertions();

      {
        const result = analyzeProjectStructure.sync({
          cwd: repositories.badMonorepoNextjsProject.root,
          useCached: true,
          allowUnnamedPackages: true
        });

        expect(result.rootPackage.attributes).toStrictEqual(
          repositories.badMonorepoNextjsProject.attributes
        );

        checkForExpectedPackages(result.subRootPackages, 'badMonorepoNextjsProject');
      }

      {
        const result = analyzeProjectStructure.sync({
          cwd: repositories.badPolyrepoNextjsProject.root,
          useCached: true,
          allowUnnamedPackages: true
        });

        expect(result.rootPackage.attributes).toStrictEqual(
          repositories.badPolyrepoNextjsProject.attributes
        );

        expect(result.subRootPackages).toBeUndefined();
      }

      {
        const result = analyzeProjectStructure.sync({
          cwd: repositories.goodMonorepoNextjsProject.root,
          useCached: true,
          allowUnnamedPackages: true
        });

        expect(result.rootPackage.attributes).toStrictEqual(
          repositories.goodMonorepoNextjsProject.attributes
        );

        checkForExpectedPackages(result.subRootPackages, 'goodMonorepoNextjsProject');
      }

      {
        const result = analyzeProjectStructure.sync({
          cwd: repositories.goodPolyrepoNextjsProject.root,
          useCached: true,
          allowUnnamedPackages: true
        });

        expect(result.rootPackage.attributes).toStrictEqual(
          repositories.goodPolyrepoNextjsProject.attributes
        );

        expect(result.subRootPackages).toBeUndefined();
      }
    });

    it('returns expected subRootPackages and cwdPackage when cwd is monorepo root with the same name as a sub-root', () => {
      expect.hasAssertions();

      const result = analyzeProjectStructure.sync({
        cwd: repositories.goodMonorepoWeirdSameNames.root,
        useCached: true,
        allowUnnamedPackages: true
      });

      expect(result.cwdPackage).toBe(result.rootPackage);
      checkForExpectedPackages(result.subRootPackages, 'goodMonorepoWeirdSameNames');
    });

    it('returns expected subRootPackages and cwdPackage when cwd is a sub-root', () => {
      expect.hasAssertions();

      const result = analyzeProjectStructure.sync({
        cwd: repositories.goodMonorepo.namedPackageMapData[0]![1].root,
        useCached: true,
        allowUnnamedPackages: true
      });

      expect(result.cwdPackage).toStrictEqual(
        repositories.goodMonorepo.namedPackageMapData[0]![1]
      );

      checkForExpectedPackages(result.subRootPackages, 'goodMonorepo');
    });

    it('returns expected subRootPackages and cwdPackage when cwd is under the project root but not under a sub-root', () => {
      expect.hasAssertions();

      const result = analyzeProjectStructure.sync({
        cwd: `${repositories.goodMonorepo.namedPackageMapData[0]![1].root}/..` as AbsolutePath,
        useCached: true,
        allowUnnamedPackages: true
      });

      expect(result.cwdPackage).toBe(result.rootPackage);
      checkForExpectedPackages(result.subRootPackages, 'goodMonorepo');
    });

    it('returns expected subRootPackages and cwdPackage when cwd is somewhere under a sub-root', () => {
      expect.hasAssertions();

      const result = analyzeProjectStructure.sync({
        cwd: `${repositories.goodMonorepo.namedPackageMapData[0]![1].root}/src` as AbsolutePath,
        useCached: true,
        allowUnnamedPackages: true
      });

      expect(result.cwdPackage).toStrictEqual(
        repositories.goodMonorepo.namedPackageMapData[0]![1]
      );

      checkForExpectedPackages(result.subRootPackages, 'goodMonorepo');
    });

    it('returns expected subRootPackages and cwdPackage with simple workspace cwd', () => {
      expect.hasAssertions();

      const result = analyzeProjectStructure.sync({
        cwd: `${repositories.goodMonorepoSimplePaths.namedPackageMapData[0]![1].root}/src` as AbsolutePath,
        useCached: true,
        allowUnnamedPackages: true
      });

      expect(result.cwdPackage).toStrictEqual(
        repositories.goodMonorepoSimplePaths.namedPackageMapData[0]![1]
      );

      expect(result.rootPackage.attributes).toStrictEqual(
        repositories.goodMonorepoSimplePaths.attributes
      );

      checkForExpectedPackages(result.subRootPackages, 'goodMonorepoSimplePaths');
    });

    it('returns expected subRootPackages and cwdPackage when workspace cwd uses Windows-style path separators', () => {
      expect.hasAssertions();

      const result = analyzeProjectStructure.sync({
        cwd: repositories.goodMonorepoWindows.namedPackageMapData[0]![1].root,
        useCached: true,
        allowUnnamedPackages: true
      });

      expect(result.cwdPackage).toStrictEqual(
        repositories.goodMonorepoWindows.namedPackageMapData[0]![1]
      );

      checkForExpectedPackages(result.subRootPackages, 'goodMonorepoWindows');
    });

    it('returns expected subRootPackages and cwdPackage when cwd is under the project root but not under a sub-root in a monorepo with weird absolute paths', () => {
      expect.hasAssertions();

      const result = analyzeProjectStructure.sync({
        cwd: `${repositories.goodMonorepoWeirdAbsolute.namedPackageMapData[0]![1].root}/..` as AbsolutePath,
        useCached: true,
        allowUnnamedPackages: true
      });

      expect(result.cwdPackage).toBe(result.rootPackage);
      checkForExpectedPackages(result.subRootPackages, 'goodMonorepoWeirdAbsolute');
    });

    it('sets multiversal attribute in multiversal hybridrepo', () => {
      expect.hasAssertions();

      const result = analyzeProjectStructure.sync({
        cwd: repositories.goodHybridrepoMultiversal.root,
        useCached: true,
        allowUnnamedPackages: true
      });

      expect(result.rootPackage.attributes).toStrictEqual(
        repositories.goodHybridrepoMultiversal.attributes
      );
    });

    it('normalizes workspace cwd to ignore non-directories', () => {
      expect.hasAssertions();

      const result = analyzeProjectStructure.sync({
        cwd: repositories.goodMonorepoWeirdBoneless.root,
        useCached: true,
        allowUnnamedPackages: true
      });

      expect(result.cwdPackage).toBe(result.rootPackage);
      checkForExpectedPackages(result.subRootPackages, 'goodMonorepoWeirdBoneless');
    });

    it('does not return duplicates when dealing with overlapping workspace glob paths, some negated', () => {
      expect.hasAssertions();

      const result = analyzeProjectStructure.sync({
        cwd: repositories.goodMonorepoWeirdOverlap.root,
        useCached: true,
        allowUnnamedPackages: true
      });

      expect(result.cwdPackage).toBe(result.rootPackage);
      checkForExpectedPackages(result.subRootPackages, 'goodMonorepoWeirdOverlap');
    });

    it('works with nthly-negated workspace paths where order matters', () => {
      expect.hasAssertions();

      const result = analyzeProjectStructure.sync({
        cwd: repositories.goodMonorepoNegatedPaths.root,
        useCached: true,
        allowUnnamedPackages: true
      });

      expect(result.cwdPackage).toBe(result.rootPackage);
      checkForExpectedPackages(result.subRootPackages, 'goodMonorepoNegatedPaths');
    });

    it('classifies matching workspace pseudo-roots (without a package.json) as "broken"', () => {
      expect.hasAssertions();

      const result = analyzeProjectStructure.sync({
        cwd: repositories.badMonorepoNonPackageDir.root,
        useCached: true,
        allowUnnamedPackages: true
      });

      expect(result.cwdPackage).toBe(result.rootPackage);
      checkForExpectedPackages(result.subRootPackages, 'badMonorepoNonPackageDir');
    });

    it('uses process.cwd when given no cwd parameter', () => {
      expect.hasAssertions();
      expect(() =>
        analyzeProjectStructure.sync({ useCached: true, allowUnnamedPackages: true })
      ).toThrow(GraphErrorMessage.NotAGitRepositoryError());
    });

    it('correctly determines repository type', () => {
      expect.hasAssertions();

      expect(
        analyzeProjectStructure.sync({
          cwd: repositories.goodMonorepo.root,
          useCached: true,
          allowUnnamedPackages: true
        }).type
      ).toBe(ProjectAttribute.Monorepo);

      expect(
        analyzeProjectStructure.sync({
          cwd: repositories.goodPolyrepo.root,
          useCached: true,
          allowUnnamedPackages: true
        }).type
      ).toBe(ProjectAttribute.Polyrepo);
    });

    it('returns correct rootPackage regardless of cwd', () => {
      expect.hasAssertions();

      const goodMonorepoRoot = toPath(
        repositories.goodMonorepo.root,
        packageJsonConfigPackageBase
      );

      const goodPolyrepoRoot = toPath(
        repositories.goodPolyrepo.root,
        packageJsonConfigPackageBase
      );

      const expectedJsonSpec = patchJsonObjectReaders(
        {
          [goodMonorepoRoot]: {
            name: 'good-monorepo-package-json-name',
            private: true,
            workspaces: ['packages/*']
          },
          [goodPolyrepoRoot]: {
            name: 'good-polyrepo-package-json-name'
          }
        },
        { replace: true }
      );

      {
        const { rootPackage } = analyzeProjectStructure.sync({
          cwd: repositories.goodMonorepo.namedPackageMapData[0]![1].root,
          useCached: true,
          allowUnnamedPackages: true
        });

        expect(excludeCircularPropertiesFromPackage(rootPackage)).toStrictEqual({
          root: repositories.goodMonorepo.root,
          json: expectedJsonSpec[goodMonorepoRoot],
          attributes: repositories.goodMonorepo.attributes
        });
      }

      {
        const { rootPackage } = analyzeProjectStructure.sync({
          cwd: `${repositories.goodMonorepo.namedPackageMapData[0]![1].root}/..` as AbsolutePath,
          useCached: true,
          allowUnnamedPackages: true
        });

        expect(excludeCircularPropertiesFromPackage(rootPackage)).toStrictEqual({
          root: repositories.goodMonorepo.root,
          json: expectedJsonSpec[goodMonorepoRoot],
          attributes: repositories.goodMonorepo.attributes
        });
      }

      {
        const { rootPackage } = analyzeProjectStructure.sync({
          cwd: `${repositories.goodMonorepo.namedPackageMapData[0]![1].root}/src` as AbsolutePath,
          useCached: true,
          allowUnnamedPackages: true
        });

        expect(excludeCircularPropertiesFromPackage(rootPackage)).toStrictEqual({
          root: repositories.goodMonorepo.root,
          json: expectedJsonSpec[goodMonorepoRoot],
          attributes: repositories.goodMonorepo.attributes
        });
      }

      {
        const { rootPackage } = analyzeProjectStructure.sync({
          cwd: repositories.goodPolyrepo.root,
          useCached: true,
          allowUnnamedPackages: true
        });

        expect(excludeCircularPropertiesFromPackage(rootPackage)).toStrictEqual({
          root: repositories.goodPolyrepo.root,
          json: expectedJsonSpec[goodPolyrepoRoot],
          attributes: repositories.goodPolyrepo.attributes
        });
      }

      {
        const { rootPackage } = analyzeProjectStructure.sync({
          cwd: `${repositories.goodPolyrepo.root}/src` as AbsolutePath,
          useCached: true,
          allowUnnamedPackages: true
        });

        expect(excludeCircularPropertiesFromPackage(rootPackage)).toStrictEqual({
          root: repositories.goodPolyrepo.root,
          json: expectedJsonSpec[goodPolyrepoRoot],
          attributes: repositories.goodPolyrepo.attributes
        });
      }
    });

    it('populates subRootPackages with correct WorkspacePackage objects in monorepo', () => {
      expect.hasAssertions();

      checkForExpectedPackages(
        analyzeProjectStructure.sync({
          cwd: repositories.goodMonorepo.root,
          useCached: true,
          allowUnnamedPackages: true
        }).subRootPackages,
        'goodMonorepo'
      );
    });

    it('returns undefined subRootPackages when in polyrepo', () => {
      expect.hasAssertions();

      expect(
        analyzeProjectStructure.sync({
          cwd: repositories.goodPolyrepo.root,
          useCached: true,
          allowUnnamedPackages: true
        }).subRootPackages
      ).toBeUndefined();
    });

    it('returns result from internal cache if available unless useCached is false (new result is always added to internal cache)', () => {
      expect.hasAssertions();

      const dummyMetadata = analyzeProjectStructure.sync({
        cwd: repositories.goodPolyrepo.root,
        useCached: false,
        allowUnnamedPackages: true
      });

      expect(dummyMetadata.rootPackage).toBe(
        analyzeProjectStructure.sync({
          cwd: repositories.goodPolyrepo.root,
          useCached: true,
          allowUnnamedPackages: true
        }).rootPackage
      );

      const updatedDummyMetadata = analyzeProjectStructure.sync({
        cwd: repositories.goodPolyrepo.root,
        useCached: false,
        allowUnnamedPackages: true
      });

      expect(updatedDummyMetadata.rootPackage).not.toBe(dummyMetadata.rootPackage);

      expect(
        analyzeProjectStructure.sync({
          cwd: repositories.goodPolyrepo.root,
          useCached: true,
          allowUnnamedPackages: true
        }).rootPackage
      ).toBe(updatedDummyMetadata.rootPackage);
    });

    it('defines cwdPackage properly when returning project metadata from internal cache and cwd changes from monorepo root to a sub-root of the same monorepo', () => {
      expect.hasAssertions();

      expect(
        analyzeProjectStructure.sync({
          cwd: repositories.goodMonorepo.root,
          useCached: true,
          allowUnnamedPackages: true
        }).cwdPackage
      ).toStrictEqual(dummyToProjectMetadata('goodMonorepo').rootPackage);

      expect(
        analyzeProjectStructure.sync({
          cwd: repositories.goodMonorepo.namedPackageMapData[0]![1].root,
          useCached: true,
          allowUnnamedPackages: true
        }).cwdPackage
      ).toStrictEqual(repositories.goodMonorepo.namedPackageMapData[0]![1]);
    });

    it('sets subRootPackages[package.json.name] to strictly equal cwdPackage when expected', () => {
      expect.hasAssertions();

      const result = analyzeProjectStructure.sync({
        cwd: repositories.goodMonorepo.namedPackageMapData[0]![1].root,
        useCached: true,
        allowUnnamedPackages: true
      });

      expect(result.subRootPackages?.get(result.cwdPackage.json.name!)).toBe(
        result.cwdPackage
      );

      expect(!!result.cwdPackage).toBeTrue();
    });

    it('sets subRootPackages.unnamed[package.id] to strictly equal cwdPackage when expected', () => {
      expect.hasAssertions();

      const result = analyzeProjectStructure.sync({
        cwd: repositories.goodMonorepo.unnamedPackageMapData[0]![1].root,
        useCached: true,
        allowUnnamedPackages: true
      });

      expect(
        result.subRootPackages?.unnamed.get((result.cwdPackage as WorkspacePackage).id)
      ).toBe(result.cwdPackage);

      expect(!!result.cwdPackage).toBeTrue();
    });

    it('throws when passed non-existent projectRoot', () => {
      expect.hasAssertions();

      expect(() =>
        analyzeProjectStructure.sync({
          cwd: '/fake/root' as AbsolutePath,
          useCached: true,
          allowUnnamedPackages: true
        })
      ).toThrow(GraphErrorMessage.NotAGitRepositoryError());
    });

    it('throws when failing to find a .git directory', () => {
      expect.hasAssertions();

      expect(() =>
        analyzeProjectStructure.sync({
          cwd: '/does/not/exist' as AbsolutePath,
          useCached: true,
          allowUnnamedPackages: true
        })
      ).toThrow(GraphErrorMessage.NotAGitRepositoryError());
    });

    it('throws when a project has conflicting cli and next attributes', () => {
      expect.hasAssertions();

      expect(() =>
        analyzeProjectStructure.sync({
          cwd: repositories.badPolyrepoConflictingAttributes.root,
          useCached: true,
          allowUnnamedPackages: true
        })
      ).toThrow(GraphErrorMessage.CannotBeCliAndNextJs());
    });

    it('throws when a project has a bad "type" field in package.json', () => {
      expect.hasAssertions();

      expect(() =>
        analyzeProjectStructure.sync({
          cwd: repositories.badPolyrepoBadType.root,
          useCached: true,
          allowUnnamedPackages: true
        })
      ).toThrow(
        GraphErrorMessage.BadProjectTypeInPackageJson(
          toPath(repositories.badPolyrepoBadType.root, 'package.json')
        )
      );
    });

    it('throws when two packages have the same "name" field in package.json', () => {
      expect.hasAssertions();

      expect(() =>
        analyzeProjectStructure.sync({
          cwd: repositories.badMonorepoDuplicateName.root,
          useCached: true,
          allowUnnamedPackages: true
        })
      ).toThrow(GraphErrorMessage.DuplicatePackageName('pkg', '', '').trim());
    });

    it('throws when two unnamed packages resolve to the same package-id', () => {
      expect.hasAssertions();

      expect(() =>
        analyzeProjectStructure.sync({
          cwd: repositories.badMonorepoDuplicateIdUnnamed.root,
          useCached: true,
          allowUnnamedPackages: true
        })
      ).toThrow(
        GraphErrorMessage.DuplicatePackageId(
          'pkg-1',
          `${repositories.badMonorepoDuplicateIdUnnamed.root}/packages-1/pkg-1`,
          `${repositories.badMonorepoDuplicateIdUnnamed.root}/packages-2/pkg-1`
        )
      );
    });

    it('throws when two differently-named packages resolve to the same package-id', () => {
      expect.hasAssertions();

      expect(() =>
        analyzeProjectStructure.sync({
          cwd: repositories.badMonorepoDuplicateIdNamed.root,
          useCached: true,
          allowUnnamedPackages: true
        })
      ).toThrow(
        GraphErrorMessage.DuplicatePackageId(
          'pkg-1',
          `${repositories.badMonorepoDuplicateIdNamed.root}/packages-2/pkg-1`,
          `${repositories.badMonorepoDuplicateIdNamed.root}/packages-1/pkg-1`
        )
      );
    });

    it('throws when allowUnnamedPackages is false (the default) and an unnamed package is the rootPackage/cwdPackage', () => {
      expect.hasAssertions();

      expect(() =>
        analyzeProjectStructure.sync({
          cwd: repositories.badPolyrepoEmptyPackageJson.root,
          useCached: false,
          allowUnnamedPackages: false
        })
      ).toThrow(FsErrorMessage.IsNotXPackageJson());

      expect(() =>
        analyzeProjectStructure.sync({
          cwd: repositories.goodMonorepo.unnamedPackageMapData[1]![1].root,
          useCached: true
          // * allowUnnamedPackages: false should be the default
        })
      ).toThrow(FsErrorMessage.IsNotXPackageJson());
    });

    it('considers all unnamed packages "broken" when allowUnnamedPackages is false (the default)', () => {
      expect.hasAssertions();

      {
        const result = analyzeProjectStructure.sync({
          cwd: repositories.goodMonorepo.root,
          useCached: true,
          allowUnnamedPackages: false
        });

        expect(result.cwdPackage).toBe(result.rootPackage);
        expect(result.subRootPackages).toBeDefined();
        expect(result.type).toStrictEqual(ProjectAttribute.Monorepo);

        expect(result.rootPackage.attributes).toStrictEqual(
          repositories.goodMonorepo.attributes
        );

        expect(result.rootPackage.json).toStrictEqual(repositories.goodMonorepo.json);
        expect(result.rootPackage.root).toBe(repositories.goodMonorepo.root);
        expect(result.rootPackage.projectMetadata).toBe(result);

        checkForExpectedPackages(result.subRootPackages, 'goodMonorepo', {
          unnamedConsideredBroken: true
        });
      }

      {
        const result = analyzeProjectStructure.sync({
          cwd: repositories.goodMonorepo.root,
          useCached: false
        });

        expect(result.cwdPackage).toBe(result.rootPackage);
        expect(result.subRootPackages).toBeDefined();
        expect(result.type).toStrictEqual(ProjectAttribute.Monorepo);

        expect(result.rootPackage.attributes).toStrictEqual(
          repositories.goodMonorepo.attributes
        );

        expect(result.rootPackage.json).toStrictEqual(repositories.goodMonorepo.json);
        expect(result.rootPackage.root).toBe(repositories.goodMonorepo.root);
        expect(result.rootPackage.projectMetadata).toBe(result);

        checkForExpectedPackages(result.subRootPackages, 'goodMonorepo', {
          unnamedConsideredBroken: true
        });
      }
    });
  });

  describe('<asynchronous>', () => {
    it('accepts workspaces.packages array in package.json', async () => {
      expect.hasAssertions();

      await expect(
        analyzeProjectStructure({
          cwd: repositories.goodMonorepoWeirdYarn.root,
          useCached: true,
          allowUnnamedPackages: true
        })
      ).resolves.toBeDefined();
    });

    it('returns expected metadata when cwd is polyrepo project root', async () => {
      expect.hasAssertions();

      const result = await analyzeProjectStructure({
        cwd: repositories.goodPolyrepo.root,
        useCached: true,
        allowUnnamedPackages: true
      });

      expect(result.cwdPackage).toBe(result.rootPackage);
      expect(result.subRootPackages).toBeUndefined();
      expect(result.type).toStrictEqual(ProjectAttribute.Polyrepo);

      expect(result.rootPackage.attributes).toStrictEqual(
        repositories.goodPolyrepo.attributes
      );

      expect(result.rootPackage.json).toStrictEqual(repositories.goodPolyrepo.json);
      expect(result.rootPackage.root).toBe(repositories.goodPolyrepo.root);
      expect(result.rootPackage.projectMetadata).toBe(result);
    });

    it('returns expected metadata when cwd is monorepo project root', async () => {
      expect.hasAssertions();

      const result = await analyzeProjectStructure({
        cwd: repositories.goodMonorepo.root,
        useCached: true,
        allowUnnamedPackages: true
      });

      expect(result.cwdPackage).toBe(result.rootPackage);
      expect(result.subRootPackages).toBeDefined();
      expect(result.type).toStrictEqual(ProjectAttribute.Monorepo);

      expect(result.rootPackage.attributes).toStrictEqual(
        repositories.goodMonorepo.attributes
      );

      expect(result.rootPackage.json).toStrictEqual(repositories.goodMonorepo.json);
      expect(result.rootPackage.root).toBe(repositories.goodMonorepo.root);
      expect(result.rootPackage.projectMetadata).toBe(result);

      checkForExpectedPackages(result.subRootPackages, 'goodMonorepo');
    });

    it('returns expected metadata when cwd is hybridrepo project root', async () => {
      expect.hasAssertions();

      const result = await analyzeProjectStructure({
        cwd: repositories.goodHybridrepo.root,
        useCached: true,
        allowUnnamedPackages: true
      });

      expect(result.cwdPackage).toBe(result.rootPackage);
      expect(result.subRootPackages).toBeDefined();
      expect(result.type).toStrictEqual(ProjectAttribute.Monorepo);

      expect(result.rootPackage.attributes).toStrictEqual(
        repositories.goodHybridrepo.attributes
      );

      expect(result.rootPackage.json).toStrictEqual(repositories.goodHybridrepo.json);
      expect(result.rootPackage.root).toBe(repositories.goodHybridrepo.root);
      expect(result.rootPackage.projectMetadata).toBe(result);

      checkForExpectedPackages(result.subRootPackages, 'goodHybridrepo');
    });

    it('returns expected project and workspace attributes for various Next.js projects', async () => {
      expect.hasAssertions();

      {
        const result = await analyzeProjectStructure({
          cwd: repositories.badMonorepoNextjsProject.root,
          useCached: true,
          allowUnnamedPackages: true
        });

        expect(result.rootPackage.attributes).toStrictEqual(
          repositories.badMonorepoNextjsProject.attributes
        );

        checkForExpectedPackages(result.subRootPackages, 'badMonorepoNextjsProject');
      }

      {
        const result = await analyzeProjectStructure({
          cwd: repositories.badPolyrepoNextjsProject.root,
          useCached: true,
          allowUnnamedPackages: true
        });

        expect(result.rootPackage.attributes).toStrictEqual(
          repositories.badPolyrepoNextjsProject.attributes
        );

        expect(result.subRootPackages).toBeUndefined();
      }

      {
        const result = await analyzeProjectStructure({
          cwd: repositories.goodMonorepoNextjsProject.root,
          useCached: true,
          allowUnnamedPackages: true
        });

        expect(result.rootPackage.attributes).toStrictEqual(
          repositories.goodMonorepoNextjsProject.attributes
        );

        checkForExpectedPackages(result.subRootPackages, 'goodMonorepoNextjsProject');
      }

      {
        const result = await analyzeProjectStructure({
          cwd: repositories.goodPolyrepoNextjsProject.root,
          useCached: true,
          allowUnnamedPackages: true
        });

        expect(result.rootPackage.attributes).toStrictEqual(
          repositories.goodPolyrepoNextjsProject.attributes
        );

        expect(result.subRootPackages).toBeUndefined();
      }
    });

    it('returns expected subRootPackages and cwdPackage when cwd is monorepo root with the same name as a sub-root', async () => {
      expect.hasAssertions();

      const result = await analyzeProjectStructure({
        cwd: repositories.goodMonorepoWeirdSameNames.root,
        useCached: true,
        allowUnnamedPackages: true
      });

      expect(result.cwdPackage).toBe(result.rootPackage);
      checkForExpectedPackages(result.subRootPackages, 'goodMonorepoWeirdSameNames');
    });

    it('returns expected subRootPackages and cwdPackage when cwd is a sub-root', async () => {
      expect.hasAssertions();

      const result = await analyzeProjectStructure({
        cwd: repositories.goodMonorepo.namedPackageMapData[0]![1].root,
        useCached: true,
        allowUnnamedPackages: true
      });

      expect(result.cwdPackage).toStrictEqual(
        repositories.goodMonorepo.namedPackageMapData[0]![1]
      );

      checkForExpectedPackages(result.subRootPackages, 'goodMonorepo');
    });

    it('returns expected subRootPackages and cwdPackage when cwd is under the project root but not under a sub-root', async () => {
      expect.hasAssertions();

      const result = await analyzeProjectStructure({
        cwd: `${repositories.goodMonorepo.namedPackageMapData[0]![1].root}/..` as AbsolutePath,
        useCached: true,
        allowUnnamedPackages: true
      });

      expect(result.cwdPackage).toBe(result.rootPackage);
      checkForExpectedPackages(result.subRootPackages, 'goodMonorepo');
    });

    it('returns expected subRootPackages and cwdPackage when cwd is somewhere under a sub-root', async () => {
      expect.hasAssertions();

      const result = await analyzeProjectStructure({
        cwd: `${repositories.goodMonorepo.namedPackageMapData[0]![1].root}/src` as AbsolutePath,
        useCached: true,
        allowUnnamedPackages: true
      });

      expect(result.cwdPackage).toStrictEqual(
        repositories.goodMonorepo.namedPackageMapData[0]![1]
      );

      checkForExpectedPackages(result.subRootPackages, 'goodMonorepo');
    });

    it('returns expected subRootPackages and cwdPackage with simple workspace cwd', async () => {
      expect.hasAssertions();

      const result = await analyzeProjectStructure({
        cwd: `${repositories.goodMonorepoSimplePaths.namedPackageMapData[0]![1].root}/src` as AbsolutePath,
        useCached: true,
        allowUnnamedPackages: true
      });

      expect(result.cwdPackage).toStrictEqual(
        repositories.goodMonorepoSimplePaths.namedPackageMapData[0]![1]
      );

      expect(result.rootPackage.attributes).toStrictEqual(
        repositories.goodMonorepoSimplePaths.attributes
      );

      checkForExpectedPackages(result.subRootPackages, 'goodMonorepoSimplePaths');
    });

    it('returns expected subRootPackages and cwdPackage when workspace cwd uses Windows-style path separators', async () => {
      expect.hasAssertions();

      const result = await analyzeProjectStructure({
        cwd: repositories.goodMonorepoWindows.namedPackageMapData[0]![1].root,
        useCached: true,
        allowUnnamedPackages: true
      });

      expect(result.cwdPackage).toStrictEqual(
        repositories.goodMonorepoWindows.namedPackageMapData[0]![1]
      );

      checkForExpectedPackages(result.subRootPackages, 'goodMonorepoWindows');
    });

    it('returns expected subRootPackages and cwdPackage when cwd is under the project root but not under a sub-root in a monorepo with weird absolute paths', async () => {
      expect.hasAssertions();

      const result = await analyzeProjectStructure({
        cwd: `${repositories.goodMonorepoWeirdAbsolute.namedPackageMapData[0]![1].root}/..` as AbsolutePath,
        useCached: true,
        allowUnnamedPackages: true
      });

      expect(result.cwdPackage).toBe(result.rootPackage);
      checkForExpectedPackages(result.subRootPackages, 'goodMonorepoWeirdAbsolute');
    });

    it('sets multiversal attribute in multiversal hybridrepo', async () => {
      expect.hasAssertions();

      const result = await analyzeProjectStructure({
        cwd: repositories.goodHybridrepoMultiversal.root,
        useCached: true,
        allowUnnamedPackages: true
      });

      expect(result.rootPackage.attributes).toStrictEqual(
        repositories.goodHybridrepoMultiversal.attributes
      );
    });

    it('normalizes workspace cwd to ignore non-directories', async () => {
      expect.hasAssertions();

      const result = await analyzeProjectStructure({
        cwd: repositories.goodMonorepoWeirdBoneless.root,
        useCached: true,
        allowUnnamedPackages: true
      });

      expect(result.cwdPackage).toBe(result.rootPackage);
      checkForExpectedPackages(result.subRootPackages, 'goodMonorepoWeirdBoneless');
    });

    it('does not return duplicates when dealing with overlapping workspace glob paths, some negated', async () => {
      expect.hasAssertions();

      const result = await analyzeProjectStructure({
        cwd: repositories.goodMonorepoWeirdOverlap.root,
        useCached: true,
        allowUnnamedPackages: true
      });

      expect(result.cwdPackage).toBe(result.rootPackage);
      checkForExpectedPackages(result.subRootPackages, 'goodMonorepoWeirdOverlap');
    });

    it('works with nthly-negated workspace paths where order matters', async () => {
      expect.hasAssertions();

      const result = await analyzeProjectStructure({
        cwd: repositories.goodMonorepoNegatedPaths.root,
        useCached: true,
        allowUnnamedPackages: true
      });

      expect(result.cwdPackage).toBe(result.rootPackage);
      checkForExpectedPackages(result.subRootPackages, 'goodMonorepoNegatedPaths');
    });

    it('classifies matching workspace pseudo-roots (without a package.json) as "broken"', async () => {
      expect.hasAssertions();

      const result = await analyzeProjectStructure({
        cwd: repositories.badMonorepoNonPackageDir.root,
        useCached: true,
        allowUnnamedPackages: true
      });

      expect(result.cwdPackage).toBe(result.rootPackage);
      checkForExpectedPackages(result.subRootPackages, 'badMonorepoNonPackageDir');
    });

    it('uses process.cwd when given no cwd parameter', async () => {
      expect.hasAssertions();
      await expect(
        analyzeProjectStructure({ useCached: true, allowUnnamedPackages: true })
      ).rejects.toThrow(GraphErrorMessage.NotAGitRepositoryError());
    });

    it('correctly determines repository type', async () => {
      expect.hasAssertions();

      expect(
        (
          await analyzeProjectStructure({
            cwd: repositories.goodMonorepo.root,
            useCached: true,
            allowUnnamedPackages: true
          })
        ).type
      ).toBe(ProjectAttribute.Monorepo);

      expect(
        (
          await analyzeProjectStructure({
            cwd: repositories.goodPolyrepo.root,
            useCached: true,
            allowUnnamedPackages: true
          })
        ).type
      ).toBe(ProjectAttribute.Polyrepo);
    });

    it('returns correct rootPackage regardless of cwd', async () => {
      expect.hasAssertions();

      const goodMonorepoRoot = toPath(
        repositories.goodMonorepo.root,
        packageJsonConfigPackageBase
      );

      const goodPolyrepoRoot = toPath(
        repositories.goodPolyrepo.root,
        packageJsonConfigPackageBase
      );

      const expectedJsonSpec = patchJsonObjectReaders(
        {
          [goodMonorepoRoot]: {
            name: 'good-monorepo-package-json-name',
            private: true,
            workspaces: ['packages/*']
          },
          [goodPolyrepoRoot]: {
            name: 'good-polyrepo-package-json-name'
          }
        },
        { replace: true }
      );

      {
        const { rootPackage } = await analyzeProjectStructure({
          cwd: repositories.goodMonorepo.namedPackageMapData[0]![1].root,
          useCached: true,
          allowUnnamedPackages: true
        });

        expect(excludeCircularPropertiesFromPackage(rootPackage)).toStrictEqual({
          root: repositories.goodMonorepo.root,
          json: expectedJsonSpec[goodMonorepoRoot],
          attributes: repositories.goodMonorepo.attributes
        });
      }

      {
        const { rootPackage } = await analyzeProjectStructure({
          cwd: `${repositories.goodMonorepo.namedPackageMapData[0]![1].root}/..` as AbsolutePath,
          useCached: true,
          allowUnnamedPackages: true
        });

        expect(excludeCircularPropertiesFromPackage(rootPackage)).toStrictEqual({
          root: repositories.goodMonorepo.root,
          json: expectedJsonSpec[goodMonorepoRoot],
          attributes: repositories.goodMonorepo.attributes
        });
      }

      {
        const { rootPackage } = await analyzeProjectStructure({
          cwd: `${repositories.goodMonorepo.namedPackageMapData[0]![1].root}/src` as AbsolutePath,
          useCached: true,
          allowUnnamedPackages: true
        });

        expect(excludeCircularPropertiesFromPackage(rootPackage)).toStrictEqual({
          root: repositories.goodMonorepo.root,
          json: expectedJsonSpec[goodMonorepoRoot],
          attributes: repositories.goodMonorepo.attributes
        });
      }

      {
        const { rootPackage } = await analyzeProjectStructure({
          cwd: repositories.goodPolyrepo.root,
          useCached: true,
          allowUnnamedPackages: true
        });

        expect(excludeCircularPropertiesFromPackage(rootPackage)).toStrictEqual({
          root: repositories.goodPolyrepo.root,
          json: expectedJsonSpec[goodPolyrepoRoot],
          attributes: repositories.goodPolyrepo.attributes
        });
      }

      {
        const { rootPackage } = await analyzeProjectStructure({
          cwd: `${repositories.goodPolyrepo.root}/src` as AbsolutePath,
          useCached: true,
          allowUnnamedPackages: true
        });

        expect(excludeCircularPropertiesFromPackage(rootPackage)).toStrictEqual({
          root: repositories.goodPolyrepo.root,
          json: expectedJsonSpec[goodPolyrepoRoot],
          attributes: repositories.goodPolyrepo.attributes
        });
      }
    });

    it('populates subRootPackages with correct WorkspacePackage objects in monorepo', async () => {
      expect.hasAssertions();

      checkForExpectedPackages(
        (
          await analyzeProjectStructure({
            cwd: repositories.goodMonorepo.root,
            useCached: true,
            allowUnnamedPackages: true
          })
        ).subRootPackages,
        'goodMonorepo'
      );
    });

    it('returns undefined subRootPackages when in polyrepo', async () => {
      expect.hasAssertions();

      expect(
        (
          await analyzeProjectStructure({
            cwd: repositories.goodPolyrepo.root,
            useCached: true,
            allowUnnamedPackages: true
          })
        ).subRootPackages
      ).toBeUndefined();
    });

    it('returns result from internal cache if available unless useCached is false (new result is always added to internal cache)', async () => {
      expect.hasAssertions();

      const dummyMetadata = await analyzeProjectStructure({
        cwd: repositories.goodPolyrepo.root,
        useCached: false,
        allowUnnamedPackages: true
      });

      expect(dummyMetadata.rootPackage).toBe(
        (
          await analyzeProjectStructure({
            cwd: repositories.goodPolyrepo.root,
            useCached: true,
            allowUnnamedPackages: true
          })
        ).rootPackage
      );

      const updatedDummyMetadata = await analyzeProjectStructure({
        cwd: repositories.goodPolyrepo.root,
        useCached: false,
        allowUnnamedPackages: true
      });

      expect(updatedDummyMetadata.rootPackage).not.toBe(dummyMetadata.rootPackage);

      expect(
        (
          await analyzeProjectStructure({
            cwd: repositories.goodPolyrepo.root,
            useCached: true,
            allowUnnamedPackages: true
          })
        ).rootPackage
      ).toBe(updatedDummyMetadata.rootPackage);
    });

    it('defines cwdPackage properly when returning project metadata from internal cache and cwd changes from monorepo root to a sub-root of the same monorepo', async () => {
      expect.hasAssertions();

      expect(
        (
          await analyzeProjectStructure({
            cwd: repositories.goodMonorepo.root,
            useCached: true,
            allowUnnamedPackages: true
          })
        ).cwdPackage
      ).toStrictEqual(dummyToProjectMetadata('goodMonorepo').rootPackage);

      expect(
        (
          await analyzeProjectStructure({
            cwd: repositories.goodMonorepo.namedPackageMapData[0]![1].root,
            useCached: true,
            allowUnnamedPackages: true
          })
        ).cwdPackage
      ).toStrictEqual(repositories.goodMonorepo.namedPackageMapData[0]![1]);
    });

    it('sets subRootPackages[package.json.name] to strictly equal cwdPackage when expected', async () => {
      expect.hasAssertions();

      const result = await analyzeProjectStructure({
        cwd: repositories.goodMonorepo.namedPackageMapData[0]![1].root,
        useCached: true,
        allowUnnamedPackages: true
      });

      expect(result.subRootPackages?.get(result.cwdPackage.json.name!)).toBe(
        result.cwdPackage
      );

      expect(!!result.cwdPackage).toBeTrue();
    });

    it('sets subRootPackages.unnamed[package.id] to strictly equal cwdPackage when expected', async () => {
      expect.hasAssertions();

      const result = await analyzeProjectStructure({
        cwd: repositories.goodMonorepo.unnamedPackageMapData[0]![1].root,
        useCached: true,
        allowUnnamedPackages: true
      });

      expect(
        result.subRootPackages?.unnamed.get((result.cwdPackage as WorkspacePackage).id)
      ).toBe(result.cwdPackage);

      expect(!!result.cwdPackage).toBeTrue();
    });

    it('throws when passed non-existent projectRoot', async () => {
      expect.hasAssertions();

      await expect(
        analyzeProjectStructure({
          cwd: '/fake/root' as AbsolutePath,
          useCached: true,
          allowUnnamedPackages: true
        })
      ).rejects.toThrow(GraphErrorMessage.NotAGitRepositoryError());
    });

    it('throws when failing to find a .git directory', async () => {
      expect.hasAssertions();

      await expect(
        analyzeProjectStructure({
          cwd: '/does/not/exist' as AbsolutePath,
          useCached: true,
          allowUnnamedPackages: true
        })
      ).rejects.toThrow(GraphErrorMessage.NotAGitRepositoryError());
    });

    it('throws when a project has conflicting cli and next attributes', async () => {
      expect.hasAssertions();

      await expect(
        analyzeProjectStructure({
          cwd: repositories.badPolyrepoConflictingAttributes.root,
          useCached: true,
          allowUnnamedPackages: true
        })
      ).rejects.toThrow(GraphErrorMessage.CannotBeCliAndNextJs());
    });

    it('throws when a project has a bad "type" field in package.json', async () => {
      expect.hasAssertions();

      await expect(
        analyzeProjectStructure({
          cwd: repositories.badPolyrepoBadType.root,
          useCached: true,
          allowUnnamedPackages: true
        })
      ).rejects.toThrow(
        GraphErrorMessage.BadProjectTypeInPackageJson(
          toPath(repositories.badPolyrepoBadType.root, 'package.json')
        )
      );
    });

    it('throws when two packages have the same "name" field in package.json', async () => {
      expect.hasAssertions();

      await expect(
        analyzeProjectStructure({
          cwd: repositories.badMonorepoDuplicateName.root,
          useCached: true,
          allowUnnamedPackages: true
        })
      ).rejects.toThrow(GraphErrorMessage.DuplicatePackageName('pkg', '', '').trim());
    });

    it('throws when two unnamed packages resolve to the same package-id', async () => {
      expect.hasAssertions();

      await expect(
        analyzeProjectStructure({
          cwd: repositories.badMonorepoDuplicateIdUnnamed.root,
          useCached: true,
          allowUnnamedPackages: true
        })
      ).rejects.toThrow(
        GraphErrorMessage.DuplicatePackageId(
          'pkg-1',
          `${repositories.badMonorepoDuplicateIdUnnamed.root}/packages-1/pkg-1`,
          `${repositories.badMonorepoDuplicateIdUnnamed.root}/packages-2/pkg-1`
        )
      );
    });

    it('throws when two differently-named packages resolve to the same package-id', async () => {
      expect.hasAssertions();

      await expect(
        analyzeProjectStructure({
          cwd: repositories.badMonorepoDuplicateIdNamed.root,
          useCached: true,
          allowUnnamedPackages: true
        })
      ).rejects.toThrow(
        GraphErrorMessage.DuplicatePackageId(
          'pkg-1',
          `${repositories.badMonorepoDuplicateIdNamed.root}/packages-2/pkg-1`,
          `${repositories.badMonorepoDuplicateIdNamed.root}/packages-1/pkg-1`
        )
      );
    });

    it('throws when allowUnnamedPackages is false (the default) and an unnamed package is the rootPackage/cwdPackage', async () => {
      expect.hasAssertions();

      await expect(
        analyzeProjectStructure({
          cwd: repositories.badPolyrepoEmptyPackageJson.root,
          useCached: false,
          allowUnnamedPackages: false
        })
      ).rejects.toMatchObject({
        message: expect.stringContaining(FsErrorMessage.IsNotXPackageJson())
      });

      await expect(
        analyzeProjectStructure({
          cwd: repositories.goodMonorepo.unnamedPackageMapData[1]![1].root,
          useCached: true
          // * allowUnnamedPackages: false should be the default
        })
      ).rejects.toMatchObject({
        message: expect.stringContaining(FsErrorMessage.IsNotXPackageJson())
      });
    });

    it('considers all unnamed packages "broken" when allowUnnamedPackages is false (the default)', async () => {
      expect.hasAssertions();

      {
        const result = await analyzeProjectStructure({
          cwd: repositories.goodMonorepo.root,
          useCached: true,
          allowUnnamedPackages: false
        });

        expect(result.cwdPackage).toBe(result.rootPackage);
        expect(result.subRootPackages).toBeDefined();
        expect(result.type).toStrictEqual(ProjectAttribute.Monorepo);

        expect(result.rootPackage.attributes).toStrictEqual(
          repositories.goodMonorepo.attributes
        );

        expect(result.rootPackage.json).toStrictEqual(repositories.goodMonorepo.json);
        expect(result.rootPackage.root).toBe(repositories.goodMonorepo.root);
        expect(result.rootPackage.projectMetadata).toBe(result);

        checkForExpectedPackages(result.subRootPackages, 'goodMonorepo', {
          unnamedConsideredBroken: true
        });
      }

      {
        const result = await analyzeProjectStructure({
          cwd: repositories.goodMonorepo.root,
          useCached: false
        });

        expect(result.cwdPackage).toBe(result.rootPackage);
        expect(result.subRootPackages).toBeDefined();
        expect(result.type).toStrictEqual(ProjectAttribute.Monorepo);

        expect(result.rootPackage.attributes).toStrictEqual(
          repositories.goodMonorepo.attributes
        );

        expect(result.rootPackage.json).toStrictEqual(repositories.goodMonorepo.json);
        expect(result.rootPackage.root).toBe(repositories.goodMonorepo.root);
        expect(result.rootPackage.projectMetadata).toBe(result);

        checkForExpectedPackages(result.subRootPackages, 'goodMonorepo', {
          unnamedConsideredBroken: true
        });
      }
    });
  });
});

describe('::sortPackagesTopologically', () => {
  it('returns a 2d array of packages sorted topologically for all repo types', () => {
    expect.hasAssertions();

    {
      const projectMetadata = dummyToProjectMetadata('goodHybridrepoTopological');
      const { subRootPackages: packages, rootPackage } = projectMetadata;

      assert(packages);

      expect(
        sortPackagesTopologically(projectMetadata, { skipPrivateDependencies: false })
      ).toStrictEqual([
        [
          expect.objectContaining({ root: packages.get('public')!.root }),
          expect.objectContaining({ root: packages.get('webpack')!.root })
        ],
        [expect.objectContaining({ root: packages.get('cli')!.root })],
        [expect.objectContaining({ root: rootPackage.root })]
      ]);
    }

    {
      const projectMetadata = dummyToProjectMetadata('goodMonorepoTopological');
      const { subRootPackages: packages, rootPackage } = projectMetadata;

      assert(packages);

      expect(
        sortPackagesTopologically(projectMetadata, { skipPrivateDependencies: false })
      ).toStrictEqual([
        [
          expect.objectContaining({ root: rootPackage.root }),
          expect.objectContaining({ root: packages.get('pkg-1')!.root })
        ],
        [
          expect.objectContaining({ root: packages.get('@namespaced/pkg')!.root }),
          expect.objectContaining({ root: packages.get('pkg-3')!.root })
        ],
        [expect.objectContaining({ root: packages.get('pkg-4')!.root })],
        [expect.objectContaining({ root: packages.get('pkg-5')!.root })],
        [expect.objectContaining({ root: packages.get('@namespaced/importer')!.root })]
      ]);
    }

    {
      const projectMetadata = dummyToProjectMetadata('goodPolyrepo');
      const { rootPackage } = projectMetadata;

      expect(
        sortPackagesTopologically(projectMetadata, { skipPrivateDependencies: false })
      ).toStrictEqual([[expect.objectContaining({ root: rootPackage.root })]]);
    }
  });

  it('skips private packages that have no dependents unless skipPrivateDependencies is disabled', () => {
    expect.hasAssertions();

    {
      const projectMetadata = dummyToProjectMetadata('goodHybridrepoTopological');
      const { subRootPackages: packages, rootPackage } = projectMetadata;

      assert(packages);

      expect(sortPackagesTopologically(projectMetadata)).toStrictEqual([
        [
          expect.objectContaining({ root: packages.get('public')!.root }),
          expect.objectContaining({ root: packages.get('webpack')!.root })
        ],
        [expect.objectContaining({ root: packages.get('cli')!.root })],
        [expect.objectContaining({ root: rootPackage.root })]
      ]);
    }

    {
      const projectMetadata = dummyToProjectMetadata('goodMonorepoTopological');
      const { subRootPackages: packages } = projectMetadata;

      assert(packages);

      expect(sortPackagesTopologically(projectMetadata)).toStrictEqual([
        [expect.objectContaining({ root: packages.get('pkg-1')!.root })],
        [
          expect.objectContaining({ root: packages.get('@namespaced/pkg')!.root }),
          expect.objectContaining({ root: packages.get('pkg-3')!.root })
        ],
        [expect.objectContaining({ root: packages.get('pkg-4')!.root })],
        [expect.objectContaining({ root: packages.get('pkg-5')!.root })],
        [expect.objectContaining({ root: packages.get('@namespaced/importer')!.root })]
      ]);
    }

    {
      const projectMetadata = dummyToProjectMetadata('goodPolyrepo');
      const { rootPackage } = projectMetadata;

      expect(sortPackagesTopologically(projectMetadata)).toStrictEqual([
        [expect.objectContaining({ root: rootPackage.root })]
      ]);
    }

    {
      const projectMetadata = dummyToProjectMetadata('goodHybridrepoTopologicalPrivate');
      const { subRootPackages: packages, rootPackage } = projectMetadata;

      assert(packages);

      expect(sortPackagesTopologically(projectMetadata)).toStrictEqual([
        [
          expect.objectContaining({ root: packages.get('private')!.root }),
          expect.objectContaining({ root: packages.get('webpack')!.root })
        ],
        [expect.objectContaining({ root: packages.get('cli')!.root })],
        [expect.objectContaining({ root: rootPackage.root })]
      ]);
    }

    {
      const projectMetadata = dummyToProjectMetadata('goodMonorepoTopologicalPrivate');
      const { subRootPackages: packages } = projectMetadata;

      assert(packages);

      expect(sortPackagesTopologically(projectMetadata)).toStrictEqual([
        [expect.objectContaining({ root: packages.get('pkg-1')!.root })],
        [
          expect.objectContaining({ root: packages.get('@namespaced/pkg')!.root }),
          expect.objectContaining({ root: packages.get('pkg-3')!.root })
        ],
        [expect.objectContaining({ root: packages.get('pkg-4')!.root })],
        [expect.objectContaining({ root: packages.get('pkg-5')!.root })],
        [expect.objectContaining({ root: packages.get('@namespaced/importer')!.root })]
      ]);
    }

    {
      const projectMetadata = dummyToProjectMetadata('goodPolyrepoTopologicalPrivate');

      expect(sortPackagesTopologically(projectMetadata)).toStrictEqual([]);
    }
  });

  it('does the right thing when a package depends on itself', () => {
    expect.hasAssertions();

    {
      const projectMetadata = dummyToProjectMetadata('goodHybridrepoTopologicalSelfRef');
      const { subRootPackages: packages, rootPackage } = projectMetadata;

      assert(packages);

      expect(
        sortPackagesTopologically(projectMetadata, { skipPrivateDependencies: false })
      ).toStrictEqual([
        [
          expect.objectContaining({ root: packages.get('public')!.root }),
          expect.objectContaining({ root: packages.get('webpack')!.root })
        ],
        [expect.objectContaining({ root: packages.get('cli')!.root })],
        [expect.objectContaining({ root: rootPackage.root })]
      ]);
    }

    {
      const projectMetadata = dummyToProjectMetadata('goodMonorepoTopologicalSelfRef');
      const { subRootPackages: packages, rootPackage } = projectMetadata;

      assert(packages);

      expect(
        sortPackagesTopologically(projectMetadata, { skipPrivateDependencies: false })
      ).toStrictEqual([
        [
          expect.objectContaining({ root: rootPackage.root }),
          expect.objectContaining({ root: packages.get('pkg-1')!.root })
        ],
        [
          expect.objectContaining({ root: packages.get('@namespaced/pkg')!.root }),
          expect.objectContaining({ root: packages.get('pkg-3')!.root })
        ],
        [expect.objectContaining({ root: packages.get('pkg-4')!.root })],
        [expect.objectContaining({ root: packages.get('pkg-5')!.root })],
        [expect.objectContaining({ root: packages.get('@namespaced/importer')!.root })]
      ]);
    }

    {
      const projectMetadata = dummyToProjectMetadata('goodPolyrepoTopologicalSelfRef');
      const { rootPackage } = projectMetadata;

      expect(
        sortPackagesTopologically(projectMetadata, { skipPrivateDependencies: false })
      ).toStrictEqual([[expect.objectContaining({ root: rootPackage.root })]]);
    }
  });

  it('considers package.json dependencies and peerDependencies only unless includeDevDependencies is enabled', () => {
    expect.hasAssertions();

    {
      const projectMetadata = dummyToProjectMetadata('goodHybridrepoTopological');
      const { subRootPackages: packages, rootPackage } = projectMetadata;

      assert(packages);

      expect(
        sortPackagesTopologically(projectMetadata, {
          includeDevDependencies: true,
          skipPrivateDependencies: false
        })
      ).toStrictEqual([
        [expect.objectContaining({ root: packages.get('webpack')!.root })],
        [expect.objectContaining({ root: packages.get('public')!.root })],
        [expect.objectContaining({ root: packages.get('cli')!.root })],
        [expect.objectContaining({ root: rootPackage.root })]
      ]);
    }

    {
      const projectMetadata = dummyToProjectMetadata('goodMonorepoTopological');
      const { subRootPackages: packages, rootPackage } = projectMetadata;

      assert(packages);

      expect(
        sortPackagesTopologically(projectMetadata, {
          includeDevDependencies: true,
          skipPrivateDependencies: false
        })
      ).toStrictEqual([
        [expect.objectContaining({ root: packages.get('pkg-1')!.root })],
        [
          expect.objectContaining({ root: packages.get('@namespaced/pkg')!.root }),
          expect.objectContaining({ root: packages.get('pkg-3')!.root })
        ],
        [
          expect.objectContaining({ root: rootPackage.root }),
          expect.objectContaining({ root: packages.get('pkg-4')!.root })
        ],
        [expect.objectContaining({ root: packages.get('pkg-5')!.root })],
        [expect.objectContaining({ root: packages.get('@namespaced/importer')!.root })]
      ]);
    }

    {
      const projectMetadata = dummyToProjectMetadata('goodPolyrepo');
      const { rootPackage } = projectMetadata;

      expect(
        sortPackagesTopologically(projectMetadata, {
          includeDevDependencies: true,
          skipPrivateDependencies: false
        })
      ).toStrictEqual([[expect.objectContaining({ root: rootPackage.root })]]);
    }
  });

  it('does not throw when a dependency, peerDependency, or devDependency has "private: true" in its package.json when its dependent is also private', () => {
    expect.hasAssertions();

    {
      const projectMetadata = dummyToProjectMetadata('goodHybridrepoTopologicalPrivate');
      const { subRootPackages: packages, rootPackage } = projectMetadata;

      assert(packages);

      expect(
        sortPackagesTopologically(projectMetadata, { skipPrivateDependencies: true })
      ).toStrictEqual([
        [
          expect.objectContaining({ root: packages.get('private')!.root }),
          expect.objectContaining({ root: packages.get('webpack')!.root })
        ],
        [expect.objectContaining({ root: packages.get('cli')!.root })],
        [expect.objectContaining({ root: rootPackage.root })]
      ]);
    }

    {
      const projectMetadata = dummyToProjectMetadata('goodMonorepoTopologicalPrivate');
      const { subRootPackages: packages, rootPackage } = projectMetadata;

      assert(packages);

      expect(
        sortPackagesTopologically(projectMetadata, { skipPrivateDependencies: false })
      ).toStrictEqual([
        [
          expect.objectContaining({ root: rootPackage.root }),
          expect.objectContaining({ root: packages.get('pkg-1')!.root })
        ],
        [
          expect.objectContaining({ root: packages.get('@namespaced/pkg')!.root }),
          expect.objectContaining({ root: packages.get('pkg-3')!.root })
        ],
        [expect.objectContaining({ root: packages.get('pkg-4')!.root })],
        [expect.objectContaining({ root: packages.get('pkg-5')!.root })],
        [expect.objectContaining({ root: packages.get('@namespaced/importer')!.root })]
      ]);
    }

    {
      const projectMetadata = dummyToProjectMetadata('goodPolyrepoTopologicalPrivate');
      const { rootPackage } = projectMetadata;

      expect(
        sortPackagesTopologically(projectMetadata, { skipPrivateDependencies: false })
      ).toStrictEqual([[expect.objectContaining({ root: rootPackage.root })]]);
    }
  });

  it('throws when a dependency, peerDependency, or devDependency has "private: true" in its package.json, its dependent is not private, and allowPrivateDependencies is disabled', () => {
    expect.hasAssertions();

    {
      const projectMetadata = dummyToProjectMetadata('badHybridrepoTopologicalPrivate');

      expect(() =>
        sortPackagesTopologically(projectMetadata, { skipPrivateDependencies: false })
      ).toThrow(
        GraphErrorMessage.IllegalPrivateDependency(
          'bad-hybridrepo-topological-private',
          'private'
        )
      );
    }

    {
      const projectMetadata = dummyToProjectMetadata('badMonorepoTopologicalPrivate');

      expect(() =>
        sortPackagesTopologically(projectMetadata, { skipPrivateDependencies: false })
      ).toThrow(GraphErrorMessage.IllegalPrivateDependency('pkg-5', 'pkg-4'));
    }

    {
      const projectMetadata = dummyToProjectMetadata('badHybridrepoTopologicalPrivate');

      expect(() =>
        sortPackagesTopologically(projectMetadata, {
          allowPrivateDependencies: true,
          skipPrivateDependencies: false
        })
      ).not.toThrow();
    }

    {
      const projectMetadata = dummyToProjectMetadata('badMonorepoTopologicalPrivate');

      expect(() =>
        sortPackagesTopologically(projectMetadata, {
          allowPrivateDependencies: true,
          skipPrivateDependencies: false
        })
      ).not.toThrow();
    }
  });

  it('throws when encountering a dependency cycle', () => {
    expect.hasAssertions();

    {
      const projectMetadata = dummyToProjectMetadata('badHybridrepoTopologicalCycle');

      expect(() =>
        sortPackagesTopologically(projectMetadata, { skipPrivateDependencies: false })
      ).toThrow(
        GraphErrorMessage.DependencyCycle([
          'bad-hybridrepo-topological-cycle',
          'cli',
          'webpack'
        ])
      );
    }

    {
      const projectMetadata = dummyToProjectMetadata('badMonorepoTopologicalCycle');

      expect(() =>
        sortPackagesTopologically(projectMetadata, { skipPrivateDependencies: false })
      ).toThrow(
        GraphErrorMessage.DependencyCycle([
          'pkg-1',
          'pkg-3',
          'pkg-4',
          'pkg-5',
          '@namespaced/pkg',
          '@namespaced/importer'
        ])
      );
    }
  });
});

function checkForExpectedPackages(
  result: GenericProjectMetadata['subRootPackages'],
  fixtureName: RepositoryName,
  { unnamedConsideredBroken = false }: { unnamedConsideredBroken?: boolean } = {}
) {
  assert(result);

  expect(
    excludeCircularPropertiesFromEntries(
      Array.from(result.entries()).toSorted(sortPackageMapEntriesByNameThenId)
    )
  ).toStrictEqual(
    excludeCircularPropertiesFromEntries(
      repositories[fixtureName].namedPackageMapData.toSorted(
        sortPackageMapEntriesByNameThenId
      )
    )
  );

  if (!unnamedConsideredBroken) {
    expect(
      excludeCircularPropertiesFromEntries(
        Array.from(result.unnamed.entries()).toSorted(sortPackageMapEntriesByNameThenId)
      )
    ).toStrictEqual(
      excludeCircularPropertiesFromEntries(
        repositories[fixtureName].unnamedPackageMapData.toSorted(
          sortPackageMapEntriesByNameThenId
        )
      )
    );
  }

  expect(result.broken.toSorted()).toStrictEqual(
    [
      ...repositories[fixtureName].brokenPackageRoots,
      ...(unnamedConsideredBroken
        ? repositories[fixtureName].unnamedPackageMapData.map(([, { root }]) => root)
        : [])
    ].toSorted()
  );

  expect(
    excludeCircularPropertiesFromPackages(result.all.toSorted(sortPackagesByNameThenId))
  ).toStrictEqual(
    excludeCircularPropertiesFromPackages(
      unnamedConsideredBroken
        ? repositories[fixtureName].namedPackageMapData
            .map(([, data]) => data)
            .toSorted(sortPackagesByNameThenId)
        : [
            ...repositories[fixtureName].namedPackageMapData.map(([, data]) => data),
            ...repositories[fixtureName].unnamedPackageMapData.map(([, data]) => data)
          ].toSorted(sortPackagesByNameThenId)
    )
  );
}

type GenericEntry = [string, GenericWorkspacePackage];

function excludeCircularPropertiesFromEntries(entries: GenericEntry[]) {
  return entries.map(([key, package_]) => [
    key,
    excludeCircularPropertiesFromPackage(package_)
  ]);
}

function excludeCircularPropertiesFromPackages(packages: GenericPackage[]) {
  return packages.map((package_) => excludeCircularPropertiesFromPackage(package_));
}

function excludeCircularPropertiesFromPackage({
  projectMetadata: _,
  ...package_
}: GenericPackage) {
  return package_;
}

function sortPackageMapEntriesByNameThenId(
  [, valueA]: GenericEntry,
  [, valueB]: GenericEntry
) {
  return sortPackagesByNameThenId(valueA, valueB);
}

function sortPackagesByNameThenId(packageA: GenericPackage, packageB: GenericPackage) {
  const {
    json: { name: packageAName }
  } = packageA;

  const {
    json: { name: packageBName }
  } = packageB;

  return packageAName && packageBName
    ? subSort(packageAName, packageBName)
    : 'id' in packageA && 'id' in packageB
      ? subSort(packageA.id, packageB.id)
      : 0;
}

function subSort(a: string, b: string) {
  return a > b ? 1 : a < b ? -1 : 0;
}

function getExpectedPseudodecorators(
  tsFile: string,
  jsFile: string,
  jsonFile: string,
  mdFile: string,
  ymlFile: string
) {
  return [
    [
      tsFile,
      [
        {
          tag: PseudodecoratorTag.NotExtraneous,
          items: [
            'all-contributors-cli',
            'remark-cli',
            'jest',
            'husky',
            'doctoc',
            '@babel/cli'
          ]
        },
        {
          tag: PseudodecoratorTag.NotInvalid,
          items: [
            '@types/eslint__js',
            'remark-cli',
            'jest',
            'husky',
            'lodash.mergewith',
            'doctoc',
            '@babel/cli'
          ]
        }
      ]
    ],
    [
      jsFile,
      [
        {
          tag: PseudodecoratorTag.NotInvalid,
          items: ['all-contributors-cli', 'remark-cli', 'jest', 'husky', 'doctoc']
        },
        { tag: PseudodecoratorTag.NotInvalid, items: [] },
        { tag: PseudodecoratorTag.NotInvalid, items: [] },
        { tag: PseudodecoratorTag.NotExtraneous, items: [] },
        { tag: PseudodecoratorTag.NotInvalid, items: ['something'] },
        { tag: PseudodecoratorTag.NotInvalid, items: ['something'] },
        { tag: PseudodecoratorTag.NotInvalid, items: ['something'] },
        { tag: PseudodecoratorTag.NotInvalid, items: ['something'] },
        { tag: PseudodecoratorTag.NotInvalid, items: ['something'] },
        { tag: PseudodecoratorTag.NotInvalid, items: ['something-else'] },
        { tag: PseudodecoratorTag.NotInvalid, items: ['something-', 'else'] },
        { tag: PseudodecoratorTag.NotInvalid, items: ['ugly', 'but', 'works'] }
      ]
    ],
    [
      jsonFile,
      [
        {
          tag: PseudodecoratorTag.NotExtraneous,
          items: ['a1', 'p2', '@lib/three', '@-xun/four']
        }
      ]
    ],
    [
      mdFile,
      [
        {
          tag: PseudodecoratorTag.NotExtraneous,
          items: ['all-contributors-cli', 'remark-cli', 'jest', 'husky', 'doctoc']
        },
        { tag: PseudodecoratorTag.NotExtraneous, items: ['more'] },
        { tag: PseudodecoratorTag.NotInvalid, items: ['even', 'more', 'items'] }
      ]
    ],
    [
      ymlFile,
      [
        {
          tag: PseudodecoratorTag.NotExtraneous,
          items: ['all-contributors-cli', 'remark-cli', 'jest', 'husky', 'doctoc']
        },
        {
          tag: PseudodecoratorTag.NotInvalid,
          items: ['all-contributors-cli', 'remark-cli', 'jest', 'husky', '@doc/toc']
        }
      ]
    ]
  ];
}
