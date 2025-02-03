[**@-xun/project**](../../README.md)

***

[@-xun/project](../../README.md) / [src](../README.md) / generatePackageJsonEngineMaintainedNodeVersions

# Function: generatePackageJsonEngineMaintainedNodeVersions()

## Call Signature

> **generatePackageJsonEngineMaintainedNodeVersions**(`options`?): `string`

Defined in: packages/graph/dist/packages/graph/src/analysis/generate-package-json-engine-maintained-node-versions.d.ts:6

Synchronously returns the expected value for `package.json`
`engines`/`engines.node` field.

### Parameters

#### options?

##### format

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

> **generatePackageJsonEngineMaintainedNodeVersions**(`options`?): `string`[]

Defined in: packages/graph/dist/packages/graph/src/analysis/generate-package-json-engine-maintained-node-versions.d.ts:20

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

> **generatePackageJsonEngineMaintainedNodeVersions**(`options`?): `Arrayable`\<`string`\>

Defined in: packages/graph/dist/packages/graph/src/analysis/generate-package-json-engine-maintained-node-versions.d.ts:34

Synchronously returns maintained node versions in the given format.

### Parameters

#### options?

##### format

`"engines"` \| `"array"`

### Returns

`Arrayable`\<`string`\>
