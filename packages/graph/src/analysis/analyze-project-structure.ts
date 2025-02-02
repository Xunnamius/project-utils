import assert from 'node:assert';

import {
  getCurrentWorkingDirectory,
  toAbsolutePath,
  toDirname,
  toPath,
  toRelativePath,
  type AbsolutePath,
  type RelativePath
} from '@-xun/fs';

import { memoizer } from '@-xun/memoize';

import {
  deriveVirtualGitignoreLines,
  isAccessible,
  readXPackageJsonAtRoot
} from '@-xun/project-fs';

import {
  ProjectAttribute,
  WorkspaceAttribute,
  type GenericPackage,
  type GenericPackageJson,
  type GenericProjectMetadata,
  type GenericRootPackage,
  type GenericWorkspacePackage,
  type PolyrepoMetadata,
  type ProjectMetadata,
  type RootPackage,
  type WorkspacePackage,
  type WorkspacePackageId
} from '@-xun/project-types';

import { sync as findUp } from 'find-up~5';

import {
  glob as globAsync,
  sync as globSync,
  type GlobGitignoreOptions
} from 'glob-gitignore';

import { toss } from 'toss-expression';

import {
  DuplicatePackageIdError,
  DuplicatePackageNameError,
  NotAGitRepositoryError,
  ProjectError
} from 'multiverse+common:error.ts';

import { packageRootToId } from 'universe+graph:analysis/package-root-to-id.ts';
import { commonDebug } from 'universe+graph:common.ts';

import {
  directorySrcPackageBase,
  nextjsConfigProjectBase,
  packageJsonConfigPackageBase,
  sharedAttributeFileBase,
  vercelConfigProjectBase,
  webpackConfigProjectBase
} from 'universe+graph:constant.ts';

import { GraphErrorMessage } from 'universe+graph:error.ts';

import type { Merge, PackageJson, Promisable } from 'type-fest';
import type { ParametersNoFirst } from 'multiverse+common:types.ts';

const debug = commonDebug.extend('getProjectMetadata');
const subrootDebug = debug.extend('subroot');
const vercelProjectMetadataPath = '.vercel/project.json' as RelativePath;

/**
 * @see {@link analyzeProjectStructure}
 */
export type AnalyzeProjectStructureOptions = {
  /**
   * The current working directory as an absolute path.
   *
   * @default process.cwd()
   */
  cwd?: AbsolutePath;
  /**
   * Allow unnamed packages in this project, which will result in looser and
   * less useful types being returned. Setting this to `true` is only useful
   * when analyzing projects that do not adhere to standard symbiote (or
   * NPM/Node) best practices.
   *
   * @default false
   */
  allowUnnamedPackages?: boolean;
  /**
   * Use the internal cached result from a previous run, if available.
   *
   * **WARNING: the results returned by this function, while functionally
   * identical to each other, will _NOT_ strictly equal (`===`) each other.**
   * However, each {@link Package} instance within the returned results _will_
   * strictly equal each other, respectively.
   *
   * @see {@link cache}
   */
  useCached: boolean;
};

function analyzeProjectStructure_(
  shouldRunSynchronously: boolean,
  {
    useCached,
    cwd = getCurrentWorkingDirectory(),
    allowUnnamedPackages = false,
    ...incompleteCacheIdComponentsObject
  }: AnalyzeProjectStructureOptions
): Promisable<GenericProjectMetadata> {
  const cacheIdComponentsObject = {
    ...incompleteCacheIdComponentsObject,
    cwd,
    allowUnnamedPackages
  };

  type Memoization = (
    ...args: [typeof cacheIdComponentsObject]
  ) => ReturnType<typeof analyzeProjectStructure_>;

  debug('cwd: %O', cwd);
  debug('allowUnnamedPackages: %O', allowUnnamedPackages);
  debug('shouldRunSynchronously: %O,', shouldRunSynchronously);

  return (shouldRunSynchronously ? runSynchronously : runAsynchronously)();

  async function runAsynchronously() {
    return Promise.resolve().then(async () => {
      const projectRoot = determineProjectRootFromCwd(cwd);
      debug('projectRoot: %O', projectRoot);

      if (useCached) {
        const cachedMetadata_ = memoizer.get<Memoization>(
          analyzeProjectStructure_ as unknown as Memoization,
          [cacheIdComponentsObject]
        );

        if (cachedMetadata_) {
          const cachedMetadata = {
            ...cachedMetadata_,
            cwdPackage: await determineCwdPackage(
              false,
              cwd,
              cachedMetadata_,
              useCached,
              allowUnnamedPackages
            )
          } satisfies GenericProjectMetadata;

          debug('reusing cached resources: %O', cachedMetadata);
          return cachedMetadata;
        }
      }

      const projectJson = await readXPackageJsonAtRoot(projectRoot, { useCached });

      const projectAttributes = await getProjectAttributes(
        false,
        projectRoot,
        projectJson,
        projectJson.workspaces ? ProjectAttribute.Monorepo : ProjectAttribute.Polyrepo,
        useCached
      );

      const rootPackage: GenericRootPackage = {
        root: projectRoot,
        json: projectJson,
        attributes: projectAttributes,
        // ? This is defined for real below
        projectMetadata: '<circular>' as unknown as ProjectMetadata
      };

      debug('rootPackage: %O', rootPackage);

      const finalMetadata: GenericProjectMetadata = {
        type: ProjectAttribute.Polyrepo,
        cwdPackage: rootPackage,
        rootPackage,
        subRootPackages: undefined
      } satisfies PolyrepoMetadata<GenericPackageJson>;

      rootPackage.projectMetadata = finalMetadata;

      if (projectAttributes[ProjectAttribute.Monorepo]) {
        await setSubrootPackagesAndCwdPackage(
          false,
          cwd,
          finalMetadata,
          useCached,
          allowUnnamedPackages
        );

        finalMetadata.type = ProjectAttribute.Monorepo;
      }

      finalize(finalMetadata);
      return finalMetadata;
    });
  }

  function runSynchronously() {
    const projectRoot = determineProjectRootFromCwd(cwd);
    debug('projectRoot: %O', projectRoot);

    if (useCached) {
      const cachedMetadata_ = memoizer.get<Memoization>(
        analyzeProjectStructure_ as unknown as Memoization,
        [cacheIdComponentsObject]
      );

      if (cachedMetadata_) {
        const cachedMetadata = {
          ...cachedMetadata_,
          cwdPackage: determineCwdPackage(
            true,
            cwd,
            cachedMetadata_,
            useCached,
            allowUnnamedPackages
          )
        } satisfies GenericProjectMetadata;

        debug('reusing cached resources: %O', cachedMetadata);
        return cachedMetadata;
      }
    }

    const projectJson = readXPackageJsonAtRoot.sync(projectRoot, { useCached });

    const projectAttributes = getProjectAttributes(
      true,
      projectRoot,
      projectJson,
      projectJson.workspaces ? ProjectAttribute.Monorepo : ProjectAttribute.Polyrepo,
      useCached
    );

    const rootPackage: GenericRootPackage = {
      root: projectRoot,
      json: projectJson,
      attributes: projectAttributes,
      // ? This is defined for real below
      projectMetadata: '<circular>' as unknown as ProjectMetadata
    };

    debug('rootPackage: %O', rootPackage);

    const finalMetadata: GenericProjectMetadata = {
      type: ProjectAttribute.Polyrepo,
      cwdPackage: rootPackage,
      rootPackage,
      subRootPackages: undefined
    } satisfies PolyrepoMetadata<GenericPackageJson>;

    rootPackage.projectMetadata = finalMetadata;

    if (projectAttributes[ProjectAttribute.Monorepo]) {
      setSubrootPackagesAndCwdPackage(
        true,
        cwd,
        finalMetadata,
        useCached,
        allowUnnamedPackages
      );

      finalMetadata.type = ProjectAttribute.Monorepo;
    }

    finalize(finalMetadata);
    return finalMetadata;
  }

  function finalize(projectMetadata: GenericProjectMetadata) {
    debug('project metadata: %O', projectMetadata);

    if (!allowUnnamedPackages) {
      debug('performing unnamed package check');

      assert(
        projectMetadata.cwdPackage.json.name,
        new ProjectError(
          GraphErrorMessage.MissingNameInPackageJson(
            'current package: ' +
              toPath(projectMetadata.cwdPackage.root, packageJsonConfigPackageBase)
          )
        )
      );

      assert(
        projectMetadata.rootPackage.json.name,
        new ProjectError(
          GraphErrorMessage.MissingNameInPackageJson(
            'root package: ' +
              toPath(projectMetadata.rootPackage.root, packageJsonConfigPackageBase)
          )
        )
      );

      projectMetadata.subRootPackages?.all.forEach(({ json, root }) => {
        assert(
          json.name,
          new ProjectError(
            GraphErrorMessage.MissingNameInPackageJson(
              toPath(root, packageJsonConfigPackageBase)
            )
          )
        );
      });
    }

    memoizer.set<Memoization>(
      analyzeProjectStructure_ as unknown as Memoization,
      [cacheIdComponentsObject],
      projectMetadata
    );
  }
}

/**
 * Asynchronously returns information about the structure of the project at the
 * current working directory.
 *
 * This function will throw upon encountering an unnamed repository.
 *
 * **NOTE: the result of this function is memoized! This does NOT _necessarily_
 * mean results will strictly equal each other. See `useCached` in this specific
 * function's options for details.** To fetch fresh results, set the `useCached`
 * option to `false` or clear the internal cache with {@link cache.clear}.
 */
export function analyzeProjectStructure(
  options: Merge<AnalyzeProjectStructureOptions, { allowUnnamedPackages?: false }>
): Promise<ProjectMetadata>;
/**
 * Asynchronously returns information about the structure of the project at the
 * current working directory.
 *
 * This function will NOT throw upon encountering an unnamed repository.
 *
 * **NOTE: the result of this function is memoized! This does NOT _necessarily_
 * mean results will strictly equal each other. See `useCached` in this specific
 * function's options for details.** To fetch fresh results, set the `useCached`
 * option to `false` or clear the internal cache with {@link cache.clear}.
 */
export function analyzeProjectStructure(
  options: Merge<AnalyzeProjectStructureOptions, { allowUnnamedPackages: true }>
): Promise<ProjectMetadata<PackageJson>>;
export function analyzeProjectStructure(
  ...args: ParametersNoFirst<typeof analyzeProjectStructure_>
) {
  return analyzeProjectStructure_(false, ...args);
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace analyzeProjectStructure {
  /**
   * Synchronously returns information about the structure of the project at the
   * current working directory.
   *
   * Depending on which overload of this function is used, an error may be
   * thrown upon encountering an unnamed repository.
   *
   * **NOTE: the result of this function is memoized! This does NOT
   * _necessarily_ mean results will strictly equal each other. See `useCached`
   * in this specific function's options for details.** To fetch fresh results,
   * set the `useCached` option to `false` or clear the internal cache with
   * {@link cache.clear}.
   */
  export const sync = syncAnalyzeProjectStructure;
}

function syncAnalyzeProjectStructure(
  options: Merge<AnalyzeProjectStructureOptions, { allowUnnamedPackages: true }>
): ProjectMetadata<PackageJson>;
function syncAnalyzeProjectStructure(
  options: Merge<AnalyzeProjectStructureOptions, { allowUnnamedPackages?: false }>
): ProjectMetadata;
function syncAnalyzeProjectStructure(
  ...args: ParametersNoFirst<typeof analyzeProjectStructure_>
) {
  return analyzeProjectStructure_(true, ...args);
}

function determineProjectRootFromCwd(cwd: AbsolutePath): AbsolutePath {
  try {
    return toDirname(toAbsolutePath(findUp('.git', { cwd, type: 'directory' })!));
  } catch {
    throw new NotAGitRepositoryError();
  }
}

function setSubrootPackagesAndCwdPackage(
  runSynchronously: false,
  cwd: AbsolutePath,
  projectMetadata: GenericProjectMetadata,
  useCached: boolean,
  allowUnnamedPackages: boolean
): Promise<void>;
function setSubrootPackagesAndCwdPackage(
  runSynchronously: true,
  cwd: AbsolutePath,
  projectMetadata: GenericProjectMetadata,
  useCached: boolean,
  allowUnnamedPackages: boolean
): void;
function setSubrootPackagesAndCwdPackage(
  runSynchronously: boolean,
  cwd: AbsolutePath,
  projectMetadata: GenericProjectMetadata,
  useCached: boolean,
  allowUnnamedPackages: boolean
): Promisable<void> {
  const projectRoot = projectMetadata.rootPackage.root;
  const { workspaces: workspaces_ } = projectMetadata.rootPackage.json;

  const workspaces = Array.isArray(workspaces_)
    ? workspaces_
    : Array.isArray(workspaces_?.packages)
      ? workspaces_.packages
      : undefined;

  assert(workspaces, GraphErrorMessage.NotAMonorepoError());

  const globOptions: GlobGitignoreOptions = {
    cwd: projectRoot,
    absolute: true,
    ignore: []
  };

  const subRootPackages = (projectMetadata.subRootPackages = new Map() as NonNullable<
    ProjectMetadata['subRootPackages']
  >);

  subRootPackages.unnamed = new Map();
  subRootPackages.broken = [];

  if (runSynchronously) {
    globOptions.ignore = deriveVirtualGitignoreLines.sync(projectRoot, { useCached });

    for (const pattern_ of workspaces) {
      const [pattern, negate] = normalizePattern(pattern_);

      for (const packageRoot of globSync(pattern, globOptions) as AbsolutePath[]) {
        assert(typeof packageRoot === 'string', GraphErrorMessage.GuruMeditation());

        // TODO: maybe be redundant given package.json workspaces negated glob
        if (packageRoot.endsWith('.ignore')) {
          subrootDebug.warn('encountered explicitly ignored package at %O', packageRoot);
          continue;
        }

        const packageJson = (() => {
          try {
            return readXPackageJsonAtRoot.sync(packageRoot, { useCached });
          } catch (error) {
            subrootDebug.warn(
              'encountered broken package at %O: %O',
              packageRoot,
              error
            );
            subRootPackages.broken.push(packageRoot);
            return undefined;
          }
        })();

        if (packageJson) {
          const attributes = getWorkspaceAttributes(
            true,
            packageRoot,
            packageJson,
            useCached
          );
          addWorkspacePackage({
            packageId: packageRootToId(packageRoot),
            attributes,
            negate,
            packageJson,
            packageRoot
          });
        }
      }
    }

    finalize(
      determineCwdPackage(true, cwd, projectMetadata, useCached, allowUnnamedPackages)
    );
  } else {
    return Promise.resolve().then(async () => {
      const workspacesAddFunctionsToCall: {
        patternIndex: number;
        fn: () => Promisable<void>;
      }[] = [];

      globOptions.ignore = await deriveVirtualGitignoreLines(projectRoot, {
        useCached,
        includeUnknownPaths: false
      });

      await Promise.all(
        workspaces.map(async (pattern_, patternIndex) => {
          const [pattern, negate] = normalizePattern(pattern_);

          return globAsync(pattern, globOptions).then((packageRoots_) => {
            const packageRoots = packageRoots_ as AbsolutePath[];
            return Promise.all(
              packageRoots.map(async (packageRoot) => {
                assert(
                  typeof packageRoot === 'string',
                  GraphErrorMessage.GuruMeditation()
                );

                // TODO: maybe redundant w/ package.json workspaces negated glob
                if (packageRoot.endsWith('.ignore')) {
                  subrootDebug.warn(
                    'encountered explicitly ignored package at %O',
                    packageRoot
                  );
                  return undefined;
                }

                const packageJson = await (async () => {
                  try {
                    return await readXPackageJsonAtRoot(packageRoot, { useCached });
                  } catch (error) {
                    subrootDebug.warn(
                      'encountered broken package at %O: %O',
                      packageRoot,
                      error
                    );
                    subRootPackages.broken.push(packageRoot);
                    return undefined;
                  }
                })();

                if (packageJson) {
                  const attributes = await getWorkspaceAttributes(
                    false,
                    packageRoot,
                    packageJson,
                    useCached
                  );

                  // ? Negation relies on addWorkspacePackage being called in ?
                  // a specific order, so we need to preserve that order. ?
                  // We'll execute these functions in a synchronization step ?
                  // later.
                  workspacesAddFunctionsToCall.push({
                    patternIndex,
                    fn: async () =>
                      addWorkspacePackage({
                        packageId: packageRootToId(packageRoot),
                        attributes,
                        negate,
                        packageJson,
                        packageRoot
                      })
                  });
                }
              })
            );
          });
        })
      );

      for (const { fn } of workspacesAddFunctionsToCall.sort(
        ({ patternIndex: indexA }, { patternIndex: indexB }) =>
          indexA === indexB ? 0 : indexA < indexB ? -1 : 1
      )) {
        // ? These need to be executed in order due to negations (see
        // ? addWorkspacePackage).
        // eslint-disable-next-line no-await-in-loop
        await fn();
      }

      finalize(
        await determineCwdPackage(
          false,
          cwd,
          projectMetadata,
          useCached,
          allowUnnamedPackages
        )
      );
    });
  }

  function finalize(cwdPackage: GenericPackage) {
    // ? Sugar property for getting *all* of a project's packages
    Object.defineProperty(subRootPackages, 'all', {
      configurable: false,
      enumerable: false,
      get: () => {
        return Array.from<GenericWorkspacePackage>(subRootPackages.values()).concat(
          Array.from(subRootPackages.unnamed.values())
        );
      }
    });

    const seenPackages = new Map<WorkspacePackageId, AbsolutePath>();

    // ? Ensure no duplicate package-ids across named and unnamed workspaces.
    subRootPackages.all.forEach(({ id, root }) => {
      if (seenPackages.has(id)) {
        throw new DuplicatePackageIdError(id, root, seenPackages.get(id)!);
      } else {
        seenPackages.set(id, root);
      }
    });

    // ? Set cwdPackage in projectMetadata
    projectMetadata.cwdPackage = cwdPackage;
  }

  function addWorkspacePackage({
    attributes,
    packageRoot,
    packageId,
    packageJson,
    negate
  }: {
    attributes: WorkspacePackage['attributes'];
    packageRoot: AbsolutePath;
    packageId: string;
    packageJson: GenericPackageJson;
    negate: boolean;
  }): Promisable<void> {
    const workspacePackage = {
      id: packageId,
      root: packageRoot,
      relativeRoot: toRelativePath(projectRoot, packageRoot),
      projectMetadata,
      json: packageJson,
      attributes
    } satisfies GenericWorkspacePackage;

    if (negate) {
      debug('package "%O" analysis result: negated and removed', packageId);

      if (workspacePackage.json.name) {
        subRootPackages.delete(workspacePackage.json.name);
      } else {
        subRootPackages.unnamed.delete(workspacePackage.id);
      }
    } else {
      debug('package "%O" analysis result: added (unless validation fails)', packageId);

      if (workspacePackage.json.name) {
        if (subRootPackages.has(workspacePackage.json.name)) {
          const subrootPackage = subRootPackages.get(workspacePackage.json.name)!;
          if (subrootPackage.root !== workspacePackage.root) {
            throw new DuplicatePackageNameError(
              workspacePackage.json.name,
              subrootPackage.root,
              workspacePackage.root
            );
          }
        } else {
          subRootPackages.set(
            workspacePackage.json.name,
            workspacePackage as WorkspacePackage
          );
        }
      } else {
        if (subRootPackages.unnamed.has(workspacePackage.id)) {
          const subrootPackage = subRootPackages.unnamed.get(workspacePackage.id)!;
          /* istanbul ignore else */
          if (subrootPackage.root !== workspacePackage.root) {
            throw new DuplicatePackageIdError(
              workspacePackage.id,
              subrootPackage.root,
              workspacePackage.root
            );
          }
        } else {
          subRootPackages.unnamed.set(
            workspacePackage.id,
            workspacePackage as WorkspacePackage<PackageJson>
          );
        }
      }
    }
  }
}

function determineCwdPackage(
  runSynchronously: false,
  cwd: AbsolutePath,
  projectMetadata: GenericProjectMetadata,
  useCached: boolean,
  allowUnnamedPackages: boolean
): Promise<GenericPackage>;
function determineCwdPackage(
  runSynchronously: true,
  cwd: AbsolutePath,
  projectMetadata: GenericProjectMetadata,
  useCached: boolean,
  allowUnnamedPackages: boolean
): GenericPackage;
function determineCwdPackage(
  runSynchronously: boolean,
  cwd: AbsolutePath,
  projectMetadata: GenericProjectMetadata,
  useCached: boolean,
  allowUnnamedPackages: boolean
): Promisable<GenericPackage> {
  const { subRootPackages, rootPackage } = projectMetadata;
  const { root: projectRoot } = rootPackage;

  if (!subRootPackages) {
    return runSynchronously ? rootPackage : Promise.resolve(rootPackage);
  }

  // ? At least the root package.json is guaranteed to exist at this point.
  const cwdPackageRoot = toDirname(toAbsolutePath(findUp('package.json', { cwd })!));

  if (cwdPackageRoot === projectRoot) {
    return runSynchronously ? rootPackage : Promise.resolve(rootPackage);
  } else {
    let cwdPackage: GenericPackage = rootPackage;

    if (runSynchronously) {
      const cwdPackageName = readXPackageJsonAtRoot.sync(cwdPackageRoot, {
        useCached
      }).name;

      finalize(cwdPackageName, packageRootToId(cwdPackageRoot));
      return cwdPackage;
    } else {
      return readXPackageJsonAtRoot(cwdPackageRoot, { useCached }).then(
        async ({ name: cwdPackageName }) => {
          finalize(cwdPackageName, packageRootToId(cwdPackageRoot));
          return cwdPackage;
        }
      );
    }

    function finalize(cwdPackageName: string | undefined, packageId: string) {
      cwdPackage =
        (cwdPackageName ? subRootPackages?.get(cwdPackageName) : undefined) ||
        (allowUnnamedPackages && subRootPackages?.unnamed.get(packageId)) ||
        toss(new ProjectError(GraphErrorMessage.GuruMeditation()));
    }
  }
}

function getProjectAttributes(
  runSynchronously: false,
  root: AbsolutePath,
  projectJson: GenericPackageJson,
  repoType: ProjectAttribute.Monorepo | ProjectAttribute.Polyrepo,
  useCached: boolean
): Promise<RootPackage['attributes']>;
function getProjectAttributes(
  runSynchronously: true,
  root: AbsolutePath,
  projectJson: GenericPackageJson,
  repoType: ProjectAttribute.Monorepo | ProjectAttribute.Polyrepo,
  useCached: boolean
): RootPackage['attributes'];
function getProjectAttributes(
  runSynchronously: boolean,
  root: AbsolutePath,
  projectJson: GenericPackageJson,
  repoType: ProjectAttribute.Monorepo | ProjectAttribute.Polyrepo,
  useCached: boolean
): Promisable<RootPackage['attributes']> {
  const attributes: RootPackage['attributes'] = { [repoType]: true };

  const {
    type = 'commonjs',
    bin,
    private: private_,
    scripts: { 'build:dist': buildScript = '' } = {}
  } = projectJson;

  if (runSynchronously) {
    if (
      isAccessibleFromRoot(
        true,
        toRelativePath(nextjsConfigProjectBase),
        root,
        useCached
      )
    ) {
      attributes[ProjectAttribute.Next] = true;
    }

    if (
      isAccessibleFromRoot(
        true,
        toRelativePath(webpackConfigProjectBase),
        root,
        useCached
      )
    ) {
      attributes[ProjectAttribute.Webpack] = true;
    }

    if (
      repoType === ProjectAttribute.Monorepo &&
      isAccessibleFromRoot(
        true,
        toRelativePath(directorySrcPackageBase),
        root,
        useCached
      )
    ) {
      attributes[ProjectAttribute.Hybridrepo] = true;
    }

    if (
      isAccessibleFromRoot(
        true,
        toRelativePath(vercelConfigProjectBase),
        root,
        useCached
      ) ||
      isAccessibleFromRoot(true, vercelProjectMetadataPath, root, useCached)
    ) {
      attributes[ProjectAttribute.Vercel] = true;
    }

    finalize();

    return attributes;
  } else {
    return Promise.resolve().then(async () => {
      const [hasNext, hasWebpack, isHybridrepo, hasVercel] = await Promise.all([
        isAccessibleFromRoot(
          false,
          toRelativePath(nextjsConfigProjectBase),
          root,
          useCached
        ),
        isAccessibleFromRoot(
          false,
          toRelativePath(webpackConfigProjectBase),
          root,
          useCached
        ),
        isAccessibleFromRoot(
          false,
          toRelativePath(directorySrcPackageBase),
          root,
          useCached
        ),
        isAccessibleFromRoot(
          false,
          toRelativePath(vercelConfigProjectBase),
          root,
          useCached
        ).then(async (result) => {
          return (
            result ||
            isAccessibleFromRoot(false, vercelProjectMetadataPath, root, useCached)
          );
        })
      ]);

      if (hasNext) {
        attributes[ProjectAttribute.Next] = true;
      }

      if (hasWebpack) {
        attributes[ProjectAttribute.Webpack] = true;
      }

      if (repoType === ProjectAttribute.Monorepo && isHybridrepo) {
        attributes[ProjectAttribute.Hybridrepo] = true;
      }

      if (hasVercel) {
        attributes[ProjectAttribute.Vercel] = true;
      }

      finalize();

      return attributes;
    });
  }

  function finalize() {
    if (!['module', 'commonjs'].includes(type)) {
      throw new ProjectError(
        GraphErrorMessage.BadProjectTypeInPackageJson(
          toPath(root, packageJsonConfigPackageBase)
        )
      );
    }

    if (
      (buildScript.includes('--multiversal') ||
        buildScript.includes('--not-multiversal=false')) &&
      !buildScript.includes('--multiversal=false')
    ) {
      attributes[WorkspaceAttribute.Multiversal] = true;
    }

    if (type === 'module') {
      attributes[ProjectAttribute.Esm] = true;
    }

    if (type === 'commonjs') {
      attributes[ProjectAttribute.Cjs] = true;
    }

    if (bin) {
      attributes[ProjectAttribute.Cli] = true;
    }

    if (private_) {
      attributes[ProjectAttribute.Private] = true;
    }

    if (attributes[ProjectAttribute.Cli] && attributes[ProjectAttribute.Next]) {
      throw new ProjectError(GraphErrorMessage.CannotBeCliAndNextJs());
    }
  }
}

function getWorkspaceAttributes(
  runSynchronously: false,
  root: AbsolutePath,
  workspaceJson: GenericPackageJson,
  useCached: boolean
): Promise<WorkspacePackage['attributes']>;
function getWorkspaceAttributes(
  runSynchronously: true,
  root: AbsolutePath,
  workspaceJson: GenericPackageJson,
  useCached: boolean
): WorkspacePackage['attributes'];
function getWorkspaceAttributes(
  runSynchronously: boolean,
  root: AbsolutePath,
  workspaceJson: GenericPackageJson,
  useCached: boolean
): Promisable<WorkspacePackage['attributes']> {
  const attributes: WorkspacePackage['attributes'] = {};
  const {
    type = 'commonjs',
    bin,
    private: private_,
    scripts: { 'build:dist': buildScript = '' } = {}
  } = workspaceJson;

  if (!['module', 'commonjs'].includes(type)) {
    throw new ProjectError(
      GraphErrorMessage.BadProjectTypeInPackageJson(
        toPath(root, packageJsonConfigPackageBase)
      )
    );
  }

  if (
    (buildScript.includes('--multiversal') ||
      buildScript.includes('--not-multiversal=false')) &&
    !buildScript.includes('--multiversal=false')
  ) {
    attributes[WorkspaceAttribute.Multiversal] = true;
  }

  if (type === 'module') {
    attributes[WorkspaceAttribute.Esm] = true;
  }

  if (type === 'commonjs') {
    attributes[WorkspaceAttribute.Cjs] = true;
  }

  if (bin) {
    attributes[WorkspaceAttribute.Cli] = true;
  }

  if (private_) {
    attributes[WorkspaceAttribute.Private] = true;
  }

  if (runSynchronously) {
    if (
      isAccessibleFromRoot(
        true,
        toRelativePath(webpackConfigProjectBase),
        root,
        useCached
      )
    ) {
      attributes[WorkspaceAttribute.Webpack] = true;
    }

    if (
      isAccessibleFromRoot(
        true,
        toRelativePath(sharedAttributeFileBase),
        root,
        useCached
      )
    ) {
      attributes[WorkspaceAttribute.Shared] = true;
    }

    return attributes;
  } else {
    return Promise.resolve().then(async () => {
      if (
        await isAccessibleFromRoot(
          false,
          toRelativePath(webpackConfigProjectBase),
          root,
          useCached
        )
      ) {
        attributes[WorkspaceAttribute.Webpack] = true;
      }

      if (
        await isAccessibleFromRoot(
          false,
          toRelativePath(sharedAttributeFileBase),
          root,
          useCached
        )
      ) {
        attributes[WorkspaceAttribute.Shared] = true;
      }

      return attributes;
    });
  }
}

function isAccessibleFromRoot(
  runSynchronously: false,
  path: RelativePath,
  root: AbsolutePath,
  useCached: boolean
): Promise<boolean>;
function isAccessibleFromRoot(
  runSynchronously: true,
  path: RelativePath,
  root: AbsolutePath,
  useCached: boolean
): boolean;
function isAccessibleFromRoot(
  runSynchronously: boolean,
  path: RelativePath,
  root: AbsolutePath,
  useCached: boolean
): Promisable<boolean> {
  return (runSynchronously ? isAccessible.sync : isAccessible)(toPath(root, path), {
    useCached
  });
}

function normalizePattern(pattern: string) {
  const excl = pattern.match(/^!+/);

  if (excl) {
    // ? Remove exclamation points prefix from pattern: !!!foo ==> foo
    pattern = pattern.slice(excl[0].length);
  }

  // TODO: hoist the negation logic up to @-xun/glob-gitignore; note in the
  // TODO: documentation that negations only apply to the glob paths that
  // TODO: came before it and the later globs can re-add previously ignored
  // TODO: entries. ? Is hoisting this necessary or is this once-off
  // TODO: functionality?

  // * This pattern sanitization logic comes from @npmcli/map-workspaces

  // ? Normalize path separators (not like backslashes should be in globs...)
  pattern = pattern.replaceAll('\\', '/');

  // ? Strip off any / from the start of the pattern: /foo ==> foo
  pattern = pattern.replace(/^\/+/, '');

  // ? An odd number of ! removed means a negated pattern: !!foo ==> foo
  const negate = !!excl && excl[0].length % 2 === 1;

  // ? Ensure only directories are matched
  pattern = pattern.endsWith('/') ? pattern : `${pattern}/`;

  return [pattern, negate] as const;
}
