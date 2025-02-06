import { isPackage, isProjectMetadata } from '@-xun/project-types';
import { createDebugLogger } from 'rejoinder';

import { globalDebuggerNamespace } from 'multiverse+common:constant.ts';

import { GraphErrorMessage } from 'universe+graph:error.ts';

import type { AbsolutePath, RelativePath } from '@-xun/fs';

import type {
  GenericPackage,
  GenericProjectMetadata,
  Package,
  ProjectMetadata,
  WorkspacePackageId
} from '@-xun/project-types';

import type { Tagged } from 'type-fest';
import type { MetadataImportsPrefix } from 'universe+graph:analysis/gather-package-build-targets.ts';

export const commonDebug = createDebugLogger({
  namespace: `${globalDebuggerNamespace}:analyze`
});

/**
 * In the context of a {@link Package}, this object represents a collection of
 * all the file paths **relative to the _project root_** that must be transpiled
 * (source; typically TypeScript files) and/or copied (assets; typically
 * everything that isn't a TypeScript file) to build a specific package.
 *
 * These paths are split into internal and external
 * {@link PackageBuildTargets.targets}. Interesting
 * {@link PackageBuildTargets.metadata} is returned as well.
 */
export type PackageBuildTargets = {
  /**
   * The file paths, **relative to the _project root_**, that must be transpiled
   * and/or copied when building a specific {@link Package}'s distributables.
   */
  targets: {
    /**
     * These {@link RelativePath}s are the internal build targets belonging to
     * the package. They are the contents of `${packageRoot}/src` and can be any
     * file type.
     *
     * These paths will always be **relative to the _project root_**.
     */
    internal: Set<RelativePath>;
    /**
     * These {@link RelativePath}s are the so-called "multiversal" build targets
     * external to the package. They are derived from import specifiers and can
     * be any file type.
     *
     * These paths will always be **relative to the _project root_**.
     *
     * Unlike `targets.internal`, this property contains two sets of
     * {@link RelativePath}s: type-only imports and normal imports. Do note that
     * (1) specifiers will _never_ exist in both sets simultaneously and (2) all
     * imports of type-only imports will also be classified as type-only imports
     * regardless of their "import kind" _unless_ they are also imported by a
     * normal import.
     */
    external: { normal: Set<RelativePath>; typeOnly: Set<RelativePath> };
  };
  metadata: {
    imports: {
      /**
       * A mapping between well-known import aliases within the project and the
       * number of times they are imported by the build target files.
       *
       * Imports also have tags in the form of "prefixes". See
       * `gatherPackageBuildTargets` for details.
       */
      aliasCounts: Record<
        string,
        { count: number; prefixes: Set<MetadataImportsPrefix> }
      >;
      /**
       * A mapping between packages imported from outside the project, such as
       * builtins (e.g. from Node) and dependencies (e.g. node_modules), and the
       * number of times those packages are imported by the build target files.
       *
       * Imports also have tags in the form of "prefixes". See
       * `gatherPackageBuildTargets` for details.
       */
      dependencyCounts: Record<
        string,
        { count: number; prefixes: Set<MetadataImportsPrefix> }
      >;
    };
  };
};

/**
 * A collection of {@link AbsolutePath}s within this project organized by
 * location and utility.
 *
 * Unnamed and broken workspaces/packages are ignored.
 */
export type ProjectFiles = {
  /**
   * The project's various `package.json` files.
   */
  packageJsonFiles: {
    /**
     * An absolute path to the project's root `package.json` file.
     */
    atProjectRoot: AbsolutePath;
    /**
     * A map of {@link WorkspacePackageId}s to zero or more absolute paths to
     * each workspace's root `package.json` files.
     */
    atWorkspaceRoot: Map<WorkspacePackageId, AbsolutePath>;
    /**
     * In effect, this property is sugar for `atProjectRoot + atWorkspaceRoot`.
     */
    atAnyRoot: AbsolutePath[];
    /**
     * Other `package.json` files within the project that are not at a root or
     * sub-root. These `package.json` files are likely used to set the `type` of
     * surrounding JavaScript files and/or belong to unnamed or broken
     * workspaces.
     */
    elsewhere: AbsolutePath[];
  };
  /**
   * The first defined `bin` value (i.e. each package's "main binary") within
   * the project's root and sub-root `package.json`'s files.
   */
  mainBinFiles: {
    /**
     * An absolute path to an executable derived from the project's root
     * `package.json` `bin` value (if it exists).
     */
    atProjectRoot: AbsolutePath | undefined;
    /**
     * A map of {@link WorkspacePackageId}s to zero or more absolute executable
     * paths derived from each workspace's root `package.json` `bin` value (if
     * it exists).
     */
    atWorkspaceRoot: Map<WorkspacePackageId, AbsolutePath | undefined>;
    /**
     * In effect, this property is sugar for `atProjectRoot + atWorkspaceRoot`.
     */
    atAnyRoot: AbsolutePath[];
  };
  /**
   * The project's Markdown (.md) files.
   */
  markdownFiles: {
    /**
     * An array of zero or more absolute paths to Markdown files within the
     * project but not within any workspace.
     */
    inRoot: AbsolutePath[];
    /**
     * A map of {@link WorkspacePackageId}s to zero or more absolute paths to
     * Markdown files within the project's workspaces.
     */
    inWorkspace: Map<WorkspacePackageId, AbsolutePath[]>;
    /**
     * In effect, this property is sugar for `inRoot + inWorkspace`.
     */
    all: AbsolutePath[];
  };
  /**
   * The project's TypeScript (.ts, .tsx, .mts, .cts) files that are within a
   * `src/` directory.
   */
  typescriptSrcFiles: {
    /**
     * An array of zero or more absolute paths to TypeScript files within the
     * project's root `src/` directory.
     */
    inRootSrc: AbsolutePath[];
    /**
     * A map of {@link WorkspacePackageId}s to zero or more absolute paths to
     * TypeScript files within each project workspace's `src/` directory.
     */
    inWorkspaceSrc: Map<WorkspacePackageId, AbsolutePath[]>;
    /**
     * In effect, this property is sugar for `inRootSrc + inWorkspaceSrc`.
     */
    all: AbsolutePath[];
  };
  /**
   * The project's TypeScript (.ts, .tsx, .mts, .cts) files with names following
   * the pattern `*.test.{ts,tsx,mts,cts}` that are within a `test/` directory.
   */
  typescriptTestFiles: {
    /**
     * An array of zero or more absolute paths to TypeScript files with names
     * following the pattern `*.test.{ts,tsx,mts,cts}` that are within the
     * project's root `test/` directory.
     */
    inRootTest: AbsolutePath[];
    /**
     * A map of {@link WorkspacePackageId}s to zero or more absolute paths to
     * TypeScript files with names following the pattern
     * `*.test.{ts,tsx,mts,cts}` that are within each project workspace's
     * `test/` directory.
     */
    inWorkspaceTest: Map<WorkspacePackageId, AbsolutePath[]>;
    /**
     * In effect, this property is sugar for `inRootTest + inWorkspaceTest`.
     */
    all: AbsolutePath[];
  };
};

/**
 * In the context of a {@link Package}, this type represents a collection of
 * {@link AbsolutePath}s, one for each file under the package root that is not
 * ignored by Git or part of another workspace package. However, note that files
 * under `${packageRoot}/dist`, while usually ignored by Git, will _not_ be
 * automatically ignored by this function.
 *
 * The collection is organized by location and utility.
 */
export type PackageFiles = {
  /**
   * Every file under the package's `./dist` directory.
   *
   * Files not owned by the package (such as those belonging to other packages
   * in a monorepo) will never be returned.
   */
  dist: AbsolutePath[];
  /**
   * Every file under the package's `./docs` directory that is not ignored by
   * Git.
   *
   * Files not owned by the package (such as those belonging to other packages
   * in a monorepo) will never be returned.
   */
  docs: AbsolutePath[];
  /**
   * Every file under the package's `./src` directory that is not ignored by
   * Git. Does not include files under `./types` (those are in
   * {@link PackageFiles.other}).
   *
   * Files not owned by the package (such as those belonging to other packages
   * in a monorepo) will never be returned.
   */
  src: AbsolutePath[];
  /**
   * Every file under the package's `./test` directory that is not ignored by
   * Git.
   *
   * Files not owned by the package (such as those belonging to other packages
   * in a monorepo) will never be returned.
   */
  test: AbsolutePath[];
  /**
   * Every file under the package's root directory that is not ignored by Git
   * nor contained in any other {@link PackageFiles} property.
   *
   * Files not owned by the package (such as those belonging to other packages
   * in a monorepo) will never be returned.
   */
  other: AbsolutePath[];
};

/**
 * Used to assign the result of an asynchronous operation to some key in some
 * object. For example:
 *
 * ```typescript
 * await Promise.all(items.map(async (item) => { ... }))
 *   .then((mappedItems) => new Map(mappedItems))
 *   .then(assignResultTo(accumulatorObject, 'someKey'));
 *
 * await someAsyncFn(something).then(
 *   assignResultTo(accumulatorObject, 'someOtherKey')
 * );
 * ```
 */
export function assignResultTo(parentObject: Record<string, unknown>, key: string) {
  return function (result: unknown) {
    parentObject[key] = result;
  };
}

export type Serializable<T> = Tagged<T, 'serializable'>;

/**
 * Make `component` serializable by `@-xun/memoizer` (`JSON.stringify`).
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#description
 */
export function toSerializable<
  T extends GenericProjectMetadata | ProjectMetadata | GenericPackage | Package
>(idComponent: T): Serializable<T> {
  if (isPackage(idComponent)) {
    // ? Packages are cyclical data structures, so we account for that
    const { projectMetadata: _, ...serializablePackage } = idComponent;
    return serializablePackage as Serializable<T>;
  } else if (isProjectMetadata(idComponent)) {
    // ? ProjectMetadata has cyclical data structures, so we account for that
    const {
      rootPackage: { projectMetadata: _, ...serializablePackage }
    } = idComponent;

    return serializablePackage as Serializable<T>;
  }

  throw new TypeError(GraphErrorMessage.TargetUnserializable());
}
