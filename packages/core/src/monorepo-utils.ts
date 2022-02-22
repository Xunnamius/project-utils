import { readFileSync as readFile } from 'fs';
import { dirname, basename } from 'path';
import findGitRoot from 'find-git-root';
import findPackageJson from 'find-package-json';

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
  };
  /**
   * Package root data in a monorepo `context`, or `undefined` in a polyrepo
   * `context`. When `cwd` is only contained by the project root in a monorepo
   * `context`, `package.id` will be `null`.
   */
  package:
    | {
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
      }
    | undefined;
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

  const result = {
    context,
    project: {
      root: repoRoot,
      json: rootJson
    }
  } as RunContext;

  if (context == 'monorepo') {
    return {
      ...result,
      package: {
        id: packageRoot == repoRoot ? null : basename(packageRoot),
        root: packageRoot,
        json: packageJson
      }
    } as RunContext & {
      context: 'monorepo';
      package: NonNullable<RunContext['package']>;
    };
  } else {
    return {
      ...result,
      package: undefined
    } as RunContext & { context: 'polyrepo'; package: undefined };
  }
}
