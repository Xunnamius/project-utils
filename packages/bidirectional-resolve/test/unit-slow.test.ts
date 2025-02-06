// * These tests ensure the exported interface under test functions as expected.

/* eslint-disable jest/require-hook */

import assert from 'node:assert';

import { getDummyPackage } from '@-xun/common-dummies/packages';
import { TrialError } from 'named-app-errors';
import { toss } from 'toss-expression';

import { CommonErrorMessage } from 'multiverse+common:error.ts';

import {
  flattenPackageJsonSubpathMap,
  resolveEntryPointsFromExportsTarget,
  resolveEntryPointsFromImportsTarget,
  resolveExportsTargetsFromEntryPoint,
  resolveImportsTargetsFromEntryPoint
} from 'universe+bidirectional-resolve';

import {
  reconfigureJestGlobalsToSkipTestsInThisFileIfRequested,
  resolveTargetWithNodeJs,
  resolveTargetWithResolveExports
} from 'testverse:util.ts';

import type { XPackageJson } from '@-xun/project-types';

import type {
  FlattenedExportsOption,
  FlattenedImportsOption,
  ReplaceSubpathAsterisksOption,
  SubpathMapping,
  SubpathMappings,
  UnsafeFallbackOption
} from 'universe+bidirectional-resolve';

reconfigureJestGlobalsToSkipTestsInThisFileIfRequested();

const dummyRootPackage = getDummyPackage('root');

const dummySimplePackage = getDummyPackage('simple', {
  requireObjectExports: true,
  requireObjectImports: true
});

const dummyComplexPackage = getDummyPackage('complex', {
  requireObjectExports: true,
  requireObjectImports: true
});

const {
  packageJson: { exports: dummySimpleExports, imports: dummySimpleImports }
} = dummySimplePackage;

const {
  packageJson: { exports: dummyComplexExports, imports: dummyComplexImports }
} = dummyComplexPackage;

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

describe('::flattenPackageJsonSubpathMap', () => {
  it('returns an empty array if subpath map is undefined', async () => {
    expect.hasAssertions();
    expect(flattenPackageJsonSubpathMap({ map: undefined })).toStrictEqual([]);
    expect(flattenPackageJsonSubpathMap({ map: {} })).toStrictEqual([]);
  });

  it('flattens exports subpath map correctly', async () => {
    expect.hasAssertions();

    expect(
      flattenPackageJsonSubpathMap({ map: dummySimpleExports })
    ).toStrictEqual<SubpathMappings>([
      {
        subpath: '.',
        target: './import.mjs',
        conditions: ['import'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '.',
        target: './require.js',
        conditions: ['require'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: './null',
        target: null,
        conditions: ['import'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: './null',
        target: './require.js',
        conditions: ['require'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: './lite',
        target: './lite-worker-browser.js',
        conditions: ['worker', 'browser'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: './lite',
        target: './lite-worker-node.js',
        conditions: ['worker', 'node'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: './lite',
        target: './lite-import.mjs',
        conditions: ['import'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: './lite',
        target: './lite-require.js',
        conditions: ['require'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: './alias',
        target: './alias.d.ts',
        conditions: ['types'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: './alias',
        target: './alias.js',
        conditions: ['node'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: './alias',
        target: './alias.js',
        conditions: ['default'],
        excludedConditions: ['types', 'node'],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: './alias/path/node',
        target: './alias-node-import.js',
        conditions: ['node', 'import'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: './alias/path/node',
        target: './require.js',
        conditions: ['node', 'require'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: './alias/path/node',
        target: './alias.js',
        conditions: ['default'],
        excludedConditions: ['node'],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: './multi',
        target: './path-1.d.ts',
        conditions: ['types'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: './multi',
        target: './path-1.js',
        conditions: ['default'],
        excludedConditions: ['types'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: true,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: './multi',
        target: './path-2.js',
        conditions: ['default'],
        excludedConditions: ['types'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: './multi',
        target: './path-3.js',
        conditions: ['default'],
        excludedConditions: ['types'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: true,
        isDeadCondition: false
      },
      {
        subpath: './mixed/*',
        target: './mixed/deep/*.js',
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: true,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: './mixed/*',
        target: './mixed/*.js',
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: true,
        isDeadCondition: false
      },
      {
        subpath: './pattern-1/*.js',
        target: './features/*.js',
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: './pattern-1/private-explicit/secret.js',
        target: null,
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: './pattern-2/private-explicit/secret.js',
        target: null,
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: './pattern-2/private-explicit/secret.js',
        target: null,
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: './pattern-2/private-explicit/secret.js',
        target: null,
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: true,
        isDeadCondition: false
      },
      {
        subpath: './pattern-2/*',
        target: './features/*',
        conditions: ['require'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: './pattern-3/*.js',
        target: './features/deep/*.js',
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: './pattern-1/private-internal/*',
        target: null,
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: './many-to-one/*',
        target: './many-to-one.js',
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: './multiple-asterisks-bad/*/*',
        target: './*/yet-another/*',
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: './multiple-asterisk-good-1/*',
        target: './asterisk/*/*.js',
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: './multiple-asterisk-good-2/*',
        target: './*/yet-another/*.js',
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: './pattern-4/*.js',
        target: './not-private/*.js',
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: './pattern-4/deep/deeper/*.js',
        target: './not-private/*.js',
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: './pattern-4/deep/deeper/file.js',
        target: './not-private/deep/file.js',
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: './pattern-4/deep/*.js',
        target: null,
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: './pattern-4/deep/*.js',
        target: null,
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: './pattern-4/deep/*.js',
        target: './not-private/*.js',
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: true,
        isLastFallback: true,
        isDeadCondition: false
      },
      {
        subpath: './pattern-4/maybe-private/*',
        target: null,
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: './pattern-4/maybe-private/not-secret.js',
        target: './not-private/maybe-private/not-secret.js',
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: './pattern-4/maybe-private/m*cjs',
        target: './not-private/maybe-private/m*.cjs',
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: './pattern-4/maybe-private/m*.cjs',
        target: './not-private/maybe-private/might-be-secret.cjs',
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: './pattern-4/maybe-*.js',
        target: './not-private/maybe-private/secret.js',
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: './.hidden',
        target: './.hidden',
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: './package',
        target: './package.json',
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: './package.json',
        target: './package.json',
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      }
    ]);
  });

  it('flattens imports subpath map correctly', async () => {
    expect.hasAssertions();

    expect(
      flattenPackageJsonSubpathMap({ map: dummySimpleImports })
    ).toStrictEqual<SubpathMappings>([
      {
        subpath: '#hash',
        target: './hash-import-browser.mjs',
        conditions: ['import', 'browser'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#hash',
        target: 'hash-pkg/polyfill.js',
        conditions: ['import', 'node'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#hash',
        target: 'hash-pkg',
        conditions: ['default'],
        excludedConditions: ['import'],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#null2',
        target: null,
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#null3',
        target: 'some-package/browser.js',
        conditions: ['require', 'browser'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#null3',
        target: 'some-package',
        conditions: ['require', 'node'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#null3',
        target: null,
        conditions: ['default'],
        excludedConditions: ['require'],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#index',
        target: './import.mjs',
        conditions: ['import'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#index',
        target: './require.js',
        conditions: ['require'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#null',
        target: null,
        conditions: ['import'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#null',
        target: './require.js',
        conditions: ['require'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#lite',
        target: './lite-worker-browser.js',
        conditions: ['worker', 'browser'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#lite',
        target: './lite-worker-node.js',
        conditions: ['worker', 'node'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#lite',
        target: './lite-import.mjs',
        conditions: ['import'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#lite',
        target: './lite-require.js',
        conditions: ['require'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#alias',
        target: './alias.d.ts',
        conditions: ['types'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#alias',
        target: './alias.js',
        conditions: ['node'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#alias',
        target: './alias.js',
        conditions: ['default'],
        excludedConditions: ['types', 'node'],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#alias/path/node',
        target: './alias-node-import.js',
        conditions: ['node', 'import'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#alias/path/node',
        target: './require.js',
        conditions: ['node', 'require'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#alias/path/node',
        target: './alias.js',
        conditions: ['default'],
        excludedConditions: ['node'],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#multi',
        target: './path-1.d.ts',
        conditions: ['types'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#multi',
        target: './path-1.js',
        conditions: ['default'],
        excludedConditions: ['types'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: true,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#multi',
        target: './path-2.js',
        conditions: ['default'],
        excludedConditions: ['types'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#multi',
        target: './path-3.js',
        conditions: ['default'],
        excludedConditions: ['types'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: true,
        isDeadCondition: false
      },
      {
        subpath: '#mixed/*',
        target: './mixed/deep/*.js',
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: true,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#mixed/*',
        target: './mixed/*.js',
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: true,
        isDeadCondition: false
      },
      {
        subpath: '#pattern-1/*.js',
        target: './features/*.js',
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#pattern-1/private-explicit/secret.js',
        target: null,
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#pattern-2/private-explicit/secret.js',
        target: null,
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#pattern-2/private-explicit/secret.js',
        target: null,
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#pattern-2/private-explicit/secret.js',
        target: null,
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: true,
        isDeadCondition: false
      },
      {
        subpath: '#pattern-2/*',
        target: './features/*',
        conditions: ['require'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#pattern-3/*.js',
        target: './features/deep/*.js',
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#pattern-1/private-internal/*',
        target: null,
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#many-to-one/*',
        target: './many-to-one.js',
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#multiple-asterisks-bad/*/*',
        target: './*/yet-another/*',
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#multiple-asterisk-good-1/*',
        target: './asterisk/*/*.js',
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#multiple-asterisk-good-2/*',
        target: './*/yet-another/*.js',
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#pattern-4/*.js',
        target: './not-private/*.js',
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#pattern-4/deep/deeper/*.js',
        target: './not-private/*.js',
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#pattern-4/deep/deeper/file.js',
        target: './not-private/deep/file.js',
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#pattern-4/deep/*.js',
        target: null,
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#pattern-4/deep/*.js',
        target: null,
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#pattern-4/deep/*.js',
        target: './not-private/*.js',
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: true,
        isLastFallback: true,
        isDeadCondition: false
      },
      {
        subpath: '#pattern-4/maybe-private/*',
        target: null,
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#pattern-4/maybe-private/not-secret.js',
        target: './not-private/maybe-private/not-secret.js',
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#pattern-4/maybe-private/m*cjs',
        target: './not-private/maybe-private/m*.cjs',
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#pattern-4/maybe-private/m*.cjs',
        target: './not-private/maybe-private/might-be-secret.cjs',
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#pattern-4/maybe-*.js',
        target: './not-private/maybe-private/secret.js',
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#.hidden',
        target: './.hidden',
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#package',
        target: './package.json',
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#package.json',
        target: './package.json',
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      }
    ]);
  });

  it('handles sugared subpath string', async () => {
    expect.hasAssertions();

    expect(
      flattenPackageJsonSubpathMap({ map: './sugared/js' })
    ).toStrictEqual<SubpathMappings>([
      {
        subpath: '.',
        target: './sugared/js',
        conditions: ['default'],
        excludedConditions: [],
        isSugared: true,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      }
    ]);
  });

  it('handles sugared string-only and mixed fallback arrays', async () => {
    expect.hasAssertions();

    expect(
      flattenPackageJsonSubpathMap({
        map: ['./string-1.js', './string-2.js']
      })
    ).toStrictEqual<SubpathMappings>([
      {
        subpath: '.',
        target: './string-1.js',
        conditions: ['default'],
        excludedConditions: [],
        isSugared: true,
        isFallback: true,
        isFirstNonNullFallback: true,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '.',
        target: './string-2.js',
        conditions: ['default'],
        excludedConditions: [],
        isSugared: true,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: true,
        isDeadCondition: false
      }
    ]);

    expect(
      flattenPackageJsonSubpathMap({
        map: [
          './string.js',
          { import: ['./import.js', { default: './node.js' }], default: './default.js' }
        ]
      })
    ).toStrictEqual<SubpathMappings>([
      {
        subpath: '.',
        target: './string.js',
        conditions: ['default'],
        excludedConditions: [],
        isSugared: true,
        isFallback: true,
        isFirstNonNullFallback: true,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '.',
        target: './import.js',
        conditions: ['default', 'import'],
        excludedConditions: [],
        isSugared: true,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '.',
        target: './node.js',
        conditions: ['default', 'import'],
        excludedConditions: [],
        isSugared: true,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '.',
        target: './default.js',
        conditions: ['default'],
        excludedConditions: ['import'],
        isSugared: true,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: true,
        isDeadCondition: false
      }
    ]);
  });

  it('handles sugared null', async () => {
    expect.hasAssertions();

    expect(flattenPackageJsonSubpathMap({ map: null })).toStrictEqual<SubpathMappings>([
      {
        subpath: '.',
        target: null,
        conditions: ['default'],
        excludedConditions: [],
        isSugared: true,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      }
    ]);
  });

  it('handles custom conditions', async () => {
    expect.hasAssertions();

    expect(
      flattenPackageJsonSubpathMap({
        map: {
          '.': {
            'condition-1': './string-1.js',
            'condition-2': { 'condition-3': './string-2.js' }
          }
        }
      })
    ).toStrictEqual<SubpathMappings>([
      {
        subpath: '.',
        target: './string-1.js',
        conditions: ['condition-1'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '.',
        target: './string-2.js',
        conditions: ['condition-2', 'condition-3'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      }
    ]);
  });

  it('handles complex fallback arrays and un-sugared exports', async () => {
    expect.hasAssertions();

    expect(
      flattenPackageJsonSubpathMap({
        map: dummyComplexExports
      })
    ).toStrictEqual<SubpathMappings>([
      {
        subpath: '.',
        target: './import-1.js',
        conditions: ['require'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '.',
        target: './string-1.js',
        conditions: ['import'],
        excludedConditions: [],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: true,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '.',
        target: './import-2.js',
        conditions: ['import'],
        excludedConditions: [],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '.',
        target: './node-2.js',
        conditions: ['import', 'node'],
        excludedConditions: [],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '.',
        target: './default-2.js',
        conditions: ['import', 'default'],
        excludedConditions: ['import', 'node'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: true,
        isDeadCondition: false
      },
      {
        subpath: '.',
        target: './string-2.js',
        conditions: ['custom'],
        excludedConditions: [],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: true,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '.',
        target: './import-3.js',
        conditions: ['custom', 'import'],
        excludedConditions: [],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '.',
        target: './import-4.js',
        conditions: ['custom', 'import', 'custom-2'],
        excludedConditions: [],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '.',
        target: './default-4.js',
        conditions: ['custom', 'import', 'default'],
        excludedConditions: ['custom-2'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '.',
        target: './node-3.js',
        conditions: ['custom', 'node', 'custom-2'],
        excludedConditions: [],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '.',
        target: './node-4.js',
        conditions: ['custom', 'node', 'custom-3'],
        excludedConditions: [],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '.',
        target: './node-5.js',
        conditions: ['custom', 'node', 'custom-3', 'import'],
        excludedConditions: [],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '.',
        target: './browser-1.js',
        conditions: ['custom', 'node', 'custom-3', 'custom-4'],
        excludedConditions: [],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '.',
        target: './default-3.js',
        conditions: ['custom', 'default'],
        excludedConditions: ['import', 'node'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '.',
        target: './string-3.js',
        conditions: ['custom'],
        excludedConditions: [],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: true,
        isDeadCondition: false
      },
      {
        subpath: '.',
        target: './node-1.js',
        conditions: ['node'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '.',
        target: './default-1.js',
        conditions: ['default'],
        excludedConditions: ['require', 'import', 'custom', 'node'],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: './null-in-fallback',
        target: null,
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: './null-in-fallback',
        target: null,
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: './null-in-fallback',
        target: './node-1.js',
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: true,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: './null-in-fallback',
        target: null,
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: './null-in-fallback',
        target: './string-3.js',
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: true,
        isDeadCondition: false
      },
      {
        subpath: './null-in-fallback-edge-case-1',
        target: null,
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: './null-in-fallback-edge-case-1',
        target: null,
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: './null-in-fallback-edge-case-1',
        target: './string-3.js',
        conditions: ['default', 'custom-edge-1'],
        excludedConditions: [],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: true,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: './null-in-fallback-edge-case-1',
        target: './string',
        conditions: ['default', 'require'],
        excludedConditions: ['custom-edge-1'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: './null-in-fallback-edge-case-1',
        target: null,
        conditions: ['default', 'import'],
        excludedConditions: ['custom-edge-1'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: './null-in-fallback-edge-case-1',
        target: './import.js',
        conditions: ['default', 'import'],
        excludedConditions: ['custom-edge-1'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: './null-in-fallback-edge-case-1',
        target: null,
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: true,
        isDeadCondition: false
      },
      {
        subpath: './null-in-fallback-edge-case-2',
        target: null,
        conditions: ['custom-edge-2'],
        excludedConditions: [],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: './null-in-fallback-edge-case-2',
        target: null,
        conditions: ['custom-edge-2'],
        excludedConditions: [],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: true,
        isDeadCondition: false
      },
      {
        subpath: './null-in-fallback-edge-case-2',
        target: null,
        conditions: ['default'],
        excludedConditions: ['custom-edge-2'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: './null-in-fallback-edge-case-2',
        target: './string-3.js',
        conditions: ['default'],
        excludedConditions: ['custom-edge-2'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: true,
        isLastFallback: true,
        isDeadCondition: false
      },
      {
        subpath: './edge-case-1',
        target: './string.js',
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: './edge-case-2',
        target: './string-2.js',
        conditions: ['custom-edge-2'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: './edge-case-2',
        target: './import.js',
        conditions: ['default', 'import'],
        excludedConditions: ['custom-edge-2'],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: './edge-case-2',
        target: './node.js',
        conditions: ['default', 'node'],
        excludedConditions: ['custom-edge-2'],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: './edge-case-2',
        target: './string.js',
        conditions: ['default', 'custom-edge-2-x'],
        excludedConditions: ['custom-edge-2', 'import', 'node'],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: './edge-case-2',
        target: './default.js',
        conditions: ['default'],
        excludedConditions: ['custom-edge-2', 'import', 'node', 'custom-edge-2-x'],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: './edge-case-2',
        target: './unsafe.js',
        conditions: ['default', 'dead-case-1'],
        excludedConditions: ['custom-edge-2'],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: true
      },
      {
        subpath: './edge-case-3',
        target: './string-3.js',
        conditions: ['custom-edge-3'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: './edge-case-3',
        target: './import.js',
        conditions: ['default', 'import'],
        excludedConditions: ['custom-edge-3'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: true,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: './edge-case-3',
        target: './node.js',
        conditions: ['default', 'node'],
        excludedConditions: ['custom-edge-3'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: './edge-case-3',
        target: './default.js',
        conditions: ['default'],
        excludedConditions: ['custom-edge-3', 'import', 'node'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: './edge-case-3',
        target: './unsafe.js',
        conditions: ['default', 'dead-case-2'],
        excludedConditions: ['custom-edge-3'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: true
      },
      {
        subpath: './edge-case-3',
        target: './string.js',
        conditions: ['default'],
        excludedConditions: ['custom-edge-3'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: true,
        isDeadCondition: false
      }
    ]);
  });

  it('handles complex fallback arrays and un-sugared imports', async () => {
    expect.hasAssertions();

    expect(
      flattenPackageJsonSubpathMap({
        map: dummyComplexImports
      })
    ).toStrictEqual<SubpathMappings>([
      {
        subpath: '#complex-1',
        target: null,
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#complex-2',
        target: './default.js',
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: true,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#complex-2',
        target: './default-2.js',
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: true,
        isDeadCondition: false
      },
      {
        subpath: '#complex-3',
        target: './import.js',
        conditions: ['default', 'import'],
        excludedConditions: [],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: true,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#complex-3',
        target: './node.js',
        conditions: ['default', 'node'],
        excludedConditions: [],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#complex-3',
        target: './default.js',
        conditions: ['default'],
        excludedConditions: ['import', 'node'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#complex-3',
        target: './string.js',
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: true,
        isDeadCondition: false
      },
      {
        subpath: '#complex-4/*.js',
        target: './features/*.js',
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#complex-4/deep/*',
        target: null,
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#index',
        target: './import-1.js',
        conditions: ['require'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#index',
        target: './string-1.js',
        conditions: ['import'],
        excludedConditions: [],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: true,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#index',
        target: './import-2.js',
        conditions: ['import'],
        excludedConditions: [],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#index',
        target: './node-2.js',
        conditions: ['import', 'node'],
        excludedConditions: [],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#index',
        target: './default-2.js',
        conditions: ['import', 'default'],
        excludedConditions: ['import', 'node'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: true,
        isDeadCondition: false
      },
      {
        subpath: '#index',
        target: './string-2.js',
        conditions: ['custom'],
        excludedConditions: [],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: true,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#index',
        target: './import-3.js',
        conditions: ['custom', 'import'],
        excludedConditions: [],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#index',
        target: './import-4.js',
        conditions: ['custom', 'import', 'custom-2'],
        excludedConditions: [],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#index',
        target: './default-4.js',
        conditions: ['custom', 'import', 'default'],
        excludedConditions: ['custom-2'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#index',
        target: './node-3.js',
        conditions: ['custom', 'node', 'custom-2'],
        excludedConditions: [],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#index',
        target: './node-4.js',
        conditions: ['custom', 'node', 'custom-3'],
        excludedConditions: [],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#index',
        target: './node-5.js',
        conditions: ['custom', 'node', 'custom-3', 'import'],
        excludedConditions: [],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#index',
        target: './browser-1.js',
        conditions: ['custom', 'node', 'custom-3', 'custom-4'],
        excludedConditions: [],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#index',
        target: './default-3.js',
        conditions: ['custom', 'default'],
        excludedConditions: ['import', 'node'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#index',
        target: './string-3.js',
        conditions: ['custom'],
        excludedConditions: [],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: true,
        isDeadCondition: false
      },
      {
        subpath: '#index',
        target: './node-1.js',
        conditions: ['node'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#index',
        target: './default-1.js',
        conditions: ['default'],
        excludedConditions: ['require', 'import', 'custom', 'node'],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#null-in-fallback',
        target: null,
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#null-in-fallback',
        target: null,
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#null-in-fallback',
        target: './node-1.js',
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: true,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#null-in-fallback',
        target: null,
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#null-in-fallback',
        target: './string-3.js',
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: true,
        isDeadCondition: false
      },
      {
        subpath: '#null-in-fallback-edge-case-1',
        target: null,
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#null-in-fallback-edge-case-1',
        target: null,
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#null-in-fallback-edge-case-1',
        target: './string-3.js',
        conditions: ['default', 'custom-edge-1'],
        excludedConditions: [],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: true,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#null-in-fallback-edge-case-1',
        target: './string',
        conditions: ['default', 'require'],
        excludedConditions: ['custom-edge-1'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#null-in-fallback-edge-case-1',
        target: null,
        conditions: ['default', 'import'],
        excludedConditions: ['custom-edge-1'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#null-in-fallback-edge-case-1',
        target: './import.js',
        conditions: ['default', 'import'],
        excludedConditions: ['custom-edge-1'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#null-in-fallback-edge-case-1',
        target: null,
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: true,
        isDeadCondition: false
      },
      {
        subpath: '#null-in-fallback-edge-case-2',
        target: null,
        conditions: ['custom-edge-2'],
        excludedConditions: [],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#null-in-fallback-edge-case-2',
        target: null,
        conditions: ['custom-edge-2'],
        excludedConditions: [],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: true,
        isDeadCondition: false
      },
      {
        subpath: '#null-in-fallback-edge-case-2',
        target: null,
        conditions: ['default'],
        excludedConditions: ['custom-edge-2'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#null-in-fallback-edge-case-2',
        target: './string-3.js',
        conditions: ['default'],
        excludedConditions: ['custom-edge-2'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: true,
        isLastFallback: true,
        isDeadCondition: false
      },
      {
        subpath: '#edge-case-1',
        target: './string.js',
        conditions: ['default'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#edge-case-2',
        target: './string-2.js',
        conditions: ['custom-edge-2'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#edge-case-2',
        target: './import.js',
        conditions: ['default', 'import'],
        excludedConditions: ['custom-edge-2'],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#edge-case-2',
        target: './node.js',
        conditions: ['default', 'node'],
        excludedConditions: ['custom-edge-2'],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#edge-case-2',
        target: './string.js',
        conditions: ['default', 'custom-edge-2-x'],
        excludedConditions: ['custom-edge-2', 'import', 'node'],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#edge-case-2',
        target: './default.js',
        conditions: ['default'],
        excludedConditions: ['custom-edge-2', 'import', 'node', 'custom-edge-2-x'],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#edge-case-2',
        target: './unsafe.js',
        conditions: ['default', 'dead-case-1'],
        excludedConditions: ['custom-edge-2'],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: true
      },
      {
        subpath: '#edge-case-3',
        target: './string-3.js',
        conditions: ['custom-edge-3'],
        excludedConditions: [],
        isSugared: false,
        isFallback: false,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#edge-case-3',
        target: './import.js',
        conditions: ['default', 'import'],
        excludedConditions: ['custom-edge-3'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: true,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#edge-case-3',
        target: './node.js',
        conditions: ['default', 'node'],
        excludedConditions: ['custom-edge-3'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#edge-case-3',
        target: './default.js',
        conditions: ['default'],
        excludedConditions: ['custom-edge-3', 'import', 'node'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: false
      },
      {
        subpath: '#edge-case-3',
        target: './unsafe.js',
        conditions: ['default', 'dead-case-2'],
        excludedConditions: ['custom-edge-3'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: false,
        isDeadCondition: true
      },
      {
        subpath: '#edge-case-3',
        target: './string.js',
        conditions: ['default'],
        excludedConditions: ['custom-edge-3'],
        isSugared: false,
        isFallback: true,
        isFirstNonNullFallback: false,
        isLastFallback: true,
        isDeadCondition: false
      }
    ]);
  });
});

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
    test('@-xun/project/resolve', async () => {
      expect.hasAssertions();

      expect(
        resolveEntryPointsFromExportsTarget({
          flattenedExports: getDummyFlattenedExports(),
          target: '/lite/worker.browser.js',
          conditions: ['worker', 'browser']
        })
      ).toStrictEqual([]);

      expect(
        resolveEntryPointsFromExportsTarget({
          flattenedExports: getDummyFlattenedExports(),
          target: 'lite/worker.browser.js',
          conditions: ['worker', 'browser']
        })
      ).toStrictEqual([]);

      expect(
        resolveEntryPointsFromExportsTarget({
          flattenedExports: getDummyFlattenedExports(),
          target: './lite-worker-browser.js',
          conditions: ['worker', 'browser']
        })
      ).toStrictEqual(['./lite']);

      expect(
        resolveEntryPointsFromExportsTarget({
          flattenedExports: getDummyFlattenedExports({
            './missing-dot': ['./mixed/*.js', 'non-absolute/import.js']
          }),
          target: './non-absolute/import.js',
          includeUnsafeFallbackTargets: true
        })
      ).toStrictEqual([]);

      expect(
        resolveEntryPointsFromExportsTarget({
          flattenedExports: getDummyFlattenedExports({
            // * Technically this is an invalid target in package.json exports
            './missing-dot': ['./mixed/*.js', 'non-absolute/import.js']
          }),
          target: 'non-absolute/import.js',
          includeUnsafeFallbackTargets: true
        })
      ).toStrictEqual(['./missing-dot']);

      expect(
        resolveEntryPointsFromExportsTarget({
          flattenedExports: getDummyFlattenedExports({
            './missing-dot': { default: './non-absolute/deep/require' }
          }),
          // * Technically this is an invalid target in package.json exports
          target: 'non-absolute/deep/require'
        })
      ).toStrictEqual([]);

      expect(
        resolveEntryPointsFromExportsTarget({
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
      map: dummySugaredPackage.packageJson.exports
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
            map: dummyDefaultsPackage.packageJson.exports
          })
        },
        operation: 'resolveEntryPointsFromExportsTarget'
      },
      library: {
        ...defaultLibraryConfig,
        packageJson: dummyDefaultsPackage.packageJson
      },
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
            map: dummyUnlimitedPackage.packageJson.exports
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
      subpaths: [
        ['./null-in-fallback-edge-case-1', './null-in-fallback-edge-case-2'],
        []
      ]
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
      resolveExportsTargetsFromEntryPoint({
        flattenedExports,
        entryPoint:
          resolveEntryPointsFromExportsTarget({
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
      map: dummySugaredPackage.packageJson.exports
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
            map: dummyUnlimitedPackage.packageJson.exports
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
      resolveEntryPointsFromExportsTarget({
        flattenedExports,
        target:
          resolveExportsTargetsFromEntryPoint({
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
    test('@-xun/project/resolve', async () => {
      expect.hasAssertions();

      expect(
        resolveEntryPointsFromImportsTarget({
          flattenedImports: getDummyFlattenedImports(),
          target: '/lite/worker.browser.js',
          conditions: ['worker', 'browser']
        })
      ).toStrictEqual([]);

      expect(
        resolveEntryPointsFromImportsTarget({
          flattenedImports: getDummyFlattenedImports(),
          target: 'lite/worker.browser.js',
          conditions: ['worker', 'browser']
        })
      ).toStrictEqual([]);

      expect(
        resolveEntryPointsFromImportsTarget({
          flattenedImports: getDummyFlattenedImports(),
          target: './lite-worker-browser.js',
          conditions: ['worker', 'browser']
        })
      ).toStrictEqual(['#lite']);

      expect(
        resolveEntryPointsFromImportsTarget({
          flattenedImports: getDummyFlattenedImports({
            '#missing-dot': ['./mixed/*.js', 'non-absolute/import.js']
          }),
          target: './non-absolute/import.js',
          includeUnsafeFallbackTargets: true
        })
      ).toStrictEqual([]);

      expect(
        resolveEntryPointsFromImportsTarget({
          flattenedImports: getDummyFlattenedImports({
            // * Technically this is an invalid target in package.json imports
            '#missing-dot': ['./mixed/*.js', 'non-absolute/import.js']
          }),
          target: 'non-absolute/import.js',
          includeUnsafeFallbackTargets: true
        })
      ).toStrictEqual(['#missing-dot']);

      expect(
        resolveEntryPointsFromImportsTarget({
          flattenedImports: getDummyFlattenedImports({
            '#missing-dot': { default: './non-absolute/deep/require' }
          }),
          // * Technically this is an invalid target in package.json imports
          target: 'non-absolute/deep/require'
        })
      ).toStrictEqual([]);

      expect(
        resolveEntryPointsFromImportsTarget({
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
      map: dummySugaredPackage.packageJson.imports
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
            map: dummyDefaultsPackage.packageJson.imports
          })
        },
        operation: 'resolveEntryPointsFromImportsTarget'
      },
      library: {
        ...defaultLibraryConfig,
        packageJson: dummyDefaultsPackage.packageJson
      },
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
            map: dummyUnlimitedPackage.packageJson.imports
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
      resolveImportsTargetsFromEntryPoint({
        flattenedImports,
        entryPoint:
          resolveEntryPointsFromImportsTarget({
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
      map: dummySugaredPackage.packageJson.imports
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
            map: dummyUnlimitedPackage.packageJson.imports
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
      resolveEntryPointsFromImportsTarget({
        flattenedImports,
        target:
          resolveImportsTargetsFromEntryPoint({
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
  UnsafeFallbackOption & ReplaceSubpathAsterisksOption
>;

type CreateSharedTestContextOptions<MapType extends 'forward' | 'reverse'> = {
  /**
   * Configuration for the resolver functions under test.
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
            flattenedMap: FlattenedExportsOption;
            operation: 'resolveEntryPointsFromExportsTarget';
          }
        | {
            flattenedMap: FlattenedImportsOption;
            operation: 'resolveEntryPointsFromImportsTarget';
          }
    :
        | {
            flattenedMap: FlattenedExportsOption;
            operation: 'resolveExportsTargetsFromEntryPoint';
          }
        | {
            flattenedMap: FlattenedImportsOption;
            operation: 'resolveImportsTargetsFromEntryPoint';
          });
  /**
   * Configuration for the resolve.exports library.
   */
  library: {
    packageJson: XPackageJson;
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
   * Configuration for the Node.js
   */
  node: {
    packageName: string;
    rootPackagePath: string;
  } & (MapType extends 'reverse'
    ? {
        /**
         * A target that should be resolved by Node.js's resolver in a single
         * invocation or an array of targets each of which should be resolved by
         * their corresponding invocation of Node.js's resolver. In the latter
         * form, the array must be the same size as `conditions`, `targets`,
         * etc.
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
         * their corresponding invocation of Node.js's  In the latter
         * form, the array must be the same size as `conditions`, `targets`,
         * etc.
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

  const shouldApplyExpectAllTargetsGlobally =
    Array.isArray(library.expectAllTargets) &&
    !Array.isArray(library.expectAllTargets[0]);

  if (library.expectAllTargets && !shouldApplyExpectAllTargetsGlobally) {
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
        `expectAllTargets sub-array at index ${index} (${targets_.length}) must be the same length (${String(pathValue[index]?.length)}) as shared test context ${pathKey} array at the same index`
      );
    });
  }

  const shouldApplyExpectOnlyTargetsGlobally = !Array.isArray(node.expectOnlyTargets);

  if (node.expectOnlyTargets && !shouldApplyExpectOnlyTargetsGlobally) {
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
        `expectOnlyTargets sub-array at index ${index} (length: ${target_?.length ?? 0}) must be the same length (${String(pathValue[index]?.length)}) as shared test context ${pathKey} array at the same index`
      );
    });
  }

  return { shouldApplyExpectAllTargetsGlobally, shouldApplyExpectOnlyTargetsGlobally };
}

/**
 * Used to generate tests evaluating the correctness of target => subpath
 * resolver functions.
 */
function createSharedReverseMappingTestContext(
  context: CreateSharedTestContextOptions<'reverse'>
) {
  const { shouldApplyExpectAllTargetsGlobally, shouldApplyExpectOnlyTargetsGlobally } =
    validateContext(context);
  const { core, library, node, conditions, targets, subpaths } = context;

  return {
    core,
    library: { ...library, shouldApplyExpectAllTargetsGlobally },
    node: { ...node, shouldApplyExpectOnlyTargetsGlobally },
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
  const { shouldApplyExpectAllTargetsGlobally, shouldApplyExpectOnlyTargetsGlobally } =
    validateContext(context);
  const { core, library, node, conditions, targets, entryPoints } = context;

  return {
    core,
    library: { ...library, shouldApplyExpectAllTargetsGlobally },
    node: { ...node, shouldApplyExpectOnlyTargetsGlobally },
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

    test(`@-xun/project/resolve #${index + 1}`, async () => {
      expect.hasAssertions();

      const resolver =
        context.core.operation === 'resolveEntryPointsFromExportsTarget'
          ? resolveEntryPointsFromExportsTarget
          : context.core.operation === 'resolveExportsTargetsFromEntryPoint'
            ? resolveExportsTargetsFromEntryPoint
            : context.core.operation === 'resolveEntryPointsFromImportsTarget'
              ? resolveEntryPointsFromImportsTarget
              : resolveImportsTargetsFromEntryPoint;

      if ('subpaths' in context) {
        expect(
          resolver({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ...(core.flattenedMap as any),
            target: context.targets[index],
            conditions: conditions[index],
            ...additionalOptions
          })
        ).toStrictEqual(context.subpaths[index]);
      } else {
        expect(
          resolver({
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
      shouldApplyExpectAllTargetsGlobally,
      expectTestsToFail
    },
    conditions
  } = context;

  // eslint-disable-next-line unicorn/no-for-loop
  for (let index = 0; index < conditions.length; ++index) {
    const title = 'resolve.exports library';

    const selectedSubpath = [
      ('subpaths' in context ? context.subpaths : context.entryPoints)[index]
    ].flat();

    let expectedTarget = expectAllTargets
      ? shouldApplyExpectAllTargetsGlobally
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

        test(`${title} #${testId}${
          expectTestToFail ? ' (library failure expected)' : ''
        }`, async () => {
          expect.hasAssertions();

          assert(subpath, CommonErrorMessage.GuruMeditation());

          // eslint-disable-next-line jest/valid-expect
          const expectation = expect(
            resolveTargetWithResolveExports({
              packageJson,
              subpath,
              conditions: conditions[index] ?? []
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
      expectOnlyTargets,
      shouldApplyExpectOnlyTargetsGlobally
    },
    conditions
  } = context;

  // eslint-disable-next-line unicorn/no-for-loop
  for (let index = 0; index < conditions.length; ++index) {
    const title = `node.js resolver #${index + 1}`;

    const selectedSubpath = [
      ('subpaths' in context ? context.subpaths : context.entryPoints)[index]
    ].flat();

    const expectedTarget = expectOnlyTargets
      ? shouldApplyExpectOnlyTargetsGlobally
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

          assert(subpath, CommonErrorMessage.GuruMeditation());

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
              ? (expectedTarget[subIndex] ?? null)
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
