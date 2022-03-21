/* eslint-disable jest/no-conditional-expect */
import * as Linters from '../src/linters';
import * as Constants from '../src/constants';
import * as Utils from '../src/utils';
import * as Core from 'pkgverse/core/src/project-utils';
import fs from 'fs/promises';
import { Fixtures } from 'testverse/fixtures';
import { toss } from 'toss-expression';
import { ErrorMessage } from '../src/errors';
import { clearPackageJsonCache } from 'pkgverse/core/src/project-utils';
import { asMockedFunction } from '@xunnamius/jest-types';
import { run, RunReturnType } from 'multiverse/run';
import escapeRegexp from 'escape-string-regexp';
// ? Secretly an ES module, but mocked as a CJS module
import { fromMarkdown } from 'mdast-util-from-markdown';

import type { PathLike } from 'fs';

jest.mock('multiverse/run');

jest.mock('mdast-util-from-markdown', () => {
  return {
    fromMarkdown: jest.fn(),
    __esModule: true
  };
});

const stringContainingErrorMessage = (
  type: Utils.ReportType,
  currentFile: string,
  errorMessage: string
) => {
  return expect.stringMatching(
    RegExp(
      `^.*${escapeRegexp(currentFile)}(?!/).*(?:\n  .*?)*(?:\n  .*?${
        type == 'warn' ? 'warn' : 'ERR!'
      }.*?) ${escapeRegexp(errorMessage)}$`,
      'm'
    )
  );
};

const actualRun = jest.requireActual('multiverse/run').run;
const mockMdastReadmeMonorepo = require('testverse/fixtures/mdast.readme-monorepo');
const mockMdastReadmeMonorepoOOOrder = require('testverse/fixtures/mdast.readme-monorepo-ooo');
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

test('markdown blueprints end with a colon (and not a new line)', async () => {
  expect.hasAssertions();

  (
    await Promise.all([
      fs.readFile(`${__dirname}/../src/blueprint-contributing.md.txt`, {
        encoding: 'utf-8'
      }),
      fs.readFile(`${__dirname}/../src/blueprint-security.md.txt`, { encoding: 'utf-8' }),
      fs.readFile(`${__dirname}/../src/blueprint-support.md.txt`, { encoding: 'utf-8' })
    ])
  ).forEach((blueprint) => {
    expect(blueprint).toEndWith(':');
  });
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
        'error',
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
        'error',
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
        'error',
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
        'error',
        `${Fixtures.badMonorepo.unnamedPkgMapData[1][1].root}/dist/tsconfig.fake.tsbuildinfo`,
        ErrorMessage.IllegalItemInDirectory(
          `${Fixtures.badMonorepo.unnamedPkgMapData[1][1].root}/dist`
        )
      )
    );

    expect(monorepo.output).toStrictEqual(
      stringContainingErrorMessage(
        'error',
        `${Fixtures.badMonorepo.unnamedPkgMapData[1][1].root}/dist/sub-dir/tsconfig.fake2.tsbuildinfo`,
        ErrorMessage.IllegalItemInDirectory(
          `${Fixtures.badMonorepo.unnamedPkgMapData[1][1].root}/dist`
        )
      )
    );

    expect(polyrepo.output).toStrictEqual(
      stringContainingErrorMessage(
        'error',
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

    Constants.globalPkgJsonRequiredFields.forEach((field) => {
      // ? Works when linting a monorepo root
      expect(monorepoRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          'error',
          `${Fixtures.badMonorepo.root}/package.json`,
          ErrorMessage.PackageJsonMissingKey(field)
        )
      );

      // ? Works when linting a sub-root explicitly
      expect(monorepoSubRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          'error',
          `${Fixtures.badMonorepo.unnamedPkgMapData[0][1].root}/package.json`,
          ErrorMessage.PackageJsonMissingKey(field)
        )
      );

      // ? Works when linting a polyrepo root
      expect(polyrepoRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          'error',
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
          'error',
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
          'error',
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
          'error',
          `${Fixtures.badMonorepo.root}/package.json`,
          ErrorMessage.PackageJsonMissingKey(field)
        )
      );
    });

    Constants.nonMonoRootPkgJsonRequiredFields.forEach((field) => {
      expect(monorepoSubRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          'error',
          `${Fixtures.badMonorepo.unnamedPkgMapData[0][1].root}/package.json`,
          ErrorMessage.PackageJsonMissingKey(field)
        )
      );
    });

    Constants.nonMonoRootPkgJsonRequiredFields.forEach((field) => {
      expect(polyrepoRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          'error',
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
          'error',
          `${Fixtures.badMonorepo.root}/package.json`,
          ErrorMessage.PackageJsonMissingKey(field)
        )
      );
    });

    Constants.publicPkgJsonRequiredFields.forEach((field) => {
      expect(monorepoSubRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          'error',
          `${Fixtures.badMonorepo.unnamedPkgMapData[0][1].root}/package.json`,
          ErrorMessage.PackageJsonMissingKey(field)
        )
      );
    });

    Constants.publicPkgJsonRequiredFields.forEach((field) => {
      expect(monorepoPrivateSubRoot.output).not.toStrictEqual(
        stringContainingErrorMessage(
          'error',
          `${Fixtures.badMonorepo.unnamedPkgMapData[2][1].root}/package.json`,
          ErrorMessage.PackageJsonMissingKey(field)
        )
      );
    });

    Constants.publicPkgJsonRequiredFields.forEach((field) => {
      expect(polyrepoRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          'error',
          `${Fixtures.badPolyrepo.root}/package.json`,
          ErrorMessage.PackageJsonMissingKey(field)
        )
      );
    });

    Constants.publicPkgJsonRequiredFields.forEach((field) => {
      expect(polyrepoPrivateRoot.output).not.toStrictEqual(
        stringContainingErrorMessage(
          'error',
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
        'error',
        `${Fixtures.badMonorepo.root}/package.json`,
        ErrorMessage.PackageJsonDuplicateDependency('async')
      )
    );

    expect(monorepoSubRoot.output).toStrictEqual(
      stringContainingErrorMessage(
        'error',
        `${Fixtures.badMonorepo.unnamedPkgMapData[3][1].root}/package.json`,
        ErrorMessage.PackageJsonDuplicateDependency('async')
      )
    );

    expect(polyrepoRoot.output).toStrictEqual(
      stringContainingErrorMessage(
        'error',
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
          'error',
          `${Fixtures.badMonorepo.root}/package.json`,
          ErrorMessage.PackageJsonMissingValue('files', field)
        )
      );

      expect(monorepoSubRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          'error',
          `${Fixtures.badMonorepo.unnamedPkgMapData[9][1].root}/package.json`,
          ErrorMessage.PackageJsonMissingValue('files', field)
        )
      );
    });

    expect(polyrepoRoot.output).toStrictEqual(
      stringContainingErrorMessage(
        'error',
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
        'error',
        `${Fixtures.badMonorepo.unnamedPkgMapData[5][1].root}/package.json`,
        ErrorMessage.PackageJsonMissingEntryPoint('./package')
      )
    );

    expect(monorepoSubRoot1.output).toStrictEqual(
      stringContainingErrorMessage(
        'error',
        `${Fixtures.badMonorepo.unnamedPkgMapData[5][1].root}/package.json`,
        ErrorMessage.PackageJsonMissingEntryPoint('./package.json')
      )
    );

    expect(monorepoSubRoot2.output).toStrictEqual(
      stringContainingErrorMessage(
        'error',
        `${Fixtures.badMonorepo.unnamedPkgMapData[6][1].root}/package.json`,
        ErrorMessage.PackageJsonMissingEntryPoint('./package')
      )
    );

    expect(monorepoSubRoot2.output).toStrictEqual(
      stringContainingErrorMessage(
        'error',
        `${Fixtures.badMonorepo.unnamedPkgMapData[6][1].root}/package.json`,
        ErrorMessage.PackageJsonMissingEntryPoint('./package.json')
      )
    );

    expect(polyrepoRoot1.output).toStrictEqual(
      stringContainingErrorMessage(
        'error',
        `${Fixtures.badPolyrepoExports.root}/package.json`,
        ErrorMessage.PackageJsonMissingEntryPoint('./package')
      )
    );

    expect(polyrepoRoot1.output).toStrictEqual(
      stringContainingErrorMessage(
        'error',
        `${Fixtures.badPolyrepoExports.root}/package.json`,
        ErrorMessage.PackageJsonMissingEntryPoint('./package.json')
      )
    );

    expect(polyrepoRoot2.output).toStrictEqual(
      stringContainingErrorMessage(
        'error',
        `${Fixtures.badPolyrepoExports2.root}/package.json`,
        ErrorMessage.PackageJsonMissingEntryPoint('./package')
      )
    );

    expect(polyrepoRoot2.output).toStrictEqual(
      stringContainingErrorMessage(
        'error',
        `${Fixtures.badPolyrepoExports2.root}/package.json`,
        ErrorMessage.PackageJsonMissingEntryPoint('./package.json')
      )
    );
  });

  it('errors when missing required files', async () => {
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
          'error',
          `${Fixtures.badMonorepo.root}/${file}`,
          ErrorMessage.MissingFile()
        )
      );

      expect(monorepoSubRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          'error',
          `${Fixtures.badMonorepo.unnamedPkgMapData[9][1].root}/${file}`,
          ErrorMessage.MissingFile()
        )
      );

      expect(polyrepoRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          'error',
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
          'error',
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
        'error',
        `${Fixtures.badMonorepo.unnamedPkgMapData[6][1].root}/package.json`,
        ErrorMessage.PackageJsonBadTypesEntryPoint(['*', '*'])
      )
    );

    expect(monorepoSubRoot2.output).toStrictEqual(
      stringContainingErrorMessage(
        'error',
        `${Fixtures.badMonorepo.unnamedPkgMapData[7][1].root}/package.json`,
        ErrorMessage.PackageJsonBadTypesEntryPoint(['*', 'special.d.ts'])
      )
    );

    expect(monorepoSubRoot2.output).toStrictEqual(
      stringContainingErrorMessage(
        'error',
        `${Fixtures.badMonorepo.unnamedPkgMapData[7][1].root}/package.json`,
        ErrorMessage.PackageJsonBadEntryPoint(['.', 'default'])
      )
    );

    expect(monorepoSubRoot2.output).toStrictEqual(
      stringContainingErrorMessage(
        'error',
        `${Fixtures.badMonorepo.unnamedPkgMapData[7][1].root}/package.json`,
        ErrorMessage.PackageJsonBadEntryPoint(['.', 'node', 'custom'])
      )
    );

    expect(monorepoSubRoot2.output).toStrictEqual(
      stringContainingErrorMessage(
        'error',
        `${Fixtures.badMonorepo.unnamedPkgMapData[7][1].root}/package.json`,
        ErrorMessage.PackageJsonBadEntryPoint(['./package'])
      )
    );

    expect(polyrepoRoot1.output).toStrictEqual(
      stringContainingErrorMessage(
        'error',
        `${Fixtures.badPolyrepoExports2.root}/package.json`,
        ErrorMessage.PackageJsonBadTypesEntryPoint(['*', '*'])
      )
    );

    expect(polyrepoRoot2.output).toStrictEqual(
      stringContainingErrorMessage(
        'error',
        `${Fixtures.badPolyrepoExports3.root}/package.json`,
        ErrorMessage.PackageJsonBadTypesEntryPoint(['*', 'special.d.ts'])
      )
    );

    expect(polyrepoRoot2.output).toStrictEqual(
      stringContainingErrorMessage(
        'error',
        `${Fixtures.badPolyrepoExports3.root}/package.json`,
        ErrorMessage.PackageJsonBadEntryPoint(['.', 'default'])
      )
    );

    expect(polyrepoRoot2.output).toStrictEqual(
      stringContainingErrorMessage(
        'error',
        `${Fixtures.badPolyrepoExports3.root}/package.json`,
        ErrorMessage.PackageJsonBadEntryPoint(['.', 'node', 'custom'])
      )
    );

    expect(polyrepoRoot2.output).toStrictEqual(
      stringContainingErrorMessage(
        'error',
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
          'warn',
          `${Fixtures.badMonorepo.root}/${file}`,
          ErrorMessage.MissingFile()
        )
      );
    });

    Constants.polyrepoTsconfigFiles.forEach((file) => {
      expect(polyrepoRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          'warn',
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
          'warn',
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
        'warn',
        `${Fixtures.badMonorepo.unnamedPkgMapData[11][1].root}/package.json`,
        ErrorMessage.PackageJsonMissingValue('license', Constants.pkgJsonLicense)
      )
    );

    expect(polyrepoRoot.output).toStrictEqual(
      stringContainingErrorMessage(
        'warn',
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
        'warn',
        `${Fixtures.badMonorepo.root}/package.json`,
        ErrorMessage.PackageJsonExperimentalVersion()
      )
    );

    expect(monorepoSubRoot1.output).toStrictEqual(
      stringContainingErrorMessage(
        'warn',
        `${Fixtures.badMonorepo.unnamedPkgMapData[12][1].root}/package.json`,
        ErrorMessage.PackageJsonExperimentalVersion()
      )
    );

    expect(monorepoSubRoot2.output).toStrictEqual(
      stringContainingErrorMessage(
        'warn',
        `${Fixtures.badMonorepo.unnamedPkgMapData[13][1].root}/package.json`,
        ErrorMessage.PackageJsonExperimentalVersion()
      )
    );

    expect(polyrepoRoot1.output).toStrictEqual(
      stringContainingErrorMessage(
        'warn',
        `${Fixtures.badPolyrepoVersion1.root}/package.json`,
        ErrorMessage.PackageJsonExperimentalVersion()
      )
    );

    expect(polyrepoRoot2.output).toStrictEqual(
      stringContainingErrorMessage(
        'warn',
        `${Fixtures.badPolyrepoVersion2.root}/package.json`,
        ErrorMessage.PackageJsonExperimentalVersion()
      )
    );

    expect(goodMonorepoRoot.output).not.toStrictEqual(
      stringContainingErrorMessage(
        'warn',
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
          'warn',
          `${Fixtures.badMonorepo.unnamedPkgMapData[8][1].root}/package.json`,
          ErrorMessage.PackageJsonObsoleteKey(key)
        )
      );

      expect(polyrepoRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          'warn',
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
        'warn',
        `${Fixtures.badMonorepo.unnamedPkgMapData[14][1].root}/package.json`,
        ErrorMessage.PackageJsonMissingKey('engines.node')
      )
    );

    expect(polyrepoRoot.output).toStrictEqual(
      stringContainingErrorMessage(
        'warn',
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

    const engines = Utils.getExpectedPkgNodeEngines();

    expect(monorepoSubRoot.output).toStrictEqual(
      stringContainingErrorMessage(
        'warn',
        `${Fixtures.badMonorepo.unnamedPkgMapData[4][1].root}/package.json`,
        ErrorMessage.PackageJsonBadEngine(engines)
      )
    );

    expect(polyrepoRoot.output).toStrictEqual(
      stringContainingErrorMessage(
        'warn',
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
        'warn',
        `${Fixtures.badMonorepo.root}/package.json`,
        ErrorMessage.PackageJsonPinnedDependency('chalk')
      )
    );

    expect(monorepoSubRoot.output).toStrictEqual(
      stringContainingErrorMessage(
        'warn',
        `${Fixtures.badMonorepo.unnamedPkgMapData[3][1].root}/package.json`,
        ErrorMessage.PackageJsonPinnedDependency('chalk')
      )
    );

    expect(polyrepoRoot.output).toStrictEqual(
      stringContainingErrorMessage(
        'warn',
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
        'warn',
        `${Fixtures.badMonorepo.root}/package.json`,
        ErrorMessage.PackageJsonNonSemverDependency('jest')
      )
    );

    expect(monorepoSubRoot.output).toStrictEqual(
      stringContainingErrorMessage(
        'warn',
        `${Fixtures.badMonorepo.unnamedPkgMapData[3][1].root}/package.json`,
        ErrorMessage.PackageJsonNonSemverDependency('jest')
      )
    );

    expect(polyrepoRoot.output).toStrictEqual(
      stringContainingErrorMessage(
        'warn',
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
        'warn',
        `${Fixtures.badMonorepo.root}/package.json`,
        ErrorMessage.PackageJsonMissingKey('config.docs.entry')
      )
    );

    expect(monorepoSubRoot.output).toStrictEqual(
      stringContainingErrorMessage(
        'warn',
        `${Fixtures.badMonorepo.unnamedPkgMapData[0][1].root}/package.json`,
        ErrorMessage.PackageJsonMissingKey('config.docs.entry')
      )
    );

    expect(polyrepoRoot.output).toStrictEqual(
      stringContainingErrorMessage(
        'warn',
        `${Fixtures.badPolyrepo.root}/package.json`,
        ErrorMessage.PackageJsonMissingKey('config.docs.entry')
      )
    );
  });

  it('warns when package.json "config.docs.entry" points to a non-existent path', async () => {
    expect.hasAssertions();

    const monorepoRoot = await Linters.runProjectLinter({
      rootDir: Fixtures.badMonorepo.root
    });

    const monorepoSubRoot = await Linters.runProjectLinter({
      rootDir: Fixtures.badMonorepo.unnamedPkgMapData[15][1].root
    });

    const polyrepoRoot = await Linters.runProjectLinter({
      rootDir: Fixtures.badPolyrepoDocsEntry.root
    });

    expect(monorepoRoot.output).not.toStrictEqual(
      stringContainingErrorMessage(
        'warn',
        `${Fixtures.badMonorepo.root}/package.json`,
        ErrorMessage.PackageJsonBadConfigDocsEntry()
      )
    );

    expect(monorepoSubRoot.output).toStrictEqual(
      stringContainingErrorMessage(
        'warn',
        `${Fixtures.badMonorepo.unnamedPkgMapData[15][1].root}/package.json`,
        ErrorMessage.PackageJsonBadConfigDocsEntry()
      )
    );

    expect(polyrepoRoot.output).toStrictEqual(
      stringContainingErrorMessage(
        'warn',
        `${Fixtures.badPolyrepoDocsEntry.root}/package.json`,
        ErrorMessage.PackageJsonBadConfigDocsEntry()
      )
    );
  });

  describe('(topmatter README.md tests)', () => {
    beforeEach(() => {
      const readFileSpy = jest.spyOn(fs, 'readFile');
      const _access = fs.access;
      const accessSpy = jest.spyOn(fs, 'access');

      readFileSpy.mockImplementation(() => Promise.resolve(''));
      accessSpy.mockImplementation((path: PathLike, mode?: number) =>
        path.toString().endsWith('/README.md') ? Promise.resolve() : _access(path, mode)
      );
    });

    it('warns when README.md is missing topmatter opening comment', async () => {
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
          'warn',
          `${Fixtures.badMonorepoEmptyMdFiles.root}/README.md`,
          ErrorMessage.MarkdownInvalidSyntaxOpeningComment()
        )
      );

      expect(monorepoSubRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          'warn',
          `${Fixtures.badMonorepoEmptyMdFiles.unnamedPkgMapData[0][1].root}/README.md`,
          ErrorMessage.MarkdownInvalidSyntaxOpeningComment()
        )
      );

      expect(polyrepoRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          'warn',
          `${Fixtures.badPolyrepoEmptyMdFiles.root}/README.md`,
          ErrorMessage.MarkdownInvalidSyntaxOpeningComment()
        )
      );
    });

    it('warns when README.md is missing topmatter closing comment', async () => {
      expect.hasAssertions();

      mockedFromMarkdown.mockImplementation(() => ({
        type: 'root',
        children: [
          {
            type: 'html',
            value: '<!-- badges-start -->',
            position: {
              start: { line: 3, column: 1, offset: 32 },
              end: { line: 3, column: 22, offset: 53 }
            }
          }
        ]
      }));

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
          'warn',
          `${Fixtures.badMonorepoEmptyMdFiles.root}/README.md`,
          ErrorMessage.MarkdownInvalidSyntaxClosingComment()
        )
      );

      expect(monorepoSubRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          'warn',
          `${Fixtures.badMonorepoEmptyMdFiles.unnamedPkgMapData[0][1].root}/README.md`,
          ErrorMessage.MarkdownInvalidSyntaxClosingComment()
        )
      );

      expect(polyrepoRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          'warn',
          `${Fixtures.badPolyrepoEmptyMdFiles.root}/README.md`,
          ErrorMessage.MarkdownInvalidSyntaxClosingComment()
        )
      );
    });

    it('warns when README.md has invalid badge syntax', async () => {
      expect.hasAssertions();

      mockedFromMarkdown.mockImplementation(() => ({
        type: 'root',
        children: [
          {
            type: 'html',
            value: '<!-- badges-start -->',
            position: {
              start: { line: 3, column: 1, offset: 32 },
              end: { line: 3, column: 22, offset: 53 }
            }
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'linkReference',
                children: [],
                position: {
                  start: { line: 5, column: 1, offset: 55 },
                  end: { line: 5, column: 46, offset: 100 }
                },
                label: 'link-blm',
                identifier: 'link-blm',
                referenceType: 'full'
              }
            ]
          },
          {
            type: 'html',
            value: '<!-- badges-end -->',
            position: {
              start: { line: 3, column: 1, offset: 32 },
              end: { line: 3, column: 22, offset: 53 }
            }
          }
        ]
      }));

      const monorepoRoot = await Linters.runProjectLinter({
        rootDir: Fixtures.badMonorepoEmptyMdFiles.root
      });

      const monorepoSubRoot = await Linters.runProjectLinter({
        rootDir: Fixtures.badMonorepoEmptyMdFiles.unnamedPkgMapData[0][1].root
      });

      mockedFromMarkdown.mockImplementation(() => ({
        type: 'root',
        children: [
          {
            type: 'html',
            value: '<!-- badges-start -->',
            position: {
              start: { line: 3, column: 1, offset: 32 },
              end: { line: 3, column: 22, offset: 53 }
            }
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'linkReference',
                children: [],
                position: {
                  start: { line: 5, column: 1, offset: 55 },
                  end: { line: 5, column: 46, offset: 100 }
                },
                label: '',
                identifier: '',
                referenceType: 'full'
              }
            ]
          },
          {
            type: 'html',
            value: '<!-- badges-end -->',
            position: {
              start: { line: 3, column: 1, offset: 32 },
              end: { line: 3, column: 22, offset: 53 }
            }
          }
        ]
      }));

      const polyrepoRoot = await Linters.runProjectLinter({
        rootDir: Fixtures.badPolyrepoEmptyMdFiles.root
      });

      expect(monorepoRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          'warn',
          `${Fixtures.badMonorepoEmptyMdFiles.root}/README.md`,
          ErrorMessage.MarkdownInvalidSyntaxLinkRef('link-blm')
        )
      );

      expect(monorepoSubRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          'warn',
          `${Fixtures.badMonorepoEmptyMdFiles.unnamedPkgMapData[0][1].root}/README.md`,
          ErrorMessage.MarkdownInvalidSyntaxLinkRef('link-blm')
        )
      );

      expect(polyrepoRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          'warn',
          `${Fixtures.badPolyrepoEmptyMdFiles.root}/README.md`,
          ErrorMessage.MarkdownInvalidSyntaxLinkRef('(unlabeled)')
        )
      );
    });

    it('warns when README.md has unknown topmatter', async () => {
      expect.hasAssertions();

      mockedFromMarkdown.mockImplementation(() => mockMdastReadmeMonorepo);

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
          'warn',
          `${Fixtures.badMonorepoEmptyMdFiles.root}/README.md`,
          ErrorMessage.MarkdownUnknownTopmatterItem('badge-projector')
        )
      );

      expect(monorepoSubRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          'warn',
          `${Fixtures.badMonorepoEmptyMdFiles.unnamedPkgMapData[0][1].root}/README.md`,
          ErrorMessage.MarkdownUnknownTopmatterItem('badge-projector')
        )
      );

      expect(polyrepoRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          'warn',
          `${Fixtures.badPolyrepoEmptyMdFiles.root}/README.md`,
          ErrorMessage.MarkdownUnknownTopmatterItem('badge-projector')
        )
      );
    });

    it('warns when README.md has a bad badge', async () => {
      expect.hasAssertions();

      mockedFromMarkdown.mockImplementation(() => ({
        type: 'root',
        children: [
          {
            type: 'html',
            value: '<!-- badges-start -->',
            position: {
              start: { line: 3, column: 1, offset: 32 },
              end: { line: 3, column: 22, offset: 53 }
            }
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'linkReference',
                children: [
                  {
                    type: 'imageReference',
                    alt: 'BLM!',
                    position: {
                      start: { line: 5, column: 2, offset: 56 },
                      end: { line: 5, column: 35, offset: 89 }
                    },
                    label: 'badge-blm',
                    identifier: 'badge-blm',
                    referenceType: 'full'
                  }
                ],
                position: {
                  start: { line: 5, column: 1, offset: 55 },
                  end: { line: 5, column: 46, offset: 100 }
                },
                label: 'blm-link',
                identifier: 'blm-link',
                referenceType: 'full'
              }
            ]
          },
          {
            type: 'html',
            value: '<!-- badges-end -->',
            position: {
              start: { line: 3, column: 1, offset: 32 },
              end: { line: 3, column: 22, offset: 53 }
            }
          }
        ]
      }));

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
          'warn',
          `${Fixtures.badMonorepoEmptyMdFiles.root}/README.md`,
          ErrorMessage.MarkdownBadTopmatterLinkRefLabel(
            'blm-link',
            Constants.markdownReadmeStandardTopmatter.badge.blm.link.label
          )
        )
      );

      expect(monorepoSubRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          'warn',
          `${Fixtures.badMonorepoEmptyMdFiles.unnamedPkgMapData[0][1].root}/README.md`,
          ErrorMessage.MarkdownBadTopmatterLinkRefLabel(
            'blm-link',
            Constants.markdownReadmeStandardTopmatter.badge.blm.link.label
          )
        )
      );

      expect(polyrepoRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          'warn',
          `${Fixtures.badPolyrepoEmptyMdFiles.root}/README.md`,
          ErrorMessage.MarkdownBadTopmatterLinkRefLabel(
            'blm-link',
            Constants.markdownReadmeStandardTopmatter.badge.blm.link.label
          )
        )
      );

      expect(monorepoRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          'warn',
          `${Fixtures.badMonorepoEmptyMdFiles.root}/README.md`,
          ErrorMessage.MarkdownBadTopmatterImageRefAlt(
            'badge-blm',
            Constants.markdownReadmeStandardTopmatter.badge.blm.alt
          )
        )
      );

      expect(monorepoSubRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          'warn',
          `${Fixtures.badMonorepoEmptyMdFiles.unnamedPkgMapData[0][1].root}/README.md`,
          ErrorMessage.MarkdownBadTopmatterImageRefAlt(
            'badge-blm',
            Constants.markdownReadmeStandardTopmatter.badge.blm.alt
          )
        )
      );

      expect(polyrepoRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          'warn',
          `${Fixtures.badPolyrepoEmptyMdFiles.root}/README.md`,
          ErrorMessage.MarkdownBadTopmatterImageRefAlt(
            'badge-blm',
            Constants.markdownReadmeStandardTopmatter.badge.blm.alt
          )
        )
      );

      expect(monorepoRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          'warn',
          `${Fixtures.badMonorepoEmptyMdFiles.root}/README.md`,
          ErrorMessage.MarkdownBadTopmatterMissingLinkRefDef('blm-link')
        )
      );

      expect(monorepoSubRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          'warn',
          `${Fixtures.badMonorepoEmptyMdFiles.unnamedPkgMapData[0][1].root}/README.md`,
          ErrorMessage.MarkdownBadTopmatterMissingLinkRefDef('blm-link')
        )
      );

      expect(polyrepoRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          'warn',
          `${Fixtures.badPolyrepoEmptyMdFiles.root}/README.md`,
          ErrorMessage.MarkdownBadTopmatterMissingLinkRefDef('blm-link')
        )
      );
    });

    it('warns when README.md has a bad image reference', async () => {
      expect.hasAssertions();

      mockedFromMarkdown.mockImplementation(() => ({
        type: 'root',
        children: [
          {
            type: 'html',
            value: '<!-- badges-start -->',
            position: {
              start: { line: 3, column: 1, offset: 32 },
              end: { line: 3, column: 22, offset: 53 }
            }
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'linkReference',
                children: [
                  {
                    type: 'imageReference',
                    alt: 'BLM!',
                    position: {
                      start: { line: 5, column: 2, offset: 56 },
                      end: { line: 5, column: 35, offset: 89 }
                    },
                    label: 'badge-blm',
                    identifier: 'badge-blm',
                    referenceType: 'full'
                  }
                ],
                position: {
                  start: { line: 5, column: 1, offset: 55 },
                  end: { line: 5, column: 46, offset: 100 }
                },
                label: 'link-blm',
                identifier: 'link-blm',
                referenceType: 'full'
              }
            ]
          },
          {
            type: 'html',
            value: '<!-- badges-end -->',
            position: {
              start: { line: 3, column: 1, offset: 32 },
              end: { line: 3, column: 22, offset: 53 }
            }
          },
          {
            type: 'definition',
            identifier: 'link-blm',
            label: 'link-blm',
            title: null,
            url: 'https://xunn.at/donate-blm',
            position: {
              start: { line: 967, column: 1, offset: 32180 },
              end: { line: 967, column: 39, offset: 32218 }
            }
          }
        ]
      }));

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
          'warn',
          `${Fixtures.badMonorepoEmptyMdFiles.root}/README.md`,
          ErrorMessage.MarkdownBadTopmatterMissingImageRefDef(
            Constants.markdownReadmeStandardTopmatter.badge.blm.label
          )
        )
      );

      expect(monorepoSubRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          'warn',
          `${Fixtures.badMonorepoEmptyMdFiles.unnamedPkgMapData[0][1].root}/README.md`,
          ErrorMessage.MarkdownBadTopmatterMissingImageRefDef(
            Constants.markdownReadmeStandardTopmatter.badge.blm.label
          )
        )
      );

      expect(polyrepoRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          'warn',
          `${Fixtures.badPolyrepoEmptyMdFiles.root}/README.md`,
          ErrorMessage.MarkdownBadTopmatterMissingImageRefDef(
            Constants.markdownReadmeStandardTopmatter.badge.blm.label
          )
        )
      );
    });

    it('warns when missing repository url and/or name while checking README.md', async () => {
      expect.hasAssertions();

      const actual = Core.readPackageJson;
      const jsonSpy = jest.spyOn(Core, 'readPackageJson');

      jsonSpy.mockImplementation(({ root }) => {
        const pkgData = actual({ root });

        if (root == Fixtures.badMonorepoEmptyMdFiles.unnamedPkgMapData[0][1].root) {
          pkgData.repository = 'https://github.com/user/repo';
        } else if (root == Fixtures.badPolyrepoEmptyMdFiles.root) {
          pkgData.repository = { type: 'git', url: 'https://github.com/user/repo' };
          pkgData.name = 'some-name';
        }

        return pkgData;
      });

      mockedFromMarkdown.mockImplementation(() => ({
        type: 'root',
        children: [
          {
            type: 'html',
            value: '<!-- badges-start -->',
            position: {
              start: { line: 3, column: 1, offset: 32 },
              end: { line: 3, column: 22, offset: 53 }
            }
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'linkReference',
                children: [
                  {
                    type: 'imageReference',
                    alt: 'BLM!',
                    position: {
                      start: { line: 5, column: 2, offset: 56 },
                      end: { line: 5, column: 35, offset: 89 }
                    },
                    label: 'badge-blm',
                    identifier: 'badge-blm',
                    referenceType: 'full'
                  }
                ],
                position: {
                  start: { line: 5, column: 1, offset: 55 },
                  end: { line: 5, column: 46, offset: 100 }
                },
                label: 'link-blm',
                identifier: 'link-blm',
                referenceType: 'full'
              }
            ]
          },
          {
            type: 'html',
            value: '<!-- badges-end -->',
            position: {
              start: { line: 3, column: 1, offset: 32 },
              end: { line: 3, column: 22, offset: 53 }
            }
          },
          {
            type: 'definition',
            identifier: 'link-blm',
            label: 'link-blm',
            title: null,
            url: 'https://xunn.at/donate-blm',
            position: {
              start: { line: 967, column: 1, offset: 32180 },
              end: { line: 967, column: 39, offset: 32218 }
            }
          },
          {
            type: 'definition',
            identifier: 'badge-blm',
            label: 'badge-blm',
            title: null,
            url: 'https://xunn.at/donate-blm',
            position: {
              start: { line: 967, column: 1, offset: 32180 },
              end: { line: 967, column: 39, offset: 32218 }
            }
          }
        ]
      }));

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
          'warn',
          `${Fixtures.badMonorepoEmptyMdFiles.root}/README.md`,
          ErrorMessage.PackageJsonMissingKeysCheckSkipped()
        )
      );

      expect(monorepoSubRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          'warn',
          `${Fixtures.badMonorepoEmptyMdFiles.unnamedPkgMapData[0][1].root}/README.md`,
          ErrorMessage.PackageJsonMissingKeysCheckSkipped()
        )
      );

      expect(polyrepoRoot.output).not.toStrictEqual(
        stringContainingErrorMessage(
          'warn',
          `${Fixtures.badPolyrepoEmptyMdFiles.root}/README.md`,
          ErrorMessage.PackageJsonMissingKeysCheckSkipped()
        )
      );
    });

    it('warns when README.md has a bad definition', async () => {
      expect.hasAssertions();

      const actual = Core.readPackageJson;
      const jsonSpy = jest.spyOn(Core, 'readPackageJson');

      jsonSpy.mockImplementation(({ root }) => {
        const pkgData = actual({ root });

        pkgData.repository = { type: 'git', url: 'https://github.com/user/repo' };
        pkgData.name = pkgData.name || `pkg-${Math.random().toString(16).slice(10)}`;

        return pkgData;
      });

      mockedFromMarkdown.mockImplementation(() => ({
        type: 'root',
        children: [
          {
            type: 'html',
            value: '<!-- badges-start -->',
            position: {
              start: { line: 3, column: 1, offset: 32 },
              end: { line: 3, column: 22, offset: 53 }
            }
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'linkReference',
                children: [
                  {
                    type: 'imageReference',
                    alt: 'LCT',
                    position: {
                      start: { line: 6, column: 2, offset: 102 },
                      end: { line: 6, column: 45, offset: 145 }
                    },
                    label: 'badge-last-commit',
                    identifier: 'badge-last-commit',
                    referenceType: 'full'
                  }
                ],
                position: {
                  start: { line: 6, column: 1, offset: 101 },
                  end: { line: 6, column: 57, offset: 157 }
                },
                label: 'link-last-commit',
                identifier: 'link-last-commit',
                referenceType: 'full'
              }
            ]
          },
          {
            type: 'html',
            value: '<!-- badges-end -->',
            position: {
              start: { line: 3, column: 1, offset: 32 },
              end: { line: 3, column: 22, offset: 53 }
            }
          },
          {
            type: 'definition',
            identifier: 'link-last-commit',
            label: 'link-last-commit',
            title: null,
            url: 'https://github.com/x/y',
            position: {
              start: { line: 968, column: 1, offset: 32219 },
              end: { line: 968, column: 52, offset: 32270 }
            }
          },
          {
            type: 'definition',
            identifier: 'badge-last-commit',
            label: 'badge-last-commit',
            title: 'LCT',
            url: 'https://img.shields.io/github/last-commit/x/y',
            position: {
              start: { line: 969, column: 1, offset: 32271 },
              end: { line: 971, column: 28, offset: 32383 }
            }
          }
        ]
      }));

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
          'warn',
          `${Fixtures.badMonorepoEmptyMdFiles.root}/README.md`,
          ErrorMessage.MarkdownBadTopmatterImageRefDefTitle(
            'badge-last-commit',
            Constants.markdownReadmeStandardTopmatter.badge.lastCommit.title
          )
        )
      );

      expect(monorepoSubRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          'warn',
          `${Fixtures.badMonorepoEmptyMdFiles.unnamedPkgMapData[0][1].root}/README.md`,
          ErrorMessage.MarkdownBadTopmatterImageRefDefTitle(
            'badge-last-commit',
            Constants.markdownReadmeStandardTopmatter.badge.lastCommit.title
          )
        )
      );

      expect(polyrepoRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          'warn',
          `${Fixtures.badPolyrepoEmptyMdFiles.root}/README.md`,
          ErrorMessage.MarkdownBadTopmatterImageRefDefTitle(
            'badge-last-commit',
            Constants.markdownReadmeStandardTopmatter.badge.lastCommit.title
          )
        )
      );

      expect(monorepoRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          'warn',
          `${Fixtures.badMonorepoEmptyMdFiles.root}/README.md`,
          ErrorMessage.MarkdownBadTopmatterImageRefDefUrl(
            'badge-last-commit',
            Constants.markdownReadmeStandardTopmatter.badge.lastCommit.url({
              user: 'user',
              repo: 'repo',
              pkgName: expect.any(String)
            })
          )
        )
      );

      expect(monorepoSubRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          'warn',
          `${Fixtures.badMonorepoEmptyMdFiles.unnamedPkgMapData[0][1].root}/README.md`,
          ErrorMessage.MarkdownBadTopmatterImageRefDefUrl(
            'badge-last-commit',
            Constants.markdownReadmeStandardTopmatter.badge.lastCommit.url({
              user: 'user',
              repo: 'repo',
              pkgName: expect.any(String)
            })
          )
        )
      );

      expect(polyrepoRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          'warn',
          `${Fixtures.badPolyrepoEmptyMdFiles.root}/README.md`,
          ErrorMessage.MarkdownBadTopmatterImageRefDefUrl(
            'badge-last-commit',
            Constants.markdownReadmeStandardTopmatter.badge.lastCommit.url({
              user: 'user',
              repo: 'repo',
              pkgName: expect.any(String)
            })
          )
        )
      );

      expect(monorepoRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          'warn',
          `${Fixtures.badMonorepoEmptyMdFiles.root}/README.md`,
          ErrorMessage.MarkdownBadTopmatterLinkRefDefUrl(
            'link-last-commit',
            Constants.markdownReadmeStandardTopmatter.badge.lastCommit.link.url({
              user: 'user',
              repo: 'repo',
              pkgName: expect.any(String)
            })
          )
        )
      );

      expect(monorepoSubRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          'warn',
          `${Fixtures.badMonorepoEmptyMdFiles.unnamedPkgMapData[0][1].root}/README.md`,
          ErrorMessage.MarkdownBadTopmatterLinkRefDefUrl(
            'link-last-commit',
            Constants.markdownReadmeStandardTopmatter.badge.lastCommit.link.url({
              user: 'user',
              repo: 'repo',
              pkgName: expect.any(String)
            })
          )
        )
      );

      expect(polyrepoRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          'warn',
          `${Fixtures.badPolyrepoEmptyMdFiles.root}/README.md`,
          ErrorMessage.MarkdownBadTopmatterLinkRefDefUrl(
            'link-last-commit',
            Constants.markdownReadmeStandardTopmatter.badge.lastCommit.link.url({
              user: 'user',
              repo: 'repo',
              pkgName: expect.any(String)
            })
          )
        )
      );
    });

    it('warns when README.md is missing topmatter', async () => {
      expect.hasAssertions();

      mockedFromMarkdown.mockImplementation(() => ({
        type: 'root',
        children: [
          {
            type: 'html',
            value: '<!-- badges-start -->',
            position: {
              start: { line: 3, column: 1, offset: 32 },
              end: { line: 3, column: 22, offset: 53 }
            }
          },
          {
            type: 'paragraph',
            children: []
          },
          {
            type: 'html',
            value: '<!-- badges-end -->',
            position: {
              start: { line: 3, column: 1, offset: 32 },
              end: { line: 3, column: 22, offset: 53 }
            }
          }
        ]
      }));

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
          'warn',
          `${Fixtures.badMonorepoEmptyMdFiles.root}/README.md`,
          ErrorMessage.MarkdownMissingTopmatter()
        )
      );

      expect(monorepoSubRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          'warn',
          `${Fixtures.badMonorepoEmptyMdFiles.unnamedPkgMapData[0][1].root}/README.md`,
          ErrorMessage.MarkdownMissingTopmatter()
        )
      );

      expect(polyrepoRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          'warn',
          `${Fixtures.badPolyrepoEmptyMdFiles.root}/README.md`,
          ErrorMessage.MarkdownMissingTopmatter()
        )
      );
    });

    it('warns when README.md topmatter is out of order', async () => {
      expect.hasAssertions();

      mockedFromMarkdown.mockImplementation(() => mockMdastReadmeMonorepoOOOrder);

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
          'warn',
          `${Fixtures.badMonorepoEmptyMdFiles.root}/README.md`,
          ErrorMessage.MarkdownTopmatterOutOfOrder()
        )
      );

      expect(monorepoSubRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          'warn',
          `${Fixtures.badMonorepoEmptyMdFiles.unnamedPkgMapData[0][1].root}/README.md`,
          ErrorMessage.MarkdownTopmatterOutOfOrder()
        )
      );

      expect(polyrepoRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          'warn',
          `${Fixtures.badPolyrepoEmptyMdFiles.root}/README.md`,
          ErrorMessage.MarkdownTopmatterOutOfOrder()
        )
      );
    });

    it('warns when README.md is missing specific topmatter items', async () => {
      expect.hasAssertions();

      mockedFromMarkdown.mockImplementation(() => ({
        type: 'root',
        children: [
          {
            type: 'html',
            value: '<!-- badges-start -->',
            position: {
              start: { line: 3, column: 1, offset: 32 },
              end: { line: 3, column: 22, offset: 53 }
            }
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'linkReference',
                children: [
                  {
                    type: 'imageReference',
                    alt: 'LCT',
                    position: {
                      start: { line: 6, column: 2, offset: 102 },
                      end: { line: 6, column: 45, offset: 145 }
                    },
                    label: 'badge-last-commit',
                    identifier: 'badge-last-commit',
                    referenceType: 'full'
                  }
                ],
                position: {
                  start: { line: 6, column: 1, offset: 101 },
                  end: { line: 6, column: 57, offset: 157 }
                },
                label: 'link-last-commit',
                identifier: 'link-last-commit',
                referenceType: 'full'
              }
            ]
          },
          {
            type: 'html',
            value: '<!-- badges-end -->',
            position: {
              start: { line: 3, column: 1, offset: 32 },
              end: { line: 3, column: 22, offset: 53 }
            }
          }
        ]
      }));

      const monorepoRoot = await Linters.runProjectLinter({
        rootDir: Fixtures.badMonorepoEmptyMdFiles.root
      });

      const monorepoSubRoot = await Linters.runProjectLinter({
        rootDir: Fixtures.badMonorepoEmptyMdFiles.unnamedPkgMapData[0][1].root
      });

      const polyrepoRoot = await Linters.runProjectLinter({
        rootDir: Fixtures.badPolyrepoEmptyMdFiles.root
      });

      Object.values(Constants.markdownReadmeStandardTopmatter.badge)
        .filter(({ label }) => label != 'badge-last-commit')
        .forEach(({ label, conditions }) => {
          if (conditions.includes('monorepo')) {
            expect(monorepoRoot.output).toStrictEqual(
              stringContainingErrorMessage(
                'warn',
                `${Fixtures.badMonorepoEmptyMdFiles.root}/README.md`,
                ErrorMessage.MarkdownMissingTopmatterItem(label)
              )
            );
          }

          if (conditions.includes('subroot')) {
            expect(monorepoSubRoot.output).toStrictEqual(
              stringContainingErrorMessage(
                'warn',
                `${Fixtures.badMonorepoEmptyMdFiles.unnamedPkgMapData[0][1].root}/README.md`,
                ErrorMessage.MarkdownMissingTopmatterItem(label)
              )
            );
          }

          if (conditions.includes('polyrepo')) {
            expect(polyrepoRoot.output).toStrictEqual(
              stringContainingErrorMessage(
                'warn',
                `${Fixtures.badPolyrepoEmptyMdFiles.root}/README.md`,
                ErrorMessage.MarkdownMissingTopmatterItem(label)
              )
            );
          }
        });
    });

    it('warns when README.md is missing specific standard link references', async () => {
      expect.hasAssertions();

      const actual = Core.readPackageJson;
      const jsonSpy = jest.spyOn(Core, 'readPackageJson');

      jsonSpy.mockImplementation(({ root }) => {
        const pkgData = actual({ root });

        pkgData.repository = { type: 'git', url: 'https://github.com/user/repo' };
        pkgData.name = pkgData.name || `pkg-${Math.random().toString(16).slice(10)}`;

        return pkgData;
      });

      mockedFromMarkdown.mockImplementation(() => ({
        type: 'root',
        children: []
      }));

      const monorepoRoot = await Linters.runProjectLinter({
        rootDir: Fixtures.badMonorepoEmptyMdFiles.root
      });

      const monorepoSubRoot = await Linters.runProjectLinter({
        rootDir: Fixtures.badMonorepoEmptyMdFiles.unnamedPkgMapData[0][1].root
      });

      const polyrepoRoot = await Linters.runProjectLinter({
        rootDir: Fixtures.badPolyrepoEmptyMdFiles.root
      });

      Object.values(Constants.markdownReadmeStandardLinks).forEach(({ label }) => {
        expect(monorepoRoot.output).toStrictEqual(
          stringContainingErrorMessage(
            'warn',
            `${Fixtures.badMonorepoEmptyMdFiles.root}/README.md`,
            ErrorMessage.MarkdownMissingLink(label)
          )
        );

        expect(monorepoSubRoot.output).toStrictEqual(
          stringContainingErrorMessage(
            'warn',
            `${Fixtures.badMonorepoEmptyMdFiles.unnamedPkgMapData[0][1].root}/README.md`,
            ErrorMessage.MarkdownMissingLink(label)
          )
        );

        expect(polyrepoRoot.output).toStrictEqual(
          stringContainingErrorMessage(
            'warn',
            `${Fixtures.badPolyrepoEmptyMdFiles.root}/README.md`,
            ErrorMessage.MarkdownMissingLink(label)
          )
        );
      });
    });

    it('warns when README.md has a bad standard link reference', async () => {
      expect.hasAssertions();

      const actual = Core.readPackageJson;
      const jsonSpy = jest.spyOn(Core, 'readPackageJson');

      jsonSpy.mockImplementation(({ root }) => {
        const pkgData = actual({ root });

        pkgData.repository = { type: 'git', url: 'https://github.com/user/repo' };
        pkgData.name = pkgData.name || `pkg-${Math.random().toString(16).slice(10)}`;

        return pkgData;
      });

      mockedFromMarkdown.mockImplementation(() => ({
        type: 'root',
        children: [
          {
            type: 'definition',
            identifier: 'choose-new-issue',
            label: 'choose-new-issue',
            title: null,
            url: 'https://fake.bad',
            position: {
              start: { line: 968, column: 1, offset: 32219 },
              end: { line: 968, column: 52, offset: 32270 }
            }
          }
        ]
      }));

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
          'warn',
          `${Fixtures.badMonorepoEmptyMdFiles.root}/README.md`,
          ErrorMessage.MarkdownBadLink(
            'choose-new-issue',
            Constants.markdownReadmeStandardLinks.chooseNewIssue.url({
              user: 'user',
              repo: 'repo',
              pkgName: expect.any(String)
            })
          )
        )
      );

      expect(monorepoSubRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          'warn',
          `${Fixtures.badMonorepoEmptyMdFiles.unnamedPkgMapData[0][1].root}/README.md`,
          ErrorMessage.MarkdownBadLink(
            'choose-new-issue',
            Constants.markdownReadmeStandardLinks.chooseNewIssue.url({
              user: 'user',
              repo: 'repo',
              pkgName: expect.any(String)
            })
          )
        )
      );

      expect(polyrepoRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          'warn',
          `${Fixtures.badPolyrepoEmptyMdFiles.root}/README.md`,
          ErrorMessage.MarkdownBadLink(
            'choose-new-issue',
            Constants.markdownReadmeStandardLinks.chooseNewIssue.url({
              user: 'user',
              repo: 'repo',
              pkgName: expect.any(String)
            })
          )
        )
      );
    });
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
            'error',
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
          'error',
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
          'error',
          `${Fixtures.badMonorepoDuplicateName.root}/pkg/pkg-1`,
          ErrorMessage.DuplicatePackageName(
            'pkg',
            `${Fixtures.badMonorepoDuplicateName.root}/pkg/pkg-2`
          )
        )
      );

      expect(monorepo.output).toStrictEqual(
        stringContainingErrorMessage(
          'error',
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
          'error',
          `${Fixtures.badMonorepoDuplicateId.root}/packages-1/pkg-1`,
          ErrorMessage.DuplicatePackageId(
            'pkg-1',
            `${Fixtures.badMonorepoDuplicateId.root}/packages-2/pkg-1`
          )
        )
      );

      expect(monorepo.output).toStrictEqual(
        stringContainingErrorMessage(
          'error',
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

      const monorepoRoot = await Linters.runProjectLinter({
        rootDir: Fixtures.badMonorepo.root
      });

      const monorepoSubRoot = await Linters.runProjectLinter({
        rootDir: Fixtures.badMonorepo.unnamedPkgMapData[0][1].root
      });

      const polyrepoRoot = await Linters.runProjectLinter({
        rootDir: Fixtures.badPolyrepo.root
      });

      Constants.repoRootRequiredFiles.forEach((file) => {
        // ? Works when linting a monorepo root
        expect(monorepoRoot.output).toStrictEqual(
          stringContainingErrorMessage(
            'warn',
            `${Fixtures.badMonorepo.root}/${file}`,
            ErrorMessage.MissingFile()
          )
        );

        // ? Does not error when linting a sub-root implicitly
        expect(monorepoRoot.output).not.toStrictEqual(
          stringContainingErrorMessage(
            'warn',
            `${Fixtures.badMonorepo.unnamedPkgMapData[0][1].root}/${file}`,
            ErrorMessage.MissingFile()
          )
        );

        // ? Does not error when linting a sub-root explicitly
        expect(monorepoSubRoot.output).not.toStrictEqual(
          stringContainingErrorMessage(
            'warn',
            `${Fixtures.badMonorepo.unnamedPkgMapData[0][1].root}/${file}`,
            ErrorMessage.MissingFile()
          )
        );

        // ? Works when linting a polyrepo root
        expect(polyrepoRoot.output).toStrictEqual(
          stringContainingErrorMessage(
            'warn',
            `${Fixtures.badPolyrepo.root}/${file}`,
            ErrorMessage.MissingFile()
          )
        );
      });
    });

    it('warns when missing GitHub tooling/configuration directories', async () => {
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

      Constants.repoRootRequiredDirectories.forEach((dir) => {
        // ? Works when linting a monorepo root
        expect(monorepoRoot.output).toStrictEqual(
          stringContainingErrorMessage(
            'warn',
            `${Fixtures.badMonorepo.root}/${dir}`,
            ErrorMessage.MissingDirectory()
          )
        );

        // ? Does not error when linting a sub-root implicitly
        expect(monorepoRoot.output).not.toStrictEqual(
          stringContainingErrorMessage(
            'warn',
            `${Fixtures.badMonorepo.unnamedPkgMapData[0][1].root}/${dir}`,
            ErrorMessage.MissingDirectory()
          )
        );

        // ? Does not error when linting a sub-root explicitly
        expect(monorepoSubRoot.output).not.toStrictEqual(
          stringContainingErrorMessage(
            'warn',
            `${Fixtures.badMonorepo.unnamedPkgMapData[0][1].root}/${dir}`,
            ErrorMessage.MissingDirectory()
          )
        );

        // ? Works when linting a polyrepo root
        expect(polyrepoRoot.output).toStrictEqual(
          stringContainingErrorMessage(
            'warn',
            `${Fixtures.badPolyrepo.root}/${dir}`,
            ErrorMessage.MissingDirectory()
          )
        );
      });
    });

    it('warns when missing release.config.js unless "private" field is set to "true"', async () => {
      expect.hasAssertions();

      const monorepoRoot1 = await Linters.runProjectLinter({
        rootDir: Fixtures.badMonorepo.root
      });

      const monorepoSubRoot1 = await Linters.runProjectLinter({
        rootDir: Fixtures.badMonorepo.unnamedPkgMapData[0][1].root
      });

      const polyrepoRoot1 = await Linters.runProjectLinter({
        rootDir: Fixtures.badPolyrepo.root
      });

      const actual = Core.readPackageJson;
      const jsonSpy = jest.spyOn(Core, 'readPackageJson');

      jsonSpy.mockImplementation(({ root }) => {
        const pkgData = actual({ root });

        pkgData.private = true;

        return pkgData;
      });

      const monorepoRoot2 = await Linters.runProjectLinter({
        rootDir: Fixtures.badMonorepo.root
      });

      const monorepoSubRoot2 = await Linters.runProjectLinter({
        rootDir: Fixtures.badMonorepo.unnamedPkgMapData[0][1].root
      });

      const polyrepoRoot2 = await Linters.runProjectLinter({
        rootDir: Fixtures.badPolyrepo.root
      });

      // ? Works when linting a monorepo root
      expect(monorepoRoot1.output).toStrictEqual(
        stringContainingErrorMessage(
          'warn',
          `${Fixtures.badMonorepo.root}/release.config.js`,
          ErrorMessage.MissingFile()
        )
      );

      // ? Does not error when linting a sub-root implicitly
      expect(monorepoRoot1.output).not.toStrictEqual(
        stringContainingErrorMessage(
          'warn',
          `${Fixtures.badMonorepo.unnamedPkgMapData[0][1].root}/release.config.js`,
          ErrorMessage.MissingFile()
        )
      );

      // ? Does not error when linting a sub-root explicitly
      expect(monorepoSubRoot1.output).not.toStrictEqual(
        stringContainingErrorMessage(
          'warn',
          `${Fixtures.badMonorepo.unnamedPkgMapData[0][1].root}/release.config.js`,
          ErrorMessage.MissingFile()
        )
      );

      // ? Works when linting a polyrepo root
      expect(polyrepoRoot1.output).toStrictEqual(
        stringContainingErrorMessage(
          'warn',
          `${Fixtures.badPolyrepo.root}/release.config.js`,
          ErrorMessage.MissingFile()
        )
      );

      // ? Works when linting a monorepo root
      expect(monorepoRoot2.output).not.toStrictEqual(
        stringContainingErrorMessage(
          'warn',
          `${Fixtures.badMonorepo.root}/release.config.js`,
          ErrorMessage.MissingFile()
        )
      );

      // ? Does not error when linting a sub-root implicitly
      expect(monorepoRoot2.output).not.toStrictEqual(
        stringContainingErrorMessage(
          'warn',
          `${Fixtures.badMonorepo.unnamedPkgMapData[0][1].root}/release.config.js`,
          ErrorMessage.MissingFile()
        )
      );

      // ? Does not error when linting a sub-root explicitly
      expect(monorepoSubRoot2.output).not.toStrictEqual(
        stringContainingErrorMessage(
          'warn',
          `${Fixtures.badMonorepo.unnamedPkgMapData[0][1].root}/release.config.js`,
          ErrorMessage.MissingFile()
        )
      );

      // ? Works when linting a polyrepo root
      expect(polyrepoRoot2.output).not.toStrictEqual(
        stringContainingErrorMessage(
          'warn',
          `${Fixtures.badPolyrepo.root}/release.config.js`,
          ErrorMessage.MissingFile()
        )
      );
    });

    it('warns when SECURITY.md or .github/SUPPORT.md are missing topmatter', async () => {
      expect.hasAssertions();
      // TODO: monorepo root and polyrepo but does NOT fail on sub-roots
    });

    it('warns when SECURITY.md or .github/SUPPORT.md topmatter are incorrectly configured', async () => {
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
    it('warns when package.json "name" field is missing even when private', async () => {
      expect.hasAssertions();

      const actual = Core.readPackageJson;
      const jsonSpy = jest.spyOn(Core, 'readPackageJson');

      jsonSpy.mockImplementation(({ root }) => {
        const pkgData = actual({ root });
        pkgData.private = true;
        return pkgData;
      });

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
      expect(monorepoRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          'warn',
          `${Fixtures.badMonorepo.root}/package.json`,
          ErrorMessage.PackageJsonMissingKey('name')
        )
      );

      // ? Does not error when linting a sub-root implicitly
      expect(monorepoRoot.output).not.toStrictEqual(
        stringContainingErrorMessage(
          'warn',
          `${Fixtures.badMonorepo.unnamedPkgMapData[0][1].root}/package.json`,
          ErrorMessage.PackageJsonMissingKey('name')
        )
      );

      // ? Does not error when linting a sub-root explicitly
      expect(monorepoSubRoot.output).not.toStrictEqual(
        stringContainingErrorMessage(
          'warn',
          `${Fixtures.badMonorepo.unnamedPkgMapData[0][1].root}/package.json`,
          ErrorMessage.PackageJsonMissingKey('name')
        )
      );

      // ? Does not when linting a polyrepo root
      expect(polyrepoRoot.output).not.toStrictEqual(
        stringContainingErrorMessage(
          'warn',
          `${Fixtures.badPolyrepo.root}/package.json`,
          ErrorMessage.PackageJsonMissingKey('name')
        )
      );
    });

    it('warns when package.json is missing "private" field or when "private" is not "true"', async () => {
      expect.hasAssertions();

      const monorepoRoot1 = await Linters.runProjectLinter({
        rootDir: Fixtures.badMonorepo.root
      });

      const actual = Core.readPackageJson;
      const jsonSpy = jest.spyOn(Core, 'readPackageJson');

      jsonSpy.mockImplementation(({ root }) => {
        const pkgData = actual({ root });
        pkgData.private = false;
        return pkgData;
      });

      const monorepoRoot2 = await Linters.runProjectLinter({
        rootDir: Fixtures.badMonorepo.root
      });

      expect(monorepoRoot1.output).toStrictEqual(
        stringContainingErrorMessage(
          'warn',
          `${Fixtures.badMonorepo.root}/package.json`,
          ErrorMessage.PackageJsonMissingKey('private')
        )
      );

      expect(monorepoRoot2.output).toStrictEqual(
        stringContainingErrorMessage(
          'warn',
          `${Fixtures.badMonorepo.root}/package.json`,
          ErrorMessage.PackageJsonMissingValue('private', 'true')
        )
      );
    });

    it('warns when package.json contains "dependencies" field unless a next.config.js file exists', async () => {
      expect.hasAssertions();

      const badMonorepoRoot = await Linters.runProjectLinter({
        rootDir: Fixtures.badMonorepo.root
      });

      const goodMonorepoRoot = await Linters.runProjectLinter({
        rootDir: Fixtures.goodMonorepo.root
      });

      expect(badMonorepoRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          'warn',
          `${Fixtures.badMonorepo.root}/package.json`,
          ErrorMessage.PackageJsonIllegalKey('dependencies')
        )
      );

      expect(goodMonorepoRoot.output).not.toStrictEqual(
        stringContainingErrorMessage(
          'warn',
          `${Fixtures.goodMonorepo.root}/package.json`,
          ErrorMessage.PackageJsonIllegalKey('dependencies')
        )
      );
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
          'warn',
          `${Fixtures.badMonorepo.root}/package.json`,
          ErrorMessage.PackageJsonIllegalKey('version')
        )
      );

      expect(monorepoRoot2.output).not.toStrictEqual(
        stringContainingErrorMessage(
          'warn',
          `${Fixtures.goodMonorepo.root}/package.json`,
          ErrorMessage.PackageJsonIllegalKey('version')
        )
      );

      expect(monorepoRoot3.output).not.toStrictEqual(
        stringContainingErrorMessage(
          'warn',
          `${Fixtures.goodMonorepoVersion.root}/package.json`,
          ErrorMessage.PackageJsonIllegalKey('version')
        )
      );

      expect(monorepoSubRoot.output).not.toStrictEqual(
        stringContainingErrorMessage(
          'warn',
          `${Fixtures.badMonorepo.unnamedPkgMapData[12][1].root}/package.json`,
          ErrorMessage.PackageJsonIllegalKey('version')
        )
      );

      expect(polyrepoRoot.output).not.toStrictEqual(
        stringContainingErrorMessage(
          'warn',
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
          'warn',
          `${Fixtures.badMonorepo.root}/package.json`,
          ErrorMessage.PackageJsonMissingKey('config.codecov.flag')
        )
      );

      expect(monorepoSubRoot.output).toStrictEqual(
        stringContainingErrorMessage(
          'warn',
          `${Fixtures.badMonorepo.unnamedPkgMapData[0][1].root}/package.json`,
          ErrorMessage.PackageJsonMissingKey('config.codecov.flag')
        )
      );

      expect(polyrepoRoot.output).not.toStrictEqual(
        stringContainingErrorMessage(
          'warn',
          `${Fixtures.badPolyrepo.root}/package.json`,
          ErrorMessage.PackageJsonMissingKey('config.codecov.flag')
        )
      );
    });

    it('errors when sub-root code imports another sub-root without also listing it under "dependency" in package.json (i.e. an unlisted cross-dependency)', async () => {
      expect.hasAssertions();
      // TODO: sub-root but does NOT fail on monorepo root or polyrepo. However,
      // TODO: does NOT error on unlisted self-referential imports

      // TODO: Check for PackageJsonMissingExportCheckSkipped
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
