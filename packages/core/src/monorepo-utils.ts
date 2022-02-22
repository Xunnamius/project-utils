import { readFileSync as readFile } from 'fs';
import { dirname, basename } from 'path';
import findGitRoot from 'find-git-root';
import findPackageJson from 'find-package-json';
import mapWorkspaces from '@npmcli/map-workspaces';

import type { PackageJson } from 'type-fest';
import type { PackageWithPath } from 'find-package-json';

export class ContextError extends Error {}
export class NotAGitRepositoryError extends ContextError {}
export class PackageJsonNotFoundError extends ContextError {}
export class BadPackageJsonError extends ContextError {}

/**
 * An object representing a runtime context.
 */
export type RunContext = {
  /**
   * Whether `cwd` is contained by a monorepo or a polyrepo.
   */
  context: 'monorepo' | 'polyrepo';
  /**
   * Repository root package data.
   */
  project: {
    /**
     * The absolute path to the root of the project that contains `cwd`.
     */
    root: string;
    /**
     * The project root package.json file's contents.
     */
    json: PackageJson;
    /**
     * A mapping of package names to directory paths in a monorepo `context` or
     * `null` in a polyrepo `context`.
     */
    packages: Map<string, string> | null;
  };
  /**
   * Package root data in a monorepo `context`, or `null` in a polyrepo
   * `context`. When `cwd` is only contained by the project root in a monorepo
   * `context`, `package.id` will be `null`.
   */
  package: {
    /**
     * The package-id of the package whose root contains `cwd` or `null` if
     * `cwd` is only contained by the project root.
     */
    id: string | null;
    /**
     * The absolute path to the root of the project that contains `cwd`.
     */
    root: string;
    /**
     * The package.json contents of the package whose root contains `cwd`.
     */
    json: PackageWithPath;
  } | null;
};

export type MonorepoRunContext = RunContext & {
  context: 'monorepo';
  project: RunContext['project'] & {
    packages: NonNullable<RunContext['project']['packages']>;
  };
  package: NonNullable<RunContext['package']>;
};

export type PolyrepoRunContext = RunContext & {
  context: 'polyrepo';
  project: RunContext['project'] & { packages: null };
  package: null;
};

export function getRunContext({ cwd }: { cwd: string } = { cwd: process.cwd() }) {
  const repoRoot = (() => {
    try {
      return dirname(findGitRoot(cwd));
    } catch {
      throw new NotAGitRepositoryError('unable to locate git repository root');
    }
  })();

  const filePath = `${repoRoot}/package.json`;
  const rawJson = (() => {
    try {
      return readFile(filePath, 'utf-8');
    } catch (e) {
      throw new PackageJsonNotFoundError(`unable to load package.json: ${e}`);
    }
  })();

  const rootJson = (() => {
    try {
      return JSON.parse(rawJson) as PackageJson;
    } catch (e) {
      throw new BadPackageJsonError(`unable to parse ${filePath}: ${e}`);
    }
  })();

  const context = !!rootJson.workspaces ? 'monorepo' : 'polyrepo';
  const pkg = findPackageJson(cwd).next();
  const packageJson = pkg.value as PackageWithPath;
  const packageRoot = dirname(pkg.filename as string);
  const packages = mapWorkspaces({ cwd, pkg: rootJson });

  if (context == 'monorepo') {
    return {
      context,
      project: {
        root: repoRoot,
        json: rootJson,
        packages
      },
      package: {
        id: packageRoot == repoRoot ? null : basename(packageRoot),
        root: packageRoot,
        json: packageJson
      }
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
