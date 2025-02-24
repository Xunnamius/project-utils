[**@-xun/project-fs**](../../../README.md)

***

[@-xun/project-fs](../../../README.md) / [system/read-xpackage-json-at-root](../README.md) / readXPackageJsonAtRoot

# Function: readXPackageJsonAtRoot()

## Call Signature

> **readXPackageJsonAtRoot**(`path`, `options`): `Promisable`\<`XPackageJson`\>

Defined in: [packages/fs/src/system/read-xpackage-json-at-root.ts:113](https://github.com/Xunnamius/projector/blob/af2aba5aa55ae25931180f8845a9a815a4bb9eeb/packages/fs/src/system/read-xpackage-json-at-root.ts#L113)

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

`Promisable`\<`XPackageJson`\>

### See

[readJson](../../read-json/functions/readJson.md) (the function that actually does the reading/caching)

## Call Signature

> **readXPackageJsonAtRoot**(`path`, `options`): `Promisable`\<`EmptyObject` \| `XPackageJson`\>

Defined in: [packages/fs/src/system/read-xpackage-json-at-root.ts:117](https://github.com/Xunnamius/projector/blob/af2aba5aa55ae25931180f8845a9a815a4bb9eeb/packages/fs/src/system/read-xpackage-json-at-root.ts#L117)

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

`Promisable`\<`EmptyObject` \| `XPackageJson`\>

### See

[readJson](../../read-json/functions/readJson.md) (the function that actually does the reading/caching)
