import * as Utils from 'pkgverse/core/src/project-utils';
import * as Errors from 'pkgverse/core/src/errors';
import { FixtureName, Fixtures, patchReadPackageJsonData } from 'testverse/fixtures';
import { toss } from 'toss-expression';

const spies = {} as Record<string, jest.SpyInstance>;

const checkForExpectedPackages = (
  result: Utils.RootPackage['packages'],
  fixtureName: FixtureName
) => {
  const res = result as NonNullable<typeof result>;

  expect(result).not.toBeNull();

  expect(Array.from(res.entries())).toStrictEqual<[string, Utils.WorkspacePackage][]>(
    Fixtures[fixtureName].namedPkgMapData
  );

  expect(Array.from(res.unnamed.entries())).toStrictEqual<
    [string, Utils.WorkspacePackage][]
  >(Fixtures[fixtureName].unnamedPkgMapData);

  expect(res.broken).toStrictEqual(Fixtures[fixtureName].brokenPkgRoots);
};

beforeEach(() => {
  spies.mockedProcessCwd = jest
    .spyOn(process, 'cwd')
    .mockImplementation(() => '/fake/cwd');

  Utils.clearPackageJsonCache();
});

describe('::ensurePathIsAbsolute', () => {
  test('throws a PathIsNotAbsoluteError error if path is not absolute', async () => {
    expect.hasAssertions();

    expect(() => Utils.ensurePathIsAbsolute({ path: '/absolute/path' })).not.toThrow();
    expect(() => Utils.ensurePathIsAbsolute({ path: 'relative/path' })).toThrowError(
      Errors.PathIsNotAbsoluteError
    );
    expect(() => Utils.ensurePathIsAbsolute({ path: './relative/path' })).toThrowError(
      Errors.PathIsNotAbsoluteError
    );
  });
});

describe('::packageRootToId', () => {
  test('translates a path to a package id', async () => {
    expect.hasAssertions();

    expect(Utils.packageRootToId({ root: '/repo/path/packages/pkg-1' })).toBe('pkg-1');
  });

  test('throws a PathIsNotAbsoluteError error if path is not absolute', async () => {
    expect.hasAssertions();

    expect(() =>
      Utils.packageRootToId({ root: 'repo/path/packages/pkg-1' })
    ).toThrowError(Errors.PathIsNotAbsoluteError);
  });
});

describe('::readPackageJson', () => {
  test('accepts a package directory and returns parsed package.json contents', async () => {
    expect.hasAssertions();

    const expectedJson = { name: 'good-package-json-name' };
    jest.spyOn(JSON, 'parse').mockImplementation(() => expectedJson);

    expect(Utils.readPackageJson({ root: Fixtures.goodPolyrepo.root })).toStrictEqual(
      expectedJson
    );
  });

  test('returns cached result on subsequent calls', async () => {
    expect.hasAssertions();

    const expectedJson = { name: 'good-package-json-name' };
    jest.spyOn(JSON, 'parse').mockImplementation(() => expectedJson);

    const actualJson = Utils.readPackageJson({
      root: Fixtures.goodPolyrepo.root
    });

    expect(actualJson).toStrictEqual(expectedJson);
    expect(Utils.readPackageJson({ root: Fixtures.goodPolyrepo.root })).toBe(actualJson);
  });

  test('throws a PathIsNotAbsoluteError error if path is not absolute', async () => {
    expect.hasAssertions();

    expect(() => Utils.readPackageJson({ root: 'does/not/exist' })).toThrowError(
      Errors.PathIsNotAbsoluteError
    );
  });

  test('throws a PackageJsonNotFoundError on readFileSync failure', async () => {
    expect.hasAssertions();

    expect(() => Utils.readPackageJson({ root: '/does/not/exist' })).toThrowError(
      Errors.PackageJsonNotFoundError
    );
  });

  test('throws a BadPackageJsonError on JSON.parse failure', async () => {
    expect.hasAssertions();

    jest
      .spyOn(JSON, 'parse')
      .mockImplementation(() => toss(new Error('fake JSON error')));

    expect(() =>
      Utils.readPackageJson({ root: Fixtures.goodPolyrepo.root })
    ).toThrowError(Errors.BadPackageJsonError);
  });
});

describe('::getWorkspacePackages', () => {
  test('throws a PathIsNotAbsoluteError error when passed relative projectRoot', async () => {
    expect.hasAssertions();

    expect(() => Utils.getWorkspacePackages({ projectRoot: 'fake/root' })).toThrowError(
      Errors.PathIsNotAbsoluteError
    );
  });

  test('throws a NotAMonorepo error when passed non-existent projectRoot', async () => {
    expect.hasAssertions();

    expect(() => Utils.getWorkspacePackages({ projectRoot: '/fake/root' })).toThrowError(
      Errors.NotAMonorepoError
    );
  });

  test('throws a NotAMonorepo error when projectRoot points to a polyrepo', async () => {
    expect.hasAssertions();

    expect(() =>
      Utils.getWorkspacePackages({
        projectRoot: Fixtures.goodPolyrepo.root,
        cwd: Fixtures.goodPolyrepo.root
      })
    ).toThrowError(Errors.NotAMonorepoError);
  });

  test('accepts workspaces.packages array', async () => {
    expect.hasAssertions();

    expect(() =>
      Utils.getWorkspacePackages({
        projectRoot: Fixtures.goodMonorepoWeirdYarn.root,
        cwd: Fixtures.goodMonorepoWeirdYarn.root
      })
    ).not.toThrow();
  });

  test('returns expected packages, packages.unnamed, cwdPackage when cwd is project root', async () => {
    expect.hasAssertions();

    const result = Utils.getWorkspacePackages({
      projectRoot: Fixtures.goodMonorepo.root,
      cwd: Fixtures.goodMonorepo.root
    });

    expect(result.cwdPackage).toBeNull();
    checkForExpectedPackages(result.packages, 'goodMonorepo');
  });

  test('returns expected packages, packages.unnamed, cwdPackage when cwd is monorepo root with the same name as a sub-root', async () => {
    expect.hasAssertions();

    const result = Utils.getWorkspacePackages({
      projectRoot: Fixtures.goodMonorepoWeirdSameNames.root,
      cwd: Fixtures.goodMonorepoWeirdSameNames.root
    });

    expect(result.cwdPackage).toBeNull();
    checkForExpectedPackages(result.packages, 'goodMonorepoWeirdSameNames');
  });

  test('returns expected packages, packages.unnamed, cwdPackage when cwd is a sub-root', async () => {
    expect.hasAssertions();

    const result = Utils.getWorkspacePackages({
      projectRoot: Fixtures.goodMonorepo.root,
      cwd: Fixtures.goodMonorepo.namedPkgMapData[0][1].root
    });

    expect(result.cwdPackage).toStrictEqual(Fixtures.goodMonorepo.namedPkgMapData[0][1]);
    checkForExpectedPackages(result.packages, 'goodMonorepo');
  });

  test('returns expected packages, packages.unnamed, cwdPackage when cwd is under the project root but not under a sub-root', async () => {
    expect.hasAssertions();

    const result = Utils.getWorkspacePackages({
      projectRoot: Fixtures.goodMonorepo.root,
      cwd: `${Fixtures.goodMonorepo.namedPkgMapData[0][1].root}/..`
    });

    expect(result.cwdPackage).toBeNull();
    checkForExpectedPackages(result.packages, 'goodMonorepo');
  });

  test('returns expected packages, packages.unnamed, cwdPackage when cwd is somewhere under a sub-root', async () => {
    expect.hasAssertions();

    const result = Utils.getWorkspacePackages({
      projectRoot: Fixtures.goodMonorepo.root,
      cwd: `${Fixtures.goodMonorepo.namedPkgMapData[0][1].root}/src`
    });

    expect(result.cwdPackage).toStrictEqual(Fixtures.goodMonorepo.namedPkgMapData[0][1]);
    checkForExpectedPackages(result.packages, 'goodMonorepo');
  });

  test('works with simple workspace paths', async () => {
    expect.hasAssertions();

    const result = Utils.getWorkspacePackages({
      projectRoot: Fixtures.goodMonorepoSimplePaths.root,
      cwd: `${Fixtures.goodMonorepoSimplePaths.namedPkgMapData[0][1].root}/src`
    });

    expect(result.cwdPackage).toStrictEqual(
      Fixtures.goodMonorepoSimplePaths.namedPkgMapData[0][1]
    );
    checkForExpectedPackages(result.packages, 'goodMonorepoSimplePaths');
  });

  test('treats absolute workspace paths as if they were relative', async () => {
    expect.hasAssertions();

    const result = Utils.getWorkspacePackages({
      projectRoot: Fixtures.goodMonorepoWeirdAbsolute.root,
      cwd: `${Fixtures.goodMonorepoWeirdAbsolute.namedPkgMapData[0][1].root}/..`
    });

    expect(result.cwdPackage).toBeNull();
    checkForExpectedPackages(result.packages, 'goodMonorepoWeirdAbsolute');
  });

  test('works with workspace paths using Windows-style path separators', async () => {
    expect.hasAssertions();

    const result = Utils.getWorkspacePackages({
      projectRoot: Fixtures.goodMonorepoWindows.root,
      cwd: Fixtures.goodMonorepoWindows.namedPkgMapData[0][1].root
    });

    expect(result.cwdPackage).toStrictEqual(
      Fixtures.goodMonorepoWindows.namedPkgMapData[0][1]
    );

    checkForExpectedPackages(result.packages, 'goodMonorepoWindows');
  });

  test('all workspace paths are normalized to ignore non-directories', async () => {
    expect.hasAssertions();

    const result = Utils.getWorkspacePackages({
      projectRoot: Fixtures.goodMonorepoWeirdBoneless.root,
      cwd: Fixtures.goodMonorepoWeirdBoneless.root
    });

    expect(result.cwdPackage).toBeNull();
    checkForExpectedPackages(result.packages, 'goodMonorepoWeirdBoneless');
  });

  test('does not return duplicates when dealing with overlapping workspace glob paths, some negated', async () => {
    expect.hasAssertions();

    const result = Utils.getWorkspacePackages({
      projectRoot: Fixtures.goodMonorepoWeirdOverlap.root,
      cwd: Fixtures.goodMonorepoWeirdOverlap.root
    });

    expect(result.cwdPackage).toBeNull();
    checkForExpectedPackages(result.packages, 'goodMonorepoWeirdOverlap');
  });

  test('works with nthly-negated workspace paths where order matters', async () => {
    expect.hasAssertions();

    const result = Utils.getWorkspacePackages({
      projectRoot: Fixtures.goodMonorepoNegatedPaths.root,
      cwd: Fixtures.goodMonorepoNegatedPaths.root
    });

    expect(result.cwdPackage).toBeNull();
    checkForExpectedPackages(result.packages, 'goodMonorepoNegatedPaths');
  });

  test('workspace directories without a package.json file are classified "broken"', async () => {
    expect.hasAssertions();

    const result = Utils.getWorkspacePackages({
      projectRoot: Fixtures.badMonorepoNonPackageDir.root,
      cwd: Fixtures.badMonorepoNonPackageDir.root
    });

    expect(result.cwdPackage).toBeNull();
    checkForExpectedPackages(result.packages, 'badMonorepoNonPackageDir');
  });

  test('throws a DuplicatePackageNameError when two packages have the same "name" field in package.json', async () => {
    expect.hasAssertions();

    expect(() =>
      Utils.getWorkspacePackages({ projectRoot: Fixtures.badMonorepoDuplicateName.root })
    ).toThrowError(Errors.DuplicatePackageNameError);
  });

  test('throws a DuplicatePackageIdError when two unnamed packages resolve to the same package-id', async () => {
    expect.hasAssertions();

    expect(() =>
      Utils.getWorkspacePackages({ projectRoot: Fixtures.badMonorepoDuplicateId.root })
    ).toThrowError(Errors.DuplicatePackageIdError);
  });

  test('does not throw when two differently-named packages resolve to the same package-id', async () => {
    expect.hasAssertions();

    const result = Utils.getWorkspacePackages({
      projectRoot: Fixtures.goodMonorepoDuplicateId.root,
      cwd: Fixtures.goodMonorepoDuplicateId.root
    });

    expect(result.cwdPackage).toBeNull();
    checkForExpectedPackages(result.packages, 'goodMonorepoDuplicateId');
  });
});

describe('::getRunContext', () => {
  test('uses process.cwd when given no cwd parameter', async () => {
    expect.hasAssertions();
    expect(() => Utils.getRunContext()).toThrow(Errors.NotAGitRepositoryError);
  });

  test('throws a PathIsNotAbsoluteError when passed a relative cwd', async () => {
    expect.hasAssertions();

    expect(() => Utils.getRunContext({ cwd: 'does/not/exist' })).toThrowError(
      Errors.PathIsNotAbsoluteError
    );
  });

  test('throws a NotAGitRepositoryError when failing to find a .git directory', async () => {
    expect.hasAssertions();

    expect(() => Utils.getRunContext({ cwd: '/does/not/exist' })).toThrowError(
      Errors.NotAGitRepositoryError
    );
  });

  test('correctly determines context', async () => {
    expect.hasAssertions();

    expect(Utils.getRunContext({ cwd: Fixtures.goodMonorepo.root }).context).toBe(
      'monorepo'
    );

    expect(Utils.getRunContext({ cwd: Fixtures.goodPolyrepo.root }).context).toBe(
      'polyrepo'
    );
  });

  test('project.root and project.json are correct regardless of cwd', async () => {
    expect.hasAssertions();

    const expectedJsonSpec = patchReadPackageJsonData(
      {
        [Fixtures.goodMonorepo.root]: {
          name: 'good-monorepo-package-json-name',
          workspaces: ['packages/*']
        },
        [Fixtures.goodPolyrepo.root]: {
          name: 'good-polyrepo-package-json-name'
        }
      },
      { replace: true }
    );

    expect(
      Utils.getRunContext({
        cwd: Fixtures.goodMonorepo.namedPkgMapData[0][1].root
      }).project
    ).toStrictEqual({
      root: Fixtures.goodMonorepo.root,
      json: expectedJsonSpec[Fixtures.goodMonorepo.root],
      packages: expect.any(Map)
    });

    expect(
      Utils.getRunContext({
        cwd: `${Fixtures.goodMonorepo.namedPkgMapData[0][1].root}/..`
      }).project
    ).toStrictEqual({
      root: Fixtures.goodMonorepo.root,
      json: expectedJsonSpec[Fixtures.goodMonorepo.root],
      packages: expect.any(Map)
    });

    expect(
      Utils.getRunContext({
        cwd: `${Fixtures.goodMonorepo.namedPkgMapData[0][1].root}/src`
      }).project
    ).toStrictEqual({
      root: Fixtures.goodMonorepo.root,
      json: expectedJsonSpec[Fixtures.goodMonorepo.root],
      packages: expect.any(Map)
    });

    expect(
      Utils.getRunContext({
        cwd: Fixtures.goodPolyrepo.root
      }).project
    ).toStrictEqual({
      root: Fixtures.goodPolyrepo.root,
      json: expectedJsonSpec[Fixtures.goodPolyrepo.root],
      packages: null
    });

    expect(
      Utils.getRunContext({
        cwd: `${Fixtures.goodPolyrepo.root}/src`
      }).project
    ).toStrictEqual({
      root: Fixtures.goodPolyrepo.root,
      json: expectedJsonSpec[Fixtures.goodPolyrepo.root],
      packages: null
    });
  });

  test('project.packages is populated with correct WorkspacePackage objects in monorepo context', async () => {
    expect.hasAssertions();

    checkForExpectedPackages(
      Utils.getRunContext({
        cwd: Fixtures.goodMonorepo.root
      }).project.packages,
      'goodMonorepo'
    );
  });

  test('project.packages is null when in polyrepo context', async () => {
    expect.hasAssertions();

    expect(
      Utils.getRunContext({
        cwd: Fixtures.goodPolyrepo.root
      }).project.packages
    ).toBeNull();
  });

  test('package is null when in polyrepo context or at project root in monorepo context', async () => {
    expect.hasAssertions();

    expect(
      Utils.getRunContext({
        cwd: Fixtures.goodPolyrepo.root
      }).package
    ).toBeNull();

    expect(
      Utils.getRunContext({
        cwd: Fixtures.goodMonorepo.root
      }).package
    ).toBeNull();

    expect(
      Utils.getRunContext({
        cwd: Fixtures.goodMonorepo.namedPkgMapData[0][1].root
      }).package
    ).not.toBeNull();
  });

  test('project.packages[package.json.name] strictly equals package when expected', async () => {
    expect.hasAssertions();

    const result = Utils.getRunContext({
      cwd: Fixtures.goodMonorepo.namedPkgMapData[0][1].root
    });

    expect(result.project.packages?.get(result.package?.json.name as string)).toBe(
      result.package
    );

    expect(!!result.package).toBeTrue();
  });

  test('project.packages.unnamed[package.id] strictly equals package when expected', async () => {
    expect.hasAssertions();

    const result = Utils.getRunContext({
      cwd: Fixtures.goodMonorepo.unnamedPkgMapData[0][1].root
    });

    expect(result.project.packages?.unnamed.get(result.package?.id as string)).toBe(
      result.package
    );

    expect(!!result.package).toBeTrue();
  });
});
