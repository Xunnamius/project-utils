[**@-xun/project-types**](../README.md)

***

[@-xun/project-types](../README.md) / ProjectAttribute

# Enumeration: ProjectAttribute

Defined in: [index.ts:95](https://github.com/Xunnamius/projector/blob/ebf54405456d5ea4b1a9fbe57c92ad44289d3b1b/packages/types/src/index.ts#L95)

A "project attribute" describes a capability, scope, or some other
interesting property of a project's repository.

## Enumeration Members

### Cjs

> **Cjs**: `"cjs"`

Defined in: [index.ts:115](https://github.com/Xunnamius/projector/blob/ebf54405456d5ea4b1a9fbe57c92ad44289d3b1b/packages/types/src/index.ts#L115)

The root `package.json` file does not have a `type: "module"` key.

***

### Cli

> **Cli**: `"cli"`

Defined in: [index.ts:103](https://github.com/Xunnamius/projector/blob/ebf54405456d5ea4b1a9fbe57c92ad44289d3b1b/packages/types/src/index.ts#L103)

The root `package.json` file has a `bin` key.

***

### Esm

> **Esm**: `"esm"`

Defined in: [index.ts:119](https://github.com/Xunnamius/projector/blob/ebf54405456d5ea4b1a9fbe57c92ad44289d3b1b/packages/types/src/index.ts#L119)

The root `package.json` file has a `type: "module"` key.

***

### Hybridrepo

> **Hybridrepo**: `"hybridrepo"`

Defined in: [index.ts:136](https://github.com/Xunnamius/projector/blob/ebf54405456d5ea4b1a9fbe57c92ad44289d3b1b/packages/types/src/index.ts#L136)

The root `package.json` file has a `workspaces` key and a `src` directory
exists at the project root.

***

### Monorepo

> **Monorepo**: `"monorepo"`

Defined in: [index.ts:127](https://github.com/Xunnamius/projector/blob/ebf54405456d5ea4b1a9fbe57c92ad44289d3b1b/packages/types/src/index.ts#L127)

The root `package.json` file has a `workspaces` key.

***

### Multiversal

> **Multiversal**: `"multiversal"`

Defined in: [index.ts:142](https://github.com/Xunnamius/projector/blob/ebf54405456d5ea4b1a9fbe57c92ad44289d3b1b/packages/types/src/index.ts#L142)

The root `package.json` file contains a `build:dist` script containing the
string "--multiversal" or "--not-multiversal=false" and does not contain
the string "--multiversal=false"

***

### Next

> **Next**: `"nextjs"`

Defined in: [index.ts:99](https://github.com/Xunnamius/projector/blob/ebf54405456d5ea4b1a9fbe57c92ad44289d3b1b/packages/types/src/index.ts#L99)

A nextjsConfigProjectBase file exists at the project root.

***

### Polyrepo

> **Polyrepo**: `"polyrepo"`

Defined in: [index.ts:131](https://github.com/Xunnamius/projector/blob/ebf54405456d5ea4b1a9fbe57c92ad44289d3b1b/packages/types/src/index.ts#L131)

The root `package.json` file does not have a `workspaces` key.

***

### Private

> **Private**: `"private"`

Defined in: [index.ts:123](https://github.com/Xunnamius/projector/blob/ebf54405456d5ea4b1a9fbe57c92ad44289d3b1b/packages/types/src/index.ts#L123)

The root `package.json` file has a `private: true` key.

***

### Vercel

> **Vercel**: `"vercel"`

Defined in: [index.ts:111](https://github.com/Xunnamius/projector/blob/ebf54405456d5ea4b1a9fbe57c92ad44289d3b1b/packages/types/src/index.ts#L111)

A `vercel.json` or `.vercel/project.json` file exists at the project root.

***

### Webpack

> **Webpack**: `"webpack"`

Defined in: [index.ts:107](https://github.com/Xunnamius/projector/blob/ebf54405456d5ea4b1a9fbe57c92ad44289d3b1b/packages/types/src/index.ts#L107)

A webpackConfigProjectBase file exists at the project root.
