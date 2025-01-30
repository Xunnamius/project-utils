import { extname } from 'node:path';

import escapeStringRegExp from 'escape-string-regexp~4';
import { type Arrayable } from 'type-fest';

import { type WorkspacePackageId } from 'universe+project-utils';
import { type GenericProjectMetadata } from 'universe+project-utils:analyze/common.ts';

import {
  uriSchemeDelimiterEscaped,
  uriSchemeDelimiterUnescaped,
  uriSchemeSubDelimiterUnescaped
} from 'universe+project-utils:constant.ts';

import { ErrorMessage, ProjectError } from 'universe+project-utils:error.ts';

import {
  directoryPackagesProjectBase,
  directorySrcPackageBase,
  directoryTestPackageBase,
  directoryTypesProjectBase,
  toPath,
  toRelativePath,
  type RelativePath
} from 'universe+project-utils:fs.ts';

export {
  uriSchemeDelimiterUnescaped as uriSchemeDelimiter,
  uriSchemeSubDelimiterUnescaped as uriSchemeSubDelimiter
};

/**
 * A regex containing illegal alias key characters.
 *
 * **This regular expression must never have the "global" flag**, meaning it is
 * safe to use with `.test()`.
 */
export const invalidAliasRegExp = /["$*/:<>?[\\\]{|}]+/i;

/**
 * A regex containing illegal alias value characters.
 *
 * **This regular expression must never have the "global" flag**, meaning it is
 * safe to use with `.test()`.
 */
export const invalidPathRegExp = /["*:<>?[\]|]+/i;

/**
 * A regex that matches any string that looks like a relative path without also
 * looking like a bare specifier.
 *
 * **This regular expression must never have the "global" flag**, meaning it is
 * safe to use with `.test()`.
 */
export const isLocalLookingRegExp = /^\.\.?(\/|$)/;

/**
 * A well-known import alias group, such as "universe" or "multiverse".
 */
export enum WellKnownImportAlias {
  /**
   * This alias always refers to the project root (i.e. root package)'s `./src`
   * directory.
   *
   * Examples of matching aliases:
   * - `"universe"`                           (root ./index.ts)
   * - `"universe:some/path/index.ts"`        (root ./src/some/path/index.ts)
   */
  Universe = 'universe',
  /**
   * This alias always refers to a sub-root package's `./src` directory.
   *
   * Examples of matching aliases:
   * - `"multiverse+package-id"`              (package ./src/index.js)
   * - `"multiverse+package-id:some/path.js"` (package ./src/some/path.js)
   */
  Multiverse = 'multiverse',
  /**
   * This alias refers to either a root or sub-root package's `./test`
   * directory.
   *
   * Examples of matching aliases:
   * - `"testverse:some/path.ts"`             (root ./test/some/path.ts)
   * - `"testverse+package-id:some/path.ts"`  (package ./test/some/path.ts)
   */
  Testverse = 'testverse',
  /**
   * This alias always refers to the project root's `./types` directory.
   *
   * Examples of matching aliases:
   * - `"typeverse:global.ts"`                (root ./types/global.ts)
   */
  Typeverse = 'typeverse',
  /**
   * This alias always refers to some file relative to the project root.
   *
   * Examples of matching aliases:
   * - `"rootverse:some/path.js"`             (root ./some/path.js)
   * - `"rootverse+package-id some/path.ts"`  (package ./some/path.ts)
   */
  Rootverse = 'rootverse'
}

/**
 * A metadata object describing an "alias key," sometimes referred to as an
 * "alias". Always corresponds to an "alias value" (i.e. an "alias path").
 *
 * @see {@link RawPath}
 */
export type RawAlias = {
  /**
   * Determines the prefix matching behavior for alias keys. Choices are:
   *
   * - `none`: Any string containing `alias` may match. This is only useful for
   *   custom one-off aliases and should be avoided.
   * - `exact`: Only strings beginning with `alias` exactly may match.
   */
  prefix: 'none' | 'exact';
  /**
   * Determines the suffix matching behavior for alias keys. Choices are:
   *
   * - `none`: Any string containing `alias` may match. This has some
   *   tooling-specific quirks and should be avoided.
   * - `exact`: Only strings ending with `alias` exactly may match.
   * - `open`: Only strings ending with `alias + sep + subpath` may match.
   */
  suffix: 'none' | 'exact' | 'open';
  /**
   * The eponymous "raw alias". Must not contain any path separator characters
   * (i.e. "/", "\", or ":") or the "$" character.
   */
  alias: string;
  /**
   * The well-known import alias "group" to which the raw `alias` belongs.
   */
  group: WellKnownImportAlias;
  /**
   * A regular expression derived from `alias` that can be matched against
   * specifier strings. If this alias's `suffix` is `"open"`, the returned
   * expression will include a single matching group containing the full
   * specifier path without modification.
   *
   * Any RegExp control characters present in `alias` (e.g. "+", "*", "?") will
   * be escaped.
   *
   * @see {@link rawAliasToRegExp}
   */
  regExp: RegExp;
  /**
   * If this alias contains a reference to a package's id (e.g.
   * "universe+package-id"), `packageId` must be defined.
   */
  packageId: WorkspacePackageId | undefined;
};

/**
 * A metadata object describing an "alias path," sometimes referred to as an
 * "alias value". Always corresponds to an "alias key" (i.e. an "alias").
 *
 * @see {@link RawAlias}
 */
export type RawPath = {
  /**
   * Determines the final path returned in lieu of a matched alias. Choices are:
   *
   * - `root`: `path` will always be resolved starting from the project root.
   *   This resolution may be handled by this package or by the tooling itself
   *   depending on said tooling's capabilities.
   */
  prefix: 'root';
  /**
   * Determines the final path returned in lieu of a matched alias. Choices are:
   *
   * - `none`: `path` will be returned as-is. This is only useful for custom
   *   one-off aliases and should be avoided.
   * - `open`: The subpath matched by the `'open'` {@link RawAlias.suffix}
   *   configuration will be appended to `path` (separated by `'/'`) and
   *   returned. If the corresponding {@link RawAlias.suffix} is not also
   *   configured with `{ suffix: 'open' }`, an error will be thrown.
   */
  suffix: 'none' | 'open';
  /**
   * The eponymous "raw path". Must not contain the ":" linux path separator
   * character. Must not start or end with the "/" character, or start with
   * "./".
   *
   * `path` is considered relative to the project root.
   */
  path: RelativePath;
  /**
   * If `false`, an extension will be appended to the path automatically. The
   * extension to be appended depends on which tooling the aliases are being
   * generated for.
   *
   * Set `extensionless` to `false` when `path` points to a file. Otherwise, set
   * it to `true`.
   *
   * @default true
   */
  extensionless: boolean;
};

/**
 * Represents a single mapping between a {@link RawAlias} and a {@link RawPath}.
 */
export type RawAliasMapping = [key: RawAlias, value: RawPath];

/**
 * Accepts partial {@link RawAlias} and {@link RawPath} objects and returns
 * proper {@link RawAlias} and {@link RawPath} objects as a key-value tuple.
 *
 * Note that `rawAlias` defaults to `{ prefix: 'exact', suffix: 'open',
 * extensionless: true }` while `rawPath` defaults to `{ prefix: 'root', suffix:
 * 'open' }`.
 */
export function makeRawAliasMapping(
  rawAlias: Partial<Omit<RawAlias, 'alias' | 'group' | 'regExp' | 'packageId'>> &
    Pick<RawAlias, 'alias' | 'group' | 'packageId'>,
  rawPath: Partial<Omit<RawPath, 'path'>> & Pick<RawPath, 'path'>
): RawAliasMapping;
export function makeRawAliasMapping(
  rawAlias_: Partial<Omit<RawAlias, 'alias' | 'group' | 'regExp' | 'packageId'>> &
    Pick<RawAlias, 'alias' | 'group' | 'packageId'>,
  rawPath_: Partial<Omit<RawPath, 'path'>> & Pick<RawPath, 'path'>
): RawAliasMapping {
  const rawAlias = {
    prefix: 'exact',
    suffix: 'open',
    ...rawAlias_
  } satisfies Omit<RawAlias, 'regExp'> as RawAlias;

  rawAlias.regExp = rawAliasToRegExp(rawAlias);

  const rawPath: RawPath = {
    prefix: 'root',
    suffix: 'open',
    extensionless: true,
    ...rawPath_
  };

  if (invalidAliasRegExp.test(rawAlias.alias)) {
    throw new ProjectError(
      ErrorMessage.IllegalAliasKeyInvalidCharacters(rawAlias.alias, invalidAliasRegExp)
    );
  }

  if (invalidPathRegExp.test(rawPath.path)) {
    throw new ProjectError(
      ErrorMessage.IllegalAliasValueInvalidCharacters(
        rawAlias.alias,
        rawPath.path,
        invalidPathRegExp
      )
    );
  }

  if (
    rawPath.path.startsWith('/') ||
    rawPath.path.startsWith('\\') ||
    rawPath.path.endsWith('/') ||
    rawPath.path.endsWith('\\') ||
    isLocalLookingRegExp.test(rawPath.path)
  ) {
    throw new ProjectError(
      ErrorMessage.IllegalAliasValueInvalidSeparatorAdfix(rawAlias.alias, rawPath.path)
    );
  }

  if (rawPath.suffix === 'open' && rawAlias.suffix !== 'open') {
    throw new ProjectError(ErrorMessage.IllegalAliasBadSuffix(rawAlias.alias));
  }

  return [rawAlias, rawPath] as const;
}

/**
 * Given `projectMetadata`, this function returns an array of
 * {@link RawAliasMapping} entries. Each entry maps an import specifier alias
 * ({@link RawAlias}) to a filesystem path ({@link RawPath}) used throughout
 * said project. Filesystem paths will always be generated as relative paths
 * with respect to the project root.
 *
 * Entries will be returned in standard verse order: multiverse > rootverse >
 * universe > testverse > typeverse. Entries within the same verse are sorted in
 * "specificity" order, meaning open-suffix aliases will have a chance to match
 * before exact-suffix aliases, and more specific open-suffix aliases will have
 * a chance to match before less-specific or catch-all open-suffix aliases.
 * Entries of the same "specificity" will then be natural sorted.
 *
 * Examples of supported aliases:
 * - `"universe"`                           (root ./index.ts)
 * - `"universe:some/path/index.ts"`        (root ./src/some/path/index.ts)
 * - `"multiverse+package-id"`              (package ./src/index.js)
 * - `"multiverse+package-id:some/path.js"` (package ./src/some/path.js)
 * - `"testverse:some/path.ts"`             (root ./test/some/path.ts)
 * - `"testverse+package-id:some/path.ts"`  (package ./test/some/path.ts)
 * - `"typeverse:global.ts"`                (root ./types/global.ts)
 * - `"rootverse:some/path.js"`             (root ./some/path.js)
 * - `"rootverse+package-id:some/path.ts"`  (package ./some/path.ts)
 *
 * @see https://github.com/Xunnamius/symbiote/wiki/Standard-Aliases
 */
export function generateRawAliasMap(
  projectMetadata: GenericProjectMetadata
): RawAliasMapping[] {
  // * Universe mappings support both root- and package- level, open and exact
  // * aliases
  const universeAliases: RawAliasMapping[] = [];

  // * Multiverse mappings only support package-level aliases (i.e. with
  // * uriSchemeSubDelimiter), both open and exact
  const multiverseAliases: RawAliasMapping[] = [];

  // * Testverse mappings support both root- and package- level open aliases
  const testverseAliases: RawAliasMapping[] = [];

  // * Typeverse mappings only support root-level open aliases (i.e. without
  // * uriSchemeSubDelimiter)
  const typeverseAliases: RawAliasMapping[] = [];

  // * Rootverse mappings support both root- and package- level open aliases
  const rootverseAliases: RawAliasMapping[] = [];

  const collator = new Intl.Collator(undefined, { numeric: true });
  const subRootPackagesSorted = projectMetadata.subRootPackages?.all.toSorted(
    ({ id: idA }, { id: idB }) => {
      // ? Natural sort using latest ES6/7 features!
      return collator.compare(idA, idB);
    }
  );

  // ! Order matters here due to string matching. Hence, non-root open suffix
  // ! (below, in conditional) always goes first.
  if (subRootPackagesSorted) {
    subRootPackagesSorted.forEach(function ({ id, relativeRoot }) {
      universeAliases.push(
        makeRawAliasMapping(
          {
            alias: `${WellKnownImportAlias.Universe}${uriSchemeSubDelimiterUnescaped}${id}`,
            group: WellKnownImportAlias.Universe,
            packageId: id
          },
          { path: toPath(relativeRoot, directorySrcPackageBase) }
        )
      );

      multiverseAliases.push(
        makeRawAliasMapping(
          {
            alias: `${WellKnownImportAlias.Multiverse}${uriSchemeSubDelimiterUnescaped}${id}`,
            group: WellKnownImportAlias.Multiverse,
            packageId: id
          },
          { path: toPath(relativeRoot, directorySrcPackageBase) }
        )
      );

      testverseAliases.push(
        makeRawAliasMapping(
          {
            alias: `${WellKnownImportAlias.Testverse}${uriSchemeSubDelimiterUnescaped}${id}`,
            group: WellKnownImportAlias.Testverse,
            packageId: id
          },
          { path: toPath(relativeRoot, directoryTestPackageBase) }
        )
      );

      rootverseAliases.push(
        makeRawAliasMapping(
          {
            alias: `${WellKnownImportAlias.Rootverse}${uriSchemeSubDelimiterUnescaped}${id}`,
            group: WellKnownImportAlias.Rootverse,
            packageId: id
          },
          { path: relativeRoot }
        )
      );
    });

    // ! Order matters here due to string matching. Hence, open suffix (above)
    // ! goes ahead of non-root exact suffix (below, in loop).
    subRootPackagesSorted.forEach(function ({ id, relativeRoot }) {
      universeAliases.push(
        makeRawAliasMapping(
          {
            alias: `${WellKnownImportAlias.Universe}${uriSchemeSubDelimiterUnescaped}${id}`,
            suffix: 'exact',
            group: WellKnownImportAlias.Universe,
            packageId: id
          },
          {
            path: toPath(relativeRoot, directorySrcPackageBase, 'index'),
            suffix: 'none',
            extensionless: false
          }
        )
      );

      multiverseAliases.push(
        makeRawAliasMapping(
          {
            alias: `${WellKnownImportAlias.Multiverse}${uriSchemeSubDelimiterUnescaped}${id}`,
            suffix: 'exact',
            group: WellKnownImportAlias.Multiverse,
            packageId: id
          },
          {
            path: toPath(relativeRoot, directorySrcPackageBase, 'index'),
            suffix: 'none',
            extensionless: false
          }
        )
      );
    });
  }

  // ! Order matters here due to string matching. Hence, open suffix (above) and
  // ! non-root exact suffix (also above) goes ahead of root open suffix
  // ! (below, always penultimate).

  rootverseAliases.push(
    makeRawAliasMapping(
      {
        alias: WellKnownImportAlias.Rootverse,
        group: WellKnownImportAlias.Rootverse,
        packageId: undefined
      },
      { path: toRelativePath('') }
    )
  );

  universeAliases.push(
    makeRawAliasMapping(
      {
        alias: WellKnownImportAlias.Universe,
        group: WellKnownImportAlias.Universe,
        packageId: undefined
      },
      { path: toRelativePath(directorySrcPackageBase) }
    )
  );

  testverseAliases.push(
    makeRawAliasMapping(
      {
        alias: WellKnownImportAlias.Testverse,
        group: WellKnownImportAlias.Testverse,
        packageId: undefined
      },
      { path: toRelativePath(directoryTestPackageBase) }
    )
  );

  typeverseAliases.push(
    makeRawAliasMapping(
      {
        alias: WellKnownImportAlias.Typeverse,
        group: WellKnownImportAlias.Typeverse,
        packageId: undefined
      },
      { path: toRelativePath(directoryTypesProjectBase) }
    )
  );

  // ! Order matters here due to string matching. Hence, everything goes ahead
  // ! of root exact suffix (below, always last).

  universeAliases.push(
    makeRawAliasMapping(
      {
        alias: WellKnownImportAlias.Universe,
        suffix: 'exact',
        group: WellKnownImportAlias.Universe,
        packageId: undefined
      },
      {
        path: toRelativePath(toPath(directorySrcPackageBase, 'index')),
        suffix: 'none',
        extensionless: false
      }
    )
  );

  // * Standard verse order:
  return [
    multiverseAliases,
    rootverseAliases,
    universeAliases,
    testverseAliases,
    typeverseAliases
  ].flat();
}

/**
 * Returns an object that can be plugged into
 * "babel-plugin-transform-rewrite-imports" Babel plugin configurations at
 * `replaceExtensions`.
 *
 * See also:
 * https://www.npmjs.com/package/babel-plugin-transform-rewrite-imports
 */
export function deriveAliasesForBabel(rawAliasMappings: readonly RawAliasMapping[]) {
  return Object.fromEntries(
    rawAliasMappings.map(([rawAlias, rawPath]) => {
      const aliasPrefix = rawAlias.prefix === 'exact' ? '^' : '';
      const aliasSuffix =
        rawAlias.suffix === 'exact'
          ? '$'
          : rawAlias.suffix === 'open'
            ? `${uriSchemeDelimiterEscaped}(.+)$`
            : '';

      const pathSuffix =
        (rawPath.suffix === 'open' ? '/$1' : '') + (rawPath.extensionless ? '' : '.js');

      return [
        aliasPrefix + escapeStringRegExp(rawAlias.alias) + aliasSuffix,
        '.' + (rawPath.path.length ? `/${rawPath.path}` : '') + pathSuffix
      ];
    })
  );
}

/**
 * Returns an array that can be plugged into ESLint configurations at
 * `settings['import/resolver'].alias.map`.
 *
 * See also: https://www.npmjs.com/package/eslint-import-resolver-alias
 */
export function deriveAliasesForEslint(rawAliasMappings: readonly RawAliasMapping[]) {
  return rawAliasMappings.map(([rawAlias, rawPath]) => {
    const aliasSuffix =
      rawAlias.suffix === 'open' ? `${uriSchemeDelimiterUnescaped}*` : '';
    const pathSuffix =
      (rawPath.suffix === 'open' ? '/*' : '') + (rawPath.extensionless ? '' : '.ts');

    return [
      rawAlias.alias + aliasSuffix,
      '.' + (rawPath.path.length ? `/${rawPath.path}` : '') + pathSuffix
    ];
  });
}

/**
 * Returns an object that can be plugged into Webpack configurations at
 * `resolve.alias`.
 *
 * See also: https://webpack.js.org/configuration/resolve/#resolvealias
 */
export function deriveAliasesForWebpack(
  rawAliasMappings: readonly RawAliasMapping[],
  projectRoot: string
) {
  return Object.fromEntries(
    rawAliasMappings.map(([rawAlias, rawPath]) => {
      const aliasSuffix = rawAlias.suffix === 'open' ? uriSchemeDelimiterUnescaped : '';
      const pathSuffix =
        (rawPath.suffix === 'open' ? '/' : '') + (rawPath.extensionless ? '' : '.ts');

      return [
        rawAlias.alias + aliasSuffix,
        projectRoot + (rawPath.path.length ? `/${rawPath.path}` : '') + pathSuffix
      ];
    })
  );
}

/**
 * Returns an object that can be plugged into NextJs configurations. Currently
 * only Webpack-based alias configurations are supported, making this function
 * identical to {@link getWebpackAliases}. This may change in the future given
 * the existence of SWC and related tooling in the Next.js ecosystem.
 *
 * See also: https://nextjs.org/docs/messages/invalid-resolve-alias
 */
export function deriveAliasesForNextJs(
  rawAliasMappings: readonly RawAliasMapping[],
  projectRoot: string
) {
  return Object.fromEntries(
    rawAliasMappings.map(([rawAlias, rawPath]) => {
      const aliasSuffix = rawAlias.suffix === 'open' ? uriSchemeDelimiterUnescaped : '';
      const pathSuffix =
        (rawPath.suffix === 'open' ? '/' : '') + (rawPath.extensionless ? '' : '.ts');

      return [
        rawAlias.alias + aliasSuffix,
        projectRoot + (rawPath.path.length ? `/${rawPath.path}` : '') + pathSuffix
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
export function deriveAliasesForJest(rawAliasMappings: readonly RawAliasMapping[]) {
  return Object.fromEntries(
    rawAliasMappings.map(([rawAlias, rawPath]) => {
      const aliasPrefix = rawAlias.prefix === 'exact' ? '^' : '';
      const aliasSuffix =
        rawAlias.suffix === 'exact'
          ? '$'
          : rawAlias.suffix === 'open'
            ? `${uriSchemeDelimiterEscaped}(.+)$`
            : '';

      const pathSuffix =
        (rawPath.suffix === 'open' ? '/$1' : '') + (rawPath.extensionless ? '' : '.ts');

      return [
        aliasPrefix + escapeStringRegExp(rawAlias.alias) + aliasSuffix,
        '<rootDir>' + (rawPath.path.length ? `/${rawPath.path}` : '') + pathSuffix
      ];
    })
  );
}

/**
 * Returns an object that can be plugged into TypeScript project configurations
 * at `compilerOptions.paths`.
 *
 * See also: https://www.typescriptlang.org/tsconfig/#paths
 */
export function deriveAliasesForTypeScript(
  rawAliasMappings: readonly RawAliasMapping[]
) {
  return Object.fromEntries(
    rawAliasMappings.map(([rawAlias, rawPath]) => {
      const aliasSuffix =
        rawAlias.suffix === 'open' ? `${uriSchemeDelimiterUnescaped}*` : '';
      const pathSuffix =
        (rawPath.suffix === 'open' ? '*' : '') + (rawPath.extensionless ? '' : '.ts');

      return [
        rawAlias.alias + aliasSuffix,
        [
          rawPath.path +
            (rawPath.path.length && pathSuffix.startsWith('*')
              ? `/${pathSuffix}`
              : pathSuffix)
        ]
      ];
    })
  );
}

/**
 * Accepts a _raw `specifier`_ and returns the first matching
 * {@link RawAliasMapping} (in precedence order) or `undefined` if `specifier`
 * does not match any `rawAliasMappings`
 *
 * A "raw `specifier`" is the specifier string of an import statement before it
 * has been resolved to an actual filesystem path.
 */
export function mapRawSpecifierToRawAliasMapping(
  rawAliasMappings: readonly RawAliasMapping[],
  specifier: string
): RawAliasMapping | undefined {
  return rawAliasMappings.find(([{ regExp: aliasRegExp }]) => {
    return aliasRegExp.test(specifier);
  });
}

/**
 * Accepts a _raw `specifier`_ and returns an "bare" {@link RelativePath} (in
 * that it does not begin with "./") to a theoretical location on the filesystem
 * or `undefined` if `specifier` does not match any `rawAliasMappings`.
 *
 * The path returned by this function is always relative to the project root.
 *
 * A "raw `specifier`" is the specifier string of an import statement before it
 * has been resolved to a real filesystem path (such as by this function).
 */
export function mapRawSpecifierToPath(
  rawAliasMappings: Arrayable<RawAliasMapping>,
  specifier: string,
  {
    extensionToAppend = '.ts'
  }: {
    /**
     * For alias raw paths configured with `extensionless === false`, this is
     * the extension that will be appended to the final path. Should begin with
     * a "." character.
     *
     * @default ".ts"
     */
    extensionToAppend?: string;
  } = {}
): RelativePath | undefined {
  const rawAlias = isRawAliasMapping(rawAliasMappings)
    ? rawAliasMappings
    : mapRawSpecifierToRawAliasMapping(rawAliasMappings, specifier);

  if (rawAlias) {
    const [{ regExp }, { path, suffix: pathSuffix, extensionless }] = rawAlias;
    const extension = extensionless ? '' : extensionToAppend || '';
    const specifierPathComponent =
      pathSuffix === 'open' ? specifier.match(regExp)!.at(-1)! : '';

    return (toPath(path, specifierPathComponent) + extension) as RelativePath;
  }

  return undefined;
}

/**
 * This function throws if the given specifier violates any general symbiote
 * project invariants with respect to the given {@link RawAliasMapping}s.
 */
export function ensureRawSpecifierOk(
  rawAliasMappings: Arrayable<RawAliasMapping>,
  specifier: string,
  {
    allowMultiversalImports,
    allowForeignUniversalImports,
    allowTestversalImports,
    allowRootverseNodeModules,
    packageId,
    extensionToAppend = '.ts',
    containingFilePath
  }: {
    /**
     * Unless `true`, if a multiverse import not belonging to `packageId` is
     * encountered, this function will throw.
     *
     * Note that multiversal testverse and typeverse imports, while technically
     * multiversal imports, are _never_ governed by this property.
     */
    allowMultiversalImports: boolean;
    /**
     * Unless `true`, if `packageId` is defined and a universe import not
     * belonging to `packageId` is encountered, this function will throw.
     *
     * Note that foreign universal imports are a type of multiversal import and
     * as such are additionally governed by `allowMultiversalImports`.
     */
    allowForeignUniversalImports: boolean;
    /**
     * Unless `true`, if a testverse import is encountered, this function will
     * throw.
     *
     * Note that multiversal testverse imports, while technically a type of
     * multiversal import, are _never_ governed by `allowMultiversalImports`.
     */
    allowTestversalImports: boolean;
    /**
     * Unless `true`, if a rootverse import precariously referencing
     * node_modules is encountered, this function will throw.
     *
     * Note that multiversal rootverse imports of node_modules are a type of
     * multiversal import and as such are additionally governed by
     * `allowMultiversalImports`.
     */
    allowRootverseNodeModules: boolean;
    /**
     * Since it is ill-advised to make universe imports from within a sub-root,
     * such imports should not be seen when we're building distributables for a
     * workspace package. If `packageId` is not `undefined`, this check will be
     * enabled.
     *
     * Additionally, defining `packageId` enables multiverse self-reference
     * checks to ensure a sub-root is not using a multiverse alias to import its
     * own files, which is suboptimal.
     */
    packageId?: WorkspacePackageId;
    /**
     * This is the extension potentially appended to `specifier` if alias raw
     * path was configured with `extensionless === false`. Should begin with a
     * "." character.
     *
     * This value is used only to check for bad index imports and is so named
     * for consistency's sake. No appending of extensions is performed by this
     * function.
     *
     * @default ".ts"
     */
    extensionToAppend?: string;
    /**
     * A string representing the file containing the alias that, if given, will
     * be included in any exceptions thrown by this function.
     */
    containingFilePath?: string;
  }
) {
  // ? Fail if it is empty
  if (!specifier) {
    throw new ProjectError(
      ErrorMessage.SpecifierNotOkEmpty(specifier, containingFilePath)
    );
  }

  // ? Fail if it begins with ./ or ../ or / or is . or ..
  if (specifier.startsWith('/') || isLocalLookingRegExp.test(specifier)) {
    throw new ProjectError(
      ErrorMessage.SpecifierNotOkRelative(specifier, containingFilePath)
    );
  }

  const [rawAlias, rawPath] = isRawAliasMapping(rawAliasMappings)
    ? rawAliasMappings
    : mapRawSpecifierToRawAliasMapping(rawAliasMappings, specifier) || [];

  if (!rawAlias || !rawPath) {
    return;
  }

  const specifierPathComponent =
    rawAlias.suffix === 'open' ? specifier.match(rawAlias.regExp)?.at(-1) : undefined;

  // ? Fail if the path component begins with ./ or ../ or / or is . or ..
  if (
    specifierPathComponent &&
    (specifierPathComponent.startsWith('/') ||
      isLocalLookingRegExp.test(specifierPathComponent))
  ) {
    throw new ProjectError(
      ErrorMessage.SpecifierNotOkRelative(specifier, containingFilePath)
    );
  }

  const isForeign = packageId !== rawAlias.packageId;

  const isMultiversal =
    rawAlias.group === WellKnownImportAlias.Multiverse ||
    (isForeign &&
      (rawAlias.group === WellKnownImportAlias.Rootverse ||
        rawAlias.group === WellKnownImportAlias.Universe));

  const isTestversal =
    rawAlias.group === WellKnownImportAlias.Testverse ||
    (rawAlias.group === WellKnownImportAlias.Rootverse &&
      specifierPathComponent?.startsWith(`${directoryTestPackageBase}/`));

  const isTypeversal =
    rawAlias.group === WellKnownImportAlias.Typeverse ||
    (rawAlias.group === WellKnownImportAlias.Rootverse &&
      rawAlias.packageId === undefined &&
      specifierPathComponent?.startsWith(`${directoryTypesProjectBase}/`));

  // ? Fail if allowForeignUniversalImports is false, universe encountered, and
  // ? packageId does not match the alias's packageId
  if (
    !allowForeignUniversalImports &&
    isForeign &&
    rawAlias.group === WellKnownImportAlias.Universe
  ) {
    throw new ProjectError(
      ErrorMessage.SpecifierNotOkVerseNotAllowed(
        `foreign ${rawAlias.group}` +
          (rawAlias.packageId ? ` (${rawAlias.packageId})` : ''),
        specifier,
        containingFilePath
      )
    );
  }

  // ? Fail if allowTestversalImports is false and testverse encountered
  if (!allowTestversalImports && isTestversal) {
    throw new ProjectError(
      ErrorMessage.SpecifierNotOkVerseNotAllowed(
        rawAlias.group === WellKnownImportAlias.Testverse
          ? rawAlias.group
          : `testversal ${rawAlias.group}`,
        specifier,
        containingFilePath
      )
    );
  }

  // ? Fail if multiverse or rootverse import used self-referentially
  // ! This check should happen before the more generic isMultiversal check
  if (isMultiversal && !isForeign) {
    throw new ProjectError(
      ErrorMessage.SpecifierNotOkSelfReferential(specifier, containingFilePath)
    );
  }

  // ? Fail if allowMultiversalImports is false and multiversal import
  // ? encountered
  if (!allowMultiversalImports && isMultiversal && !isTypeversal && !isTestversal) {
    throw new ProjectError(
      ErrorMessage.SpecifierNotOkVerseNotAllowed(
        rawAlias.group === WellKnownImportAlias.Multiverse
          ? rawAlias.group
          : `multiversal ${rawAlias.group}`,
        specifier,
        containingFilePath
      )
    );
  }

  // ? Fail if the alias suffix is "open" & the specifier is missing an
  // ? extension
  if (
    rawAlias.suffix === 'open' &&
    specifierPathComponent &&
    !extname(specifierPathComponent)
  ) {
    throw new ProjectError(
      ErrorMessage.SpecifierNotOkMissingExtension(specifier, containingFilePath)
    );
  }

  // ? Fail if the specifier === "index.extensionToAppend"
  if (specifier.endsWith(`${uriSchemeDelimiterUnescaped}index${extensionToAppend}`)) {
    throw new ProjectError(
      ErrorMessage.SpecifierNotOkUnnecessaryIndex(specifier, containingFilePath)
    );
  }

  // ? Fail if rootverse import used when another verse would be more optimal
  if (specifierPathComponent && rawAlias.group === WellKnownImportAlias.Rootverse) {
    const pathSplit = specifierPathComponent.split('/').slice(1).join('/');
    const errorSuffix =
      (rawAlias.packageId !== undefined
        ? `${uriSchemeSubDelimiterUnescaped}${rawAlias.packageId}`
        : '') + (pathSplit.length ? `${uriSchemeDelimiterUnescaped}${pathSplit}` : '');

    if (specifierPathComponent.startsWith(`${directorySrcPackageBase}/`)) {
      throw new ProjectError(
        ErrorMessage.SpecifierNotOkSuboptimal(
          specifier,
          (isForeign ? WellKnownImportAlias.Multiverse : WellKnownImportAlias.Universe) +
            errorSuffix,
          containingFilePath
        )
      );
    } else if (isTestversal) {
      throw new ProjectError(
        ErrorMessage.SpecifierNotOkSuboptimal(
          specifier,
          WellKnownImportAlias.Testverse + errorSuffix,
          containingFilePath
        )
      );
    } else if (isTypeversal) {
      throw new ProjectError(
        ErrorMessage.SpecifierNotOkSuboptimal(
          specifier,
          WellKnownImportAlias.Typeverse + errorSuffix,
          containingFilePath
        )
      );
    } else if (
      rawAlias.packageId === undefined &&
      specifierPathComponent.startsWith(`${directoryPackagesProjectBase}/`)
    ) {
      // ? Shadows the variable of the same name from the higher context
      const pathSplit = specifierPathComponent
        .split(`${directoryPackagesProjectBase}/`)
        .at(-1)!
        .split('/');

      const derivedPackageId = pathSplit.at(0)!;
      const verseHint = pathSplit.at(1);

      // * By this point, we know the import isn't multiversal IF multiversal
      // * is not allowed
      const verse =
        verseHint === directorySrcPackageBase
          ? derivedPackageId === packageId
            ? WellKnownImportAlias.Universe
            : WellKnownImportAlias.Multiverse
          : verseHint === directoryTestPackageBase
            ? WellKnownImportAlias.Testverse
            : WellKnownImportAlias.Rootverse;

      throw new ProjectError(
        ErrorMessage.SpecifierNotOkSuboptimal(
          specifier,
          (verse === WellKnownImportAlias.Multiverse && !allowMultiversalImports) ||
            (verse === WellKnownImportAlias.Testverse && !allowTestversalImports)
            ? undefined
            : `${verse}${uriSchemeSubDelimiterUnescaped}${
                derivedPackageId
              }${uriSchemeDelimiterUnescaped}${pathSplit
                .slice(verse === WellKnownImportAlias.Rootverse ? 1 : 2)
                .join('/')}`,
          containingFilePath
        )
      );
    } else if (
      !allowRootverseNodeModules &&
      specifierPathComponent.startsWith('node_modules/')
    ) {
      throw new ProjectError(
        ErrorMessage.SpecifierNotOkSuboptimal(specifier, undefined, containingFilePath)
      );
    }
  }
}

/**
 * Takes a {@link RawAlias} partial and returns a regular expression that can be
 * matched against specifier strings. If `suffix` is `"open"`, the returned
 * expression will include a single matching group containing the full specifier
 * path without modification.
 *
 * Any RegExp control characters in `alias` will be escaped.
 */
export function rawAliasToRegExp({
  prefix,
  alias,
  suffix
}: Omit<RawAlias, 'regExp'>): RegExp {
  return new RegExp(
    `${prefix === 'exact' ? '^' : ''}${escapeStringRegExp(alias)}${suffix === 'exact' ? '$' : suffix === 'open' ? `${uriSchemeDelimiterEscaped}(.+)$` : ''}`
  );
}

function isRawAliasMapping(o: unknown): o is RawAliasMapping {
  return (
    Array.isArray(o) &&
    o.length === 2 &&
    o[0] &&
    o[1] &&
    !Array.isArray(o[0]) &&
    !Array.isArray(o[1])
  );
}
