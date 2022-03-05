/**
 * Speedup: only consider the last N lines of output
 */
export const numLinesToConsider = 5 as const;

/**
 * Required value of the `license` field in package.json
 */
export const pkgJsonLicense = 'MIT' as const;

/**
 * Files that must exist in all roots and sub-roots (relative paths)
 */
export const requiredFiles = ['LICENSE', 'README.md'] as const;

/**
 * Allowed experimental versions
 */
export const pkgVersionWhitelist = ['0.0.0-monorepo'] as const;

/**
 * Allowed experimental versions
 */
export const pkgJsonObsoleteEntryKeys = ['main', 'module', 'types'] as const;

/**
 * TSConfig files that must exist in polyrepo roots (relative paths)
 */
export const polyrepoTsconfigFiles = [
  'tsconfig.json',
  'tsconfig.docs.json',
  'tsconfig.eslint.json',
  'tsconfig.lint.json',
  'tsconfig.types.json'
] as const;

/**
 * TSConfig files that must exist in monorepo roots (relative paths)
 */
export const monorepoRootTsconfigFiles = [
  'tsconfig.json',
  'tsconfig.lint.json',
  'tsconfig.eslint.json'
] as const;

/**
 * TSConfig files that must exist in sub-roots (relative paths)
 */
export const subRootTsconfigFiles = [
  'tsconfig.docs.json',
  'tsconfig.lint.json',
  'tsconfig.types.json'
] as const;

/**
 * Required fields in all roots and sub-roots
 */
export const globalPkgJsonRequiredFields = [
  'homepage',
  'repository',
  'license',
  'author',
  'engines',
  'type'
] as const;

/**
 * Additionally required fields in monorepo sub-roots and polyrepo roots
 */
export const nonMonoRootPkgJsonRequiredFields = ['description'] as const;

/**
 * Additionally required fields in monorepo sub-roots and polyrepo roots when
 */
/**
 * "private" != `true`
 */
export const publicPkgJsonRequiredFields = [
  'name',
  'version',
  'keywords',
  'sideEffects',
  'exports',
  'typesVersions',
  'files',
  'publishConfig'
] as const;

/**
 * Required "files" field values ("absolute" relative paths)
 */
export const pkgJsonRequiredFiles = [
  '/dist',
  '/LICENSE',
  '/package.json',
  '/README.md'
] as const;

/**
 * Required "exports" field keys
 */
export const pkgJsonRequiredExports = ['./package', './package.json'] as const;
readonly;
