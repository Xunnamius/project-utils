import { makeNamedError } from '@-xun/error';

/**
 * Options available when constructing a new `ProjectError` object.
 */
export type ProjectErrorOptions = {
  /**
   * By default, if an {@link Error} object is passed to `ProjectError`, that
   * `Error` instance will be passed through as `ProjectError.cause` and that
   * instance's `Error.message` will be passed through as
   * `ProjectError.message`.
   *
   * Use this option to override this default behavior and instead set
   * `ProjectError.cause` manually.
   */
  cause?: ErrorOptions['cause'];
};

export const { ProjectError } = makeNamedError(
  class ProjectError extends Error implements NonNullable<ProjectErrorOptions> {
    /**
     * Represents a project-specific error, optionally with suggested exit code
     * and other context.
     */
    constructor(reason?: Error | string, options?: ProjectErrorOptions);
    /**
     * This constructor syntax is used by subclasses when calling this
     * constructor via `super`.
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
  },
  'ProjectError'
);

export const { NotAGitRepositoryError } = makeNamedError(
  class NotAGitRepositoryError extends ProjectError {
    /**
     * Represents encountering a project that is not a git repository.
     */
    constructor();
    /**
     * This constructor syntax is used by subclasses when calling this
     * constructor via `super`.
     */
    constructor(message: string);
    constructor(message: string | undefined = undefined) {
      super(message ?? CommonErrorMessage.NotAGitRepositoryError());
    }
  },
  'NotAGitRepositoryError'
);

export const { XPackageJsonNotParsableError } = makeNamedError(
  class XPackageJsonNotParsableError extends ProjectError {
    /**
     * Represents encountering an unparsable package.json file.
     */
    constructor(packageJsonPath: string, reason: unknown);
    /**
     * This constructor syntax is used by subclasses when calling this
     * constructor via `super`.
     */
    constructor(packageJsonPath: string, reason: unknown, message: string);
    constructor(
      public readonly packageJsonPath: string,
      public readonly reason: unknown,
      message: string | undefined = undefined
    ) {
      super(
        message ?? CommonErrorMessage.PackageJsonNotParsable(packageJsonPath, reason)
      );
    }
  },
  'XPackageJsonNotParsableError'
);

export const { DuplicatePackageNameError } = makeNamedError(
  class DuplicatePackageNameError extends ProjectError {
    /**
     * Represents encountering a workspace package.json file with the same
     * `"name"` field as another workspace.
     */
    constructor(packageName: string, firstPath: string, secondPath: string);
    /**
     * This constructor syntax is used by subclasses when calling this
     * constructor via `super`.
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
  },
  'DuplicatePackageNameError'
);

export const { DuplicatePackageIdError } = makeNamedError(
  class DuplicatePackageIdError extends ProjectError {
    /**
     * Represents encountering an unnamed workspace with the same package-id as
     * another workspace.
     */
    constructor(id: string, firstPath: string, secondPath: string);
    /**
     * This constructor syntax is used by subclasses when calling this
     * constructor via `super`.
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
  },
  'DuplicatePackageIdError'
);

/**
 * Represents encountering an unnamed workspace with the same package-id as
 * another workspace.
 */
export type DuplicatePackageIdError = InstanceType<typeof DuplicatePackageIdError>;

/**
 * Represents encountering a workspace package.json file with the same
 * `"name"` field as another workspace.
 */
export type DuplicatePackageNameError = InstanceType<typeof DuplicatePackageNameError>;

/**
 * Represents encountering a project that is not a git repository.
 */
export type NotAGitRepositoryError = InstanceType<typeof NotAGitRepositoryError>;

/**
 * Represents an exception originating from project meta-analysis tooling
 * (e.g. from `@-xun/project`).
 *
 * `ProjectError` is the "foundational" base {@link Error} subclass for
 * several project-related tools among various libraries.
 */
export type ProjectError = InstanceType<typeof ProjectError>;

/**
 * Represents encountering an unparsable package.json file in an
 * symbiote-powered project.
 */
export type XPackageJsonNotParsableError = InstanceType<
  typeof XPackageJsonNotParsableError
>;

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
    return `unable to parse ${packageJsonPath}: ${Error.isError(reason) ? reason.message : String(reason)}`;
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
