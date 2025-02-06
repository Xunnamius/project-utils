[**@-xun/project-fs**](../../../../../README.md)

***

[@-xun/project-fs](../../../../../README.md) / [system/read-xpackage-json-at-root](../../../README.md) / [readXPackageJsonAtRoot](../README.md) / sync

# Function: sync()

> **sync**(...`arguments_`): `Omit`\<`OmitIndexSignature`\<`PackageJson`\>, `"bin"` \| `"name"`\> & `object`

Defined in: [packages/fs/src/system/read-xpackage-json-at-root.ts:99](https://github.com/Xunnamius/projector/blob/d4cf8eeb9fc68bed9fcdc6582a854ec38ada9801/packages/fs/src/system/read-xpackage-json-at-root.ts#L99)

Synchronously read in and parse the contents of a package.json file.

**NOTE: the result of this function is memoized! This does NOT
_necessarily_ mean results will strictly equal each other. See `useCached`
in this specific function's options for details.** To fetch fresh results,
set the `useCached` option to `false` or clear the internal cache with
`cache.clear`.

## Parameters

### arguments\_

...\[`AbsolutePath`, [`ReadXPackageJsonAtRootOptions`](../../../type-aliases/ReadXPackageJsonAtRootOptions.md)\]

## Returns

`Omit`\<`OmitIndexSignature`\<`PackageJson`\>, `"bin"` \| `"name"`\> & `object`

## See

[readJson](../../../../read-json/functions/readJson.md) (the function that actually does the reading/caching)
