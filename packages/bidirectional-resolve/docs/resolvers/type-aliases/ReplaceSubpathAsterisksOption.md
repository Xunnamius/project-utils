[**bidirectional-resolve**](../../README.md)

***

[bidirectional-resolve](../../README.md) / [resolvers](../README.md) / ReplaceSubpathAsterisksOption

# Type Alias: ReplaceSubpathAsterisksOption

> **ReplaceSubpathAsterisksOption**: `object`

Defined in: [packages/bidirectional-resolve/src/resolvers.ts:83](https://github.com/Xunnamius/projector/blob/6b3aeb0c9188952de0cc2f6a34e1f14bd789015b/packages/bidirectional-resolve/src/resolvers.ts#L83)

## Type declaration

### replaceSubpathAsterisks?

> `optional` **replaceSubpathAsterisks**: `boolean`

When returning a subpath pattern, i.e. a subpath containing an asterisk
("*"), the asterisks will be replaced by the matching portions of `target` if
`replaceSubpathAsterisks` is `true`. Otherwise, the literal subpath pattern
will be returned with asterisk included.

Note that, if `target` contains an asterisk, the literal subpath pattern
will always be returned regardless of the value of this option.

#### Default

```ts
true
```
