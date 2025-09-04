import assert from 'node:assert';

import escapeStringRegExp from 'escape-string-regexp~4';

import { ErrorMessage } from 'universe+bidirectional-resolve:error.ts';

type PotentialEntryPoint = {
  subpathActual: string;
  subpathWithAsterisksReplaced: string;
};

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
  conditions?: string[];
};

export type FlattenedImportsOption = {
  /**
   * The `package.json` `imports` object as a flattened array. Such an array is
   * returned by {@link flattenPackageJsonSubpathMap}.
   */
  flattenedImports: SubpathMappings;
};

export type FlattenedExportsOption = {
  /**
   * The `package.json` `exports` object as a flattened array. Such an array is
   * returned by {@link flattenPackageJsonSubpathMap}.
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
   * not exist as a property in the actual `package.json` file. `subpath`, if it
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
  conditions: string[];
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
  excludedConditions: string[];
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
 * Given `target` and `conditions`, this function returns an array of zero or
 * more entry points that are guaranteed to resolve to `target` when the exact
 * `conditions` are active in the runtime. This is done by reverse-mapping
 * `target` using `exports` from `package.json`. `exports` is assumed to be
 * valid.
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
 *     "many-to-one-subpath-returned-with-asterisk-1/*": "target-with-no-asterisk.js",
 *     "many-to-one-subpath-returned-with-asterisk-2/*": null,
 *   }
 * }
 * ```
 *
 * In this case, the asterisk can be replaced with literally anything and it
 * would still match. Hence, the replacement is left up to the caller.
 */
export function resolveEntryPointsFromExportsTarget({
  flattenedExports,
  target,
  conditions = [],
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
  return resolveEntryPointsFromTarget({
    flattenedMap: flattenedExports,
    wantedTarget: target,
    wantedConditions: conditions,
    shouldIncludeUnsafeFallbackTargets: includeUnsafeFallbackTargets,
    shouldReplaceSubpathAsterisks: replaceSubpathAsterisks
  });
}

/**
 * Given `entryPoint` and `conditions`, this function returns an array of zero
 * or more targets that `entryPoint` is guaranteed to resolve to when the exact
 * `conditions` are active in the runtime. This is done by mapping `entryPoint`
 * using `exports` from `package.json`. `exports` is assumed to be valid.
 */
export function resolveExportsTargetsFromEntryPoint({
  flattenedExports,
  entryPoint,
  conditions = [],
  includeUnsafeFallbackTargets = false
}: {
  /**
   * The entry point that will be mapped to zero or more targets from the
   * `package.json` `exports` object.
   */
  entryPoint: string;
} & FlattenedExportsOption &
  ConditionsOption &
  UnsafeFallbackOption): string[] {
  return resolveTargetsFromEntryPoint({
    flattenedMap: flattenedExports,
    wantedSubpath: entryPoint,
    wantedConditions: conditions,
    shouldIncludeUnsafeFallbackTargets: includeUnsafeFallbackTargets
  });
}

/**
 * Given `target` and `conditions`, this function returns an array of zero or
 * more entry points that are guaranteed to resolve to `target` when the exact
 * `conditions` are active in the runtime. This is done by reverse-mapping
 * `target` using `imports` from `package.json`. `imports` is assumed to be
 * valid.
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
 *     "many-to-one-subpath-returned-with-asterisk-1/*": "target-with-no-asterisk.js",
 *     "many-to-one-subpath-returned-with-asterisk-2/*": null,
 *   }
 * }
 * ```
 *
 * In this case, the asterisk can be replaced with literally anything and it
 * would still match. Hence, the replacement is left up to the caller.
 */
export function resolveEntryPointsFromImportsTarget({
  flattenedImports,
  target,
  conditions,
  includeUnsafeFallbackTargets,
  replaceSubpathAsterisks
}: {
  /**
   * The target that will be reverse-mapped to zero or more subpaths from the
   * `package.json` `imports` object.
   */
  target: string | null;
} & FlattenedImportsOption &
  ConditionsOption &
  UnsafeFallbackOption &
  ReplaceSubpathAsterisksOption): string[] {
  return resolveEntryPointsFromTarget({
    flattenedMap: flattenedImports,
    wantedTarget: target,
    wantedConditions: conditions,
    shouldIncludeUnsafeFallbackTargets: includeUnsafeFallbackTargets,
    shouldReplaceSubpathAsterisks: replaceSubpathAsterisks
  });
}

/**
 * Given `entryPoint` and `conditions`, this function returns an array of zero
 * or more targets that `entryPoint` is guaranteed to resolve to when the exact
 * `conditions` are active in the runtime. This is done by mapping `entryPoint`
 * using `imports` from `package.json`. `imports` is assumed to be valid.
 */
export function resolveImportsTargetsFromEntryPoint({
  flattenedImports,
  entryPoint,
  conditions,
  includeUnsafeFallbackTargets
}: {
  /**
   * The entry point that will be mapped to zero or more targets from the
   * `package.json` `imports` object.
   */
  entryPoint: string;
} & FlattenedImportsOption &
  ConditionsOption &
  UnsafeFallbackOption): string[] {
  return resolveTargetsFromEntryPoint({
    flattenedMap: flattenedImports,
    wantedSubpath: entryPoint,
    wantedConditions: conditions,
    shouldIncludeUnsafeFallbackTargets: includeUnsafeFallbackTargets
  });
}

/**
 * Shared target resolver.
 */
function resolveEntryPointsFromTarget({
  flattenedMap,
  wantedTarget,
  wantedConditions = [],
  shouldIncludeUnsafeFallbackTargets = false,
  shouldReplaceSubpathAsterisks = true
}: {
  flattenedMap: SubpathMappings;
  wantedTarget: string | null;
  wantedConditions?: string[];
  shouldIncludeUnsafeFallbackTargets?: boolean;
  shouldReplaceSubpathAsterisks?: boolean;
}): string[] {
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
  } of flattenedMap) {
    const subpathDoesNotHaveMultipleAsterisks =
      !isAPattern(seenSubpath) ||
      seenSubpath.indexOf('*') === seenSubpath.lastIndexOf('*');

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
              let alreadyHasBetterSubpathPattern = false as boolean;

              // ? Delete the subpaths that "lose" to this subpath (i.e. are
              // ? sorted below this pattern) using Node.js's patternKeyCompare.
              potentialEntryPoints.patterns = potentialEntryPoints.patterns.filter(
                (entry) => {
                  if (
                    isAMatch(seenSubpath, entry.subpathActual) ||
                    isAMatch(entry.subpathActual, seenSubpath)
                  ) {
                    if (patternKeyCompare(entry.subpathActual, seenSubpath) === 1) {
                      // ? We win.
                      return false;
                    } else {
                      // ? They win.
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
                    replaceAsterisksInPattern(seenSubpath, seenTarget, wantedTarget);
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
 * Shared entry point resolver.
 */
function resolveTargetsFromEntryPoint({
  flattenedMap,
  wantedSubpath,
  wantedConditions = [],
  shouldIncludeUnsafeFallbackTargets = false
}: {
  flattenedMap: SubpathMappings;
  wantedSubpath: string;
  wantedConditions?: string[];
  shouldIncludeUnsafeFallbackTargets?: boolean;
}): string[] {
  let lastSeenSubpath: string | undefined = undefined;
  let bestSubpathMatch: string | undefined = undefined;

  // ? 1: find the best subpath.
  for (const { subpath: seenSubpath } of flattenedMap) {
    const isNotLastSeenSubpath = seenSubpath !== lastSeenSubpath;
    const subpathDoesNotHaveMultipleAsterisks =
      !isAPattern(seenSubpath) ||
      seenSubpath.indexOf('*') === seenSubpath.lastIndexOf('*');

    if (isNotLastSeenSubpath && subpathDoesNotHaveMultipleAsterisks) {
      lastSeenSubpath = seenSubpath;

      const isSubpathAnExactMatch = seenSubpath === wantedSubpath;

      if (isSubpathAnExactMatch) {
        bestSubpathMatch = seenSubpath;
        break;
      } else if (
        isAMatch(seenSubpath, wantedSubpath) &&
        (bestSubpathMatch === undefined ||
          patternKeyCompare(bestSubpathMatch, seenSubpath) === 1)
      ) {
        bestSubpathMatch = seenSubpath;
      }
    }
  }

  // ? 2: process the best subpath's targets.
  if (bestSubpathMatch !== undefined) {
    const bestSubpathTargets: string[] = [];
    let sawFistConditionsMatch = false;
    lastSeenSubpath = undefined;

    for (const {
      subpath: seenSubpath,
      target: seenTarget,
      conditions: seenConditions,
      excludedConditions,
      isFallback,
      isFirstNonNullFallback,
      isLastFallback,
      isDeadCondition
    } of flattenedMap) {
      // ? Ignore all subpaths except the best match.
      if (seenSubpath === bestSubpathMatch) {
        lastSeenSubpath = bestSubpathMatch;
        const isNotFallback = !isFallback;

        const isConditionsAMatch =
          !isDeadCondition &&
          isAConditionsMatch(seenConditions, wantedConditions) &&
          excludedConditions.every((condition) => !wantedConditions.includes(condition));

        if (isConditionsAMatch) {
          // ? The first non-null fallback might not be the first matching
          // ? fallback, so let's capture this information while we can.
          const isFirstMatchingFallback = !isNotFallback && !sawFistConditionsMatch;
          sawFistConditionsMatch = true;

          // ? Ignore null targets
          if (seenTarget !== null) {
            if (isNotFallback) {
              bestSubpathTargets.push(seenTarget);
              // ? Since this is not a fallback, stop checking.
              break;
            } else if (
              isFirstMatchingFallback ||
              isFirstNonNullFallback ||
              isLastFallback ||
              shouldIncludeUnsafeFallbackTargets
            ) {
              bestSubpathTargets.push(seenTarget);

              // ? Unless we're unsafely returning all fallbacks, stop checking.
              if (!shouldIncludeUnsafeFallbackTargets) {
                break;
              }
            }
          }

          // ? Stop checking if fallback target is the last target in its array.
          if (isLastFallback) {
            break;
          }
        }
        // ? Stop checking and only consider the very first match unless we're
        // ? including unsafe fallbacks.
        else if (sawFistConditionsMatch && !shouldIncludeUnsafeFallbackTargets) {
          break;
        }
      }
      // ? Stop checking and only consider the best subpath.
      else if (lastSeenSubpath !== undefined) {
        break;
      }
    }

    // ? 3: replace asterisks in targets and return the results.
    return bestSubpathTargets.map((target) => {
      return isAPattern(target)
        ? replaceAsterisksInPattern(target, bestSubpathMatch, wantedSubpath)
        : target;
    });
  }

  return [];
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
      .map((p) => escapeStringRegExp(p))
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
 * the text matched by the first asterisk in `maybePattern`.
 *
 * Useful for checking if one subpath matches another, or if one target matches
 * another.
 */
function isAMatch(maybePattern: string, path: string) {
  if (isAPattern(maybePattern)) {
    let firstMatch: string | undefined = undefined;
    const matches = path.match(patternToRegExp(maybePattern))?.slice(1);

    return !!matches?.every((match) => {
      return firstMatch === undefined ? (firstMatch = match) : match === firstMatch;
    });
  } else {
    return maybePattern === path;
  }
}

/**
 * Returns `true` is `maybePattern` is a pattern and `false` otherwise.
 */
function isAPattern(maybePattern: string) {
  return maybePattern.includes('*');
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
    (condition) => condition === 'default' || wantedConditions.includes(condition)
  );
}

/**
 * Replaces all asterisks ("*") in `pattern` with the first match in
 * `wantedPath` that maps to the first asterisk in `seenPath`.
 */
function replaceAsterisksInPattern(
  pattern: string,
  seenPath: string,
  wantedPath: string
) {
  const firstMatch = wantedPath.match(patternToRegExp(seenPath))?.[1];
  assert(firstMatch, ErrorMessage.AssertionFailedWantedPathIsNotSeenPath());
  return pattern.replaceAll('*', firstMatch);
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
