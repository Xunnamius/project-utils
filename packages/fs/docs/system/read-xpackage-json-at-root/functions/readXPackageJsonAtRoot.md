[**@-xun/project-fs**](../../../README.md)

***

[@-xun/project-fs](../../../README.md) / [system/read-xpackage-json-at-root](../README.md) / readXPackageJsonAtRoot

# Function: readXPackageJsonAtRoot()

## Call Signature

> **readXPackageJsonAtRoot**(`path`, `options`): `Promise`\<`XPackageJson`\>

Defined in: [packages/fs/src/system/read-xpackage-json-at-root.ts:113](https://github.com/Xunnamius/projector/blob/124f6e6b6e700d669a6e7832c4ad15585be7dc80/packages/fs/src/system/read-xpackage-json-at-root.ts#L113)

Asynchronously read in and parse the contents of a package.json file.

**NOTE: the result of this function is memoized! This does NOT _necessarily_
mean results will strictly equal each other. See `useCached` in this specific
function's options for details.** To fetch fresh results, set the `useCached`
option to `false` or clear the internal cache with `cache.clear`.

### Parameters

#### path

`AbsolutePath`

#### options

[`ReadXPackageJsonAtRootOptions`](../type-aliases/ReadXPackageJsonAtRootOptions.md) & `object`

### Returns

`Promise`\<`XPackageJson`\>

### See

[readJson](../../read-json/functions/readJson.md) (the function that actually does the reading/caching)

## Call Signature

> **readXPackageJsonAtRoot**(`path`, `options`): `Promise`\<`EmptyObject` \| `XPackageJson`\>

Defined in: [packages/fs/src/system/read-xpackage-json-at-root.ts:117](https://github.com/Xunnamius/projector/blob/124f6e6b6e700d669a6e7832c4ad15585be7dc80/packages/fs/src/system/read-xpackage-json-at-root.ts#L117)

Asynchronously read in and parse the contents of a package.json file.

**NOTE: the result of this function is memoized! This does NOT _necessarily_
mean results will strictly equal each other. See `useCached` in this specific
function's options for details.** To fetch fresh results, set the `useCached`
option to `false` or clear the internal cache with `cache.clear`.

### Parameters

#### path

`AbsolutePath`

#### options

[`ReadXPackageJsonAtRootOptions`](../type-aliases/ReadXPackageJsonAtRootOptions.md)

### Returns

`Promise`\<`EmptyObject` \| `XPackageJson`\>

### See

[readJson](../../read-json/functions/readJson.md) (the function that actually does the reading/caching)
