[**@-xun/project-types**](../README.md)

***

[@-xun/project-types](../README.md) / WorkspaceAttribute

# Enumeration: WorkspaceAttribute

Defined in: [index.ts:149](https://github.com/Xunnamius/projector/blob/2ee6352d2d20d1cac2a947b31a478b43bbb1165b/packages/types/src/index.ts#L149)

A "workspace attribute" describes a capability, scope, or some other
interesting property of a workspace/sub-root within a monorepo project.

## Enumeration Members

### Cjs

> **Cjs**: `"cjs"`

Defined in: [index.ts:153](https://github.com/Xunnamius/projector/blob/2ee6352d2d20d1cac2a947b31a478b43bbb1165b/packages/types/src/index.ts#L153)

The workspace's `package.json` file does not have a `type: "module"` key.

***

### Cli

> **Cli**: `"cli"`

Defined in: [index.ts:157](https://github.com/Xunnamius/projector/blob/2ee6352d2d20d1cac2a947b31a478b43bbb1165b/packages/types/src/index.ts#L157)

The workspace's `package.json` file has a `bin` key.

***

### Esm

> **Esm**: `"esm"`

Defined in: [index.ts:161](https://github.com/Xunnamius/projector/blob/2ee6352d2d20d1cac2a947b31a478b43bbb1165b/packages/types/src/index.ts#L161)

The workspace's `package.json` file has a `type: "module"` key.

***

### Multiversal

> **Multiversal**: `"multiversal"`

Defined in: [index.ts:191](https://github.com/Xunnamius/projector/blob/2ee6352d2d20d1cac2a947b31a478b43bbb1165b/packages/types/src/index.ts#L191)

The workspace's `package.json` file contains a `build:dist` script
containing the string "--multiversal" or "--not-multiversal=false" and does
not contain the string "--multiversal=false"

***

### Private

> **Private**: `"private"`

Defined in: [index.ts:165](https://github.com/Xunnamius/projector/blob/2ee6352d2d20d1cac2a947b31a478b43bbb1165b/packages/types/src/index.ts#L165)

The workspace's `package.json` file has a `private: true` key.

***

### Shared

> **Shared**: `"shared"`

Defined in: [index.ts:185](https://github.com/Xunnamius/projector/blob/2ee6352d2d20d1cac2a947b31a478b43bbb1165b/packages/types/src/index.ts#L185)

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

Defined in: [index.ts:169](https://github.com/Xunnamius/projector/blob/2ee6352d2d20d1cac2a947b31a478b43bbb1165b/packages/types/src/index.ts#L169)

A webpackConfigProjectBase file exists at the workspace's root.
