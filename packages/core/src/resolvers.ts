import escapeRegex from 'escape-string-regexp';

import type { SubpathMappings } from 'pkgverse/core/src/project-utils';
import type { PackageJson } from 'type-fest';

export type ConditionsOption = {
  /**
   * Conditions to recursively match against. If none of the listed conditions
   * can be found and there are no matching `default` conditions, this function
   * returns an empty array.
   *
   * In addition to `default` (which is always implicitly enabled), the
   * following are standard/well-known conditions:
   *   - `import`
   *   - `require`
   *   - `node`
   *   - `node-addons`
   *   - `types`
   *   - `deno`
   *   - `browser`
   *   - `react-native`
   *   - `electron`
   *   - `development`
   *   - `production`
   *
   * Array order does not matter. Priority is determined by the property order
   * of conditions defined within a `package.json` `imports`/`exports` mapping.
   *
   * @see https://nodejs.org/api/packages.html#community-conditions-definitions
   */
  conditions?: PackageJson.ExportCondition[];
};

export type FlattenedImportsOption = {
  /**
   * The `package.json` `imports` object as a flattened array. Such an array is
   * returned by `flattenPackageJsonSubpathMap` from
   * `@projector-js/core/project`.
   */
  flattenedImports: SubpathMappings;
};

export type FlattenedExportsOption = {
  /**
   * The `package.json` `exports` object as a flattened array. Such an array is
   * returned by `flattenPackageJsonSubpathMap` from
   * `@projector-js/core/project`.
   */
  flattenedExports: SubpathMappings;
};

export type UnsafeFallbackOption = {
  /**
   * When encountering a fallback array (i.e. targets present at some level
   * within an array),
   * [Node.js](https://github.com/nodejs/node/issues/37928#issuecomment-808833604)
   * will [select the first valid defined non-null target and ignore all the
   * others](https://github.com/nodejs/node/blob/a9cdeeda880a56de6dad10b24b3bfa45e2cccb5d/lib/internal/modules/esm/resolve.js#L417-L432),
   * even if that target ends up being unresolvable. However, some build tools
   * like [Webpack](https://webpack.js.org/guides/package-exports/#alternatives)
   * will evaluate _all_ targets in the fallback array until it encounters one
   * that exists on the filesystem. Since this behavior deviates from Node.js
   * and hence "the spec," it is considered _unsafe_.
   *
   * Therefore, by default, this function will ignore all but the very first
   * defined non-null target in a fallback array regardless of if it exists on
   * the filesystem or not. If no such target is encountered, the final target
   * in the fallback array is returned regardless of its value.
   *
   * Set `includeUnsafeFallbackTargets` to `true` to exhaustively consider _all_
   * non-null fallback targets instead, which is a marked deviation from
   * Node.js's behavior.
   *
   * @default false
   */
  includeUnsafeFallbackTargets?: boolean;
};

export type ReplaceSubpathAsterisksOption = {
  /**
   * When returning a subpath pattern, i.e. a subpath containing an asterisk
   * ("*"), the asterisks will be replaced by the matching portions of `target` if
   * `replaceSubpathAsterisks` is `true`. Otherwise, the literal subpath pattern
   * will be returned with asterisk included.
   *
   * Note that, if `target` contains an asterisk, the literal subpath pattern
   * will always be returned regardless of the value of this option.
   *
   * @default true
   */
  replaceSubpathAsterisks?: boolean;
};

type PotentialEntryPoint = { literal: string; withAsterisksReplaced: string };

/**
 * Given `target` and `conditions`, this function returns an array of zero or
 * more entry points that are guaranteed to resolve to `target` when the exact
 * `conditions` are present. This is done by reverse-mapping `target` using
 * `exports` from `package.json`.
 */
export function resolveEntryPointsFromExportsPath({
  flattenedExports,
  target: wantedTarget,
  conditions: wantedConditions = [],
  includeUnsafeFallbackTargets = false,
  replaceSubpathAsterisks = true
}: {
  /**
   * The target that will be reverse-mapped to zero or more subpaths from the
   * `package.json` `exports` object.
   */
  target: string | null;
} & FlattenedExportsOption &
  ConditionsOption &
  UnsafeFallbackOption &
  ReplaceSubpathAsterisksOption): string[] {
  let sawNonNullFallback = false;
  let matchedNonPatternSubpath = false;
  const relevantNullSubpaths: string[] = [];

  return Array.from(
    new Set(
      flattenedExports
        .map(
          ({
            subpath,
            target: seenTarget,
            conditions: exportsConditions,
            isFallback,
            isFirstNonNullFallback,
            isLastFallback
          }) => {
            // ? Subpaths with multiple asterisks will never match with Node.js,
            // ? so we exclude them here
            if (
              !subpath.includes('*') ||
              subpath.indexOf('*') == subpath.lastIndexOf('*')
            ) {
              const isNotFallback = !isFallback;

              if (isFirstNonNullFallback) {
                sawNonNullFallback = true;
              }

              const shouldConsiderMapping =
                isNotFallback ||
                isFirstNonNullFallback ||
                (!sawNonNullFallback && isLastFallback) ||
                (includeUnsafeFallbackTargets && seenTarget !== null);

              if (isLastFallback) {
                sawNonNullFallback = false;
              }

              if (shouldConsiderMapping) {
                const isConditionsAMatch = isAConditionsMatch(
                  exportsConditions,
                  wantedConditions
                );

                const isPathAnExactMatch = seenTarget === wantedTarget;

                if (isConditionsAMatch) {
                  if (wantedTarget !== null && seenTarget === null) {
                    relevantNullSubpaths.push(subpath);
                  }

                  let potentialEntryPoint: PotentialEntryPoint | undefined = undefined;

                  if (isPathAnExactMatch) {
                    potentialEntryPoint = {
                      literal: subpath,
                      withAsterisksReplaced: subpath
                    };
                  } else if (
                    seenTarget &&
                    wantedTarget &&
                    isAPatternMatch(seenTarget, wantedTarget)
                  ) {
                    potentialEntryPoint = {
                      literal: subpath,
                      withAsterisksReplaced: replaceAsterisksInSubpath(
                        subpath,
                        seenTarget,
                        wantedTarget
                      )
                    };
                  }

                  return potentialEntryPoint;
                }
              }
            }
          }
        )
        .reduce(() => {})

        .filter((potentialEntryPoint): potentialEntryPoint is PotentialEntryPoint => {
          if (potentialEntryPoint !== undefined) {
            const isEntryPointANullMatch = relevantNullSubpaths.some((nullEntryPoint) => {
              return (
                nullEntryPoint == potentialEntryPoint.literal ||
                nullEntryPoint == potentialEntryPoint.withAsterisksReplaced ||
                isAPatternMatch(nullEntryPoint, potentialEntryPoint.withAsterisksReplaced)
              );
            });
            // ? Exclude all potential entry points that match subpaths with
            // ? null targets
            return !isEntryPointANullMatch;
          }
          return false;
        })
        .map((potentialEntryPoint) => {
          return potentialEntryPoint[
            replaceSubpathAsterisks && !wantedTarget?.includes('*')
              ? 'withAsterisksReplaced'
              : 'literal'
          ];
        })
    )
  );
}

/**
 * Given `entryPoint` and `conditions`, this function returns an array of zero
 * or more targets that `entryPoint` is guaranteed to resolve to when the exact
 * `conditions` are present. This is done by mapping `entryPoint` using
 * `exports` from `package.json`.
 */
export function resolveExportsPathsFromEntryPoint(
  options: {
    /**
     * The entry point that will be mapped into zero or more targets from the
     * `package.json` `exports` object.
     */
    entryPoint: string;
  } & FlattenedExportsOption &
    ConditionsOption &
    UnsafeFallbackOption
): (string | null)[] {
  // TODO
  void options;
  return ['bad'];
}

/**
 * Given `target` and `conditions`, this function returns an array of zero or
 * more entry points that are guaranteed to resolve to `target` when the exact
 * `conditions` are present. This is done by reverse-mapping `target` using
 * `imports` from `package.json`.
 */
export function resolveEntryPointsFromImportsPath(
  options: {
    /**
     * The target that will be reverse-mapped to zero or more subpaths from the
     * `package.json` `imports` object.
     */
    target: string | null;
  } & FlattenedImportsOption &
    ConditionsOption &
    UnsafeFallbackOption &
    ReplaceSubpathAsterisksOption
): string[] {
  // TODO
  void options;
  return ['bad'];
}

/**
 * Given `entryPoint` and `conditions`, this function returns an array of zero
 * or more targets that `entryPoint` is guaranteed to resolve to when the exact
 * `conditions` are present. This is done by mapping `entryPoint` using
 * `imports` from `package.json`.
 */
export function resolveImportsPathsFromEntryPoints(
  options: {
    /**
     * The entry point that will be mapped into zero or more targets from the
     * `package.json` `imports` object.
     */
    entryPoint: string;
  } & FlattenedImportsOption &
    ConditionsOption &
    UnsafeFallbackOption
): (string | null)[] {
  // TODO
  void options;
  return ['bad'];
}

/**
 * Returns a regular expression after replacing all asterisks in `pattern` with
 * `(.*)`.
 */
function patternToRegExp(pattern: string) {
  return new RegExp(
    `^${pattern
      .split('*')
      .map((p) => escapeRegex(p))
      .join('(.*)')}$`
  );
}

/**
 * Returns `true` if `pattern` contains one or more asterisks ("*") and as a
 * result includes `path` with respect to [the rules of Node.js asterisk
 * replacement](https://nodejs.org/docs/latest-v19.x/api/packages.html#subpath-patterns).
 * That is: all asterisks in `path` must equate to the exact same text, which is
 * the text matched by the single asterisk in `pattern`.
 */
function isAPatternMatch(pattern: string, path: string) {
  if (pattern.includes('*')) {
    let firstMatch: string;
    const matches = path.match(patternToRegExp(pattern))?.slice(1);

    return (
      matches &&
      matches.every((match) => {
        return firstMatch === undefined ? (firstMatch = match) : match == firstMatch;
      })
    );
  }

  return false;
}

/**
 * Replaces all asterisks ("*") in `subpath` with the parts of `actualTarget`
 * that map to the asterisks in `literalTarget`.
 */
function replaceAsterisksInSubpath(
  subpath: string,
  literalTarget: string,
  actualTarget: string
) {
  const firstMatch = actualTarget.match(patternToRegExp(literalTarget))?.at(1);

  /* istanbul ignore else */
  if (firstMatch) {
    return subpath.replaceAll('*', firstMatch);
  } else {
    throw new TypeError(
      'sanity check failed: actualTarget does not map cleanly to literalTarget'
    );
  }
}

/**
 * Returns `true` if `actualConditions` array matches `requiredConditions`
 * array, or if `actualConditions` contains the `"default"` condition
 */
function isAConditionsMatch(
  actualConditions: SubpathMappings[number]['conditions'],
  requiredConditions: NonNullable<ConditionsOption['conditions']>
) {
  return actualConditions.every(
    (condition) => condition == 'default' || requiredConditions.includes(condition)
  );
}
