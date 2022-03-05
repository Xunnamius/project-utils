import * as Linters from '../src/linters';
import * as Constants from '../src/constants';
import { Fixtures } from 'testverse/fixtures';
import { toss } from 'toss-expression';
import { ErrorMessage } from '../src/errors';
import { clearPackageJsonCache } from 'pkgverse/core/src/project-utils';
import { asMockedFunction } from '@xunnamius/jest-types';
import { run } from 'multiverse/run';
import escapeRegexp from 'escape-string-regexp';

jest.mock('multiverse/run');

const stringContainingErrorMessage = (currentFile: string, errorMessage: string) => {
  return expect.stringMatching(
    RegExp(
      `^.*${escapeRegexp(currentFile)}(?!/).*(?:\n  .*?)+ ${escapeRegexp(errorMessage)}$`,
      'm'
    )
  );
};

const mockedRun = asMockedFunction(run);

beforeEach(() => {
  mockedRun.mockImplementation(jest.requireActual('multiverse/run').run);
  clearPackageJsonCache();
});

describe('::runProjectLinter', () => {
  it('errors when the project is not a git repository', async () => {
    expect.hasAssertions();

    await expect(
      Linters.runProjectLinter({ rootDir: '/does/not/exist' })
    ).resolves.toStrictEqual({
      success: false,
      summary: expect.stringContaining('1 error, 0 warnings'),
      output: stringContainingErrorMessage(
        '/does/not/exist',
        ErrorMessage.NotAGitRepository()
      )
    });
  });

  it('errors when package.json file is missing', async () => {
    expect.hasAssertions();

    await expect(
      Linters.runProjectLinter({ rootDir: Fixtures.badPolyrepoNoPackageJson.root })
    ).resolves.toStrictEqual({
      success: false,
      summary: expect.stringContaining('1 error, 0 warnings'),
      output: stringContainingErrorMessage(
        `${Fixtures.badPolyrepoNoPackageJson.root}/package.json`,
        ErrorMessage.FatalMissingFile()
      )
    });
  });

  it('errors when package.json file is unparsable', async () => {
    expect.hasAssertions();

    jest.spyOn(JSON, 'parse').mockImplementation(() => toss(new Error('badness')));

    await expect(
      Linters.runProjectLinter({ rootDir: Fixtures.goodMonorepo.root })
    ).resolves.toStrictEqual({
      success: false,
      summary: expect.stringContaining('1 error, 0 warnings'),
      output: stringContainingErrorMessage(
        `${Fixtures.goodMonorepo.root}/package.json`,
        ErrorMessage.PackageJsonUnparsable()
      )
    });
  });

  it('errors when the dist directory or its subdirectories contain .tsbuildinfo files', async () => {
    expect.hasAssertions();

    const monorepo = await Linters.runProjectLinter({
      rootDir: Fixtures.badMonorepo.root
    });

    const polyrepo = await Linters.runProjectLinter({
      rootDir: Fixtures.badPolyrepo.root
    });

    expect(monorepo.output).toStrictEqual(
      stringContainingErrorMessage(
        `${Fixtures.badMonorepo.unnamedPkgMapData[1][1].root}/dist/tsconfig.fake.tsbuildinfo`,
        ErrorMessage.IllegalItemInDirectory(
          `${Fixtures.badMonorepo.unnamedPkgMapData[1][1].root}/dist`
        )
      )
    );

    expect(monorepo.output).toStrictEqual(
      stringContainingErrorMessage(
        `${Fixtures.badMonorepo.unnamedPkgMapData[1][1].root}/dist/sub-dir/tsconfig.fake2.tsbuildinfo`,
        ErrorMessage.IllegalItemInDirectory(
          `${Fixtures.badMonorepo.unnamedPkgMapData[1][1].root}/dist`
        )
      )
    );

    expect(polyrepo.output).toStrictEqual(
      stringContainingErrorMessage(
        `${Fixtures.badPolyrepo.root}/dist/tsconfig.fake.tsbuildinfo`,
        ErrorMessage.IllegalItemInDirectory(`${Fixtures.badPolyrepo.root}/dist`)
      )
    );
  });

  it('errors when package.json does not contain necessary fields', async () => {
    expect.hasAssertions();

    const monorepoRoot = await Linters.runProjectLinter({
      rootDir: Fixtures.badMonorepo.root
    });

    const monorepoSubRoot = await Linters.runProjectLinter({
      rootDir: Fixtures.badMonorepo.unnamedPkgMapData[0][1].root
    });

    const polyrepoRoot = await Linters.runProjectLinter({
      rootDir: Fixtures.badPolyrepo.root
    });

    // ? Works when linting a monorepo root
    Constants.globalPkgJsonRequiredFields.forEach((field) => {
      expect(monorepoRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          `${Fixtures.badMonorepo.root}/package.json`,
          ErrorMessage.PackageJsonMissingKey(field)
        )
      );
    });

    // ? Works when linting a sub-root explicitly
    Constants.globalPkgJsonRequiredFields.forEach((field) => {
      expect(monorepoSubRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          `${Fixtures.badMonorepo.unnamedPkgMapData[0][1].root}/package.json`,
          ErrorMessage.PackageJsonMissingKey(field)
        )
      );
    });

    // ? Works when linting a polyrepo root
    Constants.globalPkgJsonRequiredFields.forEach((field) => {
      expect(polyrepoRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          `${Fixtures.badPolyrepo.root}/package.json`,
          ErrorMessage.PackageJsonMissingKey(field)
        )
      );
    });
  });

  it('reports errors from sub-roots when explicitly linting a monorepo root', async () => {
    expect.hasAssertions();

    const monorepoRoot = await Linters.runProjectLinter({
      rootDir: Fixtures.badMonorepo.root
    });

    // ? Also lints sub-roots when linting a monorepo root
    Constants.globalPkgJsonRequiredFields.forEach((field) => {
      expect(monorepoRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          `${Fixtures.badMonorepo.unnamedPkgMapData[0][1].root}/package.json`,
          ErrorMessage.PackageJsonMissingKey(field)
        )
      );
    });
  });

  it('does not report errors from other sub-roots when explicitly linting one sub-root', async () => {
    expect.hasAssertions();

    const monorepoOtherSubRoot = await Linters.runProjectLinter({
      rootDir: Fixtures.badMonorepo.unnamedPkgMapData[1][1].root
    });

    // ? Linting one sub-root should not report errors from a different sub-root
    Constants.globalPkgJsonRequiredFields.forEach((field) => {
      expect(monorepoOtherSubRoot.output).not.toStrictEqual(
        stringContainingErrorMessage(
          `${Fixtures.badMonorepo.unnamedPkgMapData[0][1].root}/package.json`,
          ErrorMessage.PackageJsonMissingKey(field)
        )
      );
    });
  });

  it('errors when package.json does not contain certain fields except when in a monorepo root', async () => {
    expect.hasAssertions();

    const monorepoRoot = await Linters.runProjectLinter({
      rootDir: Fixtures.badMonorepo.root
    });

    const monorepoSubRoot = await Linters.runProjectLinter({
      rootDir: Fixtures.badMonorepo.unnamedPkgMapData[0][1].root
    });

    const polyrepoRoot = await Linters.runProjectLinter({
      rootDir: Fixtures.badPolyrepo.root
    });

    Constants.nonMonoRootPkgJsonRequiredFields.forEach((field) => {
      expect(monorepoRoot.output).not.toStrictEqual(
        stringContainingErrorMessage(
          `${Fixtures.badMonorepo.root}/package.json`,
          ErrorMessage.PackageJsonMissingKey(field)
        )
      );
    });

    Constants.nonMonoRootPkgJsonRequiredFields.forEach((field) => {
      expect(monorepoSubRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          `${Fixtures.badMonorepo.unnamedPkgMapData[0][1].root}/package.json`,
          ErrorMessage.PackageJsonMissingKey(field)
        )
      );
    });

    Constants.nonMonoRootPkgJsonRequiredFields.forEach((field) => {
      expect(polyrepoRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          `${Fixtures.badPolyrepo.root}/package.json`,
          ErrorMessage.PackageJsonMissingKey(field)
        )
      );
    });
  });

  it('errors when package.json does not contain certain fields except when in a monorepo root or if the "private" field is set to "true"', async () => {
    expect.hasAssertions();

    const monorepoRoot = await Linters.runProjectLinter({
      rootDir: Fixtures.badMonorepo.root
    });

    const monorepoSubRoot = await Linters.runProjectLinter({
      rootDir: Fixtures.badMonorepo.unnamedPkgMapData[0][1].root
    });

    const monorepoPrivateSubRoot = await Linters.runProjectLinter({
      rootDir: Fixtures.badMonorepo.unnamedPkgMapData[2][1].root
    });

    const polyrepoRoot = await Linters.runProjectLinter({
      rootDir: Fixtures.badPolyrepo.root
    });

    const polyrepoPrivateRoot = await Linters.runProjectLinter({
      rootDir: Fixtures.badPolyrepoPrivate.root
    });

    Constants.publicPkgJsonRequiredFields.forEach((field) => {
      expect(monorepoRoot.output).not.toStrictEqual(
        stringContainingErrorMessage(
          `${Fixtures.badMonorepo.root}/package.json`,
          ErrorMessage.PackageJsonMissingKey(field)
        )
      );
    });

    Constants.publicPkgJsonRequiredFields.forEach((field) => {
      expect(monorepoSubRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          `${Fixtures.badMonorepo.unnamedPkgMapData[0][1].root}/package.json`,
          ErrorMessage.PackageJsonMissingKey(field)
        )
      );
    });

    Constants.publicPkgJsonRequiredFields.forEach((field) => {
      expect(monorepoPrivateSubRoot.output).not.toStrictEqual(
        stringContainingErrorMessage(
          `${Fixtures.badMonorepo.unnamedPkgMapData[2][1].root}/package.json`,
          ErrorMessage.PackageJsonMissingKey(field)
        )
      );
    });

    Constants.publicPkgJsonRequiredFields.forEach((field) => {
      expect(polyrepoRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          `${Fixtures.badPolyrepo.root}/package.json`,
          ErrorMessage.PackageJsonMissingKey(field)
        )
      );
    });

    Constants.publicPkgJsonRequiredFields.forEach((field) => {
      expect(polyrepoPrivateRoot.output).not.toStrictEqual(
        stringContainingErrorMessage(
          `${Fixtures.badPolyrepoPrivate.root}/package.json`,
          ErrorMessage.PackageJsonMissingKey(field)
        )
      );
    });
  });

  it('errors when the same dependency appears under both "dependencies" and "devDependencies" fields in package.json', async () => {
    expect.hasAssertions();

    const monorepoRoot = await Linters.runProjectLinter({
      rootDir: Fixtures.badMonorepo.root
    });

    const monorepoSubRoot = await Linters.runProjectLinter({
      rootDir: Fixtures.badMonorepo.unnamedPkgMapData[3][1].root
    });

    const polyrepoRoot = await Linters.runProjectLinter({
      rootDir: Fixtures.badPolyrepo.root
    });

    expect(monorepoRoot.output).toStrictEqual(
      stringContainingErrorMessage(
        `${Fixtures.badMonorepo.root}/package.json`,
        ErrorMessage.PackageJsonDuplicateDependency('async')
      )
    );

    expect(monorepoSubRoot.output).toStrictEqual(
      stringContainingErrorMessage(
        `${Fixtures.badMonorepo.unnamedPkgMapData[3][1].root}/package.json`,
        ErrorMessage.PackageJsonDuplicateDependency('async')
      )
    );

    expect(polyrepoRoot.output).toStrictEqual(
      stringContainingErrorMessage(
        `${Fixtures.badPolyrepo.root}/package.json`,
        ErrorMessage.PackageJsonDuplicateDependency('async')
      )
    );
  });

  it('errors when package.json contains the "files" field but its array is missing necessary values', async () => {
    expect.hasAssertions();

    const monorepoRoot = await Linters.runProjectLinter({
      rootDir: Fixtures.badMonorepo.root
    });

    const monorepoSubRoot = await Linters.runProjectLinter({
      rootDir: Fixtures.badMonorepo.unnamedPkgMapData[9][1].root
    });

    const polyrepoRoot = await Linters.runProjectLinter({
      rootDir: Fixtures.badPolyrepo.root
    });

    Constants.pkgJsonRequiredFiles.forEach((field) => {
      expect(monorepoRoot.output).not.toStrictEqual(
        stringContainingErrorMessage(
          `${Fixtures.badMonorepo.root}/package.json`,
          ErrorMessage.PackageJsonMissingValue('files', field)
        )
      );

      expect(monorepoSubRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          `${Fixtures.badMonorepo.unnamedPkgMapData[9][1].root}/package.json`,
          ErrorMessage.PackageJsonMissingValue('files', field)
        )
      );
    });

    expect(polyrepoRoot.output).toStrictEqual(
      stringContainingErrorMessage(
        `${Fixtures.badPolyrepo.root}/package.json`,
        ErrorMessage.PackageJsonMissingKey('files')
      )
    );
  });

  it('errors when package.json "exports" field is missing self-referencing entry points', async () => {
    expect.hasAssertions();

    const monorepoSubRoot1 = await Linters.runProjectLinter({
      rootDir: Fixtures.badMonorepo.unnamedPkgMapData[5][1].root
    });

    const monorepoSubRoot2 = await Linters.runProjectLinter({
      rootDir: Fixtures.badMonorepo.unnamedPkgMapData[6][1].root
    });

    expect(monorepoSubRoot1.output).toStrictEqual(
      stringContainingErrorMessage(
        `${Fixtures.badMonorepo.unnamedPkgMapData[5][1].root}/package.json`,
        ErrorMessage.PackageJsonMissingEntryPoint('./package')
      )
    );

    expect(monorepoSubRoot1.output).toStrictEqual(
      stringContainingErrorMessage(
        `${Fixtures.badMonorepo.unnamedPkgMapData[5][1].root}/package.json`,
        ErrorMessage.PackageJsonMissingEntryPoint('./package.json')
      )
    );

    expect(monorepoSubRoot2.output).toStrictEqual(
      stringContainingErrorMessage(
        `${Fixtures.badMonorepo.unnamedPkgMapData[6][1].root}/package.json`,
        ErrorMessage.PackageJsonMissingEntryPoint('./package')
      )
    );

    expect(monorepoSubRoot2.output).toStrictEqual(
      stringContainingErrorMessage(
        `${Fixtures.badMonorepo.unnamedPkgMapData[6][1].root}/package.json`,
        ErrorMessage.PackageJsonMissingEntryPoint('./package.json')
      )
    );
  });

  it('errors when missing LICENSE or README.md files', async () => {
    expect.hasAssertions();

    const monorepoRoot = await Linters.runProjectLinter({
      rootDir: Fixtures.badMonorepo.root
    });

    const monorepoSubRoot = await Linters.runProjectLinter({
      rootDir: Fixtures.badMonorepo.unnamedPkgMapData[9][1].root
    });

    const polyrepoRoot = await Linters.runProjectLinter({
      rootDir: Fixtures.badPolyrepo.root
    });

    Constants.requiredFiles.forEach((file) => {
      expect(monorepoRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          `${Fixtures.badMonorepo.root}/${file}`,
          ErrorMessage.MissingFile()
        )
      );

      expect(monorepoSubRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          `${Fixtures.badMonorepo.unnamedPkgMapData[9][1].root}/${file}`,
          ErrorMessage.MissingFile()
        )
      );

      expect(polyrepoRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          `${Fixtures.badPolyrepo.root}/${file}`,
          ErrorMessage.MissingFile()
        )
      );
    });
  });

  it('errors when unpublished git commits have certain keywords in their subject', async () => {
    expect.hasAssertions();
    const commits: string[] = [];

    mockedRun.mockImplementation((_, args) => {
      if (args?.includes('A...B')) {
        commits.push(Math.random().toString(16).slice(2, 8));
        commits.push(Math.random().toString(16).slice(2, 8));
        return {
          stdout: `${commits.at(-2)} X Y Z\n${commits.at(-1)} A B C`
        } as unknown as ReturnType<typeof run>;
      } else {
        return {
          stdout: '## A...B\none two-three\nfour five-six'
        } as unknown as ReturnType<typeof run>;
      }
    });

    const monorepoRoot = await Linters.runProjectLinter({
      rootDir: Fixtures.badMonorepo.root
    });

    commits.forEach((commit) => {
      expect(monorepoRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          `git commit ${commit}`,
          ErrorMessage.CommitNeedsFixup()
        )
      );
    });
  });

  it('errors when any "exports" or "typesVersions" entry points in package.json point to files that do not exist', async () => {
    expect.hasAssertions();

    const monorepoSubRoot1 = await Linters.runProjectLinter({
      rootDir: Fixtures.badMonorepo.unnamedPkgMapData[6][1].root
    });

    const monorepoSubRoot2 = await Linters.runProjectLinter({
      rootDir: Fixtures.badMonorepo.unnamedPkgMapData[7][1].root
    });

    expect(monorepoSubRoot1.output).toStrictEqual(
      stringContainingErrorMessage(
        `${Fixtures.badMonorepo.unnamedPkgMapData[6][1].root}/package.json`,
        ErrorMessage.PackageJsonBadTypesEntryPoint(['*', '*'])
      )
    );

    expect(monorepoSubRoot2.output).toStrictEqual(
      stringContainingErrorMessage(
        `${Fixtures.badMonorepo.unnamedPkgMapData[7][1].root}/package.json`,
        ErrorMessage.PackageJsonBadTypesEntryPoint(['*', 'special.d.ts'])
      )
    );

    expect(monorepoSubRoot2.output).toStrictEqual(
      stringContainingErrorMessage(
        `${Fixtures.badMonorepo.unnamedPkgMapData[7][1].root}/package.json`,
        ErrorMessage.PackageJsonBadEntryPoint(['.', 'default'])
      )
    );

    expect(monorepoSubRoot2.output).toStrictEqual(
      stringContainingErrorMessage(
        `${Fixtures.badMonorepo.unnamedPkgMapData[7][1].root}/package.json`,
        ErrorMessage.PackageJsonBadEntryPoint(['.', 'node', 'custom'])
      )
    );

    expect(monorepoSubRoot2.output).toStrictEqual(
      stringContainingErrorMessage(
        `${Fixtures.badMonorepo.unnamedPkgMapData[7][1].root}/package.json`,
        ErrorMessage.PackageJsonBadEntryPoint(['./package'])
      )
    );
  });

  it('warns when missing certain tsconfig files in a polyrepo or monorepo root', async () => {
    expect.hasAssertions();
    // TODO: monorepo and polyrepo
  });

  it('warns when missing certain other tsconfig files in a monorepo sub-root', async () => {
    expect.hasAssertions();
    // TODO: monorepo and polyrepo
  });

  it('warns when package.json "license" field is not "MIT"', async () => {
    expect.hasAssertions();
    // TODO: monorepo and polyrepo
  });

  it('warns when package.json version field is experimental', async () => {
    expect.hasAssertions();
    // TODO: monorepo and polyrepo
  });

  it('warns when package.json contains outdated entry point fields', async () => {
    expect.hasAssertions();
    // TODO: monorepo and polyrepo
  });

  it('warns when package.json missing "engines.node" field', async () => {
    expect.hasAssertions();
    // TODO: monorepo and polyrepo
  });

  it('warns when package.json "engines.node" field is not maintained/LTS semver', async () => {
    expect.hasAssertions();
    // TODO: monorepo and polyrepo
  });

  it('warns when package.json contains a pinned dependency/devDependency', async () => {
    expect.hasAssertions();
    // TODO: monorepo and polyrepo
  });

  it('warns when package.json contains a dist-tag dependency/devDependency', async () => {
    expect.hasAssertions();
    // TODO: monorepo and polyrepo
  });

  it('warns when package.json "config.docs.entry" is missing', async () => {
    expect.hasAssertions();
    // TODO: monorepo and polyrepo
  });

  it('warns when README.md is missing topmatter', async () => {
    expect.hasAssertions();
    // TODO: monorepo and polyrepo
    // TODO: warn about unknown topmatter
    // TODO: ignore some known topmatter that isn't universally applicable
    // TODO: bundlephobia size and treeshakability badges are replaced
    // TODO:     (xunn.io size solution should cache result for 24 hours)
  });

  it('warns when README.md topmatter is incorrectly configured', async () => {
    expect.hasAssertions();
    // TODO: monorepo and polyrepo
  });

  it('warns when README.md is missing standard links', async () => {
    expect.hasAssertions();
    // TODO: monorepo and polyrepo
  });

  it('warns when README.md standard links are incorrectly configured', async () => {
    expect.hasAssertions();
    // TODO: monorepo and polyrepo
  });

  describe('(monorepo checks)', () => {
    it('errors when a sub-root package.json file is missing', async () => {
      expect.hasAssertions();

      const monorepo = await Linters.runProjectLinter({
        rootDir: Fixtures.badMonorepoNonPackageDir.root
      });

      Fixtures.badMonorepoNonPackageDir.brokenPkgRoots.forEach((pkgRoot) => {
        expect(monorepo.output).toStrictEqual(
          stringContainingErrorMessage(
            `${pkgRoot}/package.json`,
            ErrorMessage.MissingFile()
          )
        );
      });
    });

    it('errors when a sub-root package.json file is unparsable', async () => {
      expect.hasAssertions();

      const parse = JSON.parse;
      jest
        .spyOn(JSON, 'parse')
        .mockImplementationOnce((...args) => parse(...args))
        .mockImplementationOnce((...args) => parse(...args))
        .mockImplementationOnce(() => toss(new Error('badness')));

      await expect(
        Linters.runProjectLinter({ rootDir: Fixtures.goodMonorepo.root })
      ).resolves.toStrictEqual({
        success: false,
        summary: expect.stringContaining('1 error, 0 warnings'),
        output: stringContainingErrorMessage(
          `${Fixtures.goodMonorepo.namedPkgMapData[1][1].root}/package.json`,
          ErrorMessage.PackageJsonUnparsable()
        )
      });
    });

    it('errors if two sub-roots share the same name', async () => {
      expect.hasAssertions();

      const monorepo = await Linters.runProjectLinter({
        rootDir: Fixtures.badMonorepoDuplicateName.root
      });

      expect(monorepo.output).toStrictEqual(
        stringContainingErrorMessage(
          `${Fixtures.badMonorepoDuplicateName.root}/pkg/pkg-1`,
          ErrorMessage.DuplicatePackageName(
            'pkg',
            `${Fixtures.badMonorepoDuplicateName.root}/pkg/pkg-2`
          )
        )
      );

      expect(monorepo.output).toStrictEqual(
        stringContainingErrorMessage(
          `${Fixtures.badMonorepoDuplicateName.root}/pkg/pkg-2`,
          ErrorMessage.DuplicatePackageName(
            'pkg',
            `${Fixtures.badMonorepoDuplicateName.root}/pkg/pkg-1`
          )
        )
      );
    });

    it('errors if two unnamed sub-roots share the same package-id', async () => {
      expect.hasAssertions();

      const monorepo = await Linters.runProjectLinter({
        rootDir: Fixtures.badMonorepoDuplicateId.root
      });

      expect(monorepo.output).toStrictEqual(
        stringContainingErrorMessage(
          `${Fixtures.badMonorepoDuplicateId.root}/packages-1/pkg-1`,
          ErrorMessage.DuplicatePackageId(
            'pkg-1',
            `${Fixtures.badMonorepoDuplicateId.root}/packages-2/pkg-1`
          )
        )
      );

      expect(monorepo.output).toStrictEqual(
        stringContainingErrorMessage(
          `${Fixtures.badMonorepoDuplicateId.root}/packages-2/pkg-1`,
          ErrorMessage.DuplicatePackageId(
            'pkg-1',
            `${Fixtures.badMonorepoDuplicateId.root}/packages-1/pkg-1`
          )
        )
      );
    });
  });

  describe('(non-sub-root checks)', () => {
    it('warns when missing certain tooling/configuration files', async () => {
      expect.hasAssertions();
      // TODO: monorepo root and polyrepo but does NOT fail on sub-roots
    });

    it('warns when missing release.config.js unless "private" field is set to "true"', async () => {
      expect.hasAssertions();
      // TODO: monorepo root and polyrepo but does NOT fail on sub-roots
    });

    it('warns when missing GitHub tooling directories', async () => {
      expect.hasAssertions();
      // TODO: monorepo root and polyrepo but does NOT fail on sub-roots
    });

    it('warns when SECURITY.md or .github/SUPPORT.md are missing topmatter', async () => {
      expect.hasAssertions();
      // TODO: monorepo root and polyrepo but does NOT fail on sub-roots
      // TODO: warn about unknown topmatter
      // TODO: ignore some known topmatter that isn't universally applicable
      // TODO: bundlephobia size and treeshakability badges are replaced
      // TODO:     (xunn.io size solution should cache result for 24 hours)
    });

    it('warns when SECURITY.md or .github/SUPPORT.md topmatter is incorrectly configured', async () => {
      expect.hasAssertions();
      // TODO: monorepo root and polyrepo but does NOT fail on sub-roots
    });

    it('warns when CONTRIBUTING.md, SECURITY.md, or .github/SUPPORT.md are missing standard links', async () => {
      expect.hasAssertions();
      // TODO: monorepo root and polyrepo but does NOT fail on sub-roots
    });

    it('warns when CONTRIBUTING.md, SECURITY.md, or .github/SUPPORT.md standard links are incorrectly configured', async () => {
      expect.hasAssertions();
      // TODO: monorepo root and polyrepo but does NOT fail on sub-roots
    });
  });

  describe('(monorepo root checks)', () => {
    it('warns when package.json contains "dependencies" or "version" fields unless a next.config.js file exists', async () => {
      expect.hasAssertions();
      // TODO: monorepo root but does NOT fail on polyrepo or sub-roots
    });

    it('correctly detects, collates, and counts warnings and errors across entire monorepo', async () => {
      expect.hasAssertions();
      // TODO: monorepo (amalgum) but NOT fail on ok sub-root
      // TODO: Use snapshots + error/warning count
      // TODO: 0 warnings/errors on good monorepo
    });
  });

  describe('(sub-root checks)', () => {
    it('errors when sub-root code imports another sub-root without also listing it under "dependency" in package.json', async () => {
      expect.hasAssertions();
      // TODO: sub-root but does NOT fail on monorepo root or polyrepo. However,
      // TODO: does NOT error on unlisted self-referential imports
    });

    it('warns when package.json contains "devDependencies" field', async () => {
      expect.hasAssertions();
      // TODO: sub-root but does NOT fail on monorepo root or polyrepo
    });

    it('correctly detects, collates, and counts warnings and errors from a single sub-root', async () => {
      expect.hasAssertions();
      // TODO: monorepo (amalgum) but NOT fail on ok sub-root
      // TODO: Use snapshots + error/warning count
      // TODO: 0 warnings/errors on good monorepo
    });
  });

  it('only executes certain checks when in pre-push mode', async () => {
    expect.hasAssertions();
    // TODO: monorepo and polyrepo (both amalgum)
  });

  it('correctly detects, collates, and counts warnings and errors in polyrepo', async () => {
    expect.hasAssertions();
    // TODO: polyrepo (amalgum)
    // TODO: Use snapshots + error/warning count
    // TODO: 0 warnings/errors on good polyrepo
  });
});

describe('::runTypescriptLinter', () => {
  it('correctly parses different combinations of error and warning messages', async () => {
    expect.hasAssertions();
    // TODO: Including no message and non-parsable message + success == false
  });
});

describe('::runEslintLinter', () => {
  it('correctly parses different combinations of error and warning messages', async () => {
    expect.hasAssertions();
    // TODO: Including no message and non-parsable message + success == false
  });
});

describe('::runRemarkLinter', () => {
  it('correctly parses different combinations of error and warning messages', async () => {
    expect.hasAssertions();
    // TODO: Including no message and non-parsable message + success == false
  });
});
