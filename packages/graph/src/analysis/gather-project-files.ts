import { toAbsolutePath, toRelativePath } from '@-xun/fs';
import { memoizer } from '@-xun/memoize';
import { deriveVirtualPrettierignoreLines } from '@-xun/project-fs';
import { glob as globAsync, sync as globSync } from 'glob-gitignore';

import { ProjectError } from 'multiverse+common:error.ts';

import { assignResultTo, commonDebug, toSerializable } from 'universe+graph:common.ts';
import { GraphErrorMessage } from 'universe+graph:error.ts';

import type { AbsolutePath } from '@-xun/fs';
import type { GenericPackage, GenericProjectMetadata } from '@-xun/project-types';
import type { Promisable } from 'type-fest';
import type { ParametersNoFirst } from 'multiverse+common:types.ts';
import type { ProjectFiles, Serializable } from 'universe+graph:common.ts';

const debug = commonDebug.extend('gatherProjectFiles');

const packageJsonGlob = '**/package.json';
const markdownGlob = '**/*.md';
const typescriptSrcGlob = 'src/**/*.{ts,tsx,mts,cts}';
const typescriptTestGlob = 'test/**/*.test.{ts,tsx,mts,cts}';

/**
 * @see {@link gatherProjectFiles}
 */
export type GatherProjectFilesOptions = {
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
   * Will not error if an interesting `package.json` file uses unsupported
   * features.
   */
  ignoreUnsupportedFeatures?: boolean;
} & (
  | {
      /**
       * If `true`, use the project root's `.prettierignore` file exclusively to
       * filter out returned project files.
       *
       * Note that _`.gitignore`_ is never used to filter the result of
       * `gatherProjectFiles`.
       *
       * @default true
       */
      skipPrettierIgnored: false;
      /**
       * If `true`, completely ignore (never consider or return) files unknown
       * to git.
       *
       * Meaningless without `skipPrettierIgnored` also being `true`.
       *
       * @default false
       */
      skipUnknown?: false;
    }
  | {
      skipPrettierIgnored?: true;
      skipUnknown?: boolean;
    }
);

function gatherProjectFiles_(
  shouldRunSynchronously: false,
  projectMetadata: GenericProjectMetadata,
  options: GatherProjectFilesOptions
): Promise<ProjectFiles>;
function gatherProjectFiles_(
  shouldRunSynchronously: true,
  projectMetadata: GenericProjectMetadata,
  options: GatherProjectFilesOptions
): ProjectFiles;
function gatherProjectFiles_(
  shouldRunSynchronously: boolean,
  projectMetadata: GenericProjectMetadata,
  { useCached, ...cacheIdComponentsObject }: GatherProjectFilesOptions
): Promisable<ProjectFiles> {
  const {
    skipPrettierIgnored = true,
    skipUnknown = false,
    ignoreUnsupportedFeatures = false
  } = cacheIdComponentsObject;

  type Memoization = (
    ...args: [Serializable<typeof projectMetadata>, typeof cacheIdComponentsObject]
  ) => ReturnType<typeof gatherProjectFiles_>;

  if (shouldRunSynchronously && skipUnknown) {
    throw new ProjectError(GraphErrorMessage.DeriverAsyncConfigurationConflict());
  }

  if (useCached) {
    const cachedPackageFiles = memoizer.get<Memoization>(
      gatherProjectFiles_ as unknown as Memoization,
      [toSerializable(projectMetadata), cacheIdComponentsObject]
    );

    if (cachedPackageFiles) {
      debug('reusing cached resources: %O', cachedPackageFiles);
      return shouldRunSynchronously
        ? cachedPackageFiles
        : Promise.resolve(cachedPackageFiles);
    }
  }

  const { rootPackage, subRootPackages: subRootPackagesMap } = projectMetadata;
  const subRootPackagesArray = Array.from(subRootPackagesMap?.values() || []);
  const projectRoot = rootPackage.root;

  const projectFiles: ProjectFiles = {
    packageJsonFiles: {
      atProjectRoot: toAbsolutePath('/dev/null'),
      atWorkspaceRoot: new Map(),
      atAnyRoot: [],
      elsewhere: []
    },
    mainBinFiles: {
      atProjectRoot: toAbsolutePath('/dev/null'),
      atWorkspaceRoot: new Map(),
      atAnyRoot: []
    },
    markdownFiles: {
      inRoot: [],
      inWorkspace: new Map(),
      all: []
    },
    typescriptSrcFiles: {
      inRootSrc: [],
      inWorkspaceSrc: new Map(),
      all: []
    },
    typescriptTestFiles: {
      inRootTest: [],
      inWorkspaceTest: new Map(),
      all: []
    }
  };

  const {
    packageJsonFiles,
    mainBinFiles: binFiles,
    markdownFiles,
    typescriptSrcFiles,
    typescriptTestFiles
  } = projectFiles;

  if (shouldRunSynchronously) {
    runSynchronously();
    return projectFiles;
  } else {
    return runAsynchronously().then(() => projectFiles);
  }

  async function runAsynchronously() {
    initialize();

    const ignore = skipPrettierIgnored
      ? await deriveVirtualPrettierignoreLines(projectRoot, {
          includeUnknownPaths: skipUnknown,
          useCached
        })
      : [];

    const ignoreAndPackages = appendWorkspacesToIgnore(ignore);

    debug('virtual .prettierignore lines (+ appended): %O', ignoreAndPackages);

    await Promise.all([
      globAsync(packageJsonGlob, {
        // ? Ignore "packages" and the relative path for every known
        // ? package.json file when populating packageJsonFiles.elsewhere
        ignore: appendPackageJsonFilesToIgnore(ignore),
        dot: true,
        absolute: true,
        nodir: true,
        cwd: projectRoot
      }).then(assignResultTo(packageJsonFiles, 'elsewhere')),

      globAsync(markdownGlob, {
        ignore: ignoreAndPackages,
        dot: true,
        absolute: true,
        nodir: true,
        cwd: projectRoot
      }).then(assignResultTo(markdownFiles, 'inRoot')),

      Promise.all(
        subRootPackagesArray.map(async (package_) => {
          const paths = await globAsync(markdownGlob, {
            ignore,
            dot: true,
            absolute: true,
            nodir: true,
            cwd: package_.root
          });

          return [package_.id, paths] as [string, string[]];
        })
      )
        .then((entries) => new Map(entries))
        .then(assignResultTo(markdownFiles, 'inWorkspace')),

      globAsync(typescriptSrcGlob, {
        ignore: ignoreAndPackages,
        dot: true,
        absolute: true,
        nodir: true,
        cwd: projectRoot
      }).then(assignResultTo(typescriptSrcFiles, 'inRootSrc')),

      Promise.all(
        subRootPackagesArray.map(async (package_) => {
          const paths = await globAsync(typescriptSrcGlob, {
            ignore,
            dot: true,
            absolute: true,
            nodir: true,
            cwd: package_.root
          });

          return [package_.id, paths] as [string, string[]];
        })
      )
        .then((entries) => new Map(entries))
        .then(assignResultTo(typescriptSrcFiles, 'inWorkspaceSrc')),

      globAsync(typescriptTestGlob, {
        ignore: ignoreAndPackages,
        dot: true,
        absolute: true,
        nodir: true,
        cwd: projectRoot
      }).then(assignResultTo(typescriptTestFiles, 'inRootTest')),

      Promise.all(
        subRootPackagesArray.map(async (package_) => {
          const paths = await globAsync(typescriptTestGlob, {
            ignore,
            dot: true,
            absolute: true,
            nodir: true,
            cwd: package_.root
          });

          return [package_.id, paths] as [string, string[]];
        })
      )
        .then((entries) => new Map(entries))
        .then(assignResultTo(typescriptTestFiles, 'inWorkspaceTest'))
    ]);

    finalize();
  }

  function runSynchronously() {
    if (skipUnknown) {
      throw new ProjectError(GraphErrorMessage.DeriverAsyncConfigurationConflict());
    }

    initialize();

    const ignore = skipPrettierIgnored
      ? deriveVirtualPrettierignoreLines.sync(projectRoot, { useCached })
      : [];

    const ignoreAndPackages = appendWorkspacesToIgnore(ignore);

    debug('virtual .prettierignore lines (+ appended): %O', ignoreAndPackages);

    packageJsonFiles.elsewhere = globSync(packageJsonGlob, {
      // ? Ignore "packages" and the relative path for every known package.json
      // ? file when populating packageJsonFiles.elsewhere
      ignore: appendPackageJsonFilesToIgnore(ignore),
      dot: true,
      absolute: true,
      nodir: true,
      cwd: projectRoot
    }) as AbsolutePath[];

    markdownFiles.inRoot = globSync(markdownGlob, {
      ignore: ignoreAndPackages,
      dot: true,
      absolute: true,
      nodir: true,
      cwd: projectRoot
    }) as AbsolutePath[];

    markdownFiles.inWorkspace = new Map(
      subRootPackagesArray.map((package_) => {
        const paths = globSync(markdownGlob, {
          ignore,
          dot: true,
          absolute: true,
          nodir: true,
          cwd: package_.root
        });

        return [package_.id, paths] as [string, AbsolutePath[]];
      })
    );

    typescriptSrcFiles.inRootSrc = globSync(typescriptSrcGlob, {
      ignore: ignoreAndPackages,
      dot: true,
      absolute: true,
      nodir: true,
      cwd: projectRoot
    }) as AbsolutePath[];

    typescriptSrcFiles.inWorkspaceSrc = new Map(
      subRootPackagesArray.map((package_) => {
        const paths = globSync(typescriptSrcGlob, {
          ignore,
          dot: true,
          absolute: true,
          nodir: true,
          cwd: package_.root
        });

        return [package_.id, paths] as [string, AbsolutePath[]];
      })
    );

    typescriptTestFiles.inRootTest = globSync(typescriptTestGlob, {
      ignore: ignoreAndPackages,
      dot: true,
      absolute: true,
      nodir: true,
      cwd: projectRoot
    }) as AbsolutePath[];

    typescriptTestFiles.inWorkspaceTest = new Map(
      subRootPackagesArray.map((package_) => {
        const paths = globSync(typescriptTestGlob, {
          ignore,
          dot: true,
          absolute: true,
          nodir: true,
          cwd: package_.root
        });

        return [package_.id, paths] as [string, AbsolutePath[]];
      })
    );

    finalize();
  }

  function initialize() {
    if (
      !ignoreUnsupportedFeatures &&
      (rootPackage.json.directories ||
        subRootPackagesArray.some(({ json: { directories } }) => directories))
    ) {
      throw new ProjectError(
        GraphErrorMessage.UnsupportedFeature('the package.json "directories" field')
      );
    }

    packageJsonFiles.atProjectRoot = toAbsolutePath(`${projectRoot}/package.json`);

    packageJsonFiles.atWorkspaceRoot = new Map(
      subRootPackagesArray.map((package_) => [
        package_.id,
        toAbsolutePath(`${package_.root}/package.json`)
      ])
    );

    packageJsonFiles.atAnyRoot = [packageJsonFiles.atProjectRoot].concat(
      Array.from(packageJsonFiles.atWorkspaceRoot.values())
    );
  }

  function finalize() {
    binFiles.atProjectRoot = resolveMainBinFile(rootPackage);

    binFiles.atWorkspaceRoot = new Map(
      subRootPackagesArray.map((package_) => [package_.id, resolveMainBinFile(package_)])
    );

    binFiles.atAnyRoot = [binFiles.atProjectRoot]
      .concat(Array.from(binFiles.atWorkspaceRoot.values()))
      .filter((v): v is NonNullable<typeof v> => !!v);

    markdownFiles.all = markdownFiles.inRoot.concat(
      Array.from(markdownFiles.inWorkspace.values()).flat()
    );

    typescriptSrcFiles.all = typescriptSrcFiles.inRootSrc.concat(
      Array.from(typescriptSrcFiles.inWorkspaceSrc.values()).flat()
    );

    typescriptTestFiles.all = typescriptTestFiles.inRootTest.concat(
      Array.from(typescriptTestFiles.inWorkspaceTest.values()).flat()
    );

    debug('project files: %O', projectFiles);

    memoizer.set<Memoization>(
      gatherProjectFiles_ as unknown as Memoization,
      [toSerializable(projectMetadata), cacheIdComponentsObject],
      projectFiles
    );
  }

  function resolveMainBinFile(package_: GenericPackage) {
    const { bin } = package_.json;
    const mainBin =
      typeof bin === 'string' ? bin : Object.values(bin ?? {}).find((path) => !!path);

    return mainBin ? toAbsolutePath(package_.root, mainBin) : undefined;
  }

  function appendWorkspacesToIgnore(ignore: string[]) {
    // ? Absolute paths in .git/.prettierignore are relative to project root
    return ignore.concat('/packages');
  }

  function appendPackageJsonFilesToIgnore(ignore: string[]) {
    // ? Absolute paths in .git/.prettierignore are relative to project root
    return ignore.concat(
      packageJsonFiles.atAnyRoot.map((path) => '/' + toRelativePath(projectRoot, path))
    );
  }
}

/**
 * Asynchronously construct a {@link ProjectFiles} instance containing absolute
 * file paths ({@link AbsolutePath}s) derived from `projectMetadata`.
 *
 * Note that **only named packages** are considered "packages" in monorepos.
 * Unnamed and broken packages/workspaces are ignored except when constructing
 * `packageJsonFiles.elsewhere`.
 *
 * **NOTE: the result of this function is memoized! This does NOT _necessarily_
 * mean results will strictly equal each other. See `useCached` in this specific
 * function's options for details.** To fetch fresh results, set the `useCached`
 * option to `false` or clear the internal cache with {@link cache.clear}.
 */
export function gatherProjectFiles(
  ...args: ParametersNoFirst<typeof gatherProjectFiles_>
) {
  return gatherProjectFiles_(false, ...args);
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace gatherProjectFiles {
  /**
   * Synchronously construct a {@link ProjectFiles} instance containing absolute
   * file paths ({@link AbsolutePath}s) derived from `projectMetadata`.
   *
   * Note that **only named packages** are considered "packages" in monorepos.
   * Unnamed and broken packages/workspaces are ignored except when constructing
   * `packageJsonFiles.elsewhere`.
   *
   * **NOTE: the result of this function is memoized! This does NOT
   * _necessarily_ mean results will strictly equal each other. See `useCached`
   * in this specific function's options for details.** To fetch fresh results,
   * set the `useCached` option to `false` or clear the internal cache with
   * {@link cache.clear}.
   */
  export const sync = function (
    projectMetadata: GenericProjectMetadata,
    options: Omit<GatherProjectFilesOptions, 'skipUnknown'>
  ): Awaited<ReturnType<typeof gatherProjectFiles>> {
    return gatherProjectFiles_(true, projectMetadata, options);
  };
}
