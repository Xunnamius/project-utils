import assert from 'node:assert';

import { cache, CacheScope } from '@-xun/cache';
import { type AbsolutePath } from '@-xun/fs';
import { type PluginObj, type TransformOptions } from '@babel/core';

import {
  createMetadataAccumulatorPlugin,
  type Options as AccumulatorOptions,
  type PluginAndAccumulator
} from 'babel-plugin-metadata-accumulator';

import { ProjectError } from 'multiverse+common:error.ts';

import { commonDebug } from 'universe+graph:common.ts';
import { hasExtensionAcceptedByBabel } from 'universe+graph:constant.ts';
import { GraphErrorMessage } from 'universe+graph:error.ts';

import { type ParametersNoFirst, type SyncVersionOf } from 'typeverse:global.ts';

import type { Promisable } from 'type-fest';

const debug = commonDebug.extend('gatherImportEntriesFromFiles');

/**
 * An entry mapping an absolute file path to a single import/require specifier
 * present in said file. This specifier may or may not form part of a type-only
 * import.
 */
export type ImportSpecifier = [filepath: AbsolutePath, specifier: string];

/**
 * An entry mapping an absolute file path to two sets of import/require
 * specifiers present in said file: "normal" imports and "type-only" imports.
 *
 * @see {@link gatherImportEntriesFromFiles}
 */
export type ImportSpecifiersEntry = [
  filepath: AbsolutePath,
  specifiers: { normal: Set<string>; typeOnly: Set<string> }
];

/**
 * @see {@link gatherImportEntriesFromFiles}
 */
export type GatherImportEntriesFromFilesOptions = AccumulatorOptions & {
  /**
   * Use the internal cached result from a previous run, if available.
   *
   * **WARNING: the results returned by this function, while functionally
   * identical to each other, will _NOT_ strictly equal (`===`) each other.**
   * However, each {@link ImportSpecifiersEntry} tuple within the returned
   * results _will_ strictly equal each other, respectively.
   *
   * @see {@link cache}
   */
  useCached: boolean;
};

function gatherImportEntriesFromFiles_(
  shouldRunSynchronously: false,
  files: AbsolutePath[],
  options: GatherImportEntriesFromFilesOptions
): Promise<ImportSpecifiersEntry[]>;
function gatherImportEntriesFromFiles_(
  shouldRunSynchronously: true,
  files: AbsolutePath[],
  options: GatherImportEntriesFromFilesOptions
): ImportSpecifiersEntry[];
function gatherImportEntriesFromFiles_(
  shouldRunSynchronously: boolean,
  files: AbsolutePath[],
  options: GatherImportEntriesFromFilesOptions
): Promisable<ImportSpecifiersEntry[]> {
  const { useCached, ...cacheIdComponentsObject } = options;
  debug('evaluating files: %O', files);

  let babel: ReturnType<typeof getBabel>;
  let plugin: PluginAndAccumulator['plugin'];
  let accumulator: PluginAndAccumulator['accumulator'];

  if (shouldRunSynchronously) {
    const importSpecifiersEntries = files.map((path, index) => {
      const dbg = debug.extend(`file-${index}`);
      dbg('evaluating file: %O', path);

      if (hasExtensionAcceptedByBabel(path)) {
        if (useCached) {
          const cachedEntry = cache.get(CacheScope.GatherImportEntriesFromFiles, [
            path,
            cacheIdComponentsObject
          ]);

          if (cachedEntry) {
            dbg('reusing cached resources: %O', cachedEntry);
            return cachedEntry;
          }
        }

        dbg('using babel to evaluate source file imports');

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!babel) {
          babel = getBabel();
        }

        if (!plugin || !accumulator) {
          ({ plugin, accumulator } = createMetadataAccumulatorPlugin());
        }

        babel.transformFileSync(path, makeMinimalBabelConfigObject(plugin, options));

        const { imports } = accumulator.get(path) || {};
        assert(imports, GraphErrorMessage.GuruMeditation());

        dbg('normal imports seen (%O): %O', imports.normal.size, imports.normal);
        dbg('type-only imports seen (%O): %O', imports.typeOnly.size, imports.typeOnly);

        const entry: ImportSpecifiersEntry = [path, imports];

        cache.set(
          CacheScope.GatherImportEntriesFromFiles,
          [path, cacheIdComponentsObject],
          entry
        );

        return entry;
      } else {
        dbg('skipped using babel to evaluate asset');
        return [
          path,
          { normal: new Set(), typeOnly: new Set() }
        ] satisfies ImportSpecifiersEntry;
      }
    });

    debug('import specifiers: %O', importSpecifiersEntries);
    return importSpecifiersEntries;
  } else {
    return Promise.resolve().then(async () => {
      const importSpecifiersEntries = await Promise.all(
        files.map(async (path, index) => {
          const dbg = debug.extend(`file-${index}`);
          dbg('evaluating file: %O', path);

          if (hasExtensionAcceptedByBabel(path)) {
            if (useCached) {
              const cachedEntry = cache.get(CacheScope.GatherImportEntriesFromFiles, [
                path,
                cacheIdComponentsObject
              ]);

              if (cachedEntry) {
                dbg('reusing cached resources: %O', cachedEntry);
                return cachedEntry;
              }
            }

            dbg('using babel to evaluate source file imports');

            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            if (!babel) {
              babel = getBabel();
            }

            if (!plugin || !accumulator) {
              ({ plugin, accumulator } = createMetadataAccumulatorPlugin());
            }

            await babel.transformFileAsync(
              path,
              makeMinimalBabelConfigObject(plugin, options)
            );

            const { imports } = accumulator.get(path) || {};
            assert(imports, GraphErrorMessage.GuruMeditation());

            dbg('normal imports seen (%O): %O', imports.normal.size, imports.normal);
            dbg(
              'type-only imports seen (%O): %O',
              imports.typeOnly.size,
              imports.typeOnly
            );

            const entry: ImportSpecifiersEntry = [path, imports];

            cache.set(
              CacheScope.GatherImportEntriesFromFiles,
              [path, cacheIdComponentsObject],
              entry
            );

            return entry;
          } else {
            dbg('skipped using babel to evaluate asset');
            return [
              path,
              { normal: new Set(), typeOnly: new Set() }
            ] satisfies ImportSpecifiersEntry;
          }
        })
      );

      debug('import specifiers: %O', importSpecifiersEntries);
      return importSpecifiersEntries;
    });
  }
}

/**
 * Accepts zero or more file paths and asynchronously returns an array of
 * {@link ImportSpecifiersEntry}s each mapping a given file path to an array of
 * import/require specifiers present in said file.
 *
 * This function relies on Babel internally and ignores all configuration files.
 * All paths passed to this function that cannot be parsed as TSX/TS/JS (via
 * extension check) will be treated as if they have 0 imports.
 *
 * **NOTE: the result of this function is memoized! This does NOT _necessarily_
 * mean results will strictly equal each other. See `useCached` in this specific
 * function's options for details.** To fetch fresh results, set the `useCached`
 * option to `false` or clear the internal cache with {@link cache.clear}.
 */
export function gatherImportEntriesFromFiles(
  ...args: ParametersNoFirst<typeof gatherImportEntriesFromFiles_>
) {
  return gatherImportEntriesFromFiles_(false, ...args);
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace gatherImportEntriesFromFiles {
  /**
   * Accepts zero or more file paths and synchronously returns an array of
   * {@link ImportSpecifiersEntry}s each mapping a given file path to an array
   * of import/require specifiers present in said file.
   *
   * This function relies on Babel internally and ignores all configuration
   * files. All paths passed to this function that cannot be parsed as TSX/TS/JS
   * (via extension check) will be treated as if they have 0 imports.
   *
   * **NOTE: the result of this function is memoized! This does NOT
   * _necessarily_ mean results will strictly equal each other. See `useCached`
   * in this specific function's options for details.** To fetch fresh results,
   * set the `useCached` option to `false` or clear the internal cache with
   * {@link cache.clear}.
   */
  export const sync = function (...args) {
    return gatherImportEntriesFromFiles_(true, ...args);
  } as SyncVersionOf<typeof gatherImportEntriesFromFiles>;
}

function getBabel() {
  try {
    // ? Ensure these are importable
    //void require('@babel/plugin-syntax-import-attributes');
    void require('@babel/plugin-syntax-typescript');
    // ? Return what we're really interested in
    return require('@babel/core') as typeof import('@babel/core');
  } catch (error) {
    debug('failed to import @babel/core: %O', error);
    throw new ProjectError(
      GraphErrorMessage.MissingOptionalBabelDependency('gatherImportEntriesFromFiles')
    );
  }
}

function makeMinimalBabelConfigObject(
  plugin: PluginObj,
  pluginOptions: AccumulatorOptions
): TransformOptions {
  return {
    configFile: false,
    generatorOpts: { importAttributesKeyword: 'with' },
    plugins: [
      //'@babel/plugin-syntax-import-attributes',
      [
        '@babel/plugin-syntax-typescript',
        { disallowAmbiguousJSXLike: false, isTSX: true }
      ],
      [plugin, pluginOptions]
    ]
  };
}
