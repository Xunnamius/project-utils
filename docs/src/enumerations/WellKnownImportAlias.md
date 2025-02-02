[**@-xun/project**](../../README.md)

***

[@-xun/project](../../README.md) / [src](../README.md) / WellKnownImportAlias

# Enumeration: WellKnownImportAlias

Defined in: packages/graph/dist/packages/graph/src/alias.d.ts:31

A well-known import alias group, such as "universe" or "multiverse".

## Enumeration Members

### Multiverse

> **Multiverse**: `"multiverse"`

Defined in: packages/graph/dist/packages/graph/src/alias.d.ts:48

This alias always refers to a sub-root package's `./src` directory.

Examples of matching aliases:
- `"multiverse+package-id"`              (package ./src/index.js)
- `"multiverse+package-id:some/path.js"` (package ./src/some/path.js)

***

### Rootverse

> **Rootverse**: `"rootverse"`

Defined in: packages/graph/dist/packages/graph/src/alias.d.ts:72

This alias always refers to some file relative to the project root.

Examples of matching aliases:
- `"rootverse:some/path.js"`             (root ./some/path.js)
- `"rootverse+package-id some/path.ts"`  (package ./some/path.ts)

***

### Testverse

> **Testverse**: `"testverse"`

Defined in: packages/graph/dist/packages/graph/src/alias.d.ts:57

This alias refers to either a root or sub-root package's `./test`
directory.

Examples of matching aliases:
- `"testverse:some/path.ts"`             (root ./test/some/path.ts)
- `"testverse+package-id:some/path.ts"`  (package ./test/some/path.ts)

***

### Typeverse

> **Typeverse**: `"typeverse"`

Defined in: packages/graph/dist/packages/graph/src/alias.d.ts:64

This alias always refers to the project root's `./types` directory.

Examples of matching aliases:
- `"multiverse+common:types.ts"`                (root ./types/global.ts)

***

### Universe

> **Universe**: `"universe"`

Defined in: packages/graph/dist/packages/graph/src/alias.d.ts:40

This alias always refers to the project root (i.e. root package)'s `./src`
directory.

Examples of matching aliases:
- `"universe"`                           (root ./index.ts)
- `"universe:some/path/index.ts"`        (root ./src/some/path/index.ts)
