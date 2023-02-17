/* eslint-disable jest/require-hook */
/* eslint-disable unicorn/consistent-destructuring */
import assert from 'node:assert';
import { toss } from 'toss-expression';
import { TrialError } from 'named-app-errors';
import castArray from 'lodash.castarray';

import * as resolver from 'pkgverse/core/src/resolvers';

import {
  getDummyPackage,
  resolveTargetWithNodeJs,
  resolveTargetWithResolveExports
} from 'testverse/helpers/dummy-pkg';

import {
  flattenPackageJsonSubpathMap,
  type SubpathMapping,
  type SubpathMappings
} from 'pkgverse/core/src/project-utils';

import type { PackageJson } from 'type-fest';

const dummyRootPackage = getDummyPackage('root');

const dummySimplePackage = getDummyPackage('simple', {
  requireObjectExports: true,
  requireObjectImports: true
});

const dummyComplexPackage = getDummyPackage('complex', {
  requireObjectExports: true,
  requireObjectImports: true
});

const { exports: dummySimpleExports, imports: dummySimpleImports } = dummySimplePackage;
const { exports: dummyComplexExports, imports: dummyComplexImports } =
  dummyComplexPackage;

const getDummyFlattenedExports = (
  customizations: typeof dummySimpleExports = {}
): SubpathMappings => {
  return flattenPackageJsonSubpathMap({
    map: { ...dummySimpleExports, ...customizations }
  });
};

const getDummyFlattenedImports = (customizations: typeof dummySimpleImports = {}) => {
  return flattenPackageJsonSubpathMap({
    map: { ...dummySimpleImports, ...customizations }
  });
};

const defaultCoreExportsConfig = {
  flattenedMap: { flattenedExports: getDummyFlattenedExports() }
};

const defaultCoreImportsConfig = {
  flattenedMap: { flattenedImports: getDummyFlattenedImports() }
};

const defaultLibraryConfig = { packageJson: dummySimplePackage.packageJson };

const defaultNodeConfig = {
  packageName: dummySimplePackage.name,
  rootPackagePath: dummyRootPackage.path
};

describe('::resolveEntryPointsFromExportsTarget', () => {
  describe('returns the correct subpath by default', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        operation: 'resolveEntryPointsFromExportsTarget'
      },
      library: defaultLibraryConfig,
      node: defaultNodeConfig,
      conditions: [['import']],
      targets: ['./import.mjs'],
      subpaths: [['.']]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('returns an empty array if `target` does not exist', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        operation: 'resolveEntryPointsFromExportsTarget'
      },
      library: defaultLibraryConfig,
      node: defaultNodeConfig,
      conditions: [['import']],
      targets: ['./does/not/exist'],
      subpaths: [[]]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('returns an empty array if conditions are not matched', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        operation: 'resolveEntryPointsFromExportsTarget'
      },
      library: defaultLibraryConfig,
      node: defaultNodeConfig,
      conditions: [['custom']],
      targets: ['./import.mjs'],
      subpaths: [[]]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('returns multiple subpaths with matching targets', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        operation: 'resolveEntryPointsFromExportsTarget'
      },
      library: defaultLibraryConfig,
      node: defaultNodeConfig,
      conditions: [['default'], ['node', 'require', 'default']],
      targets: ['./package.json', './require.js'],
      subpaths: [
        ['./package', './package.json'],
        ['.', './null', './alias/path/node']
      ]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('returns subpaths when `target` is null', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        operation: 'resolveEntryPointsFromExportsTarget'
      },
      library: defaultLibraryConfig,
      node: defaultNodeConfig,
      conditions: [['import', 'default']],
      targets: [null],
      subpaths: [
        [
          './null',
          './pattern-1/private-explicit/secret.js',
          './pattern-2/private-explicit/secret.js',
          './pattern-1/private-internal/*',
          './pattern-4/maybe-private/*'
        ]
      ]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('excludes fallback targets except the first one by default', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        operation: 'resolveEntryPointsFromExportsTarget'
      },
      library: defaultLibraryConfig,
      node: defaultNodeConfig,
      conditions: [
        ['node', 'import'],
        ['node', 'import'],
        ['node', 'import']
      ],
      targets: ['./path-1.js', './path-2.js', './path-3.js'],
      subpaths: [['./multi'], [], []]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('includes all fallback targets if `includeUnsafeFallbackTargets` is true', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        operation: 'resolveEntryPointsFromExportsTarget',
        options: { includeUnsafeFallbackTargets: true }
      },
      library: {
        ...defaultLibraryConfig,
        // ? Resolve.exports will return all available default targets.
        expectAllTargets: ['./path-1.js', './path-2.js', './path-3.js']
      },
      node: {
        ...defaultNodeConfig,
        // ? Node will only ever resolve the very first target available.
        expectOnlyTargets: './path-1.js'
      },
      conditions: [
        ['node', 'import'],
        ['node', 'import']
      ],
      targets: ['./path-2.js', './path-3.js'],
      subpaths: [['./multi'], ['./multi']]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('excludes all but the first fallback target in complex fallback arrays if `includeUnsafeFallbackTargets` is not true', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        flattenedMap: {
          flattenedExports: flattenPackageJsonSubpathMap({ map: dummyComplexExports })
        },
        operation: 'resolveEntryPointsFromExportsTarget',
        options: [
          {},
          {},
          {},
          { includeUnsafeFallbackTargets: true },
          { includeUnsafeFallbackTargets: true },
          { includeUnsafeFallbackTargets: true }
        ]
      },
      library: {
        ...defaultLibraryConfig,
        packageJson: dummyComplexPackage.packageJson,
        // ? resolve.exports will return all targets, including the very first
        // ? non-null target. This lines up with `expectOnlyTargets` below.
        expectAllTargets: [
          [['./import.js'], ['./import.js', './string.js']],
          [],
          [['./string.js']],
          [['./import.js'], ['./import.js'], ['./import.js', './string.js']],
          [],
          [['./string.js'], ['./import.js', './string.js']]
        ]
      },
      node: {
        ...defaultNodeConfig,
        packageName: dummyComplexPackage.name,
        // ? Node.js will only return the very first non-null target. This lines
        // ? up with `expectAllTargets` above.
        expectOnlyTargets: [
          './import.js',
          null,
          './string.js',
          './import.js',
          null,
          ['./string.js', './import.js']
        ]
      },
      conditions: [
        ['import'],
        ['import'],
        ['import'],
        ['import'],
        ['import'],
        ['import']
      ],
      // ? When includeUnsafeFallbackTargets is true, all targets are considered.
      // ? This yields results radically different from Node.js or the library.
      targets: [
        './import.js',
        './default.js',
        './string.js',
        './import.js',
        './default.js',
        './string.js'
      ],
      subpaths: [
        ['./edge-case-2', './edge-case-3'],
        [],
        ['./edge-case-1'],
        ['./null-in-fallback-edge-case-1', './edge-case-2', './edge-case-3'],
        [],
        ['./edge-case-1', './edge-case-3']
      ]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    // ? Node will only ever return the first defined non-null fallback target.
    registerNodeResolverTest(context);
  });

  describe('does not return the default condition when path matches but another condition would match first', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        flattenedMap: {
          flattenedExports: flattenPackageJsonSubpathMap({ map: dummyComplexExports })
        },
        operation: 'resolveEntryPointsFromExportsTarget',
        options: [
          {},
          { includeUnsafeFallbackTargets: true },
          {},
          { includeUnsafeFallbackTargets: true }
        ]
      },
      library: {
        ...defaultLibraryConfig,
        packageJson: dummyComplexPackage.packageJson
      },
      node: {
        ...defaultNodeConfig,
        packageName: dummyComplexPackage.name
      },
      conditions: [['import'], ['import'], undefined, undefined],
      targets: ['./default.js', './default.js', './default.js', './default.js'],
      subpaths: [[], [], ['./edge-case-2'], ['./edge-case-2', './edge-case-3']]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    // ? Node will only ever return the first defined non-null fallback target.
    registerNodeResolverTest(context);
  });

  describe('returns an empty array if `flattenedExports` is empty', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        flattenedMap: { flattenedExports: flattenPackageJsonSubpathMap({ map: {} }) },
        operation: 'resolveEntryPointsFromExportsTarget'
      },
      library: defaultLibraryConfig,
      node: defaultNodeConfig,
      conditions: [['import']],
      targets: ['./import.mjs'],
      subpaths: [[]]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('returns subpath using "default" condition if `conditions` is empty or undefined', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        operation: 'resolveEntryPointsFromExportsTarget'
      },
      library: defaultLibraryConfig,
      node: defaultNodeConfig,
      conditions: [undefined, []],
      targets: ['./alias.js', './alias.js'],
      subpaths: [
        ['./alias', './alias/path/node'],
        ['./alias', './alias/path/node']
      ]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('returns subpath using "default" condition when available even if `conditions` are not matched', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        operation: 'resolveEntryPointsFromExportsTarget'
      },
      library: defaultLibraryConfig,
      node: defaultNodeConfig,
      conditions: [['custom'], ['custom']],
      targets: ['./alias.js', './alias.js'],
      subpaths: [
        ['./alias', './alias/path/node'],
        ['./alias', './alias/path/node']
      ]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('does not match absolute or non-dot-relative target to dot-relative exports', () => {
    test('@projector/core/project/resolve', async () => {
      expect.hasAssertions();

      expect(
        resolver.resolveEntryPointsFromExportsTarget({
          flattenedExports: getDummyFlattenedExports(),
          target: '/lite/worker.browser.js',
          conditions: ['worker', 'browser']
        })
      ).toStrictEqual([]);

      expect(
        resolver.resolveEntryPointsFromExportsTarget({
          flattenedExports: getDummyFlattenedExports(),
          target: 'lite/worker.browser.js',
          conditions: ['worker', 'browser']
        })
      ).toStrictEqual([]);

      expect(
        resolver.resolveEntryPointsFromExportsTarget({
          flattenedExports: getDummyFlattenedExports(),
          target: './lite-worker-browser.js',
          conditions: ['worker', 'browser']
        })
      ).toStrictEqual(['./lite']);

      expect(
        resolver.resolveEntryPointsFromExportsTarget({
          flattenedExports: getDummyFlattenedExports({
            './missing-dot': ['./mixed/*.js', 'non-absolute/import.js']
          }),
          target: './non-absolute/import.js',
          includeUnsafeFallbackTargets: true
        })
      ).toStrictEqual([]);

      expect(
        resolver.resolveEntryPointsFromExportsTarget({
          flattenedExports: getDummyFlattenedExports({
            // * Technically this is an invalid target in package.json exports
            './missing-dot': ['./mixed/*.js', 'non-absolute/import.js']
          }),
          target: 'non-absolute/import.js',
          includeUnsafeFallbackTargets: true
        })
      ).toStrictEqual(['./missing-dot']);

      expect(
        resolver.resolveEntryPointsFromExportsTarget({
          flattenedExports: getDummyFlattenedExports({
            './missing-dot': { default: './non-absolute/deep/require' }
          }),
          // * Technically this is an invalid target in package.json exports
          target: 'non-absolute/deep/require'
        })
      ).toStrictEqual([]);

      expect(
        resolver.resolveEntryPointsFromExportsTarget({
          flattenedExports: getDummyFlattenedExports({
            './missing-dot': { default: './non-absolute/deep/require' }
          }),
          target: './non-absolute/deep/require'
        })
      ).toStrictEqual(['./missing-dot']);
    });
  });

  describe('does not change its results due to the order of `conditions`', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        operation: 'resolveEntryPointsFromExportsTarget'
      },
      library: defaultLibraryConfig,
      node: defaultNodeConfig,
      conditions: [
        ['worker', 'browser', 'import', 'require'],
        ['import', 'worker', 'require', 'browser']
      ],
      targets: ['./lite-worker-browser.js', './lite-worker-browser.js'],
      subpaths: [['./lite'], ['./lite']]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('returns subpath with asterisks replaced by default when pattern is matched', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        operation: 'resolveEntryPointsFromExportsTarget'
      },
      library: defaultLibraryConfig,
      node: defaultNodeConfig,
      conditions: [
        ['default', 'browser', 'require'],
        ['default', 'browser', 'require'],
        ['default', 'browser', 'require'],
        ['default', 'browser', 'require']
      ],
      targets: [
        './features/file.js',
        './features/some/file.js',
        './features/some/file.mjs',
        './features/deep/another/file.js'
      ],
      subpaths: [
        ['./pattern-1/file.js', './pattern-2/file.js'],
        ['./pattern-1/some/file.js', './pattern-2/some/file.js'],
        ['./pattern-2/some/file.mjs'],
        [
          './pattern-1/deep/another/file.js',
          './pattern-2/deep/another/file.js',
          './pattern-3/another/file.js'
        ]
      ]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('returns subpath as-is when pattern is matched and `replaceSubpathAsterisks` is false', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        operation: 'resolveEntryPointsFromExportsTarget',
        options: { replaceSubpathAsterisks: false }
      },
      library: defaultLibraryConfig,
      node: defaultNodeConfig,
      conditions: [
        ['default', 'browser', 'require'],
        ['default', 'browser', 'require'],
        ['default', 'browser', 'require'],
        ['default', 'browser', 'require']
      ],
      targets: [
        './features/file.js',
        './features/some/file.js',
        './features/some/file.mjs',
        './features/deep/another/file.js'
      ],
      subpaths: [
        ['./pattern-1/*.js', './pattern-2/*'],
        ['./pattern-1/*.js', './pattern-2/*'],
        ['./pattern-2/*'],
        ['./pattern-1/*.js', './pattern-2/*', './pattern-3/*.js']
      ]
    });

    registerCoreResolverTest(context);
    // ? Node.js will NEVER do this, and resolve.exports lacks this feature.
    //registerLibraryResolverTest(context);
    //registerNodeResolverTest(context);
  });

  describe('returns the same results on non-pattern subpaths regardless of `replaceSubpathAsterisks`', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        operation: 'resolveEntryPointsFromExportsTarget',
        options: [
          { replaceSubpathAsterisks: true },
          { replaceSubpathAsterisks: false },
          { includeUnsafeFallbackTargets: true, replaceSubpathAsterisks: true },
          { includeUnsafeFallbackTargets: true, replaceSubpathAsterisks: false }
        ]
      },
      library: defaultLibraryConfig,
      node: defaultNodeConfig,
      conditions: [['import'], ['import'], ['node', 'import'], ['node', 'import']],
      targets: ['./import.mjs', './import.mjs', './path-2.js', './path-2.js'],
      subpaths: [['.'], ['.'], ['./multi'], ['./multi']]
    });

    registerCoreResolverTest(context);
    // ? Node.js will never not replace asterisks, and resolve.exports lacks
    // ? this feature.
    //registerLibraryResolverTest(context);
    //registerNodeResolverTest(context);
  });

  describe('always returns literal subpaths when target pattern matches literally', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        operation: 'resolveEntryPointsFromExportsTarget',
        options: [{ replaceSubpathAsterisks: true }, { replaceSubpathAsterisks: false }]
      },
      library: defaultLibraryConfig,
      node: defaultNodeConfig,
      conditions: [['default'], ['default', 'browser', 'require']],
      targets: ['./features/*.js', './features/deep/*.js'],
      subpaths: [
        ['./pattern-1/*.js'],
        ['./pattern-3/*.js', './pattern-1/*.js', './pattern-2/*']
      ]
    });

    registerCoreResolverTest(context);
    // ? Node.js will never not replace asterisks, and resolve.exports lacks
    // ? the ability to match literal subpath patterns.
    //registerLibraryResolverTest(context);
    //registerNodeResolverTest(context);
  });

  describe('handles mixed pattern and non-pattern fallback targets', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        operation: 'resolveEntryPointsFromExportsTarget',
        options: [
          { includeUnsafeFallbackTargets: true },
          { includeUnsafeFallbackTargets: false },
          {}
        ]
      },
      library: {
        ...defaultLibraryConfig,
        expectAllTargets: ['./mixed/deep/file.js', './mixed/file.js']
      },
      node: { ...defaultNodeConfig, expectOnlyTargets: './mixed/deep/file.js' },
      conditions: [['import'], ['import'], ['require']],
      targets: ['./mixed/file.js', './mixed/file.js', './mixed/deep/file.js'],
      subpaths: [['./mixed/file'], [], ['./mixed/file']]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('returns different results depending on conditions', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        operation: 'resolveEntryPointsFromExportsTarget'
      },
      library: defaultLibraryConfig,
      node: defaultNodeConfig,
      conditions: [['default'], ['default', 'browser', 'require']],
      targets: ['./features/some/file.js', './features/some/file.js'],
      subpaths: [
        ['./pattern-1/some/file.js'],
        ['./pattern-1/some/file.js', './pattern-2/some/file.js']
      ]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('handles sugared exports', () => {
    const dummySugaredPackage = getDummyPackage('sugared');
    const flattenedExports = flattenPackageJsonSubpathMap({
      map: dummySugaredPackage.exports
    });

    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        flattenedMap: { flattenedExports },
        operation: 'resolveEntryPointsFromExportsTarget'
      },
      library: { ...defaultLibraryConfig, packageJson: dummySugaredPackage.packageJson },
      node: { ...defaultNodeConfig, packageName: dummySugaredPackage.name },
      conditions: [['default'], undefined],
      targets: ['./sugared/sugar.js', './sugared/sugar.js'],
      subpaths: [['.'], ['.']]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('handles non-conditional exports', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        operation: 'resolveEntryPointsFromExportsTarget'
      },
      library: defaultLibraryConfig,
      node: defaultNodeConfig,
      conditions: [undefined],
      targets: ['./package.json'],
      subpaths: [['./package', './package.json']]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('chooses longest nested default pattern', () => {
    const dummyDefaultsPackage = getDummyPackage('defaults');

    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        flattenedMap: {
          flattenedExports: flattenPackageJsonSubpathMap({
            map: dummyDefaultsPackage.exports
          })
        },
        operation: 'resolveEntryPointsFromExportsTarget'
      },
      library: { ...defaultLibraryConfig, packageJson: dummyDefaultsPackage.packageJson },
      node: { ...defaultNodeConfig, packageName: dummyDefaultsPackage.name },
      conditions: [undefined, ['import']],
      targets: ['./default-1.js', './default-2.js'],
      subpaths: [['./default1'], ['./default/2']]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('handles targets with multiple asterisks', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        operation: 'resolveEntryPointsFromExportsTarget'
      },
      library: defaultLibraryConfig,
      node: defaultNodeConfig,
      conditions: [undefined, undefined, undefined],
      targets: [
        './asterisk/file/file.js',
        './asterisk/file/yet-another/file.js',
        './asterisk/file/yet-another/asterisk/file.js'
      ],
      subpaths: [
        ['./multiple-asterisk-good-1/file'],
        [],
        ['./multiple-asterisk-good-2/asterisk/file']
      ]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('returns an empty array for subpaths with multiple asterisks', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        operation: 'resolveEntryPointsFromExportsTarget'
      },
      library: defaultLibraryConfig,
      node: defaultNodeConfig,
      conditions: [undefined],
      targets: ['./asterisk/file/yet-another/file.js'],
      subpaths: [[]]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('handles subpaths and targets that begin with "./."', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        operation: 'resolveEntryPointsFromExportsTarget'
      },
      library: defaultLibraryConfig,
      node: defaultNodeConfig,
      conditions: [['default']],
      targets: ['./.hidden'],
      subpaths: [['./.hidden']]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('handles overlapping unlimited exports while respecting null targets', () => {
    const dummyUnlimitedPackage = getDummyPackage('unlimited');

    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        flattenedMap: {
          flattenedExports: flattenPackageJsonSubpathMap({
            map: dummyUnlimitedPackage.exports
          })
        },
        operation: 'resolveEntryPointsFromExportsTarget'
      },
      library: {
        ...defaultLibraryConfig,
        packageJson: dummyUnlimitedPackage.packageJson
      },
      node: { ...defaultNodeConfig, packageName: dummyUnlimitedPackage.name },
      conditions: [['default'], ['default']],
      targets: ['./file.js', './another-file.js'],
      subpaths: [[], ['./another-file.js']]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('returns the longest matching subpath pattern (so-called "best match") and ignores the others', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        operation: 'resolveEntryPointsFromExportsTarget'
      },
      library: defaultLibraryConfig,
      node: defaultNodeConfig,
      conditions: [undefined],
      targets: ['./not-private/not-secret.js'],
      subpaths: [['./pattern-4/deep/deeper/not-secret.js']]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('considers characters after the asterisk only when pattern before asterisk is identical', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        operation: 'resolveEntryPointsFromExportsTarget'
      },
      library: {
        ...defaultLibraryConfig,
        // ? resolve.exports cannot handle the overlapping subpaths and fails
        expectTestsToFail: ['1.2']
      },
      node: defaultNodeConfig,
      conditions: [undefined],
      targets: ['./not-private/maybe-private/might-be-secret.cjs'],
      subpaths: [
        [
          // ? For subpath patterns with targets without asterisks, the literal
          // ? subpath is returned since the asterisk can be replaced with
          // ? anything.
          './pattern-4/maybe-private/m*.cjs'
        ]
      ]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('does not return subpath patterns if a non-pattern match is found', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        operation: 'resolveEntryPointsFromExportsTarget'
      },
      library: defaultLibraryConfig,
      node: defaultNodeConfig,
      conditions: [undefined],
      targets: ['./not-private/deep/file.js'],
      subpaths: [['./pattern-4/deep/deeper/file.js']]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('does not return a subpath if its target is unreachable due to overlapping subpath patterns (implicitly dead)', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        operation: 'resolveEntryPointsFromExportsTarget'
      },
      library: defaultLibraryConfig,
      node: defaultNodeConfig,
      conditions: [undefined],
      targets: ['./not-private/file.js'],
      subpaths: [[]]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('does not return subpaths if its target is actually unreachable because the wanted condition occurs after the "default" condition (explicitly dead)', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        flattenedMap: {
          flattenedExports: flattenPackageJsonSubpathMap({ map: dummyComplexExports })
        },
        operation: 'resolveEntryPointsFromExportsTarget',
        options: [
          {},
          {},
          { includeUnsafeFallbackTargets: true },
          { includeUnsafeFallbackTargets: true }
        ]
      },
      library: { ...defaultLibraryConfig, packageJson: dummyComplexPackage.packageJson },
      node: { ...defaultNodeConfig, packageName: dummyComplexPackage.name },
      conditions: [['dead-case-1'], ['dead-case-2'], ['dead-case-1'], ['dead-case-2']],
      targets: ['./unsafe.js', './unsafe.js', './unsafe.js', './unsafe.js'],
      subpaths: [[], [], [], []]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('returns mutually exclusive pattern and non-pattern subpaths when a different subpath pattern with a null target matches', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        operation: 'resolveEntryPointsFromExportsTarget'
      },
      library: defaultLibraryConfig,
      node: defaultNodeConfig,
      conditions: [undefined],
      targets: ['./not-private/maybe-private/not-secret.js'],
      subpaths: [
        [
          './pattern-4/maybe-private/not-secret.js',
          './pattern-4/deep/deeper/maybe-private/not-secret.js'
        ]
      ]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('does not return subpath pattern when it ends up matching either a null target or null last fallback target', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        operation: 'resolveEntryPointsFromExportsTarget',
        options: [{}, {}, { includeUnsafeFallbackTargets: true }, {}]
      },
      library: defaultLibraryConfig,
      node: defaultNodeConfig,
      conditions: [['default'], ['require'], ['require'], ['import']],
      targets: [
        './features/private-internal/secret.js',
        './features/private-explicit/secret.js',
        './features/private-explicit/secret.js',
        './features/private-explicit/secret.js'
      ],
      subpaths: [
        [],
        // ? Handles null when it is the last fallback item left
        [],
        // ? Handles null when it is the last fallback item left
        [],
        []
      ]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('skips null fallback targets, even when `target` is null, unless last fallback target is also null', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        flattenedMap: {
          flattenedExports: flattenPackageJsonSubpathMap({ map: dummyComplexExports })
        },
        operation: 'resolveEntryPointsFromExportsTarget',
        options: [
          { includeUnsafeFallbackTargets: false },
          { includeUnsafeFallbackTargets: true },
          { includeUnsafeFallbackTargets: false },
          { includeUnsafeFallbackTargets: true },
          { includeUnsafeFallbackTargets: true },
          { includeUnsafeFallbackTargets: false }
        ]
      },
      library: {
        ...defaultLibraryConfig,
        packageJson: dummyComplexPackage.packageJson
      },
      node: {
        ...defaultNodeConfig,
        packageName: dummyComplexPackage.name
      },
      conditions: [
        undefined,
        undefined,
        undefined,
        undefined,
        ['custom-edge-2'],
        ['custom-edge-2']
      ],
      targets: ['./node-1.js', './node-1.js', null, null, null, null],
      subpaths: [
        ['./null-in-fallback'],
        ['./null-in-fallback'],
        [],
        [],
        ['./null-in-fallback-edge-case-2'],
        ['./null-in-fallback-edge-case-2']
      ]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('handles non-null non-default fallback target surrounded by null', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        flattenedMap: {
          flattenedExports: flattenPackageJsonSubpathMap({ map: dummyComplexExports })
        },
        operation: 'resolveEntryPointsFromExportsTarget'
      },
      library: {
        ...defaultLibraryConfig,
        packageJson: dummyComplexPackage.packageJson
      },
      node: {
        ...defaultNodeConfig,
        packageName: dummyComplexPackage.name
      },
      conditions: [['custom-edge-1'], ['custom-edge-1']],
      targets: ['./string-3.js', null],
      subpaths: [['./null-in-fallback-edge-case-1', './null-in-fallback-edge-case-2'], []]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('does not conflate co-located conditions with null fallback targets', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        flattenedMap: {
          flattenedExports: flattenPackageJsonSubpathMap({ map: dummyComplexExports })
        },
        operation: 'resolveEntryPointsFromExportsTarget'
      },
      library: {
        ...defaultLibraryConfig,
        packageJson: dummyComplexPackage.packageJson
      },
      node: {
        ...defaultNodeConfig,
        packageName: dummyComplexPackage.name
      },
      conditions: [['custom-edge-2'], ['custom-edge-2'], ['import']],
      targets: ['./string-3.js', null, './string-3.js'],
      subpaths: [
        [],
        ['./null-in-fallback-edge-case-2'],
        ['./null-in-fallback-edge-case-2']
      ]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  it('is the inverse of `resolveExportsTargetsFromEntryPoint`', async () => {
    expect.hasAssertions();
    const flattenedExports = getDummyFlattenedExports();
    const conditions = ['types'];
    const target = './alias.d.ts';

    expect(
      resolver.resolveExportsTargetsFromEntryPoint({
        flattenedExports,
        entryPoint:
          resolver.resolveEntryPointsFromExportsTarget({
            flattenedExports,
            target,
            conditions
          })[0] || toss(new TrialError()),
        conditions
      })
    ).toStrictEqual([target]);
  });
});

describe('::resolveExportsTargetsFromEntryPoint', () => {
  describe('returns the correct target', () => {
    const context = createSharedForwardMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        operation: 'resolveExportsTargetsFromEntryPoint'
      },
      library: defaultLibraryConfig,
      node: defaultNodeConfig,
      conditions: [['import']],
      targets: [['./import.mjs']],
      entryPoints: ['.']
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('returns an empty array if `entryPoint` does not exist', () => {
    const context = createSharedForwardMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        operation: 'resolveExportsTargetsFromEntryPoint'
      },
      library: defaultLibraryConfig,
      node: defaultNodeConfig,
      conditions: [['import']],
      targets: [[]],
      entryPoints: ['./does/not/exist']
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('returns an empty array if `entryPoint` matches a subpath with a null target', () => {
    const context = createSharedForwardMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        operation: 'resolveExportsTargetsFromEntryPoint'
      },
      library: defaultLibraryConfig,
      node: defaultNodeConfig,
      conditions: [['import']],
      targets: [[]],
      entryPoints: ['./null']
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('returns an empty array if `entryPoint` matches a subpath pattern with a null target or null last fallback target', () => {
    const context = createSharedForwardMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        operation: 'resolveExportsTargetsFromEntryPoint'
      },
      library: defaultLibraryConfig,
      node: defaultNodeConfig,
      conditions: [['import'], ['import']],
      targets: [[], []],
      entryPoints: [
        './pattern-1/private-explicit/secret.js',
        './pattern-2/private-explicit/secret.js'
      ]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('returns first non-null fallback target', () => {
    const context = createSharedForwardMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        operation: 'resolveExportsTargetsFromEntryPoint'
      },
      library: defaultLibraryConfig,
      node: defaultNodeConfig,
      conditions: [['import']],
      targets: [['./not-private/not-secret.js']],
      entryPoints: ['./pattern-4/deep/not-secret.js']
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('returns entire fallback array, excluding null targets, if `includeUnsafeFallbackTargets` is true', () => {
    const context = createSharedForwardMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        flattenedMap: {
          flattenedExports: flattenPackageJsonSubpathMap({ map: dummyComplexExports })
        },
        operation: 'resolveExportsTargetsFromEntryPoint',
        options: { includeUnsafeFallbackTargets: true }
      },
      library: { ...defaultLibraryConfig, packageJson: dummyComplexPackage.packageJson },
      node: { ...defaultNodeConfig, packageName: dummyComplexPackage.name },
      conditions: [['import'], ['import'], ['import']],
      targets: [['./node-1.js', './string-3.js'], ['./import.js'], ['./string-3.js']],
      entryPoints: [
        './null-in-fallback',
        './null-in-fallback-edge-case-1',
        './null-in-fallback-edge-case-2'
      ]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('returns an empty array if `flattenedExports` is empty', () => {
    const context = createSharedForwardMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        flattenedMap: { flattenedExports: [] },
        operation: 'resolveExportsTargetsFromEntryPoint'
      },
      library: defaultLibraryConfig,
      node: defaultNodeConfig,
      conditions: [undefined],
      targets: [[]],
      entryPoints: ['.']
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('returns target using "default" condition if `conditions` is empty or undefined', () => {
    const context = createSharedForwardMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        operation: 'resolveExportsTargetsFromEntryPoint'
      },
      library: defaultLibraryConfig,
      node: defaultNodeConfig,
      conditions: [undefined, []],
      targets: [['./alias.js'], ['./alias.js']],
      entryPoints: ['./alias', './alias/path/node']
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('returns target using "default" condition when available even if `conditions` are not matched', () => {
    const context = createSharedForwardMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        operation: 'resolveExportsTargetsFromEntryPoint'
      },
      library: defaultLibraryConfig,
      node: defaultNodeConfig,
      conditions: [['custom'], ['custom']],
      targets: [['./alias.js'], ['./alias.js']],
      entryPoints: ['./alias', './alias/path/node']
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('does not change its results due to the order of `conditions`', () => {
    const context = createSharedForwardMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        operation: 'resolveExportsTargetsFromEntryPoint'
      },
      library: defaultLibraryConfig,
      node: defaultNodeConfig,
      conditions: [
        ['worker', 'browser', 'import', 'require'],
        ['import', 'worker', 'require', 'browser']
      ],
      targets: [['./lite-worker-browser.js'], ['./lite-worker-browser.js']],
      entryPoints: ['./lite', './lite']
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('returns target with asterisks replaced when pattern is matched', () => {
    const context = createSharedForwardMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        operation: 'resolveExportsTargetsFromEntryPoint'
      },
      library: defaultLibraryConfig,
      node: defaultNodeConfig,
      conditions: [
        ['default', 'browser', 'require'],
        ['default', 'browser', 'require'],
        ['default', 'browser', 'require'],
        ['default', 'browser', 'require']
      ],
      targets: [
        ['./features/file.js'],
        ['./features/some/file.js'],
        ['./features/some/file.mjs'],
        ['./features/deep/another/file.js']
      ],
      entryPoints: [
        './pattern-1/file.js',
        './pattern-1/some/file.js',
        './pattern-2/some/file.mjs',
        './pattern-1/deep/another/file.js'
      ]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('handles mixed pattern and non-pattern fallback targets', () => {
    const context = createSharedForwardMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        operation: 'resolveExportsTargetsFromEntryPoint'
      },
      library: {
        ...defaultLibraryConfig,
        expectAllTargets: [
          ['./mixed/deep/file.js', './mixed/file.js'],
          ['./mixed/deep/deep/file.js', './mixed/deep/file.js']
        ]
      },
      node: defaultNodeConfig,
      conditions: [['import'], ['require']],
      targets: [['./mixed/deep/file.js'], ['./mixed/deep/deep/file.js']],
      entryPoints: ['./mixed/file', './mixed/deep/file']
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('returns different results depending on conditions', () => {
    const context = createSharedForwardMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        operation: 'resolveExportsTargetsFromEntryPoint'
      },
      library: defaultLibraryConfig,
      node: defaultNodeConfig,
      conditions: [['default'], ['default', 'browser', 'require']],
      targets: [['./features/some/file.js'], ['./features/some/file.js']],
      entryPoints: ['./pattern-1/some/file.js', './pattern-2/some/file.js']
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('handles sugared exports', () => {
    const dummySugaredPackage = getDummyPackage('sugared');
    const flattenedExports = flattenPackageJsonSubpathMap({
      map: dummySugaredPackage.exports
    });

    const context = createSharedForwardMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        flattenedMap: { flattenedExports },
        operation: 'resolveExportsTargetsFromEntryPoint'
      },
      library: { ...defaultLibraryConfig, packageJson: dummySugaredPackage.packageJson },
      node: { ...defaultNodeConfig, packageName: dummySugaredPackage.name },
      conditions: [['default'], undefined],
      targets: [['./sugared/sugar.js'], ['./sugared/sugar.js']],
      entryPoints: ['.', '.']
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('handles non-conditional exports', () => {
    const context = createSharedForwardMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        operation: 'resolveExportsTargetsFromEntryPoint'
      },
      library: defaultLibraryConfig,
      node: defaultNodeConfig,
      conditions: [undefined, undefined],
      targets: [['./package.json'], ['./package.json']],
      entryPoints: ['./package', './package.json']
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('handles targets with multiple asterisks', () => {
    const context = createSharedForwardMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        operation: 'resolveExportsTargetsFromEntryPoint'
      },
      library: defaultLibraryConfig,
      node: defaultNodeConfig,
      conditions: [undefined, undefined],
      targets: [
        ['./asterisk/file/file.js'],
        ['./asterisk/file/yet-another/asterisk/file.js']
      ],
      entryPoints: [
        './multiple-asterisk-good-1/file',
        './multiple-asterisk-good-2/asterisk/file'
      ]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('returns an empty array for entry points with multiple asterisks', () => {
    const context = createSharedForwardMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        operation: 'resolveExportsTargetsFromEntryPoint'
      },
      library: {
        ...defaultLibraryConfig,
        // ? resolve.exports does not handle multi-asterisk subpaths properly
        expectTestsToFail: ['1.1']
      },
      node: defaultNodeConfig,
      conditions: [undefined],
      targets: [[]],
      entryPoints: ['./multiple-asterisks-bad/bad/bad']
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('handles entry points and targets that begin with "./."', () => {
    const context = createSharedForwardMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        operation: 'resolveExportsTargetsFromEntryPoint'
      },
      library: defaultLibraryConfig,
      node: defaultNodeConfig,
      conditions: [['default']],
      targets: [['./.hidden']],
      entryPoints: ['./.hidden']
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('handles overlapping unlimited exports while respecting null targets', () => {
    const dummyUnlimitedPackage = getDummyPackage('unlimited');

    const context = createSharedForwardMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        flattenedMap: {
          flattenedExports: flattenPackageJsonSubpathMap({
            map: dummyUnlimitedPackage.exports
          })
        },
        operation: 'resolveExportsTargetsFromEntryPoint'
      },
      library: {
        ...defaultLibraryConfig,
        packageJson: dummyUnlimitedPackage.packageJson
      },
      node: { ...defaultNodeConfig, packageName: dummyUnlimitedPackage.name },
      conditions: [['default'], ['default']],
      targets: [[], ['./another-file.js']],
      entryPoints: ['./file.js', './another-file.js']
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('returns the target from the longest matching subpath pattern (so-called "best match") and ignores the others', () => {
    const context = createSharedForwardMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        operation: 'resolveExportsTargetsFromEntryPoint'
      },
      library: defaultLibraryConfig,
      node: defaultNodeConfig,
      conditions: [undefined],
      targets: [['./not-private/not-secret.js']],
      entryPoints: ['./pattern-4/deep/deeper/not-secret.js']
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('does not return subpath patterns if a non-pattern match is found', () => {
    const context = createSharedForwardMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        operation: 'resolveExportsTargetsFromEntryPoint'
      },
      library: defaultLibraryConfig,
      node: defaultNodeConfig,
      conditions: [undefined],
      targets: [['./not-private/deep/file.js']],
      entryPoints: ['./pattern-4/deep/deeper/file.js']
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('does not return targets that are unreachable because the wanted condition occurs after the "default" condition (explicitly dead)', () => {
    const context = createSharedForwardMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        flattenedMap: {
          flattenedExports: flattenPackageJsonSubpathMap({ map: dummyComplexExports })
        },
        operation: 'resolveExportsTargetsFromEntryPoint',
        options: [
          {},
          {},
          { includeUnsafeFallbackTargets: true },
          { includeUnsafeFallbackTargets: true }
        ]
      },
      library: {
        ...defaultLibraryConfig,
        packageJson: dummyComplexPackage.packageJson,
        expectAllTargets: [
          ['./default.js'],
          ['./default.js', './string.js'],
          ['./default.js'],
          ['./default.js', './string.js']
        ]
      },
      node: { ...defaultNodeConfig, packageName: dummyComplexPackage.name },
      conditions: [['dead-case-1'], ['dead-case-2'], ['dead-case-1'], ['dead-case-2']],
      targets: [
        ['./default.js'],
        ['./default.js'],
        ['./default.js'],
        ['./default.js', './string.js']
      ],
      entryPoints: ['./edge-case-2', './edge-case-3', './edge-case-2', './edge-case-3']
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('does not targets when entry point also matches either a null target or null last fallback target', () => {
    const context = createSharedForwardMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        operation: 'resolveExportsTargetsFromEntryPoint',
        options: [{}, {}, { includeUnsafeFallbackTargets: true }, {}]
      },
      library: defaultLibraryConfig,
      node: defaultNodeConfig,
      conditions: [['default'], ['require'], ['require'], ['import']],
      targets: [[], [], [], []],
      entryPoints: [
        './pattern-1/private-internal/secret.js',
        // ? Handles null when it is the last fallback item left
        './pattern-1/private-explicit/secret.js',
        // ? Handles null when it is the last fallback item left
        './pattern-2/private-explicit/secret.js',
        './pattern-2/private-explicit/secret.js'
      ]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('handles non-null non-default fallback target surrounded by null', () => {
    const context = createSharedForwardMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        flattenedMap: {
          flattenedExports: flattenPackageJsonSubpathMap({ map: dummyComplexExports })
        },
        operation: 'resolveExportsTargetsFromEntryPoint'
      },
      library: {
        ...defaultLibraryConfig,
        packageJson: dummyComplexPackage.packageJson
      },
      node: {
        ...defaultNodeConfig,
        packageName: dummyComplexPackage.name
      },
      conditions: [['custom-edge-1'], ['custom-edge-1']],
      targets: [['./string-3.js'], ['./string-3.js']],
      entryPoints: ['./null-in-fallback-edge-case-1', './null-in-fallback-edge-case-2']
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('does not conflate co-located conditions with null fallback targets', () => {
    const context = createSharedForwardMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        flattenedMap: {
          flattenedExports: flattenPackageJsonSubpathMap({ map: dummyComplexExports })
        },
        operation: 'resolveExportsTargetsFromEntryPoint'
      },
      library: {
        ...defaultLibraryConfig,
        packageJson: dummyComplexPackage.packageJson
      },
      node: {
        ...defaultNodeConfig,
        packageName: dummyComplexPackage.name
      },
      conditions: [['custom-edge-2'], ['import']],
      targets: [[], ['./string-3.js']],
      entryPoints: ['./null-in-fallback-edge-case-2', './null-in-fallback-edge-case-2']
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  it('is the inverse of `resolveEntryPointsFromExportsTarget`', async () => {
    expect.hasAssertions();

    const flattenedExports = getDummyFlattenedExports();
    const conditions = ['types'];
    const entryPoint = './alias';

    expect(
      resolver.resolveEntryPointsFromExportsTarget({
        flattenedExports,
        target:
          resolver.resolveExportsTargetsFromEntryPoint({
            flattenedExports,
            entryPoint,
            conditions
          })[0] || toss(new TrialError()),
        conditions
      })
    ).toStrictEqual([entryPoint]);
  });
});

describe('::resolveEntryPointsFromImportsTarget', () => {
  describe('returns the correct subpath by default', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreImportsConfig,
        operation: 'resolveEntryPointsFromImportsTarget'
      },
      library: defaultLibraryConfig,
      node: { ...defaultNodeConfig, rootPackagePath: dummySimplePackage.path },
      conditions: [['import']],
      targets: ['./import.mjs'],
      subpaths: [['#index']]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('handles bare import targets (without ./)', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreImportsConfig,
        operation: 'resolveEntryPointsFromImportsTarget'
      },
      library: defaultLibraryConfig,
      node: { ...defaultNodeConfig, rootPackagePath: dummySimplePackage.path },
      conditions: [['import', 'node']],
      targets: ['hash-pkg/polyfill.js'],
      subpaths: [['#hash']]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('returns an empty array if `target` does not exist', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreImportsConfig,
        operation: 'resolveEntryPointsFromImportsTarget'
      },
      library: defaultLibraryConfig,
      node: { ...defaultNodeConfig, rootPackagePath: dummySimplePackage.path },
      conditions: [['import']],
      targets: ['./does/not/exist'],
      subpaths: [[]]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('returns an empty array if conditions are not matched', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreImportsConfig,
        operation: 'resolveEntryPointsFromImportsTarget'
      },
      library: defaultLibraryConfig,
      node: { ...defaultNodeConfig, rootPackagePath: dummySimplePackage.path },
      conditions: [['custom']],
      targets: ['./import.mjs'],
      subpaths: [[]]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('returns multiple subpaths with matching targets', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreImportsConfig,
        operation: 'resolveEntryPointsFromImportsTarget'
      },
      library: defaultLibraryConfig,
      node: { ...defaultNodeConfig, rootPackagePath: dummySimplePackage.path },
      conditions: [['default'], ['node', 'require', 'default']],
      targets: ['./package.json', './require.js'],
      subpaths: [
        ['#package', '#package.json'],
        ['#index', '#null', '#alias/path/node']
      ]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('returns subpaths when `target` is null', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreImportsConfig,
        operation: 'resolveEntryPointsFromImportsTarget'
      },
      library: defaultLibraryConfig,
      node: { ...defaultNodeConfig, rootPackagePath: dummySimplePackage.path },
      conditions: [['import', 'default']],
      targets: [null],
      subpaths: [
        [
          '#null2',
          '#null3',
          '#null',
          '#pattern-1/private-explicit/secret.js',
          '#pattern-2/private-explicit/secret.js',
          '#pattern-1/private-internal/*',
          '#pattern-4/maybe-private/*'
        ]
      ]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('excludes fallback targets except the first one by default', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreImportsConfig,
        operation: 'resolveEntryPointsFromImportsTarget'
      },
      library: defaultLibraryConfig,
      node: { ...defaultNodeConfig, rootPackagePath: dummySimplePackage.path },
      conditions: [
        ['node', 'import'],
        ['node', 'import'],
        ['node', 'import']
      ],
      targets: ['./path-1.js', './path-2.js', './path-3.js'],
      subpaths: [['#multi'], [], []]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('includes all fallback targets if `includeUnsafeFallbackTargets` is true', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreImportsConfig,
        operation: 'resolveEntryPointsFromImportsTarget',
        options: { includeUnsafeFallbackTargets: true }
      },
      library: {
        ...defaultLibraryConfig,
        // ? Resolve.exports will return all available default targets.
        expectAllTargets: ['./path-1.js', './path-2.js', './path-3.js']
      },
      node: {
        ...defaultNodeConfig,
        rootPackagePath: dummySimplePackage.path,
        // ? Node will only ever resolve the very first target available.
        expectOnlyTargets: './path-1.js'
      },
      conditions: [
        ['node', 'import'],
        ['node', 'import']
      ],
      targets: ['./path-2.js', './path-3.js'],
      subpaths: [['#multi'], ['#multi']]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('excludes all but the first fallback target in complex fallback arrays if `includeUnsafeFallbackTargets` is not true', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreImportsConfig,
        flattenedMap: {
          flattenedImports: flattenPackageJsonSubpathMap({ map: dummyComplexImports })
        },
        operation: 'resolveEntryPointsFromImportsTarget',
        options: [
          {},
          {},
          {},
          { includeUnsafeFallbackTargets: true },
          { includeUnsafeFallbackTargets: true },
          { includeUnsafeFallbackTargets: true }
        ]
      },
      library: {
        ...defaultLibraryConfig,
        packageJson: dummyComplexPackage.packageJson,
        // ? resolve.exports will return all targets, including the very first
        // ? non-null target. This lines up with `expectOnlyTargets` below.
        expectAllTargets: [
          [
            ['./import.js', './string.js'],
            ['./import.js'],
            ['./import.js', './string.js']
          ],
          [['./default.js', './default-2.js']],
          [['./string.js']],
          [
            ['./import.js', './string.js'],
            ['./import.js'],
            ['./import.js'],
            ['./import.js', './string.js']
          ],
          [['./default.js', './default-2.js']],
          [
            ['./import.js', './string.js'],
            ['./string.js'],
            ['./import.js', './string.js']
          ]
        ]
      },
      node: {
        ...defaultNodeConfig,
        rootPackagePath: dummyComplexPackage.path,
        packageName: dummyComplexPackage.name,
        // ? Node.js will only return the very first non-null target. This lines
        // ? up with `expectAllTargets` above.
        expectOnlyTargets: [
          './import.js',
          './default.js',
          './string.js',
          './import.js',
          './default.js',
          ['./import.js', './string.js', './import.js']
        ]
      },
      conditions: [
        ['import'],
        ['import'],
        ['import'],
        ['import'],
        ['import'],
        ['import']
      ],
      // ? When includeUnsafeFallbackTargets is true, all targets are considered.
      // ? This yields results radically different from Node.js or the library.
      targets: [
        './import.js',
        './default.js',
        './string.js',
        './import.js',
        './default.js',
        './string.js'
      ],
      subpaths: [
        ['#complex-3', '#edge-case-2', '#edge-case-3'],
        ['#complex-2'],
        ['#edge-case-1'],
        ['#complex-3', '#null-in-fallback-edge-case-1', '#edge-case-2', '#edge-case-3'],
        ['#complex-2'],
        ['#complex-3', '#edge-case-1', '#edge-case-3']
      ]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    // ? Node will only ever return the first defined non-null fallback target.
    registerNodeResolverTest(context);
  });

  describe('does not return the default condition when path matches but another condition would match first', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreImportsConfig,
        flattenedMap: {
          flattenedImports: flattenPackageJsonSubpathMap({ map: dummyComplexImports })
        },
        operation: 'resolveEntryPointsFromImportsTarget',
        options: [
          {},
          { includeUnsafeFallbackTargets: true },
          {},
          { includeUnsafeFallbackTargets: true }
        ]
      },
      library: {
        ...defaultLibraryConfig,
        packageJson: dummyComplexPackage.packageJson
      },
      node: {
        ...defaultNodeConfig,
        rootPackagePath: dummyComplexPackage.path,
        packageName: dummyComplexPackage.name
      },
      conditions: [['import'], ['import'], undefined, undefined],
      targets: ['./default.js', './default.js', './default.js', './default.js'],
      subpaths: [
        ['#complex-2'],
        ['#complex-2'],
        ['#complex-2', '#edge-case-2'],
        ['#complex-2', '#complex-3', '#edge-case-2', '#edge-case-3']
      ]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    // ? Node will only ever return the first defined non-null fallback target.
    registerNodeResolverTest(context);
  });

  describe('returns an empty array if `flattenedImports` is empty', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreImportsConfig,
        flattenedMap: { flattenedImports: flattenPackageJsonSubpathMap({ map: {} }) },
        operation: 'resolveEntryPointsFromImportsTarget'
      },
      library: defaultLibraryConfig,
      node: { ...defaultNodeConfig, rootPackagePath: dummySimplePackage.path },
      conditions: [['import']],
      targets: ['./import.mjs'],
      subpaths: [[]]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('returns subpath using "default" condition if `conditions` is empty or undefined', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreImportsConfig,
        operation: 'resolveEntryPointsFromImportsTarget'
      },
      library: defaultLibraryConfig,
      node: { ...defaultNodeConfig, rootPackagePath: dummySimplePackage.path },
      conditions: [undefined, []],
      targets: ['./alias.js', './alias.js'],
      subpaths: [
        ['#alias', '#alias/path/node'],
        ['#alias', '#alias/path/node']
      ]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('returns subpath using "default" condition when available even if `conditions` are not matched', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreImportsConfig,
        operation: 'resolveEntryPointsFromImportsTarget'
      },
      library: defaultLibraryConfig,
      node: { ...defaultNodeConfig, rootPackagePath: dummySimplePackage.path },
      conditions: [['custom'], ['custom']],
      targets: ['./alias.js', './alias.js'],
      subpaths: [
        ['#alias', '#alias/path/node'],
        ['#alias', '#alias/path/node']
      ]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('does not match absolute or non-dot-relative target to dot-relative imports', () => {
    test('@projector/core/project/resolve', async () => {
      expect.hasAssertions();

      expect(
        resolver.resolveEntryPointsFromImportsTarget({
          flattenedImports: getDummyFlattenedImports(),
          target: '/lite/worker.browser.js',
          conditions: ['worker', 'browser']
        })
      ).toStrictEqual([]);

      expect(
        resolver.resolveEntryPointsFromImportsTarget({
          flattenedImports: getDummyFlattenedImports(),
          target: 'lite/worker.browser.js',
          conditions: ['worker', 'browser']
        })
      ).toStrictEqual([]);

      expect(
        resolver.resolveEntryPointsFromImportsTarget({
          flattenedImports: getDummyFlattenedImports(),
          target: './lite-worker-browser.js',
          conditions: ['worker', 'browser']
        })
      ).toStrictEqual(['#lite']);

      expect(
        resolver.resolveEntryPointsFromImportsTarget({
          flattenedImports: getDummyFlattenedImports({
            '#missing-dot': ['./mixed/*.js', 'non-absolute/import.js']
          }),
          target: './non-absolute/import.js',
          includeUnsafeFallbackTargets: true
        })
      ).toStrictEqual([]);

      expect(
        resolver.resolveEntryPointsFromImportsTarget({
          flattenedImports: getDummyFlattenedImports({
            // * Technically this is an invalid target in package.json imports
            '#missing-dot': ['./mixed/*.js', 'non-absolute/import.js']
          }),
          target: 'non-absolute/import.js',
          includeUnsafeFallbackTargets: true
        })
      ).toStrictEqual(['#missing-dot']);

      expect(
        resolver.resolveEntryPointsFromImportsTarget({
          flattenedImports: getDummyFlattenedImports({
            '#missing-dot': { default: './non-absolute/deep/require' }
          }),
          // * Technically this is an invalid target in package.json imports
          target: 'non-absolute/deep/require'
        })
      ).toStrictEqual([]);

      expect(
        resolver.resolveEntryPointsFromImportsTarget({
          flattenedImports: getDummyFlattenedImports({
            '#missing-dot': { default: './non-absolute/deep/require' }
          }),
          target: './non-absolute/deep/require'
        })
      ).toStrictEqual(['#missing-dot']);
    });
  });

  describe('does not change its results due to the order of `conditions`', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreImportsConfig,
        operation: 'resolveEntryPointsFromImportsTarget'
      },
      library: defaultLibraryConfig,
      node: { ...defaultNodeConfig, rootPackagePath: dummySimplePackage.path },
      conditions: [
        ['worker', 'browser', 'import', 'require'],
        ['import', 'worker', 'require', 'browser']
      ],
      targets: ['./lite-worker-browser.js', './lite-worker-browser.js'],
      subpaths: [['#lite'], ['#lite']]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('returns subpath with asterisks replaced by default when pattern is matched', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreImportsConfig,
        operation: 'resolveEntryPointsFromImportsTarget'
      },
      library: defaultLibraryConfig,
      node: { ...defaultNodeConfig, rootPackagePath: dummySimplePackage.path },
      conditions: [
        ['default', 'browser', 'require'],
        ['default', 'browser', 'require'],
        ['default', 'browser', 'require'],
        ['default', 'browser', 'require']
      ],
      targets: [
        './features/file.js',
        './features/some/file.js',
        './features/some/file.mjs',
        './features/deep/another/file.js'
      ],
      subpaths: [
        ['#pattern-1/file.js', '#pattern-2/file.js'],
        ['#pattern-1/some/file.js', '#pattern-2/some/file.js'],
        ['#pattern-2/some/file.mjs'],
        [
          '#pattern-1/deep/another/file.js',
          '#pattern-2/deep/another/file.js',
          '#pattern-3/another/file.js'
        ]
      ]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('returns subpath as-is when pattern is matched and `replaceSubpathAsterisks` is false', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreImportsConfig,
        operation: 'resolveEntryPointsFromImportsTarget',
        options: { replaceSubpathAsterisks: false }
      },
      library: defaultLibraryConfig,
      node: { ...defaultNodeConfig, rootPackagePath: dummySimplePackage.path },
      conditions: [
        ['default', 'browser', 'require'],
        ['default', 'browser', 'require'],
        ['default', 'browser', 'require'],
        ['default', 'browser', 'require']
      ],
      targets: [
        './features/file.js',
        './features/some/file.js',
        './features/some/file.mjs',
        './features/deep/another/file.js'
      ],
      subpaths: [
        ['#pattern-1/*.js', '#pattern-2/*'],
        ['#pattern-1/*.js', '#pattern-2/*'],
        ['#pattern-2/*'],
        ['#pattern-1/*.js', '#pattern-2/*', '#pattern-3/*.js']
      ]
    });

    registerCoreResolverTest(context);
    // ? Node.js will NEVER do this, and resolve.exports lacks this feature.
    //registerLibraryResolverTest(context);
    //registerNodeResolverTest(context);
  });

  describe('returns the same results on non-pattern subpaths regardless of `replaceSubpathAsterisks`', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreImportsConfig,
        operation: 'resolveEntryPointsFromImportsTarget',
        options: [
          { replaceSubpathAsterisks: true },
          { replaceSubpathAsterisks: false },
          { includeUnsafeFallbackTargets: true, replaceSubpathAsterisks: true },
          { includeUnsafeFallbackTargets: true, replaceSubpathAsterisks: false }
        ]
      },
      library: defaultLibraryConfig,
      node: { ...defaultNodeConfig, rootPackagePath: dummySimplePackage.path },
      conditions: [['import'], ['import'], ['node', 'import'], ['node', 'import']],
      targets: ['./import.mjs', './import.mjs', './path-2.js', './path-2.js'],
      subpaths: [['#index'], ['#index'], ['#multi'], ['#multi']]
    });

    registerCoreResolverTest(context);
    // ? Node.js will never not replace asterisks, and resolve.exports lacks
    // ? this feature.
    //registerLibraryResolverTest(context);
    //registerNodeResolverTest(context);
  });

  describe('always returns literal subpaths when target pattern matches literally', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreImportsConfig,
        operation: 'resolveEntryPointsFromImportsTarget',
        options: [{ replaceSubpathAsterisks: true }, { replaceSubpathAsterisks: false }]
      },
      library: defaultLibraryConfig,
      node: { ...defaultNodeConfig, rootPackagePath: dummySimplePackage.path },
      conditions: [['default'], ['default', 'browser', 'require']],
      targets: ['./features/*.js', './features/deep/*.js'],
      subpaths: [
        ['#pattern-1/*.js'],
        ['#pattern-3/*.js', '#pattern-1/*.js', '#pattern-2/*']
      ]
    });

    registerCoreResolverTest(context);
    // ? Node.js will never not replace asterisks, and resolve.exports lacks
    // ? the ability to match literal subpath patterns.
    //registerLibraryResolverTest(context);
    //registerNodeResolverTest(context);
  });

  describe('handles mixed pattern and non-pattern fallback targets', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreImportsConfig,
        operation: 'resolveEntryPointsFromImportsTarget',
        options: [
          { includeUnsafeFallbackTargets: true },
          { includeUnsafeFallbackTargets: false },
          {}
        ]
      },
      library: {
        ...defaultLibraryConfig,
        expectAllTargets: ['./mixed/deep/file.js', './mixed/file.js']
      },
      node: {
        ...defaultNodeConfig,
        rootPackagePath: dummySimplePackage.path,
        expectOnlyTargets: './mixed/deep/file.js'
      },
      conditions: [['import'], ['import'], ['require']],
      targets: ['./mixed/file.js', './mixed/file.js', './mixed/deep/file.js'],
      subpaths: [['#mixed/file'], [], ['#mixed/file']]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('returns different results depending on conditions', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreImportsConfig,
        operation: 'resolveEntryPointsFromImportsTarget'
      },
      library: defaultLibraryConfig,
      node: { ...defaultNodeConfig, rootPackagePath: dummySimplePackage.path },
      conditions: [['default'], ['default', 'browser', 'require']],
      targets: ['./features/some/file.js', './features/some/file.js'],
      subpaths: [
        ['#pattern-1/some/file.js'],
        ['#pattern-1/some/file.js', '#pattern-2/some/file.js']
      ]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('handles sugared imports', () => {
    const dummySugaredPackage = getDummyPackage('sugared');
    const flattenedImports = flattenPackageJsonSubpathMap({
      map: dummySugaredPackage.imports
    });

    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreImportsConfig,
        flattenedMap: { flattenedImports },
        operation: 'resolveEntryPointsFromImportsTarget'
      },
      library: { ...defaultLibraryConfig, packageJson: dummySugaredPackage.packageJson },
      node: {
        ...defaultNodeConfig,
        rootPackagePath: dummySugaredPackage.path,
        packageName: dummySugaredPackage.name
      },
      conditions: [['default'], undefined],
      targets: ['./sugared/sugar.js', './sugared/sugar.js'],
      subpaths: [['#index'], ['#index']]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('handles non-conditional imports', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreImportsConfig,
        operation: 'resolveEntryPointsFromImportsTarget'
      },
      library: defaultLibraryConfig,
      node: { ...defaultNodeConfig, rootPackagePath: dummySimplePackage.path },
      conditions: [undefined],
      targets: ['./package.json'],
      subpaths: [['#package', '#package.json']]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('chooses longest nested default pattern', () => {
    const dummyDefaultsPackage = getDummyPackage('defaults');

    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreImportsConfig,
        flattenedMap: {
          flattenedImports: flattenPackageJsonSubpathMap({
            map: dummyDefaultsPackage.imports
          })
        },
        operation: 'resolveEntryPointsFromImportsTarget'
      },
      library: { ...defaultLibraryConfig, packageJson: dummyDefaultsPackage.packageJson },
      node: {
        ...defaultNodeConfig,
        rootPackagePath: dummyDefaultsPackage.path,
        packageName: dummyDefaultsPackage.name
      },
      conditions: [undefined, ['import']],
      targets: ['./default-1.js', './default-2.js'],
      subpaths: [['#default1'], ['#default/2']]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('handles targets with multiple asterisks', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreImportsConfig,
        operation: 'resolveEntryPointsFromImportsTarget'
      },
      library: defaultLibraryConfig,
      node: { ...defaultNodeConfig, rootPackagePath: dummySimplePackage.path },
      conditions: [undefined, undefined, undefined],
      targets: [
        './asterisk/file/file.js',
        './asterisk/file/yet-another/file.js',
        './asterisk/file/yet-another/asterisk/file.js'
      ],
      subpaths: [
        ['#multiple-asterisk-good-1/file'],
        [],
        ['#multiple-asterisk-good-2/asterisk/file']
      ]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('returns an empty array for subpaths with multiple asterisks', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreImportsConfig,
        operation: 'resolveEntryPointsFromImportsTarget'
      },
      library: defaultLibraryConfig,
      node: { ...defaultNodeConfig, rootPackagePath: dummySimplePackage.path },
      conditions: [undefined],
      targets: ['./asterisk/file/yet-another/file.js'],
      subpaths: [[]]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('handles subpaths and targets that begin with "./."', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreImportsConfig,
        operation: 'resolveEntryPointsFromImportsTarget'
      },
      library: defaultLibraryConfig,
      node: { ...defaultNodeConfig, rootPackagePath: dummySimplePackage.path },
      conditions: [['default']],
      targets: ['./.hidden'],
      subpaths: [['#.hidden']]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('handles overlapping unlimited imports while respecting null targets', () => {
    const dummyUnlimitedPackage = getDummyPackage('unlimited');

    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreImportsConfig,
        flattenedMap: {
          flattenedImports: flattenPackageJsonSubpathMap({
            map: dummyUnlimitedPackage.imports
          })
        },
        operation: 'resolveEntryPointsFromImportsTarget'
      },
      library: {
        ...defaultLibraryConfig,
        packageJson: dummyUnlimitedPackage.packageJson
      },
      node: {
        ...defaultNodeConfig,
        rootPackagePath: dummyUnlimitedPackage.path,
        packageName: dummyUnlimitedPackage.name
      },
      conditions: [['default'], ['default']],
      targets: ['./file.js', './another-file.js'],
      subpaths: [[], ['#index/another-file.js']]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('returns the longest matching subpath pattern (so-called "best match") and ignores the others', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreImportsConfig,
        operation: 'resolveEntryPointsFromImportsTarget'
      },
      library: defaultLibraryConfig,
      node: { ...defaultNodeConfig, rootPackagePath: dummySimplePackage.path },
      conditions: [undefined],
      targets: ['./not-private/not-secret.js'],
      subpaths: [['#pattern-4/deep/deeper/not-secret.js']]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('considers characters after the asterisk only when pattern before asterisk is identical', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreImportsConfig,
        operation: 'resolveEntryPointsFromImportsTarget'
      },
      library: {
        ...defaultLibraryConfig,
        // ? resolve.exports cannot handle the overlapping subpaths and fails
        expectTestsToFail: ['1.2']
      },
      node: { ...defaultNodeConfig, rootPackagePath: dummySimplePackage.path },
      conditions: [undefined],
      targets: ['./not-private/maybe-private/might-be-secret.cjs'],
      subpaths: [
        [
          // ? For subpath patterns with targets without asterisks, the literal
          // ? subpath is returned since the asterisk can be replaced with
          // ? anything.
          '#pattern-4/maybe-private/m*.cjs'
        ]
      ]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('does not return subpath patterns if a non-pattern match is found', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreImportsConfig,
        operation: 'resolveEntryPointsFromImportsTarget'
      },
      library: defaultLibraryConfig,
      node: { ...defaultNodeConfig, rootPackagePath: dummySimplePackage.path },
      conditions: [undefined],
      targets: ['./not-private/deep/file.js'],
      subpaths: [['#pattern-4/deep/deeper/file.js']]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('does not return a subpath if its target is unreachable due to overlapping subpath patterns (implicitly dead)', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreImportsConfig,
        operation: 'resolveEntryPointsFromImportsTarget'
      },
      library: defaultLibraryConfig,
      node: { ...defaultNodeConfig, rootPackagePath: dummySimplePackage.path },
      conditions: [undefined],
      targets: ['./not-private/file.js'],
      subpaths: [[]]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('does not return subpaths if its target is actually unreachable because the wanted condition occurs after the "default" condition (explicitly dead)', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreImportsConfig,
        flattenedMap: {
          flattenedImports: flattenPackageJsonSubpathMap({ map: dummyComplexImports })
        },
        operation: 'resolveEntryPointsFromImportsTarget',
        options: [
          {},
          {},
          { includeUnsafeFallbackTargets: true },
          { includeUnsafeFallbackTargets: true }
        ]
      },
      library: { ...defaultLibraryConfig, packageJson: dummyComplexPackage.packageJson },
      node: {
        ...defaultNodeConfig,
        rootPackagePath: dummySimplePackage.path,
        packageName: dummyComplexPackage.name
      },
      conditions: [['dead-case-1'], ['dead-case-2'], ['dead-case-1'], ['dead-case-2']],
      targets: ['./unsafe.js', './unsafe.js', './unsafe.js', './unsafe.js'],
      subpaths: [[], [], [], []]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('returns mutually exclusive pattern and non-pattern subpaths when a different subpath pattern with a null target matches', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreImportsConfig,
        operation: 'resolveEntryPointsFromImportsTarget'
      },
      library: defaultLibraryConfig,
      node: { ...defaultNodeConfig, rootPackagePath: dummySimplePackage.path },
      conditions: [undefined],
      targets: ['./not-private/maybe-private/not-secret.js'],
      subpaths: [
        [
          '#pattern-4/maybe-private/not-secret.js',
          '#pattern-4/deep/deeper/maybe-private/not-secret.js'
        ]
      ]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('does not return subpath pattern when it ends up matching either a null target or null last fallback target', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreImportsConfig,
        operation: 'resolveEntryPointsFromImportsTarget',
        options: [{}, {}, { includeUnsafeFallbackTargets: true }, {}]
      },
      library: defaultLibraryConfig,
      node: { ...defaultNodeConfig, rootPackagePath: dummySimplePackage.path },
      conditions: [['default'], ['require'], ['require'], ['import']],
      targets: [
        './features/private-internal/secret.js',
        './features/private-explicit/secret.js',
        './features/private-explicit/secret.js',
        './features/private-explicit/secret.js'
      ],
      subpaths: [
        [],
        // ? Handles null when it is the last fallback item left
        [],
        // ? Handles null when it is the last fallback item left
        [],
        []
      ]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('skips null fallback targets, even when `target` is null, unless last fallback target is also null', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreImportsConfig,
        flattenedMap: {
          flattenedImports: flattenPackageJsonSubpathMap({ map: dummyComplexImports })
        },
        operation: 'resolveEntryPointsFromImportsTarget',
        options: [
          { includeUnsafeFallbackTargets: false },
          { includeUnsafeFallbackTargets: true },
          { includeUnsafeFallbackTargets: false },
          { includeUnsafeFallbackTargets: true },
          { includeUnsafeFallbackTargets: true },
          { includeUnsafeFallbackTargets: false }
        ]
      },
      library: {
        ...defaultLibraryConfig,
        packageJson: dummyComplexPackage.packageJson
      },
      node: {
        ...defaultNodeConfig,
        rootPackagePath: dummyComplexPackage.path,
        packageName: dummyComplexPackage.name
      },
      conditions: [
        undefined,
        undefined,
        undefined,
        undefined,
        ['custom-edge-2'],
        ['custom-edge-2']
      ],
      targets: ['./node-1.js', './node-1.js', null, null, null, null],
      subpaths: [
        ['#null-in-fallback'],
        ['#null-in-fallback'],
        ['#complex-1', '#complex-4/deep/*'],
        ['#complex-1', '#complex-4/deep/*'],
        ['#complex-1', '#complex-4/deep/*', '#null-in-fallback-edge-case-2'],
        ['#complex-1', '#complex-4/deep/*', '#null-in-fallback-edge-case-2']
      ]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('handles non-null non-default fallback target surrounded by null', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreImportsConfig,
        flattenedMap: {
          flattenedImports: flattenPackageJsonSubpathMap({ map: dummyComplexImports })
        },
        operation: 'resolveEntryPointsFromImportsTarget'
      },
      library: {
        ...defaultLibraryConfig,
        packageJson: dummyComplexPackage.packageJson
      },
      node: {
        ...defaultNodeConfig,
        rootPackagePath: dummyComplexPackage.path,
        packageName: dummyComplexPackage.name
      },
      conditions: [['custom-edge-1'], ['custom-edge-1']],
      targets: ['./string-3.js', null],
      subpaths: [
        ['#null-in-fallback-edge-case-1', '#null-in-fallback-edge-case-2'],
        ['#complex-1', '#complex-4/deep/*']
      ]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('does not conflate co-located conditions with null fallback targets', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreImportsConfig,
        flattenedMap: {
          flattenedImports: flattenPackageJsonSubpathMap({ map: dummyComplexImports })
        },
        operation: 'resolveEntryPointsFromImportsTarget'
      },
      library: {
        ...defaultLibraryConfig,
        packageJson: dummyComplexPackage.packageJson
      },
      node: {
        ...defaultNodeConfig,
        rootPackagePath: dummyComplexPackage.path,
        packageName: dummyComplexPackage.name
      },
      conditions: [['custom-edge-2'], ['custom-edge-2'], ['import']],
      targets: ['./string-3.js', null, './string-3.js'],
      subpaths: [
        [],
        ['#complex-1', '#complex-4/deep/*', '#null-in-fallback-edge-case-2'],
        ['#null-in-fallback-edge-case-2']
      ]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  it('is the inverse of `resolveImportsTargetsFromEntryPoint`', async () => {
    expect.hasAssertions();
    const flattenedImports = getDummyFlattenedImports();
    const conditions = ['types'];
    const target = './alias.d.ts';

    expect(
      resolver.resolveImportsTargetsFromEntryPoint({
        flattenedImports,
        entryPoint:
          resolver.resolveEntryPointsFromImportsTarget({
            flattenedImports,
            target,
            conditions
          })[0] || toss(new TrialError()),
        conditions
      })
    ).toStrictEqual([target]);
  });
});

describe('::resolveImportsTargetsFromEntryPoint', () => {
  describe('returns the correct target', () => {
    const context = createSharedForwardMappingTestContext({
      core: {
        ...defaultCoreImportsConfig,
        operation: 'resolveImportsTargetsFromEntryPoint'
      },
      library: defaultLibraryConfig,
      node: { ...defaultNodeConfig, rootPackagePath: dummySimplePackage.path },
      conditions: [['import']],
      targets: [['./import.mjs']],
      entryPoints: ['#index']
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('handles bare import targets (without ./)', () => {
    const context = createSharedForwardMappingTestContext({
      core: {
        ...defaultCoreImportsConfig,
        operation: 'resolveImportsTargetsFromEntryPoint'
      },
      library: defaultLibraryConfig,
      node: { ...defaultNodeConfig, rootPackagePath: dummySimplePackage.path },
      conditions: [['import', 'node']],
      targets: [['hash-pkg/polyfill.js']],
      entryPoints: ['#hash']
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('returns an empty array if `entryPoint` does not exist', () => {
    const context = createSharedForwardMappingTestContext({
      core: {
        ...defaultCoreImportsConfig,
        operation: 'resolveImportsTargetsFromEntryPoint'
      },
      library: defaultLibraryConfig,
      node: { ...defaultNodeConfig, rootPackagePath: dummySimplePackage.path },
      conditions: [['import']],
      targets: [[]],
      entryPoints: ['#does/not/exist']
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('returns an empty array if `entryPoint` matches a subpath with a null target', () => {
    const context = createSharedForwardMappingTestContext({
      core: {
        ...defaultCoreImportsConfig,
        operation: 'resolveImportsTargetsFromEntryPoint'
      },
      library: defaultLibraryConfig,
      node: { ...defaultNodeConfig, rootPackagePath: dummySimplePackage.path },
      conditions: [['import']],
      targets: [[]],
      entryPoints: ['#null']
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('returns an empty array if `entryPoint` matches a subpath pattern with a null target or null last fallback target', () => {
    const context = createSharedForwardMappingTestContext({
      core: {
        ...defaultCoreImportsConfig,
        operation: 'resolveImportsTargetsFromEntryPoint'
      },
      library: defaultLibraryConfig,
      node: { ...defaultNodeConfig, rootPackagePath: dummySimplePackage.path },
      conditions: [['import'], ['import']],
      targets: [[], []],
      entryPoints: [
        '#pattern-1/private-explicit/secret.js',
        '#pattern-2/private-explicit/secret.js'
      ]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('returns first non-null fallback target', () => {
    const context = createSharedForwardMappingTestContext({
      core: {
        ...defaultCoreImportsConfig,
        operation: 'resolveImportsTargetsFromEntryPoint'
      },
      library: defaultLibraryConfig,
      node: { ...defaultNodeConfig, rootPackagePath: dummySimplePackage.path },
      conditions: [['import']],
      targets: [['./not-private/not-secret.js']],
      entryPoints: ['#pattern-4/deep/not-secret.js']
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('returns entire fallback array, excluding null targets, if `includeUnsafeFallbackTargets` is true', () => {
    const context = createSharedForwardMappingTestContext({
      core: {
        ...defaultCoreImportsConfig,
        flattenedMap: {
          flattenedImports: flattenPackageJsonSubpathMap({ map: dummyComplexImports })
        },
        operation: 'resolveImportsTargetsFromEntryPoint',
        options: { includeUnsafeFallbackTargets: true }
      },
      library: { ...defaultLibraryConfig, packageJson: dummyComplexPackage.packageJson },
      node: {
        ...defaultNodeConfig,
        rootPackagePath: dummyComplexPackage.path,
        packageName: dummyComplexPackage.name
      },
      conditions: [['import'], ['import'], ['import']],
      targets: [['./node-1.js', './string-3.js'], ['./import.js'], ['./string-3.js']],
      entryPoints: [
        '#null-in-fallback',
        '#null-in-fallback-edge-case-1',
        '#null-in-fallback-edge-case-2'
      ]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('returns an empty array if `flattenedImports` is empty', () => {
    const context = createSharedForwardMappingTestContext({
      core: {
        ...defaultCoreImportsConfig,
        flattenedMap: { flattenedImports: [] },
        operation: 'resolveImportsTargetsFromEntryPoint'
      },
      library: defaultLibraryConfig,
      node: { ...defaultNodeConfig, rootPackagePath: dummySimplePackage.path },
      conditions: [undefined],
      targets: [[]],
      entryPoints: ['#index']
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('returns target using "default" condition if `conditions` is empty or undefined', () => {
    const context = createSharedForwardMappingTestContext({
      core: {
        ...defaultCoreImportsConfig,
        operation: 'resolveImportsTargetsFromEntryPoint'
      },
      library: defaultLibraryConfig,
      node: { ...defaultNodeConfig, rootPackagePath: dummySimplePackage.path },
      conditions: [undefined, []],
      targets: [['./alias.js'], ['./alias.js']],
      entryPoints: ['#alias', '#alias/path/node']
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('returns target using "default" condition when available even if `conditions` are not matched', () => {
    const context = createSharedForwardMappingTestContext({
      core: {
        ...defaultCoreImportsConfig,
        operation: 'resolveImportsTargetsFromEntryPoint'
      },
      library: defaultLibraryConfig,
      node: { ...defaultNodeConfig, rootPackagePath: dummySimplePackage.path },
      conditions: [['custom'], ['custom']],
      targets: [['./alias.js'], ['./alias.js']],
      entryPoints: ['#alias', '#alias/path/node']
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('does not change its results due to the order of `conditions`', () => {
    const context = createSharedForwardMappingTestContext({
      core: {
        ...defaultCoreImportsConfig,
        operation: 'resolveImportsTargetsFromEntryPoint'
      },
      library: defaultLibraryConfig,
      node: { ...defaultNodeConfig, rootPackagePath: dummySimplePackage.path },
      conditions: [
        ['worker', 'browser', 'import', 'require'],
        ['import', 'worker', 'require', 'browser']
      ],
      targets: [['./lite-worker-browser.js'], ['./lite-worker-browser.js']],
      entryPoints: ['#lite', '#lite']
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('returns target with asterisks replaced when pattern is matched', () => {
    const context = createSharedForwardMappingTestContext({
      core: {
        ...defaultCoreImportsConfig,
        operation: 'resolveImportsTargetsFromEntryPoint'
      },
      library: defaultLibraryConfig,
      node: { ...defaultNodeConfig, rootPackagePath: dummySimplePackage.path },
      conditions: [
        ['default', 'browser', 'require'],
        ['default', 'browser', 'require'],
        ['default', 'browser', 'require'],
        ['default', 'browser', 'require']
      ],
      targets: [
        ['./features/file.js'],
        ['./features/some/file.js'],
        ['./features/some/file.mjs'],
        ['./features/deep/another/file.js']
      ],
      entryPoints: [
        '#pattern-1/file.js',
        '#pattern-1/some/file.js',
        '#pattern-2/some/file.mjs',
        '#pattern-1/deep/another/file.js'
      ]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('handles mixed pattern and non-pattern fallback targets', () => {
    const context = createSharedForwardMappingTestContext({
      core: {
        ...defaultCoreImportsConfig,
        operation: 'resolveImportsTargetsFromEntryPoint'
      },
      library: {
        ...defaultLibraryConfig,
        expectAllTargets: [
          ['./mixed/deep/file.js', './mixed/file.js'],
          ['./mixed/deep/deep/file.js', './mixed/deep/file.js']
        ]
      },
      node: { ...defaultNodeConfig, rootPackagePath: dummySimplePackage.path },
      conditions: [['import'], ['require']],
      targets: [['./mixed/deep/file.js'], ['./mixed/deep/deep/file.js']],
      entryPoints: ['#mixed/file', '#mixed/deep/file']
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('returns different results depending on conditions', () => {
    const context = createSharedForwardMappingTestContext({
      core: {
        ...defaultCoreImportsConfig,
        operation: 'resolveImportsTargetsFromEntryPoint'
      },
      library: defaultLibraryConfig,
      node: { ...defaultNodeConfig, rootPackagePath: dummySimplePackage.path },
      conditions: [['default'], ['default', 'browser', 'require']],
      targets: [['./features/some/file.js'], ['./features/some/file.js']],
      entryPoints: ['#pattern-1/some/file.js', '#pattern-2/some/file.js']
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('handles sugared imports', () => {
    const dummySugaredPackage = getDummyPackage('sugared');
    const flattenedImports = flattenPackageJsonSubpathMap({
      map: dummySugaredPackage.imports
    });

    const context = createSharedForwardMappingTestContext({
      core: {
        ...defaultCoreImportsConfig,
        flattenedMap: { flattenedImports },
        operation: 'resolveImportsTargetsFromEntryPoint'
      },
      library: { ...defaultLibraryConfig, packageJson: dummySugaredPackage.packageJson },
      node: {
        ...defaultNodeConfig,
        rootPackagePath: dummySugaredPackage.path,
        packageName: dummySugaredPackage.name
      },
      conditions: [['default'], undefined],
      targets: [['./sugared/sugar.js'], ['./sugared/sugar.js']],
      entryPoints: ['#index', '#index']
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('handles non-conditional imports', () => {
    const context = createSharedForwardMappingTestContext({
      core: {
        ...defaultCoreImportsConfig,
        operation: 'resolveImportsTargetsFromEntryPoint'
      },
      library: defaultLibraryConfig,
      node: { ...defaultNodeConfig, rootPackagePath: dummySimplePackage.path },
      conditions: [undefined, undefined],
      targets: [['./package.json'], ['./package.json']],
      entryPoints: ['#package', '#package.json']
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('handles targets with multiple asterisks', () => {
    const context = createSharedForwardMappingTestContext({
      core: {
        ...defaultCoreImportsConfig,
        operation: 'resolveImportsTargetsFromEntryPoint'
      },
      library: defaultLibraryConfig,
      node: { ...defaultNodeConfig, rootPackagePath: dummySimplePackage.path },
      conditions: [undefined, undefined],
      targets: [
        ['./asterisk/file/file.js'],
        ['./asterisk/file/yet-another/asterisk/file.js']
      ],
      entryPoints: [
        '#multiple-asterisk-good-1/file',
        '#multiple-asterisk-good-2/asterisk/file'
      ]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('returns an empty array for entry points with multiple asterisks', () => {
    const context = createSharedForwardMappingTestContext({
      core: {
        ...defaultCoreImportsConfig,
        operation: 'resolveImportsTargetsFromEntryPoint'
      },
      library: {
        ...defaultLibraryConfig,
        // ? resolve.exports does not handle multi-asterisk subpaths properly
        expectTestsToFail: ['1.1']
      },
      node: { ...defaultNodeConfig, rootPackagePath: dummySimplePackage.path },
      conditions: [undefined],
      targets: [[]],
      entryPoints: ['#multiple-asterisks-bad/bad/bad']
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('handles entry points and targets that begin with "."', () => {
    const context = createSharedForwardMappingTestContext({
      core: {
        ...defaultCoreImportsConfig,
        operation: 'resolveImportsTargetsFromEntryPoint'
      },
      library: defaultLibraryConfig,
      node: { ...defaultNodeConfig, rootPackagePath: dummySimplePackage.path },
      conditions: [['default']],
      targets: [['./.hidden']],
      entryPoints: ['#.hidden']
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('handles overlapping unlimited imports while respecting null targets', () => {
    const dummyUnlimitedPackage = getDummyPackage('unlimited');

    const context = createSharedForwardMappingTestContext({
      core: {
        ...defaultCoreImportsConfig,
        flattenedMap: {
          flattenedImports: flattenPackageJsonSubpathMap({
            map: dummyUnlimitedPackage.imports
          })
        },
        operation: 'resolveImportsTargetsFromEntryPoint'
      },
      library: {
        ...defaultLibraryConfig,
        packageJson: dummyUnlimitedPackage.packageJson
      },
      node: {
        ...defaultNodeConfig,
        rootPackagePath: dummyUnlimitedPackage.path,
        packageName: dummyUnlimitedPackage.name
      },
      conditions: [['default'], ['default']],
      targets: [[], ['./another-file.js']],
      entryPoints: ['#file.js', '#index/another-file.js']
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('returns the target from the longest matching subpath pattern (so-called "best match") and ignores the others', () => {
    const context = createSharedForwardMappingTestContext({
      core: {
        ...defaultCoreImportsConfig,
        operation: 'resolveImportsTargetsFromEntryPoint'
      },
      library: defaultLibraryConfig,
      node: { ...defaultNodeConfig, rootPackagePath: dummySimplePackage.path },
      conditions: [undefined],
      targets: [['./not-private/not-secret.js']],
      entryPoints: ['#pattern-4/deep/deeper/not-secret.js']
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('does not return subpath patterns if a non-pattern match is found', () => {
    const context = createSharedForwardMappingTestContext({
      core: {
        ...defaultCoreImportsConfig,
        operation: 'resolveImportsTargetsFromEntryPoint'
      },
      library: defaultLibraryConfig,
      node: { ...defaultNodeConfig, rootPackagePath: dummySimplePackage.path },
      conditions: [undefined],
      targets: [['./not-private/deep/file.js']],
      entryPoints: ['#pattern-4/deep/deeper/file.js']
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('does not return targets that are unreachable because the wanted condition occurs after the "default" condition (explicitly dead)', () => {
    const context = createSharedForwardMappingTestContext({
      core: {
        ...defaultCoreImportsConfig,
        flattenedMap: {
          flattenedImports: flattenPackageJsonSubpathMap({ map: dummyComplexImports })
        },
        operation: 'resolveImportsTargetsFromEntryPoint',
        options: [
          {},
          {},
          { includeUnsafeFallbackTargets: true },
          { includeUnsafeFallbackTargets: true }
        ]
      },
      library: {
        ...defaultLibraryConfig,
        packageJson: dummyComplexPackage.packageJson,
        expectAllTargets: [
          ['./default.js'],
          ['./default.js', './string.js'],
          ['./default.js'],
          ['./default.js', './string.js']
        ]
      },
      node: {
        ...defaultNodeConfig,
        rootPackagePath: dummyComplexPackage.path,
        packageName: dummyComplexPackage.name
      },
      conditions: [['dead-case-1'], ['dead-case-2'], ['dead-case-1'], ['dead-case-2']],
      targets: [
        ['./default.js'],
        ['./default.js'],
        ['./default.js'],
        ['./default.js', './string.js']
      ],
      entryPoints: ['#edge-case-2', '#edge-case-3', '#edge-case-2', '#edge-case-3']
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('does not targets when entry point also matches either a null target or null last fallback target', () => {
    const context = createSharedForwardMappingTestContext({
      core: {
        ...defaultCoreImportsConfig,
        operation: 'resolveImportsTargetsFromEntryPoint',
        options: [{}, {}, { includeUnsafeFallbackTargets: true }, {}]
      },
      library: defaultLibraryConfig,
      node: { ...defaultNodeConfig, rootPackagePath: dummySimplePackage.path },
      conditions: [['default'], ['require'], ['require'], ['import']],
      targets: [[], [], [], []],
      entryPoints: [
        '#pattern-1/private-internal/secret.js',
        // ? Handles null when it is the last fallback item left
        '#pattern-1/private-explicit/secret.js',
        // ? Handles null when it is the last fallback item left
        '#pattern-2/private-explicit/secret.js',
        '#pattern-2/private-explicit/secret.js'
      ]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('handles non-null non-default fallback target surrounded by null', () => {
    const context = createSharedForwardMappingTestContext({
      core: {
        ...defaultCoreImportsConfig,
        flattenedMap: {
          flattenedImports: flattenPackageJsonSubpathMap({ map: dummyComplexImports })
        },
        operation: 'resolveImportsTargetsFromEntryPoint'
      },
      library: {
        ...defaultLibraryConfig,
        packageJson: dummyComplexPackage.packageJson
      },
      node: {
        ...defaultNodeConfig,
        rootPackagePath: dummyComplexPackage.path,
        packageName: dummyComplexPackage.name
      },
      conditions: [['custom-edge-1'], ['custom-edge-1']],
      targets: [['./string-3.js'], ['./string-3.js']],
      entryPoints: ['#null-in-fallback-edge-case-1', '#null-in-fallback-edge-case-2']
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('does not conflate co-located conditions with null fallback targets', () => {
    const context = createSharedForwardMappingTestContext({
      core: {
        ...defaultCoreImportsConfig,
        flattenedMap: {
          flattenedImports: flattenPackageJsonSubpathMap({ map: dummyComplexImports })
        },
        operation: 'resolveImportsTargetsFromEntryPoint'
      },
      library: {
        ...defaultLibraryConfig,
        packageJson: dummyComplexPackage.packageJson
      },
      node: {
        ...defaultNodeConfig,
        rootPackagePath: dummyComplexPackage.path,
        packageName: dummyComplexPackage.name
      },
      conditions: [['custom-edge-2'], ['import']],
      targets: [[], ['./string-3.js']],
      entryPoints: ['#null-in-fallback-edge-case-2', '#null-in-fallback-edge-case-2']
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  it('is the inverse of `resolveEntryPointsFromImportsTarget`', async () => {
    expect.hasAssertions();

    const flattenedImports = getDummyFlattenedImports();
    const conditions = ['types'];
    const entryPoint = '#alias';

    expect(
      resolver.resolveEntryPointsFromImportsTarget({
        flattenedImports,
        target:
          resolver.resolveImportsTargetsFromEntryPoint({
            flattenedImports,
            entryPoint,
            conditions
          })[0] || toss(new TrialError()),
        conditions
      })
    ).toStrictEqual([entryPoint]);
  });
});

type SharedTestContextCoreOptions = Partial<
  resolver.UnsafeFallbackOption & resolver.ReplaceSubpathAsterisksOption
>;

type CreateSharedTestContextOptions<MapType extends 'forward' | 'reverse'> = {
  /**
   * Configuration for the projector resolver functions.
   */
  core: {
    /**
     * An object of options passed to the core resolver function at each
     * invocation or an array of options each of which will be applied to a
     * corresponding invocation. Unlike `conditions`, `targets`, etc., the array
     * form of `options` can be of any length.
     */
    options?: SharedTestContextCoreOptions | SharedTestContextCoreOptions[];
  } & (MapType extends 'reverse'
    ?
        | {
            flattenedMap: resolver.FlattenedExportsOption;
            operation: 'resolveEntryPointsFromExportsTarget';
          }
        | {
            flattenedMap: resolver.FlattenedImportsOption;
            operation: 'resolveEntryPointsFromImportsTarget';
          }
    :
        | {
            flattenedMap: resolver.FlattenedExportsOption;
            operation: 'resolveExportsTargetsFromEntryPoint';
          }
        | {
            flattenedMap: resolver.FlattenedImportsOption;
            operation: 'resolveImportsTargetsFromEntryPoint';
          });
  /**
   * Configuration for the resolve.exports library.
   */
  library: {
    packageJson: PackageJson;
    /**
     * Sometimes resolve.exports has bugs or cannot handle some more complex
     * spec-compliant use cases. When this is the case, add the failing test's
     * numeric id (the number after the "#", e.g. "1.2" or "2.3") to
     * `expectTestsToFail` to prevent the test from reporting a failure.
     *
     * However, if said test does not fail, the testing framework will report an
     * error. This lets us know when resolve.exports has released bug fixes and
     * to update our tests accordingly.
     */
    expectTestsToFail?: `${bigint}.${bigint}`[];
  } & (MapType extends 'reverse'
    ? {
        /**
         * An array that should be returned by resolve.exports in a single
         * invocation or an array of arrays each of which should be returned by
         * their corresponding invocation of resolve.exports. In the latter form,
         * the array must be the same size as `conditions`, `targets`, etc.
         *
         * The latter form can also include nested arrays that will be mapped to
         * corresponding nested `subpaths`. In this special "third form," the
         * sub-array must be the same size its corresponding nested `subpaths`
         * array.
         */
        expectAllTargets?:
          | SubpathMapping['target'][]
          | (SubpathMapping['target'][] | SubpathMapping['target'][][])[];
      }
    : {
        /**
         * An array that should be returned by resolve.exports in a single
         * invocation or an array of arrays each of which should be returned by
         * their corresponding invocation of resolve.exports. In the latter form,
         * the array must be the same size as `conditions`, `targets`, etc.
         */
        expectAllTargets?: SubpathMapping['target'][] | SubpathMapping['target'][][];
      });
  /**
   * Configuration for the Node.js resolver.
   */
  node: {
    packageName: string;
    rootPackagePath: string;
  } & (MapType extends 'reverse'
    ? {
        /**
         * A target that should be resolved by Node.js's resolver in a single
         * invocation or an array of targets each of which should be resolved by
         * their corresponding invocation of Node.js's resolver. In the latter form,
         * the array must be the same size as `conditions`, `targets`, etc.
         *
         * The latter form can also include nested arrays that will be mapped to
         * corresponding nested `subpaths`. In this special "third form," the
         * sub-array must be the same size its corresponding nested `subpaths`
         * array.
         */
        expectOnlyTargets?:
          | SubpathMapping['target']
          | (SubpathMapping['target'] | SubpathMapping['target'][])[];
      }
    : {
        /**
         * A target that should be resolved by Node.js's resolver in a single
         * invocation or an array of targets each of which should be resolved by
         * their corresponding invocation of Node.js's resolver. In the latter form,
         * the array must be the same size as `conditions`, `targets`, etc.
         */
        expectOnlyTargets?: SubpathMapping['target'] | SubpathMapping['target'][];
      });
  conditions: (SubpathMapping['conditions'] | undefined)[];
  targets: MapType extends 'reverse'
    ? SubpathMapping['target'][]
    : SubpathMapping['target'][][];
} & (MapType extends 'reverse'
  ? { subpaths: SubpathMapping['subpath'][][] }
  : {
      entryPoints: SubpathMapping['subpath'][];
    });

function validateContext(
  context:
    | CreateSharedTestContextOptions<'forward'>
    | CreateSharedTestContextOptions<'reverse'>
) {
  const pathKey = 'entryPoints' in context ? 'entryPoints' : 'subpaths';
  const pathValue = 'entryPoints' in context ? context.entryPoints : context.subpaths;
  const { library, node, conditions, targets } = context;

  assert(
    conditions.length === targets.length && conditions.length === pathValue.length,
    `shared test context conditions (${conditions.length}), targets (${targets.length}), and ${pathKey} (${pathValue.length}) arrays must be same length`
  );

  const shouldApplyEAPGlobally =
    Array.isArray(library?.expectAllTargets) &&
    !Array.isArray(library?.expectAllTargets[0]);

  if (library?.expectAllTargets && !shouldApplyEAPGlobally) {
    assert(
      library.expectAllTargets.length === conditions.length,
      `expectAllTargets array (${library.expectAllTargets.length}) must be the same length (${conditions.length}) as shared test context conditions, ${pathKey}, and targets arrays`
    );

    (
      library.expectAllTargets as Extract<
        typeof library.expectAllTargets,
        Exclude<typeof library.expectAllTargets, (string | null)[]>
      >
    ).forEach((targets_, index) => {
      const maybeSubArray = targets_.at(0);
      assert(
        !Array.isArray(maybeSubArray) || targets_.length === pathValue[index]?.length,
        `expectAllTargets sub-array at index ${index} (${targets_.length}) must be the same length (${pathValue[index]?.length}) as shared test context ${pathKey} array at the same index`
      );
    });
  }

  const shouldApplyEOPGlobally = !Array.isArray(node?.expectOnlyTargets);

  if (node?.expectOnlyTargets && !shouldApplyEOPGlobally) {
    assert(
      node.expectOnlyTargets.length === conditions.length,
      `expectOnlyTargets array (${node.expectOnlyTargets.length}) must be the same length (${conditions.length}) as shared test context conditions, ${pathKey}, and targets arrays`
    );

    (
      node.expectOnlyTargets as Extract<
        typeof node.expectOnlyTargets,
        Exclude<typeof node.expectOnlyTargets, string | null>
      >
    ).forEach((target_, index) => {
      assert(
        !Array.isArray(target_) || target_.length === pathValue[index]?.length,
        `expectOnlyTargets sub-array at index ${index} (${target_?.length}) must be the same length (${pathValue[index]?.length}) as shared test context ${pathKey} array at the same index`
      );
    });
  }

  return { shouldApplyEAPGlobally, shouldApplyEOPGlobally };
}

/**
 * Used to generate tests evaluating the correctness of target => subpath
 * resolver functions.
 */
function createSharedReverseMappingTestContext(
  context: CreateSharedTestContextOptions<'reverse'>
) {
  const { shouldApplyEAPGlobally, shouldApplyEOPGlobally } = validateContext(context);
  const { core, library, node, conditions, targets, subpaths } = context;

  return {
    core,
    library: { ...library, shouldApplyEAPGlobally },
    node: { ...node, shouldApplyEOPGlobally },
    conditions,
    targets,
    subpaths
  };
}

/**
 * Used to generate tests evaluating the correctness of subpath => target
 * resolver functions.
 */
function createSharedForwardMappingTestContext(
  context: CreateSharedTestContextOptions<'forward'>
) {
  const { shouldApplyEAPGlobally, shouldApplyEOPGlobally } = validateContext(context);
  const { core, library, node, conditions, targets, entryPoints } = context;

  return {
    core,
    library: { ...library, shouldApplyEAPGlobally },
    node: { ...node, shouldApplyEOPGlobally },
    conditions,
    targets,
    entryPoints
  };
}

function registerCoreResolverTest(
  context:
    | ReturnType<typeof createSharedReverseMappingTestContext>
    | ReturnType<typeof createSharedForwardMappingTestContext>
) {
  const { core, conditions } = context;

  // eslint-disable-next-line unicorn/no-for-loop
  for (let index = 0; index < conditions.length; ++index) {
    const additionalOptions = Array.isArray(core.options)
      ? core.options[index]
      : core.options;

    test(`@projector/core/project/resolve #${index + 1}`, async () => {
      expect.hasAssertions();

      if ('subpaths' in context) {
        expect(
          // ? We're bumping up against the limits of TypeScript and Eslint here
          // eslint-disable-next-line import/namespace
          resolver[context.core.operation]({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ...(core.flattenedMap as any),
            target: context.targets[index],
            conditions: conditions[index],
            ...additionalOptions
          })
        ).toStrictEqual(context.subpaths[index]);
      } else {
        expect(
          // ? We're bumping up against the limits of TypeScript and Eslint here
          // eslint-disable-next-line import/namespace
          resolver[context.core.operation]({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ...(core.flattenedMap as any),
            entryPoint: context.entryPoints[index],
            conditions: conditions[index],
            ...additionalOptions
          })
        ).toStrictEqual(context.targets[index]);
      }
    });
  }
}

function registerLibraryResolverTest(
  context:
    | ReturnType<typeof createSharedReverseMappingTestContext>
    | ReturnType<typeof createSharedForwardMappingTestContext>
) {
  const {
    library: {
      packageJson,
      expectAllTargets: expectAllTargets,
      shouldApplyEAPGlobally,
      expectTestsToFail
    },
    conditions
  } = context;

  // eslint-disable-next-line unicorn/no-for-loop
  for (let index = 0; index < conditions.length; ++index) {
    const title = 'resolve.exports library';

    const selectedSubpath = castArray(
      ('subpaths' in context ? context.subpaths : context.entryPoints)[index]
    );

    let expectedTarget = expectAllTargets
      ? shouldApplyEAPGlobally
        ? (expectAllTargets as SubpathMapping['target'][])
        : (expectAllTargets[index] as Exclude<
            (typeof expectAllTargets)[number],
            SubpathMapping['target'][]
          >)
      : context.targets[index];

    if (
      'entryPoints' in context &&
      Array.isArray(expectedTarget) &&
      !expectedTarget.length
    ) {
      // ? When testing forward mapping, the expected result can never be an
      // ? empty array. Here [null] represents what an empty array represents.
      expectedTarget = [null];
    }

    if (selectedSubpath.length) {
      selectedSubpath.forEach((subpath, subIndex) => {
        const testId = `${index + 1}.${subIndex + 1}` as NonNullable<
          typeof expectTestsToFail
        >[number];

        const expectTestToFail = expectTestsToFail?.includes(testId);

        // eslint-disable-next-line jest/valid-title
        test(`${title} #${testId}${
          expectTestToFail ? ' (library failure expected)' : ''
        }`, async () => {
          expect.hasAssertions();

          // eslint-disable-next-line jest/valid-expect
          const expectation = expect(
            resolveTargetWithResolveExports({
              packageJson,
              subpath,
              conditions: conditions[index] || []
            })[
              expectAllTargets || 'entryPoints' in context
                ? 'allResolvedTargets'
                : 'resolvedTarget'
            ]
          );

          // eslint-disable-next-line jest/unbound-method
          (expectTestToFail ? expectation.not.toStrictEqual : expectation.toStrictEqual)(
            Array.isArray(expectedTarget) && Array.isArray(expectedTarget.at(subIndex))
              ? expectedTarget[subIndex]
              : expectedTarget
          );
        });
      });
    } else {
      // eslint-disable-next-line jest/valid-title
      test(title, async () => {
        expect.hasAssertions();
        expect(true).pass('empty subpaths are never able to be imported');
      });
    }
  }
}

function registerNodeResolverTest(
  context:
    | ReturnType<typeof createSharedReverseMappingTestContext>
    | ReturnType<typeof createSharedForwardMappingTestContext>
) {
  const {
    node: {
      packageName,
      rootPackagePath,
      expectOnlyTargets: expectOnlyTargets,
      shouldApplyEOPGlobally
    },
    conditions
  } = context;

  // eslint-disable-next-line unicorn/no-for-loop
  for (let index = 0; index < conditions.length; ++index) {
    const title = `node.js resolver #${index + 1}`;

    const selectedSubpath = castArray(
      ('subpaths' in context ? context.subpaths : context.entryPoints)[index]
    );

    const expectedTarget = expectOnlyTargets
      ? shouldApplyEOPGlobally
        ? (expectOnlyTargets as SubpathMapping['target'])
        : (expectOnlyTargets[index] as Exclude<
            (typeof expectOnlyTargets)[number],
            SubpathMapping['target']
          >)
      : context.targets[index];

    if (selectedSubpath.length) {
      selectedSubpath.forEach((subpath, subIndex) => {
        test(`${title}.${subIndex + 1}`, async () => {
          expect.hasAssertions();
          await expect(
            resolveTargetWithNodeJs({
              packageName,
              rootPackagePath,
              subpath,
              conditions: conditions[index] || []
            })
          ).resolves.toHaveProperty(
            'resolvedTarget',
            Array.isArray(expectedTarget)
              ? expectedTarget[subIndex] ?? null
              : expectedTarget
          );
        });
      });
    } else {
      // eslint-disable-next-line jest/valid-title
      test(title, async () => {
        expect.hasAssertions();
        expect(true).pass('empty subpaths are never able to be imported');
      });
    }
  }
}
