import { PackageJson } from 'type-fest';

/**
 * Type describing the global config object used by various Projector plugins
 * and shared configuration packages.
 */
export type PackageJsonConfig = {
  /**
   * Configurations that affect code, asset, and/or resource generation.
   */
  'plugin-build'?: {
    /**
     * Configurations that affect documentation generation.
     */
    docs?: {
      /**
       * Determines the entry point for generating documentation using
       * `typedoc`. At the moment, only one entry point per package is
       * supported.
       */
      entry?: string;
    };
    /**
     * Configurations that affect codecov coverage generation and data upload.
     */
    codecov?: {
      /**
       * Determines the flag used when uploading coverage data to codecov.
       *
       * @see https://docs.codecov.com/docs/flags
       */
      flag?: string;
    };
  };
  /**
   * Configurations that affect project linting.
   */
  'plugin-lint'?: {
    /**
     * Configurations that affect checks for potentially disabled links.
     */
    'link-protection'?: {
      /**
       * One or more glob patterns used to ignore files that shouldn't be
       * checked for disabled links. Use this to get rid of false positives.
       *
       * Globs will be resolved relative to the `package.json` file in which
       * they appear. Absolute globs are also supported but not recommended.
       */
      ignore?: string[];
    };
  };
};

/**
 * Type for npm's `package.json` file based on type-fest's `PackageJson` type
 * but with optional shared `config` definitions included.
 */
export type PackageJsonWithConfig = PackageJson & { config?: PackageJsonConfig };
