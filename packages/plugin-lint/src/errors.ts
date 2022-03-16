import ObjectPath from 'objectpath';
import { makeNamedError } from 'named-app-errors';
import { markdownReadmeStandardTopmatter } from './constants';

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
  PackageJsonIllegalKey: (key: string) =>
    `The file should not contain the "${key}" field`,
  PackageJsonMissingKey: (key: string) => `The file is missing the "${key}" field`,
  PackageJsonMissingKeysCheckSkipped: () =>
    `Some checks were skipped because package.json is missing the "repository" and/or "name" fields, or the "repository" field does not contain a GitHub url`,
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
  PackageJsonBadEngine: (expectedEnginesSemver: string) =>
    `The file's "engines.node" field should use the recommended value: "${expectedEnginesSemver}"`,
  PackageJsonPinnedDependency: (dep: string) =>
    `The file references a pinned version of the "${dep}" dependency`,
  PackageJsonNonSemverDependency: (dep: string) =>
    `The file references a non-semver version of the "${dep}" dependency`,
  PackageJsonBadConfigDocsEntry: () =>
    `The file's "config.docs.entry" field references a non-existent file`,
  MarkdownMissingTopmatter: () => `The file has none of the standard link references`,
  MarkdownMissingTopmatterItem: (item: string) =>
    `The file is missing the "${item}" topmatter item`,
  MarkdownUnknownTopmatterItem: (item: string) =>
    `The file contains the unknown or out-of-context topmatter item "${item}"`,
  MarkdownTopmatterOutOfOrder: () =>
    `The file's topmatter items appear in a non-standard order`,
  MarkdownInvalidSyntaxOpeningComment: () =>
    `The file has invalid topmatter syntax: missing opening comment "${markdownReadmeStandardTopmatter.comment.start}"`,
  MarkdownInvalidSyntaxClosingComment: () =>
    `The file has invalid topmatter syntax: missing closing comment "${markdownReadmeStandardTopmatter.comment.end}"`,
  MarkdownInvalidSyntaxLinkRef: (label: string | null | undefined) =>
    `The file has invalid topmatter syntax: "${
      label || '(unlabeled)'
    }" link reference should have exactly 1 image reference child element`,
  MarkdownBadTopmatterLinkRefLabel: (
    actualLabel: string | null | undefined,
    expectedLabel: string
  ) =>
    `The file has a misconfigured topmatter item: "${
      actualLabel || '(unlabeled)'
    }" link reference label should be "${expectedLabel}"`,
  MarkdownBadTopmatterImageRefAlt: (
    actualLabel: string | null | undefined,
    expectedLabel: string
  ) =>
    `The file has a misconfigured topmatter item: "${
      actualLabel || '(unlabeled)'
    }" image reference alt text should be "${expectedLabel}"`,
  MarkdownBadTopmatterMissingLinkRefDef: (label: string | null | undefined) =>
    `The file has a misconfigured topmatter item: "${
      label || '(unlabeled)'
    }" link reference definition is missing`,
  MarkdownBadTopmatterMissingImageRefDef: (label: string | null | undefined) =>
    `The file has a misconfigured topmatter item: "${
      label || '(unlabeled)'
    }" image reference definition is missing`,
  MarkdownBadTopmatterImageRefDefTitle: (
    label: string | null | undefined,
    title: string
  ) =>
    `The file has a misconfigured topmatter item: "${
      label || '(unlabeled)'
    }" image reference definition title text should be "${title}"`,
  MarkdownBadTopmatterImageRefDefUrl: (label: string | null | undefined, url: string) =>
    `The file has a misconfigured topmatter item: "${
      label || '(unlabeled)'
    }" image reference definition url should be "${url}"`,
  MarkdownBadTopmatterLinkRefDefUrl: (label: string | null | undefined, url: string) =>
    `The file has a misconfigured topmatter item: "${
      label || '(unlabeled)'
    }" link reference definition url should be "${url}"`,
  MarkdownMissingLink: (label: string) =>
    `The file is missing the "${label}" standard link`,
  MarkdownBadLink: (label: string | null | undefined, url: string) =>
    `The file has a misconfigured standard link: "${
      label || '(unlabeled)'
    }" link reference definition url should be "${url}"`
};
