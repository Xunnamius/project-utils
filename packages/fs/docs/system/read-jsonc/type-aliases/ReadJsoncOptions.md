[**@-xun/project-fs**](../../../README.md)

***

[@-xun/project-fs](../../../README.md) / [system/read-jsonc](../README.md) / ReadJsoncOptions

# Type Alias: ReadJsoncOptions

> **ReadJsoncOptions** = `object`

Defined in: [packages/fs/src/system/read-jsonc.ts:24](https://github.com/Xunnamius/projector/blob/2bfbc9e75e2a22c1cf17e80270873165bc38b0c9/packages/fs/src/system/read-jsonc.ts#L24)

## See

[readJsonc](../functions/readJsonc.md)

## Properties

### ignoreNonExceptionErrors?

> `optional` **ignoreNonExceptionErrors**: `boolean`

Defined in: [packages/fs/src/system/read-jsonc.ts:32](https://github.com/Xunnamius/projector/blob/2bfbc9e75e2a22c1cf17e80270873165bc38b0c9/packages/fs/src/system/read-jsonc.ts#L32)

If `true`, so long as the `parse` function does not throw, this function
will return the result. Note that this could result in an incomplete or
corrupted (but syntactically sound) object.

#### Default

```ts
false
```

***

### parseOptions?

> `optional` **parseOptions**: `Parameters`\<*typeof* [`parse`](../../../index/namespaces/JSONC/variables/parse.md)\>\[`2`\]

Defined in: [packages/fs/src/system/read-jsonc.ts:45](https://github.com/Xunnamius/projector/blob/2bfbc9e75e2a22c1cf17e80270873165bc38b0c9/packages/fs/src/system/read-jsonc.ts#L45)

#### See

[JSONC.parse](../../../index/namespaces/JSONC/variables/parse.md)

***

### try?

> `optional` **try**: `boolean`

Defined in: [packages/fs/src/system/read-jsonc.ts:55](https://github.com/Xunnamius/projector/blob/2bfbc9e75e2a22c1cf17e80270873165bc38b0c9/packages/fs/src/system/read-jsonc.ts#L55)

If `true`, an attempt will be made to read in and parse the JSON file. If
it fails (i.e. an error is thrown), `{}` is returned and no error is
thrown.

Note that, currently, fail results (where `{}` is returned) are not cached.

#### Default

```ts
false
```

***

### useCached

> **useCached**: `boolean`

Defined in: [packages/fs/src/system/read-jsonc.ts:41](https://github.com/Xunnamius/projector/blob/2bfbc9e75e2a22c1cf17e80270873165bc38b0c9/packages/fs/src/system/read-jsonc.ts#L41)

Use the internal cached result from a previous run, if available.

Unless `useCached` is `false`, the results returned by this function will
always strictly equal (`===`) each other with respect to call signature.

#### See

cache
