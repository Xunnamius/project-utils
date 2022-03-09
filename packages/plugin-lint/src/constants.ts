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
 * Parameters for configuring standard Markdown urls
 */
export type StandardUrlParams = {
  user: string;
  repo: string;
  pkgName: string;
  flag?: string;
};

/**
 * Standard Markdown topmatter (i.e. badges, surrounding comments, references)
 * for topmatter badges that appear in `README.md`. Note that order matters!
 */
export const markdownReadmeStandardTopmatter = {
  comment: {
    start: '<!-- badges-start -->',
    end: '<!-- badges-end -->'
  },
  badge: {
    blm: {
      label: 'badge-blm',
      alt: 'Black Lives Matter!',
      url: (_: StandardUrlParams) => 'https://xunn.at/badge-blm',
      title: 'Join the movement!',
      link: {
        label: 'link-blm',
        url: (_: StandardUrlParams) => 'https://xunn.at/donate-blm'
      }
    },
    maintenance: {
      label: 'badge-maintenance',
      alt: 'Maintenance status',
      url: (_: StandardUrlParams) =>
        `https://img.shields.io/maintenance/active/${new Date().getFullYear()}`,
      title: 'Is this package maintained?',
      link: {
        label: 'link-maintenance',
        url: ({ user, repo }: StandardUrlParams) => `https://github.com/${user}/${repo}`
      }
    },
    lastCommit: {
      label: 'badge-last-commit',
      alt: 'Last commit timestamp',
      url: ({ user, repo }: StandardUrlParams) =>
        `https://img.shields.io/github/last-commit/${user}/${repo}`,
      title: 'Latest commit timestamp',
      link: {
        label: 'link-last-commit',
        url: ({ user, repo }: StandardUrlParams) => `https://github.com/${user}/${repo}`
      }
    },
    issues: {
      label: 'badge-issues',
      alt: 'Open issues',
      url: ({ user, repo }: StandardUrlParams) =>
        `https://img.shields.io/github/issues/${user}/${repo}`,
      title: 'Open issues',
      link: {
        label: 'link-issues',
        url: ({ user, repo }: StandardUrlParams) =>
          `https://github.com/${user}/${repo}/issues?q=`
      }
    },
    pulls: {
      label: 'badge-pulls',
      alt: 'Pull requests',
      url: ({ user, repo }: StandardUrlParams) =>
        `https://img.shields.io/github/issues-pr/${user}/${repo}`,
      title: 'Open pull requests',
      link: {
        label: 'link-pulls',
        url: ({ user, repo }: StandardUrlParams) =>
          `https://github.com/${user}/${repo}/pulls`
      }
    },
    codecov: {
      label: 'badge-codecov',
      alt: 'Codecov',
      url: ({ user, repo, flag }: StandardUrlParams) =>
        `https://codecov.io/gh/${user}/${repo}/branch/main/graph/badge.svg${
          flag ? `?flag=${flag}` : ''
        }`,
      title: 'Is this package well-tested?',
      link: {
        label: 'link-codecov',
        url: ({ user, repo }: StandardUrlParams) =>
          `https://codecov.io/gh/${user}/${repo}`
      }
    },
    license: {
      label: 'badge-license',
      alt: 'Source license',
      url: ({ pkgName }: StandardUrlParams) => `https://img.shields.io/npm/l/${pkgName}`,
      title: "This package's source license",
      link: {
        label: 'link-license',
        url: ({ user, repo }: StandardUrlParams) =>
          `https://github.com/${user}/${repo}/blob/main/LICENSE`
      }
    },
    treeShaking: {
      label: 'badge-tree-shaking',
      alt: 'Tree shaking support',
      url: (_: StandardUrlParams) => 'https://xunn.at/badge-tree-shaking',
      title: 'Is this package optimized for Webpack?',
      link: {
        label: 'link-tree-shaking',
        url: ({ pkgName }: StandardUrlParams) =>
          `https://npm.anvaka.com/#/view/2d/${pkgName}`
      }
    },
    size: {
      label: 'badge-size',
      alt: 'Compressed package size',
      url: ({ pkgName }: StandardUrlParams) =>
        `https://packagephobia.com/badge?p=${pkgName}`,
      title: 'Is this package optimized for Webpack?',
      link: {
        label: 'link-size',
        url: ({ pkgName }: StandardUrlParams) =>
          `https://packagephobia.com/result?p=${pkgName}`
      }
    },
    npm: {
      label: 'badge-npm',
      alt: 'NPM version',
      url: ({ pkgName }: StandardUrlParams) =>
        `https://xunn.at/npm-pkg-version/${pkgName}`,
      title: 'Install this package using npm or yarn!',
      link: {
        label: 'link-npm',
        url: ({ pkgName }: StandardUrlParams) =>
          `https://www.npmjs.com/package/${pkgName}`
      }
    },
    semanticRelease: {
      label: 'badge-semantic-release',
      alt: 'Uses Semantic Release!',
      url: (_: StandardUrlParams) =>
        'https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg',
      title: 'This repo practices continuous integration and deployment!',
      link: {
        label: 'link-semantic-release',
        url: (_: StandardUrlParams) =>
          'https://github.com/semantic-release/semantic-release'
      }
    }
  }
} as const;

/**
 * Standard Markdown topmatter (i.e. badges, surrounding comments, references)
 * for topmatter badges that appear in `SECURITY.md`. Note that order matters!
 */
export const markdownSecurityStandardTopmatter = {
  vulnerabilities: {
    label: 'badge-vulnerabilities',
    alt: 'Snyk vulnerability check',
    url: ({ user, repo }: StandardUrlParams) =>
      `https://snyk.io/test/github/${user}/${repo}/badge.svg`,
    title: 'Number of vulnerabilities (scanned by Snyk)',
    link: {
      label: 'link-vulnerabilities',
      url: ({ user, repo }: StandardUrlParams) =>
        `https://snyk.io/test/github/${user}/${repo}`
    }
  }
};

/**
 * Standard Markdown topmatter (i.e. badges, surrounding comments, references)
 * for topmatter badges that appear in `SUPPORT.md`. Note that order matters!
 */
export const markdownSupportStandardTopmatter = {
  issuesResolution: {
    label: 'badge-issues-resolution',
    alt: 'Average issue resolution time',
    url: ({ user, repo }: StandardUrlParams) =>
      `https://isitmaintained.com/badge/resolution/${user}/${repo}.svg`,
    title: 'Average time to resolve an issue',
    link: {
      label: 'link-issue-resolution',
      url: ({ user, repo }: StandardUrlParams) =>
        `https://isitmaintained.com/project/${user}/${repo}`
    }
  },
  issuesPercentage: {
    label: 'badge-issues-percentage',
    alt: 'Open issues percentage',
    url: ({ user, repo }: StandardUrlParams) =>
      `https://isitmaintained.com/badge/open/${user}/${repo}.svg`,
    title: 'Open issues as a percentage of all issues',
    link: {
      label: 'link-issues-percentage',
      url: ({ user, repo }: StandardUrlParams) =>
        `https://github.com/${user}/${repo}/issues?q=`
    }
  }
};

/**
 * Standard Markdown reference links (i.e. links and references) for README.md
 */
export const markdownReadmeStandardLinks = {
  docs: { label: 'docs', url: (_: StandardUrlParams) => 'docs' },
  chooseNewIssue: {
    label: 'choose-new-issue',
    url: ({ user, repo }: StandardUrlParams) =>
      `https://github.com/${user}/${repo}/issues/new/choose`
  },
  prCompare: {
    label: 'pr-compare',
    url: ({ user, repo }: StandardUrlParams) =>
      `https://github.com/${user}/${repo}/compare`
  },
  contributing: {
    label: 'contributing',
    url: (_: StandardUrlParams) => 'CONTRIBUTING.md'
  },
  support: { label: 'support', url: (_: StandardUrlParams) => '.github/SUPPORT.md' }
};

/**
 * Standard Markdown reference links (i.e. links and references) for SECURITY.md
 */
export const markdownSecurityStandardLinks = {
  openIssues: {
    label: 'open-issues',
    url: ({ user, repo }: StandardUrlParams) =>
      `https://github.com/${user}/${repo}/issues?q=`
  },
  chooseNewIssue: {
    label: 'choose-new-issue',
    url: ({ user, repo }: StandardUrlParams) =>
      `https://github.com/${user}/${repo}/issues/new/choose`
  },
  securityMailTo: {
    label: 'security-mail-to',
    url: (_: StandardUrlParams) =>
      'mailto:security@ergodark.com?subject=ALERT%3A%20SECURITY%20INCIDENT%3A%20%28five%20word%20summary%29'
  }
};

/**
 * Standard Markdown reference links (i.e. links and references) for SUPPORT.md
 */
export const markdownSupportStandardLinks = {
  openIssues: {
    label: 'open-issues',
    url: ({ user, repo }: StandardUrlParams) =>
      `https://github.com/${user}/${repo}/issues?q=`
  },
  chooseNewIssue: {
    label: 'choose-new-issue',
    url: ({ user, repo }: StandardUrlParams) =>
      `https://github.com/${user}/${repo}/issues/new/choose`
  },
  prCompare: {
    label: 'pr-compare',
    url: ({ user, repo }: StandardUrlParams) =>
      `https://github.com/${user}/${repo}/compare`
  },
  husky: {
    label: 'husky',
    url: ({ user, repo }: StandardUrlParams) =>
      `https://github.com/${user}/${repo}/tree/main/.husky`
  },
  fork: {
    label: 'fork',
    url: ({ user, repo }: StandardUrlParams) => `https://github.com/${user}/${repo}/fork`
  }
};

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
