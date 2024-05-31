[**@projector-js/core**](../../README.md) • **Docs**

***

[@projector-js/core](../../README.md) / [resolvers](../README.md) / ReplaceSubpathAsterisksOption

# Type alias: ReplaceSubpathAsterisksOption

> **ReplaceSubpathAsterisksOption**: `object`

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

## Source

[packages/core/src/resolvers.ts:78](https://github.com/Xunnamius/projector/blob/eaae74353ca5b35a9a0ca3db8a554376fec1dd9b/packages/core/src/resolvers.ts#L78)
