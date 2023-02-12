import { makeNamedError } from 'named-app-errors';

/**
 * Represents an exception during context resolution.
 */
export class ContextError extends Error {}
makeNamedError(ContextError, 'ContextError');

/**
 * Represents encountering a path that is unexpectedly not absolute.
 */
export class PathIsNotAbsoluteError extends ContextError {
  /**
   * Represents encountering a path that is unexpectedly not absolute.
   */
  constructor(path: string);
  /**
   * This constructor syntax is used by subclasses when calling this constructor
   * via `super`.
   */
  constructor(path: string, message: string);
  constructor(public readonly path: string, message: string | undefined = undefined) {
    super(message ?? `"${path}" is not an absolute path`);
  }
}
makeNamedError(PathIsNotAbsoluteError, 'PathIsNotAbsoluteError');

/**
 * Represents encountering a project that is not a git repository.
 */
export class NotAGitRepositoryError extends ContextError {
  /**
   * Represents encountering a project that is not a git repository.
   */
  constructor();
  /**
   * This constructor syntax is used by subclasses when calling this constructor
   * via `super`.
   */
  constructor(message: string);
  constructor(message: string | undefined = undefined) {
    super(message ?? 'unable to locate git repository root');
  }
}
makeNamedError(NotAGitRepositoryError, 'NotAGitRepositoryError');

/**
 * Represents unexpectedly encountering a project that is not a monorepo.
 */
export class NotAMonorepoError extends ContextError {
  /**
   * Represents unexpectedly encountering a project that is not a monorepo.
   */
  constructor();
  /**
   * This constructor syntax is used by subclasses when calling this constructor
   * via `super`.
   */
  constructor(message: string);
  constructor(message: string | undefined = undefined) {
    super(
      message ??
        'the project is not a monorepo (must define "workspaces" field in package.json)'
    );
  }
}
makeNamedError(NotAMonorepoError, 'NotAMonorepo');

/**
 * Represents a failure to find a package.json file.
 */
export class PackageJsonNotFoundError extends ContextError {
  /**
   * Represents a failure to find a package.json file.
   */
  constructor(reason: unknown);
  /**
   * This constructor syntax is used by subclasses when calling this constructor
   * via `super`.
   */
  constructor(reason: unknown, message: string);
  constructor(public readonly reason: unknown, message: string | undefined = undefined) {
    super(message ?? `unable to load package.json: ${reason}`);
  }
}
makeNamedError(PackageJsonNotFoundError, 'PackageJsonNotFoundError');

/**
 * Represents encountering an unparsable package.json file.
 */
export class BadPackageJsonError extends ContextError {
  /**
   * Represents encountering an unparsable package.json file.
   */
  constructor(packageJsonPath: string, reason: unknown);
  /**
   * This constructor syntax is used by subclasses when calling this constructor
   * via `super`.
   */
  constructor(packageJsonPath: string, reason: unknown, message: string);
  constructor(
    public readonly packageJsonPath: string,
    public readonly reason: unknown,
    message: string | undefined = undefined
  ) {
    super(message ?? `unable to parse ${packageJsonPath}: ${reason}`);
  }
}
makeNamedError(BadPackageJsonError, 'BadPackageJsonError');

/**
 * Represents encountering two or more workspaces that cannot be differentiated
 * from each other.
 */
export class DuplicateWorkspaceError extends ContextError {}
makeNamedError(DuplicateWorkspaceError, 'DuplicateWorkspaceError');

/**
 * Represents encountering a workspace package.json file with the same `"name"`
 * field as another workspace.
 */
export class DuplicatePackageNameError extends DuplicateWorkspaceError {
  /**
   * Represents encountering a workspace package.json file with the same
   * `"name"` field as another workspace.
   */
  constructor(pkgName: string, firstPath: string, secondPath: string);
  /**
   * This constructor syntax is used by subclasses when calling this constructor
   * via `super`.
   */
  constructor(pkgName: string, firstPath: string, secondPath: string, message: string);
  constructor(
    public readonly pkgName: string,
    public readonly firstPath: string,
    public readonly secondPath: string,
    message: string | undefined = undefined
  ) {
    super(
      message ??
        `the following packages must not have the same name "${pkgName}":\n` +
          `  ${firstPath}\n` +
          `  ${secondPath}`
    );
  }
}
makeNamedError(DuplicatePackageNameError, 'DuplicatePackageNameError');

/**
 * Represents encountering an unnamed workspace with the same package-id as
 * another workspace.
 */
export class DuplicatePackageIdError extends DuplicateWorkspaceError {
  /**
   * Represents encountering an unnamed workspace with the same package-id as
   * another workspace.
   */
  constructor(id: string, firstPath: string, secondPath: string);
  /**
   * This constructor syntax is used by subclasses when calling this constructor
   * via `super`.
   */
  constructor(id: string, firstPath: string, secondPath: string, message: string);
  constructor(
    public readonly id: string,
    public readonly firstPath: string,
    public readonly secondPath: string,
    message: string | undefined = undefined
  ) {
    super(
      message ??
        `the following unnamed packages must not have the same package-id "${id}":\n` +
          `  ${firstPath}\n` +
          `  ${secondPath}`
    );
  }
}
makeNamedError(DuplicatePackageIdError, 'DuplicatePackageIdError');

/**
 * Represents an error that occurred while resolving a specifier, entry point,
 * path, or some other identifier.
 */
export class ResolutionError extends Error {
  /**
   * Represents an error that occurred while resolving a specifier, entry point,
   * path, or some other identifier.
   */
  constructor(message: string) {
    super(message);
  }
}
makeNamedError(ResolutionError, 'ResolutionError');
