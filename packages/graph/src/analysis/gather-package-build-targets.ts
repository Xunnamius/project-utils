import assert from 'node:assert';

import { cache, CacheScope } from '@-xun/cache';
import { toPath, toRelativePath, type AbsolutePath, type RelativePath } from '@-xun/fs';

import {
  isWorkspacePackage,
  type GenericPackage,
  // ? Used in documentation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type Package
} from '@-xun/project-types';

import { glob as globAsync, sync as globSync } from 'glob';

import { ProjectError } from 'multiverse+common:error.ts';

import {
  ensureRawSpecifierOk,
  generateRawAliasMap,
  mapRawSpecifierToPath,
  mapRawSpecifierToRawAliasMapping,
  WellKnownImportAlias
} from 'universe+graph:alias.ts';

import {
  gatherImportEntriesFromFiles,
  type ImportSpecifiersEntry
} from 'universe+graph:analysis/gather-import-entries-from-files.ts';

import { gatherPackageFiles } from 'universe+graph:analysis/gather-package-files.ts';
import { pathToPackage } from 'universe+graph:analysis/path-to-package.ts';
import { commonDebug, type PackageBuildTargets } from 'universe+graph:common.ts';
import { hasTypescriptExtension } from 'universe+graph:constant.ts';
import { GraphErrorMessage } from 'universe+graph:error.ts';

import { type ParametersNoFirst, type SyncVersionOf } from 'typeverse:global.ts';

import type { Entries, Promisable, SetFieldType } from 'type-fest';

const debug = commonDebug.extend('gatherPackageBuildTargets');

/**
 * Prefixed to specifiers used in non-source files.
 */
export const prefixAssetImport = '<❗ASSET>';

/**
 * Prefixed to specifiers used in internal files.
 */
export const prefixInternalImport = '<intr>';

/**
 * Prefixed to specifiers used in external files.
 */
export const prefixExternalImport = '<extr>';

/**
 * Prefixed to specifiers used in at least one normally imported file.
 */
export const prefixNormalImport = '<norm>';

/**
 * Prefixed to specifiers used in at least one type-only imported file.
 */
export const prefixTypeOnlyImport = '<type>';

/**
 * A prefix potentially added to specifier metadata in
 * {@link PackageBuildTargets}.
 */
export type MetadataImportsPrefix =
  | typeof prefixAssetImport
  | typeof prefixInternalImport
  | typeof prefixExternalImport
  | typeof prefixNormalImport
  | typeof prefixTypeOnlyImport;

/**
 * @see {@link gatherPackageBuildTargets}
 */
export type GatherPackageBuildTargetsOptions = {
  /**
   * Use the internal cached result from a previous run, if available.
   *
   * Unless `useCached` is `false`, the results returned by this function will
   * always strictly equal (`===`) each other with respect to call signature.
   *
   * @see {@link cache}
   */
  useCached: boolean;
  /**
   * If `true`, multiversal import support will be enabled.
   */
  allowMultiversalImports: boolean;
  /**
   * Exclude paths from the internals result with respect to the patterns in
   * `excludeInternalsPatterns`, which are interpreted according to gitignore
   * rules and _always_ relative to the _project_ (NEVER package or filesystem!)
   * root.
   */
  excludeInternalsPatterns?: string[];
  /**
   * Include in the externals result all paths matching a pattern in
   * `includeExternalsPatterns`, which are interpreted as glob strings and
   * _always_ relative to the _project_ (NEVER package or filesystem!) root.
   */
  includeExternalsPatterns?: string[];
};

function gatherPackageBuildTargets_(
  shouldRunSynchronously: false,
  package_: GenericPackage,
  options: GatherPackageBuildTargetsOptions
): Promise<PackageBuildTargets>;
function gatherPackageBuildTargets_(
  shouldRunSynchronously: true,
  package_: GenericPackage,
  options: GatherPackageBuildTargetsOptions
): PackageBuildTargets;
function gatherPackageBuildTargets_(
  shouldRunSynchronously: boolean,
  package_: GenericPackage,
  { useCached, ...cacheIdComponentsObject }: GatherPackageBuildTargetsOptions
): Promisable<PackageBuildTargets> {
  const {
    allowMultiversalImports,
    excludeInternalsPatterns = [],
    includeExternalsPatterns = []
  } = cacheIdComponentsObject;

  const { projectMetadata } = package_;
  const { rootPackage } = projectMetadata;
  const { root: projectRoot } = rootPackage;

  if (useCached) {
    const cachedBuildTargets = cache.get(CacheScope.GatherPackageBuildTargets, [
      package_,
      cacheIdComponentsObject
    ]);

    if (cachedBuildTargets) {
      debug('reusing cached resources: %O', cachedBuildTargets);
      return shouldRunSynchronously
        ? cachedBuildTargets
        : Promise.resolve(cachedBuildTargets);
    }
  }

  const packageBuildTargets: PackageBuildTargets = {
    targets: {
      external: { normal: new Set(), typeOnly: new Set() },
      internal: new Set()
    },
    metadata: { imports: { aliasCounts: {}, dependencyCounts: {} } }
  };

  const {
    targets,
    metadata: {
      imports: { aliasCounts, dependencyCounts }
    }
  } = packageBuildTargets;

  const wellKnownAliases = generateRawAliasMap(projectMetadata);

  if (shouldRunSynchronously) {
    runSynchronously();
    return packageBuildTargets;
  } else {
    return runAsynchronously().then(() => packageBuildTargets);
  }

  async function runAsynchronously() {
    const [packageSrcPaths, additionalExternalPaths] = await Promise.all([
      gatherPackageFiles(package_, { ignore: excludeInternalsPatterns, useCached }).then(
        ({ src }) => src
      ),
      globAsync(includeExternalsPatterns, {
        dot: true,
        absolute: true,
        nodir: true,
        cwd: projectRoot
      }) as Promise<AbsolutePath[]>
    ]);

    // * Note that targets.internal is relative to the **PROJECT ROOT**
    let seenNormalImportPaths = new Set(packageSrcPaths);
    let seenTypeOnlyImportPaths = new Set<AbsolutePath>();

    // * Note that packageSrcPaths contains normal and type-only imports
    targets.internal = absolutePathsSetToRelative(seenNormalImportPaths, projectRoot);

    // * Note that targets.external is relative to the **PROJECT ROOT**
    targets.external.normal = absolutePathsSetToRelative(
      new Set(additionalExternalPaths),
      projectRoot
    );

    for (
      let firstIteration = true,
        previousNormalDiff = new Set(packageSrcPaths.concat(additionalExternalPaths)),
        // * Note that this can include any import kind, not just type-only
        previousTypeOnlyDiff = new Set<AbsolutePath>();
      previousNormalDiff.size !== 0 || previousTypeOnlyDiff.size !== 0;
      firstIteration = false
    ) {
      seenNormalImportPaths = seenNormalImportPaths.union(previousNormalDiff);
      seenTypeOnlyImportPaths = seenTypeOnlyImportPaths.union(previousTypeOnlyDiff);

      const [
        { normal: normalNormalPaths_, typeOnly: normalTypeOnlyPaths_ },
        { normal: typeOnlyNormalPaths_, typeOnly: typeOnlyTypeOnlyPaths_ }
        // ? Await is necessary here because of the loop's condition check
        // eslint-disable-next-line no-await-in-loop
      ] = await Promise.all([
        gatherImportEntriesFromFiles(Array.from(previousNormalDiff.values()), {
          useCached
        }).then((entries) => rawSpecifiersToTargetPaths(entries, !firstIteration)),
        gatherImportEntriesFromFiles(Array.from(previousTypeOnlyDiff.values()), {
          useCached
        }).then((entries) => rawSpecifiersToTargetPaths(entries, !firstIteration))
      ]);

      // * Note that these are relative to the **PROJECT ROOT**
      const normalNormalPaths = normalNormalPaths_.difference(seenNormalImportPaths);
      const normalTypeOnlyPaths = normalTypeOnlyPaths_.difference(
        seenTypeOnlyImportPaths
      );
      const typeOnlyNormalPaths = typeOnlyNormalPaths_.difference(
        seenTypeOnlyImportPaths
      );
      const typeOnlyTypeOnlyPaths = typeOnlyTypeOnlyPaths_.difference(
        seenTypeOnlyImportPaths
      );

      targets.external.normal = targets.external.normal.union(
        absolutePathsSetToRelative(normalNormalPaths, projectRoot)
      );

      // ? Any import kind originating from a type-only import is also type-only
      targets.external.typeOnly = targets.external.typeOnly.union(
        absolutePathsSetToRelative(normalTypeOnlyPaths, projectRoot).union(
          absolutePathsSetToRelative(typeOnlyNormalPaths, projectRoot).union(
            absolutePathsSetToRelative(typeOnlyTypeOnlyPaths, projectRoot)
          )
        )
      );

      previousNormalDiff = normalNormalPaths;
      previousTypeOnlyDiff = normalTypeOnlyPaths.union(
        typeOnlyNormalPaths.union(typeOnlyTypeOnlyPaths)
      );
    }

    finalize();
  }

  function runSynchronously() {
    const [packageSrcPaths, additionalExternalPaths] = [
      gatherPackageFiles.sync(package_, {
        ignore: excludeInternalsPatterns,
        useCached
      }).src,
      globSync(includeExternalsPatterns, {
        dot: true,
        absolute: true,
        nodir: true,
        cwd: projectRoot
      }) as AbsolutePath[]
    ];

    // * Note that targets.internal is relative to the **PROJECT ROOT**
    let seenNormalImportPaths = new Set(packageSrcPaths);
    let seenTypeOnlyImportPaths = new Set<AbsolutePath>();

    // * Note that packageSrcPaths contains normal and type-only imports
    targets.internal = absolutePathsSetToRelative(seenNormalImportPaths, projectRoot);

    // * Note that targets.external is relative to the **PROJECT ROOT**
    targets.external.normal = absolutePathsSetToRelative(
      new Set(additionalExternalPaths),
      projectRoot
    );

    for (
      let firstIteration = true,
        previousNormalDiff = new Set(packageSrcPaths.concat(additionalExternalPaths)),
        // * Note that this can include any import kind, not just type-only
        previousTypeOnlyDiff = new Set<AbsolutePath>();
      previousNormalDiff.size !== 0 || previousTypeOnlyDiff.size !== 0;
      firstIteration = false
    ) {
      seenNormalImportPaths = seenNormalImportPaths.union(previousNormalDiff);
      seenTypeOnlyImportPaths = seenTypeOnlyImportPaths.union(previousTypeOnlyDiff);

      const [
        { normal: normalNormalPaths_, typeOnly: normalTypeOnlyPaths_ },
        { normal: typeOnlyNormalPaths_, typeOnly: typeOnlyTypeOnlyPaths_ }
      ] = [
        rawSpecifiersToTargetPaths(
          gatherImportEntriesFromFiles.sync(Array.from(previousNormalDiff.values()), {
            useCached
          }),
          !firstIteration
        ),
        rawSpecifiersToTargetPaths(
          gatherImportEntriesFromFiles.sync(Array.from(previousTypeOnlyDiff.values()), {
            useCached
          }),
          !firstIteration
        )
      ];

      // * Note that these are relative to the **PROJECT ROOT**
      const normalNormalPaths = normalNormalPaths_.difference(seenNormalImportPaths);
      const normalTypeOnlyPaths = normalTypeOnlyPaths_.difference(
        seenTypeOnlyImportPaths
      );
      const typeOnlyNormalPaths = typeOnlyNormalPaths_.difference(
        seenTypeOnlyImportPaths
      );
      const typeOnlyTypeOnlyPaths = typeOnlyTypeOnlyPaths_.difference(
        seenTypeOnlyImportPaths
      );

      targets.external.normal = targets.external.normal.union(
        absolutePathsSetToRelative(normalNormalPaths, projectRoot)
      );

      // ? Any import kind originating from a type-only import is also type-only
      targets.external.typeOnly = targets.external.typeOnly.union(
        absolutePathsSetToRelative(normalTypeOnlyPaths, projectRoot).union(
          absolutePathsSetToRelative(typeOnlyNormalPaths, projectRoot).union(
            absolutePathsSetToRelative(typeOnlyTypeOnlyPaths, projectRoot)
          )
        )
      );

      previousNormalDiff = normalNormalPaths;
      previousTypeOnlyDiff = normalTypeOnlyPaths.union(
        typeOnlyNormalPaths.union(typeOnlyTypeOnlyPaths)
      );
    }

    finalize();
  }

  function finalize() {
    packageBuildTargets.targets.external.typeOnly =
      packageBuildTargets.targets.external.typeOnly.difference(
        packageBuildTargets.targets.external.normal
      );

    debug('package build targets: %O', packageBuildTargets);

    cache.set(
      CacheScope.GatherPackageBuildTargets,
      [package_, cacheIdComponentsObject],
      packageBuildTargets
    );
  }

  /**
   * Given an array of {@link ImportSpecifiersEntry}s, this function returns a
   * flattened array of ({@link AbsolutePath})s resolved from those specifiers.
   * Specifiers that are not from a distributable source verse (i.e. testverse,
   * typeverse) will cause an error. Specifiers that do not come from TypeScript
   * files or cannot be mapped are ignored, though their existence is still
   * noted in the metadata and, unless they do NOT come from a TypeScript file,
   * their syntax is still validated.
   *
   * **Note that this function returns external and, potentially, internal paths
   * mixed together** since rootverse imports are technically external but can
   * still refer to internal paths.
   *
   * @see {@link PackageBuildTargets}
   */
  function rawSpecifiersToTargetPaths(
    entries: ImportSpecifiersEntry[],
    allowForeignUniversalImports: boolean,
    // * We'll see if setting this to true becomes useful at some point...
    allowRootverseNodeModules = false
  ): SetFieldType<ImportSpecifiersEntry[1], 'normal' | 'typeOnly', Set<AbsolutePath>> {
    const targetPaths: Parameters<typeof rawSpecifiersToTargetPaths_>[0] = {
      normal: [],
      typeOnly: []
    };

    for (const [specifiersPath, specifiers] of entries) {
      const specifiersPackage = pathToPackage(specifiersPath, projectMetadata);
      const relativeSpecifiersPath = toRelativePath(projectRoot, specifiersPath);

      rawSpecifiersToTargetPaths_(
        targetPaths,
        specifiersPath,
        specifiers,
        specifiersPackage,
        targets.internal.has(relativeSpecifiersPath),
        targets.external.typeOnly.has(relativeSpecifiersPath),
        targets.external.normal.has(relativeSpecifiersPath),
        allowForeignUniversalImports,
        allowRootverseNodeModules
      );
    }

    return {
      normal: new Set(relativePathsArrayToAbsolute(targetPaths.normal, projectRoot)),
      typeOnly: new Set(relativePathsArrayToAbsolute(targetPaths.typeOnly, projectRoot))
    };
  }

  function rawSpecifiersToTargetPaths_(
    targetPaths: { normal: RelativePath[]; typeOnly: RelativePath[] },
    specifiersPath: AbsolutePath,
    specifierSets: ImportSpecifiersEntry[1],
    specifiersPackage: GenericPackage,
    isInternal: boolean,
    isTypeOnly: boolean,
    isNormal: boolean,
    allowForeignUniversalImports: boolean,
    allowRootverseNodeModules: boolean
  ) {
    // TODO: consider optionally allowing files other than typescript to have
    // TODO: their raw specifiers checked
    const comesFromTypescriptFile = hasTypescriptExtension(specifiersPath);
    const specifierPackageId = isWorkspacePackage(specifiersPackage)
      ? specifiersPackage.id
      : undefined;

    for (const [importKind, specifiers] of Object.entries(specifierSets) as Entries<
      typeof specifierSets
    >) {
      for (const specifier of specifiers.values()) {
        if (comesFromTypescriptFile) {
          ensureRawSpecifierOk(wellKnownAliases, specifier, {
            allowMultiversalImports,
            allowForeignUniversalImports,
            allowTestversalImports: false,
            allowRootverseNodeModules,
            packageId: specifierPackageId,
            containingFilePath: specifiersPath
          });
        }

        const prefixes: MetadataImportsPrefix[] = [];

        if (isNormal) {
          prefixes.push(prefixNormalImport);
        }

        if (isTypeOnly || importKind === 'typeOnly') {
          prefixes.push(prefixTypeOnlyImport);
        }

        if (isInternal) {
          // ? All internals are always considered "normal" imports
          prefixes.push(prefixNormalImport, prefixInternalImport);
        } else {
          prefixes.push(prefixExternalImport);
        }

        if (!comesFromTypescriptFile) {
          prefixes.push(prefixAssetImport);
        }

        const rawAliasMapping = mapRawSpecifierToRawAliasMapping(
          wellKnownAliases,
          specifier
        );

        if (rawAliasMapping) {
          const [{ group, alias }] = rawAliasMapping;

          // ? Looks like one of ours. Noting it...
          addToCounterMetadata(aliasCounts, alias, prefixes);

          if (comesFromTypescriptFile) {
            const versal = `${group.slice(0, -1)}al`;
            const isOkVerse = [
              WellKnownImportAlias.Universe,
              WellKnownImportAlias.Multiverse,
              WellKnownImportAlias.Rootverse,
              WellKnownImportAlias.Typeverse
            ].includes(group);

            const specifierResolvedPath = mapRawSpecifierToPath(
              rawAliasMapping,
              specifier
            );

            assert(specifierResolvedPath, GraphErrorMessage.GuruMeditation());

            if (isOkVerse) {
              targetPaths[importKind].push(specifierResolvedPath);

              debug(
                `${versal} target added: %O => %O`,
                specifier,
                specifierResolvedPath
              );
            } else {
              debug.error(
                `${versal} target rejected: %O => %O`,
                specifier,
                specifierResolvedPath
              );

              throw new ProjectError(
                GraphErrorMessage.SpecifierNotOkVerseNotAllowed(
                  group,
                  specifier,
                  specifiersPath
                )
              );
            }
          }
        } else {
          const key = specifierToPackageName(specifier);
          // ? Looks like a normal non-aliased import. Noting it...
          addToCounterMetadata(dependencyCounts, key, prefixes);
        }
      }
    }
  }
}

/**
 * Asynchronously construct a {@link PackageBuildTargets} instance derived from
 * a {@link Package} instance.
 *
 * Also performs a lightweight correctness check of all imports as they're
 * encountered.
 *
 * **NOTE: the result of this function is memoized! This does NOT _necessarily_
 * mean results will strictly equal each other. See `useCached` in this specific
 * function's options for details.** To fetch fresh results, set the `useCached`
 * option to `false` or clear the internal cache with {@link cache.clear}.
 */
export function gatherPackageBuildTargets(
  ...args: ParametersNoFirst<typeof gatherPackageBuildTargets_>
) {
  return gatherPackageBuildTargets_(false, ...args);
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace gatherPackageBuildTargets {
  /**
   * Synchronously construct a {@link PackageBuildTargets} instance derived from
   * a {@link Package} instance.
   *
   * Also performs a lightweight correctness check of all imports as they're
   * encountered.
   *
   * **NOTE: the result of this function is memoized! This does NOT
   * _necessarily_ mean results will strictly equal each other. See `useCached`
   * in this specific function's options for details.** To fetch fresh results,
   * set the `useCached` option to `false` or clear the internal cache with
   * {@link cache.clear}.
   */
  export const sync = function (...args) {
    return gatherPackageBuildTargets_(true, ...args);
  } as SyncVersionOf<typeof gatherPackageBuildTargets>;
}

/**
 * Takes a fully-resolved (i.e. _not an alias_) import specifier and returns its
 * package name. Accounts for imports of namespaced packages like `@babel/core`.
 *
 * Useful for translating external NPM package import specifiers into the names
 * of the individual packages. Examples:
 *
 * ```
 * specifierToPackageName('next/jest') === 'next'
 * specifierToPackageName('@babel/core') === '@babel/core'
 * specifierToPackageName('/something/custom') === '/something/custom'
 * specifierToPackageName('./something/custom') === './something/custom'
 * ```
 */
export function specifierToPackageName(specifier: string) {
  const split = specifier.split('/').slice(0, 2);
  const packageName =
    specifier.startsWith('@') && split.length === 2
      ? split.join('/')
      : ['.', '..'].includes(split[0])
        ? specifier
        : split[0];

  return packageName;
}

function relativePathsArrayToAbsolute(
  relativePaths: RelativePath[],
  root: AbsolutePath
) {
  return relativePaths.map((path) => toPath(root, path));
}

function absolutePathsSetToRelative(set: Set<AbsolutePath>, root: AbsolutePath) {
  return new Set(Array.from(set).map((path) => toRelativePath(root, path)));
}

function addToCounterMetadata(
  counterObject: Partial<PackageBuildTargets['metadata']['imports']['aliasCounts']>,
  aliasKey: string,
  prefixesToAdd: MetadataImportsPrefix[]
) {
  if (!counterObject[aliasKey]) {
    counterObject[aliasKey] = { count: 0, prefixes: new Set() };
  }

  const obj = counterObject[aliasKey];
  obj.count += 1;
  obj.prefixes = obj.prefixes.union(new Set(prefixesToAdd));
}
