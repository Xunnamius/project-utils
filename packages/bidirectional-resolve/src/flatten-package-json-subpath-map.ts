import type { PackageJson } from 'type-fest';

import type {
  SubpathMapping,
  SubpathMappings
} from 'universe+bidirectional-resolve:resolvers.ts';

/**
 * Flatten entry points within a `package.json` `imports`/`exports` map into a
 * one dimensional array of subpath-target mappings.
 */
export function flattenPackageJsonSubpathMap({
  map
}: {
  map: PackageJson['exports'] | PackageJson['imports'];
}): SubpathMappings {
  return map === undefined
    ? []
    : flattenPackageJsonSubpathMap_(map, undefined, [], false, undefined, [], false);
}

function flattenPackageJsonSubpathMap_(
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
      ? map === null || Array.isArray(map) || typeof map === 'string'
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

  if (!map || typeof map === 'string') {
    return [{ target: map ?? null, ...partial }];
  } else if (Array.isArray(map)) {
    const mappings = map.flatMap((value) => {
      return typeof value === 'string'
        ? [{ target: value, ...partial, isFallback: true }]
        : flattenPackageJsonSubpathMap_(
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
        ? flattenPackageJsonSubpathMap_(
            value,
            key,
            conditions,
            isFallback,
            !isSugared,
            excludeConditions,
            isDead
          )
        : flattenPackageJsonSubpathMap_(
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
