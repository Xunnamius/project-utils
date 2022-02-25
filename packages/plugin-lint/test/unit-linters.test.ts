import { Fixtures } from 'testverse/fixtures';
import { toss } from 'toss-expression';
import { ErrorMessage } from '../src/errors';
import * as Linters from '../src/linters';

// TODO: test all the combinations of error/warning messages
describe('::runProjectLinter', () => {
  test('errors if project root is not a git repo', async () => {
    expect.hasAssertions();

    await expect(
      Linters.runProjectLinter({ rootDir: '/does/not/exist' })
    ).resolves.toStrictEqual({
      success: false,
      summary: expect.stringContaining('1 error, 0 warnings'),
      output: expect.stringContaining(ErrorMessage.NotAGitRepository())
    });
  });

  test('errors if project root is missing package.json', async () => {
    expect.hasAssertions();

    await expect(
      Linters.runProjectLinter({ rootDir: Fixtures.badPolyrepoNoPackageJson.root })
    ).resolves.toStrictEqual({
      success: false,
      summary: expect.stringContaining('1 error, 0 warnings'),
      output: expect.stringContaining(
        ErrorMessage.MissingFile(`${Fixtures.badPolyrepoNoPackageJson.root}/package.json`)
      )
    });
  });

  test('errors if project root has unparsable package.json', async () => {
    expect.hasAssertions();

    jest.spyOn(JSON, 'parse').mockImplementation(() => toss(new Error('badness')));

    await expect(
      Linters.runProjectLinter({ rootDir: Fixtures.goodMonorepo.root })
    ).resolves.toStrictEqual({
      success: false,
      summary: expect.stringContaining('1 error, 0 warnings'),
      output: expect.stringContaining(
        ErrorMessage.PackageJsonUnparsable(`${Fixtures.goodMonorepo.root}/package.json`)
      )
    });
  });

  test('errors if monorepo package has unparsable package.json', async () => {
    expect.hasAssertions();

    const parse = JSON.parse;
    jest
      .spyOn(JSON, 'parse')
      .mockImplementationOnce(parse)
      .mockImplementationOnce(parse)
      .mockImplementationOnce(() => toss(new Error('badness')));

    await expect(
      Linters.runProjectLinter({ rootDir: Fixtures.goodMonorepo.root })
    ).resolves.toStrictEqual({
      success: false,
      summary: expect.stringContaining('1 error, 0 warnings'),
      output: expect.stringContaining(
        ErrorMessage.PackageJsonUnparsable(
          `${Fixtures.goodMonorepo.namedPkgMapData[1][1].root}/package.json`
        )
      )
    });
  });

  test('errors if two monorepo packages share the same name', async () => {
    expect.hasAssertions();

    await expect(
      Linters.runProjectLinter({ rootDir: Fixtures.badMonorepoDuplicateName.root })
    ).resolves.toStrictEqual({
      success: false,
      summary: expect.stringContaining('1 error, 0 warnings'),
      output: expect.stringMatching(/"pkg".+?\/pkg-1.+?\/pkg-2/ms)
    });
  });

  test('errors if two unnamed monorepo packages share the same package-id', async () => {
    expect.hasAssertions();

    await expect(
      Linters.runProjectLinter({ rootDir: Fixtures.badMonorepoDuplicateId.root })
    ).resolves.toStrictEqual({
      success: false,
      summary: expect.stringContaining('1 error, 0 warnings'),
      output: expect.stringMatching(/"pkg-1".+?\/pkg-1.+?\/pkg-1/ms)
    });
  });
});

describe('::runTypescriptLinter', () => {
  test('todo', async () => {
    expect.hasAssertions();
  });
});

describe('::runEslintLinter', () => {
  test('todo', async () => {
    expect.hasAssertions();
  });
});

describe('::runRemarkLinter', () => {
  test('todo', async () => {
    expect.hasAssertions();
  });
});
