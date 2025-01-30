import { isNativeError } from 'node:util/types';

import { type WorkspacePackageName } from '@-xun/project-types';

import { CommonErrorMessage } from 'multiverse+common:error.ts';
import { type WellKnownImportAlias } from 'multiverse+graph:alias.ts';

import {
  directorySrcPackageBase,
  uriSchemeDelimiterUnescaped,
  uriSchemeSubDelimiterUnescaped
} from 'multiverse+graph:constant.ts';

export * from 'multiverse+common:error.ts';

/**
 * A collection of possible error and warning messages.
 */
/* istanbul ignore next */
export const AnalysisErrorMessage = {
  ...CommonErrorMessage,
  Generic() {
    return 'an error occurred that caused this software to crash';
  },
  GuruMeditation() {
    return 'an impossible scenario occurred';
  },
  PathIsNotAbsolute(path: string) {
    return `"${path}" is not an absolute path`;
  },
  PathIsNotRelative(path: string) {
    return `"${path}" is not a relative path`;
  },
  NotReadable(path: string) {
    return `"${path}" cannot be read and/or does not exist`;
  },
  NotWritable(path: string) {
    return `"${path}" cannot be written to and/or does not exist`;
  },
  NotParsable(path: string, type = 'json') {
    return `${path} cannot be parsed as it does not contain valid ${type}`;
  },
  NotAGitRepositoryError() {
    return 'unable to locate git repository root';
  },
  NotAMonorepoError() {
    return 'the project is not a monorepo (must define "workspaces" field in package.json)';
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
  },
  BadProjectTypeInPackageJson(path: string) {
    return `encountered invalid package.json file with a defined "type" field not equal to either "module" or "commonjs": ${path}`;
  },
  MissingNameInPackageJson(path: string) {
    return `encountered invalid package.json file without a "name" field: ${path}`;
  },
  CannotBeCliAndNextJs() {
    return 'project must either provide a CLI or be a Next.js project';
  },
  IllegalAliasKeyInvalidCharacters(key: string, invalids: RegExp | string) {
    return `encountered illegal alias "${key}": alias key cannot include any of the following characters: ${toCharacters(invalids)}`;
  },
  IllegalAliasValueInvalidCharacters(
    key: string,
    path: string,
    invalids: RegExp | string
  ) {
    return `encountered illegal alias "${key}": alias value (path) "${path}" cannot include any of the following characters: ${toCharacters(invalids)}`;
  },
  IllegalAliasValueInvalidSeparatorAdfix(key: string, path: string) {
    return `encountered illegal alias "${key}": alias value (path) "${path}" cannot begin or end with the "/" or "\\" characters, or resemble a relative specifier`;
  },
  IllegalAliasBadSuffix(key: string) {
    return `encountered illegal alias "${key}": when the alias value (path) is configured with \`{ suffix: 'open' }\`, the alias key must also be configured with \`{ suffix: 'open' }\``;
  },
  MissingOptionalBabelDependency(caller: string) {
    return `invoking \`${caller}\` requires the "@babel/core" and "@babel/plugin-syntax-typescript" packages. Run \`npm install --save-dev @babel/core @babel/plugin-syntax-typescript\` and then try again`;
  },
  AssertionFailedWantedPathIsNotSeenPath() {
    return 'assertion failed: wantedPath does not map cleanly to seenPath';
  },
  DeriverAsyncConfigurationConflict() {
    return 'assertion failed: attempted to invoke function with conflicting or illegal configuration options';
  },
  UnsupportedFeature(feature: string) {
    return `this package does not support ${feature}`;
  },
  SpecifierNotOkEmpty(specifier: string, path?: string) {
    return `encountered illegal import specifier "${specifier}": specifier cannot be empty${path ? ` in ${path}` : ''}`;
  },
  SpecifierNotOkRelative(specifier: string, path?: string) {
    return `encountered illegal import specifier "${specifier}": prefer (non-relative) alias imports over imports that include a relative or absolute path${path ? ` in ${path}` : ''}`;
  },
  SpecifierNotOkVerseNotAllowed(
    verse: WellKnownImportAlias | string,
    specifier: string,
    path?: string
  ) {
    return `encountered illegal import specifier "${specifier}": ${verse} imports are not allowed ${path ? `in ${path}` : 'here'}`;
  },
  SpecifierNotOkMissingExtension(specifier: string, path?: string) {
    return `encountered illegal import specifier "${specifier}": all non-exact aliases must end with an extension${path ? ` in ${path}` : ''}`;
  },
  SpecifierNotOkUnnecessaryIndex(specifier: string, path?: string) {
    return `encountered illegal import specifier "${specifier}": this specifier should be replaced with "${specifier.split(uriSchemeDelimiterUnescaped)[0]}" or the "index.ts" file renamed to something else${path ? ` in ${path}` : ''}`;
  },
  SpecifierNotOkSelfReferential(specifier: string, path?: string) {
    return AnalysisErrorMessage.SpecifierNotOkSuboptimal(
      specifier,
      `universe${uriSchemeSubDelimiterUnescaped}${specifier.split(uriSchemeSubDelimiterUnescaped).at(-1)!.replace(`${uriSchemeDelimiterUnescaped}${directorySrcPackageBase}/`, uriSchemeDelimiterUnescaped)}`,
      path
    );
  },
  SpecifierNotOkSuboptimal(
    specifier: string,
    replacement: string | undefined,
    path?: string
  ) {
    return `encountered suboptimal import specifier "${specifier}": this specifier should be replaced with ${replacement ? `"${replacement}"` : 'something else or the import should be removed entirely'}${path ? ` in ${path}` : ''}`;
  },
  UnknownWorkspacePackageName(name: WorkspacePackageName) {
    return `this project has no workspace package named "${name}"`;
  },
  PathOutsideRoot(path: string) {
    return `path is outside of the project root: ${path}`;
  },
  DependencyCycle(involvedPackages: string[]) {
    return `a dependency cycle was detected involving two or more of the following packages: ${involvedPackages.join(', ')}`;
  },
  IllegalPrivateDependency(dependent: string, dependency: string) {
    return `the non-private package "${dependent}" cannot have the private dependency "${dependency}"`;
  }
};

function toCharacters(regExpOrString: RegExp | string) {
  if (typeof regExpOrString === 'string') {
    return regExpOrString;
  }

  const hadBackslash = regExpOrString.source.includes('\\');
  const source = regExpOrString.source.replaceAll('\\', '').split('').join(', ');

  return `${source}${hadBackslash ? (source.length ? ', ' : '') + '\\' : ''}`;
}
