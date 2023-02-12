import { join as joinPath } from 'node:path';
import { isNativeError } from 'node:util/types';
import { PackageJson } from 'type-fest';
import { TrialError } from 'named-app-errors';
import { resolve as resolverLibrary } from 'resolve.exports';

import { run } from 'multiverse/run';

const DUMMY_PKG_DIR = joinPath(__dirname, '..', 'fixtures', 'dummy-pkg');

export const availableDummyPackages = [
  'root',
  'simple',
  'complex',
  'sugared',
  'unlimited',
  'defaults'
] as const;

export type AvailableDummyPackages = (typeof availableDummyPackages)[number];

/**
 * Represents the dummy package metadata returned by the `getDummyPackage`
 * function.
 */
export type DummyPackageMetadata<
  RequireObjectImports extends boolean = false,
  RequireObjectExports extends boolean = false
> = {
  path: string;
  name: string;
  packageJson: PackageJson;

  imports: RequireObjectImports extends true
    ? Exclude<PackageJson.Imports, string | undefined | null | unknown[]>
    : PackageJson.Imports | undefined;

  exports: RequireObjectExports extends true
    ? Exclude<PackageJson.Exports, string | undefined | null | unknown[]>
    : PackageJson.Exports | undefined;
};

/**
 * Represents the summary of an import resolution attempt.
 */
export type ResolvedSummary = {
  resolvedTarget: string | null;
  resolverSubpath: string;
  isExportedTypescriptType: boolean;
};

/**
 * Return metadata about an available dummy package.
 */
export function getDummyPackage<
  RequireObjectImports extends boolean = false,
  RequireObjectExports extends boolean = false
>(
  id: AvailableDummyPackages,
  options?: {
    /**
     * If `true`, `imports` must be an object and not `null`, `undefined`,
     * `string`, or an array.
     *
     * @default false
     */
    requireObjectImports?: RequireObjectImports;
    /**
     * If `true`, `exports` must be an object and not `null`, `undefined`,
     * `string`, or an array.
     *
     * @default false
     */
    requireObjectExports?: RequireObjectExports;
  }
): DummyPackageMetadata<RequireObjectImports, RequireObjectExports> {
  const { requireObjectImports, requireObjectExports } = options || {};

  const pkg = {
    path: '',
    json: {} as PackageJson
  };

  if (id == 'root') {
    pkg.path = DUMMY_PKG_DIR;
    pkg.json = require(`${pkg.path}/package.json`);
  } else if (availableDummyPackages.includes(id)) {
    pkg.path = `${DUMMY_PKG_DIR}/node_modules/dummy-${id}-pkg`;
    pkg.json = require(`${pkg.path}/package.json`);
  }

  if (!pkg.json.name) {
    throwNewError('package.json is missing "name" field');
  }

  if (
    requireObjectImports &&
    (!pkg.json.imports ||
      typeof pkg.json.imports == 'string' ||
      Array.isArray(pkg.json.imports))
  ) {
    throwNewError('package.json has string, array, null, or undefined "imports" field');
  }

  if (
    requireObjectExports &&
    (!pkg.json.exports ||
      typeof pkg.json.exports == 'string' ||
      Array.isArray(pkg.json.exports))
  ) {
    throwNewError('package.json has string, array, null, or undefined "exports" field');
  }

  return {
    path: pkg.path,
    name: pkg.json.name,
    imports: pkg.json.imports,
    exports: pkg.json.exports,
    packageJson: pkg.json
  } as DummyPackageMetadata<RequireObjectImports, RequireObjectExports>;

  function throwNewError(error: string): never {
    throw new TrialError(`unable to get package "${id}": ${error}`);
  }
}

/**
 * Resolves a subpath to a target using the Node.js runtime. This function is
 * used to ensure projector's resolver functions follow the Node.js resolver
 * spec.
 */
export async function resolveTargetWithNodeJs({
  packageName,
  rootPackagePath,
  subpath,
  conditions
}: {
  /**
   * Name of the package to resolve subpaths against.
   */
  packageName: string;
  /**
   * Path to the root of the package that contains the `packageName` package in
   * its `node_modules` directory if testing `exports` or the path to the root
   * of the `packageName` package if testing `imports`.
   */
  rootPackagePath: string;
  /**
   * The subpath to resolve against the `packageName` package. Must start with
   * either "#" or "./" or be "." exactly or the behavior of this function is
   * undefined.
   */
  subpath: string;
  /**
   * Conditions to match against during subpath resolution.
   */
  conditions: PackageJson.ExportCondition[];
}): Promise<ResolvedSummary> {
  const specifier = subpath.startsWith('#')
    ? subpath
    : `${packageName}${subpath.slice(1)}`;

  const result = await run(
    'node',
    [
      '--loader',
      `${__dirname}/../fixtures/node-loader.mjs`,
      '--input-type',
      'module',
      '--eval',
      `import "${specifier}";`
    ].concat(conditions.map((condition) => `--conditions=${condition}`)),
    { cwd: rootPackagePath, all: true }
  );

  const [resolvedSpecifier, resolvedTarget] =
    result.all?.match(/^(.*?) => (.*?)$/m)?.slice(1) || ([] as undefined[]);

  if (result.all?.includes('ERR_PACKAGE_PATH_NOT_EXPORTED')) {
    return {
      resolvedTarget: null,
      resolverSubpath: subpath,
      isExportedTypescriptType: false
    };
  }

  if (!resolvedTarget || !resolvedSpecifier) {
    throw new TrialError(
      `unable to resolve specifier "${specifier}" at ${rootPackagePath} with conditions: "${
        conditions.join('", "') || 'default'
      }"\n\nNode.js process output: ${result.all}`
    );
  }

  const summary: ResolvedSummary = {
    resolvedTarget,
    resolverSubpath: resolvedSpecifier.replace(packageName, '.'),
    isExportedTypescriptType:
      !!result.all?.includes('ERR_UNKNOWN_FILE_EXTENSION') &&
      resolvedTarget.endsWith('.d.ts')
  };

  return summary;
}

/**
 * Resolves a subpath to a target using the resolve.exports library. This
 * function is used to ensure projector's resolver functions return results that
 * coincide with resolve.exports in the interest of ecosystem interoperability.
 */
export function resolveTargetWithResolveExports({
  packageJson,
  subpath,
  conditions
}: {
  /**
   * Contents of the `package.json` file of the package under test.
   */
  packageJson: PackageJson;
  /**
   * The subpath to resolve against the `packageName` package. Must start with
   * either "#" or "./" or be "." exactly.
   */
  subpath: string;
  /**
   * Conditions to match against during target resolution.
   */
  conditions: PackageJson.ExportCondition[];
}): ResolvedSummary & { allResolvedTargets: ResolvedSummary['resolvedTarget'][] } {
  if (!(subpath.startsWith('#') || subpath.startsWith('./') || subpath === '.')) {
    throw new TrialError('subpath must start with "#" or "./", or strictly equal "."');
  }

  const result = (() => {
    try {
      const result = resolverLibrary(packageJson, subpath, { unsafe: true, conditions });
      if (result === undefined) {
        throw new Error('resolve.exports unexpectedly returned `undefined`');
      }
      return result;
    } catch (error) {
      if (
        isNativeError(error) &&
        (error.message.includes(`No known conditions for "${subpath}" specifier`) ||
          error.message.includes(`Missing "${subpath}" specifier`))
      ) {
        return [null];
      }

      throw new TrialError(
        `resolve.exports failed to resolve target "${subpath}" with conditions: "${
          conditions.join('", "') || 'default'
        }"\n\nError thrown by resolve.exports: ${error}`
      );
    }
  })();

  return {
    resolvedTarget: result[0],
    allResolvedTargets: result,
    resolverSubpath: subpath,
    isExportedTypescriptType: !!result[0]?.endsWith('.d.ts')
  };
}
