import { isMap } from 'node:util/types';

import type { AbsolutePath, RelativePath } from '@-xun/fs';
import type { OmitIndexSignature, PackageJson } from 'type-fest';

export type WorkspacePackageName = string;

/**
 * A so-called "package-id" of a workspace package. The package-id is derived
 * from the name of the parent directory of the package's `package.json` file,
 * i.e. the basename of `root`.
 *
 * The package-id is alphanumeric + hyphens and must be at least one character.
 */
export type WorkspacePackageId = string;

/**
 * An object representing the root or "top-level" package in a monorepo or
 * polyrepo project.
 */
export type RootPackage<Json extends PackageJson | XPackageJson = XPackageJson> = {
  /**
   * The absolute path to the root directory of the entire project.
   */
  root: AbsolutePath;
  /**
   * The contents of the root `package.json` file.
   */
  json: Json;
  /**
   * A collection of {@link ProjectAttribute} flags describing the project.
   */
  attributes: { [key in ProjectAttribute]?: boolean };
  /**
   * A link back to the {@link ProjectMetadata} instance containing this
   * package.
   */
  projectMetadata: ProjectMetadata<Json>;
};

/**
 * An object representing a non-root package in a monorepo project.
 */
export type WorkspacePackage<Json extends PackageJson | XPackageJson = XPackageJson> = {
  /**
   * The package-id of the workspace package. The package-id is derived from the
   * name of the parent directory of this package's `package.json` file, i.e.
   * the basename of `root`.
   *
   * The package-id must be alphanumeric + hyphens and must be at least one
   * character.
   */
  id: WorkspacePackageId;
  /**
   * The absolute path to the root directory of the package.
   */
  root: AbsolutePath;
  /**
   * The path to the root directory of the package _relative to the project
   * root_.
   *
   * Note: the `./` prefix (_not_ `../`), if present, is elided from the
   * returned path.
   */
  relativeRoot: RelativePath;
  /**
   * The contents of the package's `package.json` file.
   */
  json: Json;
  /**
   * A collection of {@link WorkspaceAttribute} flags describing the workspace.
   */
  attributes: { [key in WorkspaceAttribute]?: boolean };
  /**
   * A link back to the {@link ProjectMetadata} instance containing this
   * package.
   */
  projectMetadata: ProjectMetadata<Json>;
};

/**
 * An object representing a package in a monorepo or polyrepo project.
 *
 * @see {@link RootPackage}
 * @see {@link WorkspacePackage}
 */
export type Package<Json extends PackageJson | XPackageJson = XPackageJson> =
  | RootPackage<Json>
  | WorkspacePackage<Json>;

/**
 * A "project attribute" describes a capability, scope, or some other
 * interesting property of a project's repository.
 */
export enum ProjectAttribute {
  /**
   * A {@link nextjsConfigProjectBase} file exists at the project root.
   */
  Next = 'nextjs',
  /**
   * The root `package.json` file has a `bin` key.
   */
  Cli = 'cli',
  /**
   * A {@link webpackConfigProjectBase} file exists at the project root.
   */
  Webpack = 'webpack',
  /**
   * A `vercel.json` or `.vercel/project.json` file exists at the project root.
   */
  Vercel = 'vercel',
  /**
   * The root `package.json` file does not have a `type: "module"` key.
   */
  Cjs = 'cjs',
  /**
   * The root `package.json` file has a `type: "module"` key.
   */
  Esm = 'esm',
  /**
   * The root `package.json` file has a `private: true` key.
   */
  Private = 'private',
  /**
   * The root `package.json` file has a `workspaces` key.
   */
  Monorepo = 'monorepo',
  /**
   * The root `package.json` file does not have a `workspaces` key.
   */
  Polyrepo = 'polyrepo',
  /**
   * The root `package.json` file has a `workspaces` key and a `src` directory
   * exists at the project root.
   */
  Hybridrepo = 'hybridrepo',
  /**
   * The root `package.json` file contains a `build:dist` script containing the
   * string "--multiversal" or "--not-multiversal=false" and does not contain
   * the string "--multiversal=false"
   */
  Multiversal = 'multiversal'
}

/**
 * A "workspace attribute" describes a capability, scope, or some other
 * interesting property of a workspace/sub-root within a monorepo project.
 */
export enum WorkspaceAttribute {
  /**
   * The workspace's `package.json` file does not have a `type: "module"` key.
   */
  Cjs = 'cjs',
  /**
   * The workspace's `package.json` file has a `bin` key.
   */
  Cli = 'cli',
  /**
   * The workspace's `package.json` file has a `type: "module"` key.
   */
  Esm = 'esm',
  /**
   * The workspace's `package.json` file has a `private: true` key.
   */
  Private = 'private',
  /**
   * A {@link webpackConfigProjectBase} file exists at the workspace's root.
   */
  Webpack = 'webpack',
  /**
   * The workspace root contains the file {@link sharedAttributeFileBase},
   * signifying that paths and commits scoped to this workspace will be
   * considered "global"; that is: as if they existed in the scopes of every
   * workspace in the project.
   *
   * The existence of this attribute will modify the behavior of symbiote
   * commands like "build changelog", and in "release" when analyzing commits to
   * determine the next release version.
   *
   * Beside changelog generation, **no build artifacts or distributables are
   * affected by shared packages**. For instance, a shared package is not
   * automatically included in the build distributables of some other unrelated
   * package.
   */
  Shared = 'shared',
  /**
   * The workspace's `package.json` file contains a `build:dist` script
   * containing the string "--multiversal" or "--not-multiversal=false" and does
   * not contain the string "--multiversal=false"
   */
  Multiversal = 'multiversal'
}

/**
 * A collection of useful information about a project.
 */
export type ProjectMetadata<Json extends PackageJson | XPackageJson = XPackageJson> = {
  /**
   * The type of the project.
   */
  type: ProjectAttribute.Polyrepo | ProjectAttribute.Monorepo;
  /**
   * Project root package data.
   */
  rootPackage: RootPackage<Json>;
  /**
   * The "current package" data. The "current" package is determined by the
   * current working directory and will always strictly equal (`===`) either (1)
   * exactly one value in {@link RootPackage.packages}'s `all` property or (2)
   * `rootPackage`.
   */
  cwdPackage: Package<Json>;
  /**
   * A mapping of sub-root package names to {@link WorkspacePackage} objects in
   * a monorepo, or `undefined` in a polyrepo.
   *
   * Note that unnamed and broken packages are _never_ included in this map,
   * though they may be included in its `unnamed` and `broken` properties
   * depending on the process that generated this metadata object.
   */
  subRootPackages:
    | (Map<WorkspacePackageName, WorkspacePackage> & {
        /**
         * A mapping of sub-root packages missing the `"name"` field in their
         * respective `package.json` files and {@link WorkspacePackage} objects.
         *
         * This mapping is only populated when unnamed packages are _explicitly
         * allowed_ by the process that generated this metadata object.
         * Otherwise, unnamed packages are considered "broken" and will be
         * available under the `broken` property instead.
         */
        unnamed: Map<WorkspacePackageId, WorkspacePackage<PackageJson>>;
        /**
         * An array of "broken" pseudo-sub-root pseudo-package directories that
         * match a workspace path but are missing a valid `package.json`
         * file.
         */
        broken: AbsolutePath[];
        /**
         * An array of *all* non-broken sub-root packages.
         *
         * Unnamed packages are included in this array only when they are
         * _explicitly allowed_ by the process that generated this metadata
         * object.
         *
         * In effect, this property is sugar for the following:
         *
         * ```TypeScript
         * Array.from(packages.values())
         *      .concat(Array.from(packages.unnamed.values()))
         * ```
         */
        all: WorkspacePackage<Json>[];
      })
    | undefined;
};

/**
 * A collection of useful information about a polyrepo.
 *
 * @see {@link ProjectMetadata}
 */
export type PolyrepoMetadata<Json extends PackageJson | XPackageJson = XPackageJson> =
  ProjectMetadata<Json> & {
    type: ProjectAttribute.Polyrepo;
    subRootPackages: undefined;
  };

/**
 * A collection of useful information about a monorepo.
 *
 * @see {@link ProjectMetadata}
 */
export type MonorepoMetadata<Json extends PackageJson | XPackageJson = XPackageJson> =
  ProjectMetadata<Json> & {
    type: ProjectAttribute.Monorepo;
    subRootPackages: NonNullable<ProjectMetadata['subRootPackages']>;
  };

/**
 * Additional scripts available when working on an symbiote-powered project.
 */
export type XPackageJsonScripts = {
  /**
   * Run by users, symbiote, and related tooling when building the current
   * package's production-ready distributables.
   *
   * This script is usually a reference to `npm run build:dist`.
   *
   * @example `npm run build:dist --`
   */
  build?: string;
  /**
   * Run by users, symbiote, and related tooling when building the current
   * package's `CHANGELOG.md` file.
   *
   * @example `symbiote build changelog`
   */
  'build:changelog'?: string;
  /**
   * Run by users, symbiote, and related tooling when building the current
   * package's production-ready distributables.
   *
   * @example `symbiote build distributables --not-multiversal`
   */
  'build:dist'?: string;
  /**
   * Run by users, symbiote, and related tooling when building the current
   * package's documentation (typically found under `docs/`).
   *
   * @example `symbiote build docs`
   */
  'build:docs'?: string;
  /**
   * Run by users, symbiote, and related tooling when building, in topological
   * order, production-ready distributables across all packages in the project.
   *
   * @example `symbiote project topology --run build`
   */
  'build:topological'?: string;
  /**
   * Run by users, symbiote, and related tooling when removing files from the
   * project or package that are ignored by git (with exceptions).
   *
   * @example `symbiote clean`
   */
  clean?: string;
  /**
   * Run by users, symbiote, and related tooling when deploying built
   * distributables to the appropriate remote system(s).
   *
   * @example `symbiote deploy --target ssh --host prod.x.y.com --to-path
   * /prod/some/path`
   */
  deploy?: string;
  /**
   * Run by users, symbiote, and related tooling when formatting the project or
   * package.
   *
   * @example `symbiote format --hush`
   */
  format?: string;
  /**
   * Run by users, symbiote, and related tooling when printing information about
   * the current project or package.
   *
   * @example `symbiote project info`
   */
  info?: string;
  /**
   * Run by users, symbiote, and related tooling when linting the current
   * package's files.
   *
   * This script is usually a reference to `npm run lint:package`.
   *
   * @example `npm run lint:package --`
   */
  lint?: string;
  /**
   * Run by users, symbiote, and related tooling when linting all of the
   * lintable files under the current package's root along with any other source
   * files that comprise this package's build targets (see
   * {@link gatherPackageBuildTargets}).
   *
   * @example `symbiote lint --scope this-package`
   */
  'lint:package'?: string;
  /**
   * Run by users, symbiote, and related tooling when linting all lintable files
   * in the entire project.
   *
   * @example `symbiote lint --scope unlimited`
   */
  'lint:packages'?: string;
  /**
   * Run by users, symbiote, and related tooling when linting a project's
   * metadata, such as its file structure and configuration settings.
   *
   * @example `symbiote project lint`
   */
  'lint:project'?: string;
  /**
   * Run by users, symbiote, and related tooling when printing information about
   * available scripts in `package.json`.
   *
   * @example `symbiote list-tasks`
   */
  'list-tasks'?: string;
  /**
   * Run by users, symbiote, and related tooling when linting, in topological
   * order, files belonging to packages across the project.
   *
   * @example `symbiote project topology --run lint`
   */
  'lint:topological'?: string;
  /**
   * Run by users, symbiote, and related tooling when preparing a fresh
   * development environment.
   *
   * See [the
   * docs](https://docs.npmjs.com/cli/v9/using-npm/scripts#prepare-and-prepublish)
   * for more information.
   *
   * @example `symbiote project prepare`
   */
  prepare?: string;
  /**
   * Run by users, symbiote, and related tooling when potentially releasing the
   * next version of a package.
   *
   * @example `symbiote release --no-parallel`
   */
  release?: string;
  /**
   * Run by users, symbiote, and related tooling when potentially releasing, in
   * topological order, the next version of each package in the project.
   *
   * @example `symbiote project topology --run release`
   */
  'release:topological'?: string;
  /**
   * Run by users, symbiote, and related tooling when manipulating a project's
   * _metadata_, such as its file structure and configuration settings, with the
   * goal of bringing the project up to date with latest best practices.
   *
   * @example `symbiote project renovate --github-reconfigure-repo
   * --regenerate-assets --assets-preset basic`
   */
  renovate?: string;
  /**
   * Run by users, symbiote, and related tooling when attempting to execute a
   * project's distributables locally.
   *
   * See [the docs](https://docs.npmjs.com/cli/v9/using-npm/scripts#npm-start)
   * for more information.
   *
   * @example `symbiote start --`
   */
  start?: string;
  /**
   * Run by users, symbiote, and related tooling when spinning up a project's
   * local development environment.
   */
  dev?: string;
  /**
   * Run by users, symbiote, and related tooling when executing unit tests
   * against the current package.
   *
   * This script is usually a reference to `npm run test:package:unit`. See [the
   * docs](https://docs.npmjs.com/cli/v9/using-npm/scripts#npm-test) for more
   * information.
   *
   * @example `npm run test:package:unit --`
   */
  test?: string;
  /**
   * Run by users, symbiote, and related tooling when executing all possible
   * tests against the current package. In a monorepo context, this script will
   * also run the tests of any package that this package depends on (including
   * transitive dependencies).
   *
   * @example `symbiote test --scope this-package --coverage`
   */
  'test:package:all'?: string;
  /**
   * Run by users, symbiote, and related tooling when executing end-to-end tests
   * against the current package. In a monorepo context, this script will also
   * run the tests of any package that this package depends on (including
   * transitive dependencies).
   *
   * @example `symbiote test --scope this-package --tests end-to-end`
   */
  'test:package:e2e'?: string;
  /**
   * Run by users, symbiote, and related tooling when executing integration
   * tests against the current package. In a monorepo context, this script will
   * also run the tests of any package that this package depends on (including
   * transitive dependencies).
   *
   * @example `symbiote test --scope this-package --tests integration`
   */
  'test:package:integration'?: string;
  /**
   * Run by users, symbiote, and related tooling when executing unit tests
   * against the current package. In a monorepo context, this script will also
   * run the tests of any package that this package depends on (including
   * transitive dependencies).
   *
   * @example `symbiote test --scope this-package --tests unit`
   */
  'test:package:unit'?: string;
  /**
   * Run by users, symbiote, and related tooling when executing all possible
   * tests across the entire project.
   *
   * @example `symbiote test --scope unlimited --coverage`
   */
  'test:packages:all'?: string;
  /**
   * Run by users, symbiote, and related tooling when executing tests against
   * packages, in topological order, across the entire project.
   *
   * @example `symbiote project topology --run test`
   */
  'test:topological'?: string;
};

/**
 * A version of {@link PackageJson} used by symbiote-powered projects with
 * certain additional properties and other properties that are guaranteed to
 * exist.
 */
export type XPackageJson<
  Scripts extends Partial<Record<string, string>> = XPackageJsonScripts
> = Omit<OmitIndexSignature<PackageJson>, 'bin' | 'name'> & {
  scripts?: Scripts;
  bin?: string | Record<string, string>;
  name: NonNullable<PackageJson['name']>;
};

/**
 * A version of {@link XPackageJson} specifically for polyrepo roots.
 */
export type XPackageJsonPolyrepoRoot = Omit<XPackageJson, 'workspaces'>;

/**
 * A version of {@link XPackageJson} specifically for non-hybrid monorepo roots.
 */
export type XPackageJsonMonorepoRoot = Omit<XPackageJson, 'dependencies'> &
  NonNullable<Pick<XPackageJson, 'workspaces'>>;

/**
 * A version of {@link XPackageJson} specifically for hybridrepo roots.
 */
export type XPackageJsonHybridrepoRoot = XPackageJson &
  NonNullable<Pick<XPackageJson, 'workspaces'>>;

/**
 * A version of {@link XPackageJson} specifically for package subroots in a
 * monorepo.
 */
export type XPackageJsonSubRoot = Omit<XPackageJson, 'workspaces' | 'devDependencies'>;

/**
 * Represents any `package.json` file in the wild, including symbiote-ready
 * `package.json` files.
 */
export type GenericPackageJson = PackageJson | XPackageJson;

/**
 * A version of {@link ProjectMetadata} with {@link GenericPackageJson} as its
 * type parameter.
 */
export type GenericProjectMetadata = ProjectMetadata<GenericPackageJson>;

/**
 * A version of {@link Package} with {@link GenericPackageJson} as its type
 * parameter.
 */
export type GenericPackage = Package<GenericPackageJson>;

/**
 * A version of {@link WorkspacePackage} with {@link GenericPackageJson} as its
 * type parameter.
 */
export type GenericWorkspacePackage = WorkspacePackage<GenericPackageJson>;

/**
 * A version of {@link RootPackage} with {@link GenericPackageJson} as its type
 * parameter.
 */
export type GenericRootPackage = RootPackage<GenericPackageJson>;

/**
 * The options accepted by several of the `isX` sentinel functions.
 */
export type SentinelOptions = {
  /**
   * If `true`, both the generic {@link PackageJson} and non-generic
   * {@link XPackageJson} JSON objects are accepted by this instance. If
   * `false`, only {@link XPackageJson} is acceptable.
   *
   * @default true
   */
  generic?: boolean;
};

/**
 * Returns `true` if `o` is probably an instance of `RootPackage` or
 * `WorkspacePackage`.
 */
export function isPackage(o: unknown, options?: { generic?: true }): o is GenericPackage;
export function isPackage(o: unknown, options: { generic: false }): o is Package;
export function isPackage(
  o: unknown,
  options: SentinelOptions
): o is GenericPackage | Package;
export function isPackage(
  o: unknown,
  options: SentinelOptions = {}
): o is GenericPackage | Package {
  return isWorkspacePackage(o, options) || isRootPackage(o, options);
}

/**
 * Returns `true` if `o` is probably an instance of `WorkspacePackage` (i.e. not
 * a {@link RootPackage}).
 */
export function isWorkspacePackage(
  o: unknown,
  options?: { generic?: true }
): o is GenericWorkspacePackage;
export function isWorkspacePackage(
  o: unknown,
  options: { generic: false }
): o is WorkspacePackage;
export function isWorkspacePackage(
  o: unknown,
  options: SentinelOptions
): o is GenericWorkspacePackage | WorkspacePackage;
export function isWorkspacePackage(
  o: unknown,
  { generic = true }: SentinelOptions = {}
): o is GenericWorkspacePackage | WorkspacePackage {
  return (
    !!o &&
    typeof o === 'object' &&
    'id' in o &&
    'root' in o &&
    'relativeRoot' in o &&
    'json' in o &&
    'attributes' in o &&
    'projectMetadata' in o &&
    (generic ? true : isXPackageJson(o.json))
  );
}

/**
 * Returns `true` if `o` is probably an instance of `RootPackage` (i.e. not a
 * {@link WorkspacePackage}).
 */
export function isRootPackage(
  o: unknown,
  options?: { generic?: true }
): o is GenericRootPackage;
export function isRootPackage(o: unknown, options: { generic: false }): o is RootPackage;
export function isRootPackage(
  o: unknown,
  options: SentinelOptions
): o is GenericRootPackage | RootPackage;
export function isRootPackage(
  o: unknown,
  { generic = true }: SentinelOptions = {}
): o is GenericRootPackage | RootPackage {
  return (
    !!o &&
    typeof o === 'object' &&
    !('id' in o) &&
    'root' in o &&
    !('relativeRoot' in o) &&
    'json' in o &&
    'attributes' in o &&
    'projectMetadata' in o &&
    (generic ? true : isXPackageJson(o.json))
  );
}

/**
 * Returns `true` if `o` is probably an instance of `ProjectMetadata`.
 */
export function isProjectMetadata(
  o: unknown,
  options?: { generic?: true }
): o is GenericProjectMetadata;
export function isProjectMetadata(
  o: unknown,
  options: { generic: false }
): o is ProjectMetadata;
export function isProjectMetadata(
  o: unknown,
  options: SentinelOptions
): o is GenericProjectMetadata | ProjectMetadata;
export function isProjectMetadata(
  o: unknown,
  options: SentinelOptions = {}
): o is GenericProjectMetadata | ProjectMetadata {
  return (
    !!o &&
    typeof o === 'object' &&
    'type' in o &&
    [ProjectAttribute.Polyrepo, ProjectAttribute.Monorepo].includes(
      o.type as ProjectAttribute
    ) &&
    'rootPackage' in o &&
    isRootPackage(o.rootPackage, options) &&
    'cwdPackage' in o &&
    isPackage(o.cwdPackage, options) &&
    'subRootPackages' in o &&
    (o.subRootPackages === undefined || isMap(o.subRootPackages))
  );
}

/**
 * Returns `true` if `o` is probably an instance of `XPackageJson`.
 */
export function isXPackageJson(o: unknown): o is XPackageJson {
  return !!(
    o &&
    typeof o === 'object' &&
    'name' in o &&
    typeof o.name === 'string' &&
    o.name.length
  );
}
