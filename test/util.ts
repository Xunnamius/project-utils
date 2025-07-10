/**
 ** This file exports test utilities specific to this project and beyond what is
 ** exported by @-xun/jest; these can be imported using the testversal aliases.
 */

import assert from 'node:assert';
import { isNativeError } from 'node:util/types';

import { getDummyLoaderPath } from '@-xun/common-dummies/loaders';
import { runNoRejectOnBadExit } from '@-xun/run';
import { resolve as resolverLibrary } from 'resolve.exports';

import type { XPackageJson } from 'multiverse+types';

// ? @-xun/jest will always come from @-xun/symbiote (i.e. transitively)
// {@symbiote/notInvalid @-xun/jest}

export * from '@-xun/jest';

/**
 * Represents the summary of an import resolution attempt.
 */
export type ResolvedSummary = {
  resolvedTarget: string | null;
  resolverSubpath: string;
  isExportedTypescriptType: boolean;
};

/**
 * Resolves a subpath to a target using the Node.js runtime. This function is
 * used to ensure project-utils's resolver functions follow the Node.js resolver
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
   *
   * Note that if the subpath ends in the strings "package" or ".json", the
   * import will use the "type: json" attribute.
   */
  subpath: string;
  /**
   * Conditions to match against during subpath resolution.
   */
  conditions: string[];
}): Promise<ResolvedSummary> {
  const specifier = subpath.startsWith('#')
    ? subpath
    : `${packageName}${subpath.slice(1)}`;

  const result = await runNoRejectOnBadExit(
    'node',
    [
      '--loader',
      getDummyLoaderPath('reflective'),
      '--input-type',
      'module',
      '--eval',
      `import "${specifier}"${
        specifier.endsWith('package') || specifier.endsWith('.json')
          ? ' with { type: "json" }'
          : ''
      };`
    ].concat(conditions.map((condition) => `--conditions=${condition}`)),
    { cwd: rootPackagePath, all: true }
  );

  assert(typeof result.all === 'string');

  const [resolvedSpecifier, resolvedTarget] =
    result.all.match(/^(.*?) => (.*?)$/m)?.slice(1) ?? ([] as undefined[]);

  if (
    result.all.includes('ERR_PACKAGE_PATH_NOT_EXPORTED') ||
    result.all.includes('ERR_PACKAGE_IMPORT_NOT_DEFINED')
  ) {
    return {
      resolvedTarget: null,
      resolverSubpath: subpath,
      isExportedTypescriptType: false
    };
  }

  if (!resolvedTarget || !resolvedSpecifier) {
    throw new Error(
      `unable to resolve specifier "${specifier}" at ${rootPackagePath} with conditions: "${
        conditions.join('", "') || 'default'
      }"\n\nNode.js process output: ${result.all}`
    );
  }

  const summary: ResolvedSummary = {
    resolvedTarget,
    resolverSubpath: resolvedSpecifier.replace(packageName, '.'),
    isExportedTypescriptType:
      !!result.all.includes('ERR_UNKNOWN_FILE_EXTENSION') &&
      resolvedTarget.endsWith('.d.ts')
  };

  return summary;
}

/**
 * Resolves a subpath to a target using the resolve.exports library. This
 * function is used to ensure project-utils's resolver functions return results
 * that coincide with resolve.exports in the interest of ecosystem
 * interoperability.
 */
export function resolveTargetWithResolveExports({
  packageJson,
  subpath,
  conditions
}: {
  /**
   * Contents of the `package.json` file of the package under test.
   */
  packageJson: XPackageJson;
  /**
   * The subpath to resolve against the `packageName` package. Must start with
   * either "#" or "./" or be "." exactly.
   */
  subpath: string;
  /**
   * Conditions to match against during target resolution.
   */
  conditions: string[];
}): ResolvedSummary & { allResolvedTargets: ResolvedSummary['resolvedTarget'][] } {
  if (!(subpath.startsWith('#') || subpath.startsWith('./') || subpath === '.')) {
    throw new Error('subpath must start with "#" or "./", or strictly equal "."');
  }

  const result = (() => {
    try {
      const result = resolverLibrary(packageJson, subpath, { unsafe: true, conditions });
      if (result === undefined) {
        throw new TypeError('resolve.exports unexpectedly returned `undefined`');
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

      throw new Error(
        `resolve.exports failed to resolve target "${subpath}" with conditions: "${
          conditions.join('", "') || 'default'
        }"\n\nError thrown by resolve.exports: ${String(error)}`
      );
    }
  })();

  return {
    resolvedTarget: result[0]!,
    allResolvedTargets: result,
    resolverSubpath: subpath,
    isExportedTypescriptType: !!result[0]?.endsWith('.d.ts')
  };
}
