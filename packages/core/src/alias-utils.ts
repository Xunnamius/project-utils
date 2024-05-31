import isValidPath from 'is-valid-path';
import { relative as toRelativePath } from 'node:path';

import { ensurePathIsAbsolute } from 'pkgverse/core/src/helpers';

/**
 * Regular expressions used to parse out components of raw alias keys and
 * values.
 */
const matchers = {
  key: /^(?<prefix>\^?)(?<alias>\w(?:\w|-\w)*)(?<suffix>(?:(?:\/\(\.\*\))?\$)?)$/i,
  value: /^(?<prefix>\.|<rootdir>)(?<path>(\/[^/]+)*?)(?<suffix>(\/\$1)?)$/i
};

/**
 * A mapping of specifier aliases used throughout the project. Object keys
 * represent aliases while their corresponding values represent mappings to the
 * filesystem.
 *
 * Since this is used by several tooling subsystems with several different alias
 * syntaxes (some even allowing regular expression syntax), the most permissive
 * of the syntaxes is used to define the generic "raw" aliases below. Later,
 * these are reduced to their tooling-specific syntaxes.
 *
 * *__Raw Alias Syntax Rules__*
 *
 * 1. Each key contains no path separators (excluding rule #3)
 * 2. Each key starts with word character or ^
 * 3. Each key ends with "/(.*)$" (open-ended) or "$" (exact) or word character
 * 4. Each value starts with "./" (relative path) or "<rootDir>" (repo root)
 * 5. Each value ends with "/$1" or any other character except "/"
 * 6. Values representing directory paths end with "/$1"
 * 7. Values ending with "/$1" have corresponding keys ending with "/(.*)$" and
 *    vice-versa
 *
 * Note: the raw alias syntax rules are a subset of Jest's module name mapping
 * syntax.
 */
export const getRawAliases = () => ({
  '^universe/(.*)$': '<rootDir>/src/$1',
  '^multiverse/(.*)$': '<rootDir>/lib/$1',
  '^testverse/(.*)$': '<rootDir>/test/$1',
  '^pkgverse/(.*)$': '<rootDir>/packages/$1',
  '^externals/(.*)$': '<rootDir>/external-scripts/$1',
  '^types/(.*)$': '<rootDir>/types/$1',
  // ? ESLint/TypeScript will not resolve relative paths correctly, but it's ok.
  // ? Remedy for errors: add the key to the root package.json (w/ empty value)
  '^package$': './package.json'
});

/**
 * Takes an alias mapping, validates it, and returns its constituent parts.
 */
export function getProcessedAliasMapping({
  mapping,
  issueTypescriptWarning = false
}: {
  /**
   * A single mapping between an alias `key` and its real path `value`.
   */
  mapping: [key: string, value: string];
  /**
   * If true, attempting to resolve an alias at runtime, which TypeScript does
   * not support, will trigger a TypeScript-specific warning.
   *
   * @default false
   */
  issueTypescriptWarning?: boolean;
}) {
  const aliasMatch = matchers.key.exec(mapping[0]);
  const pathMatch = matchers.value.exec(mapping[1]);

  if (!aliasMatch) {
    throw new Error(`encountered illegal alias map key "${mapping[0]}": invalid syntax`);
  }

  if (!pathMatch) {
    throw new Error(
      `encountered illegal alias map value "${mapping[1]}": invalid syntax`
    );
  }

  const aliasHasOpenSuffix = aliasMatch.groups?.suffix == '/(.*)$';
  const pathHasOpenOrDirSuffix = pathMatch.groups?.suffix == '/$1';

  if (aliasHasOpenSuffix && !pathHasOpenOrDirSuffix) {
    throw new Error(
      `encountered illegal alias map value "${mapping[1]}": must end with "/$1"`
    );
  }

  if (pathHasOpenOrDirSuffix && !aliasHasOpenSuffix) {
    throw new Error(
      `encountered illegal alias map key "${mapping[0]}": must end with "/(.*)$"`
    );
  }

  if (pathMatch.groups?.path && !isValidPath(pathMatch.groups.path)) {
    throw new Error(
      `encountered illegal alias map value "${mapping[1]}": "${pathMatch.groups.path}" is not a valid path`
    );
  }

  if (issueTypescriptWarning && pathMatch.groups?.prefix == '.') {
    // eslint-disable-next-line no-console
    console.warn(
      `Warning: TypeScript path aliases cannot be computed at runtime! This means alias map value "${
        mapping[1]
      }" will be interpreted as "<rootDir>${mapping[1].slice(
        1
      )}" when generating TypeScript aliases`
    );
  }

  return [
    {
      prefix: (aliasMatch.groups?.prefix as '^' | null) || null,
      alias: aliasMatch.groups?.alias as string,
      suffix: (aliasMatch.groups?.suffix as '/(.*)$' | '$' | null) || null
    },
    {
      prefix: pathMatch.groups?.prefix as '.' | '<rootDir>',
      path: pathMatch.groups?.path || null,
      suffix: (pathMatch.groups?.suffix as '/$1' | null) || null
    }
  ] as const;
}

/**
 * Returns an array that can be plugged into ESLint configurations at
 * `settings['import/resolver'].alias.map`.
 *
 * See also: https://www.npmjs.com/package/eslint-import-resolver-alias
 */
export function getEslintAliases() {
  return Object.entries(getRawAliases()).map((mapping) => {
    const [aliasMap, pathMap] = getProcessedAliasMapping({ mapping });
    return [aliasMap.alias, pathMap.path ? `.${pathMap.path}` : '.'];
  });
}

/**
 * Returns an object that can be plugged into Webpack configurations (including
 * `next.config.js`) at `resolve.alias`.
 *
 * See also: https://webpack.js.org/configuration/resolve/#resolvealias
 */
export function getWebpackAliases({
  rootDir
}: {
  /**
   * The root directory of the project as an absolute path.
   */
  rootDir?: string;
} = {}) {
  return Object.fromEntries(
    Object.entries(getRawAliases()).map((mapping) => {
      const [aliasMap, pathMap] = getProcessedAliasMapping({ mapping });

      if (pathMap.prefix == '<rootDir>') {
        if (!rootDir) {
          throw new Error(
            'WebpackAliasError: must provide a rootDir argument when using <rootDir> in alias paths'
          );
        } else {
          ensurePathIsAbsolute({ path: rootDir });
        }
      }

      return [
        `${aliasMap.alias}${aliasMap.suffix == '$' ? '$' : ''}`,
        `${pathMap.prefix == '.' ? process.cwd() : rootDir}${pathMap.path || ''}${
          pathMap.suffix || !pathMap.path ? '/' : ''
        }`
      ];
    })
  );
}

/**
 * Returns an object that can be plugged into Jest configurations at
 * `moduleNameMapper`.
 *
 * See also:
 * https://jestjs.io/docs/configuration#modulenamemapper-objectstring-string--arraystring
 */
export function getJestAliases({
  rootDir
}: {
  /**
   * The root directory of the project as an absolute path.
   */
  rootDir?: string;
} = {}) {
  return Object.fromEntries(
    Object.entries(getRawAliases()).map((mapping) => {
      const [, pathMap] = getProcessedAliasMapping({ mapping });
      let prefix = '<rootDir>';

      if (pathMap.prefix == '.') {
        if (!rootDir) {
          throw new Error(
            'JestAliasError: must provide a rootDir argument when using relative alias paths'
          );
        } else {
          ensurePathIsAbsolute({ path: rootDir });
          const relativePath = toRelativePath(rootDir, process.cwd());
          prefix += relativePath ? `/${relativePath}` : '';
        }
      }

      return [mapping[0], `${prefix}${pathMap.path || ''}${pathMap.suffix || ''}`];
    })
  );
}

/**
 * Returns an object that is the basis of the TSConfig JSON files extended by
 * external TypeScript configurations at `compilerOptions.paths`.
 */
export function getTypeScriptAliases() {
  return Object.fromEntries(
    Object.entries(getRawAliases()).map((mapping) => {
      const [aliasMap, pathMap] = getProcessedAliasMapping({
        mapping,
        issueTypescriptWarning: true
      });

      return [
        `${aliasMap.alias}${aliasMap.suffix == '/(.*)$' ? '/*' : ''}`,
        [`${pathMap.path?.slice(1) || '.'}${pathMap.suffix ? '/*' : ''}`]
      ];
    })
  );
}
