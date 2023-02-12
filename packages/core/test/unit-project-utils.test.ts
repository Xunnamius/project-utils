import { toss } from 'toss-expression';

import * as project from 'pkgverse/core/src/project-utils';
import * as error from 'pkgverse/core/src/errors';
import { type FixtureName, fixtures, patchReadPackageJsonData } from 'testverse/fixtures';
import { getDummyPackage } from 'testverse/helpers';

const spies = {} as Record<string, jest.SpyInstance>;

const { exports: dummySimpleExports, imports: dummySimpleImports } = getDummyPackage(
  'simple',
  {
    requireObjectExports: true,
    requireObjectImports: true
  }
);

const { exports: dummyComplexExports, imports: dummyComplexImports } = getDummyPackage(
  'complex',
  {
    requireObjectExports: true,
    requireObjectImports: true
  }
);

const checkForExpectedPackages = (
  maybeResult: project.RootPackage['packages'],
  fixtureName: FixtureName
) => {
  const result = maybeResult as NonNullable<typeof maybeResult>;

  expect(maybeResult).not.toBeNull();

  expect(Array.from(result.entries())).toStrictEqual<
    [string, project.WorkspacePackage][]
  >(fixtures[fixtureName].namedPkgMapData);

  expect(Array.from(result.unnamed.entries())).toStrictEqual<
    [string, project.WorkspacePackage][]
  >(fixtures[fixtureName].unnamedPkgMapData);

  expect(result.broken).toStrictEqual<string[]>(fixtures[fixtureName].brokenPkgRoots);

  expect(result.all).toStrictEqual<project.WorkspacePackage[]>([
    ...fixtures[fixtureName].namedPkgMapData.map((data) => data[1]),
    ...fixtures[fixtureName].unnamedPkgMapData.map((data) => data[1])
  ]);
};

beforeEach(() => {
  spies.mockedProcessCwd = jest
    .spyOn(process, 'cwd')
    .mockImplementation(() => '/fake/cwd');

  project.clearPackageJsonCache();
});

describe('::packageRootToId', () => {
  it('translates a path to a package id', async () => {
    expect.hasAssertions();

    expect(project.packageRootToId({ root: '/repo/path/packages/pkg-1' })).toBe('pkg-1');
  });

  it('throws a PathIsNotAbsoluteError error if path is not absolute', async () => {
    expect.hasAssertions();

    expect(() =>
      project.packageRootToId({ root: 'repo/path/packages/pkg-1' })
    ).toThrowError(error.PathIsNotAbsoluteError);
  });
});

describe('::readPackageJson', () => {
  it('accepts a package directory and returns parsed package.json contents', async () => {
    expect.hasAssertions();

    const expectedJson = { name: 'good-package-json-name' };
    jest.spyOn(JSON, 'parse').mockImplementation(() => expectedJson);

    expect(project.readPackageJson({ root: fixtures.goodPolyrepo.root })).toStrictEqual(
      expectedJson
    );
  });

  it('returns cached result on subsequent calls', async () => {
    expect.hasAssertions();

    const expectedJson = { name: 'good-package-json-name' };
    jest.spyOn(JSON, 'parse').mockImplementation(() => expectedJson);

    const actualJson = project.readPackageJson({
      root: fixtures.goodPolyrepo.root
    });

    expect(actualJson).toStrictEqual(expectedJson);
    expect(project.readPackageJson({ root: fixtures.goodPolyrepo.root })).toBe(
      actualJson
    );
  });

  it('throws a PathIsNotAbsoluteError error if path is not absolute', async () => {
    expect.hasAssertions();

    expect(() => project.readPackageJson({ root: 'does/not/exist' })).toThrowError(
      error.PathIsNotAbsoluteError
    );
  });

  it('throws a PackageJsonNotFoundError on readFileSync failure', async () => {
    expect.hasAssertions();

    expect(() => project.readPackageJson({ root: '/does/not/exist' })).toThrowError(
      error.PackageJsonNotFoundError
    );
  });

  it('throws a BadPackageJsonError on JSON.parse failure', async () => {
    expect.hasAssertions();

    jest
      .spyOn(JSON, 'parse')
      .mockImplementation(() => toss(new Error('fake JSON error')));

    expect(() =>
      project.readPackageJson({ root: fixtures.goodPolyrepo.root })
    ).toThrowError(error.BadPackageJsonError);
  });
});

describe('::getWorkspacePackages', () => {
  it('throws a PathIsNotAbsoluteError error when passed relative projectRoot', async () => {
    expect.hasAssertions();

    expect(() => project.getWorkspacePackages({ projectRoot: 'fake/root' })).toThrowError(
      error.PathIsNotAbsoluteError
    );
  });

  it('throws a NotAMonorepo error when passed non-existent projectRoot', async () => {
    expect.hasAssertions();

    expect(() =>
      project.getWorkspacePackages({ projectRoot: '/fake/root' })
    ).toThrowError(error.NotAMonorepoError);
  });

  it('throws a NotAMonorepo error when projectRoot points to a polyrepo', async () => {
    expect.hasAssertions();

    expect(() =>
      project.getWorkspacePackages({
        projectRoot: fixtures.goodPolyrepo.root,
        cwd: fixtures.goodPolyrepo.root
      })
    ).toThrowError(error.NotAMonorepoError);
  });

  it('accepts workspaces.packages array', async () => {
    expect.hasAssertions();

    expect(() =>
      project.getWorkspacePackages({
        projectRoot: fixtures.goodMonorepoWeirdYarn.root,
        cwd: fixtures.goodMonorepoWeirdYarn.root
      })
    ).not.toThrow();
  });

  it('returns expected packages, packages.unnamed, cwdPackage when cwd is project root', async () => {
    expect.hasAssertions();

    const result = project.getWorkspacePackages({
      projectRoot: fixtures.goodMonorepo.root,
      cwd: fixtures.goodMonorepo.root
    });

    expect(result.cwdPackage).toBeNull();
    checkForExpectedPackages(result.packages, 'goodMonorepo');
  });

  it('returns expected packages, packages.unnamed, cwdPackage when cwd is monorepo root with the same name as a sub-root', async () => {
    expect.hasAssertions();

    const result = project.getWorkspacePackages({
      projectRoot: fixtures.goodMonorepoWeirdSameNames.root,
      cwd: fixtures.goodMonorepoWeirdSameNames.root
    });

    expect(result.cwdPackage).toBeNull();
    checkForExpectedPackages(result.packages, 'goodMonorepoWeirdSameNames');
  });

  it('returns expected packages, packages.unnamed, cwdPackage when cwd is a sub-root', async () => {
    expect.hasAssertions();

    const result = project.getWorkspacePackages({
      projectRoot: fixtures.goodMonorepo.root,
      cwd: fixtures.goodMonorepo.namedPkgMapData[0][1].root
    });

    expect(result.cwdPackage).toStrictEqual(fixtures.goodMonorepo.namedPkgMapData[0][1]);
    checkForExpectedPackages(result.packages, 'goodMonorepo');
  });

  it('returns expected packages, packages.unnamed, cwdPackage when cwd is under the project root but not under a sub-root', async () => {
    expect.hasAssertions();

    const result = project.getWorkspacePackages({
      projectRoot: fixtures.goodMonorepo.root,
      cwd: `${fixtures.goodMonorepo.namedPkgMapData[0][1].root}/..`
    });

    expect(result.cwdPackage).toBeNull();
    checkForExpectedPackages(result.packages, 'goodMonorepo');
  });

  it('returns expected packages, packages.unnamed, cwdPackage when cwd is somewhere under a sub-root', async () => {
    expect.hasAssertions();

    const result = project.getWorkspacePackages({
      projectRoot: fixtures.goodMonorepo.root,
      cwd: `${fixtures.goodMonorepo.namedPkgMapData[0][1].root}/src`
    });

    expect(result.cwdPackage).toStrictEqual(fixtures.goodMonorepo.namedPkgMapData[0][1]);
    checkForExpectedPackages(result.packages, 'goodMonorepo');
  });

  it('works with simple workspace paths', async () => {
    expect.hasAssertions();

    const result = project.getWorkspacePackages({
      projectRoot: fixtures.goodMonorepoSimplePaths.root,
      cwd: `${fixtures.goodMonorepoSimplePaths.namedPkgMapData[0][1].root}/src`
    });

    expect(result.cwdPackage).toStrictEqual(
      fixtures.goodMonorepoSimplePaths.namedPkgMapData[0][1]
    );
    checkForExpectedPackages(result.packages, 'goodMonorepoSimplePaths');
  });

  it('treats absolute workspace paths as if they were relative', async () => {
    expect.hasAssertions();

    const result = project.getWorkspacePackages({
      projectRoot: fixtures.goodMonorepoWeirdAbsolute.root,
      cwd: `${fixtures.goodMonorepoWeirdAbsolute.namedPkgMapData[0][1].root}/..`
    });

    expect(result.cwdPackage).toBeNull();
    checkForExpectedPackages(result.packages, 'goodMonorepoWeirdAbsolute');
  });

  it('works with workspace paths using Windows-style path separators', async () => {
    expect.hasAssertions();

    const result = project.getWorkspacePackages({
      projectRoot: fixtures.goodMonorepoWindows.root,
      cwd: fixtures.goodMonorepoWindows.namedPkgMapData[0][1].root
    });

    expect(result.cwdPackage).toStrictEqual(
      fixtures.goodMonorepoWindows.namedPkgMapData[0][1]
    );

    checkForExpectedPackages(result.packages, 'goodMonorepoWindows');
  });

  it('all workspace paths are normalized to ignore non-directories', async () => {
    expect.hasAssertions();

    const result = project.getWorkspacePackages({
      projectRoot: fixtures.goodMonorepoWeirdBoneless.root,
      cwd: fixtures.goodMonorepoWeirdBoneless.root
    });

    expect(result.cwdPackage).toBeNull();
    checkForExpectedPackages(result.packages, 'goodMonorepoWeirdBoneless');
  });

  it('does not return duplicates when dealing with overlapping workspace glob paths, some negated', async () => {
    expect.hasAssertions();

    const result = project.getWorkspacePackages({
      projectRoot: fixtures.goodMonorepoWeirdOverlap.root,
      cwd: fixtures.goodMonorepoWeirdOverlap.root
    });

    expect(result.cwdPackage).toBeNull();
    checkForExpectedPackages(result.packages, 'goodMonorepoWeirdOverlap');
  });

  it('works with nthly-negated workspace paths where order matters', async () => {
    expect.hasAssertions();

    const result = project.getWorkspacePackages({
      projectRoot: fixtures.goodMonorepoNegatedPaths.root,
      cwd: fixtures.goodMonorepoNegatedPaths.root
    });

    expect(result.cwdPackage).toBeNull();
    checkForExpectedPackages(result.packages, 'goodMonorepoNegatedPaths');
  });

  it('workspace directories without a package.json file are classified "broken"', async () => {
    expect.hasAssertions();

    const result = project.getWorkspacePackages({
      projectRoot: fixtures.badMonorepoNonPackageDir.root,
      cwd: fixtures.badMonorepoNonPackageDir.root
    });

    expect(result.cwdPackage).toBeNull();
    checkForExpectedPackages(result.packages, 'badMonorepoNonPackageDir');
  });

  it('throws a DuplicatePackageNameError when two packages have the same "name" field in package.json', async () => {
    expect.hasAssertions();

    expect(() =>
      project.getWorkspacePackages({
        projectRoot: fixtures.badMonorepoDuplicateName.root
      })
    ).toThrowError(error.DuplicatePackageNameError);
  });

  it('throws a DuplicatePackageIdError when two unnamed packages resolve to the same package-id', async () => {
    expect.hasAssertions();

    expect(() =>
      project.getWorkspacePackages({
        projectRoot: fixtures.badMonorepoDuplicateId.root
      })
    ).toThrowError(error.DuplicatePackageIdError);
  });

  it('does not throw when two differently-named packages resolve to the same package-id', async () => {
    expect.hasAssertions();

    const result = project.getWorkspacePackages({
      projectRoot: fixtures.goodMonorepoDuplicateId.root,
      cwd: fixtures.goodMonorepoDuplicateId.root
    });

    expect(result.cwdPackage).toBeNull();
    checkForExpectedPackages(result.packages, 'goodMonorepoDuplicateId');
  });
});

describe('::getRunContext', () => {
  it('uses process.cwd when given no cwd parameter', async () => {
    expect.hasAssertions();
    expect(() => project.getRunContext()).toThrow(error.NotAGitRepositoryError);
  });

  it('throws a PathIsNotAbsoluteError when passed a relative cwd', async () => {
    expect.hasAssertions();

    expect(() => project.getRunContext({ cwd: 'does/not/exist' })).toThrowError(
      error.PathIsNotAbsoluteError
    );
  });

  it('throws a NotAGitRepositoryError when failing to find a .git directory', async () => {
    expect.hasAssertions();

    expect(() => project.getRunContext({ cwd: '/does/not/exist' })).toThrowError(
      error.NotAGitRepositoryError
    );
  });

  it('correctly determines context', async () => {
    expect.hasAssertions();

    expect(project.getRunContext({ cwd: fixtures.goodMonorepo.root }).context).toBe(
      'monorepo'
    );

    expect(project.getRunContext({ cwd: fixtures.goodPolyrepo.root }).context).toBe(
      'polyrepo'
    );
  });

  it('project.root and project.json are correct regardless of cwd', async () => {
    expect.hasAssertions();

    const expectedJsonSpec = patchReadPackageJsonData(
      {
        [fixtures.goodMonorepo.root]: {
          name: 'good-monorepo-package-json-name',
          workspaces: ['packages/*']
        },
        [fixtures.goodPolyrepo.root]: {
          name: 'good-polyrepo-package-json-name'
        }
      },
      { replace: true }
    );

    expect(
      project.getRunContext({
        cwd: fixtures.goodMonorepo.namedPkgMapData[0][1].root
      }).project
    ).toStrictEqual({
      root: fixtures.goodMonorepo.root,
      json: expectedJsonSpec[fixtures.goodMonorepo.root],
      packages: expect.any(Map)
    });

    expect(
      project.getRunContext({
        cwd: `${fixtures.goodMonorepo.namedPkgMapData[0][1].root}/..`
      }).project
    ).toStrictEqual({
      root: fixtures.goodMonorepo.root,
      json: expectedJsonSpec[fixtures.goodMonorepo.root],
      packages: expect.any(Map)
    });

    expect(
      project.getRunContext({
        cwd: `${fixtures.goodMonorepo.namedPkgMapData[0][1].root}/src`
      }).project
    ).toStrictEqual({
      root: fixtures.goodMonorepo.root,
      json: expectedJsonSpec[fixtures.goodMonorepo.root],
      packages: expect.any(Map)
    });

    expect(
      project.getRunContext({
        cwd: fixtures.goodPolyrepo.root
      }).project
    ).toStrictEqual({
      root: fixtures.goodPolyrepo.root,
      json: expectedJsonSpec[fixtures.goodPolyrepo.root],
      packages: null
    });

    expect(
      project.getRunContext({
        cwd: `${fixtures.goodPolyrepo.root}/src`
      }).project
    ).toStrictEqual({
      root: fixtures.goodPolyrepo.root,
      json: expectedJsonSpec[fixtures.goodPolyrepo.root],
      packages: null
    });
  });

  it('project.packages is populated with correct WorkspacePackage objects in monorepo context', async () => {
    expect.hasAssertions();

    checkForExpectedPackages(
      project.getRunContext({
        cwd: fixtures.goodMonorepo.root
      }).project.packages,
      'goodMonorepo'
    );
  });

  it('project.packages is null when in polyrepo context', async () => {
    expect.hasAssertions();

    expect(
      project.getRunContext({
        cwd: fixtures.goodPolyrepo.root
      }).project.packages
    ).toBeNull();
  });

  it('package is null when in polyrepo context or at project root in monorepo context', async () => {
    expect.hasAssertions();

    expect(
      project.getRunContext({
        cwd: fixtures.goodPolyrepo.root
      }).package
    ).toBeNull();

    expect(
      project.getRunContext({
        cwd: fixtures.goodMonorepo.root
      }).package
    ).toBeNull();

    expect(
      project.getRunContext({
        cwd: fixtures.goodMonorepo.namedPkgMapData[0][1].root
      }).package
    ).not.toBeNull();
  });

  it('project.packages[package.json.name] strictly equals package when expected', async () => {
    expect.hasAssertions();

    const result = project.getRunContext({
      cwd: fixtures.goodMonorepo.namedPkgMapData[0][1].root
    });

    expect(result.project.packages?.get(result.package?.json.name as string)).toBe(
      result.package
    );

    expect(!!result.package).toBeTrue();
  });

  it('project.packages.unnamed[package.id] strictly equals package when expected', async () => {
    expect.hasAssertions();

    const result = project.getRunContext({
      cwd: fixtures.goodMonorepo.unnamedPkgMapData[0][1].root
    });

    expect(result.project.packages?.unnamed.get(result.package?.id as string)).toBe(
      result.package
    );

    expect(!!result.package).toBeTrue();
  });
});

describe('::flattenPackageJsonSubpathMap', () => {
  it('returns an empty array if subpath map is undefined', async () => {
    expect.hasAssertions();
    expect(project.flattenPackageJsonSubpathMap({ map: undefined })).toStrictEqual([]);
    expect(project.flattenPackageJsonSubpathMap({ map: {} })).toStrictEqual([]);
  });

  it('flattens exports subpath map correctly', async () => {
    expect.hasAssertions();

    expect(
      project.flattenPackageJsonSubpathMap({ map: dummySimpleExports })
    ).toStrictEqual<project.SubpathMappings>([
      {
        subpath: '.',
        target: './import.mjs',
        conditions: ['import'],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: '.',
        target: './require.js',
        conditions: ['require'],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: './null',
        target: null,
        conditions: ['import'],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: './null',
        target: './require.js',
        conditions: ['require'],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: './lite',
        target: './lite-worker-browser.js',
        conditions: ['worker', 'browser'],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: './lite',
        target: './lite-worker-node.js',
        conditions: ['worker', 'node'],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: './lite',
        target: './lite-import.mjs',
        conditions: ['import'],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: './lite',
        target: './lite-require.js',
        conditions: ['require'],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: './alias',
        target: './alias.d.ts',
        conditions: ['types'],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: './alias',
        target: './alias.js',
        conditions: ['node'],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: './alias',
        target: './alias.js',
        conditions: ['default'],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: './alias/path/node',
        target: './alias-node-import.js',
        conditions: ['node', 'import'],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: './alias/path/node',
        target: './require.js',
        conditions: ['node', 'require'],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: './alias/path/node',
        target: './alias.js',
        conditions: ['default'],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: './multi',
        target: './path-1.d.ts',
        conditions: ['types'],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: './multi',
        target: './path-1.js',
        conditions: ['default'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: true,
        isLastFallback: false
      },
      {
        subpath: './multi',
        target: './path-2.js',
        conditions: ['default'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: './multi',
        target: './path-3.js',
        conditions: ['default'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: true
      },
      {
        subpath: './mixed/*',
        target: './mixed/deep/*.js',
        conditions: ['default'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: true,
        isLastFallback: false
      },
      {
        subpath: './mixed/*',
        target: './mixed/*.js',
        conditions: ['default'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: true
      },
      {
        subpath: './pattern-1/*.js',
        target: './features/*.js',
        conditions: ['default'],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: './pattern-1/private-explicit/secret.js',
        target: null,
        conditions: ['default'],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: './pattern-2/private-explicit/secret.js',
        target: null,
        conditions: ['default'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: './pattern-2/private-explicit/secret.js',
        target: null,
        conditions: ['default'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: './pattern-2/private-explicit/secret.js',
        target: null,
        conditions: ['default'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: true
      },
      {
        subpath: './pattern-2/*',
        target: './features/*',
        conditions: ['require'],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: './pattern-3/*.js',
        target: './features/deep/*.js',
        conditions: ['default'],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: './pattern-1/private-internal/*',
        target: null,
        conditions: ['default'],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: './many-to-one/*',
        target: './many-to-one.js',
        conditions: ['default'],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: './multiple-asterisks-bad/*/*',
        target: './*/yet-another/*',
        conditions: ['default'],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: './multiple-asterisk-good-1/*',
        target: './asterisk/*/*.js',
        conditions: ['default'],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: './multiple-asterisk-good-2/*',
        target: './*/yet-another/*.js',
        conditions: ['default'],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: './pattern-4/*.js',
        target: './not-private/*.js',
        conditions: ['default'],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: './pattern-4/deep/*.js',
        target: null,
        conditions: ['default'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: './pattern-4/deep/*.js',
        target: null,
        conditions: ['default'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: './pattern-4/deep/*.js',
        target: './not-private/*.js',
        conditions: ['default'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: true,
        isLastFallback: true
      },
      {
        subpath: './.hidden',
        target: './.hidden',
        conditions: ['default'],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: './package',
        target: './package.json',
        conditions: ['default'],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: './package.json',
        target: './package.json',
        conditions: ['default'],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false
      }
    ]);
  });

  it('flattens imports subpath map correctly', async () => {
    expect.hasAssertions();

    expect(
      project.flattenPackageJsonSubpathMap({ map: dummySimpleImports })
    ).toStrictEqual<project.SubpathMappings>([
      {
        subpath: '#hash',
        target: './hash-import-browser.mjs',
        conditions: ['import', 'browser'],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: '#hash',
        target: 'hash-pkg/polyfill.js',
        conditions: ['import', 'node'],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: '#hash',
        target: 'hash-pkg',
        conditions: ['default'],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: '#null',
        target: null,
        conditions: ['default'],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: '#null2',
        target: 'some-package/browser.js',
        conditions: ['require', 'browser'],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: '#null2',
        target: 'some-package',
        conditions: ['require', 'node'],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: '#null2',
        target: null,
        conditions: ['default'],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false
      }
    ]);
  });

  it('handles sugared subpath string', async () => {
    expect.hasAssertions();

    expect(
      project.flattenPackageJsonSubpathMap({ map: './sugared/index.js' })
    ).toStrictEqual<project.SubpathMappings>([
      {
        subpath: '.',
        target: './sugared/index.js',
        conditions: ['default'],
        isSugared: true,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false
      }
    ]);
  });

  it('handles sugared string-only and mixed fallback arrays', async () => {
    expect.hasAssertions();

    expect(
      project.flattenPackageJsonSubpathMap({
        map: ['./string-1.js', './string-2.js']
      })
    ).toStrictEqual<project.SubpathMappings>([
      {
        subpath: '.',
        target: './string-1.js',
        conditions: ['default'],
        isSugared: true,
        isFallback: true,
        isFirstNonNullFallback: true,
        isLastFallback: false
      },
      {
        subpath: '.',
        target: './string-2.js',
        conditions: ['default'],
        isSugared: true,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: true
      }
    ]);

    expect(
      project.flattenPackageJsonSubpathMap({
        map: [
          './string.js',
          { import: ['./import.js', { default: './node.js' }], default: './default.js' }
        ]
      })
    ).toStrictEqual<project.SubpathMappings>([
      {
        subpath: '.',
        target: './string.js',
        conditions: ['default'],
        isSugared: true,
        isFallback: true,
        isFirstNonNullFallback: true,
        isLastFallback: false
      },
      {
        subpath: '.',
        target: './import.js',
        conditions: ['default', 'import'],
        isSugared: true,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: '.',
        target: './node.js',
        conditions: ['default', 'import'],
        isSugared: true,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: '.',
        target: './default.js',
        conditions: ['default'],
        isSugared: true,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: true
      }
    ]);
  });

  it('handles sugared null', async () => {
    expect.hasAssertions();

    expect(
      project.flattenPackageJsonSubpathMap({ map: null })
    ).toStrictEqual<project.SubpathMappings>([
      {
        subpath: '.',
        target: null,
        conditions: ['default'],
        isSugared: true,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false
      }
    ]);
  });

  it('handles custom conditions', async () => {
    expect.hasAssertions();

    expect(
      project.flattenPackageJsonSubpathMap({
        map: {
          '.': {
            'condition-1': './string-1.js',
            'condition-2': { 'condition-3': './string-2.js' }
          }
        }
      })
    ).toStrictEqual<project.SubpathMappings>([
      {
        subpath: '.',
        target: './string-1.js',
        conditions: ['condition-1'],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: '.',
        target: './string-2.js',
        conditions: ['condition-2', 'condition-3'],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false
      }
    ]);
  });

  it('handles complex fallback arrays and un-sugared exports', async () => {
    expect.hasAssertions();

    expect(
      project.flattenPackageJsonSubpathMap({
        map: dummyComplexExports
      })
    ).toStrictEqual<project.SubpathMappings>([
      {
        subpath: '.',
        target: './import-1.js',
        conditions: ['require'],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: '.',
        target: './string-1.js',
        conditions: ['import'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: true,
        isLastFallback: false
      },
      {
        subpath: '.',
        target: './import-2.js',
        conditions: ['import'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: '.',
        target: './node-2.js',
        conditions: ['import', 'node'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: '.',
        target: './default-2.js',
        conditions: ['import', 'default'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: true
      },
      {
        subpath: '.',
        target: './string-2.js',
        conditions: ['custom'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: true,
        isLastFallback: false
      },
      {
        subpath: '.',
        target: './import-3.js',
        conditions: ['custom', 'import'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: '.',
        target: './import-4.js',
        conditions: ['custom', 'import', 'custom-2'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: '.',
        target: './default-4.js',
        conditions: ['custom', 'import', 'default'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: '.',
        target: './node-3.js',
        conditions: ['custom', 'node', 'custom-2'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: '.',
        target: './node-4.js',
        conditions: ['custom', 'node', 'custom-3'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: '.',
        target: './node-5.js',
        conditions: ['custom', 'node', 'custom-3', 'import'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: '.',
        target: './browser-1.js',
        conditions: ['custom', 'node', 'custom-3', 'custom-4'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: '.',
        target: './default-3.js',
        conditions: ['custom', 'default'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: '.',
        target: './string-3.js',
        conditions: ['custom'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: true
      },
      {
        subpath: '.',
        target: './node-1.js',
        conditions: ['node'],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: '.',
        target: './default-1.js',
        conditions: ['default'],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: './null-in-fallback',
        target: null,
        conditions: ['default'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: './null-in-fallback',
        target: null,
        conditions: ['default'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: './null-in-fallback',
        target: './node-1.js',
        conditions: ['default'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: true,
        isLastFallback: false
      },
      {
        subpath: './null-in-fallback',
        target: null,
        conditions: ['default'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: './null-in-fallback',
        target: './string-3.js',
        conditions: ['default'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: true
      },
      {
        subpath: './null-in-fallback-edge-case-1',
        target: null,
        conditions: ['default'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: './null-in-fallback-edge-case-1',
        target: null,
        conditions: ['default'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: './null-in-fallback-edge-case-1',
        target: './string-3.js',
        conditions: ['default', 'custom-edge-1'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: true,
        isLastFallback: false
      },
      {
        subpath: './null-in-fallback-edge-case-1',
        target: './string',
        conditions: ['default', 'require'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: './null-in-fallback-edge-case-1',
        target: null,
        conditions: ['default', 'import'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: './null-in-fallback-edge-case-1',
        target: './import.js',
        conditions: ['default', 'import'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: './null-in-fallback-edge-case-1',
        target: null,
        conditions: ['default'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: true
      },
      {
        subpath: './null-in-fallback-edge-case-2',
        target: null,
        conditions: ['custom-edge-2'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: './null-in-fallback-edge-case-2',
        target: null,
        conditions: ['custom-edge-2'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: true
      },
      {
        subpath: './null-in-fallback-edge-case-2',
        target: null,
        conditions: ['default'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: './null-in-fallback-edge-case-2',
        target: './string-3.js',
        conditions: ['default'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: true,
        isLastFallback: true
      },
      {
        subpath: './edge-case-1',
        target: './string.js',
        conditions: ['default'],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: './edge-case-2',
        target: './import.js',
        conditions: ['default', 'import'],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: './edge-case-2',
        target: './node.js',
        conditions: ['default', 'node'],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: './edge-case-2',
        target: './default.js',
        conditions: ['default'],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: './edge-case-3',
        target: './import.js',
        conditions: ['default', 'import'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: true,
        isLastFallback: false
      },
      {
        subpath: './edge-case-3',
        target: './node.js',
        conditions: ['default', 'node'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: './edge-case-3',
        target: './default.js',
        conditions: ['default'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: './edge-case-3',
        target: './string.js',
        conditions: ['default'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: true
      }
    ]);
  });

  it('handles complex fallback arrays and un-sugared imports', async () => {
    expect.hasAssertions();

    expect(
      project.flattenPackageJsonSubpathMap({
        map: dummyComplexImports
      })
    ).toStrictEqual<project.SubpathMappings>([
      {
        subpath: '#complex-1',
        target: null,
        conditions: ['default'],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: '#complex-2',
        target: './default.js',
        conditions: ['default'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: true,
        isLastFallback: false
      },
      {
        subpath: '#complex-2',
        target: './default-2.js',
        conditions: ['default'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: true
      },
      {
        subpath: '#complex-3',
        target: './import.js',
        conditions: ['default', 'import'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: true,
        isLastFallback: false
      },
      {
        subpath: '#complex-3',
        target: './node.js',
        conditions: ['default', 'node'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: '#complex-3',
        target: './default.js',
        conditions: ['default'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: '#complex-3',
        target: './string.js',
        conditions: ['default'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: true
      },
      {
        subpath: '#complex-4/*.js',
        target: './features/*.js',
        conditions: ['default'],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false
      },
      {
        subpath: '#complex-4/deep/*',
        target: null,
        conditions: ['default'],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false
      }
    ]);
  });
});
