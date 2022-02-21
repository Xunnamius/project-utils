import ObjectPath from 'objectpath';

export class CliError extends Error {
  constructor(public readonly exitCode = 1, message?: string) {
    super(message ?? 'an error occurred while executing this program');
  }
}

export class LinterError extends CliError {}

export const ErrorMessage = {
  MissingFile: (filePath: string) => `Missing file: ${filePath}`,
  MissingDirectory: (dirPath: string) => `Missing directory: ${dirPath}`,
  IllegalFileInDirectory: (dirPath: string, fileName: string) =>
    `File ${fileName} is not allowed in ${dirPath}`,
  PackageJsonMissingKey: (key: string) => `The "${key}" key is missing in package.json`,
  PackageJsonObsoleteKey: (key: string) =>
    `The obsolete "${key}" key should not be used in package.json`,
  PackageJsonDuplicateDependency: (dep: string) =>
    `The "${dep}" package appears in both "dependencies" and "devDependencies" in package.json`,
  PackageJsonMissingValue: (key: string, value: string) =>
    `The "${key}" key in package.json does not include value "${value}"`,
  PackageJsonMissingEntryPoint: (entryPoint: string) =>
    `The "exports['${entryPoint}']" entry point is missing in package.json`,
  CommitNeedsFixup: (sha: string) =>
    `Commit "${sha}" contains "fixup" or "mergeme" in its subject and should be squashed/merged`,
  PackageJsonExperimentalVersion: () =>
    `The "version" key in package.json contains an experimental semver (e.g. 0.x.y)`,
  PackageJsonBadEntryPoint: (exportsPath: string[]) =>
    `The "${ObjectPath.stringify([
      'exports',
      ...exportsPath
    ])}" entry point references a non-existent file in package.json`,
  PackageJsonBadEngine: (ltsVersion: string) =>
    `The "engines.node" key in package.json should reference the earliest maintenance version (i.e. ">=${ltsVersion}")`,
  PackageJsonPinnedDependency: (dep: string) =>
    `The "${dep}" package is pinned in package.json`,
  PackageJsonTaggedDependency: (dep: string) =>
    `The "${dep}" package is using a dist-tag instead of a semver in package.json`,
  PackageJsonBadConfigDocsEntry: () =>
    `The "config.docs.entry" key in package.json references a non-existent file`,
  MarkdownMissingTopmatter: (id: string, fileName: string) =>
    `The "${id}" topmatter is missing in ${fileName}`,
  MarkdownBadTopmatter: (id: string, fileName: string) =>
    `The "${id}" topmatter is misconfigured in ${fileName}`,
  MarkdownMissingLink: (id: string, fileName: string) =>
    `The "${id}" standard link is missing in ${fileName}`,
  MarkdownBadLink: (id: string, fileName: string) =>
    `The "${id}" standard link is misconfigured in ${fileName}`
};
