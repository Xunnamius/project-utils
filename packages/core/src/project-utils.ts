import { readFileSync as readFile } from 'node:fs';
import { dirname, basename } from 'node:path';
import { sync as globSync } from 'glob';
import { sync as findUp } from 'find-up';

import { ensurePathIsAbsolute } from 'pkgverse/core/src/helpers';

import {
  BadPackageJsonError,
  DuplicatePackageIdError,
  DuplicatePackageNameError,
  NotAGitRepositoryError,
  NotAMonorepoError,
  PackageJsonNotFoundError
} from 'pkgverse/core/src/errors';

import type { PackageJson } from 'type-fest';
import type { PackageJsonWithConfig } from 'types/global';
import type { IOptions as GlobOptions } from 'glob';

const _packageJsonReadCache = new Map<string, PackageJsonWithConfig>();

export type WorkspacePackageName = string;
export type WorkspacePackageId = string;
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
   * The contents of the root package.json file.
   */
  json: PackageJsonWithConfig;
  /**
   * A mapping of sub-root package names to WorkspacePackage objects in a
   * monorepo or `null` in a polyrepo.
   */
  packages:
    | (Map<WorkspacePackageName, WorkspacePackage> & {
        /**
         * A mapping of sub-root packages missing the `"name"` field in their
         * respective package.json files to WorkspacePackage objects.
         */
        unnamed: Map<WorkspacePackageId, WorkspacePackage>;
        /**
         * An array of "broken" pseudo-sub-root pseudo-package directories that
         * are matching workspace paths but are missing a package.json file.
         */
        broken: AbsolutePath[];
        /**
         * An array of *all* non-broken sub-root packages both named and
         * unnamed. Sugar for the following:
         *
         * ```TypeScript
         * Array.from(packages.values())
         *      .concat(Array.from(packages.unnamed.values()))
         * ```
         */
        all: WorkspacePackage[];
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
  json: PackageJsonWithConfig;
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
   * An object representing the current sub-root (determined by cwd) in a
   * monorepo context, or `null` if in a polyrepo context or when cwd is not
   * within any sub-root in a monorepo context.
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
 * A single flattened subpath in a `package.json` `exports`/`imports` map along
 * with its target, matchable conditions, and other metadata. One or more
 * subpath mappings together form an imports/exports "entry point" or
 * "specifier".
 */
export type SubpathMapping = {
  /**
   * The subpath that maps to `target`, e.g.:
   *
   * @example
   * ```json
   * {
   *   "exports": {
   *     "subpath": "target"
   *   }
   * }
   * ```
   *
   * If `isSugared` is `true`, `subpath` is
   * [sugared](https://nodejs.org/api/packages.html#exports-sugar) and thus does
   * not exist as property in the actual `package.json` file. `subpath`, if it
   * contains at most one asterisk ("*"), becomes a [subpath
   * pattern](https://nodejs.org/docs/latest-v19.x/api/packages.html#subpath-patterns).
   */
  subpath: string;
  /**
   * The path to a target file that maps to `subpath`, e.g.:
   *
   * @example
   * ```json
   * {
   *   "exports": {
   *     "subpath": "target"
   *   }
   * }
   * ```
   *
   * Target may also contain one or more asterisks ("*") only if `subpath` is a
   * [subpath
   * pattern](https://nodejs.org/docs/latest-v19.x/api/packages.html#subpath-patterns).
   */
  target: string | null;
  /**
   * The combination of resolution conditions that, when matched, result in
   * `subpath` resolving to `target`. Conditions are listed in the order they
   * are encountered in the map object.
   *
   * Note that the "default" condition, while present in `conditions`, may not
   * actually exist in the actual `package.json` file.
   */
  conditions: PackageJson.ExportCondition[];
  /**
   * When the subpath mapping is a "default" mapping that occurs after one or
   * more sibling conditions, it cannot be selected if one of those siblings is
   * selected first. This property contains those sibling conditions that, if
   * present, mean this subpath mapping should not be considered.
   *
   * Useful when reverse-mapping targets to subpaths.
   *
   * @example
   * ```jsonc
   * {
   *   "./strange-subpath": {
   *     "default": {
   *       "import": "./import.js",
   *       "node": "./node.js",
   *       "default": "./default.js" // <- Never chosen if "import" is specified
   *     }
   *   }
   * }
   * ```
   */
  excludedConditions: PackageJson.ExportCondition[];
  /**
   * If `true`, the value of `subpath` was inferred but no corresponding
   * property exists in the actual `package.json` file.
   *
   * @example
   * ```json
   * {
   *   "name": "my-package",
   *   "exports": "./is-sugared.js"
   * }
   * ```
   *
   * In the above example, `subpath` would be `"."` even though it does not
   * exist in the actual `package.json` file.
   *
   * @see https://nodejs.org/api/packages.html#exports-sugar
   */
  isSugared: boolean;
  /**
   * If `true`, `target` is a so-called "fallback target". This means either (1)
   * `target` is a member of a fallback array or (2) the parent or ancestor
   * object containing `target` is a member of a fallback array. For example:
   *
   * @example
   * ```json
   * {
   *   "name": "my-package",
   *   "exports": [
   *     "./target-is-fallback-1.js",
   *     {
   *       "require": "./target-is-fallback-2.js",
   *       "default": "./target-is-fallback-3.js"
   *     }
   *   ]
   * }
   * ```
   *
   * Note that, due to how fallback arrays work, a fallback `target` may not be
   * reachable in any environment or under any circumstances ever even if all
   * the conditions match; multiple fallback `target`s might even overlap in
   * strange ways that are hard to reason about. [Node.js also ignores all but
   * the first valid defined non-null fallback
   * target](https://github.com/nodejs/node/blob/a9cdeeda880a56de6dad10b24b3bfa45e2cccb5d/lib/internal/modules/esm/resolve.js#L417-L432).
   *
   * **It is for these reasons that fallback arrays should be avoided entirely
   * in `package.json` files,** especially any sort of complex nested fallback
   * configurations. They're really only useful for consumption by build tools
   * like Webpack or TypeScript, and even then their utility is limited.
   */
  isFallback: boolean;
  /**
   * When `isFallback` is true, `isFistNonNullFallback` will be `true` if
   * `target` is the first non-`null` member in the flattened fallback array.
   */
  isFirstNonNullFallback: boolean;
  /**
   * When `isFallback` is true, `isLastFallback` will be `true` if `target` is
   * the last member in the flattened fallback array regardless of value of
   * `target`.
   */
  isLastFallback: boolean;
  /**
   * If `true`, this condition is guaranteed to be impossible to reach, likely
   * because it occurs after the "default" condition.
   */
  isDeadCondition: boolean;
};

/**
 * A flat array of subpath-target mappings enumerating all potential
 * `exports`/`imports` entry points within a `package.json` file.
 */
export type SubpathMappings = SubpathMapping[];

/**
 * Determine the package-id of a package in a monorepo from the path to the
 * package's root directory.
 */
export function packageRootToId({
  root
}: {
  /**
   * The absolute path to the root directory of a package in a monorepo.
   */
  root: string;
}) {
  ensurePathIsAbsolute({ path: root });
  return basename(root);
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
  root
}: {
  /**
   * The absolute path to the root directory of a package.
   * `${root}/package.json` must exist.
   */
  root: string;
}) {
  ensurePathIsAbsolute({ path: root });

  if (_packageJsonReadCache.has(root)) {
    return _packageJsonReadCache.get(root) as PackageJsonWithConfig;
  }

  const packageJsonPath = `${root}/package.json`;
  const rawJson = (() => {
    try {
      return readFile(packageJsonPath, 'utf8');
    } catch (error) {
      throw new PackageJsonNotFoundError(error);
    }
  })();

  try {
    const json = JSON.parse(rawJson) as PackageJsonWithConfig;
    _packageJsonReadCache.set(root, json);
    return json;
  } catch (error) {
    throw new BadPackageJsonError(packageJsonPath, error);
  }
}

/**
 * Analyzes a monorepo context (at `cwd`), returning a mapping of package names
 * to workspace information.
 */
export function getWorkspacePackages(options: {
  /**
   * The absolute path to the root directory of a project.
   */
  projectRoot: string;
  /**
   * The current working directory as an absolute path.
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

  ensurePathIsAbsolute({ path: projectRoot });
  ensurePathIsAbsolute({ path: cwd });

  let workspaces = (() => {
    try {
      return readPackageJson({ root: projectRoot }).workspaces;
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
    pattern = pattern.replaceAll('\\', '/');

    // ? Strip off any / from the start of the pattern: /foo ==> foo
    pattern = pattern.replace(/^\/+/, '');

    // ? An odd number of ! means a negated pattern: !!foo ==> foo
    const negate = !!excl && excl[0].length % 2 === 1;

    // ? Ensure only directories are matched
    pattern = pattern.endsWith('/') ? pattern : `${pattern}/`;

    for (const root of globSync(pattern, globOptions)) {
      try {
        const workspacePackage = {
          id: packageRootToId({ root }),
          root,
          json: readPackageJson({ root })
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
      } catch (error) {
        if (error instanceof PackageJsonNotFoundError) {
          packages.broken.push(root);
        } else {
          throw error;
        }
      }
    }
  }

  // ? Sugar property for getting *all* of a project's packages
  Object.defineProperty(packages, 'all', {
    configurable: false,
    enumerable: false,
    get: () => {
      return Array.from(packages.values()).concat(Array.from(packages.unnamed.values()));
    }
  });

  const cwdPackageRoot = dirname(findUp('package.json', { cwd }) as string);
  const cwdPackageName = readPackageJson({ root: cwdPackageRoot }).name;

  const cwdPackage =
    (cwdPackageRoot != projectRoot &&
      ((cwdPackageName && packages.get(cwdPackageName)) ||
        packages.unnamed.get(packageRootToId({ root: cwdPackageRoot })))) ||
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
     * The current working directory as an absolute path.
     *
     * @default process.cwd()
     */
    cwd?: string;
  } = {}
) {
  const { cwd = process.cwd() } = options;

  ensurePathIsAbsolute({ path: cwd });

  const repoRoot = (() => {
    try {
      return dirname(findUp('.git', { cwd, type: 'directory' }) as string);
    } catch {
      throw new NotAGitRepositoryError();
    }
  })();

  const rootJson = readPackageJson({ root: repoRoot });
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

/**
 * Flatten entry points within a `package.json` `imports`/`exports` map into a
 * one dimensional array of subpath-target mappings.
 */
export function flattenPackageJsonSubpathMap({
  map
}: {
  map: PackageJsonWithConfig['exports'] | PackageJsonWithConfig['imports'];
}): SubpathMappings {
  return map === undefined
    ? []
    : _flattenPackageJsonSubpathMap(map, undefined, [], false, undefined, [], false);
}

function _flattenPackageJsonSubpathMap(
  map: Parameters<typeof flattenPackageJsonSubpathMap>[0]['map'],
  subpath: string | undefined,
  conditions: string[],
  isFallback: boolean,
  isNotSugared: boolean | undefined,
  excludedConditions: string[],
  isDeadCondition: boolean
): SubpathMappings {
  const isSugared =
    isNotSugared === undefined
      ? map === null || Array.isArray(map) || typeof map == 'string'
      : !isNotSugared;

  const partial: Readonly<Omit<SubpathMapping, 'target'>> = {
    subpath: subpath ?? '.',
    conditions: conditions.length ? Array.from(new Set(conditions)) : ['default'],
    excludedConditions,
    isSugared,
    isFallback,
    isFirstNonNullFallback: false,
    isLastFallback: false,
    isDeadCondition
  };

  if (!map || typeof map == 'string') {
    return [{ target: map ?? null, ...partial }];
  } else if (Array.isArray(map)) {
    const mappings = map.flatMap((value) => {
      return typeof value == 'string'
        ? [{ target: value, ...partial, isFallback: true }]
        : _flattenPackageJsonSubpathMap(
            value,
            subpath,
            partial.conditions,
            true,
            !isSugared,
            excludedConditions,
            isDeadCondition
          );
    });

    if (!isFallback && mappings.length) {
      mappings.at(-1)!.isLastFallback = true;
      const firstNonNullMapping = mappings.find((mapping) => mapping.target !== null);
      if (firstNonNullMapping) {
        firstNonNullMapping.isFirstNonNullFallback = true;
      }
    }

    return mappings;
  } else {
    const keys = Object.keys(map);
    const indexOfDefaultCondition = keys.indexOf('default');
    const preDefaultKeys =
      indexOfDefaultCondition !== -1 ? keys.slice(0, indexOfDefaultCondition) : [];

    return Object.entries(map).flatMap(([key, value], index) => {
      const excludeConditions = [
        ...excludedConditions,
        ...(key === 'default' ? preDefaultKeys : [])
      ];

      const isDead = indexOfDefaultCondition !== -1 && indexOfDefaultCondition < index;

      return subpath === undefined && !isFallback
        ? _flattenPackageJsonSubpathMap(
            value,
            key,
            conditions,
            isFallback,
            !isSugared,
            excludeConditions,
            isDead
          )
        : _flattenPackageJsonSubpathMap(
            value,
            partial.subpath,
            [...conditions, key],
            isFallback,
            !isSugared,
            excludeConditions,
            isDead
          );
    });
  }
}
