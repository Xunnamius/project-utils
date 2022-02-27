import ObjectPath from 'objectpath';
import { makeNamedError } from 'named-app-errors';

/**
 * Represents an exception during the CLI runtime.
 */
export class CliError extends Error {
  constructor(public readonly exitCode = 1, message?: string) {
    super(message ?? 'an error occurred while executing this program');
  }
}
makeNamedError(CliError, 'CliError');

/**
 * Represents a linting error.
 */
export class LinterError extends CliError {}
makeNamedError(LinterError, 'LinterError');

/**
 * A collection of possible linting errors and warnings.
 */
export const ErrorMessage = {
  NotAGitRepository: () => 'The project is not Git repository',
  DuplicatePackageId: (packageId: string, packagePath: string) =>
    `${ErrorMessage.PackageJsonMissingKey(
      'name'
    )}.\nThis is not a problem except that package-id "${packageId}" is already used by another unnamed package: ${packagePath}`,
  DuplicatePackageName: (packageName: string, packagePath: string) =>
    `The package name "${packageName}" is already used by another package: ${packagePath}`,
  FatalMissingFile: () =>
    `${ErrorMessage.MissingFile()}.\nThe file must exist for compatibility with Projector-based workflows`,
  MissingFile: () => `The file does not exist but is expected`,
  MissingDirectory: () => `The directory does not exist but is expected`,
  IllegalItemInDirectory: (dirPath: string) =>
    `The file or directory should not exist under ${dirPath}`,
  PackageJsonUnparsable: () => `The file could not be parsed as JSON`,
  PackageJsonMissingKey: (key: string) => `The file is missing the "${key}" field`,
  PackageJsonObsoleteKey: (key: string) =>
    `The file contains the obsolete "${key}" field`,
  PackageJsonDuplicateDependency: (dep: string) =>
    `The "${dep}" package appears in both "dependencies" and "devDependencies"`,
  PackageJsonMissingValue: (key: string, value: string) =>
    `The "${key}" field does not include value "${value}"`,
  PackageJsonMissingEntryPoint: (entryPoint: string) =>
    `The "exports['${entryPoint}']" entry point is missing`,
  CommitNeedsFixup: (sha: string) =>
    `The commit "${sha}" contains "fixup" or "mergeme" in its subject and should be squashed/merged`,
  PackageJsonExperimentalVersion: () =>
    `The "version" field contains an experimental semver (e.g. 0.x.y)`,
  PackageJsonBadEntryPoint: (exportsPath: string[]) =>
    `The "${ObjectPath.stringify([
      'exports',
      ...exportsPath
    ])}" entry point references a non-existent file`,
  PackageJsonBadEngine: (engineSemver: string) =>
    `The "engines.node" field should use the recommended value: "${engineSemver}")`,
  PackageJsonPinnedDependency: (dep: string) => `The "${dep}" package is pinned`,
  PackageJsonTaggedDependency: (dep: string) =>
    `The "${dep}" package was installed using a dist-tag instead of a semver`,
  PackageJsonBadConfigDocsEntry: () =>
    `The "config.docs.entry" field references a non-existent file`,
  MarkdownMissingTopmatter: (item: string) => `The "${item}" topmatter item is missing`,
  MarkdownBadTopmatter: (item: string) => `The "${item}" topmatter item is misconfigured`,
  MarkdownMissingLink: (link: string) => `The "${link}" standard link is missing`,
  MarkdownBadLink: (link: string) => `The "${link}" standard link is misconfigured`
};
