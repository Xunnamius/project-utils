[**@-xun/project-fs**](../../../README.md)

***

[@-xun/project-fs](../../../README.md) / [system/read-jsonc](../README.md) / ReadJsoncOptions

# Type Alias: ReadJsoncOptions

> **ReadJsoncOptions**: `object`

Defined in: [packages/fs/src/system/read-jsonc.ts:21](https://github.com/Xunnamius/projector/blob/f1c4cd0ac601a9a5f65f41d830f0ce9a716e9d77/packages/fs/src/system/read-jsonc.ts#L21)

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

> `optional` **parseOptions**: `Parameters`\<*typeof* [`parse`](../../../index/namespaces/JSONC/functions/parse.md)\>\[`2`\]

#### See

[JSONC.parse](../../../index/namespaces/JSONC/functions/parse.md)

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
