[**@-xun/project-types**](../README.md)

***

[@-xun/project-types](../README.md) / ProjectAttribute

# Enumeration: ProjectAttribute

Defined in: [index.ts:93](https://github.com/Xunnamius/projector/blob/e6720648fa9dc975b0426fb558b4c4b10c6b2e73/packages/types/src/index.ts#L93)

A "project attribute" describes a capability, scope, or some other
interesting property of a project's repository.

## Enumeration Members

### Cjs

> **Cjs**: `"cjs"`

Defined in: [index.ts:113](https://github.com/Xunnamius/projector/blob/e6720648fa9dc975b0426fb558b4c4b10c6b2e73/packages/types/src/index.ts#L113)

The root `package.json` file does not have a `type: "module"` key.

***

### Cli

> **Cli**: `"cli"`

Defined in: [index.ts:101](https://github.com/Xunnamius/projector/blob/e6720648fa9dc975b0426fb558b4c4b10c6b2e73/packages/types/src/index.ts#L101)

The root `package.json` file has a `bin` key.

***

### Esm

> **Esm**: `"esm"`

Defined in: [index.ts:117](https://github.com/Xunnamius/projector/blob/e6720648fa9dc975b0426fb558b4c4b10c6b2e73/packages/types/src/index.ts#L117)

The root `package.json` file has a `type: "module"` key.

***

### Hybridrepo

> **Hybridrepo**: `"hybridrepo"`

Defined in: [index.ts:134](https://github.com/Xunnamius/projector/blob/e6720648fa9dc975b0426fb558b4c4b10c6b2e73/packages/types/src/index.ts#L134)

The root `package.json` file has a `workspaces` key and a `src` directory
exists at the project root.

***

### Monorepo

> **Monorepo**: `"monorepo"`

Defined in: [index.ts:125](https://github.com/Xunnamius/projector/blob/e6720648fa9dc975b0426fb558b4c4b10c6b2e73/packages/types/src/index.ts#L125)

The root `package.json` file has a `workspaces` key.

***

### Multiversal

> **Multiversal**: `"multiversal"`

Defined in: [index.ts:140](https://github.com/Xunnamius/projector/blob/e6720648fa9dc975b0426fb558b4c4b10c6b2e73/packages/types/src/index.ts#L140)

The root `package.json` file contains a `build:dist` script containing the
string "--multiversal" or "--not-multiversal=false" and does not contain
the string "--multiversal=false"

***

### Next

> **Next**: `"nextjs"`

Defined in: [index.ts:97](https://github.com/Xunnamius/projector/blob/e6720648fa9dc975b0426fb558b4c4b10c6b2e73/packages/types/src/index.ts#L97)

A nextjsConfigProjectBase file exists at the project root.

***

### Polyrepo

> **Polyrepo**: `"polyrepo"`

Defined in: [index.ts:129](https://github.com/Xunnamius/projector/blob/e6720648fa9dc975b0426fb558b4c4b10c6b2e73/packages/types/src/index.ts#L129)

The root `package.json` file does not have a `workspaces` key.

***

### Private

> **Private**: `"private"`

Defined in: [index.ts:121](https://github.com/Xunnamius/projector/blob/e6720648fa9dc975b0426fb558b4c4b10c6b2e73/packages/types/src/index.ts#L121)

The root `package.json` file has a `private: true` key.

***

### Vercel

> **Vercel**: `"vercel"`

Defined in: [index.ts:109](https://github.com/Xunnamius/projector/blob/e6720648fa9dc975b0426fb558b4c4b10c6b2e73/packages/types/src/index.ts#L109)

A `vercel.json` or `.vercel/project.json` file exists at the project root.

***

### Webpack

> **Webpack**: `"webpack"`

Defined in: [index.ts:105](https://github.com/Xunnamius/projector/blob/e6720648fa9dc975b0426fb558b4c4b10c6b2e73/packages/types/src/index.ts#L105)

A webpackConfigProjectBase file exists at the project root.
