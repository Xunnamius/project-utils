import { toss } from 'toss-expression';
import isValidPath from 'is-valid-path';
import { relative as relativePath } from 'path';

/**
 * Regular expressions used to parse out components of raw alias keys and
 * values.
 */
const matchers = {
  key: /^(?<prefix>\^?)(?<alias>\w(?:\w|-\w)*)(?<suffix>(?:(?:\/\(\.\*\))?\$)?)$/i,
  value: /^(?<prefix>\.|<rootDir>)(?<path>(\/[^/]+)*?)(?<suffix>(\/\$1)?)$/i
};

/**
 * A mapping of import/require aliases used throughout the project. Object keys
 * represent aliases their corresponding values represent mappings to the
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
export function getProcessedAliasMapping(mapping: [string, string], warn = false) {
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
      `encountered illegal alias map value "${mapping[1]}": "${pathMatch.groups.path}" is not a valid filesystem path`
    );
  }

  if (warn && pathMatch.groups?.prefix == '.') {
    // eslint-disable-next-line no-console
    console.warn(
      `Warning: TypeScript path aliases cannot computed at runtime! This means alias map value "${
        mapping[1]
      }" will be interpreted as "<rootDir>${mapping[1].slice(
        1
      )}" when generating TypeScript aliases`
    );
  }

  return [
    {
      prefix: (aliasMatch.groups?.prefix as '^' | null) || null,
      alias:
        aliasMatch.groups?.alias ||
        toss(new Error(`expected an alias but it is missing`)),
      suffix: (aliasMatch.groups?.suffix as '/(.*)$' | '$' | null) || null
    },
    {
      prefix:
        (pathMatch.groups?.prefix as '.' | '<rootDir>') ||
        toss(new Error(`expected a prefix but it is missing`)),
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
    const [aliasMap, pathMap] = getProcessedAliasMapping(mapping, false);
    return [aliasMap.alias, pathMap.path ? `.${pathMap.path}` : '.'];
  });
}

/**
 * Returns an object that can be plugged into Webpack configurations (including
 * `next.config.js`) at `resolve.alias`.
 *
 * See also: https://webpack.js.org/configuration/resolve/#resolvealias
 */
export function getWebpackAliases(
  { rootDir }: { rootDir?: string } = { rootDir: undefined }
) {
  return Object.entries(getRawAliases()).reduce<Record<string, string>>((o, mapping) => {
    const [aliasMap, pathMap] = getProcessedAliasMapping(mapping, false);

    if (pathMap.prefix == '<rootDir>' && !rootDir) {
      throw new Error(
        'WebpackAliasError: must provide a rootDir argument when using <rootDir> in alias paths'
      );
    }

    return {
      ...o,
      [`${aliasMap.alias}${aliasMap.suffix == '$' ? '$' : ''}`]: `${
        pathMap.prefix == '.' ? process.cwd() : rootDir
      }${pathMap.path || ''}${pathMap.suffix || !pathMap.path ? '/' : ''}`
    };
  }, {});
}

/**
 * Returns an object that can be plugged into Jest configurations at
 * `moduleNameMapper`.
 *
 * See also:
 * https://jestjs.io/docs/configuration#modulenamemapper-objectstring-string--arraystring
 */
export function getJestAliases(
  { rootDir }: { rootDir?: string } = { rootDir: undefined }
) {
  return Object.entries(getRawAliases()).reduce<Record<string, string>>((o, mapping) => {
    const [, pathMap] = getProcessedAliasMapping(mapping, false);
    let prefix = '<rootDir>';

    if (pathMap.prefix == '.') {
      if (!rootDir) {
        throw new Error(
          'JestAliasError: must provide a rootDir argument when using relative alias paths'
        );
      } else {
        const relPath = relativePath(rootDir, process.cwd());
        prefix += relPath ? `/${relPath}` : '';
      }
    }

    return {
      ...o,
      [mapping[0]]: `${prefix}${pathMap.path || ''}${pathMap.suffix || ''}`
    };
  }, {});
}

/**
 * Returns an object that is the basis of the TSConfig JSON files extended by
 * external TypeScript configurations at `compilerOptions.paths`.
 */
export function getTypeScriptAliases() {
  return Object.entries(getRawAliases()).reduce<Record<string, string[]>>(
    (o, mapping) => {
      const [aliasMap, pathMap] = getProcessedAliasMapping(mapping, true);
      return {
        ...o,
        [`${aliasMap.alias}${aliasMap.suffix == '/(.*)$' ? '/*' : ''}`]: [
          `${pathMap.path?.slice(1) || '.'}${pathMap.suffix ? '/*' : ''}`
        ]
      };
    },
    {}
  );
}
