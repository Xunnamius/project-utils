import * as Linters from '../src/linters';
import * as Constants from '../src/constants';
import { Fixtures } from 'testverse/fixtures';
import { toss } from 'toss-expression';
import { ErrorMessage } from '../src/errors';
import { clearPackageJsonCache } from 'pkgverse/core/src/project-utils';
import { asMockedFunction } from '@xunnamius/jest-types';
import { run, RunReturnType } from 'multiverse/run';
import escapeRegexp from 'escape-string-regexp';
// ? Secretly an ES module, but mocked as a CJS module
import { fromMarkdown } from 'mdast-util-from-markdown';

jest.mock('multiverse/run');

jest.mock('mdast-util-from-markdown', () => {
  return {
    fromMarkdown: jest.fn(),
    __esModule: true
  };
});

jest.mock('fs/promises', () => {
  const fs = jest.requireActual('fs/promises');
  return {
    ...fs,
    readFile: jest.fn().mockImplementation(fs.readFile)
  };
});

const stringContainingErrorMessage = (currentFile: string, errorMessage: string) => {
  return expect.stringMatching(
    RegExp(
      `^.*${escapeRegexp(currentFile)}(?!/).*(?:\n  .*?)+ ${escapeRegexp(errorMessage)}$`,
      'm'
    )
  );
};

const actualRun = jest.requireActual('multiverse/run').run;
const mockMdastReadmePolyrepo = require('testverse/fixtures/mdast.readme-polyrepo');
const mockMdastReadmeMonorepo = require('testverse/fixtures/mdast.readme-monorepo');
const mockMdastReadmeSubroot = require('testverse/fixtures/mdast.readme-subroot');
const mockMdastSecurity = require('testverse/fixtures/mdast.security');
const mockMdastContributing = require('testverse/fixtures/mdast.contributing');
const mockMdastSupport = require('testverse/fixtures/mdast.support');
const mockedRun = asMockedFunction(run);
const mockedFromMarkdown = asMockedFunction(fromMarkdown);

beforeEach(() => {
  mockedRun.mockImplementation(() =>
    Promise.resolve({ stdout: '' } as unknown as RunReturnType)
  );
  mockedFromMarkdown.mockImplementation(() => ({ type: 'root', children: [] }));
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

    const polyrepoRoot1 = await Linters.runProjectLinter({
      rootDir: Fixtures.badPolyrepoExports.root
    });

    const polyrepoRoot2 = await Linters.runProjectLinter({
      rootDir: Fixtures.badPolyrepoExports2.root
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

    expect(polyrepoRoot1.output).toStrictEqual(
      stringContainingErrorMessage(
        `${Fixtures.badPolyrepoExports.root}/package.json`,
        ErrorMessage.PackageJsonMissingEntryPoint('./package')
      )
    );

    expect(polyrepoRoot1.output).toStrictEqual(
      stringContainingErrorMessage(
        `${Fixtures.badPolyrepoExports.root}/package.json`,
        ErrorMessage.PackageJsonMissingEntryPoint('./package.json')
      )
    );

    expect(polyrepoRoot2.output).toStrictEqual(
      stringContainingErrorMessage(
        `${Fixtures.badPolyrepoExports2.root}/package.json`,
        ErrorMessage.PackageJsonMissingEntryPoint('./package')
      )
    );

    expect(polyrepoRoot2.output).toStrictEqual(
      stringContainingErrorMessage(
        `${Fixtures.badPolyrepoExports2.root}/package.json`,
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

    const polyrepoRoot1 = await Linters.runProjectLinter({
      rootDir: Fixtures.badPolyrepoExports2.root
    });

    const polyrepoRoot2 = await Linters.runProjectLinter({
      rootDir: Fixtures.badPolyrepoExports3.root
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

    expect(polyrepoRoot1.output).toStrictEqual(
      stringContainingErrorMessage(
        `${Fixtures.badPolyrepoExports2.root}/package.json`,
        ErrorMessage.PackageJsonBadTypesEntryPoint(['*', '*'])
      )
    );

    expect(polyrepoRoot2.output).toStrictEqual(
      stringContainingErrorMessage(
        `${Fixtures.badPolyrepoExports3.root}/package.json`,
        ErrorMessage.PackageJsonBadTypesEntryPoint(['*', 'special.d.ts'])
      )
    );

    expect(polyrepoRoot2.output).toStrictEqual(
      stringContainingErrorMessage(
        `${Fixtures.badPolyrepoExports3.root}/package.json`,
        ErrorMessage.PackageJsonBadEntryPoint(['.', 'default'])
      )
    );

    expect(polyrepoRoot2.output).toStrictEqual(
      stringContainingErrorMessage(
        `${Fixtures.badPolyrepoExports3.root}/package.json`,
        ErrorMessage.PackageJsonBadEntryPoint(['.', 'node', 'custom'])
      )
    );

    expect(polyrepoRoot2.output).toStrictEqual(
      stringContainingErrorMessage(
        `${Fixtures.badPolyrepoExports3.root}/package.json`,
        ErrorMessage.PackageJsonBadEntryPoint(['./package'])
      )
    );
  });

  it('warns when missing certain tsconfig files in a polyrepo or monorepo root', async () => {
    expect.hasAssertions();

    const monorepoRoot = await Linters.runProjectLinter({
      rootDir: Fixtures.badMonorepo.root
    });

    const polyrepoRoot = await Linters.runProjectLinter({
      rootDir: Fixtures.badPolyrepo.root
    });

    Constants.monorepoRootTsconfigFiles.forEach((file) => {
      expect(monorepoRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          `${Fixtures.badMonorepo.root}/${file}`,
          ErrorMessage.MissingFile()
        )
      );
    });

    Constants.polyrepoTsconfigFiles.forEach((file) => {
      expect(polyrepoRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          `${Fixtures.badPolyrepo.root}/${file}`,
          ErrorMessage.MissingFile()
        )
      );
    });
  });

  it('warns when missing certain other tsconfig files in a monorepo sub-root', async () => {
    expect.hasAssertions();

    const monorepoSubRoot = await Linters.runProjectLinter({
      rootDir: Fixtures.badMonorepo.unnamedPkgMapData[0][1].root
    });

    Constants.subRootTsconfigFiles.forEach((file) => {
      expect(monorepoSubRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          `${Fixtures.badMonorepo.unnamedPkgMapData[0][1].root}/${file}`,
          ErrorMessage.MissingFile()
        )
      );
    });
  });

  it('warns when package.json "license" field is not "MIT"', async () => {
    expect.hasAssertions();

    const monorepoRoot = await Linters.runProjectLinter({
      rootDir: Fixtures.badMonorepo.root
    });

    const polyrepoRoot = await Linters.runProjectLinter({
      rootDir: Fixtures.badPolyrepoLicense.root
    });

    expect(monorepoRoot.output).toStrictEqual(
      stringContainingErrorMessage(
        `${Fixtures.badMonorepo.unnamedPkgMapData[11][1].root}/package.json`,
        ErrorMessage.PackageJsonMissingValue('license', Constants.pkgJsonLicense)
      )
    );

    expect(polyrepoRoot.output).toStrictEqual(
      stringContainingErrorMessage(
        `${Fixtures.badPolyrepoLicense.root}/package.json`,
        ErrorMessage.PackageJsonMissingValue('license', Constants.pkgJsonLicense)
      )
    );
  });

  it('warns when package.json version field is experimental', async () => {
    expect.hasAssertions();

    const monorepoRoot = await Linters.runProjectLinter({
      rootDir: Fixtures.badMonorepo.root
    });

    const monorepoSubRoot1 = await Linters.runProjectLinter({
      rootDir: Fixtures.badMonorepo.unnamedPkgMapData[12][1].root
    });

    const monorepoSubRoot2 = await Linters.runProjectLinter({
      rootDir: Fixtures.badMonorepo.unnamedPkgMapData[13][1].root
    });

    const polyrepoRoot1 = await Linters.runProjectLinter({
      rootDir: Fixtures.badPolyrepoVersion1.root
    });

    const polyrepoRoot2 = await Linters.runProjectLinter({
      rootDir: Fixtures.badPolyrepoVersion2.root
    });

    const goodMonorepoRoot = await Linters.runProjectLinter({
      rootDir: Fixtures.goodMonorepo.root
    });

    expect(monorepoRoot.output).not.toStrictEqual(
      stringContainingErrorMessage(
        `${Fixtures.badMonorepo.root}/package.json`,
        ErrorMessage.PackageJsonExperimentalVersion()
      )
    );

    expect(monorepoSubRoot1.output).toStrictEqual(
      stringContainingErrorMessage(
        `${Fixtures.badMonorepo.unnamedPkgMapData[12][1].root}/package.json`,
        ErrorMessage.PackageJsonExperimentalVersion()
      )
    );

    expect(monorepoSubRoot2.output).toStrictEqual(
      stringContainingErrorMessage(
        `${Fixtures.badMonorepo.unnamedPkgMapData[13][1].root}/package.json`,
        ErrorMessage.PackageJsonExperimentalVersion()
      )
    );

    expect(polyrepoRoot1.output).toStrictEqual(
      stringContainingErrorMessage(
        `${Fixtures.badPolyrepoVersion1.root}/package.json`,
        ErrorMessage.PackageJsonExperimentalVersion()
      )
    );

    expect(polyrepoRoot2.output).toStrictEqual(
      stringContainingErrorMessage(
        `${Fixtures.badPolyrepoVersion2.root}/package.json`,
        ErrorMessage.PackageJsonExperimentalVersion()
      )
    );

    expect(goodMonorepoRoot.output).not.toStrictEqual(
      stringContainingErrorMessage(
        `${Fixtures.goodMonorepo.root}/package.json`,
        ErrorMessage.PackageJsonExperimentalVersion()
      )
    );
  });

  it('warns when package.json contains outdated entry point fields', async () => {
    expect.hasAssertions();

    const monorepoSubRoot = await Linters.runProjectLinter({
      rootDir: Fixtures.badMonorepo.unnamedPkgMapData[8][1].root
    });

    const polyrepoRoot = await Linters.runProjectLinter({
      rootDir: Fixtures.badPolyrepoExportsOutdated.root
    });

    Constants.pkgJsonObsoleteEntryKeys.forEach((key) => {
      expect(monorepoSubRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          `${Fixtures.badMonorepo.unnamedPkgMapData[8][1].root}/package.json`,
          ErrorMessage.PackageJsonObsoleteKey(key)
        )
      );

      expect(polyrepoRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          `${Fixtures.badPolyrepoExportsOutdated.root}/package.json`,
          ErrorMessage.PackageJsonObsoleteKey(key)
        )
      );
    });
  });

  it('warns when package.json missing "engines.node" field', async () => {
    expect.hasAssertions();

    const monorepoSubRoot = await Linters.runProjectLinter({
      rootDir: Fixtures.badMonorepo.unnamedPkgMapData[14][1].root
    });

    const polyrepoRoot = await Linters.runProjectLinter({
      rootDir: Fixtures.badPolyrepoEngines2.root
    });

    expect(monorepoSubRoot.output).toStrictEqual(
      stringContainingErrorMessage(
        `${Fixtures.badMonorepo.unnamedPkgMapData[14][1].root}/package.json`,
        ErrorMessage.PackageJsonMissingKey('engines.node')
      )
    );

    expect(polyrepoRoot.output).toStrictEqual(
      stringContainingErrorMessage(
        `${Fixtures.badPolyrepoEngines2.root}/package.json`,
        ErrorMessage.PackageJsonMissingKey('engines.node')
      )
    );
  });

  it('warns when package.json "engines.node" field is not expected semver', async () => {
    expect.hasAssertions();

    const monorepoSubRoot = await Linters.runProjectLinter({
      rootDir: Fixtures.badMonorepo.unnamedPkgMapData[4][1].root
    });

    const polyrepoRoot = await Linters.runProjectLinter({
      rootDir: Fixtures.badPolyrepoEngines.root
    });

    const engines = Linters.getExpectedNodeEngines();

    expect(monorepoSubRoot.output).toStrictEqual(
      stringContainingErrorMessage(
        `${Fixtures.badMonorepo.unnamedPkgMapData[4][1].root}/package.json`,
        ErrorMessage.PackageJsonBadEngine(engines)
      )
    );

    expect(polyrepoRoot.output).toStrictEqual(
      stringContainingErrorMessage(
        `${Fixtures.badPolyrepoEngines.root}/package.json`,
        ErrorMessage.PackageJsonBadEngine(engines)
      )
    );
  });

  it('warns when package.json contains a pinned dependency/devDependency', async () => {
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
        ErrorMessage.PackageJsonPinnedDependency('chalk')
      )
    );

    expect(monorepoSubRoot.output).toStrictEqual(
      stringContainingErrorMessage(
        `${Fixtures.badMonorepo.unnamedPkgMapData[3][1].root}/package.json`,
        ErrorMessage.PackageJsonPinnedDependency('chalk')
      )
    );

    expect(polyrepoRoot.output).toStrictEqual(
      stringContainingErrorMessage(
        `${Fixtures.badPolyrepo.root}/package.json`,
        ErrorMessage.PackageJsonPinnedDependency('chalk')
      )
    );
  });

  it('warns when package.json contains a dist-tag dependency/devDependency', async () => {
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
        ErrorMessage.PackageJsonNonSemverDependency('jest')
      )
    );

    expect(monorepoSubRoot.output).toStrictEqual(
      stringContainingErrorMessage(
        `${Fixtures.badMonorepo.unnamedPkgMapData[3][1].root}/package.json`,
        ErrorMessage.PackageJsonNonSemverDependency('jest')
      )
    );

    expect(polyrepoRoot.output).toStrictEqual(
      stringContainingErrorMessage(
        `${Fixtures.badPolyrepo.root}/package.json`,
        ErrorMessage.PackageJsonNonSemverDependency('jest')
      )
    );
  });

  it('warns when package.json "config.docs.entry" is missing', async () => {
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

    expect(monorepoRoot.output).not.toStrictEqual(
      stringContainingErrorMessage(
        `${Fixtures.badMonorepo.root}/package.json`,
        ErrorMessage.PackageJsonMissingKey('config.docs.entry')
      )
    );

    expect(monorepoSubRoot.output).toStrictEqual(
      stringContainingErrorMessage(
        `${Fixtures.badMonorepo.unnamedPkgMapData[0][1].root}/package.json`,
        ErrorMessage.PackageJsonMissingKey('config.docs.entry')
      )
    );

    expect(polyrepoRoot.output).toStrictEqual(
      stringContainingErrorMessage(
        `${Fixtures.badPolyrepo.root}/package.json`,
        ErrorMessage.PackageJsonMissingKey('config.docs.entry')
      )
    );
  });

  it('warns when package.json "config.docs.entry" is points to a non-existent path', async () => {
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

    expect(monorepoRoot.output).not.toStrictEqual(
      stringContainingErrorMessage(
        `${Fixtures.badMonorepo.root}/package.json`,
        ErrorMessage.PackageJsonMissingKey('config.docs.entry')
      )
    );

    expect(monorepoSubRoot.output).toStrictEqual(
      stringContainingErrorMessage(
        `${Fixtures.badMonorepo.unnamedPkgMapData[0][1].root}/package.json`,
        ErrorMessage.PackageJsonMissingKey('config.docs.entry')
      )
    );

    expect(polyrepoRoot.output).toStrictEqual(
      stringContainingErrorMessage(
        `${Fixtures.badPolyrepo.root}/package.json`,
        ErrorMessage.PackageJsonMissingKey('config.docs.entry')
      )
    );
  });

  it('warns when README.md is missing topmatter', async () => {
    expect.hasAssertions();

    const monorepoRoot = await Linters.runProjectLinter({
      rootDir: Fixtures.badMonorepoEmptyMdFiles.root
    });

    const monorepoSubRoot = await Linters.runProjectLinter({
      rootDir: Fixtures.badMonorepoEmptyMdFiles.unnamedPkgMapData[0][1].root
    });

    const polyrepoRoot = await Linters.runProjectLinter({
      rootDir: Fixtures.badPolyrepoEmptyMdFiles.root
    });

    expect(monorepoRoot.output).toStrictEqual(
      stringContainingErrorMessage(
        `${Fixtures.badMonorepoEmptyMdFiles.root}/README.md`,
        ErrorMessage.MarkdownMissingTopmatter()
      )
    );

    expect(monorepoSubRoot.output).toStrictEqual(
      stringContainingErrorMessage(
        `${Fixtures.badMonorepoEmptyMdFiles.unnamedPkgMapData[0][1].root}/README.md`,
        ErrorMessage.MarkdownMissingTopmatter()
      )
    );

    expect(polyrepoRoot.output).toStrictEqual(
      stringContainingErrorMessage(
        `${Fixtures.badPolyrepoEmptyMdFiles.root}/README.md`,
        ErrorMessage.MarkdownMissingTopmatter()
      )
    );

    // TODO: bundlephobia size and treeshakability badges are replaced
    // TODO:     (xunn.io size solution should cache result for 24 hours)
  });

  it('warns when README.md has unknown or out-of-context topmatter', async () => {
    expect.hasAssertions();
    // TODO: monorepo and polyrepo
  });

  it('warns when README.md topmatter is incorrectly configured', async () => {
    expect.hasAssertions();
    // TODO: monorepo and polyrepo
  });

  it('ignores when README.md has non-universal topmatter', async () => {
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

  describe('(monorepo-specific checks)', () => {
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

  describe('(non-sub-root-specific checks)', () => {
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

  describe('(monorepo-root-specific checks)', () => {
    it('warns when package.json "name" field is missing', async () => {
      expect.hasAssertions();
    });

    it('warns when package.json is missing "private" field or when "private" is not "true"', async () => {
      expect.hasAssertions();
    });

    it('warns when package.json contains "dependencies" field unless a next.config.js file exists', async () => {
      expect.hasAssertions();
    });

    it('warns when package.json contains non-whitelisted "version" fields unless a next.config.js file exists', async () => {
      expect.hasAssertions();

      const monorepoRoot = await Linters.runProjectLinter({
        rootDir: Fixtures.badMonorepo.root
      });

      const monorepoRoot2 = await Linters.runProjectLinter({
        rootDir: Fixtures.goodMonorepo.root
      });

      const monorepoRoot3 = await Linters.runProjectLinter({
        rootDir: Fixtures.goodMonorepoVersion.root
      });

      const monorepoSubRoot = await Linters.runProjectLinter({
        rootDir: Fixtures.badMonorepo.unnamedPkgMapData[12][1].root
      });

      const polyrepoRoot = await Linters.runProjectLinter({
        rootDir: Fixtures.goodPolyrepo.root
      });

      expect(monorepoRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          `${Fixtures.badMonorepo.root}/package.json`,
          ErrorMessage.PackageJsonIllegalKey('version')
        )
      );

      expect(monorepoRoot2.output).toStrictEqual(
        stringContainingErrorMessage(
          `${Fixtures.goodMonorepo.root}/package.json`,
          ErrorMessage.PackageJsonIllegalKey('version')
        )
      );

      expect(monorepoRoot3.output).not.toStrictEqual(
        stringContainingErrorMessage(
          `${Fixtures.goodMonorepoVersion.root}/package.json`,
          ErrorMessage.PackageJsonIllegalKey('version')
        )
      );

      expect(monorepoSubRoot.output).not.toStrictEqual(
        stringContainingErrorMessage(
          `${Fixtures.badMonorepo.unnamedPkgMapData[12][1].root}/package.json`,
          ErrorMessage.PackageJsonIllegalKey('version')
        )
      );

      expect(polyrepoRoot.output).not.toStrictEqual(
        stringContainingErrorMessage(
          `${Fixtures.goodPolyrepo.root}/package.json`,
          ErrorMessage.PackageJsonIllegalKey('version')
        )
      );
    });

    it('correctly detects, collates, and counts warnings and errors across entire monorepo', async () => {
      expect.hasAssertions();
      // TODO: monorepo (amalgum) but NOT fail on ok sub-root
      // TODO: Use snapshots + error/warning count
      // TODO: 0 warnings/errors on good monorepo
    });
  });

  describe('(sub-root-specific checks)', () => {
    it('warns when package.json "config.codecov.flag" is missing', async () => {
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

      expect(monorepoRoot.output).not.toStrictEqual(
        stringContainingErrorMessage(
          `${Fixtures.badMonorepo.root}/package.json`,
          ErrorMessage.PackageJsonMissingKey('config.codecov.flag')
        )
      );

      expect(monorepoSubRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          `${Fixtures.badMonorepo.unnamedPkgMapData[0][1].root}/package.json`,
          ErrorMessage.PackageJsonMissingKey('config.codecov.flag')
        )
      );

      expect(polyrepoRoot.output).not.toStrictEqual(
        stringContainingErrorMessage(
          `${Fixtures.badPolyrepo.root}/package.json`,
          ErrorMessage.PackageJsonMissingKey('config.codecov.flag')
        )
      );
    });

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
