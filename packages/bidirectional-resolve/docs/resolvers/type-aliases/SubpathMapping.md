[**bidirectional-resolve**](../../README.md)

***

[bidirectional-resolve](../../README.md) / [resolvers](../README.md) / SubpathMapping

# Type Alias: SubpathMapping

> **SubpathMapping** = `object`

Defined in: [packages/bidirectional-resolve/src/resolvers.ts:104](https://github.com/Xunnamius/projector/blob/ff49dea649d2cb66826f02e52b0a8e211009f14d/packages/bidirectional-resolve/src/resolvers.ts#L104)

A single flattened subpath in a `package.json` `exports`/`imports` map along
with its target, matchable conditions, and other metadata. One or more
subpath mappings together form an imports/exports "entry point" or
"specifier".

## Properties

### conditions

> **conditions**: `string`[]

Defined in: [packages/bidirectional-resolve/src/resolvers.ts:149](https://github.com/Xunnamius/projector/blob/ff49dea649d2cb66826f02e52b0a8e211009f14d/packages/bidirectional-resolve/src/resolvers.ts#L149)

The combination of resolution conditions that, when matched, result in
`subpath` resolving to `target`. Conditions are listed in the order they
are encountered in the map object.

Note that the "default" condition, while present in `conditions`, may not
actually exist in the actual `package.json` file.

***

### excludedConditions

> **excludedConditions**: `string`[]

Defined in: [packages/bidirectional-resolve/src/resolvers.ts:171](https://github.com/Xunnamius/projector/blob/ff49dea649d2cb66826f02e52b0a8e211009f14d/packages/bidirectional-resolve/src/resolvers.ts#L171)

When the subpath mapping is a "default" mapping that occurs after one or
more sibling conditions, it cannot be selected if one of those siblings is
selected first. This property contains those sibling conditions that, if
present, mean this subpath mapping should not be considered.

Useful when reverse-mapping targets to subpaths.

#### Example

```jsonc
{
  "./strange-subpath": {
    "default": {
      "import": "./import.js",
      "node": "./node.js",
      "default": "./default.js" // <- Never chosen if "import" is specified
    }
  }
}
```

***

### isDeadCondition

> **isDeadCondition**: `boolean`

Defined in: [packages/bidirectional-resolve/src/resolvers.ts:237](https://github.com/Xunnamius/projector/blob/ff49dea649d2cb66826f02e52b0a8e211009f14d/packages/bidirectional-resolve/src/resolvers.ts#L237)

If `true`, this condition is guaranteed to be impossible to reach, likely
because it occurs after the "default" condition.

***

### isFallback

> **isFallback**: `boolean`

Defined in: [packages/bidirectional-resolve/src/resolvers.ts:221](https://github.com/Xunnamius/projector/blob/ff49dea649d2cb66826f02e52b0a8e211009f14d/packages/bidirectional-resolve/src/resolvers.ts#L221)

If `true`, `target` is a so-called "fallback target". This means either (1)
`target` is a member of a fallback array or (2) the parent or ancestor
object containing `target` is a member of a fallback array. For example:

#### Example

```json
{
  "name": "my-package",
  "exports": [
    "./target-is-fallback-1.js",
    {
      "require": "./target-is-fallback-2.js",
      "default": "./target-is-fallback-3.js"
    }
  ]
}
```

Note that, due to how fallback arrays work, a fallback `target` may not be
reachable in any environment or under any circumstances ever even if all
the conditions match; multiple fallback `target`s might even overlap in
strange ways that are hard to reason about. [Node.js also ignores all but
the first valid defined non-null fallback
target](https://github.com/nodejs/node/blob/a9cdeeda880a56de6dad10b24b3bfa45e2cccb5d/lib/internal/modules/esm/resolve.js#L417-L432).

**It is for these reasons that fallback arrays should be avoided entirely
in `package.json` files,** especially any sort of complex nested fallback
configurations. They're really only useful for consumption by build tools
like Webpack or TypeScript, and even then their utility is limited.

***

### isFirstNonNullFallback

> **isFirstNonNullFallback**: `boolean`

Defined in: [packages/bidirectional-resolve/src/resolvers.ts:226](https://github.com/Xunnamius/projector/blob/ff49dea649d2cb66826f02e52b0a8e211009f14d/packages/bidirectional-resolve/src/resolvers.ts#L226)

When `isFallback` is true, `isFistNonNullFallback` will be `true` if
`target` is the first non-`null` member in the flattened fallback array.

***

### isLastFallback

> **isLastFallback**: `boolean`

Defined in: [packages/bidirectional-resolve/src/resolvers.ts:232](https://github.com/Xunnamius/projector/blob/ff49dea649d2cb66826f02e52b0a8e211009f14d/packages/bidirectional-resolve/src/resolvers.ts#L232)

When `isFallback` is true, `isLastFallback` will be `true` if `target` is
the last member in the flattened fallback array regardless of value of
`target`.

***

### isSugared

> **isSugared**: `boolean`

Defined in: [packages/bidirectional-resolve/src/resolvers.ts:189](https://github.com/Xunnamius/projector/blob/ff49dea649d2cb66826f02e52b0a8e211009f14d/packages/bidirectional-resolve/src/resolvers.ts#L189)

If `true`, the value of `subpath` was inferred but no corresponding
property exists in the actual `package.json` file.

#### Example

```json
{
  "name": "my-package",
  "exports": "./is-sugared.js"
}
```

In the above example, `subpath` would be `"."` even though it does not
exist in the actual `package.json` file.

#### See

https://nodejs.org/api/packages.html#exports-sugar

***

### subpath

> **subpath**: `string`

Defined in: [packages/bidirectional-resolve/src/resolvers.ts:123](https://github.com/Xunnamius/projector/blob/ff49dea649d2cb66826f02e52b0a8e211009f14d/packages/bidirectional-resolve/src/resolvers.ts#L123)

The subpath that maps to `target`, e.g.:

#### Example

```json
{
  "exports": {
    "subpath": "target"
  }
}
```

If `isSugared` is `true`, `subpath` is
[sugared](https://nodejs.org/api/packages.html#exports-sugar) and thus does
not exist as a property in the actual `package.json` file. `subpath`, if it
contains at most one asterisk ("*"), becomes a [subpath
pattern](https://nodejs.org/docs/latest-v19.x/api/packages.html#subpath-patterns).

***

### target

> **target**: `string` \| `null`

Defined in: [packages/bidirectional-resolve/src/resolvers.ts:140](https://github.com/Xunnamius/projector/blob/ff49dea649d2cb66826f02e52b0a8e211009f14d/packages/bidirectional-resolve/src/resolvers.ts#L140)

The path to a target file that maps to `subpath`, e.g.:

#### Example

```json
{
  "exports": {
    "subpath": "target"
  }
}
```

Target may also contain one or more asterisks ("*") only if `subpath` is a
[subpath
pattern](https://nodejs.org/docs/latest-v19.x/api/packages.html#subpath-patterns).
