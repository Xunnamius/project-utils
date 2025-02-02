[**@-xun/project**](../../README.md)

***

[@-xun/project](../../README.md) / [src](../README.md) / ReadJsoncOptions

# Type Alias: ReadJsoncOptions

> **ReadJsoncOptions**: `object`

Defined in: packages/fs/dist/packages/fs/src/system/read-jsonc.d.ts:9

## Type declaration

### ignoreNonExceptionErrors?

> `optional` **ignoreNonExceptionErrors**: `boolean`

If `true`, so long as the `parse` function does not throw, this function
will return the result. Note that this could result in an incomplete or
corrupted (but syntactically sound) object.

#### Default

```ts
false
```

### parseOptions?

> `optional` **parseOptions**: `Parameters`\<*typeof* [`parse`](../namespaces/JSONC/functions/parse.md)\>\[`2`\]

#### See

[JSONC.parse](../namespaces/JSONC/functions/parse.md)

### try?

> `optional` **try**: `boolean`

If `true`, an attempt will be made to read in and parse the JSON file. If
it fails (i.e. an error is thrown), `{}` is returned and no error is
thrown.

Note that, currently, fail results (where `{}` is returned) are not cached.

#### Default

```ts
false
```

### useCached

> **useCached**: `boolean`

Use the internal cached result from a previous run, if available.

Unless `useCached` is `false`, the results returned by this function will
always strictly equal (`===`) each other with respect to call signature.

#### See

cache

## See

[readJsonc](../functions/readJsonc.md)
