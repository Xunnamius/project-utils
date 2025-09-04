[**bidirectional-resolve**](../../README.md)

***

[bidirectional-resolve](../../README.md) / [resolvers](../README.md) / ReplaceSubpathAsterisksOption

# Type Alias: ReplaceSubpathAsterisksOption

> **ReplaceSubpathAsterisksOption** = `object`

Defined in: [resolvers.ts:83](https://github.com/Xunnamius/projector/blob/3c6f177510f3f2da7ac5e382b8e400ab1e86d7f4/packages/bidirectional-resolve/src/resolvers.ts#L83)

## Properties

### replaceSubpathAsterisks?

> `optional` **replaceSubpathAsterisks**: `boolean`

Defined in: [resolvers.ts:95](https://github.com/Xunnamius/projector/blob/3c6f177510f3f2da7ac5e382b8e400ab1e86d7f4/packages/bidirectional-resolve/src/resolvers.ts#L95)

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
