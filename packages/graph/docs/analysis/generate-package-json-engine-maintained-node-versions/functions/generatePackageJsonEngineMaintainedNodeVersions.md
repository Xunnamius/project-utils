[**@-xun/project-graph**](../../../README.md)

***

[@-xun/project-graph](../../../README.md) / [analysis/generate-package-json-engine-maintained-node-versions](../README.md) / generatePackageJsonEngineMaintainedNodeVersions

# Function: generatePackageJsonEngineMaintainedNodeVersions()

## Call Signature

> **generatePackageJsonEngineMaintainedNodeVersions**(`options?`): `string`

Defined in: [packages/graph/src/analysis/generate-package-json-engine-maintained-node-versions.ts:9](https://github.com/Xunnamius/projector/blob/514ccc0cc29a5be24dff01a84b9935be834df2b5/packages/graph/src/analysis/generate-package-json-engine-maintained-node-versions.ts#L9)

Synchronously returns the expected value for `package.json`
`engines`/`engines.node` field.

### Parameters

#### options?

##### format?

`"engines"`

This determines in what format the results are returned. `"engines"`
returns the currently maintained node versions as a string suitable for the
`engines`/`engines.node` key in a `package.json` file. `array` returns an
array of the currently maintained node versions.

**Default**

```ts
engines
```

### Returns

`string`

## Call Signature

> **generatePackageJsonEngineMaintainedNodeVersions**(`options?`): `string`[]

Defined in: [packages/graph/src/analysis/generate-package-json-engine-maintained-node-versions.ts:23](https://github.com/Xunnamius/projector/blob/514ccc0cc29a5be24dff01a84b9935be834df2b5/packages/graph/src/analysis/generate-package-json-engine-maintained-node-versions.ts#L23)

Synchronously returns an array of the currently maintained node versions.

### Parameters

#### options?

##### format

`"array"`

This determines in what format the results are returned. `"engines"`
returns the currently maintained node versions as a string suitable for the
`engines`/`engines.node` key in a `package.json` file. `array` returns an
array of the currently maintained node versions.

**Default**

```ts
engines
```

### Returns

`string`[]

## Call Signature

> **generatePackageJsonEngineMaintainedNodeVersions**(`options?`): `Arrayable`\<`string`\>

Defined in: [packages/graph/src/analysis/generate-package-json-engine-maintained-node-versions.ts:37](https://github.com/Xunnamius/projector/blob/514ccc0cc29a5be24dff01a84b9935be834df2b5/packages/graph/src/analysis/generate-package-json-engine-maintained-node-versions.ts#L37)

Synchronously returns maintained node versions in the given format.

### Parameters

#### options?

##### format?

`"engines"` \| `"array"`

### Returns

`Arrayable`\<`string`\>
