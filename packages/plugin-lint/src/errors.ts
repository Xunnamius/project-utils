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
    `The file includes the "${dep}" dependency in both "dependencies" and "devDependencies"`,
  PackageJsonMissingValue: (key: string, value: string) =>
    `The file has the "${key}" field but it is missing value "${value}"`,
  PackageJsonMissingEntryPoint: (entryPoint: string) =>
    `The file is missing the "exports['${entryPoint}']" entry point`,
  CommitNeedsFixup: () =>
    `The commit contains "fixup" or "mergeme" in its subject and should be squashed/merged`,
  PackageJsonExperimentalVersion: () =>
    `The file's "version" field has an experimental semver value (e.g. 0.x.y)`,
  PackageJsonBadEntryPoint: (exportsPath: string[]) =>
    `The file's "${ObjectPath.stringify([
      'exports',
      ...exportsPath
    ])}" entry point references a non-existent file`,
  PackageJsonBadTypesEntryPoint: (typesPath: string[]) =>
    `The file's "${ObjectPath.stringify([
      'typesVersions',
      ...typesPath
    ])}" entry point references no existing files`,
  PackageJsonBadEngine: (engineSemver: string) =>
    `The file's "engines.node" field should use the recommended value: "${engineSemver}")`,
  PackageJsonPinnedDependency: (dep: string) =>
    `The file references a pinned version of the "${dep}" dependency`,
  PackageJsonTaggedDependency: (dep: string) =>
    `The file references a dist-tag version of the "${dep}" dependency`,
  PackageJsonBadConfigDocsEntry: () =>
    `The file's "config.docs.entry" field references a non-existent file`,
  MarkdownMissingTopmatter: (item: string) =>
    `The file is missing the "${item}" topmatter item`,
  MarkdownBadTopmatter: (item: string) =>
    `The file has misconfigured the "${item}" topmatter item`,
  MarkdownMissingLink: (link: string) =>
    `The file is missing the "${link}" standard link`,
  MarkdownBadLink: (link: string) =>
    `The file has misconfigured the "${link}" standard link`
};
