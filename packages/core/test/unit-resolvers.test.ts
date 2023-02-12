/* eslint-disable jest/require-hook */
/* eslint-disable unicorn/consistent-destructuring */
import assert from 'node:assert';
import { toss } from 'toss-expression';
import { TrialError } from 'named-app-errors';

import * as resolver from 'pkgverse/core/src/resolvers';
import * as errors from 'pkgverse/core/src/errors';

import {
  getDummyPackage,
  resolveTargetWithNodeJs,
  resolveTargetWithResolveExports
} from 'testverse/helpers';

import {
  flattenPackageJsonSubpathMap,
  type SubpathMapping,
  type SubpathMappings
} from 'pkgverse/core/src/project-utils';
import { PackageJson } from 'type-fest';

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

describe('::resolveEntryPointsFromExportsPath', () => {
  describe('returns the correct subpath by default', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        operation: 'resolveEntryPointsFromExportsPath'
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
        operation: 'resolveEntryPointsFromExportsPath'
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
        operation: 'resolveEntryPointsFromExportsPath'
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
        operation: 'resolveEntryPointsFromExportsPath'
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
        operation: 'resolveEntryPointsFromExportsPath'
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
          './pattern-1/private-internal/*'
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
        operation: 'resolveEntryPointsFromExportsPath'
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
        operation: 'resolveEntryPointsFromExportsPath',
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
        operation: 'resolveEntryPointsFromExportsPath',
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
        // ? resolve.exports will return all targets, including the very first
        // ? non-null target. This lines up with `expectOnlyTargets` below.
        expectAllTargets: [
          [['./import.js'], ['./import.js', './string.js']],
          [],
          [['./import.js'], ['./import.js', './string.js']],
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
          './import.js',
          ['./string.js', './import.js']
        ]
      },
      conditions: [['import'], ['import'], ['import'], ['import']],
      // ? When includeUnsafeFallbackTargets is true, all targets are considered.
      // ? This yields results radically different from Node.js or the library.
      targets: ['./import.js', './default.js', './default.js', './string.js'],
      subpaths: [
        ['./edge-case-2', './edge-case-3'],
        [],
        ['./edge-case-2', './edge-case-3'],
        ['./edge-case-1', './edge-case-3']
      ]
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
        operation: 'resolveEntryPointsFromExportsPath'
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
        operation: 'resolveEntryPointsFromExportsPath'
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
        operation: 'resolveEntryPointsFromExportsPath'
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
        resolver.resolveEntryPointsFromExportsPath({
          flattenedExports: getDummyFlattenedExports(),
          target: '/lite/worker.browser.js',
          conditions: ['worker', 'browser']
        })
      ).toStrictEqual([]);

      expect(
        resolver.resolveEntryPointsFromExportsPath({
          flattenedExports: getDummyFlattenedExports(),
          target: 'lite/worker.browser.js',
          conditions: ['worker', 'browser']
        })
      ).toStrictEqual([]);

      expect(
        resolver.resolveEntryPointsFromExportsPath({
          flattenedExports: getDummyFlattenedExports(),
          target: './lite-worker-browser.js',
          conditions: ['worker', 'browser']
        })
      ).toStrictEqual(['./lite']);

      expect(
        resolver.resolveEntryPointsFromExportsPath({
          flattenedExports: getDummyFlattenedExports({
            './missing-dot': ['./mixed/*.js', 'non-absolute/import.js']
          }),
          target: './non-absolute/import.js',
          includeUnsafeFallbackTargets: true
        })
      ).toStrictEqual([]);

      expect(
        resolver.resolveEntryPointsFromExportsPath({
          flattenedExports: getDummyFlattenedExports({
            // * Technically this is an invalid target in package.json exports
            './missing-dot': ['./mixed/*.js', 'non-absolute/import.js']
          }),
          target: 'non-absolute/import.js',
          includeUnsafeFallbackTargets: true
        })
      ).toStrictEqual(['./missing-dot']);

      expect(
        resolver.resolveEntryPointsFromExportsPath({
          flattenedExports: getDummyFlattenedExports({
            './missing-dot': { default: './non-absolute/deep/require' }
          }),
          // * Technically this is an invalid target in package.json exports
          target: 'non-absolute/deep/require'
        })
      ).toStrictEqual([]);

      expect(
        resolver.resolveEntryPointsFromExportsPath({
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
        operation: 'resolveEntryPointsFromExportsPath'
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
        operation: 'resolveEntryPointsFromExportsPath'
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
        operation: 'resolveEntryPointsFromExportsPath',
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
        operation: 'resolveEntryPointsFromExportsPath',
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
        operation: 'resolveEntryPointsFromExportsPath',
        options: [{ replaceSubpathAsterisks: true }, { replaceSubpathAsterisks: false }]
      },
      library: defaultLibraryConfig,
      node: defaultNodeConfig,
      conditions: [['default'], ['default', 'browser', 'require']],
      targets: ['./features/*.js', './features/deep/*.js'],
      subpaths: [
        ['./pattern-1/*.js'],
        ['./pattern-1/*.js', './pattern-2/*', './pattern-3/*.js']
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
        operation: 'resolveEntryPointsFromExportsPath',
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
        operation: 'resolveEntryPointsFromExportsPath'
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
        operation: 'resolveEntryPointsFromExportsPath'
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
        operation: 'resolveEntryPointsFromExportsPath'
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

  describe('handles nested defaults', () => {
    const dummyDefaultsPackage = getDummyPackage('defaults');

    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        flattenedMap: {
          flattenedExports: flattenPackageJsonSubpathMap({
            map: dummyDefaultsPackage.exports
          })
        },
        operation: 'resolveEntryPointsFromExportsPath'
      },
      library: { ...defaultLibraryConfig, packageJson: dummyDefaultsPackage.packageJson },
      node: { ...defaultNodeConfig, packageName: dummyDefaultsPackage.name },
      conditions: [undefined, ['import']],
      targets: ['./default-1.js', './default-2.js'],
      subpaths: [['./default1'], ['./default2', './default/2']]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('handles targets with multiple asterisks', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        operation: 'resolveEntryPointsFromExportsPath'
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
        operation: 'resolveEntryPointsFromExportsPath'
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
        operation: 'resolveEntryPointsFromExportsPath'
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
        operation: 'resolveEntryPointsFromExportsPath'
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

  describe('returns the longest matching literal subpath pattern (so-called "best match") and ignores the others', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        operation: 'resolveEntryPointsFromExportsPath'
      },
      library: defaultLibraryConfig,
      node: defaultNodeConfig,
      conditions: [undefined, undefined],
      targets: ['./not-private/file.js', './not-private/deep/file.js'],
      subpaths: [['./pattern-4/deep/deeper/file.js'], ['./pattern-4/deep/file.js']]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('does not consider characters after the asterisk when determining longest subpath', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        operation: 'resolveEntryPointsFromExportsPath'
      },
      library: defaultLibraryConfig,
      node: defaultNodeConfig,
      conditions: [undefined],
      targets: ['./not-private/maybe-private/might-be-secret.cjs'],
      subpaths: [['./pattern-4/maybe-private/might-be-secret.cjs']]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('does not return subpath patterns if a non-pattern match is found', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        operation: 'resolveEntryPointsFromExportsPath'
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

  describe('does not return a subpath if its target is actually unreachable', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        operation: 'resolveEntryPointsFromExportsPath'
      },
      library: defaultLibraryConfig,
      node: defaultNodeConfig,
      conditions: [undefined],
      targets: ['./not-private/deep/deeper/file.js'],
      subpaths: [[]]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('skips null fallback targets and considers first non-null fallback target', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        operation: 'resolveEntryPointsFromExportsPath',
        options: [
          { includeUnsafeFallbackTargets: false },
          { includeUnsafeFallbackTargets: true }
        ]
      },
      library: defaultLibraryConfig,
      node: defaultNodeConfig,
      conditions: [undefined, undefined],
      targets: ['./not-private/deep/file.js', './not-private/deep/file.js'],
      subpaths: [
        ['./pattern-4/deep/file.js', './pattern-4/deep/deep/file.js'],
        ['./pattern-4/deep/file.js', './pattern-4/deep/deep/file.js']
      ]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('returns a subpath when a different subpath pattern with a null target matches and a non-pattern subpath target also matches', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        operation: 'resolveEntryPointsFromExportsPath'
      },
      library: defaultLibraryConfig,
      node: defaultNodeConfig,
      conditions: [undefined],
      targets: ['./pattern-4/maybe-private/secret.js'],
      subpaths: [['./pattern-4/maybe-private/secret.js']]
    });

    registerCoreResolverTest(context);
    registerLibraryResolverTest(context);
    registerNodeResolverTest(context);
  });

  describe('does not return subpath pattern when it ends up matching either a null target or null last fallback target', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        operation: 'resolveEntryPointsFromExportsPath',
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

  describe('skips null fallback targets even when `target` is null unless last fallback target is also null', () => {
    const context = createSharedReverseMappingTestContext({
      core: {
        ...defaultCoreExportsConfig,
        flattenedMap: {
          flattenedExports: flattenPackageJsonSubpathMap({ map: dummyComplexExports })
        },
        operation: 'resolveEntryPointsFromExportsPath',
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
        operation: 'resolveEntryPointsFromExportsPath'
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
        operation: 'resolveEntryPointsFromExportsPath'
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

  it('is the inverse of `resolveExportsPathsFromEntryPoint`', async () => {
    expect.hasAssertions();
    const flattenedExports = getDummyFlattenedExports();
    const conditions = ['types'];
    const target = './alias.d.ts';

    expect(
      resolver.resolveExportsPathsFromEntryPoint({
        flattenedExports,
        entryPoint:
          resolver.resolveEntryPointsFromExportsPath({
            flattenedExports,
            target,
            conditions
          })[0] || toss(new TrialError()),
        conditions
      })
    ).toStrictEqual(target);
  });
});

describe('::resolveExportsPathsFromEntryPoint', () => {
  // TODO: returns the expected result encountering fallback array (in error and
  // TODO: success cases)
  it('todo', async () => {
    expect.hasAssertions();
  });

  it('does not return a target when `subpath` matches a subpath pattern with a null target', async () => {
    expect.hasAssertions();

    expect(
      resolver.resolveExportsPathsFromEntryPoint({
        flattenedExports: getDummyFlattenedExports(),
        entryPoint: './pattern-1/private-internal/secret.js',
        conditions: ['default']
      })
    ).toStrictEqual([]);
  });
});

describe('::resolveEntryPointsFromImportsPath', () => {
  it('todo', async () => {
    expect.hasAssertions();
  });
});

describe('::resolveImportsPathsFromEntryPoints', () => {
  // TODO: returns the expected result encountering fallback array (in error and
  // TODO: success cases)
  it('todo', async () => {
    expect.hasAssertions();
  });
});

type SharedTestContextCoreOptions = Partial<
  resolver.UnsafeFallbackOption & resolver.ReplaceSubpathAsterisksOption
>;

/**
 * Used to generate tests evaluating the correctness of subpath => target
 * resolver functions.
 */
function createSharedReverseMappingTestContext({
  core,
  library,
  node,
  conditions,
  targets,
  subpaths
}: {
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
  } & (
    | {
        flattenedMap: resolver.FlattenedExportsOption;
        operation:
          | 'resolveEntryPointsFromExportsPath'
          | 'resolveExportsPathsFromEntryPoint';
      }
    | {
        flattenedMap: resolver.FlattenedImportsOption;
        operation:
          | 'resolveEntryPointsFromImportsPath'
          | 'resolveImportsPathsFromEntryPoints';
      }
  );
  /**
   * Configuration for the resolve.exports library.
   */
  library: {
    packageJson: PackageJson;
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
  };
  /**
   * Configuration for the Node.js resolver.
   */
  node: {
    packageName: string;
    rootPackagePath: string;
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
  };
  conditions: (SubpathMapping['conditions'] | undefined)[];
  targets: SubpathMapping['target'][];
  subpaths: SubpathMapping['subpath'][][];
}) {
  assert(
    conditions.length === targets.length && conditions.length === subpaths.length,
    `shared test context conditions (${conditions.length}), targets (${targets.length}), and subpaths (${subpaths.length}) arrays must be same length`
  );

  const shouldApplyEAPGlobally =
    Array.isArray(library?.expectAllTargets) &&
    !Array.isArray(library?.expectAllTargets[0]);

  if (library?.expectAllTargets && !shouldApplyEAPGlobally) {
    assert(
      library.expectAllTargets.length === conditions.length,
      `expectAllTargets array (${library.expectAllTargets.length}) must be the same length (${conditions.length}) as shared test context conditions, subpaths, and targets arrays`
    );

    (
      library.expectAllTargets as Extract<
        typeof library.expectAllTargets,
        Exclude<typeof library.expectAllTargets, (string | null)[]>
      >
    ).forEach((targets_, index) => {
      const maybeSubArray = targets_.at(0);
      assert(
        !Array.isArray(maybeSubArray) || targets_.length === subpaths[index]?.length,
        `expectAllTargets sub-array at index ${index} (${targets_.length}) must be the same length (${subpaths[index]?.length}) as shared test context subpaths array at the same index`
      );
    });
  }

  const shouldApplyEOPGlobally = !Array.isArray(node?.expectOnlyTargets);

  if (node?.expectOnlyTargets && !shouldApplyEOPGlobally) {
    assert(
      node.expectOnlyTargets.length === conditions.length,
      `expectOnlyTargets array (${node.expectOnlyTargets.length}) must be the same length (${conditions.length}) as shared test context conditions, subpaths, and targets arrays`
    );

    (
      node.expectOnlyTargets as Extract<
        typeof node.expectOnlyTargets,
        Exclude<typeof node.expectOnlyTargets, string | null>
      >
    ).forEach((target_, index) => {
      assert(
        !Array.isArray(target_) || target_.length === subpaths[index]?.length,
        `expectOnlyTargets sub-array at index ${index} (${target_?.length}) must be the same length (${subpaths[index]?.length}) as shared test context subpaths array at the same index`
      );
    });
  }

  return {
    core,
    library: { ...library, shouldApplyEAPGlobally },
    node: { ...node, shouldApplyEOPGlobally },
    conditions,
    targets,
    subpaths
  };
}

function registerCoreResolverTest({
  core,
  conditions,
  targets,
  subpaths
}: ReturnType<typeof createSharedReverseMappingTestContext>) {
  // eslint-disable-next-line unicorn/no-for-loop
  for (let index = 0; index < conditions.length; ++index) {
    const additionalOptions = Array.isArray(core.options)
      ? core.options[index]
      : core.options;
    test(`@projector/core/project/resolve #${index + 1}`, async () => {
      expect.hasAssertions();
      expect(
        // ? We're bumping up against the limits of TypeScript and Eslint here
        // eslint-disable-next-line import/namespace
        resolver[core.operation]({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...(core.flattenedMap as any),
          target: targets[index],
          conditions: conditions[index],
          ...additionalOptions
        })
      ).toStrictEqual(subpaths[index]);
    });
  }
}

function registerLibraryResolverTest({
  library: { packageJson, expectAllTargets: expectAllTargets, shouldApplyEAPGlobally },
  conditions,
  targets,
  subpaths
}: ReturnType<typeof createSharedReverseMappingTestContext>) {
  // eslint-disable-next-line unicorn/no-for-loop
  for (let index = 0; index < conditions.length; ++index) {
    const title = `resolve.exports library #${index + 1}`;
    const selectedTarget = subpaths[index];
    const expectedResult = expectAllTargets
      ? shouldApplyEAPGlobally
        ? (expectAllTargets as SubpathMapping['target'][])
        : (expectAllTargets[index] as Exclude<
            (typeof expectAllTargets)[number],
            SubpathMapping['target'][]
          >)
      : targets[index];

    if (selectedTarget.length) {
      selectedTarget.forEach((target, subIndex) => {
        // eslint-disable-next-line jest/valid-title
        test(`${title}.${subIndex + 1}`, async () => {
          expect.hasAssertions();
          expect(
            resolveTargetWithResolveExports({
              packageJson,
              subpath: target,
              conditions: conditions[index] || []
            })[expectAllTargets ? 'allResolvedTargets' : 'resolvedTarget']
          ).toStrictEqual(
            Array.isArray(expectedResult) && Array.isArray(expectedResult.at(subIndex))
              ? expectedResult[subIndex]
              : expectedResult
          );
        });
      });
    } else {
      // eslint-disable-next-line jest/valid-title
      test(title, async () => {
        expect.hasAssertions();
        expect(true).pass('empty targets are never able to be imported');
      });
    }
  }
}

function registerNodeResolverTest({
  node: {
    packageName,
    rootPackagePath,
    expectOnlyTargets: expectOnlyTargets,
    shouldApplyEOPGlobally
  },
  conditions,
  targets,
  subpaths
}: ReturnType<typeof createSharedReverseMappingTestContext>) {
  // eslint-disable-next-line unicorn/no-for-loop
  for (let index = 0; index < conditions.length; ++index) {
    const title = `node.js resolver #${index + 1}`;
    const selectedTarget = subpaths[index];
    const expectedResult = expectOnlyTargets
      ? shouldApplyEOPGlobally
        ? (expectOnlyTargets as SubpathMapping['target'])
        : (expectOnlyTargets[index] as Exclude<
            (typeof expectOnlyTargets)[number],
            SubpathMapping['target']
          >)
      : targets[index];

    if (selectedTarget.length) {
      selectedTarget.forEach((target, subIndex) => {
        test(`${title}.${subIndex + 1}`, async () => {
          expect.hasAssertions();
          await expect(
            resolveTargetWithNodeJs({
              packageName,
              rootPackagePath,
              subpath: target,
              conditions: conditions[index] || []
            })
          ).resolves.toHaveProperty(
            'resolvedTarget',
            Array.isArray(expectedResult) ? expectedResult[subIndex] : expectedResult
          );
        });
      });
    } else {
      // eslint-disable-next-line jest/valid-title
      test(title, async () => {
        expect.hasAssertions();
        expect(true).pass('empty targets are never able to be imported');
      });
    }
  }
}
