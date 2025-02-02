[**@-xun/project**](../../README.md)

***

[@-xun/project](../../README.md) / [src](../README.md) / WorkspaceAttribute

# Enumeration: WorkspaceAttribute

Defined in: packages/types/dist/packages/types/src/index.d.ts:138

A "workspace attribute" describes a capability, scope, or some other
interesting property of a workspace/sub-root within a monorepo project.

## Enumeration Members

### Cjs

> **Cjs**: `"cjs"`

Defined in: packages/types/dist/packages/types/src/index.d.ts:142

The workspace's `package.json` file does not have a `type: "module"` key.

***

### Cli

> **Cli**: `"cli"`

Defined in: packages/types/dist/packages/types/src/index.d.ts:146

The workspace's `package.json` file has a `bin` key.

***

### Esm

> **Esm**: `"esm"`

Defined in: packages/types/dist/packages/types/src/index.d.ts:150

The workspace's `package.json` file has a `type: "module"` key.

***

### Multiversal

> **Multiversal**: `"multiversal"`

Defined in: packages/types/dist/packages/types/src/index.d.ts:180

The workspace's `package.json` file contains a `build:dist` script
containing the string "--multiversal" or "--not-multiversal=false" and does
not contain the string "--multiversal=false"

***

### Private

> **Private**: `"private"`

Defined in: packages/types/dist/packages/types/src/index.d.ts:154

The workspace's `package.json` file has a `private: true` key.

***

### Shared

> **Shared**: `"shared"`

Defined in: packages/types/dist/packages/types/src/index.d.ts:174

The workspace root contains the file [sharedAttributeFileBase](../variables/sharedAttributeFileBase.md),
signifying that paths and commits scoped to this workspace will be
considered "global"; that is: as if they existed in the scopes of every
workspace in the project.

The existence of this attribute will modify the behavior of symbiote
commands like "build changelog", and in "release" when analyzing commits to
determine the next release version.

Beside changelog generation, **no build artifacts or distributables are
affected by shared packages**. For instance, a shared package is not
automatically included in the build distributables of some other unrelated
package.

***

### Webpack

> **Webpack**: `"webpack"`

Defined in: packages/types/dist/packages/types/src/index.d.ts:158

A [webpackConfigProjectBase](../variables/webpackConfigProjectBase.md) file exists at the workspace's root.
