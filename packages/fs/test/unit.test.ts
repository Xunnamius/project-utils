// * These tests ensure the exported interface under test functions as expected.

import { accessSync, readFileSync } from 'node:fs';
import { access as accessAsync, readFile as readFileAsync } from 'node:fs/promises';

import { repositories } from '@-xun/common-dummies/repositories';
import { memoizer } from '@-xun/memoize';
import { runNoRejectOnBadExit } from '@-xun/run';
import { toss } from 'toss-expression';

import {
  deriveVirtualGitignoreLines,
  deriveVirtualPrettierignoreLines,
  isAccessible,
  readJson,
  readJsonc,
  readXPackageJsonAtRoot
} from 'universe+fs';

import { FsErrorMessage } from 'universe+fs:error.ts';

import { asMocked } from 'testverse:util.ts';

import type { AbsolutePath } from '@-xun/fs';

jest.mock('node:fs');
jest.mock('node:fs/promises');
jest.mock('@-xun/run');

const mockedReadFileSync = asMocked(readFileSync);
const mockedReadFileAsync = asMocked(readFileAsync);
const mockedAccessSync = asMocked(accessSync);
const mockedAccessAsync = asMocked(accessAsync);
const mockedRun = asMocked(runNoRejectOnBadExit);

afterEach(() => {
  memoizer.clearAll();
});

describe('::isAccessible', () => {
  describe('<synchronous>', () => {
    it('returns true for path with default accessibility (R_OK)', () => {
      expect.hasAssertions();

      mockedAccessSync.mockImplementation(() => undefined);

      expect(
        isAccessible.sync('/pretend/it/does/exist', { useCached: true })
      ).toBeTrue();
    });

    it('returns true for path with default accessibility (R_OK) using file URL string', () => {
      expect.hasAssertions();

      mockedAccessSync.mockImplementation(jest.requireActual('node:fs').accessSync);

      expect(
        isAccessible.sync(repositories.goodPolyrepo.root, { useCached: true })
      ).toBeTrue();

      expect(
        isAccessible.sync(`file://${repositories.goodPolyrepo.root}`, {
          useCached: true
        })
      ).toBeTrue();
    });

    it('returns false for path without default accessibility (R_OK)', () => {
      expect.hasAssertions();

      mockedAccessSync.mockImplementation(() => toss(new Error('nope')));

      expect(
        isAccessible.sync('/pretend/it/does/exist', { useCached: true })
      ).toBeFalse();
    });

    it('returns false for non-existent path', () => {
      expect.hasAssertions();

      mockedAccessSync.mockImplementation(() => toss(new Error('no')));

      expect(isAccessible.sync('/does/not/exist', { useCached: true })).toBeFalse();
    });

    it('returns result from internal cache if available unless useCached is false (new result is always added to internal cache)', () => {
      expect.hasAssertions();

      mockedAccessSync.mockImplementation(() => undefined);

      expect(
        isAccessible.sync('/pretend/it/does/exist', { useCached: false })
      ).toBeTrue();

      mockedAccessSync.mockImplementation(() => toss(new Error('no')));

      expect(
        isAccessible.sync('/pretend/it/does/exist', { useCached: true })
      ).toBeTrue();

      mockedAccessSync.mockImplementation(() => toss(new Error('no')));

      expect(
        isAccessible.sync('/pretend/it/does/exist', { useCached: false })
      ).toBeFalse();

      mockedAccessSync.mockImplementation(() => undefined);

      expect(isAccessible.sync('/different/path', { useCached: true })).toBeTrue();
    });
  });

  describe('<asynchronous>', () => {
    it('returns true for path with default accessibility (R_OK)', async () => {
      expect.hasAssertions();

      mockedAccessAsync.mockImplementation(() => Promise.resolve());

      await expect(
        isAccessible('/pretend/it/does/exist', { useCached: true })
      ).resolves.toBeTrue();
    });

    it('returns true for path with default accessibility (R_OK) using file URL string', async () => {
      expect.hasAssertions();

      mockedAccessAsync.mockImplementation(
        jest.requireActual('node:fs/promises').access
      );

      await expect(
        isAccessible(repositories.goodPolyrepo.root, { useCached: true })
      ).resolves.toBeTrue();

      await expect(
        isAccessible(`file://${repositories.goodPolyrepo.root}`, { useCached: true })
      ).resolves.toBeTrue();
    });

    it('returns false for path without default accessibility (R_OK)', async () => {
      expect.hasAssertions();

      mockedAccessAsync.mockImplementation(() => Promise.reject(new Error('nope')));

      await expect(
        isAccessible('/pretend/it/does/exist', { useCached: true })
      ).resolves.toBeFalse();
    });

    it('returns false for non-existent path', async () => {
      expect.hasAssertions();

      mockedAccessAsync.mockImplementation(() => Promise.reject(new Error('no')));

      await expect(
        isAccessible('/does/not/exist', { useCached: true })
      ).resolves.toBeFalse();
    });

    it('returns result from internal cache if available unless useCached is false (new result is always added to internal cache)', async () => {
      expect.hasAssertions();

      mockedAccessAsync.mockImplementation(() => Promise.resolve());

      await expect(
        isAccessible('/pretend/it/does/exist', { useCached: false })
      ).resolves.toBeTrue();

      mockedAccessAsync.mockImplementation(() => Promise.reject(new Error('no')));

      await expect(
        isAccessible('/pretend/it/does/exist', { useCached: true })
      ).resolves.toBeTrue();

      mockedAccessAsync.mockImplementation(() => Promise.reject(new Error('no')));

      await expect(
        isAccessible('/pretend/it/does/exist', { useCached: false })
      ).resolves.toBeFalse();

      mockedAccessAsync.mockImplementation(() => Promise.resolve());

      await expect(
        isAccessible('/different/path', { useCached: true })
      ).resolves.toBeTrue();
    });
  });
});

describe('::readJson', () => {
  describe('<synchronous>', () => {
    it('accepts a package.json path and returns its parsed contents', () => {
      expect.hasAssertions();

      const expectedJson = { name: 'good-package-json-name' };
      mockedReadFileSync.mockImplementation(() => JSON.stringify(expectedJson));

      expect(
        readJson.sync('/fake/path/package.json' as AbsolutePath, { useCached: true })
      ).toStrictEqual(expectedJson);
    });

    it('throws on read failure', () => {
      expect.hasAssertions();

      mockedReadFileSync.mockImplementation(() => toss(new Error('contrived')));

      expect(() =>
        readJson.sync('/does/not/exist/package.json' as AbsolutePath, {
          useCached: true
        })
      ).toThrow(FsErrorMessage.NotReadable('/does/not/exist/package.json'));
    });

    it('throws on parse failure', () => {
      expect.hasAssertions();

      const path = '/fake/path/package.json' as AbsolutePath;
      mockedReadFileSync.mockImplementation(() => '{{');

      expect(() => readJson.sync(path, { useCached: true })).toThrow(
        FsErrorMessage.NotParsable(path)
      );
    });

    it('does not throw on read failure when try is true', () => {
      expect.hasAssertions();

      mockedReadFileSync.mockImplementation(() => toss(new Error('contrived')));

      expect(
        readJson.sync('/does/not/exist/package.json' as AbsolutePath, {
          useCached: true,
          try: true
        })
      ).toBeEmptyObject();
    });

    it('does not throw on parse failure when try is true', () => {
      expect.hasAssertions();

      const path = '/fake/path/package.json' as AbsolutePath;
      mockedReadFileSync.mockImplementation(() => '{{');

      expect(readJson.sync(path, { useCached: true, try: true })).toBeEmptyObject();
    });

    it('returns result from internal cache if available unless useCached is false (new result is always added to internal cache)', () => {
      expect.hasAssertions();

      const expectedJson = { name: 'good-package-json-name' };

      mockedReadFileSync.mockImplementation(() => JSON.stringify(expectedJson));

      const json = readJson.sync('/fake/path/package.json' as AbsolutePath, {
        useCached: false
      });

      expect(json).toStrictEqual(expectedJson);

      expect(
        readJson.sync('/fake/path/package.json' as AbsolutePath, { useCached: true })
      ).toBe(json);

      const updatedJson = readJson.sync('/fake/path/package.json' as AbsolutePath, {
        useCached: false
      });

      expect(updatedJson).not.toBe(json);

      expect(
        readJson.sync('/fake/path/package.json' as AbsolutePath, { useCached: true })
      ).toBe(updatedJson);
    });
  });

  describe('<asynchronous>', () => {
    it('accepts a package.json path and returns its parsed contents', async () => {
      expect.hasAssertions();

      const expectedJson = { name: 'good-package-json-name' };

      mockedReadFileAsync.mockImplementation(() =>
        Promise.resolve(JSON.stringify(expectedJson))
      );

      await expect(
        readJson('/fake/path/package.json' as AbsolutePath, { useCached: true })
      ).resolves.toStrictEqual(expectedJson);
    });

    it('throws on read failure', async () => {
      expect.hasAssertions();

      mockedReadFileAsync.mockImplementation(() => Promise.reject());

      await expect(
        readJson('/does/not/exist/package.json' as AbsolutePath, { useCached: true })
      ).rejects.toThrow(FsErrorMessage.NotReadable('/does/not/exist/package.json'));
    });

    it('throws on parse failure', async () => {
      expect.hasAssertions();

      const path = '/fake/path/package.json' as AbsolutePath;
      mockedReadFileAsync.mockImplementation(() => Promise.resolve('{{'));

      await expect(readJson(path, { useCached: true })).rejects.toThrow(
        FsErrorMessage.NotParsable(path)
      );
    });

    it('does not throw on read failure when try is true', async () => {
      expect.hasAssertions();

      mockedReadFileAsync.mockImplementation(() => Promise.reject());

      await expect(
        readJson('/does/not/exist/package.json' as AbsolutePath, {
          useCached: true,
          try: true
        })
      ).resolves.toBeEmptyObject();
    });

    it('does not throw on parse failure when try is true', async () => {
      expect.hasAssertions();

      const path = '/fake/path/package.json' as AbsolutePath;
      mockedReadFileAsync.mockImplementation(() => Promise.resolve('{{'));

      await expect(
        readJson(path, { useCached: true, try: true })
      ).resolves.toBeEmptyObject();
    });

    it('returns result from internal cache if available unless useCached is false (new result is always added to internal cache)', async () => {
      expect.hasAssertions();

      const expectedJson = { name: 'good-package-json-name' };

      mockedReadFileAsync.mockImplementation(() =>
        Promise.resolve(JSON.stringify(expectedJson))
      );

      const json = await readJson('/fake/path/package.json' as AbsolutePath, {
        useCached: false
      });

      expect(json).toStrictEqual(expectedJson);

      await expect(
        readJson('/fake/path/package.json' as AbsolutePath, { useCached: true })
      ).resolves.toBe(json);

      const updatedJson = await readJson('/fake/path/package.json' as AbsolutePath, {
        useCached: false
      });

      expect(updatedJson).not.toBe(json);

      await expect(
        readJson('/fake/path/package.json' as AbsolutePath, { useCached: true })
      ).resolves.toBe(updatedJson);
    });
  });
});

describe('::readJsonc', () => {
  describe('<synchronous>', () => {
    it('accepts a package.json path and returns its parsed contents', () => {
      expect.hasAssertions();

      const expectedJson = { name: 'good-package-json-name' };
      mockedReadFileSync.mockImplementation(() => JSON.stringify(expectedJson));

      expect(
        readJsonc.sync('/fake/path/package.json' as AbsolutePath, { useCached: true })
      ).toStrictEqual(expectedJson);
    });

    it('throws on read failure', () => {
      expect.hasAssertions();

      mockedReadFileSync.mockImplementation(() => toss(new Error('contrived')));

      expect(() =>
        readJsonc.sync('/does/not/exist/package.json' as AbsolutePath, {
          useCached: true
        })
      ).toThrow(FsErrorMessage.NotReadable('/does/not/exist/package.json'));
    });

    it('throws on parse failure', () => {
      expect.hasAssertions();

      const path = '/fake/path/package.json' as AbsolutePath;
      mockedReadFileSync.mockImplementation(() => '{{');

      expect(() => readJsonc.sync(path, { useCached: true })).toThrow(
        FsErrorMessage.NotParsable(path)
      );
    });

    it('does not throw on read failure when try is true', () => {
      expect.hasAssertions();

      mockedReadFileSync.mockImplementation(() => toss(new Error('contrived')));

      expect(
        readJsonc.sync('/does/not/exist/package.json' as AbsolutePath, {
          useCached: true,
          try: true
        })
      ).toBeEmptyObject();
    });

    it('does not throw on parse failure when try is true', () => {
      expect.hasAssertions();

      const path = '/fake/path/package.json' as AbsolutePath;
      mockedReadFileSync.mockImplementation(() => '{{');

      expect(readJsonc.sync(path, { useCached: true, try: true })).toBeEmptyObject();
    });

    it('returns result from internal cache if available unless useCached is false (new result is always added to internal cache)', () => {
      expect.hasAssertions();

      const expectedJson = { name: 'good-package-json-name' };

      mockedReadFileSync.mockImplementation(() => JSON.stringify(expectedJson));

      const json = readJsonc.sync('/fake/path/package.json' as AbsolutePath, {
        useCached: false
      });

      expect(json).toStrictEqual(expectedJson);

      expect(
        readJsonc.sync('/fake/path/package.json' as AbsolutePath, { useCached: true })
      ).toBe(json);

      const updatedJson = readJsonc.sync('/fake/path/package.json' as AbsolutePath, {
        useCached: false
      });

      expect(updatedJson).not.toBe(json);

      expect(
        readJsonc.sync('/fake/path/package.json' as AbsolutePath, { useCached: true })
      ).toBe(updatedJson);
    });
  });

  describe('<asynchronous>', () => {
    it('accepts a package.json path and returns its parsed contents', async () => {
      expect.hasAssertions();

      const expectedJson = { name: 'good-package-json-name' };

      mockedReadFileAsync.mockImplementation(() =>
        Promise.resolve(JSON.stringify(expectedJson))
      );

      await expect(
        readJsonc('/fake/path/package.json' as AbsolutePath, { useCached: true })
      ).resolves.toStrictEqual(expectedJson);
    });

    it('throws on read failure', async () => {
      expect.hasAssertions();

      mockedReadFileAsync.mockImplementation(() => Promise.reject('fail'));

      await expect(
        readJsonc('/does/not/exist/package.json' as AbsolutePath, { useCached: true })
      ).rejects.toThrow(FsErrorMessage.NotReadable('/does/not/exist/package.json'));
    });

    it('throws on parse failure', async () => {
      expect.hasAssertions();

      const path = '/fake/path/package.json' as AbsolutePath;
      mockedReadFileAsync.mockImplementation(() => Promise.resolve('{{'));

      await expect(readJsonc(path, { useCached: true })).rejects.toThrow(
        FsErrorMessage.NotParsable(path)
      );
    });

    it('does not throw on read failure when try is true', async () => {
      expect.hasAssertions();

      mockedReadFileAsync.mockImplementation(() => Promise.reject('fail'));

      await expect(
        readJsonc('/does/not/exist/package.json' as AbsolutePath, {
          useCached: true,
          try: true
        })
      ).resolves.toBeEmptyObject();
    });

    it('does not throw on parse failure when try is true', async () => {
      expect.hasAssertions();

      const path = '/fake/path/package.json' as AbsolutePath;
      mockedReadFileAsync.mockImplementation(() => Promise.resolve('{{'));

      await expect(
        readJsonc(path, { useCached: true, try: true })
      ).resolves.toBeEmptyObject();
    });

    it('returns result from internal cache if available unless useCached is false (new result is always added to internal cache)', async () => {
      expect.hasAssertions();

      const expectedJson = { name: 'good-package-json-name' };

      mockedReadFileAsync.mockImplementation(() =>
        Promise.resolve(JSON.stringify(expectedJson))
      );

      const json = await readJsonc('/fake/path/package.json' as AbsolutePath, {
        useCached: false
      });

      expect(json).toStrictEqual(expectedJson);

      await expect(
        readJsonc('/fake/path/package.json' as AbsolutePath, { useCached: true })
      ).resolves.toBe(json);

      const updatedJson = await readJsonc('/fake/path/package.json' as AbsolutePath, {
        useCached: false
      });

      expect(updatedJson).not.toBe(json);

      await expect(
        readJsonc('/fake/path/package.json' as AbsolutePath, { useCached: true })
      ).resolves.toBe(updatedJson);
    });
  });
});

describe('::readXPackageJsonAtRoot', () => {
  describe('<synchronous>', () => {
    it('accepts a package directory and returns parsed package.json contents', async () => {
      expect.hasAssertions();

      const expectedJson = { name: 'good-package-json-name' };
      mockedReadFileSync.mockImplementation(() => JSON.stringify(expectedJson));

      expect(
        readXPackageJsonAtRoot.sync(repositories.goodPolyrepo.root, { useCached: true })
      ).toStrictEqual(expectedJson);
    });

    it('throws on read failure', () => {
      expect.hasAssertions();

      mockedReadFileSync.mockImplementation(() => toss(new Error('contrived')));

      expect(() =>
        readXPackageJsonAtRoot.sync('/does/not/exist' as AbsolutePath, {
          useCached: true
        })
      ).toThrow('/does/not/exist/package.json');
    });

    it('throws on parse failure', () => {
      expect.hasAssertions();

      mockedReadFileSync.mockImplementation(() => '{{');

      expect(() =>
        readXPackageJsonAtRoot.sync(repositories.goodPolyrepo.root, { useCached: true })
      ).toThrow(`${repositories.goodPolyrepo.root}/package.json`);
    });

    it('throws on parse failure when package.json is not valid XPackageJson', () => {
      expect.hasAssertions();

      mockedReadFileSync.mockImplementation(() => '{}');

      expect(() =>
        readXPackageJsonAtRoot.sync(repositories.goodPolyrepo.root, { useCached: true })
      ).toThrow(FsErrorMessage.IsNotXPackageJson());
    });

    it('does not throw on read failure when try is true', () => {
      expect.hasAssertions();

      mockedReadFileSync.mockImplementation(() => toss(new Error('contrived')));

      expect(
        readXPackageJsonAtRoot.sync('/does/not/exist' as AbsolutePath, {
          useCached: true,
          try: true
        })
      ).toBeEmptyObject();
    });

    it('does not throw on parse failure when try is true', () => {
      expect.hasAssertions();

      mockedReadFileSync.mockImplementation(() => '{{');

      expect(
        readXPackageJsonAtRoot.sync(repositories.goodPolyrepo.root, {
          useCached: true,
          try: true
        })
      ).toBeEmptyObject();
    });

    it('does not throw on parse failure when package.json is not valid XPackageJson but try is true', () => {
      expect.hasAssertions();

      mockedReadFileSync.mockImplementation(() => '{}');

      expect(
        readXPackageJsonAtRoot.sync(repositories.goodPolyrepo.root, {
          useCached: true,
          try: true
        })
      ).toBeEmptyObject();
    });

    it('returns result from internal cache if available unless useCached is false (new result is always added to internal cache)', () => {
      expect.hasAssertions();

      const expectedJson = { name: 'good-package-json-name' };
      mockedReadFileSync.mockImplementation(() => JSON.stringify(expectedJson));

      const json = readXPackageJsonAtRoot.sync(
        '/fake/path/package.json' as AbsolutePath,
        {
          useCached: false
        }
      );

      expect(json).toStrictEqual(expectedJson);

      expect(
        readXPackageJsonAtRoot.sync('/fake/path/package.json' as AbsolutePath, {
          useCached: true
        })
      ).toBe(json);

      const updatedJson = readXPackageJsonAtRoot.sync(
        '/fake/path/package.json' as AbsolutePath,
        { useCached: false }
      );

      expect(updatedJson).not.toBe(json);

      expect(
        readXPackageJsonAtRoot.sync('/fake/path/package.json' as AbsolutePath, {
          useCached: true
        })
      ).toBe(updatedJson);
    });
  });

  describe('<asynchronous>', () => {
    it('accepts a package directory and returns parsed package.json contents', async () => {
      expect.hasAssertions();

      const expectedJson = { name: 'good-package-json-name' };
      mockedReadFileAsync.mockImplementation(() =>
        Promise.resolve(JSON.stringify(expectedJson))
      );

      await expect(
        readXPackageJsonAtRoot(repositories.goodPolyrepo.root, { useCached: true })
      ).resolves.toStrictEqual(expectedJson);
    });

    it('throws on read failure', async () => {
      expect.hasAssertions();

      mockedReadFileAsync.mockImplementation(() => Promise.reject('fail'));

      await expect(
        readXPackageJsonAtRoot('/does/not/exist' as AbsolutePath, { useCached: true })
      ).rejects.toThrow('/does/not/exist/package.json');
    });

    it('throws on parse failure', async () => {
      expect.hasAssertions();

      mockedReadFileAsync.mockImplementation(() => Promise.resolve('{{'));

      await expect(
        readXPackageJsonAtRoot(repositories.goodPolyrepo.root, { useCached: true })
      ).rejects.toThrow(`${repositories.goodPolyrepo.root}/package.json`);
    });

    it('throws on parse failure when package.json is not valid XPackageJson', async () => {
      expect.hasAssertions();

      mockedReadFileAsync.mockImplementation(() => Promise.resolve('{}'));

      await expect(
        readXPackageJsonAtRoot(repositories.goodPolyrepo.root, { useCached: true })
      ).rejects.toThrow(FsErrorMessage.IsNotXPackageJson());
    });

    it('does not throw on read failure when try is true', async () => {
      expect.hasAssertions();

      mockedReadFileAsync.mockImplementation(() => Promise.reject('fail'));

      await expect(
        readXPackageJsonAtRoot('/does/not/exist' as AbsolutePath, {
          useCached: true,
          try: true
        })
      ).resolves.toBeEmptyObject();
    });

    it('does not throw on parse failure when try is true', async () => {
      expect.hasAssertions();

      mockedReadFileAsync.mockImplementation(() => Promise.resolve('{{'));

      await expect(
        readXPackageJsonAtRoot(repositories.goodPolyrepo.root, {
          useCached: true,
          try: true
        })
      ).resolves.toBeEmptyObject();
    });

    it('does not throw on parse failure when package.json is not valid XPackageJson but try is true', () => {
      expect.hasAssertions();

      mockedReadFileSync.mockImplementation(() => '{}');

      expect(
        readXPackageJsonAtRoot.sync(repositories.goodPolyrepo.root, {
          useCached: true,
          try: true
        })
      ).toBeEmptyObject();
    });

    it('returns result from internal cache if available unless useCached is false (new result is always added to internal cache)', async () => {
      expect.hasAssertions();

      const expectedJson = { name: 'good-package-json-name' };

      mockedReadFileAsync.mockImplementation(() =>
        Promise.resolve(JSON.stringify(expectedJson))
      );

      const json = await readXPackageJsonAtRoot(
        '/fake/path/package.json' as AbsolutePath,
        { useCached: false }
      );

      expect(json).toStrictEqual(expectedJson);

      await expect(
        readXPackageJsonAtRoot('/fake/path/package.json' as AbsolutePath, {
          useCached: true
        })
      ).resolves.toBe(json);

      const updatedJson = await readXPackageJsonAtRoot(
        '/fake/path/package.json' as AbsolutePath,
        { useCached: false }
      );

      expect(updatedJson).not.toBe(json);

      await expect(
        readXPackageJsonAtRoot('/fake/path/package.json' as AbsolutePath, {
          useCached: true
        })
      ).resolves.toBe(updatedJson);
    });
  });
});

describe('::deriveVirtualPrettierignoreLines', () => {
  describe('<synchronous>', () => {
    it('returns lines from root .prettierignore file', () => {
      expect.hasAssertions();

      mockedReadFileSync.mockImplementation((path) => {
        expect(path).toBe('/fake/root/.prettierignore');

        return [
          '# should be ignored',
          'item-1',
          '# should be ignored',
          'item-2',
          '# should be ignored'
        ].join('\n');
      });

      expect(
        deriveVirtualPrettierignoreLines.sync('/fake/root' as AbsolutePath, {
          useCached: true
        })
      ).toStrictEqual(['.git', 'item-1', 'item-2']);
    });

    it('returns base array if .prettierignore does not exist', () => {
      expect.hasAssertions();

      mockedReadFileSync.mockImplementation(() => toss(new Error('contrived')));

      expect(
        deriveVirtualPrettierignoreLines.sync('/fake/root' as AbsolutePath, {
          useCached: true
        })
      ).toStrictEqual(['.git']);
    });

    it('triggers a type error given bad sync options', () => {
      expect.hasAssertions();

      expect(() =>
        deriveVirtualPrettierignoreLines.sync('/fake/root' as AbsolutePath, {
          useCached: true,
          // @ts-expect-error: we expect this to fail or something's wrong
          includeUnknownPaths: true
        })
      ).toThrow(FsErrorMessage.DeriverAsyncConfigurationConflict());
    });

    it('returns result from internal cache if available unless useCached is false (new result is always added to internal cache)', () => {
      expect.hasAssertions();

      mockedReadFileSync.mockImplementation((path) => {
        expect(path).toBe('/fake/root/.prettierignore');

        return [
          '# should be ignored',
          'item-1',
          '# should be ignored',
          'item-2',
          '# should be ignored'
        ].join('\n');
      });

      const result = deriveVirtualPrettierignoreLines.sync(
        '/fake/root' as AbsolutePath,
        {
          useCached: false
        }
      );

      expect(result).toStrictEqual(['.git', 'item-1', 'item-2']);

      expect(
        deriveVirtualPrettierignoreLines.sync('/fake/root' as AbsolutePath, {
          useCached: true
        })
      ).toBe(result);

      const updatedResult = deriveVirtualPrettierignoreLines.sync(
        '/fake/root' as AbsolutePath,
        { useCached: false }
      );

      expect(updatedResult).not.toBe(result);

      expect(
        deriveVirtualPrettierignoreLines.sync('/fake/root' as AbsolutePath, {
          useCached: true
        })
      ).toBe(updatedResult);
    });
  });

  describe('<asynchronous>', () => {
    it('returns lines from root .prettierignore file', async () => {
      expect.hasAssertions();

      mockedReadFileAsync.mockImplementation((path) => {
        expect(path).toBe('/fake/root/.prettierignore');

        return Promise.resolve(
          [
            '# should be ignored',
            'item-1',
            '# should be ignored',
            'item-2',
            '# should be ignored'
          ].join('\n')
        );
      });

      await expect(
        deriveVirtualPrettierignoreLines('/fake/root' as AbsolutePath, {
          useCached: true
        })
      ).resolves.toStrictEqual(['.git', 'item-1', 'item-2']);
    });

    it('returns base array if .prettierignore does not exist', async () => {
      expect.hasAssertions();

      mockedReadFileAsync.mockImplementation(() => Promise.reject());

      await expect(
        deriveVirtualPrettierignoreLines('/fake/root' as AbsolutePath, {
          useCached: true,
          includeUnknownPaths: false
        })
      ).resolves.toStrictEqual(['.git']);
    });

    it('returns lines from root .prettierignore file and unknown files from git if requested', async () => {
      expect.hasAssertions();

      mockedRun.mockImplementation(
        () =>
          Promise.resolve({
            stdout: ['.git', 'item-3', 'item-4'].join('\n')
          }) as ReturnType<typeof runNoRejectOnBadExit>
      );

      mockedReadFileAsync.mockImplementation((path) => {
        expect(path).toBe('/fake/root/.prettierignore');

        return Promise.resolve(
          [
            '# should be ignored',
            'item-1',
            '# should be ignored',
            'item-2',
            '# should be ignored'
          ].join('\n')
        );
      });

      await expect(
        deriveVirtualPrettierignoreLines('/fake/root' as AbsolutePath, {
          useCached: true,
          includeUnknownPaths: true
        })
      ).resolves.toStrictEqual(['.git', 'item-1', 'item-2', 'item-3', 'item-4']);
    });

    it('returns result from internal cache if available unless useCached is false (new result is always added to internal cache)', async () => {
      expect.hasAssertions();

      mockedReadFileAsync.mockImplementation((path) => {
        expect(path).toBe('/fake/root/.prettierignore');

        return Promise.resolve(
          [
            '# should be ignored',
            'item-1',
            '# should be ignored',
            'item-2',
            '# should be ignored'
          ].join('\n')
        );
      });

      const result = await deriveVirtualPrettierignoreLines(
        '/fake/root' as AbsolutePath,
        { useCached: false }
      );

      expect(result).toStrictEqual(['.git', 'item-1', 'item-2']);

      await expect(
        deriveVirtualPrettierignoreLines('/fake/root' as AbsolutePath, {
          useCached: true
        })
      ).resolves.toBe(result);

      const updatedResult = await deriveVirtualPrettierignoreLines(
        '/fake/root' as AbsolutePath,
        { useCached: false }
      );

      expect(updatedResult).not.toBe(result);

      await expect(
        deriveVirtualPrettierignoreLines('/fake/root' as AbsolutePath, {
          useCached: true
        })
      ).resolves.toBe(updatedResult);
    });
  });
});

describe('::deriveVirtualGitignoreLines', () => {
  describe('<synchronous>', () => {
    it('returns lines from root .gitignore file', () => {
      expect.hasAssertions();

      mockedReadFileSync.mockImplementation((path) => {
        expect(path).toBe('/fake/root/.gitignore');

        return [
          '# should be ignored',
          'item-1',
          '# should be ignored',
          'item-2',
          '# should be ignored'
        ].join('\n');
      });

      expect(
        deriveVirtualGitignoreLines.sync('/fake/root' as AbsolutePath, {
          useCached: true
        })
      ).toStrictEqual(['.git', 'item-1', 'item-2']);
    });

    it('returns base array if .gitignore does not exist', () => {
      expect.hasAssertions();

      mockedReadFileSync.mockImplementation(() => toss(new Error('contrived')));

      expect(
        deriveVirtualGitignoreLines.sync('/fake/root' as AbsolutePath, {
          useCached: true
        })
      ).toStrictEqual(['.git']);
    });

    it('triggers a type error given bad sync options', () => {
      expect.hasAssertions();

      expect(() =>
        deriveVirtualGitignoreLines.sync('/fake/root' as AbsolutePath, {
          useCached: true,
          // @ts-expect-error: we expect this to fail or something's wrong
          includeUnknownPaths: true
        })
      ).toThrow(FsErrorMessage.DeriverAsyncConfigurationConflict());
    });

    it('returns result from internal cache if available unless useCached is false (new result is always added to internal cache)', () => {
      expect.hasAssertions();

      mockedReadFileSync.mockImplementation((path) => {
        expect(path).toBe('/fake/root/.gitignore');

        return [
          '# should be ignored',
          'item-1',
          '# should be ignored',
          'item-2',
          '# should be ignored'
        ].join('\n');
      });

      const result = deriveVirtualGitignoreLines.sync('/fake/root' as AbsolutePath, {
        useCached: false
      });

      expect(result).toStrictEqual(['.git', 'item-1', 'item-2']);

      expect(
        deriveVirtualGitignoreLines.sync('/fake/root' as AbsolutePath, {
          useCached: true
        })
      ).toBe(result);

      const updatedResult = deriveVirtualGitignoreLines.sync(
        '/fake/root' as AbsolutePath,
        { useCached: false }
      );

      expect(updatedResult).not.toBe(result);

      expect(
        deriveVirtualGitignoreLines.sync('/fake/root' as AbsolutePath, {
          useCached: true
        })
      ).toBe(updatedResult);
    });
  });

  describe('<asynchronous>', () => {
    it('returns lines from root .gitignore file', async () => {
      expect.hasAssertions();

      mockedReadFileAsync.mockImplementation((path) => {
        expect(path).toBe('/fake/root/.gitignore');

        return Promise.resolve(
          [
            '# should be ignored',
            'item-1',
            '# should be ignored',
            'item-2',
            '# should be ignored'
          ].join('\n')
        );
      });

      await expect(
        deriveVirtualGitignoreLines('/fake/root' as AbsolutePath, { useCached: true })
      ).resolves.toStrictEqual(['.git', 'item-1', 'item-2']);
    });

    it('returns base array if .gitignore does not exist', async () => {
      expect.hasAssertions();

      mockedReadFileAsync.mockImplementation(() => Promise.reject());

      await expect(
        deriveVirtualGitignoreLines('/fake/root' as AbsolutePath, {
          useCached: true,
          includeUnknownPaths: true
        })
      ).resolves.toStrictEqual(['.git']);
    });

    it('returns lines from root .gitignore file and unknown files from git if requested', async () => {
      expect.hasAssertions();

      mockedRun.mockImplementation(
        () =>
          Promise.resolve({
            stdout: ['.git', 'item-3', 'item-4'].join('\n')
          }) as ReturnType<typeof runNoRejectOnBadExit>
      );

      mockedReadFileAsync.mockImplementation((path) => {
        expect(path).toBe('/fake/root/.gitignore');

        return Promise.resolve(
          [
            '# should be ignored',
            'item-1',
            '# should be ignored',
            'item-2',
            '# should be ignored'
          ].join('\n')
        );
      });

      await expect(
        deriveVirtualGitignoreLines('/fake/root' as AbsolutePath, {
          useCached: true,
          includeUnknownPaths: true
        })
      ).resolves.toStrictEqual(['.git', 'item-1', 'item-2', 'item-3', 'item-4']);
    });

    it('returns result from internal cache if available unless useCached is false (new result is always added to internal cache)', async () => {
      expect.hasAssertions();

      mockedReadFileAsync.mockImplementation((path) => {
        expect(path).toBe('/fake/root/.gitignore');

        return Promise.resolve(
          [
            '# should be ignored',
            'item-1',
            '# should be ignored',
            'item-2',
            '# should be ignored'
          ].join('\n')
        );
      });

      const result = await deriveVirtualGitignoreLines('/fake/root' as AbsolutePath, {
        useCached: false
      });

      expect(result).toStrictEqual(['.git', 'item-1', 'item-2']);

      await expect(
        deriveVirtualGitignoreLines('/fake/root' as AbsolutePath, {
          useCached: true
        })
      ).resolves.toBe(result);

      const updatedResult = await deriveVirtualGitignoreLines(
        '/fake/root' as AbsolutePath,
        { useCached: false }
      );

      expect(updatedResult).not.toBe(result);

      await expect(
        deriveVirtualGitignoreLines('/fake/root' as AbsolutePath, {
          useCached: true
        })
      ).resolves.toBe(updatedResult);
    });
  });
});
