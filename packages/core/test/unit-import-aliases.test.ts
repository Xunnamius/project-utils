import * as Alias from 'pkgverse/core/src/import-aliases';

import { withMockedOutput } from 'testverse/setup';

beforeEach(() => {
  jest.spyOn(Alias, 'getRawAliases').mockReturnValue({
    a: './a',
    '^b': './.b.json',
    c$: '<rootDir>/c',
    '^d$': '<rootDir>/.d.json',
    'e/(.*)$': './.e/e/e/e/$1',
    '^f/(.*)$': '<rootDir>/f/f/$1',
    'g/(.*)$': './$1',
    'h/(.*)$': '<rootDir>/$1'
  } as unknown as ReturnType<typeof Alias.getRawAliases>);

  jest.spyOn(process, 'cwd').mockReturnValue('/some/fake/packages/dir');
});

describe('::getRawAliases', () => {
  test('hardcoded aliases are all valid', async () => {
    expect.hasAssertions();
    jest.restoreAllMocks();

    await withMockedOutput(() => {
      Object.entries(Alias.getRawAliases()).map((mapping) => {
        expect(() => Alias.getProcessedAliasMapping({ mapping })).not.toThrow();
      });
    });
  });
});

describe('::getProcessedAliasMapping', () => {
  it('warns when using a relative alias map value (path) when warn = true', async () => {
    expect.hasAssertions();

    await withMockedOutput(({ warnSpy }) => {
      Alias.getProcessedAliasMapping({ mapping: ['a', '<rootDir>/a'] });
      expect(warnSpy).not.toBeCalled();
    });

    await withMockedOutput(({ warnSpy }) => {
      Alias.getProcessedAliasMapping({
        mapping: ['a', './a'],
        issueTypescriptWarning: true
      });
      expect(warnSpy).toBeCalled();
    });
  });

  it('does not throw on valid alias:path combos', async () => {
    expect.hasAssertions();

    await withMockedOutput(() => {
      expect(() =>
        Alias.getProcessedAliasMapping({ mapping: ['a', './a'] })
      ).not.toThrow();

      expect(() =>
        Alias.getProcessedAliasMapping({ mapping: ['a', '<rootDir>/a'] })
      ).not.toThrow();

      expect(() =>
        Alias.getProcessedAliasMapping({ mapping: ['a$', '<rootDir>/a'] })
      ).not.toThrow();

      expect(() =>
        Alias.getProcessedAliasMapping({ mapping: ['a/(.*)$', '<rootDir>/a/$1'] })
      ).not.toThrow();

      expect(() =>
        Alias.getProcessedAliasMapping({ mapping: ['^a/(.*)$', '<rootDir>/a/$1'] })
      ).not.toThrow();
    });
  });

  it('throws on bad alias:path "a":"a"', async () => {
    expect.hasAssertions();

    expect(() => Alias.getProcessedAliasMapping({ mapping: ['a', 'a'] })).toThrow(
      /invalid syntax/
    );
  });

  it('throws on bad alias:path "a/b":"./a"', async () => {
    expect.hasAssertions();

    expect(() => Alias.getProcessedAliasMapping({ mapping: ['a/b', './a'] })).toThrow(
      /invalid syntax/
    );
  });

  it('throws on bad alias:path "$":"./a"', async () => {
    expect.hasAssertions();

    expect(() => Alias.getProcessedAliasMapping({ mapping: ['$', './a'] })).toThrow(
      /invalid syntax/
    );
  });

  it('throws on bad alias:path "$$":"./a"', async () => {
    expect.hasAssertions();

    expect(() => Alias.getProcessedAliasMapping({ mapping: ['$$', './a'] })).toThrow(
      /invalid syntax/
    );
  });

  it('throws on bad alias:path "a/":"./a"', async () => {
    expect.hasAssertions();

    expect(() => Alias.getProcessedAliasMapping({ mapping: ['a/', './a'] })).toThrow(
      /invalid syntax/
    );
  });

  it('throws on bad alias:path "a/(.*)$/(.*)$":"./a"', async () => {
    expect.hasAssertions();

    expect(() =>
      Alias.getProcessedAliasMapping({ mapping: ['a/(.*)$/(.*)$', './a'] })
    ).toThrow(/invalid syntax/);
  });

  it('throws on bad path ".d.json"', async () => {
    expect.hasAssertions();

    expect(() => Alias.getProcessedAliasMapping({ mapping: ['a', '.d.json'] })).toThrow(
      /invalid syntax/
    );
  });

  it('throws on bad path "e/e/e/e.json"', async () => {
    expect.hasAssertions();

    expect(() =>
      Alias.getProcessedAliasMapping({ mapping: ['a', 'e/e/e/e.json'] })
    ).toThrow(/invalid syntax/);
  });

  it('throws on bad path ".e/e/e/e.json"', async () => {
    expect.hasAssertions();

    expect(() =>
      Alias.getProcessedAliasMapping({ mapping: ['a', '.e/e/e/e.json'] })
    ).toThrow(/invalid syntax/);
  });

  it('throws on bad path "<rootDir>e/e/e/e.json"', async () => {
    expect.hasAssertions();

    expect(() =>
      Alias.getProcessedAliasMapping({ mapping: ['a', '<rootDir>e/e/e/e.json'] })
    ).toThrow(/invalid syntax/);
  });

  it('throws on bad path "./e.json/"', async () => {
    expect.hasAssertions();

    expect(() => Alias.getProcessedAliasMapping({ mapping: ['a', './e.json/'] })).toThrow(
      /invalid syntax/
    );
  });

  it('throws on bad alias:path "a/(.*)$":"."', async () => {
    expect.hasAssertions();

    expect(() => Alias.getProcessedAliasMapping({ mapping: ['a/(.*)$', '.'] })).toThrow(
      /must end with "\/\$1"/
    );
  });

  it('throws on bad alias:path "a/(.*)$":"<rootDir>"', async () => {
    expect.hasAssertions();

    expect(() =>
      Alias.getProcessedAliasMapping({ mapping: ['a/(.*)$', '<rootDir>'] })
    ).toThrow(/must end with "\/\$1"/);
  });

  it('throws on bad alias:path "a/(.*)$":"<rootDir>/some/path"', async () => {
    expect.hasAssertions();

    expect(() =>
      Alias.getProcessedAliasMapping({ mapping: ['a/(.*)$', '<rootDir>/some/path'] })
    ).toThrow(/must end with "\/\$1"/);
  });

  it('throws on bad alias:path "a":"<rootDir>/$1"', async () => {
    expect.hasAssertions();

    expect(() =>
      Alias.getProcessedAliasMapping({ mapping: ['a', '<rootDir>/$1'] })
    ).toThrow(/must end with "\/\(\.\*\)\$"/);
  });

  it('throws on bad alias:path "a":"./$1"', async () => {
    expect.hasAssertions();

    expect(() => Alias.getProcessedAliasMapping({ mapping: ['a', './$1'] })).toThrow(
      /must end with "\/\(\.\*\)\$"/
    );
  });

  it('throws on bad alias:path "a":"./?/?/?"', async () => {
    expect.hasAssertions();

    expect(() => Alias.getProcessedAliasMapping({ mapping: ['a', './?/?/?'] })).toThrow(
      /not a valid path$/
    );
  });

  it('throws on bad alias:path "":"./?/?/?"', async () => {
    expect.hasAssertions();

    expect(() => Alias.getProcessedAliasMapping({ mapping: ['a', './?/?/?'] })).toThrow(
      /not a valid path$/
    );
  });
});

describe('::getEslintAliases', () => {
  it('returns expected aliases', async () => {
    expect.hasAssertions();

    await withMockedOutput(() => {
      expect(Alias.getEslintAliases()).toStrictEqual([
        ['a', './a'],
        ['b', './.b.json'],
        ['c', './c'],
        ['d', './.d.json'],
        ['e', './.e/e/e/e'],
        ['f', './f/f'],
        ['g', '.'],
        ['h', '.']
      ]);
    });
  });
});

describe('::getJestAliases', () => {
  it('returns expected Jest aliases when called with rootDir', async () => {
    expect.hasAssertions();

    await withMockedOutput(() => {
      expect(Alias.getJestAliases({ rootDir: '/some/fake' })).toStrictEqual({
        a: '<rootDir>/packages/dir/a',
        '^b': '<rootDir>/packages/dir/.b.json',
        c$: '<rootDir>/c',
        '^d$': '<rootDir>/.d.json',
        'e/(.*)$': '<rootDir>/packages/dir/.e/e/e/e/$1',
        '^f/(.*)$': '<rootDir>/f/f/$1',
        'g/(.*)$': '<rootDir>/packages/dir/$1',
        'h/(.*)$': '<rootDir>/$1'
      });
    });
  });

  it('resolves relative path from rootDir even if above root', async () => {
    expect.hasAssertions();

    jest.spyOn(Alias, 'getRawAliases').mockReturnValue({
      '^package$': './package.json'
    } as unknown as ReturnType<typeof Alias.getRawAliases>);

    await withMockedOutput(() => {
      expect(Alias.getJestAliases({ rootDir: '/some/other/dir' })).toStrictEqual({
        '^package$': '<rootDir>/../../fake/packages/dir/package.json'
      });
    });
  });

  it('resolves syntactically correct path even if rootDir == cwd', async () => {
    expect.hasAssertions();

    jest.spyOn(Alias, 'getRawAliases').mockReturnValue({
      '^package$': './package.json'
    } as unknown as ReturnType<typeof Alias.getRawAliases>);

    await withMockedOutput(() => {
      expect(Alias.getJestAliases({ rootDir: '/some/fake/packages/dir' })).toStrictEqual({
        '^package$': '<rootDir>/package.json'
      });
    });
  });

  it('returns expected Jest aliases without rootDir', async () => {
    expect.hasAssertions();

    jest.spyOn(Alias, 'getRawAliases').mockReturnValue({
      a: '<rootDir>/a',
      '^b/(.*)$': '<rootDir>/packages/b/$1'
    } as unknown as ReturnType<typeof Alias.getRawAliases>);

    await withMockedOutput(() => {
      expect(Alias.getJestAliases()).toStrictEqual({
        a: '<rootDir>/a',
        '^b/(.*)$': '<rootDir>/packages/b/$1'
      });
    });
  });

  it('throws if using relative alias path without rootDir argument', async () => {
    expect.hasAssertions();

    jest.spyOn(Alias, 'getRawAliases').mockReturnValue({
      a: './a'
    } as unknown as ReturnType<typeof Alias.getRawAliases>);

    await withMockedOutput(() => {
      expect(() => Alias.getJestAliases()).toThrow(/must provide a rootDir argument/);
    });
  });

  it('throws if using relative alias path with relative rootDir argument', async () => {
    expect.hasAssertions();

    jest.spyOn(Alias, 'getRawAliases').mockReturnValue({
      a: './a'
    } as unknown as ReturnType<typeof Alias.getRawAliases>);

    await withMockedOutput(() => {
      expect(() => Alias.getJestAliases({ rootDir: 'relative/path' })).toThrow(
        /is not an absolute path/
      );
    });
  });
});

describe('::getWebpackAliases', () => {
  it('returns expected Webpack aliases when called with rootDir', async () => {
    expect.hasAssertions();

    await withMockedOutput(() => {
      expect(Alias.getWebpackAliases({ rootDir: '/some/fake' })).toStrictEqual({
        a: '/some/fake/packages/dir/a',
        b: '/some/fake/packages/dir/.b.json',
        c$: '/some/fake/c',
        d$: '/some/fake/.d.json',
        e: '/some/fake/packages/dir/.e/e/e/e/',
        f: '/some/fake/f/f/',
        g: '/some/fake/packages/dir/',
        h: '/some/fake/'
      });
    });
  });

  it('returns expected Webpack aliases without rootDir argument', async () => {
    expect.hasAssertions();

    jest.spyOn(Alias, 'getRawAliases').mockReturnValue({
      a: './a',
      '^b/(.*)$': './deeper.dir/$1'
    } as unknown as ReturnType<typeof Alias.getRawAliases>);

    await withMockedOutput(() => {
      expect(Alias.getWebpackAliases()).toStrictEqual({
        a: '/some/fake/packages/dir/a',
        b: '/some/fake/packages/dir/deeper.dir/'
      });
    });
  });

  it('throws if using "<rootDir>" in alias path without rootDir argument', async () => {
    expect.hasAssertions();

    jest.spyOn(Alias, 'getRawAliases').mockReturnValue({
      a: '<rootDir>/a'
    } as unknown as ReturnType<typeof Alias.getRawAliases>);

    await withMockedOutput(() => {
      expect(() => Alias.getWebpackAliases()).toThrow(/must provide a rootDir argument/);
    });
  });

  it('throws if using "<rootDir>" in alias path with relative rootDir argument', async () => {
    expect.hasAssertions();

    jest.spyOn(Alias, 'getRawAliases').mockReturnValue({
      a: '<rootDir>/a'
    } as unknown as ReturnType<typeof Alias.getRawAliases>);

    await withMockedOutput(() => {
      expect(() => Alias.getWebpackAliases({ rootDir: 'relative/root' })).toThrow(
        /is not an absolute path/
      );
    });
  });
});

describe('::getTypeScriptAliases', () => {
  it('returns expected TypeScript aliases', async () => {
    expect.hasAssertions();

    await withMockedOutput(() => {
      expect(Alias.getTypeScriptAliases()).toStrictEqual({
        a: ['a'],
        b: ['.b.json'],
        c: ['c'],
        d: ['.d.json'],
        'e/*': ['.e/e/e/e/*'],
        'f/*': ['f/f/*'],
        'g/*': ['./*'],
        'h/*': ['./*']
      });
    });
  });
});

test('only getTypeScriptAliases issues a warning when called', async () => {
  expect.hasAssertions();

  const spy = jest
    .spyOn(Alias, 'getProcessedAliasMapping')
    .mockImplementation(
      () => ['', {}] as unknown as ReturnType<typeof Alias.getProcessedAliasMapping>
    );

  await withMockedOutput(() => {
    Alias.getEslintAliases();
    expect(spy).toBeCalledWith({ mapping: expect.anything() });
  });

  await withMockedOutput(() => {
    Alias.getJestAliases({ rootDir: '/something/or/other' });
    expect(spy).toBeCalledWith({ mapping: expect.anything() });
  });

  await withMockedOutput(() => {
    Alias.getWebpackAliases({ rootDir: '/something/or/other' });
    expect(spy).toBeCalledWith({ mapping: expect.anything() });
  });

  await withMockedOutput(() => {
    Alias.getTypeScriptAliases();
    expect(spy).toBeCalledWith({
      mapping: expect.anything(),
      issueTypescriptWarning: true
    });
  });
});
