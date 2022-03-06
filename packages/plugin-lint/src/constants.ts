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
 * Standard Markdown topmatter (i.e. badges, surrounding comments, references)
 */
export const markdownStandardTopmatter = {
  comment: {
    start: '<!-- badges-start -->',
    end: '<!-- badges-end -->'
  },
  badge: {
    blm: {
      label: 'badge-blm',
      alt: 'Black Lives Matter!',
      url: () => 'https://xunn.at/badge-blm',
      title: 'Join the movement!',
      link: {
        label: 'link-blm',
        url: () => 'https://xunn.at/donate-blm'
      }
    },
    maintenance: {
      label: 'badge-maintenance',
      alt: 'Maintenance status',
      url: () => `https://img.shields.io/maintenance/active/${new Date().getFullYear()}`,
      title: 'Is this package maintained?',
      link: {
        label: 'link-maintenance',
        url: (user: string, repo: string) => `https://github.com/${user}/${repo}`
      }
    },
    lastCommit: {
      label: 'badge-last-commit',
      alt: 'Last commit timestamp',
      url: (user: string, repo: string) =>
        `https://img.shields.io/github/last-commit/${user}/${repo}`,
      title: 'Latest commit timestamp',
      link: {
        label: 'link-last-commit',
        url: (user: string, repo: string) => `https://github.com/${user}/${repo}`
      }
    },
    issues: {
      label: 'badge-issues',
      alt: 'Open issues',
      url: (user: string, repo: string) =>
        `https://img.shields.io/github/issues/${user}/${repo}`,
      title: 'Open issues',
      link: {
        label: 'link-issues',
        url: (user: string, repo: string) =>
          `https://github.com/${user}/${repo}/issues?q=`
      }
    },
    pulls: {
      label: 'badge-pulls',
      alt: 'Pull requests',
      url: (user: string, repo: string) =>
        `https://img.shields.io/github/issues-pr/${user}/${repo}`,
      title: 'Open pull requests',
      link: {
        label: 'link-pulls',
        url: (user: string, repo: string) => `https://github.com/${user}/${repo}/pulls`
      }
    },
    codecov: {
      label: 'badge-codecov',
      alt: 'Codecov',
      url: (user: string, repo: string, flag: string) =>
        `https://codecov.io/gh/${user}/${repo}/branch/main/graph/badge.svg${
          flag ? `?flag=${flag}` : ''
        }`,
      title: 'Is this package well-tested?',
      link: {
        label: 'link-codecov',
        url: (user: string, repo: string) => `https://codecov.io/gh/${user}/${repo}`
      }
    },
    license: {
      label: 'badge-license',
      alt: 'Source license',
      url: (pkgName: string) => `https://img.shields.io/npm/l/${pkgName}`,
      title: "This package's source license",
      link: {
        label: 'link-license',
        url: (user: string, repo: string) =>
          `https://github.com/${user}/${repo}/blob/main/LICENSE`
      }
    },
    treeShaking: {
      label: 'badge-tree-shaking',
      alt: 'Tree shaking support',
      url: () => 'https://xunn.at/badge-tree-shaking',
      title: 'Is this package optimized for Webpack?',
      link: {
        label: 'link-tree-shaking',
        url: (pkgName: string) => `https://npm.anvaka.com/#/view/2d/${pkgName}`
      }
    },
    size: {
      label: 'badge-size',
      alt: 'Compressed package size',
      url: (pkgName: string) => `https://packagephobia.com/badge?p=${pkgName}`,
      title: 'Is this package optimized for Webpack?',
      link: {
        label: 'link-size',
        url: (pkgName: string) => `https://packagephobia.com/result?p=${pkgName}`
      }
    },
    npm: {
      label: 'badge-npm',
      alt: 'NPM version',
      url: (pkgName: string) => `https://xunn.at/npm-pkg-version/${pkgName}`,
      title: 'Install this package using npm or yarn!',
      link: {
        label: 'link-npm',
        url: (pkgName: string) => `https://www.npmjs.com/package/${pkgName}`
      }
    },
    semanticRelease: {
      label: 'badge-semantic-release',
      alt: 'Uses Semantic Release!',
      url: () =>
        'https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg',
      title: 'This repo practices continuous integration and deployment!',
      link: {
        label: 'link-semantic-release',
        url: () => 'https://github.com/semantic-release/semantic-release'
      }
    }
  }
} as const;

/**
 * Standard Markdown reference links (i.e. links and references)
 */
export const markdownStandardLinks = {};

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
