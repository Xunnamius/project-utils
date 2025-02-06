[**@-xun/project**](../../README.md)

***

[@-xun/project](../../README.md) / [src](../README.md) / PackageFiles

# Type Alias: PackageFiles

> **PackageFiles**: `object`

Defined in: packages/graph/dist/packages/graph/src/common.d.ts:202

In the context of a [Package](Package.md), this type represents a collection of
AbsolutePaths, one for each file under the package root that is not
ignored by Git or part of another workspace package. However, note that files
under `${packageRoot}/dist`, while usually ignored by Git, will _not_ be
automatically ignored by this function.

The collection is organized by location and utility.

## Type declaration

### dist

> **dist**: `AbsolutePath`[]

Every file under the package's `./dist` directory.

Files not owned by the package (such as those belonging to other packages
in a monorepo) will never be returned.

### docs

> **docs**: `AbsolutePath`[]

Every file under the package's `./docs` directory that is not ignored by
Git.

Files not owned by the package (such as those belonging to other packages
in a monorepo) will never be returned.

### other

> **other**: `AbsolutePath`[]

Every file under the package's root directory that is not ignored by Git
nor contained in any other [PackageFiles](PackageFiles.md) property.

Files not owned by the package (such as those belonging to other packages
in a monorepo) will never be returned.

### src

> **src**: `AbsolutePath`[]

Every file under the package's `./src` directory that is not ignored by
Git. Does not include files under `./types` (those are in
[PackageFiles.other](PackageFiles.md#other)).

Files not owned by the package (such as those belonging to other packages
in a monorepo) will never be returned.

### test

> **test**: `AbsolutePath`[]

Every file under the package's `./test` directory that is not ignored by
Git.

Files not owned by the package (such as those belonging to other packages
in a monorepo) will never be returned.
