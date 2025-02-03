[**@-xun/project-fs**](../../../README.md)

***

[@-xun/project-fs](../../../README.md) / [system/read-xpackage-json-at-root](../README.md) / readXPackageJsonAtRoot

# Function: readXPackageJsonAtRoot()

> **readXPackageJsonAtRoot**(...`args`): `Promise`\<`XPackageJson`\>

Defined in: [packages/fs/src/system/read-xpackage-json-at-root.ts:80](https://github.com/Xunnamius/projector/blob/f1c4cd0ac601a9a5f65f41d830f0ce9a716e9d77/packages/fs/src/system/read-xpackage-json-at-root.ts#L80)

Asynchronously read in and parse the contents of a package.json file.

**NOTE: the result of this function is memoized! This does NOT _necessarily_
mean results will strictly equal each other. See `useCached` in this specific
function's options for details.** To fetch fresh results, set the `useCached`
option to `false` or clear the internal cache with `cache.clear`.

## Parameters

### args

...\[`AbsolutePath`, [`ReadXPackageJsonAtRootOptions`](../type-aliases/ReadXPackageJsonAtRootOptions.md)\]

## Returns

`Promise`\<`XPackageJson`\>

## See

[readJson](../../read-json/functions/readJson.md) (the function that actually does the reading/caching)
