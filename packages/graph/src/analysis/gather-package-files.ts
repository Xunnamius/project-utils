import { cache, CacheScope } from '@-xun/cache';
import { toPath, toRelativePath, type AbsolutePath, type RelativePath } from '@-xun/fs';

import {
  deriveVirtualGitignoreLines,
  directoryPackagesProjectBase
} from '@-xun/project-fs';

import { glob as globAsync, sync as globSync } from 'glob-gitignore';

import {
  assignResultTo,
  commonDebug,
  type PackageFiles
} from 'universe+graph:common.ts';

import { type ParametersNoFirst, type SyncVersionOf } from 'typeverse:global.ts';

import type { GenericPackage } from '@-xun/project-types';
import type { Promisable } from 'type-fest';

const debug = commonDebug.extend('gatherPackageFiles');

const rawDistGlob = 'dist/**/*';
// eslint-disable-next-line unicorn/prevent-abbreviations
const rawDocsGlob = 'docs/**/*';
const rawSrcGlob = 'src/**/*';
const rawTestGlob = 'test/**/*';
const rawOtherGlob = '**/*';

/**
 * @see {@link gatherPackageFiles}
 */
export type GatherPackageFilesOptions = {
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
   * If `true`, use the project root's `.gitignore` file exclusively to filter
   * out returned project files.
   *
   * @default true
   */
  skipGitIgnored?: boolean;
  /**
   * Exclude paths from the result with respect to the given patterns, which are
   * interpreted **relative to the _project root_** according to gitignore
   * rules.
   *
   * This option can also be used together with
   * {@link GatherPackageFilesOptions.skipGitIgnored}. Also, since `ignore` is
   * appended to the final list of ignored files, negated globs can be used to
   * un-ignore files.
   */
  ignore?: (string | RelativePath)[];
};

function gatherPackageFiles_(
  shouldRunSynchronously: false,
  package_: GenericPackage,
  options: GatherPackageFilesOptions
): Promise<PackageFiles>;
function gatherPackageFiles_(
  shouldRunSynchronously: true,
  package_: GenericPackage,
  options: GatherPackageFilesOptions
): PackageFiles;
function gatherPackageFiles_(
  shouldRunSynchronously: boolean,
  package_: GenericPackage,
  { useCached, ...cacheIdComponentsObject }: GatherPackageFilesOptions
): Promisable<PackageFiles> {
  const { skipGitIgnored: skipIgnored = true, ignore: additionalIgnores = [] } =
    cacheIdComponentsObject;

  if (useCached) {
    const cachedPackageFiles = cache.get(CacheScope.GatherPackageFiles, [
      package_,
      cacheIdComponentsObject
    ]);

    if (cachedPackageFiles) {
      debug('reusing cached resources: %O', cachedPackageFiles);
      return shouldRunSynchronously
        ? cachedPackageFiles
        : Promise.resolve(cachedPackageFiles);
    }
  }

  const packageRoot = package_.root;
  const projectRoot = package_.projectMetadata.rootPackage.root;

  debug('package root: %O', packageRoot);
  debug('project root: %O', projectRoot);

  const packageFiles: PackageFiles = {
    dist: [],
    docs: [],
    src: [],
    test: [],
    other: []
  };

  const baseGlobOptions = {
    dot: true,
    absolute: true,
    nodir: true,
    cwd: projectRoot
  };

  const distGlob = toRelativePath(projectRoot, toPath(packageRoot, rawDistGlob));
  // eslint-disable-next-line unicorn/prevent-abbreviations
  const docsGlob = toRelativePath(projectRoot, toPath(packageRoot, rawDocsGlob));
  const srcGlob = toRelativePath(projectRoot, toPath(packageRoot, rawSrcGlob));
  const testGlob = toRelativePath(projectRoot, toPath(packageRoot, rawTestGlob));
  const otherGlob = toRelativePath(projectRoot, toPath(packageRoot, rawOtherGlob));

  debug('distGlob: %O', distGlob);
  debug('docsGlob: %O', docsGlob);
  debug('srcGlob: %O', srcGlob);
  debug('testGlob: %O', testGlob);
  debug('otherGlob: %O', otherGlob);

  const packagesIgnore =
    '/' + toRelativePath(projectRoot, toPath(packageRoot, directoryPackagesProjectBase));

  debug('packagesIgnore: %O', packagesIgnore);

  if (shouldRunSynchronously) {
    runSynchronously();
    return packageFiles;
  } else {
    return runAsynchronously().then(() => packageFiles);
  }

  async function runAsynchronously() {
    const ignore = skipIgnored
      ? await deriveVirtualGitignoreLines(projectRoot, { useCached })
      : [];

    // * Ignore "packages" + .gitignored'd + custom ignore
    const ignoreAndPackages = ignore.concat(packagesIgnore, additionalIgnores);
    const globOptions = { ...baseGlobOptions, ignore: ignoreAndPackages };

    debug(
      'virtual .gitignore lines (+ appended + additionalIgnores): %O',
      ignoreAndPackages
    );

    debug('globOptions: %O', globOptions);

    await Promise.all([
      globAsync(distGlob, {
        ...globOptions,
        // * Don't ignore anything
        ignore: []
      }).then(assignResultTo(packageFiles, 'dist')),

      globAsync(docsGlob, globOptions).then(assignResultTo(packageFiles, 'docs')),
      globAsync(srcGlob, globOptions).then(assignResultTo(packageFiles, 'src')),
      globAsync(testGlob, globOptions).then(assignResultTo(packageFiles, 'test')),

      globAsync(otherGlob, {
        ...globOptions,
        // * Ignore "packages" + .gitignored'd + files under docs, src, and test
        // ? Absolute paths in .gitignore/.gitignore are relative to repo
        ignore: ignoreAndPackages.concat([distGlob, docsGlob, srcGlob, testGlob])
      }).then(assignResultTo(packageFiles, 'other'))
    ]);

    finalize();
  }

  function runSynchronously() {
    const ignore = skipIgnored
      ? deriveVirtualGitignoreLines.sync(projectRoot, { useCached })
      : [];

    // * Ignore "packages" + .gitignored'd + custom ignore
    const ignoreAndPackages = ignore.concat(packagesIgnore, additionalIgnores);
    const globOptions = { ...baseGlobOptions, ignore: ignoreAndPackages };

    debug(
      'virtual .gitignore lines (+ appended + additionalIgnores): %O',
      ignoreAndPackages
    );

    debug('globOptions: %O', globOptions);

    packageFiles.dist = globSync(distGlob, {
      ...globOptions,
      // * Don't ignore anything
      ignore: []
    }) as AbsolutePath[];

    packageFiles.docs = globSync(docsGlob, globOptions) as AbsolutePath[];
    packageFiles.src = globSync(srcGlob, globOptions) as AbsolutePath[];
    packageFiles.test = globSync(testGlob, globOptions) as AbsolutePath[];

    packageFiles.other = globSync(otherGlob, {
      ...globOptions,
      // * Ignore "packages" + .gitignored'd + files under docs, src, and test
      // ? Absolute paths in .gitignore/.gitignore are relative to repo
      ignore: ignoreAndPackages.concat([distGlob, docsGlob, srcGlob, testGlob])
    }) as AbsolutePath[];

    finalize();
  }

  function finalize() {
    debug('package files: %O', packageFiles);

    cache.set(
      CacheScope.GatherPackageFiles,
      [package_, cacheIdComponentsObject],
      packageFiles
    );
  }
}

/**
 * Asynchronously construct a {@link PackageFiles} instance containing
 * {@link AbsolutePath}s to every file under `package_`'s root.
 *
 * **NOTE: the result of this function is memoized! This does NOT _necessarily_
 * mean results will strictly equal each other. See `useCached` in this specific
 * function's options for details.** To fetch fresh results, set the `useCached`
 * option to `false` or clear the internal cache with {@link cache.clear}.
 */
export function gatherPackageFiles(
  ...args: ParametersNoFirst<typeof gatherPackageFiles_>
) {
  return gatherPackageFiles_(false, ...args);
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace gatherPackageFiles {
  /**
   * Synchronously construct a {@link PackageFiles} instance containing
   * {@link AbsolutePath}s to every file under `package_`'s root.
   *
   * **NOTE: the result of this function is memoized! This does NOT
   * _necessarily_ mean results will strictly equal each other. See `useCached`
   * in this specific function's options for details.** To fetch fresh results,
   * set the `useCached` option to `false` or clear the internal cache with
   * {@link cache.clear}.
   */
  export const sync = function (...args) {
    return gatherPackageFiles_(true, ...args);
  } as SyncVersionOf<typeof gatherPackageFiles>;
}
