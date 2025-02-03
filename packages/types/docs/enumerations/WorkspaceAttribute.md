[**@-xun/project-types**](../README.md)

***

[@-xun/project-types](../README.md) / WorkspaceAttribute

# Enumeration: WorkspaceAttribute

Defined in: [index.ts:147](https://github.com/Xunnamius/projector/blob/c3d70cc0dc43081a6d4b8f7587b002c35d826272/packages/types/src/index.ts#L147)

A "workspace attribute" describes a capability, scope, or some other
interesting property of a workspace/sub-root within a monorepo project.

## Enumeration Members

### Cjs

> **Cjs**: `"cjs"`

Defined in: [index.ts:151](https://github.com/Xunnamius/projector/blob/c3d70cc0dc43081a6d4b8f7587b002c35d826272/packages/types/src/index.ts#L151)

The workspace's `package.json` file does not have a `type: "module"` key.

***

### Cli

> **Cli**: `"cli"`

Defined in: [index.ts:155](https://github.com/Xunnamius/projector/blob/c3d70cc0dc43081a6d4b8f7587b002c35d826272/packages/types/src/index.ts#L155)

The workspace's `package.json` file has a `bin` key.

***

### Esm

> **Esm**: `"esm"`

Defined in: [index.ts:159](https://github.com/Xunnamius/projector/blob/c3d70cc0dc43081a6d4b8f7587b002c35d826272/packages/types/src/index.ts#L159)

The workspace's `package.json` file has a `type: "module"` key.

***

### Multiversal

> **Multiversal**: `"multiversal"`

Defined in: [index.ts:189](https://github.com/Xunnamius/projector/blob/c3d70cc0dc43081a6d4b8f7587b002c35d826272/packages/types/src/index.ts#L189)

The workspace's `package.json` file contains a `build:dist` script
containing the string "--multiversal" or "--not-multiversal=false" and does
not contain the string "--multiversal=false"

***

### Private

> **Private**: `"private"`

Defined in: [index.ts:163](https://github.com/Xunnamius/projector/blob/c3d70cc0dc43081a6d4b8f7587b002c35d826272/packages/types/src/index.ts#L163)

The workspace's `package.json` file has a `private: true` key.

***

### Shared

> **Shared**: `"shared"`

Defined in: [index.ts:183](https://github.com/Xunnamius/projector/blob/c3d70cc0dc43081a6d4b8f7587b002c35d826272/packages/types/src/index.ts#L183)

The workspace root contains the file sharedAttributeFileBase,
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

Defined in: [index.ts:167](https://github.com/Xunnamius/projector/blob/c3d70cc0dc43081a6d4b8f7587b002c35d826272/packages/types/src/index.ts#L167)

A webpackConfigProjectBase file exists at the workspace's root.
