[**bidirectional-resolve**](../../README.md)

***

[bidirectional-resolve](../../README.md) / [resolvers](../README.md) / ReplaceSubpathAsterisksOption

# Type Alias: ReplaceSubpathAsterisksOption

> **ReplaceSubpathAsterisksOption**: `object`

Defined in: [resolvers.ts:83](https://github.com/Xunnamius/projector/blob/c3d70cc0dc43081a6d4b8f7587b002c35d826272/packages/bidirectional-resolve/src/resolvers.ts#L83)

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
