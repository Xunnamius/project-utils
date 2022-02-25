import type { PackageJson } from 'type-fest';
import type { WorkspacePackage } from 'pkgverse/core/src/project-utils';

export type Fixture = {
  root: string;
  json: PackageJson | undefined;
  namedPkgMapData: [name: string, workspacePackage: WorkspacePackage][];
  unnamedPkgMapData: [name: string, workspacePackage: WorkspacePackage][];
};

export type FixtureName =
  | 'badMonorepoDuplicateId'
  | 'badMonorepoDuplicateName'
  | 'goodMonorepo'
  | 'goodMonorepoDuplicateId'
  | 'goodMonorepoNegatedPaths'
  | 'goodMonorepoNonPackageDir'
  | 'goodMonorepoSimplePaths'
  | 'goodMonorepoWeirdAbsolute'
  | 'goodMonorepoWeirdBoneless'
  | 'goodMonorepoWeirdOverlap'
  | 'goodMonorepoWeirdYarn'
  | 'goodMonorepoWindows'
  | 'goodPackageJson'
  | 'goodPolyrepo';

export const Fixtures: Record<FixtureName, Fixture> = {
  badMonorepoDuplicateId: {
    root: `${__dirname}/bad-monorepo-duplicate-id`,
    json: undefined,
    namedPkgMapData: [],
    unnamedPkgMapData: []
  },
  badMonorepoDuplicateName: {
    root: `${__dirname}/bad-monorepo-duplicate-name`,
    json: undefined,
    namedPkgMapData: [],
    unnamedPkgMapData: []
  },
  goodMonorepo: {
    root: `${__dirname}/good-monorepo`,
    json: undefined,
    namedPkgMapData: [],
    unnamedPkgMapData: []
  },
  goodMonorepoDuplicateId: {
    root: `${__dirname}/good-monorepo-duplicate-id`,
    json: undefined,
    namedPkgMapData: [],
    unnamedPkgMapData: []
  },
  goodMonorepoNegatedPaths: {
    root: `${__dirname}/good-monorepo-negated-paths`,
    json: undefined,
    namedPkgMapData: [],
    unnamedPkgMapData: []
  },
  goodMonorepoNonPackageDir: {
    root: `${__dirname}/good-monorepo-non-package-dir`,
    json: undefined,
    namedPkgMapData: [],
    unnamedPkgMapData: []
  },
  goodMonorepoSimplePaths: {
    root: `${__dirname}/good-monorepo-simple-paths`,
    json: undefined,
    namedPkgMapData: [],
    unnamedPkgMapData: []
  },
  goodMonorepoWeirdAbsolute: {
    root: `${__dirname}/good-monorepo-weird-absolute`,
    json: undefined,
    namedPkgMapData: [],
    unnamedPkgMapData: []
  },
  goodMonorepoWeirdBoneless: {
    root: `${__dirname}/good-monorepo-weird-boneless`,
    json: undefined,
    namedPkgMapData: [],
    unnamedPkgMapData: []
  },
  goodMonorepoWeirdOverlap: {
    root: `${__dirname}/good-monorepo-weird-overlap`,
    json: undefined,
    namedPkgMapData: [],
    unnamedPkgMapData: []
  },
  goodMonorepoWeirdYarn: {
    root: `${__dirname}/good-monorepo-weird-yarn`,
    json: undefined,
    namedPkgMapData: [],
    unnamedPkgMapData: []
  },
  goodMonorepoWindows: {
    root: `${__dirname}/good-monorepo-windows`,
    json: undefined,
    namedPkgMapData: [],
    unnamedPkgMapData: []
  },
  goodPackageJson: {
    root: `${__dirname}/good-package-json`,
    json: undefined,
    namedPkgMapData: [],
    unnamedPkgMapData: []
  },
  goodPolyrepo: {
    root: `${__dirname}/good-polyrepo`,
    json: undefined,
    namedPkgMapData: [],
    unnamedPkgMapData: []
  }
};

Object.entries(Fixtures).forEach(([, v]) => {
  try {
    v.json = require(`${v.root}/package.json`);
  } catch {}
});

// * goodMonorepo * \\

Fixtures.goodMonorepo.namedPkgMapData = [
  [
    'pkg-1',
    {
      id: 'pkg-1',
      root: `${Fixtures.goodMonorepo.root}/packages/pkg-1`,
      json: require(`${Fixtures.goodMonorepo.root}/packages/pkg-1/package.json`)
    }
  ],
  [
    '@namespaced/pkg',
    {
      id: 'pkg-2',
      root: `${Fixtures.goodMonorepo.root}/packages/pkg-2`,
      json: require(`${Fixtures.goodMonorepo.root}/packages/pkg-2/package.json`)
    }
  ]
];

Fixtures.goodMonorepo.unnamedPkgMapData = [
  [
    'unnamed-pkg-1',
    {
      id: 'unnamed-pkg-1',
      root: `${Fixtures.goodMonorepo.root}/packages/unnamed-pkg-1`,
      json: require(`${Fixtures.goodMonorepo.root}/packages/unnamed-pkg-1/package.json`)
    }
  ],
  [
    'unnamed-pkg-2',
    {
      id: 'unnamed-pkg-2',
      root: `${Fixtures.goodMonorepo.root}/packages/unnamed-pkg-2`,
      json: require(`${Fixtures.goodMonorepo.root}/packages/unnamed-pkg-2/package.json`)
    }
  ]
];

// * goodMonorepoDuplicateId * \\

Fixtures.goodMonorepoDuplicateId.namedPkgMapData = [
  [
    'pkg-1',
    {
      id: 'pkg-1',
      root: `${Fixtures.goodMonorepoDuplicateId.root}/packages-1/pkg-1`,
      json: require(`${Fixtures.goodMonorepoDuplicateId.root}/packages-1/pkg-1/package.json`)
    }
  ],
  [
    'pkg-2',
    {
      id: 'pkg-1',
      root: `${Fixtures.goodMonorepoDuplicateId.root}/packages-2/pkg-1`,
      json: require(`${Fixtures.goodMonorepoDuplicateId.root}/packages-2/pkg-1/package.json`)
    }
  ]
];

// * goodMonorepoNegatedPaths * \\

Fixtures.goodMonorepoNegatedPaths.namedPkgMapData = [
  [
    'pkg-1',
    {
      id: 'pkg-1',
      root: `${Fixtures.goodMonorepoNegatedPaths.root}/packages/pkg-1`,
      json: require(`${Fixtures.goodMonorepoNegatedPaths.root}/packages/pkg-1/package.json`)
    }
  ],
  [
    '@namespace/pkg-3',
    {
      id: 'pkg-3-x',
      root: `${Fixtures.goodMonorepoNegatedPaths.root}/packages/pkg-3-x`,
      json: require(`${Fixtures.goodMonorepoNegatedPaths.root}/packages/pkg-3-x/package.json`)
    }
  ]
];

// * goodMonorepoNonPackageDir * \\

Fixtures.goodMonorepoNonPackageDir.namedPkgMapData = [
  [
    'pkg-1',
    {
      id: 'pkg-1',
      root: `${Fixtures.goodMonorepoNonPackageDir.root}/pkgs/pkg-1`,
      json: require(`${Fixtures.goodMonorepoNonPackageDir.root}/pkgs/pkg-1/package.json`)
    }
  ]
];

// * goodMonorepoSimplePaths * \\

Fixtures.goodMonorepoSimplePaths.namedPkgMapData = [
  [
    'pkg-1',
    {
      id: 'pkg-1',
      root: `${Fixtures.goodMonorepoSimplePaths.root}/pkgs/pkg-1`,
      json: require(`${Fixtures.goodMonorepoSimplePaths.root}/pkgs/pkg-1/package.json`)
    }
  ],
  [
    'pkg-10',
    {
      id: 'pkg-10',
      root: `${Fixtures.goodMonorepoSimplePaths.root}/pkgs/pkg-10`,
      json: require(`${Fixtures.goodMonorepoSimplePaths.root}/pkgs/pkg-10/package.json`)
    }
  ]
];

// * goodMonorepoWeirdAbsolute * \\

Fixtures.goodMonorepoWeirdAbsolute.namedPkgMapData = [
  [
    'pkg-1',
    {
      id: 'pkg-1',
      root: `${Fixtures.goodMonorepoWeirdAbsolute.root}/packages/pkg-1`,
      json: require(`${Fixtures.goodMonorepoWeirdAbsolute.root}/packages/pkg-1/package.json`)
    }
  ],
  [
    'pkg-2',
    {
      id: 'pkg-2',
      root: `${Fixtures.goodMonorepoWeirdAbsolute.root}/packages/pkg-2`,
      json: require(`${Fixtures.goodMonorepoWeirdAbsolute.root}/packages/pkg-2/package.json`)
    }
  ]
];

// * goodMonorepoWeirdBoneless * \\

Fixtures.goodMonorepoWeirdBoneless.namedPkgMapData = [
  [
    'pkg-1',
    {
      id: 'pkg-1',
      root: `${Fixtures.goodMonorepoWeirdBoneless.root}/pkg-1`,
      json: require(`${Fixtures.goodMonorepoWeirdBoneless.root}/pkg-1/package.json`)
    }
  ]
];

// * goodMonorepoWeirdOverlap * \\

Fixtures.goodMonorepoWeirdOverlap.namedPkgMapData = [
  [
    'pkg-1',
    {
      id: 'pkg-1',
      root: `${Fixtures.goodMonorepoWeirdOverlap.root}/pkgs/pkg-1`,
      json: require(`${Fixtures.goodMonorepoWeirdOverlap.root}/pkgs/pkg-1/package.json`)
    }
  ],
  [
    'pkg-2',
    {
      id: 'pkg-20',
      root: `${Fixtures.goodMonorepoWeirdOverlap.root}/pkgs/pkg-20`,
      json: require(`${Fixtures.goodMonorepoWeirdOverlap.root}/pkgs/pkg-20/package.json`)
    }
  ]
];

// * goodMonorepoWeirdYarn * \\

Fixtures.goodMonorepoWeirdYarn.namedPkgMapData = [
  [
    'pkg-1',
    {
      id: 'pkg-1',
      root: `${Fixtures.goodMonorepoWeirdYarn.root}/packages/pkg-1`,
      json: require(`${Fixtures.goodMonorepoWeirdYarn.root}/packages/pkg-1/package.json`)
    }
  ],
  [
    'pkg-2',
    {
      id: 'pkg-2',
      root: `${Fixtures.goodMonorepoWeirdYarn.root}/packages/pkg-2`,
      json: require(`${Fixtures.goodMonorepoWeirdYarn.root}/packages/pkg-2/package.json`)
    }
  ]
];

// * goodMonorepoWindows * \\

Fixtures.goodMonorepoWindows.namedPkgMapData = [
  [
    'pkg-1',
    {
      id: 'pkg',
      root: `${Fixtures.goodMonorepoWindows.root}/packages/deep/pkg`,
      json: require(`${Fixtures.goodMonorepoWindows.root}/packages/deep/pkg/package.json`)
    }
  ],
  [
    'pkg-2',
    {
      id: 'wkg',
      root: `${Fixtures.goodMonorepoWindows.root}/packages/deep/wkg`,
      json: require(`${Fixtures.goodMonorepoWindows.root}/packages/deep/wkg/package.json`)
    }
  ]
];
