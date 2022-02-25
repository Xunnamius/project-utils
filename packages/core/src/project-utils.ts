import { readFileSync as readFile } from 'fs';
import { dirname, basename } from 'path';
import { sync as globSync } from 'glob';
import { sync as findUp } from 'find-up';

import {
  BadPackageJsonError,
  DuplicatePackageIdError,
  DuplicatePackageNameError,
  NotAGitRepositoryError,
  NotAMonorepoError,
  PackageJsonNotFoundError
} from './errors';

import type { PackageJson } from 'type-fest';
import type { IOptions as GlobOptions } from 'glob';

const _packageJsonReadCache = new Map<string, PackageJson>();

export type WorkspacePackageName = string;
export type AbsolutePath = string;

/**
 * An object representing the root or "top-level" package in a monorepo or
 * polyrepo project.
 */
export type RootPackage = {
  /**
   * The absolute path to the root directory of the entire project.
   */
  root: string;
  /**
   * The contents of the root package's package.json file.
   */
  json: PackageJson;
  /**
   * A mapping of package names to WorkspacePackage objects in a monorepo or
   * `null` in a polyrepo.
   */
  packages:
    | (Map<WorkspacePackageName, WorkspacePackage> & {
        /**
         * A mapping of packages missing the `"name"` field in
         * their respective package.json files to WorkspacePackage objects.
         */
        unnamed: Map<WorkspacePackageName, WorkspacePackage>;
        /**
         * An array of "broken" pseudo-package directories that are matching
         * workspace paths but are missing a package.json file.
         */
        broken: AbsolutePath[];
      })
    | null;
};

/**
 * An object representing a package in a monorepo project.
 */
export type WorkspacePackage = {
  /**
   * The so-called "package-id" of the workspace package.
   */
  id: string;
  /**
   * The absolute path to the root directory of the package.
   */
  root: string;
  /**
   * The contents of the package's package.json file.
   */
  json: PackageJson;
};

/**
 * An object representing a runtime context.
 */
export type RunContext = {
  /**
   * Whether node is executing in a monorepo or a polyrepo context.
   */
  context: 'monorepo' | 'polyrepo';
  /**
   * Repository root package data.
   */
  project: RootPackage;
  /**
   * An object representing the current package (determined by cwd) in a
   * monorepo context, or `null` in a polyrepo context or when cwd is not within
   * any package root in a monorepo context.
   */
  package: WorkspacePackage | null;
};

/**
 * An object representing a monorepo runtime context.
 */
export type MonorepoRunContext = RunContext & {
  context: 'monorepo';
  project: RootPackage & {
    packages: NonNullable<RootPackage['packages']>;
  };
};

/**
 * An object representing a polyrepo runtime context.
 */
export type PolyrepoRunContext = RunContext & {
  context: 'polyrepo';
  project: RootPackage & { packages: null };
  package: null;
};

/**
 * Determine the package-id of a package from its root directory path.
 */
export function packageRootToId({
  packageRoot
}: {
  /**
   * The absolute path to the root directory of a package. Supplying a relative
   * path will lead to undefined behavior.
   */
  packageRoot: string;
}) {
  return basename(packageRoot);
}

/**
 * Clear the cache that memoizes the `readPackageJson` function results.
 * Primarily useful for testing purposes.
 */
export function clearPackageJsonCache() {
  _packageJsonReadCache.clear();
}

/**
 * Read in and parse the contents of a package.json file, memoizing the result.
 */
export function readPackageJson({
  packageRoot
}: {
  /**
   * The absolute path to the root directory of a package.
   * `${packageRoot}/package.json` must exist. Supplying a relative path will
   * lead to undefined behavior.
   */
  packageRoot: string;
}) {
  if (_packageJsonReadCache.has(packageRoot)) {
    return _packageJsonReadCache.get(packageRoot) as PackageJson;
  }

  const packageJsonPath = `${packageRoot}/package.json`;
  const rawJson = (() => {
    try {
      return readFile(packageJsonPath, 'utf-8');
    } catch (e) {
      throw new PackageJsonNotFoundError(e);
    }
  })();

  try {
    const json = JSON.parse(rawJson) as PackageJson;
    _packageJsonReadCache.set(packageRoot, json);
    return json;
  } catch (e) {
    throw new BadPackageJsonError(packageJsonPath, e);
  }
}

/**
 * Analyzes a monorepo context (at `cwd`), returning a mapping of package names
 * to workspace information.
 */
export function getWorkspacePackages(options: {
  /**
   * The absolute path to the root directory of a project. Supplying a relative
   * path will lead to undefined behavior.
   */
  projectRoot: string;
  /**
   * The current working directory as an absolute path. Supplying a relative
   * path or a path outside of `projectRoot` will lead to undefined behavior.
   *
   * @default process.cwd()
   */
  cwd?: string;
  /**
   * Options passed through to node-glob and minimatch.
   *
   * @default {}
   */
  globOptions?: GlobOptions;
}) {
  let {
    // eslint-disable-next-line prefer-const
    projectRoot,
    // eslint-disable-next-line prefer-const
    cwd = process.cwd(),
    globOptions = {}
  } = options;

  let workspaces = (() => {
    try {
      return readPackageJson({ packageRoot: projectRoot }).workspaces;
    } catch {
      return undefined;
    }
  })();

  workspaces = Array.isArray(workspaces)
    ? workspaces
    : Array.isArray(workspaces?.packages)
    ? workspaces?.packages
    : undefined;

  if (!workspaces) {
    throw new NotAMonorepoError();
  }

  globOptions = {
    ...globOptions,
    cwd: projectRoot,
    absolute: true,
    ignore: [...(globOptions.ignore || []), '**/node_modules/**']
  };

  const packages = new Map() as NonNullable<RootPackage['packages']>;
  packages.unnamed = new Map();
  packages.broken = [];

  for (let pattern of workspaces) {
    const excl = pattern.match(/^!+/);

    if (excl) {
      pattern = pattern.slice(excl[0].length);
    }

    // ? Normalize path separators
    pattern = pattern.replace(/\\/g, '/');

    // ? Strip off any / from the start of the pattern: /foo ==> foo
    pattern = pattern.replace(/^\/+/, '');

    // ? An odd number of ! means a negated pattern: !!foo ==> foo
    const negate = !!excl && excl[0].length % 2 === 1;

    // ? Ensure only directories are matched
    pattern = pattern.endsWith('/') ? pattern : `${pattern}/`;

    for (const packageRoot of globSync(pattern, globOptions)) {
      try {
        const workspacePackage = {
          id: packageRootToId({ packageRoot }),
          root: packageRoot,
          json: readPackageJson({ packageRoot })
        } as WorkspacePackage & { id: NonNullable<WorkspacePackage['id']> };

        if (negate) {
          workspacePackage.json.name
            ? packages.delete(workspacePackage.json.name)
            : packages.unnamed.delete(workspacePackage.id);
        } else {
          if (workspacePackage.json.name) {
            if (packages.has(workspacePackage.json.name)) {
              const pkg = packages.get(workspacePackage.json.name) as WorkspacePackage;
              if (pkg.root != workspacePackage.root) {
                throw new DuplicatePackageNameError(
                  workspacePackage.json.name,
                  pkg.root,
                  workspacePackage.root
                );
              }
            } else {
              packages.set(workspacePackage.json.name, workspacePackage);
            }
          } else {
            if (packages.unnamed.has(workspacePackage.id)) {
              const pkg = packages.unnamed.get(workspacePackage.id) as WorkspacePackage;
              /* istanbul ignore else */
              if (pkg.root != workspacePackage.root) {
                throw new DuplicatePackageIdError(
                  workspacePackage.id,
                  pkg.root,
                  workspacePackage.root
                );
              }
            } else {
              packages.unnamed.set(workspacePackage.id, workspacePackage);
            }
          }
        }
      } catch (e) {
        if (e instanceof PackageJsonNotFoundError) {
          packages.broken.push(packageRoot);
        } else {
          throw e;
        }
      }
    }
  }

  const cwdPackageRoot = dirname(findUp('package.json', { cwd }) as string);
  const cwdPackageName = readPackageJson({ packageRoot: cwdPackageRoot }).name;

  const cwdPackage =
    (cwdPackageName && packages.get(cwdPackageName)) ||
    packages.unnamed.get(packageRootToId({ packageRoot: cwdPackageRoot })) ||
    null;

  return { packages, cwdPackage };
}

/**
 * Returns information about the project structure at the current working
 * directory.
 */
export function getRunContext(
  options: {
    /**
     * The current working directory as an absolute path. Supplying a relative
     * path will lead to undefined behavior.
     *
     * @default process.cwd()
     */
    cwd?: string;
  } = {}
) {
  const { cwd = process.cwd() } = options;
  const repoRoot = (() => {
    try {
      return dirname(findUp('.git', { cwd, type: 'directory' }) as string);
    } catch {
      throw new NotAGitRepositoryError();
    }
  })();

  const rootJson = readPackageJson({ packageRoot: repoRoot });
  const context = !!rootJson.workspaces ? 'monorepo' : 'polyrepo';

  if (context == 'monorepo') {
    const { packages, cwdPackage } = getWorkspacePackages({ cwd, projectRoot: repoRoot });
    return {
      context,
      project: {
        root: repoRoot,
        json: rootJson,
        packages
      },
      package: cwdPackage
    } as MonorepoRunContext;
  } else {
    return {
      context,
      project: {
        root: repoRoot,
        json: rootJson,
        packages: null
      },
      package: null
    } as PolyrepoRunContext;
  }
}
