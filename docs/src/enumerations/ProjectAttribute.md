[**@-xun/project**](../../README.md)

***

[@-xun/project](../../README.md) / [src](../README.md) / ProjectAttribute

# Enumeration: ProjectAttribute

Defined in: packages/types/dist/packages/types/src/index.d.ts:85

A "project attribute" describes a capability, scope, or some other
interesting property of a project's repository.

## Enumeration Members

### Cjs

> **Cjs**: `"cjs"`

Defined in: packages/types/dist/packages/types/src/index.d.ts:105

The root `package.json` file does not have a `type: "module"` key.

***

### Cli

> **Cli**: `"cli"`

Defined in: packages/types/dist/packages/types/src/index.d.ts:93

The root `package.json` file has a `bin` key.

***

### Esm

> **Esm**: `"esm"`

Defined in: packages/types/dist/packages/types/src/index.d.ts:109

The root `package.json` file has a `type: "module"` key.

***

### Hybridrepo

> **Hybridrepo**: `"hybridrepo"`

Defined in: packages/types/dist/packages/types/src/index.d.ts:126

The root `package.json` file has a `workspaces` key and a `src` directory
exists at the project root.

***

### Monorepo

> **Monorepo**: `"monorepo"`

Defined in: packages/types/dist/packages/types/src/index.d.ts:117

The root `package.json` file has a `workspaces` key.

***

### Multiversal

> **Multiversal**: `"multiversal"`

Defined in: packages/types/dist/packages/types/src/index.d.ts:132

The root `package.json` file contains a `build:dist` script containing the
string "--multiversal" or "--not-multiversal=false" and does not contain
the string "--multiversal=false"

***

### Next

> **Next**: `"nextjs"`

Defined in: packages/types/dist/packages/types/src/index.d.ts:89

A nextjsConfigProjectBase file exists at the project root.

***

### Polyrepo

> **Polyrepo**: `"polyrepo"`

Defined in: packages/types/dist/packages/types/src/index.d.ts:121

The root `package.json` file does not have a `workspaces` key.

***

### Private

> **Private**: `"private"`

Defined in: packages/types/dist/packages/types/src/index.d.ts:113

The root `package.json` file has a `private: true` key.

***

### Vercel

> **Vercel**: `"vercel"`

Defined in: packages/types/dist/packages/types/src/index.d.ts:101

A `vercel.json` or `.vercel/project.json` file exists at the project root.

***

### Webpack

> **Webpack**: `"webpack"`

Defined in: packages/types/dist/packages/types/src/index.d.ts:97

A [webpackConfigProjectBase](../variables/webpackConfigProjectBase.md) file exists at the project root.
