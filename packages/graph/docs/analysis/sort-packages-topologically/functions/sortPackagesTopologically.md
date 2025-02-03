[**@-xun/project-graph**](../../../README.md)

***

[@-xun/project-graph](../../../README.md) / [analysis/sort-packages-topologically](../README.md) / sortPackagesTopologically

# Function: sortPackagesTopologically()

> **sortPackagesTopologically**(`projectMetadata`, `__namedParameters`): `Package`\<`GenericPackageJson`\>[][]

Defined in: [packages/graph/src/analysis/sort-packages-topologically.ts:43](https://github.com/Xunnamius/projector/blob/5f5f92eca551ebad2a8ed7123cb7ab801a86ad67/packages/graph/src/analysis/sort-packages-topologically.ts#L43)

Synchronously derive a directed graph representing the project's package
dependency topology and return said project's packages in a
topologically-ordered array. The ordering is stable; packages of the same
rank will always be returned in the same order.

The returned array is 2-dimensional, with each index containing an array of
packages that depend upon those from the previous index. Dependency relations
between packages are determined by the presence of a package's name in the
`package.json` `dependencies` or `peerDependencies` (or, optionally,
`devDependencies`) field of another package.

Packages that depend on themselves will have that self-referential dependency
ignored. Dependency cycles will cause this function to throw.

## Parameters

### projectMetadata

`ProjectMetadata`\<`GenericPackageJson`\>

### \_\_namedParameters

#### allowPrivateDependencies

`boolean` = `false`

If `false`, a package _without_ a `package.json` `private: true` field
can never depend upon another package with a `package.json` `private:
true` field. If such a relation is encountered, an error will be thrown.

**Default**

```ts
false
```

#### includeDevDependencies

`boolean` = `false`

If `true`, each package's `package.json` `devDependencies` will be
included in package dependency calculations.

**Default**

```ts
false
```

#### skipPrivateDependencies

`boolean` = `true`

If `true`, packages with a `package.json` `private: true` field will be
skipped if no other packages in the repository depend on them.

**Default**

```ts
true
```

## Returns

`Package`\<`GenericPackageJson`\>[][]
