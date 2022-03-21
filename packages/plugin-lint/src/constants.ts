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
 * Files that must exist in non sub-roots (relative paths)
 */
export const repoRootRequiredFiles = [
  '.codecov.yml',
  '.editorconfig',
  '.eslintrc.js',
  '.gitattributes',
  '.gitignore',
  '.prettierignore',
  '.spellcheckignore',
  'babel.config.js',
  'commitlint.config.js',
  'conventional.config.js',
  'jest.config.js',
  'lint-staged.config.js',
  'webpack.config.js',
  'prettier.config.js',
  'CONTRIBUTING.md',
  'SECURITY.md',
  '.github/ISSUE_TEMPLATE/BUG_REPORT.md',
  '.github/ISSUE_TEMPLATE/config.yml',
  '.github/ISSUE_TEMPLATE/FEATURE_REQUEST.md',
  '.github/workflows/README.md',
  '.github/CODE_OF_CONDUCT.md',
  '.github/CODEOWNERS',
  '.github/dependabot.yml',
  '.github/pipeline.config.js',
  '.github/PULL_REQUEST_TEMPLATE.md',
  '.github/SUPPORT.md'
] as const;
/**
 * Directories that must exist in non sub-roots (relative paths)
 */
export const repoRootRequiredDirectories = [
  '.github',
  '.github/ISSUE_TEMPLATE',
  '.github/workflows',
  '.husky',
  'types'
] as const;

/**
 * Allowed experimental versions
 */
export const pkgVersionWhitelist = ['0.0.0-monorepo'] as const;

/**
 * Allowed experimental versions
 */
export const pkgJsonObsoleteEntryKeys = ['main', 'module', 'types'] as const;

/**
 * The parameters used to resolve Markdown urls.
 */
export type StandardUrlParams = {
  user: string;
  repo: string;
  pkgName: string;
  flag?: string;
};

/**
 * The shape of a standard Markdown topmatter specification.
 */
export type StandardTopmatter = {
  [badgeName: string]: {
    label: string;
    alt: string;
    url: (params: StandardUrlParams) => string;
    title: string;
    link: { label: string; url: (params: StandardUrlParams) => string };
  };
};

/**
 * The shape of a standard Markdown link specification.
 */
export type StandardLinks = {
  [linkName: string]: {
    label: string;
    url: (params: StandardUrlParams) => string;
  };
};

export type Condition = 'monorepo' | 'polyrepo' | 'subroot';

/**
 * Standard Markdown topmatter (i.e. badges, surrounding comments, references)
 * for topmatter badges that appear in `README.md`. Note that order matters!
 *
 * Also note that, unlike an actual StandardTopmatter object, this has the
 * special `badge` and `comment` keys under which the appropriate topmatter is
 * described.
 */
export const markdownReadmeStandardTopmatter = {
  comment: {
    start: '<!-- badges-start -->',
    end: '<!-- badges-end -->'
  },
  badge: {
    blm: {
      conditions: ['monorepo', 'polyrepo', 'subroot'] as Condition[],
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
      conditions: ['monorepo', 'polyrepo', 'subroot'] as Condition[],
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
      conditions: ['monorepo', 'polyrepo', 'subroot'] as Condition[],
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
      conditions: ['monorepo', 'polyrepo', 'subroot'] as Condition[],
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
      conditions: ['monorepo', 'polyrepo', 'subroot'] as Condition[],
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
      conditions: ['polyrepo', 'subroot'] as Condition[],
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
      conditions: ['polyrepo', 'subroot'] as Condition[],
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
    npm: {
      conditions: ['polyrepo', 'subroot'] as Condition[],
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
      conditions: ['monorepo', 'polyrepo', 'subroot'] as Condition[],
      label: 'badge-semantic-release',
      alt: 'This repo uses semantic-release!',
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
    label: 'badge-issue-resolution',
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
    label: 'badge-issue-percentage',
    alt: 'Open issues percentage',
    url: ({ user, repo }: StandardUrlParams) =>
      `https://isitmaintained.com/badge/open/${user}/${repo}.svg`,
    title: 'Open issues as a percentage of all issues',
    link: {
      label: 'link-issue-percentage',
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
    label: 'security-mailto',
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
  githubBlog: {
    label: 'github-blog',
    url: (_: StandardUrlParams) =>
      'https://github.com/blog/2119-add-reactions-to-pull-requests-issues-and-comments'
  },
  chooseNewIssue: {
    label: 'choose-new-issue',
    url: ({ user, repo }: StandardUrlParams) =>
      `https://github.com/${user}/${repo}/issues/new/choose`
  }
};

/**
 * Standard Markdown reference links (i.e. links and references) for CONTRIBUTING.md
 */
export const markdownContributingStandardLinks = {
  howToContribute: {
    label: 'how-to-contribute',
    url: (_: StandardUrlParams) => 'https://www.dataschool.io/how-to-contribute-on-github'
  },
  codeOfConduct: {
    label: 'code-of-conduct',
    url: (_: StandardUrlParams) => '/.github/CODE_OF_CONDUCT.md'
  },
  githubActions: {
    label: 'github-actions',
    url: (_: StandardUrlParams) => 'https://github.com/features/actions'
  },
  HuskyCl: {
    label: 'husky-cl',
    url: ({ user, repo }: StandardUrlParams) =>
      `https://github.com/${user}/${repo}/tree/main/.husky`
  },
  ghaCi: {
    label: 'gha-ci',
    url: (_: StandardUrlParams) => '.github/workflows/build-test.yml'
  },
  projector: {
    label: 'projector',
    url: (_: StandardUrlParams) => 'https://github.com/Xunnamius/projector#readme'
  },
  pkgDebug: {
    label: 'pkg-debug',
    url: (_: StandardUrlParams) => 'https://www.npmjs.com/package/debug'
  },
  pkgDebugWildcards: {
    label: 'pkg-debug-wildcards',
    url: (_: StandardUrlParams) => 'https://www.npmjs.com/package/debug#wildcards'
  },
  fork: {
    label: 'fork',
    url: ({ user, repo }: StandardUrlParams) => `https://github.com/${user}/${repo}/fork`
  },
  howToClone: {
    label: 'how-to-clone',
    url: (_: StandardUrlParams) =>
      'https://docs.github.com/en/free-pro-team@latest/github/creating-cloning-and-archiving-repositories/cloning-a-repository'
  },
  npmCi: {
    label: 'npm-ci',
    url: (_: StandardUrlParams) => 'https://docs.npmjs.com/cli/v6/commands/npm-ci'
  },
  prCompare: {
    label: 'pr-compare',
    url: ({ user, repo }: StandardUrlParams) =>
      `https://github.com/${user}/${repo}/compare`
  },
  chooseNewIssue: {
    label: 'choose-new-issue',
    url: ({ user, repo }: StandardUrlParams) =>
      `https://github.com/${user}/${repo}/issues/new/choose`
  },
  openIssues: {
    label: 'open-issues',
    url: ({ user, repo }: StandardUrlParams) =>
      `https://github.com/${user}/${repo}/issues?q=`
  },
  atomicCommits: {
    label: 'atomic-commits',
    url: (_: StandardUrlParams) => 'https://www.codewithjason.com/atomic-commits-testing/'
  },
  codecov: {
    label: 'codecov',
    url: (_: StandardUrlParams) => 'https://about.codecov.io/'
  },
  conventionalCommits: {
    label: 'conventional-commits',
    url: (_: StandardUrlParams) =>
      'https://www.conventionalcommits.org/en/v1.0.0/#summary'
  },
  cosmeticCommits: {
    label: 'cosmetic-commits',
    url: (_: StandardUrlParams) =>
      'https://github.com/rails/rails/pull/13771#issuecomment-32746700'
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
 * Required "exports" field keys.
 */
export const pkgJsonRequiredExports = ['./package', './package.json'] as const;
