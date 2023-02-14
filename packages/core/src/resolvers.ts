import escapeRegex from 'escape-string-regexp';

import type { SubpathMapping, SubpathMappings } from 'pkgverse/core/src/project-utils';
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

type PotentialEntryPoint = {
  subpathActual: string;
  subpathWithAsterisksReplaced: string;
};

/**
 * Given `target` and `conditions`, this function returns an array of zero or
 * more entry points that are guaranteed to resolve to `target` when the exact
 * `conditions` are present. This is done by reverse-mapping `target` using
 * `exports` from `package.json`.
 *
 * Entry points are sorted in the order they're encountered with the caveat that
 * exact subpaths always come before subpath patterns. Note that, if `target`
 * contains one or more asterisks, the subpaths returned by this function will
 * also contain an asterisk. The only other time this function returns a subpath
 * with an asterisk is if the subpath is a "many-to-one" mapping; that is: the
 * subpath has an asterisk but its target does not. For instance:
 *
 * @example
 * ```json
 * {
 *   "exports": {
 *     "many-to-one-subpath/*": "target-with-no-asterisk.js"
 *   }
 * }
 * ```
 *
 * In this case, the asterisk can be replaced with literally anything and it
 * would still match. Hence, the replacement is left up to the caller.
 */
export function resolveEntryPointsFromExportsPath({
  flattenedExports,
  target: wantedTarget,
  conditions: wantedConditions = [],
  includeUnsafeFallbackTargets: shouldIncludeUnsafeFallbackTargets = false,
  replaceSubpathAsterisks: shouldReplaceSubpathAsterisks = true
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

  const nonPatternSubpaths: Pick<SubpathMapping, 'subpath' | 'target'>[] = [];
  const nullTargetSubpaths: PotentialEntryPoint[] = [];
  const potentialEntryPoints = {
    patterns: [] as PotentialEntryPoint[],
    nonPatterns: [] as PotentialEntryPoint[]
  };

  for (const {
    subpath: seenSubpath,
    target: seenTarget,
    conditions: seenConditions,
    excludedConditions,
    isFallback,
    isFirstNonNullFallback,
    isLastFallback,
    isDeadCondition
  } of flattenedExports) {
    const subpathDoesNotHaveMultipleAsterisks =
      !isAPattern(seenSubpath) ||
      seenSubpath.indexOf('*') == seenSubpath.lastIndexOf('*');

    if (subpathDoesNotHaveMultipleAsterisks) {
      const isNotFallback = !isFallback;

      if (isFirstNonNullFallback) {
        sawNonNullFallback = true;
      }

      const shouldConsiderMapping =
        // ? Eliminate explicitly dead mappings right off the bat
        !isDeadCondition &&
        excludedConditions.every((condition) => !wantedConditions.includes(condition)) &&
        (isNotFallback ||
          isFirstNonNullFallback ||
          (!sawNonNullFallback && isLastFallback) ||
          (shouldIncludeUnsafeFallbackTargets && seenTarget !== null));

      if (isLastFallback) {
        sawNonNullFallback = false;
      }

      if (shouldConsiderMapping) {
        const isConditionsAMatch = isAConditionsMatch(seenConditions, wantedConditions);
        const isTargetAnExactMatch = seenTarget === wantedTarget;

        if (isConditionsAMatch) {
          if (!isAPattern(seenSubpath)) {
            // ? Save a copy of this mapping for later processing
            nonPatternSubpaths.push({ subpath: seenSubpath, target: seenTarget });
          }

          const potentialEntryPoint: PotentialEntryPoint = {
            subpathActual: seenSubpath,
            subpathWithAsterisksReplaced: seenSubpath
          };

          if (isTargetAnExactMatch) {
            potentialEntryPoints.nonPatterns.push(potentialEntryPoint);

            // ? Exact keys will always beat subpath patterns, so delete all
            // ? the subpath patterns that would otherwise match this exact key.
            potentialEntryPoints.patterns = potentialEntryPoints.patterns.filter(
              (entry) => {
                return !isAMatch(entry.subpathActual, seenSubpath);
              }
            );
          } else if (seenTarget === null /* wantedTarget must !== null */) {
            // ? We'll eliminate null target subpaths later.
            nullTargetSubpaths.push(potentialEntryPoint);
          } else if (wantedTarget !== null && isAMatch(seenTarget, wantedTarget)) {
            // ? Exact keys will always beat subpath patterns, so don't bother
            // ? if one of those was already found.
            const alreadyHasExactSubpath = potentialEntryPoints.nonPatterns.some(
              (entry) => isAMatch(seenSubpath, entry.subpathActual)
            );

            if (!alreadyHasExactSubpath) {
              // ? If a subpath "wins" against this subpath (i.e. this pattern
              // ? would be sorted below it), ignore this subpath and move on.
              let alreadyHasBetterSubpathPattern = false;

              // ? Delete the subpaths that "lose" to this subpath (i.e. are
              // ? sorted below this pattern) using Node.js's patternKeyCompare.
              potentialEntryPoints.patterns = potentialEntryPoints.patterns.filter(
                (entry) => {
                  if (
                    isAMatch(seenSubpath, entry.subpathActual) ||
                    isAMatch(entry.subpathActual, seenSubpath)
                  ) {
                    if (patternKeyCompare(entry.subpathActual, seenSubpath) === 1) {
                      // ? We win
                      return false;
                    } else {
                      // ? They win
                      alreadyHasBetterSubpathPattern = true;
                    }
                  }

                  // ? Encountered a mutually exclusive subpath so move along.
                  return true;
                }
              );

              if (!alreadyHasBetterSubpathPattern) {
                if (shouldReplaceSubpathAsterisks) {
                  potentialEntryPoint.subpathWithAsterisksReplaced =
                    replaceAsterisksInSubpath(seenSubpath, seenTarget, wantedTarget);
                }

                potentialEntryPoints.patterns.push(potentialEntryPoint);
              }
            }
          }
        }
      }
    }
  }

  const entryPoints: string[] = potentialEntryPoints.nonPatterns.map(
    ({ subpathWithAsterisksReplaced }) => subpathWithAsterisksReplaced
  );

  // ? Eliminate subpath patterns that (1) lose to null target subpath patterns
  // ? or (2) match non-patterns after asterisk replacement (implicitly dead).
  for (const {
    subpathActual,
    subpathWithAsterisksReplaced
  } of potentialEntryPoints.patterns) {
    const losesToNullTargetSubpath = nullTargetSubpaths.some(
      ({ subpathActual: nullSubpathActual }) => {
        return (
          isAMatch(nullSubpathActual, subpathWithAsterisksReplaced) &&
          patternKeyCompare(subpathActual, nullSubpathActual) === 1
        );
      }
    );

    const isImplicitlyDead = nonPatternSubpaths.some(({ subpath, target }) => {
      return (
        subpathWithAsterisksReplaced === subpath &&
        ((target === null && wantedTarget !== null) ||
          (target !== null && wantedTarget !== null && !isAMatch(target, wantedTarget)))
      );
    });

    if (!losesToNullTargetSubpath && !isImplicitlyDead) {
      entryPoints.push(subpathWithAsterisksReplaced);
    }
  }

  return entryPoints;
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
 *
 * Entry points are sorted in the order they're encountered with the caveat that
 * exact subpaths always come before subpath patterns. Note that, if `target`
 * contains one or more asterisks, the subpaths returned by this function will
 * also contain an asterisk. The only other time this function returns a subpath
 * with an asterisk is if the subpath is a "many-to-one" mapping; that is: the
 * subpath has an asterisk but its target does not. For instance:
 *
 * @example
 * ```json
 * {
 *   "imports": {
 *     "many-to-one-subpath/*": "target-with-no-asterisk.js"
 *   }
 * }
 * ```
 *
 * In this case, the asterisk can be replaced with literally anything and it
 * would still match. Hence, the replacement is left up to the caller.
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
 * `(.+)`. "+" is used over "*" to obviate the need for a >= length check when
 * reducing.
 */
function patternToRegExp(pattern: string) {
  return new RegExp(
    `^${pattern
      .split('*')
      .map((p) => escapeRegex(p))
      .join('(.+)')}$`
  );
}

/**
 * Returns `true` if (1) `maybePattern` does not contain any asterisks ("*") and
 * matches `path` exactly or (2) `maybePattern` contains one or more asterisks
 * and as a result includes `path` with respect to [the rules of Node.js
 * asterisk
 * replacement](https://nodejs.org/docs/latest-v19.x/api/packages.html#subpath-patterns).
 * That is: all asterisks in `path` must equate to the exact same text, which is
 * the text matched by the single asterisk in `maybePattern`.
 */
function isAMatch(maybePattern: string, path: string) {
  if (isAPattern(maybePattern)) {
    let firstMatch: string;
    const matches = path.match(patternToRegExp(maybePattern))?.slice(1);

    return !!(
      matches &&
      matches.every((match) => {
        return firstMatch === undefined ? (firstMatch = match) : match == firstMatch;
      })
    );
  } else {
    return maybePattern === path;
  }
}

/**
 * Returns `true` is `maybePattern` is a pattern and `false` otherwise.
 */
function isAPattern(maybePattern: string) {
  return !!maybePattern?.includes('*');
}

/**
 * Replaces the asterisk ("*") in `subpath` with the parts of `wantedTarget`
 * that map to the asterisks in `seenTarget`.
 */
function replaceAsterisksInSubpath(
  subpath: string,
  seenTarget: string,
  wantedTarget: string
) {
  const firstMatch = wantedTarget.match(patternToRegExp(seenTarget))?.at(1);

  /* istanbul ignore else */
  if (firstMatch) {
    return subpath.replace('*', firstMatch);
  } else {
    throw new TypeError(
      'sanity check failed: wantedTarget does not map cleanly to seenTarget'
    );
  }
}

/**
 * Returns `true` if `seenConditions` array matches `wantedConditions` array, or
 * if `seenConditions` contains the `"default"` condition.
 */
function isAConditionsMatch(
  seenConditions: SubpathMapping['conditions'],
  wantedConditions: NonNullable<ConditionsOption['conditions']>
) {
  return seenConditions.every(
    (condition) => condition == 'default' || wantedConditions.includes(condition)
  );
}

/**
 * An implementation of PATTERN_KEY_COMPARE from the Node.js resolver algorithm
 * specification.
 *
 * @see
 * https://nodejs.org/dist/latest-v19.x/docs/api/esm.html#resolver-algorithm-specification
 */
function patternKeyCompare(keyA: string, keyB: string) {
  const aPatternIndex = keyA.indexOf('*');
  const bPatternIndex = keyB.indexOf('*');
  const baseLengthA = aPatternIndex === -1 ? keyA.length : aPatternIndex + 1;
  const baseLengthB = bPatternIndex === -1 ? keyB.length : bPatternIndex + 1;
  if (baseLengthA > baseLengthB) return -1;
  if (baseLengthB > baseLengthA) return 1;
  if (aPatternIndex === -1) return 1;
  if (bPatternIndex === -1) return -1;
  if (keyA.length > keyB.length) return -1;
  if (keyB.length > keyA.length) return 1;
  return 0;
}
