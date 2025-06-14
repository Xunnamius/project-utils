[**@-xun/project-graph**](../../../README.md)

***

[@-xun/project-graph](../../../README.md) / [analysis/gather-project-files](../README.md) / GatherProjectFilesOptions

# Type Alias: GatherProjectFilesOptions

> **GatherProjectFilesOptions** = `object` & \{ `skipPrettierIgnored`: `false`; `skipUnknown?`: `false`; \} \| \{ `skipPrettierIgnored?`: `true`; `skipUnknown?`: `boolean`; \}

Defined in: [packages/graph/src/analysis/gather-project-files.ts:27](https://github.com/Xunnamius/projector/blob/e9ee21374a7ed831ce875c6adff409f48ae6e839/packages/graph/src/analysis/gather-project-files.ts#L27)

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
