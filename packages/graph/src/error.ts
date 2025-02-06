import { FsErrorMessage } from '@-xun/project-fs/error';

import { CommonErrorMessage } from 'multiverse+common:error.ts';

import {
  directorySrcPackageBase,
  uriSchemeDelimiterUnescaped,
  uriSchemeSubDelimiterUnescaped
} from 'universe+graph:constant.ts';

import type { WellKnownImportAlias } from 'universe+graph:alias.ts';

export * from 'multiverse+common:error.ts';

/**
 * A collection of possible error and warning messages.
 */
/* istanbul ignore next */
export const GraphErrorMessage = {
  ...CommonErrorMessage,
  TargetUnserializable() {
    return 'attempted to serialize an unserializable id component';
  },
  // eslint-disable-next-line @typescript-eslint/unbound-method
  DeriverAsyncConfigurationConflict: FsErrorMessage.DeriverAsyncConfigurationConflict,
  NotAMonorepoError() {
    return 'the project is not a monorepo (must define "workspaces" field in package.json)';
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
    return `encountered illegal import specifier "${specifier}": this specifier should be replaced with "${specifier.split(uriSchemeDelimiterUnescaped)[0]!}" or the "index.ts" file renamed to something else${path ? ` in ${path}` : ''}`;
  },
  SpecifierNotOkSelfReferential(specifier: string, path?: string) {
    return GraphErrorMessage.SpecifierNotOkSuboptimal(
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
