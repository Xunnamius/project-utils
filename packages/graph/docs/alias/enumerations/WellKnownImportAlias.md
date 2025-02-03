[**@-xun/project-graph**](../../README.md)

***

[@-xun/project-graph](../../README.md) / [alias](../README.md) / WellKnownImportAlias

# Enumeration: WellKnownImportAlias

Defined in: [packages/graph/src/alias.ts:56](https://github.com/Xunnamius/projector/blob/c3d70cc0dc43081a6d4b8f7587b002c35d826272/packages/graph/src/alias.ts#L56)

A well-known import alias group, such as "universe" or "multiverse".

## Enumeration Members

### Multiverse

> **Multiverse**: `"multiverse"`

Defined in: [packages/graph/src/alias.ts:73](https://github.com/Xunnamius/projector/blob/c3d70cc0dc43081a6d4b8f7587b002c35d826272/packages/graph/src/alias.ts#L73)

This alias always refers to a sub-root package's `./src` directory.

Examples of matching aliases:
- `"multiverse+package-id"`              (package ./src/index.js)
- `"multiverse+package-id:some/path.js"` (package ./src/some/path.js)

***

### Rootverse

> **Rootverse**: `"rootverse"`

Defined in: [packages/graph/src/alias.ts:97](https://github.com/Xunnamius/projector/blob/c3d70cc0dc43081a6d4b8f7587b002c35d826272/packages/graph/src/alias.ts#L97)

This alias always refers to some file relative to the project root.

Examples of matching aliases:
- `"rootverse:some/path.js"`             (root ./some/path.js)
- `"rootverse+package-id some/path.ts"`  (package ./some/path.ts)

***

### Testverse

> **Testverse**: `"testverse"`

Defined in: [packages/graph/src/alias.ts:82](https://github.com/Xunnamius/projector/blob/c3d70cc0dc43081a6d4b8f7587b002c35d826272/packages/graph/src/alias.ts#L82)

This alias refers to either a root or sub-root package's `./test`
directory.

Examples of matching aliases:
- `"testverse:some/path.ts"`             (root ./test/some/path.ts)
- `"testverse+package-id:some/path.ts"`  (package ./test/some/path.ts)

***

### Typeverse

> **Typeverse**: `"typeverse"`

Defined in: [packages/graph/src/alias.ts:89](https://github.com/Xunnamius/projector/blob/c3d70cc0dc43081a6d4b8f7587b002c35d826272/packages/graph/src/alias.ts#L89)

This alias always refers to the project root's `./types` directory.

Examples of matching aliases:
- `"multiverse+common:types.ts"`                (root ./types/global.ts)

***

### Universe

> **Universe**: `"universe"`

Defined in: [packages/graph/src/alias.ts:65](https://github.com/Xunnamius/projector/blob/c3d70cc0dc43081a6d4b8f7587b002c35d826272/packages/graph/src/alias.ts#L65)

This alias always refers to the project root (i.e. root package)'s `./src`
directory.

Examples of matching aliases:
- `"universe"`                           (root ./index.ts)
- `"universe:some/path/index.ts"`        (root ./src/some/path/index.ts)
