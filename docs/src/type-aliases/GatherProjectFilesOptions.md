[**@-xun/project**](../../README.md)

***

[@-xun/project](../../README.md) / [src](../README.md) / GatherProjectFilesOptions

# Type Alias: GatherProjectFilesOptions

> **GatherProjectFilesOptions**: `object` & \{ `skipPrettierIgnored`: `false`; `skipUnknown`: `false`; \} \| \{ `skipPrettierIgnored`: `true`; `skipUnknown`: `boolean`; \}

Defined in: packages/graph/dist/packages/graph/src/analysis/gather-project-files.d.ts:7

## Type declaration

### ignoreUnsupportedFeatures?

> `optional` **ignoreUnsupportedFeatures**: `boolean`

Will not error if an interesting `package.json` file uses unsupported
features.

### useCached

> **useCached**: `boolean`

Use the internal cached result from a previous run, if available.

Unless `useCached` is `false`, the results returned by this function will
always strictly equal (`===`) each other with respect to call signature.

#### See

cache

## See

[gatherProjectFiles](../functions/gatherProjectFiles.md)
