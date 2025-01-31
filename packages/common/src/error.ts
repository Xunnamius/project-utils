import { isNativeError } from 'node:util/types';

import { makeNamedError } from 'named-app-errors';

export const $type = Symbol.for('object-type-hint');
export const $type_ProjectError = Symbol.for('object-type-hint:ProjectError');
export const $type_NotAGitRepositoryError = Symbol.for(
  'object-type-hint:NotAGitRepositoryError'
);
export const $type_XPackageJsonNotParsableError = Symbol.for(
  'object-type-hint:XPackageJsonNotParsableError'
);
export const $type_DuplicatePackageNameError = Symbol.for(
  'object-type-hint:DuplicatePackageNameError'
);
export const $type_DuplicatePackageIdError = Symbol.for(
  'object-type-hint:DuplicatePackageIdError'
);

/**
 * Options available when constructing a new `ProjectError` object.
 */
export type ProjectErrorOptions = {
  /**
   * By default, if an {@link Error} object is passed to `CliError`, that
   * `Error` instance will be passed through as `CliError.cause` and that
   * instance's `Error.message` will be passed through as `CliError.message`.
   *
   * Use this option to override this default behavior and instead set
   * `CliError.cause` manually.
   */
  cause?: ErrorOptions['cause'];
};

// TODO: Need to ensure isXError functions deal with inheritance/extends

/**
 * Type guard for {@link ProjectError}.
 */
// TODO: make-named-error should create and return this function automatically
export function isProjectError(parameter: unknown): parameter is ProjectError {
  return (
    isNativeError(parameter) &&
    $type in parameter &&
    Array.isArray(parameter[$type]) &&
    parameter[$type].includes($type_ProjectError)
  );
}

/**
 * Type guard for {@link NotAGitRepositoryError}.
 */
export function isNotAGitRepositoryError(
  parameter: unknown
): parameter is NotAGitRepositoryError {
  return (
    isProjectError(parameter) && parameter[$type].includes($type_NotAGitRepositoryError)
  );
}

/**
 * Type guard for {@link XPackageJsonNotParsableError}.
 */
export function isXPackageJsonNotParsableError(
  parameter: unknown
): parameter is XPackageJsonNotParsableError {
  return (
    isProjectError(parameter) &&
    parameter[$type].includes($type_XPackageJsonNotParsableError)
  );
}

/**
 * Type guard for {@link DuplicatePackageNameError}.
 */
export function isDuplicatePackageNameError(
  parameter: unknown
): parameter is DuplicatePackageNameError {
  return (
    isProjectError(parameter) &&
    parameter[$type].includes($type_DuplicatePackageNameError)
  );
}

/**
 * Type guard for {@link DuplicatePackageIdError}.
 */
export function isDuplicatePackageIdError(
  parameter: unknown
): parameter is DuplicatePackageIdError {
  return (
    isProjectError(parameter) && parameter[$type].includes($type_DuplicatePackageIdError)
  );
}

// TODO: this type of error should probably be foundational since we're using it
// TODO: often
/**
 * Represents an exception originating from project meta-analysis tooling (e.g.
 * @-xun/project).
 */
export class ProjectError extends Error implements NonNullable<ProjectErrorOptions> {
  // TODO: this prop should be added by makeNamedError or whatever other fn
  [$type] = [$type_ProjectError];
  /**
   * Represents a project-specific error, optionally with suggested exit code
   * and other context.
   */
  constructor(reason?: Error | string, options?: ProjectErrorOptions);
  /**
   * This constructor syntax is used by subclasses when calling this constructor
   * via `super`.
   */
  constructor(
    reason: Error | string,
    options: ProjectErrorOptions,
    message: string,
    superOptions: ErrorOptions
  );
  constructor(
    reason: Error | string | undefined,
    options: ProjectErrorOptions = {},
    message: string | undefined = undefined,
    superOptions: ErrorOptions = {}
  ) {
    let { cause } = options;

    message =
      message ??
      (typeof reason === 'string' ? reason : reason?.message) ??
      CommonErrorMessage.Generic();

    if (!('cause' in options)) {
      cause = typeof reason === 'string' ? undefined : reason;
    }

    super(message, { cause, ...superOptions });
  }
}
makeNamedError(ProjectError, 'ProjectError');

/**
 * Represents encountering a project that is not a git repository.
 */
export class NotAGitRepositoryError extends ProjectError {
  // TODO: this prop should be added by makeNamedError or whatever other fn
  [$type] = [$type_NotAGitRepositoryError, $type_ProjectError];
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
    super(message ?? CommonErrorMessage.NotAGitRepositoryError());
  }
}
makeNamedError(NotAGitRepositoryError, 'NotAGitRepositoryError');

/**
 * Represents encountering an unparsable package.json file in an
 * symbiote-powered project.
 */
export class XPackageJsonNotParsableError extends ProjectError {
  // TODO: this prop should be added by makeNamedError or whatever other fn
  [$type] = [$type_XPackageJsonNotParsableError, $type_ProjectError];
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
    super(message ?? CommonErrorMessage.PackageJsonNotParsable(packageJsonPath, reason));
  }
}
makeNamedError(XPackageJsonNotParsableError, 'XPackageJsonNotParsableError');

/**
 * Represents encountering a workspace package.json file with the same `"name"`
 * field as another workspace.
 */
export class DuplicatePackageNameError extends ProjectError {
  // TODO: this prop should be added by makeNamedError or whatever other fn
  [$type] = [$type_DuplicatePackageNameError, $type_ProjectError];
  /**
   * Represents encountering a workspace package.json file with the same
   * `"name"` field as another workspace.
   */
  constructor(packageName: string, firstPath: string, secondPath: string);
  /**
   * This constructor syntax is used by subclasses when calling this constructor
   * via `super`.
   */
  constructor(
    packageName: string,
    firstPath: string,
    secondPath: string,
    message: string
  );
  constructor(
    public readonly packageName: string,
    public readonly firstPath: string,
    public readonly secondPath: string,
    message: string | undefined = undefined
  ) {
    super(
      message ??
        CommonErrorMessage.DuplicatePackageName(packageName, firstPath, secondPath)
    );
  }
}
makeNamedError(DuplicatePackageNameError, 'DuplicatePackageNameError');

/**
 * Represents encountering an unnamed workspace with the same package-id as
 * another workspace.
 */
export class DuplicatePackageIdError extends ProjectError {
  // TODO: this prop should be added by makeNamedError or whatever other fn
  [$type] = [$type_DuplicatePackageIdError, $type_ProjectError];
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
    super(message ?? CommonErrorMessage.DuplicatePackageId(id, firstPath, secondPath));
  }
}
makeNamedError(DuplicatePackageIdError, 'DuplicatePackageIdError');

/**
 * A collection of possible error and warning messages.
 */
/* istanbul ignore next */
export const CommonErrorMessage = {
  Generic() {
    return 'an error occurred that caused this software to crash';
  },
  GuruMeditation() {
    return 'an impossible scenario occurred';
  },
  NotAGitRepositoryError() {
    return 'unable to locate git repository root';
  },
  PackageJsonNotParsable(packageJsonPath: string, reason: unknown) {
    return `unable to parse ${packageJsonPath}: ${isNativeError(reason) ? reason.message : String(reason)}`;
  },
  DuplicatePackageName(packageName: string, firstPath: string, secondPath: string) {
    return (
      `the following packages must not have the same name "${packageName}":\n` +
      `  ${firstPath}\n` +
      `  ${secondPath}`
    );
  },
  DuplicatePackageId(id: string, firstPath: string, secondPath: string) {
    return (
      `the following unnamed packages must not have the same package-id "${id}":\n` +
      `  ${firstPath}\n` +
      `  ${secondPath}`
    );
  }
};
