/**
 * ```text
 *                          v
 * URI = scheme+sub-scheme ":" ["//" authority] path ["?" query] ["#" fragment]
 *                          ^
 * ```
 *
 * Note that this delimiter is not escaped for use in regular expressions.
 *
 * @see https://en.wikipedia.org/wiki/Uniform_Resource_Identifier#Syntax
 */
export const uriSchemeDelimiterUnescaped = ':';

/**
 * This delimiter is escaped for use in regular expressions.
 *
 * @see {@link uriSchemeDelimiterUnescaped}
 */
export const uriSchemeDelimiterEscaped = ':';

/**
 * ```text
 *             v
 * URI = scheme+sub-scheme ":" ["//" authority] path ["?" query] ["#" fragment]
 *             ^
 * ```
 *
 * Note that this delimiter is not escaped for use in regular expressions.
 *
 * @see https://en.wikipedia.org/wiki/Uniform_Resource_Identifier#Syntax
 */
export const uriSchemeSubDelimiterUnescaped = '+';

/**
 * This delimiter is escaped for use in regular expressions.
 *
 * @see {@link uriSchemeSubDelimiterUnescaped}
 */
export const uriSchemeSubDelimiterEscaped = String.raw`\+`;

/**
 * The basename of a well-known Typescript configuration file.
 */
export enum Tsconfig {
  ProjectBase = 'tsconfig.json',
  ProjectLint = 'tsc.project.lint.json',
  PackageDocumentation = 'tsc.package.docs.json',
  PackageLint = 'tsc.package.lint.json',
  PackageTypes = 'tsc.package.types.json'
}

/**
 * The basename of the well-known Jest configuration file.
 */
export const jestConfigProjectBase = 'jest.config.mjs';

/**
 * The basename of the well-known Tstyche configuration file.
 */
export const tstycheConfigProjectBase = 'tstyche.config.json';

/**
 * The basename of the well-known Webpack configuration file.
 */
export const webpackConfigProjectBase = 'webpack.config.mjs';

/**
 * The basename of the well-known Eslint configuration file.
 */
export const eslintConfigProjectBase = 'eslint.config.mjs';

/**
 * The basename of the well-known Babel configuration file.
 */
export const babelConfigProjectBase = 'babel.config.cjs';

/**
 * The basename of the well-known Remark configuration file.
 */
export const remarkConfigProjectBase = '.remarkrc.mjs';

/**
 * The basename of the well-known xrelease configuration file.
 */
export const xreleaseConfigProjectBase = 'release.config.cjs';

/**
 * The basename of the well-known xchangelog configuration file.
 */
export const xchangelogConfigProjectBase = 'conventional.config.cjs';

/**
 * The basename of the well-known Dotenv file.
 */
export const dotEnvConfigProjectBase = '.env';

/**
 * The basename of the well-known "default" Dotenv file.
 */
export const dotEnvDefaultConfigProjectBase = '.env.default';

/**
 * The basename of the well-known All-contributors configuration file.
 */
export const allContributorsConfigProjectBase = '.all-contributorsrc';

/**
 * The basename of the well-known Browserslist configuration file.
 */
export const browserslistrcConfigProjectBase = '.browserslistrc';

/**
 * The basename of the well-known Codecov configuration file.
 */
export const codecovConfigProjectBase = '.codecov.yml';

/**
 * The basename of the well-known editor-config configuration file.
 */
export const editorConfigProjectBase = '.editorconfig';

/**
 * The basename of the well-known git-attributes configuration file.
 */
export const gitattributesConfigProjectBase = '.gitattributes';

/**
 * The basename of the well-known GitHub repository configuration directory.
 */
export const directoryGithubConfigProjectBase = '.github';

/**
 * The basename of the well-known git-ignore configuration file.
 */
export const gitignoreConfigProjectBase = '.gitignore';

/**
 * The basename of the well-known Husky configuration directory.
 */
export const directoryHuskyProjectBase = '.husky';

/**
 * The basename of the well-known npm-check-updates configuration file.
 */
export const ncuConfigProjectBase = '.ncurc.cjs';

/**
 * The basename of the well-known Prettier configuration file.
 */
export const prettierConfigProjectBase = 'prettier.config.mjs';

/**
 * The basename of the well-known prettier-ignore configuration file.
 */
export const prettierIgnoreConfigProjectBase = '.prettierignore';

/**
 * The basename of the well-known spellcheck-ignore (from commit-spell)
 * configuration file.
 */
export const spellcheckIgnoreConfigProjectBase = '.spellcheckignore';

/**
 * The basename of the well-known Vscode configuration directory.
 */
export const directoryVscodeProjectBase = '.vscode';

/**
 * The basename of the well-known .wiki directory.
 */
export const directoryWikiProjectBase = '.wiki';

/**
 * The basename of the well-known ARCHITECTURE file.
 */
export const markdownArchitectureProjectBase = 'ARCHITECTURE.md';

/**
 * The basename of the well-known CONTRIBUTING file.
 */
export const markdownContributingProjectBase = 'CONTRIBUTING.md';

/**
 * The basename of the well-known MAINTAINING file.
 */
export const markdownMaintainingProjectBase = 'MAINTAINING.md';

/**
 * The basename of the well-known SECURITY file.
 */
export const markdownSecurityProjectBase = 'SECURITY.md';

/**
 * The basename of the well-known commit-lint configuration file.
 */
export const commitlintConfigProjectBase = 'commitlint.config.mjs';

/**
 * The basename of the well-known lint-staged configuration file.
 */
export const lintStagedConfigProjectBase = 'lint-staged.config.mjs';

/**
 * The basename of the well-known Postcss configuration file.
 */
export const postcssConfigProjectBase = 'postcss.config.mjs';

/**
 * The basename of the well-known Tailwind configuration file.
 */
export const tailwindConfigProjectBase = 'tailwind.config.ts';

/**
 * The basename of the well-known @vercel/cli configuration file.
 */
export const vercelConfigProjectBase = 'vercel.json';

/**
 * The basename of the well-known generated types output directory.
 *
 * Never contains special regular expression characters.
 */
export const directoryTypesProjectBase = 'types';

/**
 * The basename of the well-known configuration file containing definitions for
 * additional aliases (respected by the `symbiote project renovate` command).
 */
export const aliasMapConfigProjectBase = 'alias.config.mjs';

/**
 * The basename of the well-known changelog patcher configuration file
 * (respected by the `symbiote build changelog` command).
 */
export const changelogPatchConfigProjectBase = 'changelog.patch.mjs';

/**
 * The basename of the well-known Next.js configuration file.
 */
export const nextjsConfigPackageBase = 'next.config.mjs';

/**
 * The basename of the well-known changelog patcher configuration file
 * (respected by the `symbiote build changelog` command).
 */
export const changelogPatchConfigPackageBase = 'changelog.patch.mjs';

/**
 * The basename of the well-known script run after `npm install` (exactly as
 * typed).
 */
export const postNpmInstallPackageBase = 'post-npm-install.mjs';

/**
 * The basename of the well-known git-add-then-commit CLI tool configuration
 * file.
 */
export const gacConfigPackageBase = 'gac.config.mjs';

/**
 * The basename of the well-known LICENSE file.
 */
export const markdownLicensePackageBase = 'LICENSE';

/**
 * The basename of the well-known README file.
 */
export const markdownReadmePackageBase = 'README.md';

/**
 * The basename of the well-known package.json file.
 */
export const packageJsonConfigPackageBase = 'package.json';

/**
 * The basename of the well-known Dotenv configuration file.
 */
export const dotEnvConfigPackageBase = '.env';

/**
 * The basename of the well-known istanbul/jest code coverage output file.
 */
export const lcovCoverageInfoPackageBase = 'lcov.info';

/**
 * The basename of the well-known "default" Dotenv configuration file.
 */
export const dotEnvDefaultConfigPackageBase = '.env.default';

/**
 * The basename of the well-known directory containing all sub-packages as
 * direct subdirectories.
 *
 * Never contains special regular expression characters.
 */
export const directoryPackagesProjectBase = 'packages';

/**
 * The basename of the well-known distributables output or "dist" directory.
 *
 * Never contains special regular expression characters.
 */
export const directoryDistPackageBase = 'dist';

/**
 * The basename of the well-known intermediate transpilation output directory.
 */
export const directoryIntermediatesPackageBase = '.transpiled';

/**
 * The basename of the well-known test coverage output directory.
 *
 * Never contains special regular expression characters.
 */
export const directoryCoveragePackageBase = 'coverage';

/**
 * The basename of the well-known source directory.
 *
 * Never contains special regular expression characters.
 */
export const directorySrcPackageBase = 'src';

/**
 * The basename of the well-known test directory.
 *
 * Never contains special regular expression characters.
 */
export const directoryTestPackageBase = 'test';

/**
 * The basename of the well-known generated documentation output directory.
 *
 * Never contains special regular expression characters.
 */
export const directoryDocumentationPackageBase = 'docs';

/**
 * The basename of the well-known "shared attribute file". The presence of this
 * file at a workspace sub-root signifies that commits scoped to said package
 * will be included by other packages in the project.
 *
 * By default, commits scoped to individual packages are ignored by other
 * packages.
 */
export const sharedAttributeFileBase = '.shared';

/**
 * All known TypeScript file extensions supported by Babel (except {@link extensionTypescriptDefinition}).
 */
export const extensionsTypescript = ['.ts', '.cts', '.mts', '.tsx'] as const;

/**
 * The known file extension for TypeScript definition files.
 *
 * @see {@link extensionsTypescript}
 */
export const extensionTypescriptDefinition = '.d.ts';

/**
 * All known JavaScript file extensions supported by Babel.
 */
export const extensionsJavascript = [
  // ! .js must be the first extension in this array
  '.js',
  '.mjs',
  '.cjs',
  '.jsx'
] as const;

/**
 * All possible extensions accepted by Babel using standard symbiote configs.
 */
export const extensionsAcceptedByBabel = [
  ...extensionsTypescript,
  ...extensionsJavascript
] as const;
/**
 * Returns `true` if `path` points to a file with an extension accepted by Babel
 * (including `.d.ts`).
 *
 * @see {@link extensionsAcceptedByBabel}
 */
export function hasExtensionAcceptedByBabel(path: string) {
  return extensionsAcceptedByBabel.some((extension) => path.endsWith(extension));
}

/**
 * Returns `true` if `path` points to a file with a TypeScript extension
 * (including `.d.ts`).
 *
 * @see {@link extensionsTypescript}
 */
export function hasTypescriptExtension(path: string) {
  return extensionsTypescript.some((extension) => path.endsWith(extension));
}

/**
 * Returns `true` if `path` points to a file with a JavaScript extension.
 *
 * @see {@link extensionsJavascript}
 */
export function hasJavascriptExtension(path: string) {
  return extensionsTypescript.some((extension) => path.endsWith(extension));
}
