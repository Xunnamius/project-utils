[**bidirectional-resolve**](../../README.md)

***

[bidirectional-resolve](../../README.md) / [resolvers](../README.md) / UnsafeFallbackOption

# Type Alias: UnsafeFallbackOption

> **UnsafeFallbackOption** = `object`

Defined in: [resolvers.ts:56](https://github.com/Xunnamius/projector/blob/2f27fcc45a3b7194f8512eb7f0274bde1ac7ea9d/packages/bidirectional-resolve/src/resolvers.ts#L56)

## Properties

### includeUnsafeFallbackTargets?

> `optional` **includeUnsafeFallbackTargets?**: `boolean`

Defined in: [resolvers.ts:80](https://github.com/Xunnamius/projector/blob/2f27fcc45a3b7194f8512eb7f0274bde1ac7ea9d/packages/bidirectional-resolve/src/resolvers.ts#L80)

When encountering a fallback array (i.e. targets present at some level
within an array),
[Node.js](https://github.com/nodejs/node/issues/37928#issuecomment-808833604)
will [select the first valid defined non-null target and ignore all the
others](https://github.com/nodejs/node/blob/a9cdeeda880a56de6dad10b24b3bfa45e2cccb5d/lib/internal/modules/esm/resolve.js#L417-L432),
even if that target ends up being unresolvable. However, some build tools
like [Webpack](https://webpack.js.org/guides/package-exports/#alternatives)
will evaluate _all_ targets in the fallback array until it encounters one
that exists on the filesystem. Since this behavior deviates from Node.js
and hence "the spec," it is considered _unsafe_.

Therefore, by default, this function will ignore all but the very first
defined non-null target in a fallback array regardless of if it exists on
the filesystem or not. If no such target is encountered, the final target
in the fallback array is returned regardless of its value.

Set `includeUnsafeFallbackTargets` to `true` to exhaustively consider _all_
non-null fallback targets instead, which is a marked deviation from
Node.js's behavior.

#### Default

```ts
false
```
