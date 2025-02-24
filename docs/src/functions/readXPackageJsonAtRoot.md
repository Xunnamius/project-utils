[**@-xun/project**](../../README.md)

***

[@-xun/project](../../README.md) / [src](../README.md) / readXPackageJsonAtRoot

# Function: readXPackageJsonAtRoot()

## Call Signature

> **readXPackageJsonAtRoot**(`path`, `options`): `Promise`\<[`XPackageJson`](../type-aliases/XPackageJson.md)\>

Defined in: packages/fs/dist/packages/fs/src/system/read-xpackage-json-at-root.d.ts:36

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

`Promise`\<[`XPackageJson`](../type-aliases/XPackageJson.md)\>

### See

[readJson](../namespaces/readJson/README.md) (the function that actually does the reading/caching)

## Call Signature

> **readXPackageJsonAtRoot**(`path`, `options`): `Promise`\<`EmptyObject` \| [`XPackageJson`](../type-aliases/XPackageJson.md)\>

Defined in: packages/fs/dist/packages/fs/src/system/read-xpackage-json-at-root.d.ts:39

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

`Promise`\<`EmptyObject` \| [`XPackageJson`](../type-aliases/XPackageJson.md)\>

### See

[readJson](../namespaces/readJson/README.md) (the function that actually does the reading/caching)
