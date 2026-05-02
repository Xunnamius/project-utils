// * These tests ensure the exported interface under test functions as expected.

/* eslint-disable unicorn/escape-case */
/* eslint-disable unicorn/no-hex-escape */

import {
  deriveAliasesForBabel,
  deriveAliasesForEslint,
  deriveAliasesForJest,
  deriveAliasesForNextJs,
  deriveAliasesForTypeScript,
  deriveAliasesForWebpack,
  ensureRawSpecifierOk,
  generateRawAliasMap,
  makeRawAliasMapping,
  mapRawSpecifierToPath,
  mapRawSpecifierToRawAliasMapping,
  rawAliasToRegExp,
  WellKnownImportAlias
} from 'universe+graph:alias.ts';

import { GraphErrorMessage } from 'universe+graph:error.ts';

import type { RelativePath } from '@-xun/fs';
import type { ProjectMetadata } from '@-xun/project-types';
import type { RawAlias, RawAliasMapping, RawPath } from 'universe+graph:alias.ts';

const mockProjectRoot = '/path/to/root';

const mockImportOrderPolyrepoMappings = [
  [
    {
      alias: 'rootverse',
      prefix: 'exact',
      suffix: 'open',
      group: WellKnownImportAlias.Rootverse,
      packageId: undefined
    },
    { path: '' as RelativePath, prefix: 'root', suffix: 'open', extensionless: true }
  ],
  [
    {
      alias: 'universe',
      prefix: 'exact',
      suffix: 'open',
      group: WellKnownImportAlias.Universe,
      packageId: undefined
    },
    { path: 'src' as RelativePath, prefix: 'root', suffix: 'open', extensionless: true }
  ],
  [
    {
      alias: 'universe',
      prefix: 'exact',
      suffix: 'exact',
      group: WellKnownImportAlias.Universe,
      packageId: undefined
    },
    {
      path: 'src/index' as RelativePath,
      prefix: 'root',
      suffix: 'none',
      extensionless: false
    }
  ],
  [
    {
      alias: 'testverse',
      prefix: 'exact',
      suffix: 'open',
      group: WellKnownImportAlias.Testverse,
      packageId: undefined
    },
    { path: 'test' as RelativePath, prefix: 'root', suffix: 'open', extensionless: true }
  ],
  [
    {
      alias: 'typeverse',
      prefix: 'exact',
      suffix: 'open',
      group: WellKnownImportAlias.Typeverse,
      packageId: undefined
    },
    {
      path: 'types' as RelativePath,
      prefix: 'root',
      suffix: 'open',
      extensionless: true
    }
  ]
] satisfies [Omit<RawAlias, 'regExp'>, RawPath][] as RawAliasMapping[];

const mockImportOrderHybridrepoMappings = [
  [
    {
      alias: 'multiverse+pkg-1',
      prefix: 'exact',
      suffix: 'open',
      group: WellKnownImportAlias.Multiverse,
      packageId: 'pkg-1'
    },
    {
      path: 'path/to/packages/pkg-1/src' as RelativePath,
      prefix: 'root',
      suffix: 'open',
      extensionless: true
    }
  ],
  [
    {
      alias: 'multiverse+pkg-2',
      prefix: 'exact',
      suffix: 'open',
      group: WellKnownImportAlias.Multiverse,
      packageId: 'pkg-2'
    },
    {
      path: 'path/to/packages/pkg-2/src' as RelativePath,
      prefix: 'root',
      suffix: 'open',
      extensionless: true
    }
  ],
  [
    {
      alias: 'multiverse+pkg-10',
      prefix: 'exact',
      suffix: 'open',
      group: WellKnownImportAlias.Multiverse,
      packageId: 'pkg-10'
    },
    {
      path: 'path/to/packages/pkg-10/src' as RelativePath,
      prefix: 'root',
      suffix: 'open',
      extensionless: true
    }
  ],
  [
    {
      alias: 'multiverse+pkg-1',
      prefix: 'exact',
      suffix: 'exact',
      group: WellKnownImportAlias.Multiverse,
      packageId: 'pkg-1'
    },
    {
      path: 'path/to/packages/pkg-1/src/index' as RelativePath,
      prefix: 'root',
      suffix: 'none',
      extensionless: false
    }
  ],
  [
    {
      alias: 'multiverse+pkg-2',
      prefix: 'exact',
      suffix: 'exact',
      group: WellKnownImportAlias.Multiverse,
      packageId: 'pkg-2'
    },
    {
      path: 'path/to/packages/pkg-2/src/index' as RelativePath,
      prefix: 'root',
      suffix: 'none',
      extensionless: false
    }
  ],
  [
    {
      alias: 'multiverse+pkg-10',
      prefix: 'exact',
      suffix: 'exact',
      group: WellKnownImportAlias.Multiverse,
      packageId: 'pkg-10'
    },
    {
      path: 'path/to/packages/pkg-10/src/index' as RelativePath,
      prefix: 'root',
      suffix: 'none',
      extensionless: false
    }
  ],
  [
    {
      alias: 'rootverse+pkg-1',
      prefix: 'exact',
      suffix: 'open',
      group: WellKnownImportAlias.Rootverse,
      packageId: 'pkg-1'
    },
    {
      path: 'path/to/packages/pkg-1' as RelativePath,
      prefix: 'root',
      suffix: 'open',
      extensionless: true
    }
  ],
  [
    {
      alias: 'rootverse+pkg-2',
      prefix: 'exact',
      suffix: 'open',
      group: WellKnownImportAlias.Rootverse,
      packageId: 'pkg-2'
    },
    {
      path: 'path/to/packages/pkg-2' as RelativePath,
      prefix: 'root',
      suffix: 'open',
      extensionless: true
    }
  ],
  [
    {
      alias: 'rootverse+pkg-10',
      prefix: 'exact',
      suffix: 'open',
      group: WellKnownImportAlias.Rootverse,
      packageId: 'pkg-10'
    },
    {
      path: 'path/to/packages/pkg-10' as RelativePath,
      prefix: 'root',
      suffix: 'open',
      extensionless: true
    }
  ],
  [
    {
      alias: 'rootverse',
      prefix: 'exact',
      suffix: 'open',
      group: WellKnownImportAlias.Rootverse,
      packageId: undefined
    },
    { path: '' as RelativePath, prefix: 'root', suffix: 'open', extensionless: true }
  ],
  [
    {
      alias: 'universe+pkg-1',
      prefix: 'exact',
      suffix: 'open',
      group: WellKnownImportAlias.Universe,
      packageId: 'pkg-1'
    },
    {
      path: 'path/to/packages/pkg-1/src' as RelativePath,
      prefix: 'root',
      suffix: 'open',
      extensionless: true
    }
  ],
  [
    {
      alias: 'universe+pkg-2',
      prefix: 'exact',
      suffix: 'open',
      group: WellKnownImportAlias.Universe,
      packageId: 'pkg-2'
    },
    {
      path: 'path/to/packages/pkg-2/src' as RelativePath,
      prefix: 'root',
      suffix: 'open',
      extensionless: true
    }
  ],
  [
    {
      alias: 'universe+pkg-10',
      prefix: 'exact',
      suffix: 'open',
      group: WellKnownImportAlias.Universe,
      packageId: 'pkg-10'
    },
    {
      path: 'path/to/packages/pkg-10/src' as RelativePath,
      prefix: 'root',
      suffix: 'open',
      extensionless: true
    }
  ],
  [
    {
      alias: 'universe+pkg-1',
      prefix: 'exact',
      suffix: 'exact',
      group: WellKnownImportAlias.Universe,
      packageId: 'pkg-1'
    },
    {
      path: 'path/to/packages/pkg-1/src/index' as RelativePath,
      prefix: 'root',
      suffix: 'none',
      extensionless: false
    }
  ],
  [
    {
      alias: 'universe+pkg-2',
      prefix: 'exact',
      suffix: 'exact',
      group: WellKnownImportAlias.Universe,
      packageId: 'pkg-2'
    },
    {
      path: 'path/to/packages/pkg-2/src/index' as RelativePath,
      prefix: 'root',
      suffix: 'none',
      extensionless: false
    }
  ],
  [
    {
      alias: 'universe+pkg-10',
      prefix: 'exact',
      suffix: 'exact',
      group: WellKnownImportAlias.Universe,
      packageId: 'pkg-10'
    },
    {
      path: 'path/to/packages/pkg-10/src/index' as RelativePath,
      prefix: 'root',
      suffix: 'none',
      extensionless: false
    }
  ],
  [
    {
      alias: 'universe',
      prefix: 'exact',
      suffix: 'open',
      group: WellKnownImportAlias.Universe,
      packageId: undefined
    },
    { path: 'src' as RelativePath, prefix: 'root', suffix: 'open', extensionless: true }
  ],
  [
    {
      alias: 'universe',
      prefix: 'exact',
      suffix: 'exact',
      group: WellKnownImportAlias.Universe,
      packageId: undefined
    },
    {
      path: 'src/index' as RelativePath,
      prefix: 'root',
      suffix: 'none',
      extensionless: false
    }
  ],
  [
    {
      alias: 'testverse+pkg-1',
      prefix: 'exact',
      suffix: 'open',
      group: WellKnownImportAlias.Testverse,
      packageId: 'pkg-1'
    },
    {
      path: 'path/to/packages/pkg-1/test' as RelativePath,
      prefix: 'root',
      suffix: 'open',
      extensionless: true
    }
  ],
  [
    {
      alias: 'testverse+pkg-2',
      prefix: 'exact',
      suffix: 'open',
      group: WellKnownImportAlias.Testverse,
      packageId: 'pkg-2'
    },
    {
      path: 'path/to/packages/pkg-2/test' as RelativePath,
      prefix: 'root',
      suffix: 'open',
      extensionless: true
    }
  ],
  [
    {
      alias: 'testverse+pkg-10',
      prefix: 'exact',
      suffix: 'open',
      group: WellKnownImportAlias.Testverse,
      packageId: 'pkg-10'
    },
    {
      path: 'path/to/packages/pkg-10/test' as RelativePath,
      prefix: 'root',
      suffix: 'open',
      extensionless: true
    }
  ],
  [
    {
      alias: 'testverse',
      prefix: 'exact',
      suffix: 'open',
      group: WellKnownImportAlias.Testverse,
      packageId: undefined
    },
    { path: 'test' as RelativePath, prefix: 'root', suffix: 'open', extensionless: true }
  ],
  [
    {
      alias: 'typeverse',
      prefix: 'exact',
      suffix: 'open',
      group: WellKnownImportAlias.Typeverse,
      packageId: undefined
    },
    {
      path: 'types' as RelativePath,
      prefix: 'root',
      suffix: 'open',
      extensionless: true
    }
  ]
] satisfies [Omit<RawAlias, 'regExp'>, RawPath][] as RawAliasMapping[];

const mockConfigOrderPolyrepoMappings = [
  [
    {
      alias: 'universe',
      prefix: 'exact',
      suffix: 'open',
      group: WellKnownImportAlias.Universe,
      packageId: undefined
    },
    { path: 'src' as RelativePath, prefix: 'root', suffix: 'open', extensionless: true }
  ],
  [
    {
      alias: 'universe',
      prefix: 'exact',
      suffix: 'exact',
      group: WellKnownImportAlias.Universe,
      packageId: undefined
    },
    {
      path: 'src/index' as RelativePath,
      prefix: 'root',
      suffix: 'none',
      extensionless: false
    }
  ],
  [
    {
      alias: 'testverse',
      prefix: 'exact',
      suffix: 'open',
      group: WellKnownImportAlias.Testverse,
      packageId: undefined
    },
    { path: 'test' as RelativePath, prefix: 'root', suffix: 'open', extensionless: true }
  ],
  [
    {
      alias: 'typeverse',
      prefix: 'exact',
      suffix: 'open',
      group: WellKnownImportAlias.Typeverse,
      packageId: undefined
    },
    {
      path: 'types' as RelativePath,
      prefix: 'root',
      suffix: 'open',
      extensionless: true
    }
  ],
  [
    {
      alias: 'rootverse',
      prefix: 'exact',
      suffix: 'open',
      group: WellKnownImportAlias.Rootverse,
      packageId: undefined
    },
    { path: '' as RelativePath, prefix: 'root', suffix: 'open', extensionless: true }
  ]
] satisfies [Omit<RawAlias, 'regExp'>, RawPath][] as RawAliasMapping[];

const mockConfigOrderHybridrepoMappings = [
  [
    {
      alias: 'multiverse+pkg-1',
      prefix: 'exact',
      suffix: 'open',
      group: WellKnownImportAlias.Multiverse,
      packageId: 'pkg-1'
    },
    {
      path: 'path/to/packages/pkg-1/src' as RelativePath,
      prefix: 'root',
      suffix: 'open',
      extensionless: true
    }
  ],
  [
    {
      alias: 'multiverse+pkg-2',
      prefix: 'exact',
      suffix: 'open',
      group: WellKnownImportAlias.Multiverse,
      packageId: 'pkg-2'
    },
    {
      path: 'path/to/packages/pkg-2/src' as RelativePath,
      prefix: 'root',
      suffix: 'open',
      extensionless: true
    }
  ],
  [
    {
      alias: 'multiverse+pkg-10',
      prefix: 'exact',
      suffix: 'open',
      group: WellKnownImportAlias.Multiverse,
      packageId: 'pkg-10'
    },
    {
      path: 'path/to/packages/pkg-10/src' as RelativePath,
      prefix: 'root',
      suffix: 'open',
      extensionless: true
    }
  ],
  [
    {
      alias: 'multiverse+pkg-1',
      prefix: 'exact',
      suffix: 'exact',
      group: WellKnownImportAlias.Multiverse,
      packageId: 'pkg-1'
    },
    {
      path: 'path/to/packages/pkg-1/src/index' as RelativePath,
      prefix: 'root',
      suffix: 'none',
      extensionless: false
    }
  ],
  [
    {
      alias: 'multiverse+pkg-2',
      prefix: 'exact',
      suffix: 'exact',
      group: WellKnownImportAlias.Multiverse,
      packageId: 'pkg-2'
    },
    {
      path: 'path/to/packages/pkg-2/src/index' as RelativePath,
      prefix: 'root',
      suffix: 'none',
      extensionless: false
    }
  ],
  [
    {
      alias: 'multiverse+pkg-10',
      prefix: 'exact',
      suffix: 'exact',
      group: WellKnownImportAlias.Multiverse,
      packageId: 'pkg-10'
    },
    {
      path: 'path/to/packages/pkg-10/src/index' as RelativePath,
      prefix: 'root',
      suffix: 'none',
      extensionless: false
    }
  ],
  [
    {
      alias: 'universe+pkg-1',
      prefix: 'exact',
      suffix: 'open',
      group: WellKnownImportAlias.Universe,
      packageId: 'pkg-1'
    },
    {
      path: 'path/to/packages/pkg-1/src' as RelativePath,
      prefix: 'root',
      suffix: 'open',
      extensionless: true
    }
  ],
  [
    {
      alias: 'universe+pkg-2',
      prefix: 'exact',
      suffix: 'open',
      group: WellKnownImportAlias.Universe,
      packageId: 'pkg-2'
    },
    {
      path: 'path/to/packages/pkg-2/src' as RelativePath,
      prefix: 'root',
      suffix: 'open',
      extensionless: true
    }
  ],
  [
    {
      alias: 'universe+pkg-10',
      prefix: 'exact',
      suffix: 'open',
      group: WellKnownImportAlias.Universe,
      packageId: 'pkg-10'
    },
    {
      path: 'path/to/packages/pkg-10/src' as RelativePath,
      prefix: 'root',
      suffix: 'open',
      extensionless: true
    }
  ],
  [
    {
      alias: 'universe+pkg-1',
      prefix: 'exact',
      suffix: 'exact',
      group: WellKnownImportAlias.Universe,
      packageId: 'pkg-1'
    },
    {
      path: 'path/to/packages/pkg-1/src/index' as RelativePath,
      prefix: 'root',
      suffix: 'none',
      extensionless: false
    }
  ],
  [
    {
      alias: 'universe+pkg-2',
      prefix: 'exact',
      suffix: 'exact',
      group: WellKnownImportAlias.Universe,
      packageId: 'pkg-2'
    },
    {
      path: 'path/to/packages/pkg-2/src/index' as RelativePath,
      prefix: 'root',
      suffix: 'none',
      extensionless: false
    }
  ],
  [
    {
      alias: 'universe+pkg-10',
      prefix: 'exact',
      suffix: 'exact',
      group: WellKnownImportAlias.Universe,
      packageId: 'pkg-10'
    },
    {
      path: 'path/to/packages/pkg-10/src/index' as RelativePath,
      prefix: 'root',
      suffix: 'none',
      extensionless: false
    }
  ],
  [
    {
      alias: 'universe',
      prefix: 'exact',
      suffix: 'open',
      group: WellKnownImportAlias.Universe,
      packageId: undefined
    },
    { path: 'src' as RelativePath, prefix: 'root', suffix: 'open', extensionless: true }
  ],
  [
    {
      alias: 'universe',
      prefix: 'exact',
      suffix: 'exact',
      group: WellKnownImportAlias.Universe,
      packageId: undefined
    },
    {
      path: 'src/index' as RelativePath,
      prefix: 'root',
      suffix: 'none',
      extensionless: false
    }
  ],
  [
    {
      alias: 'testverse+pkg-1',
      prefix: 'exact',
      suffix: 'open',
      group: WellKnownImportAlias.Testverse,
      packageId: 'pkg-1'
    },
    {
      path: 'path/to/packages/pkg-1/test' as RelativePath,
      prefix: 'root',
      suffix: 'open',
      extensionless: true
    }
  ],
  [
    {
      alias: 'testverse+pkg-2',
      prefix: 'exact',
      suffix: 'open',
      group: WellKnownImportAlias.Testverse,
      packageId: 'pkg-2'
    },
    {
      path: 'path/to/packages/pkg-2/test' as RelativePath,
      prefix: 'root',
      suffix: 'open',
      extensionless: true
    }
  ],
  [
    {
      alias: 'testverse+pkg-10',
      prefix: 'exact',
      suffix: 'open',
      group: WellKnownImportAlias.Testverse,
      packageId: 'pkg-10'
    },
    {
      path: 'path/to/packages/pkg-10/test' as RelativePath,
      prefix: 'root',
      suffix: 'open',
      extensionless: true
    }
  ],
  [
    {
      alias: 'testverse',
      prefix: 'exact',
      suffix: 'open',
      group: WellKnownImportAlias.Testverse,
      packageId: undefined
    },
    { path: 'test' as RelativePath, prefix: 'root', suffix: 'open', extensionless: true }
  ],
  [
    {
      alias: 'typeverse',
      prefix: 'exact',
      suffix: 'open',
      group: WellKnownImportAlias.Typeverse,
      packageId: undefined
    },
    {
      path: 'types' as RelativePath,
      prefix: 'root',
      suffix: 'open',
      extensionless: true
    }
  ],
  [
    {
      alias: 'rootverse+pkg-1',
      prefix: 'exact',
      suffix: 'open',
      group: WellKnownImportAlias.Rootverse,
      packageId: 'pkg-1'
    },
    {
      path: 'path/to/packages/pkg-1' as RelativePath,
      prefix: 'root',
      suffix: 'open',
      extensionless: true
    }
  ],
  [
    {
      alias: 'rootverse+pkg-2',
      prefix: 'exact',
      suffix: 'open',
      group: WellKnownImportAlias.Rootverse,
      packageId: 'pkg-2'
    },
    {
      path: 'path/to/packages/pkg-2' as RelativePath,
      prefix: 'root',
      suffix: 'open',
      extensionless: true
    }
  ],
  [
    {
      alias: 'rootverse+pkg-10',
      prefix: 'exact',
      suffix: 'open',
      group: WellKnownImportAlias.Rootverse,
      packageId: 'pkg-10'
    },
    {
      path: 'path/to/packages/pkg-10' as RelativePath,
      prefix: 'root',
      suffix: 'open',
      extensionless: true
    }
  ],
  [
    {
      alias: 'rootverse',
      prefix: 'exact',
      suffix: 'open',
      group: WellKnownImportAlias.Rootverse,
      packageId: undefined
    },
    { path: '' as RelativePath, prefix: 'root', suffix: 'open', extensionless: true }
  ]
] satisfies [Omit<RawAlias, 'regExp'>, RawPath][] as RawAliasMapping[];

const mockHintOrderPolyrepoMappings = [
  [
    {
      alias: 'universe',
      prefix: 'exact',
      suffix: 'exact',
      group: WellKnownImportAlias.Universe,
      packageId: undefined
    },
    {
      path: 'src/index' as RelativePath,
      prefix: 'root',
      suffix: 'none',
      extensionless: false
    }
  ],
  [
    {
      alias: 'universe',
      prefix: 'exact',
      suffix: 'open',
      group: WellKnownImportAlias.Universe,
      packageId: undefined
    },
    { path: 'src' as RelativePath, prefix: 'root', suffix: 'open', extensionless: true }
  ],
  [
    {
      alias: 'testverse',
      prefix: 'exact',
      suffix: 'open',
      group: WellKnownImportAlias.Testverse,
      packageId: undefined
    },
    { path: 'test' as RelativePath, prefix: 'root', suffix: 'open', extensionless: true }
  ],
  [
    {
      alias: 'typeverse',
      prefix: 'exact',
      suffix: 'open',
      group: WellKnownImportAlias.Typeverse,
      packageId: undefined
    },
    {
      path: 'types' as RelativePath,
      prefix: 'root',
      suffix: 'open',
      extensionless: true
    }
  ],
  [
    {
      alias: 'rootverse',
      prefix: 'exact',
      suffix: 'open',
      group: WellKnownImportAlias.Rootverse,
      packageId: undefined
    },
    { path: '' as RelativePath, prefix: 'root', suffix: 'open', extensionless: true }
  ]
] satisfies [Omit<RawAlias, 'regExp'>, RawPath][] as RawAliasMapping[];

const mockHintOrderHybridrepoMappings = [
  [
    {
      alias: 'universe',
      prefix: 'exact',
      suffix: 'exact',
      group: WellKnownImportAlias.Universe,
      packageId: undefined
    },
    {
      path: 'src/index' as RelativePath,
      prefix: 'root',
      suffix: 'none',
      extensionless: false
    }
  ],
  [
    {
      alias: 'universe',
      prefix: 'exact',
      suffix: 'open',
      group: WellKnownImportAlias.Universe,
      packageId: undefined
    },
    { path: 'src' as RelativePath, prefix: 'root', suffix: 'open', extensionless: true }
  ],
  [
    {
      alias: 'universe+pkg-1',
      prefix: 'exact',
      suffix: 'exact',
      group: WellKnownImportAlias.Universe,
      packageId: 'pkg-1'
    },
    {
      path: 'path/to/packages/pkg-1/src/index' as RelativePath,
      prefix: 'root',
      suffix: 'none',
      extensionless: false
    }
  ],
  [
    {
      alias: 'universe+pkg-2',
      prefix: 'exact',
      suffix: 'exact',
      group: WellKnownImportAlias.Universe,
      packageId: 'pkg-2'
    },
    {
      path: 'path/to/packages/pkg-2/src/index' as RelativePath,
      prefix: 'root',
      suffix: 'none',
      extensionless: false
    }
  ],
  [
    {
      alias: 'universe+pkg-10',
      prefix: 'exact',
      suffix: 'exact',
      group: WellKnownImportAlias.Universe,
      packageId: 'pkg-10'
    },
    {
      path: 'path/to/packages/pkg-10/src/index' as RelativePath,
      prefix: 'root',
      suffix: 'none',
      extensionless: false
    }
  ],
  [
    {
      alias: 'universe+pkg-1',
      prefix: 'exact',
      suffix: 'open',
      group: WellKnownImportAlias.Universe,
      packageId: 'pkg-1'
    },
    {
      path: 'path/to/packages/pkg-1/src' as RelativePath,
      prefix: 'root',
      suffix: 'open',
      extensionless: true
    }
  ],
  [
    {
      alias: 'universe+pkg-2',
      prefix: 'exact',
      suffix: 'open',
      group: WellKnownImportAlias.Universe,
      packageId: 'pkg-2'
    },
    {
      path: 'path/to/packages/pkg-2/src' as RelativePath,
      prefix: 'root',
      suffix: 'open',
      extensionless: true
    }
  ],
  [
    {
      alias: 'universe+pkg-10',
      prefix: 'exact',
      suffix: 'open',
      group: WellKnownImportAlias.Universe,
      packageId: 'pkg-10'
    },
    {
      path: 'path/to/packages/pkg-10/src' as RelativePath,
      prefix: 'root',
      suffix: 'open',
      extensionless: true
    }
  ],
  [
    {
      alias: 'multiverse+pkg-1',
      prefix: 'exact',
      suffix: 'exact',
      group: WellKnownImportAlias.Multiverse,
      packageId: 'pkg-1'
    },
    {
      path: 'path/to/packages/pkg-1/src/index' as RelativePath,
      prefix: 'root',
      suffix: 'none',
      extensionless: false
    }
  ],
  [
    {
      alias: 'multiverse+pkg-2',
      prefix: 'exact',
      suffix: 'exact',
      group: WellKnownImportAlias.Multiverse,
      packageId: 'pkg-2'
    },
    {
      path: 'path/to/packages/pkg-2/src/index' as RelativePath,
      prefix: 'root',
      suffix: 'none',
      extensionless: false
    }
  ],
  [
    {
      alias: 'multiverse+pkg-10',
      prefix: 'exact',
      suffix: 'exact',
      group: WellKnownImportAlias.Multiverse,
      packageId: 'pkg-10'
    },
    {
      path: 'path/to/packages/pkg-10/src/index' as RelativePath,
      prefix: 'root',
      suffix: 'none',
      extensionless: false
    }
  ],
  [
    {
      alias: 'multiverse+pkg-1',
      prefix: 'exact',
      suffix: 'open',
      group: WellKnownImportAlias.Multiverse,
      packageId: 'pkg-1'
    },
    {
      path: 'path/to/packages/pkg-1/src' as RelativePath,
      prefix: 'root',
      suffix: 'open',
      extensionless: true
    }
  ],
  [
    {
      alias: 'multiverse+pkg-2',
      prefix: 'exact',
      suffix: 'open',
      group: WellKnownImportAlias.Multiverse,
      packageId: 'pkg-2'
    },
    {
      path: 'path/to/packages/pkg-2/src' as RelativePath,
      prefix: 'root',
      suffix: 'open',
      extensionless: true
    }
  ],
  [
    {
      alias: 'multiverse+pkg-10',
      prefix: 'exact',
      suffix: 'open',
      group: WellKnownImportAlias.Multiverse,
      packageId: 'pkg-10'
    },
    {
      path: 'path/to/packages/pkg-10/src' as RelativePath,
      prefix: 'root',
      suffix: 'open',
      extensionless: true
    }
  ],
  [
    {
      alias: 'testverse',
      prefix: 'exact',
      suffix: 'open',
      group: WellKnownImportAlias.Testverse,
      packageId: undefined
    },
    { path: 'test' as RelativePath, prefix: 'root', suffix: 'open', extensionless: true }
  ],
  [
    {
      alias: 'testverse+pkg-1',
      prefix: 'exact',
      suffix: 'open',
      group: WellKnownImportAlias.Testverse,
      packageId: 'pkg-1'
    },
    {
      path: 'path/to/packages/pkg-1/test' as RelativePath,
      prefix: 'root',
      suffix: 'open',
      extensionless: true
    }
  ],
  [
    {
      alias: 'testverse+pkg-2',
      prefix: 'exact',
      suffix: 'open',
      group: WellKnownImportAlias.Testverse,
      packageId: 'pkg-2'
    },
    {
      path: 'path/to/packages/pkg-2/test' as RelativePath,
      prefix: 'root',
      suffix: 'open',
      extensionless: true
    }
  ],
  [
    {
      alias: 'testverse+pkg-10',
      prefix: 'exact',
      suffix: 'open',
      group: WellKnownImportAlias.Testverse,
      packageId: 'pkg-10'
    },
    {
      path: 'path/to/packages/pkg-10/test' as RelativePath,
      prefix: 'root',
      suffix: 'open',
      extensionless: true
    }
  ],
  [
    {
      alias: 'typeverse',
      prefix: 'exact',
      suffix: 'open',
      group: WellKnownImportAlias.Typeverse,
      packageId: undefined
    },
    {
      path: 'types' as RelativePath,
      prefix: 'root',
      suffix: 'open',
      extensionless: true
    }
  ],
  [
    {
      alias: 'rootverse+pkg-1',
      prefix: 'exact',
      suffix: 'open',
      group: WellKnownImportAlias.Rootverse,
      packageId: 'pkg-1'
    },
    {
      path: 'path/to/packages/pkg-1' as RelativePath,
      prefix: 'root',
      suffix: 'open',
      extensionless: true
    }
  ],
  [
    {
      alias: 'rootverse+pkg-2',
      prefix: 'exact',
      suffix: 'open',
      group: WellKnownImportAlias.Rootverse,
      packageId: 'pkg-2'
    },
    {
      path: 'path/to/packages/pkg-2' as RelativePath,
      prefix: 'root',
      suffix: 'open',
      extensionless: true
    }
  ],
  [
    {
      alias: 'rootverse+pkg-10',
      prefix: 'exact',
      suffix: 'open',
      group: WellKnownImportAlias.Rootverse,
      packageId: 'pkg-10'
    },
    {
      path: 'path/to/packages/pkg-10' as RelativePath,
      prefix: 'root',
      suffix: 'open',
      extensionless: true
    }
  ],
  [
    {
      alias: 'rootverse',
      prefix: 'exact',
      suffix: 'open',
      group: WellKnownImportAlias.Rootverse,
      packageId: undefined
    },
    { path: '' as RelativePath, prefix: 'root', suffix: 'open', extensionless: true }
  ]
] satisfies [Omit<RawAlias, 'regExp'>, RawPath][] as RawAliasMapping[];

beforeAll(() => {
  [
    mockImportOrderPolyrepoMappings,
    mockImportOrderHybridrepoMappings,
    mockConfigOrderPolyrepoMappings,
    mockConfigOrderHybridrepoMappings,
    mockHintOrderPolyrepoMappings,
    mockHintOrderHybridrepoMappings
  ]
    .flat()
    .forEach(([rawAlias]) => {
      rawAlias.regExp = rawAliasToRegExp(rawAlias);
    });
});

describe('::makeRawAliasMapping', () => {
  it('constructs aliases as expected from minimal args', async () => {
    expect.hasAssertions();

    expect(
      makeRawAliasMapping(
        { alias: 'alias-1', group: WellKnownImportAlias.Universe, packageId: undefined },
        { path: 'the/path/for/alias-1' as RelativePath }
      )
    ).toStrictEqual([
      {
        alias: 'alias-1',
        prefix: 'exact',
        suffix: 'open',
        group: WellKnownImportAlias.Universe,
        regExp: /^alias\x2d1:(.+)$/,
        packageId: undefined
      },
      {
        path: 'the/path/for/alias-1' as RelativePath,
        prefix: 'root',
        suffix: 'open',
        extensionless: true
      }
    ]);
  });

  it('constructs aliases as expected from given args', async () => {
    expect.hasAssertions();

    expect(
      makeRawAliasMapping(
        {
          alias: 'alias-1',
          prefix: 'none',
          suffix: 'none',
          group: WellKnownImportAlias.Multiverse,
          packageId: undefined
        },
        {
          path: 'the/path/for/alias-1' as RelativePath,
          suffix: 'none',
          extensionless: false
        }
      )
    ).toStrictEqual([
      {
        alias: 'alias-1',
        prefix: 'none',
        suffix: 'none',
        group: WellKnownImportAlias.Multiverse,
        regExp: /alias\x2d1/,
        packageId: undefined
      },
      {
        path: 'the/path/for/alias-1' as RelativePath,
        prefix: 'root',
        suffix: 'none',
        extensionless: false
      }
    ]);
  });

  it('does not throw if alias suffix is "open" and path suffix is not "open"', async () => {
    expect.hasAssertions();

    expect(
      makeRawAliasMapping(
        {
          alias: 'alias-1',
          suffix: 'open',
          group: WellKnownImportAlias.Testverse,
          packageId: undefined
        },
        { path: 'the/path/for/alias-1' as RelativePath, suffix: 'none' }
      )
    ).toStrictEqual([
      {
        alias: 'alias-1',
        prefix: 'exact',
        suffix: 'open',
        group: WellKnownImportAlias.Testverse,
        regExp: /^alias\x2d1:(.+)$/,
        packageId: undefined
      },
      {
        path: 'the/path/for/alias-1' as RelativePath,
        prefix: 'root',
        suffix: 'none',
        extensionless: true
      }
    ]);
  });

  it('throws if path suffix is "open" and alias suffix is not "open"', async () => {
    expect.hasAssertions();

    expect(() =>
      makeRawAliasMapping(
        {
          alias: 'alias-1',
          suffix: 'none',
          group: WellKnownImportAlias.Typeverse,
          packageId: undefined
        },
        { path: 'the/path/for/alias-1' as RelativePath, suffix: 'open' }
      )
    ).toThrow(GraphErrorMessage.IllegalAliasBadSuffix('alias-1'));
  });

  it('throws if alias contains path separator characters', async () => {
    expect.hasAssertions();

    expect(() =>
      makeRawAliasMapping(
        {
          alias: 'bad/alias',
          group: WellKnownImportAlias.Rootverse,
          packageId: undefined
        },
        { path: 'the/path/for/alias-1' as RelativePath }
      )
    ).toThrow(
      GraphErrorMessage.IllegalAliasKeyInvalidCharacters('bad/alias', '').split(':')[0]
    );

    expect(() =>
      makeRawAliasMapping(
        {
          alias: String.raw`bad\alias`,
          group: WellKnownImportAlias.Rootverse,
          packageId: undefined
        },
        { path: 'the/path/for/alias-1' as RelativePath }
      )
    ).toThrow(
      GraphErrorMessage.IllegalAliasKeyInvalidCharacters(
        String.raw`bad\alias`,
        ''
      ).split(':')[0]
    );

    expect(() =>
      makeRawAliasMapping(
        {
          alias: 'bad-alias/',
          group: WellKnownImportAlias.Rootverse,
          packageId: undefined
        },
        { path: 'the/path/for/alias-1' as RelativePath }
      )
    ).toThrow(
      GraphErrorMessage.IllegalAliasKeyInvalidCharacters('bad-alias/', '').split(':')[0]
    );
  });

  it('throws if alias contains the "$" character', async () => {
    expect.hasAssertions();

    expect(() =>
      makeRawAliasMapping(
        {
          alias: '$alias-1',
          group: WellKnownImportAlias.Rootverse,
          packageId: undefined
        },
        { path: 'the/path/for/alias-1' as RelativePath }
      )
    ).toThrow(
      GraphErrorMessage.IllegalAliasKeyInvalidCharacters('$alias-1', '').split(':')[0]
    );
  });

  it('throws if path contains the ":" character', async () => {
    expect.hasAssertions();

    expect(() =>
      makeRawAliasMapping(
        {
          alias: 'alias-1',
          group: WellKnownImportAlias.Rootverse,
          packageId: undefined
        },
        { path: 'the/path:for/alias-1' as RelativePath }
      )
    ).toThrow(
      GraphErrorMessage.IllegalAliasValueInvalidCharacters(
        'alias-1',
        'the/path:for/alias-1',
        ''
      ).split(':')[0]
    );
  });

  it('throws if path start or end with the "/" character', async () => {
    expect.hasAssertions();

    expect(() =>
      makeRawAliasMapping(
        {
          alias: 'alias-1',
          group: WellKnownImportAlias.Rootverse,
          packageId: undefined
        },
        { path: '/the/path/for/alias-1' as RelativePath }
      )
    ).toThrow(
      GraphErrorMessage.IllegalAliasValueInvalidSeparatorAdfix(
        'alias-1',
        '/the/path/for/alias-1'
      ).split(':')[0]
    );

    expect(() =>
      makeRawAliasMapping(
        {
          alias: 'alias-1',
          group: WellKnownImportAlias.Rootverse,
          packageId: undefined
        },
        { path: 'the/path/for/alias-1/' as RelativePath }
      )
    ).toThrow(
      GraphErrorMessage.IllegalAliasValueInvalidSeparatorAdfix(
        'alias-1',
        'the/path/for/alias-1/'
      ).split(':')[0]
    );
  });

  it('throws if path is explicitly relative (not resembling a bare specifier)', async () => {
    expect.hasAssertions();

    expect(() =>
      makeRawAliasMapping(
        { alias: 'alias-1', group: WellKnownImportAlias.Universe, packageId: undefined },
        { path: './the/path/for/alias-1' as RelativePath }
      )
    ).toThrow(
      GraphErrorMessage.IllegalAliasValueInvalidSeparatorAdfix(
        'alias-1',
        './the/path/for/alias-1'
      ).split(':')[0]
    );

    expect(() =>
      makeRawAliasMapping(
        { alias: 'alias-1', group: WellKnownImportAlias.Universe, packageId: undefined },
        { path: '../the/path/for/alias-1' as RelativePath }
      )
    ).toThrow(
      GraphErrorMessage.IllegalAliasValueInvalidSeparatorAdfix(
        'alias-1',
        '../the/path/for/alias-1'
      ).split(':')[0]
    );

    expect(() =>
      makeRawAliasMapping(
        { alias: 'alias-1', group: WellKnownImportAlias.Universe, packageId: undefined },
        { path: '.' as RelativePath }
      )
    ).toThrow(
      GraphErrorMessage.IllegalAliasValueInvalidSeparatorAdfix('alias-1', '.').split(
        ':'
      )[0]
    );

    expect(() =>
      makeRawAliasMapping(
        { alias: 'alias-1', group: WellKnownImportAlias.Universe, packageId: undefined },
        { path: '..' as RelativePath }
      )
    ).toThrow(
      GraphErrorMessage.IllegalAliasValueInvalidSeparatorAdfix('alias-1', '..').split(
        ':'
      )[0]
    );
  });
});

describe('::generateRawAliasMap', () => {
  it('translates polyrepo metadata into a raw alias map', async () => {
    expect.hasAssertions();

    expect(
      generateRawAliasMap({
        rootPackage: { root: mockProjectRoot },
        subRootPackages: undefined
      } as ProjectMetadata)
    ).toStrictEqual(mockConfigOrderPolyrepoMappings);
  });

  it('translates monorepo metadata into a raw alias map ordered by reverse semi-specificity', async () => {
    expect.hasAssertions();

    expect(
      generateRawAliasMap({
        rootPackage: { root: mockProjectRoot },
        subRootPackages: {
          all: [
            {
              id: 'pkg-1',
              json: {},
              root: '/path/to/root/path/to/packages/pkg-1',
              relativeRoot: 'path/to/packages/pkg-1'
            },
            {
              id: 'pkg-2',
              json: {},
              root: '/path/to/root/path/to/packages/pkg-2',
              relativeRoot: 'path/to/packages/pkg-2'
            },
            {
              id: 'pkg-10',
              json: {},
              root: '/path/to/root/path/to/packages/pkg-10',
              relativeRoot: 'path/to/packages/pkg-10'
            }
          ]
        }
      } as ProjectMetadata)
    ).toStrictEqual(mockConfigOrderHybridrepoMappings);
  });

  it('translates polyrepo metadata into for-import-ordering raw alias map', async () => {
    expect.hasAssertions();

    expect(
      generateRawAliasMap(
        {
          rootPackage: { root: mockProjectRoot },
          subRootPackages: undefined
        } as ProjectMetadata,
        'for-import-ordering'
      )
    ).toStrictEqual(mockImportOrderPolyrepoMappings);
  });

  it('translates monorepo metadata into for-import-ordering raw alias map ordered by reverse semi-specificity', async () => {
    expect.hasAssertions();

    expect(
      generateRawAliasMap(
        {
          rootPackage: { root: mockProjectRoot },
          subRootPackages: {
            all: [
              {
                id: 'pkg-1',
                json: {},
                root: '/path/to/root/path/to/packages/pkg-1',
                relativeRoot: 'path/to/packages/pkg-1'
              },
              {
                id: 'pkg-2',
                json: {},
                root: '/path/to/root/path/to/packages/pkg-2',
                relativeRoot: 'path/to/packages/pkg-2'
              },
              {
                id: 'pkg-10',
                json: {},
                root: '/path/to/root/path/to/packages/pkg-10',
                relativeRoot: 'path/to/packages/pkg-10'
              }
            ]
          }
        } as ProjectMetadata,
        'for-import-ordering'
      )
    ).toStrictEqual(mockImportOrderHybridrepoMappings);
  });

  it('translates polyrepo metadata into for-import-hinting raw alias map', async () => {
    expect.hasAssertions();

    expect(
      generateRawAliasMap(
        {
          rootPackage: { root: mockProjectRoot },
          subRootPackages: undefined
        } as ProjectMetadata,
        'for-import-hinting'
      )
    ).toStrictEqual(mockHintOrderPolyrepoMappings);
  });

  it('translates monorepo metadata into for-import-hinting raw alias map ordered by reverse semi-specificity', async () => {
    expect.hasAssertions();

    expect(
      generateRawAliasMap(
        {
          rootPackage: { root: mockProjectRoot },
          subRootPackages: {
            all: [
              {
                id: 'pkg-1',
                json: {},
                root: '/path/to/root/path/to/packages/pkg-1',
                relativeRoot: 'path/to/packages/pkg-1'
              },
              {
                id: 'pkg-2',
                json: {},
                root: '/path/to/root/path/to/packages/pkg-2',
                relativeRoot: 'path/to/packages/pkg-2'
              },
              {
                id: 'pkg-10',
                json: {},
                root: '/path/to/root/path/to/packages/pkg-10',
                relativeRoot: 'path/to/packages/pkg-10'
              }
            ]
          }
        } as ProjectMetadata,
        'for-import-hinting'
      )
    ).toStrictEqual(mockHintOrderHybridrepoMappings);
  });

  it('natural-sorts monorepo metadata by package-id', async () => {
    expect.hasAssertions();

    expect(
      generateRawAliasMap({
        rootPackage: { root: mockProjectRoot },
        subRootPackages: {
          all: [
            {
              id: 'a',
              json: {},
              root: '/path/to/root/packages/a',
              relativeRoot: 'packages/a'
            },
            {
              id: 'aa',
              json: {},
              root: '/path/to/root/packages/aa',
              relativeRoot: 'packages/aa'
            },
            {
              id: 'a2',
              json: {},
              root: '/path/to/root/packages/a2',
              relativeRoot: 'packages/a2'
            },
            {
              id: 'b2',
              json: {},
              root: '/path/to/root/packages/b2',
              relativeRoot: 'packages/b2'
            },
            {
              id: 'a1',
              json: {},
              root: '/path/to/root/packages/a1',
              relativeRoot: 'packages/a1'
            }
          ]
        }
      } as ProjectMetadata)
    ).toStrictEqual([
      [
        {
          alias: 'multiverse+a',
          prefix: 'exact',
          suffix: 'open',
          group: WellKnownImportAlias.Multiverse,
          regExp: /^multiverse\+a:(.+)$/,
          packageId: 'a'
        },
        { path: 'packages/a/src', prefix: 'root', suffix: 'open', extensionless: true }
      ],
      [
        {
          alias: 'multiverse+a1',
          prefix: 'exact',
          suffix: 'open',
          group: WellKnownImportAlias.Multiverse,
          regExp: /^multiverse\+a1:(.+)$/,
          packageId: 'a1'
        },
        { path: 'packages/a1/src', prefix: 'root', suffix: 'open', extensionless: true }
      ],
      [
        {
          alias: 'multiverse+a2',
          prefix: 'exact',
          suffix: 'open',
          group: WellKnownImportAlias.Multiverse,
          regExp: /^multiverse\+a2:(.+)$/,
          packageId: 'a2'
        },
        { path: 'packages/a2/src', prefix: 'root', suffix: 'open', extensionless: true }
      ],
      [
        {
          alias: 'multiverse+aa',
          prefix: 'exact',
          suffix: 'open',
          group: WellKnownImportAlias.Multiverse,
          regExp: /^multiverse\+aa:(.+)$/,
          packageId: 'aa'
        },
        { path: 'packages/aa/src', prefix: 'root', suffix: 'open', extensionless: true }
      ],
      [
        {
          alias: 'multiverse+b2',
          prefix: 'exact',
          suffix: 'open',
          group: WellKnownImportAlias.Multiverse,
          regExp: /^multiverse\+b2:(.+)$/,
          packageId: 'b2'
        },
        { path: 'packages/b2/src', prefix: 'root', suffix: 'open', extensionless: true }
      ],
      [
        {
          alias: 'multiverse+a',
          prefix: 'exact',
          suffix: 'exact',
          group: WellKnownImportAlias.Multiverse,
          regExp: /^multiverse\+a$/,
          packageId: 'a'
        },
        {
          path: 'packages/a/src/index',
          prefix: 'root',
          suffix: 'none',
          extensionless: false
        }
      ],
      [
        {
          alias: 'multiverse+a1',
          prefix: 'exact',
          suffix: 'exact',
          group: WellKnownImportAlias.Multiverse,
          regExp: /^multiverse\+a1$/,
          packageId: 'a1'
        },
        {
          path: 'packages/a1/src/index',
          prefix: 'root',
          suffix: 'none',
          extensionless: false
        }
      ],
      [
        {
          alias: 'multiverse+a2',
          prefix: 'exact',
          suffix: 'exact',
          group: WellKnownImportAlias.Multiverse,
          regExp: /^multiverse\+a2$/,
          packageId: 'a2'
        },
        {
          path: 'packages/a2/src/index',
          prefix: 'root',
          suffix: 'none',
          extensionless: false
        }
      ],
      [
        {
          alias: 'multiverse+aa',
          prefix: 'exact',
          suffix: 'exact',
          group: WellKnownImportAlias.Multiverse,
          regExp: /^multiverse\+aa$/,
          packageId: 'aa'
        },
        {
          path: 'packages/aa/src/index',
          prefix: 'root',
          suffix: 'none',
          extensionless: false
        }
      ],
      [
        {
          alias: 'multiverse+b2',
          prefix: 'exact',
          suffix: 'exact',
          group: WellKnownImportAlias.Multiverse,
          regExp: /^multiverse\+b2$/,
          packageId: 'b2'
        },
        {
          path: 'packages/b2/src/index',
          prefix: 'root',
          suffix: 'none',
          extensionless: false
        }
      ],
      [
        {
          alias: 'universe+a',
          prefix: 'exact',
          suffix: 'open',
          group: WellKnownImportAlias.Universe,
          regExp: /^universe\+a:(.+)$/,
          packageId: 'a'
        },
        { path: 'packages/a/src', prefix: 'root', suffix: 'open', extensionless: true }
      ],
      [
        {
          alias: 'universe+a1',
          prefix: 'exact',
          suffix: 'open',
          group: WellKnownImportAlias.Universe,
          regExp: /^universe\+a1:(.+)$/,
          packageId: 'a1'
        },
        { path: 'packages/a1/src', prefix: 'root', suffix: 'open', extensionless: true }
      ],
      [
        {
          alias: 'universe+a2',
          prefix: 'exact',
          suffix: 'open',
          group: WellKnownImportAlias.Universe,
          regExp: /^universe\+a2:(.+)$/,
          packageId: 'a2'
        },
        { path: 'packages/a2/src', prefix: 'root', suffix: 'open', extensionless: true }
      ],
      [
        {
          alias: 'universe+aa',
          prefix: 'exact',
          suffix: 'open',
          group: WellKnownImportAlias.Universe,
          regExp: /^universe\+aa:(.+)$/,
          packageId: 'aa'
        },
        { path: 'packages/aa/src', prefix: 'root', suffix: 'open', extensionless: true }
      ],
      [
        {
          alias: 'universe+b2',
          prefix: 'exact',
          suffix: 'open',
          group: WellKnownImportAlias.Universe,
          regExp: /^universe\+b2:(.+)$/,
          packageId: 'b2'
        },
        { path: 'packages/b2/src', prefix: 'root', suffix: 'open', extensionless: true }
      ],
      [
        {
          alias: 'universe+a',
          prefix: 'exact',
          suffix: 'exact',
          group: WellKnownImportAlias.Universe,
          regExp: /^universe\+a$/,
          packageId: 'a'
        },
        {
          path: 'packages/a/src/index',
          prefix: 'root',
          suffix: 'none',
          extensionless: false
        }
      ],
      [
        {
          alias: 'universe+a1',
          prefix: 'exact',
          suffix: 'exact',
          group: WellKnownImportAlias.Universe,
          regExp: /^universe\+a1$/,
          packageId: 'a1'
        },
        {
          path: 'packages/a1/src/index',
          prefix: 'root',
          suffix: 'none',
          extensionless: false
        }
      ],
      [
        {
          alias: 'universe+a2',
          prefix: 'exact',
          suffix: 'exact',
          group: WellKnownImportAlias.Universe,
          regExp: /^universe\+a2$/,
          packageId: 'a2'
        },
        {
          path: 'packages/a2/src/index',
          prefix: 'root',
          suffix: 'none',
          extensionless: false
        }
      ],
      [
        {
          alias: 'universe+aa',
          prefix: 'exact',
          suffix: 'exact',
          group: WellKnownImportAlias.Universe,
          regExp: /^universe\+aa$/,
          packageId: 'aa'
        },
        {
          path: 'packages/aa/src/index',
          prefix: 'root',
          suffix: 'none',
          extensionless: false
        }
      ],
      [
        {
          alias: 'universe+b2',
          prefix: 'exact',
          suffix: 'exact',
          group: WellKnownImportAlias.Universe,
          regExp: /^universe\+b2$/,
          packageId: 'b2'
        },
        {
          path: 'packages/b2/src/index',
          prefix: 'root',
          suffix: 'none',
          extensionless: false
        }
      ],
      [
        {
          alias: 'universe',
          prefix: 'exact',
          suffix: 'open',
          group: WellKnownImportAlias.Universe,
          regExp: /^universe:(.+)$/,
          packageId: undefined
        },
        { path: 'src', prefix: 'root', suffix: 'open', extensionless: true }
      ],
      [
        {
          alias: 'universe',
          prefix: 'exact',
          suffix: 'exact',
          group: WellKnownImportAlias.Universe,
          regExp: /^universe$/,
          packageId: undefined
        },
        { path: 'src/index', prefix: 'root', suffix: 'none', extensionless: false }
      ],
      [
        {
          alias: 'testverse+a',
          prefix: 'exact',
          suffix: 'open',
          group: WellKnownImportAlias.Testverse,
          regExp: /^testverse\+a:(.+)$/,
          packageId: 'a'
        },
        { path: 'packages/a/test', prefix: 'root', suffix: 'open', extensionless: true }
      ],
      [
        {
          alias: 'testverse+a1',
          prefix: 'exact',
          suffix: 'open',
          group: WellKnownImportAlias.Testverse,
          regExp: /^testverse\+a1:(.+)$/,
          packageId: 'a1'
        },
        { path: 'packages/a1/test', prefix: 'root', suffix: 'open', extensionless: true }
      ],
      [
        {
          alias: 'testverse+a2',
          prefix: 'exact',
          suffix: 'open',
          group: WellKnownImportAlias.Testverse,
          regExp: /^testverse\+a2:(.+)$/,
          packageId: 'a2'
        },
        { path: 'packages/a2/test', prefix: 'root', suffix: 'open', extensionless: true }
      ],
      [
        {
          alias: 'testverse+aa',
          prefix: 'exact',
          suffix: 'open',
          group: WellKnownImportAlias.Testverse,
          regExp: /^testverse\+aa:(.+)$/,
          packageId: 'aa'
        },
        { path: 'packages/aa/test', prefix: 'root', suffix: 'open', extensionless: true }
      ],
      [
        {
          alias: 'testverse+b2',
          prefix: 'exact',
          suffix: 'open',
          group: WellKnownImportAlias.Testverse,
          regExp: /^testverse\+b2:(.+)$/,
          packageId: 'b2'
        },
        { path: 'packages/b2/test', prefix: 'root', suffix: 'open', extensionless: true }
      ],
      [
        {
          alias: 'testverse',
          prefix: 'exact',
          suffix: 'open',
          group: WellKnownImportAlias.Testverse,
          regExp: /^testverse:(.+)$/,
          packageId: undefined
        },
        { path: 'test', prefix: 'root', suffix: 'open', extensionless: true }
      ],
      [
        {
          alias: 'typeverse',
          prefix: 'exact',
          suffix: 'open',
          group: WellKnownImportAlias.Typeverse,
          regExp: /^typeverse:(.+)$/,
          packageId: undefined
        },
        { path: 'types', prefix: 'root', suffix: 'open', extensionless: true }
      ],
      [
        {
          alias: 'rootverse+a',
          prefix: 'exact',
          suffix: 'open',
          group: WellKnownImportAlias.Rootverse,
          regExp: /^rootverse\+a:(.+)$/,
          packageId: 'a'
        },
        { path: 'packages/a', prefix: 'root', suffix: 'open', extensionless: true }
      ],
      [
        {
          alias: 'rootverse+a1',
          prefix: 'exact',
          suffix: 'open',
          group: WellKnownImportAlias.Rootverse,
          regExp: /^rootverse\+a1:(.+)$/,
          packageId: 'a1'
        },
        { path: 'packages/a1', prefix: 'root', suffix: 'open', extensionless: true }
      ],
      [
        {
          alias: 'rootverse+a2',
          prefix: 'exact',
          suffix: 'open',
          group: WellKnownImportAlias.Rootverse,
          regExp: /^rootverse\+a2:(.+)$/,
          packageId: 'a2'
        },
        { path: 'packages/a2', prefix: 'root', suffix: 'open', extensionless: true }
      ],
      [
        {
          alias: 'rootverse+aa',
          prefix: 'exact',
          suffix: 'open',
          group: WellKnownImportAlias.Rootverse,
          regExp: /^rootverse\+aa:(.+)$/,
          packageId: 'aa'
        },
        { path: 'packages/aa', prefix: 'root', suffix: 'open', extensionless: true }
      ],
      [
        {
          alias: 'rootverse+b2',
          prefix: 'exact',
          suffix: 'open',
          group: WellKnownImportAlias.Rootverse,
          regExp: /^rootverse\+b2:(.+)$/,
          packageId: 'b2'
        },
        { path: 'packages/b2', prefix: 'root', suffix: 'open', extensionless: true }
      ],
      [
        {
          alias: 'rootverse',
          prefix: 'exact',
          suffix: 'open',
          group: WellKnownImportAlias.Rootverse,
          regExp: /^rootverse:(.+)$/,
          packageId: undefined
        },
        { path: '', prefix: 'root', suffix: 'open', extensionless: true }
      ]
    ]);
  });
});

describe('::deriveAliasesForBabel', () => {
  it('returns expected aliases in the expected order', async () => {
    expect.hasAssertions();

    const expected = {
      '^multiverse\\+pkg\\x2d1:(.+)$': './path/to/packages/pkg-1/src/$1',
      '^multiverse\\+pkg\\x2d2:(.+)$': './path/to/packages/pkg-2/src/$1',
      '^multiverse\\+pkg\\x2d10:(.+)$': './path/to/packages/pkg-10/src/$1',
      '^multiverse\\+pkg\\x2d1$': './path/to/packages/pkg-1/src/index.js',
      '^multiverse\\+pkg\\x2d2$': './path/to/packages/pkg-2/src/index.js',
      '^multiverse\\+pkg\\x2d10$': './path/to/packages/pkg-10/src/index.js',
      '^universe\\+pkg\\x2d1:(.+)$': './path/to/packages/pkg-1/src/$1',
      '^universe\\+pkg\\x2d2:(.+)$': './path/to/packages/pkg-2/src/$1',
      '^universe\\+pkg\\x2d10:(.+)$': './path/to/packages/pkg-10/src/$1',
      '^universe\\+pkg\\x2d1$': './path/to/packages/pkg-1/src/index.js',
      '^universe\\+pkg\\x2d2$': './path/to/packages/pkg-2/src/index.js',
      '^universe\\+pkg\\x2d10$': './path/to/packages/pkg-10/src/index.js',
      '^universe:(.+)$': './src/$1',
      '^universe$': './src/index.js',
      '^testverse\\+pkg\\x2d1:(.+)$': './path/to/packages/pkg-1/test/$1',
      '^testverse\\+pkg\\x2d2:(.+)$': './path/to/packages/pkg-2/test/$1',
      '^testverse\\+pkg\\x2d10:(.+)$': './path/to/packages/pkg-10/test/$1',
      '^testverse:(.+)$': './test/$1',
      '^typeverse:(.+)$': './types/$1',
      '^rootverse\\+pkg\\x2d1:(.+)$': './path/to/packages/pkg-1/$1',
      '^rootverse\\+pkg\\x2d2:(.+)$': './path/to/packages/pkg-2/$1',
      '^rootverse\\+pkg\\x2d10:(.+)$': './path/to/packages/pkg-10/$1',
      '^rootverse:(.+)$': './$1'
    };

    const actual = deriveAliasesForBabel(mockConfigOrderHybridrepoMappings);

    expect(actual).toStrictEqual(expected);
    expect(Object.keys(actual)).toStrictEqual(Object.keys(expected));
  });
});

describe('::deriveAliasesForEslint', () => {
  it('returns expected aliases in expected order', async () => {
    expect.hasAssertions();

    expect(deriveAliasesForEslint(mockImportOrderHybridrepoMappings)).toStrictEqual([
      ['multiverse+pkg-1:*', './path/to/packages/pkg-1/src/*'],
      ['multiverse+pkg-2:*', './path/to/packages/pkg-2/src/*'],
      ['multiverse+pkg-10:*', './path/to/packages/pkg-10/src/*'],
      ['multiverse+pkg-1', './path/to/packages/pkg-1/src/index.ts'],
      ['multiverse+pkg-2', './path/to/packages/pkg-2/src/index.ts'],
      ['multiverse+pkg-10', './path/to/packages/pkg-10/src/index.ts'],
      // ! Unlike for-config, for-import-ordering should place these here
      ['rootverse+pkg-1:*', './path/to/packages/pkg-1/*'],
      ['rootverse+pkg-2:*', './path/to/packages/pkg-2/*'],
      ['rootverse+pkg-10:*', './path/to/packages/pkg-10/*'],
      // ! It's important aliases like this come AFTER more specific versions
      ['rootverse:*', './*'],
      ['universe+pkg-1:*', './path/to/packages/pkg-1/src/*'],
      ['universe+pkg-2:*', './path/to/packages/pkg-2/src/*'],
      ['universe+pkg-10:*', './path/to/packages/pkg-10/src/*'],
      ['universe+pkg-1', './path/to/packages/pkg-1/src/index.ts'],
      ['universe+pkg-2', './path/to/packages/pkg-2/src/index.ts'],
      ['universe+pkg-10', './path/to/packages/pkg-10/src/index.ts'],
      ['universe:*', './src/*'],
      // ! It's important aliases like this come AFTER the open-ended version
      ['universe', './src/index.ts'],
      ['testverse+pkg-1:*', './path/to/packages/pkg-1/test/*'],
      ['testverse+pkg-2:*', './path/to/packages/pkg-2/test/*'],
      ['testverse+pkg-10:*', './path/to/packages/pkg-10/test/*'],
      // ! It's important aliases like this come AFTER more specific versions
      ['testverse:*', './test/*'],
      ['typeverse:*', './types/*']
    ]);
  });
});

describe('::deriveAliasesForWebpack', () => {
  it('returns expected aliases in the expected order', async () => {
    expect.hasAssertions();

    const expected = {
      'multiverse+pkg-1:*': 'path/to/packages/pkg-1/src/*',
      'multiverse+pkg-2:*': 'path/to/packages/pkg-2/src/*',
      'multiverse+pkg-10:*': 'path/to/packages/pkg-10/src/*',
      'multiverse+pkg-1$': 'path/to/packages/pkg-1/src/index.ts',
      'multiverse+pkg-2$': 'path/to/packages/pkg-2/src/index.ts',
      'multiverse+pkg-10$': 'path/to/packages/pkg-10/src/index.ts',
      'universe+pkg-1:*': 'path/to/packages/pkg-1/src/*',
      'universe+pkg-2:*': 'path/to/packages/pkg-2/src/*',
      'universe+pkg-10:*': 'path/to/packages/pkg-10/src/*',
      'universe+pkg-1$': 'path/to/packages/pkg-1/src/index.ts',
      'universe+pkg-2$': 'path/to/packages/pkg-2/src/index.ts',
      'universe+pkg-10$': 'path/to/packages/pkg-10/src/index.ts',
      'universe:*': `src/*`,
      universe$: `src/index.ts`,
      'testverse+pkg-1:*': 'path/to/packages/pkg-1/test/*',
      'testverse+pkg-2:*': 'path/to/packages/pkg-2/test/*',
      'testverse+pkg-10:*': 'path/to/packages/pkg-10/test/*',
      'testverse:*': `test/*`,
      'typeverse:*': `types/*`,
      // ! Unlike for-import-ordering, for-config should place these here
      'rootverse+pkg-1:*': 'path/to/packages/pkg-1/*',
      'rootverse+pkg-2:*': 'path/to/packages/pkg-2/*',
      'rootverse+pkg-10:*': 'path/to/packages/pkg-10/*',
      'rootverse:*': `*`
    };

    const actual = deriveAliasesForWebpack(mockConfigOrderHybridrepoMappings);

    expect(actual).toStrictEqual(expected);
    expect(Object.keys(actual)).toStrictEqual(Object.keys(expected));
  });
});

describe('::deriveAliasesForNextJs', () => {
  it('returns expected aliases in the expected order', async () => {
    expect.hasAssertions();

    const expected = {
      'multiverse+pkg-1:*': 'path/to/packages/pkg-1/src/*',
      'multiverse+pkg-2:*': 'path/to/packages/pkg-2/src/*',
      'multiverse+pkg-10:*': 'path/to/packages/pkg-10/src/*',
      'multiverse+pkg-1$': 'path/to/packages/pkg-1/src/index.ts',
      'multiverse+pkg-2$': 'path/to/packages/pkg-2/src/index.ts',
      'multiverse+pkg-10$': 'path/to/packages/pkg-10/src/index.ts',
      'universe+pkg-1:*': 'path/to/packages/pkg-1/src/*',
      'universe+pkg-2:*': 'path/to/packages/pkg-2/src/*',
      'universe+pkg-10:*': 'path/to/packages/pkg-10/src/*',
      'universe+pkg-1$': 'path/to/packages/pkg-1/src/index.ts',
      'universe+pkg-2$': 'path/to/packages/pkg-2/src/index.ts',
      'universe+pkg-10$': 'path/to/packages/pkg-10/src/index.ts',
      'universe:*': `src/*`,
      universe$: `src/index.ts`,
      'testverse+pkg-1:*': 'path/to/packages/pkg-1/test/*',
      'testverse+pkg-2:*': 'path/to/packages/pkg-2/test/*',
      'testverse+pkg-10:*': 'path/to/packages/pkg-10/test/*',
      'testverse:*': `test/*`,
      'typeverse:*': `types/*`,
      // ! Unlike for-import-ordering, for-config should place these here
      'rootverse+pkg-1:*': 'path/to/packages/pkg-1/*',
      'rootverse+pkg-2:*': 'path/to/packages/pkg-2/*',
      'rootverse+pkg-10:*': 'path/to/packages/pkg-10/*',
      'rootverse:*': '*'
    };

    const actual = deriveAliasesForNextJs(mockConfigOrderHybridrepoMappings);

    expect(actual).toStrictEqual(expected);
    expect(Object.keys(actual)).toStrictEqual(Object.keys(expected));
  });
});

describe('::deriveAliasesForJest', () => {
  it('returns expected aliases in the expected order', async () => {
    expect.hasAssertions();

    const expected = {
      '^multiverse\\+pkg\\x2d1:(.+)$': '<rootDir>/path/to/packages/pkg-1/src/$1',
      '^multiverse\\+pkg\\x2d2:(.+)$': '<rootDir>/path/to/packages/pkg-2/src/$1',
      '^multiverse\\+pkg\\x2d10:(.+)$': '<rootDir>/path/to/packages/pkg-10/src/$1',
      '^multiverse\\+pkg\\x2d1$': '<rootDir>/path/to/packages/pkg-1/src/index.ts',
      '^multiverse\\+pkg\\x2d2$': '<rootDir>/path/to/packages/pkg-2/src/index.ts',
      '^multiverse\\+pkg\\x2d10$': '<rootDir>/path/to/packages/pkg-10/src/index.ts',
      '^universe\\+pkg\\x2d1:(.+)$': '<rootDir>/path/to/packages/pkg-1/src/$1',
      '^universe\\+pkg\\x2d2:(.+)$': '<rootDir>/path/to/packages/pkg-2/src/$1',
      '^universe\\+pkg\\x2d10:(.+)$': '<rootDir>/path/to/packages/pkg-10/src/$1',
      '^universe\\+pkg\\x2d1$': '<rootDir>/path/to/packages/pkg-1/src/index.ts',
      '^universe\\+pkg\\x2d2$': '<rootDir>/path/to/packages/pkg-2/src/index.ts',
      '^universe\\+pkg\\x2d10$': '<rootDir>/path/to/packages/pkg-10/src/index.ts',
      '^universe:(.+)$': '<rootDir>/src/$1',
      '^universe$': '<rootDir>/src/index.ts',
      '^testverse\\+pkg\\x2d1:(.+)$': '<rootDir>/path/to/packages/pkg-1/test/$1',
      '^testverse\\+pkg\\x2d2:(.+)$': '<rootDir>/path/to/packages/pkg-2/test/$1',
      '^testverse\\+pkg\\x2d10:(.+)$': '<rootDir>/path/to/packages/pkg-10/test/$1',
      '^testverse:(.+)$': '<rootDir>/test/$1',
      '^typeverse:(.+)$': '<rootDir>/types/$1',
      // ! Unlike for-import-ordering, for-config should place these here
      '^rootverse\\+pkg\\x2d1:(.+)$': '<rootDir>/path/to/packages/pkg-1/$1',
      '^rootverse\\+pkg\\x2d2:(.+)$': '<rootDir>/path/to/packages/pkg-2/$1',
      '^rootverse\\+pkg\\x2d10:(.+)$': '<rootDir>/path/to/packages/pkg-10/$1',
      '^rootverse:(.+)$': '<rootDir>/$1'
    };

    const actual = deriveAliasesForJest(mockConfigOrderHybridrepoMappings);

    expect(actual).toStrictEqual(expected);
    expect(Object.keys(actual)).toStrictEqual(Object.keys(expected));
  });
});

describe('::deriveAliasesForTypeScript', () => {
  it('returns expected aliases in the expected order', async () => {
    expect.hasAssertions();

    const expected = {
      'multiverse+pkg-1:*': ['./path/to/packages/pkg-1/src/*'],
      'multiverse+pkg-2:*': ['./path/to/packages/pkg-2/src/*'],
      'multiverse+pkg-10:*': ['./path/to/packages/pkg-10/src/*'],
      'multiverse+pkg-1': ['./path/to/packages/pkg-1/src/index.ts'],
      'multiverse+pkg-2': ['./path/to/packages/pkg-2/src/index.ts'],
      'multiverse+pkg-10': ['./path/to/packages/pkg-10/src/index.ts'],
      'universe+pkg-1:*': ['./path/to/packages/pkg-1/src/*'],
      'universe+pkg-2:*': ['./path/to/packages/pkg-2/src/*'],
      'universe+pkg-10:*': ['./path/to/packages/pkg-10/src/*'],
      'universe+pkg-1': ['./path/to/packages/pkg-1/src/index.ts'],
      'universe+pkg-2': ['./path/to/packages/pkg-2/src/index.ts'],
      'universe+pkg-10': ['./path/to/packages/pkg-10/src/index.ts'],
      'universe:*': ['./src/*'],
      universe: ['./src/index.ts'],
      'testverse+pkg-1:*': ['./path/to/packages/pkg-1/test/*'],
      'testverse+pkg-2:*': ['./path/to/packages/pkg-2/test/*'],
      'testverse+pkg-10:*': ['./path/to/packages/pkg-10/test/*'],
      'testverse:*': ['./test/*'],
      'typeverse:*': ['./types/*'],
      'rootverse+pkg-1:*': ['./path/to/packages/pkg-1/*'],
      'rootverse+pkg-2:*': ['./path/to/packages/pkg-2/*'],
      'rootverse+pkg-10:*': ['./path/to/packages/pkg-10/*'],
      'rootverse:*': ['./*']
    };

    const actual = deriveAliasesForTypeScript(mockConfigOrderHybridrepoMappings);

    expect(actual).toStrictEqual(expected);
    expect(Object.keys(actual)).toStrictEqual(Object.keys(expected));
  });
});

describe('::mapRawSpecifierToRawAliasMapping', () => {
  it('returns undefined if specifier matches no aliases', async () => {
    expect.hasAssertions();

    expect(
      mapRawSpecifierToRawAliasMapping(mockConfigOrderPolyrepoMappings, 'testverse')
    ).toBeUndefined();

    expect(
      mapRawSpecifierToRawAliasMapping(mockConfigOrderPolyrepoMappings, 'multiverse')
    ).toBeUndefined();

    expect(
      mapRawSpecifierToRawAliasMapping(mockConfigOrderPolyrepoMappings, 'multiverse+a')
    ).toBeUndefined();
  });

  it('returns matching raw aliases wrt verse-specificity order given a polyrepo specifier', async () => {
    expect.hasAssertions();

    expect(
      mapRawSpecifierToRawAliasMapping(mockConfigOrderPolyrepoMappings, 'universe')
    ).toStrictEqual(
      mockConfigOrderPolyrepoMappings.find(
        ([{ alias, suffix }]) => alias === 'universe' && suffix === 'exact'
      )
    );

    expect(
      mapRawSpecifierToRawAliasMapping(
        mockConfigOrderPolyrepoMappings,
        'universe:something.ts'
      )
    ).toStrictEqual(
      mockConfigOrderPolyrepoMappings.find(
        ([{ alias, suffix }]) => alias === 'universe' && suffix !== 'exact'
      )
    );

    expect(
      mapRawSpecifierToRawAliasMapping(
        mockConfigOrderPolyrepoMappings,
        'rootverse:something.ts'
      )
    ).toStrictEqual(
      mockConfigOrderPolyrepoMappings.find(
        ([{ alias, suffix }]) => alias === 'rootverse' && suffix !== 'exact'
      )
    );

    expect(
      mapRawSpecifierToRawAliasMapping(
        mockConfigOrderPolyrepoMappings,
        'testverse:something.ts'
      )
    ).toStrictEqual(
      mockConfigOrderPolyrepoMappings.find(
        ([{ alias, suffix }]) => alias === 'testverse' && suffix !== 'exact'
      )
    );

    expect(
      mapRawSpecifierToRawAliasMapping(
        mockConfigOrderPolyrepoMappings,
        'typeverse:global.ts'
      )
    ).toStrictEqual(
      mockConfigOrderPolyrepoMappings.find(
        ([{ alias, suffix }]) => alias === 'typeverse' && suffix !== 'exact'
      )
    );
  });

  it('returns matching raw alias wrt verse-specificity order given a hybridrepo specifier', async () => {
    expect.hasAssertions();

    expect(
      mapRawSpecifierToRawAliasMapping(mockConfigOrderHybridrepoMappings, 'universe')
    ).toStrictEqual(
      mockConfigOrderPolyrepoMappings.find(
        ([{ alias, suffix }]) => alias.startsWith('universe') && suffix === 'exact'
      )
    );

    expect(
      mapRawSpecifierToRawAliasMapping(
        mockConfigOrderHybridrepoMappings,
        'universe:something.ts'
      )
    ).toStrictEqual(
      mockConfigOrderPolyrepoMappings.find(
        ([{ alias, suffix }]) => alias.startsWith('universe') && suffix !== 'exact'
      )
    );

    expect(
      mapRawSpecifierToRawAliasMapping(mockConfigOrderHybridrepoMappings, 'multiverse')
    ).toBeUndefined();

    expect(
      mapRawSpecifierToRawAliasMapping(
        mockConfigOrderHybridrepoMappings,
        'multiverse+pkg-2'
      )
    ).toStrictEqual(
      mockConfigOrderHybridrepoMappings.find(
        ([{ alias, suffix, packageId }]) =>
          alias.startsWith('multiverse') && suffix === 'exact' && packageId === 'pkg-2'
      )
    );

    expect(
      mapRawSpecifierToRawAliasMapping(
        mockConfigOrderHybridrepoMappings,
        'multiverse+pkg-2:something/else/over/there.ts'
      )
    ).toStrictEqual(
      mockConfigOrderHybridrepoMappings.find(
        ([{ alias, suffix, packageId }]) =>
          alias.startsWith('multiverse') && suffix !== 'exact' && packageId === 'pkg-2'
      )
    );

    expect(
      mapRawSpecifierToRawAliasMapping(
        mockConfigOrderHybridrepoMappings,
        'multiverse+pkg-1'
      )
    ).toStrictEqual(
      mockConfigOrderHybridrepoMappings.find(
        ([{ alias, suffix, packageId }]) =>
          alias.startsWith('multiverse') && suffix === 'exact' && packageId === 'pkg-1'
      )
    );

    expect(
      mapRawSpecifierToRawAliasMapping(
        mockConfigOrderHybridrepoMappings,
        'rootverse+pkg-1:stuff.ts'
      )
    ).toStrictEqual(
      mockConfigOrderHybridrepoMappings.find(
        ([{ alias, suffix, packageId }]) =>
          alias.startsWith('rootverse') && suffix !== 'exact' && packageId === 'pkg-1'
      )
    );

    expect(
      mapRawSpecifierToRawAliasMapping(
        mockConfigOrderHybridrepoMappings,
        'rootverse+pkg-2:my/stuff.ts'
      )
    ).toStrictEqual(
      mockConfigOrderHybridrepoMappings.find(
        ([{ alias, suffix, packageId }]) =>
          alias.startsWith('rootverse') && suffix !== 'exact' && packageId === 'pkg-2'
      )
    );

    expect(
      mapRawSpecifierToRawAliasMapping(mockConfigOrderHybridrepoMappings, 'rootverse')
    ).toBeUndefined();

    expect(
      mapRawSpecifierToRawAliasMapping(
        mockConfigOrderHybridrepoMappings,
        'rootverse:stuff/lives/here.ts'
      )
    ).toStrictEqual(
      mockConfigOrderHybridrepoMappings.find(
        ([{ alias, suffix, packageId }]) =>
          alias.startsWith('rootverse') && suffix !== 'exact' && !packageId
      )
    );

    expect(
      mapRawSpecifierToRawAliasMapping(mockConfigOrderHybridrepoMappings, 'testverse')
    ).toBeUndefined();

    expect(
      mapRawSpecifierToRawAliasMapping(
        mockConfigOrderHybridrepoMappings,
        'testverse+pkg-5'
      )
    ).toBeUndefined();

    expect(
      mapRawSpecifierToRawAliasMapping(
        mockConfigOrderHybridrepoMappings,
        'testverse+pkg-2'
      )
    ).toBeUndefined();

    expect(
      mapRawSpecifierToRawAliasMapping(
        mockConfigOrderHybridrepoMappings,
        'testverse+pkg-2:something.ts'
      )
    ).toStrictEqual(
      mockConfigOrderHybridrepoMappings.find(
        ([{ alias, suffix, packageId }]) =>
          alias.startsWith('testverse') && suffix !== 'exact' && packageId === 'pkg-2'
      )
    );

    expect(
      mapRawSpecifierToRawAliasMapping(
        mockConfigOrderHybridrepoMappings,
        'testverse:setup.ts'
      )
    ).toStrictEqual(
      mockConfigOrderHybridrepoMappings.find(
        ([{ alias, suffix, packageId }]) =>
          alias.startsWith('testverse') && suffix !== 'exact' && !packageId
      )
    );

    expect(
      mapRawSpecifierToRawAliasMapping(
        mockConfigOrderHybridrepoMappings,
        'typeverse:global.ts'
      )
    ).toStrictEqual(
      mockConfigOrderHybridrepoMappings.find(
        ([{ alias, suffix }]) => alias.startsWith('typeverse') && suffix !== 'exact'
      )
    );
  });
});

describe('::mapRawSpecifierToPath', () => {
  it('returns undefined if specifier matches no aliases', async () => {
    expect.hasAssertions();

    expect(
      mapRawSpecifierToPath(mockConfigOrderHybridrepoMappings, '@babel/core')
    ).toBeUndefined();
    expect(
      mapRawSpecifierToPath(mockConfigOrderHybridrepoMappings, 'testverse')
    ).toBeUndefined();

    expect(
      mapRawSpecifierToPath(mockConfigOrderHybridrepoMappings, 'testverse+pkg-1')
    ).toBeUndefined();

    expect(
      mapRawSpecifierToPath(mockConfigOrderHybridrepoMappings, 'rootverse')
    ).toBeUndefined();
    expect(mapRawSpecifierToPath(mockConfigOrderHybridrepoMappings, '')).toBeUndefined();

    expect(
      mapRawSpecifierToPath(
        mockConfigOrderHybridrepoMappings,
        'typeverse+pkg-1:setup.ts'
      )
    ).toBeUndefined();
  });

  it('maps a raw alias to its theoretical relative filesystem path', async () => {
    expect.hasAssertions();

    expect(
      mapRawSpecifierToPath(mockConfigOrderHybridrepoMappings, 'universe:something.ts')
    ).toBe('src/something.ts');

    expect(
      mapRawSpecifierToPath(
        mockConfigOrderHybridrepoMappings,
        'multiverse+pkg-1:something.ts'
      )
    ).toBe('path/to/packages/pkg-1/src/something.ts');

    expect(
      mapRawSpecifierToPath(
        mockConfigOrderHybridrepoMappings,
        'multiverse+pkg-2:some/other/thing.ts'
      )
    ).toBe('path/to/packages/pkg-2/src/some/other/thing.ts');

    expect(
      mapRawSpecifierToPath(
        mockConfigOrderHybridrepoMappings,
        'rootverse+pkg-2:some/other/thing.ts'
      )
    ).toBe('path/to/packages/pkg-2/some/other/thing.ts');

    expect(
      mapRawSpecifierToPath(mockConfigOrderHybridrepoMappings, 'rootverse:package.json')
    ).toBe('package.json');

    expect(
      mapRawSpecifierToPath(
        mockConfigOrderHybridrepoMappings,
        'rootverse:some/thing/is/here.ts'
      )
    ).toBe('some/thing/is/here.ts');

    expect(
      mapRawSpecifierToPath(mockConfigOrderHybridrepoMappings, 'testverse:setup.ts')
    ).toBe('test/setup.ts');

    expect(
      mapRawSpecifierToPath(
        mockConfigOrderHybridrepoMappings,
        'testverse+pkg-1:setup.ts'
      )
    ).toBe('path/to/packages/pkg-1/test/setup.ts');

    expect(
      mapRawSpecifierToPath(mockConfigOrderHybridrepoMappings, 'typeverse:global.ts')
    ).toBe('types/global.ts');
  });

  it('appends extension to the end of path when extensionless is false', async () => {
    expect.hasAssertions();

    expect(mapRawSpecifierToPath(mockConfigOrderHybridrepoMappings, 'universe')).toBe(
      'src/index.ts'
    );

    expect(
      mapRawSpecifierToPath(mockConfigOrderHybridrepoMappings, 'multiverse+pkg-1')
    ).toBe('path/to/packages/pkg-1/src/index.ts');

    expect(
      mapRawSpecifierToPath(mockConfigOrderHybridrepoMappings, 'multiverse+pkg-1', {
        extensionToAppend: '.new'
      })
    ).toBe('path/to/packages/pkg-1/src/index.new');
  });

  it('accepts a single raw specifier instead of an array of them', async () => {
    expect.hasAssertions();

    expect(
      mapRawSpecifierToPath(mockConfigOrderHybridrepoMappings, 'universe')
    ).toStrictEqual(
      mapRawSpecifierToPath(
        mapRawSpecifierToRawAliasMapping(mockConfigOrderHybridrepoMappings, 'universe')!,
        'universe'
      )
    );
  });
});

describe('::ensureRawSpecifierOk', () => {
  const defaultOptions: Parameters<typeof ensureRawSpecifierOk>[2] = {
    allowForeignUniversalImports: true,
    allowMultiversalImports: true,
    allowRootverseNodeModules: true,
    allowTestversalImports: true
  };

  it('does not throw on valid specifiers', async () => {
    expect.hasAssertions();

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        '@babel/core',
        defaultOptions
      )
    ).not.toThrow();

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'next-test-api-route-handler',
        defaultOptions
      )
    ).not.toThrow();

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        '@-xun/project-utils/resolver',
        defaultOptions
      )
    ).not.toThrow();

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'node:path',
        defaultOptions
      )
    ).not.toThrow();

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'https://some-website.com/some/package',
        defaultOptions
      )
    ).not.toThrow();
  });

  it('accepts a single raw specifier instead of an array of them', async () => {
    expect.hasAssertions();

    const rawAlias: RawAlias = {
      alias: 'fake',
      group: WellKnownImportAlias.Typeverse,
      packageId: undefined,
      prefix: 'exact',
      suffix: 'open',
      regExp: /fake/
    };

    const testSpecifier1 = 'typeverse:global.ts';
    const testSpecifier2 = 'fake:no/ext';
    const fakeMapping: RawAliasMapping = [rawAlias, {} as RawPath];

    const typeverseMapping = mapRawSpecifierToRawAliasMapping(
      mockConfigOrderHybridrepoMappings,
      testSpecifier1
    )!;

    expect(() =>
      ensureRawSpecifierOk(typeverseMapping, testSpecifier1, defaultOptions)
    ).not.toThrow();
    expect(() =>
      ensureRawSpecifierOk(fakeMapping, testSpecifier1, defaultOptions)
    ).not.toThrow();
    expect(() =>
      ensureRawSpecifierOk(typeverseMapping, testSpecifier2, defaultOptions)
    ).not.toThrow();

    expect(() =>
      ensureRawSpecifierOk(fakeMapping, testSpecifier2, defaultOptions)
    ).toThrow(GraphErrorMessage.SpecifierNotOkMissingExtension(testSpecifier2));

    expect(() =>
      ensureRawSpecifierOk(typeverseMapping, 'typeverse:global', defaultOptions)
    ).toThrow(GraphErrorMessage.SpecifierNotOkMissingExtension('typeverse:global'));
  });

  it('throws if specifier is empty (with optional path info)', async () => {
    expect.hasAssertions();

    expect(() =>
      ensureRawSpecifierOk(mockConfigOrderHybridrepoMappings, '', defaultOptions)
    ).toThrow(GraphErrorMessage.SpecifierNotOkEmpty(''));

    expect(() =>
      ensureRawSpecifierOk(mockConfigOrderHybridrepoMappings, '', {
        ...defaultOptions,
        containingFilePath: '/in/some/file.abc'
      })
    ).toThrow(GraphErrorMessage.SpecifierNotOkEmpty('', '/in/some/file.abc'));
  });

  it('throws if specifier begins with "/" or "./" or "../" or "/" or equals "." or ".." (with optional path info)', async () => {
    expect.hasAssertions();

    expect(() =>
      ensureRawSpecifierOk(mockConfigOrderHybridrepoMappings, '.', defaultOptions)
    ).toThrow(GraphErrorMessage.SpecifierNotOkRelative('.'));

    expect(() =>
      ensureRawSpecifierOk(mockConfigOrderHybridrepoMappings, '.', {
        ...defaultOptions,
        containingFilePath: '/in/some/file.abc'
      })
    ).toThrow(GraphErrorMessage.SpecifierNotOkRelative('.', '/in/some/file.abc'));

    expect(() =>
      ensureRawSpecifierOk(mockConfigOrderHybridrepoMappings, '..', defaultOptions)
    ).toThrow(GraphErrorMessage.SpecifierNotOkRelative('..'));

    expect(() =>
      ensureRawSpecifierOk(mockConfigOrderHybridrepoMappings, '..', {
        ...defaultOptions,
        containingFilePath: '/in/some/file.abc'
      })
    ).toThrow(GraphErrorMessage.SpecifierNotOkRelative('..', '/in/some/file.abc'));

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        './something.js',
        defaultOptions
      )
    ).toThrow(GraphErrorMessage.SpecifierNotOkRelative('./something.js'));

    expect(() =>
      ensureRawSpecifierOk(mockConfigOrderHybridrepoMappings, './something.js', {
        ...defaultOptions,
        containingFilePath: '/in/some/file.abc'
      })
    ).toThrow(
      GraphErrorMessage.SpecifierNotOkRelative('./something.js', '/in/some/file.abc')
    );

    expect(() =>
      ensureRawSpecifierOk(mockConfigOrderHybridrepoMappings, '../up.ts', defaultOptions)
    ).toThrow(GraphErrorMessage.SpecifierNotOkRelative('../up.ts'));

    expect(() =>
      ensureRawSpecifierOk(mockConfigOrderHybridrepoMappings, '../up.ts', {
        ...defaultOptions,
        containingFilePath: '/in/some/file.abc'
      })
    ).toThrow(GraphErrorMessage.SpecifierNotOkRelative('../up.ts', '/in/some/file.abc'));

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        '/bad-bad/not/good.ts',
        defaultOptions
      )
    ).toThrow(GraphErrorMessage.SpecifierNotOkRelative('/bad-bad/not/good.ts'));

    expect(() =>
      ensureRawSpecifierOk(mockConfigOrderHybridrepoMappings, '/bad-bad/not/good.ts', {
        ...defaultOptions,
        containingFilePath: '/in/some/file.abc'
      })
    ).toThrow(
      GraphErrorMessage.SpecifierNotOkRelative(
        '/bad-bad/not/good.ts',
        '/in/some/file.abc'
      )
    );
  });

  it('throws if the alias suffix is "open" and the specifier is missing an extension (with optional path info)', async () => {
    expect.hasAssertions();

    expect(() =>
      ensureRawSpecifierOk(mockConfigOrderHybridrepoMappings, 'universe', defaultOptions)
    ).not.toThrow();

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'multiverse+pkg-1',
        defaultOptions
      )
    ).not.toThrow();

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'universe:some/file',
        defaultOptions
      )
    ).toThrow(GraphErrorMessage.SpecifierNotOkMissingExtension('universe:some/file'));

    expect(() =>
      ensureRawSpecifierOk(mockConfigOrderHybridrepoMappings, 'universe:some/file', {
        ...defaultOptions,
        containingFilePath: '/in/some/file.abc'
      })
    ).toThrow(
      GraphErrorMessage.SpecifierNotOkMissingExtension(
        'universe:some/file',
        '/in/some/file.abc'
      )
    );

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'multiverse+pkg-1:index',
        defaultOptions
      )
    ).toThrow(
      GraphErrorMessage.SpecifierNotOkMissingExtension('multiverse+pkg-1:index')
    );

    expect(() =>
      ensureRawSpecifierOk(mockConfigOrderHybridrepoMappings, 'multiverse+pkg-1:index', {
        ...defaultOptions,
        containingFilePath: '/in/some/file.abc'
      })
    ).toThrow(
      GraphErrorMessage.SpecifierNotOkMissingExtension(
        'multiverse+pkg-1:index',
        '/in/some/file.abc'
      )
    );

    expect(() =>
      ensureRawSpecifierOk(mockConfigOrderHybridrepoMappings, 'testverse:setup', {
        ...defaultOptions,
        allowTestversalImports: true
      })
    ).toThrow(GraphErrorMessage.SpecifierNotOkMissingExtension('testverse:setup'));

    expect(() =>
      ensureRawSpecifierOk(mockConfigOrderHybridrepoMappings, 'testverse:setup', {
        ...defaultOptions,
        allowTestversalImports: true,
        containingFilePath: '/in/some/file.abc'
      })
    ).toThrow(
      GraphErrorMessage.SpecifierNotOkMissingExtension(
        'testverse:setup',
        '/in/some/file.abc'
      )
    );

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'typeverse:global',
        defaultOptions
      )
    ).toThrow(GraphErrorMessage.SpecifierNotOkMissingExtension('typeverse:global'));

    expect(() =>
      ensureRawSpecifierOk(mockConfigOrderHybridrepoMappings, 'typeverse:global', {
        ...defaultOptions,
        containingFilePath: '/in/some/file.abc'
      })
    ).toThrow(
      GraphErrorMessage.SpecifierNotOkMissingExtension(
        'typeverse:global',
        '/in/some/file.abc'
      )
    );
  });

  it('throws if the specifier equals "index.extensionToAppend" (with optional path info)', async () => {
    expect.hasAssertions();

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'multiverse+pkg-1:index.js',
        defaultOptions
      )
    ).not.toThrow();

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'multiverse+pkg-1:index.js',
        {
          ...defaultOptions,
          extensionToAppend: '.js'
        }
      )
    ).toThrow(
      GraphErrorMessage.SpecifierNotOkUnnecessaryIndex('multiverse+pkg-1:index.js')
    );

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'multiverse+pkg-1:index.js',
        {
          ...defaultOptions,
          extensionToAppend: '.js',
          containingFilePath: '/in/some/file.abc'
        }
      )
    ).toThrow(
      GraphErrorMessage.SpecifierNotOkUnnecessaryIndex(
        'multiverse+pkg-1:index.js',
        '/in/some/file.abc'
      )
    );

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'multiverse+pkg-1:index.ts',
        defaultOptions
      )
    ).toThrow(
      GraphErrorMessage.SpecifierNotOkUnnecessaryIndex('multiverse+pkg-1:index.ts')
    );

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'multiverse+pkg-1:index.ts',
        {
          ...defaultOptions,
          containingFilePath: '/in/some/file.abc'
        }
      )
    ).toThrow(
      GraphErrorMessage.SpecifierNotOkUnnecessaryIndex(
        'multiverse+pkg-1:index.ts',
        '/in/some/file.abc'
      )
    );

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'universe:index.ts',
        defaultOptions
      )
    ).toThrow(GraphErrorMessage.SpecifierNotOkUnnecessaryIndex('universe:index.ts'));

    expect(() =>
      ensureRawSpecifierOk(mockConfigOrderHybridrepoMappings, 'universe:index.ts', {
        ...defaultOptions,
        containingFilePath: '/in/some/file.abc'
      })
    ).toThrow(
      GraphErrorMessage.SpecifierNotOkUnnecessaryIndex(
        'universe:index.ts',
        '/in/some/file.abc'
      )
    );

    expect(() =>
      ensureRawSpecifierOk(mockConfigOrderHybridrepoMappings, 'testverse:index.ts', {
        ...defaultOptions,
        allowTestversalImports: true
      })
    ).toThrow(GraphErrorMessage.SpecifierNotOkUnnecessaryIndex('testverse:index.ts'));

    expect(() =>
      ensureRawSpecifierOk(mockConfigOrderHybridrepoMappings, 'testverse:index.ts', {
        ...defaultOptions,
        allowTestversalImports: true,
        containingFilePath: '/in/some/file.abc'
      })
    ).toThrow(
      GraphErrorMessage.SpecifierNotOkUnnecessaryIndex(
        'testverse:index.ts',
        '/in/some/file.abc'
      )
    );

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'typeverse:index.ts',
        defaultOptions
      )
    ).toThrow(GraphErrorMessage.SpecifierNotOkUnnecessaryIndex('typeverse:index.ts'));

    expect(() =>
      ensureRawSpecifierOk(mockConfigOrderHybridrepoMappings, 'typeverse:index.ts', {
        ...defaultOptions,
        containingFilePath: '/in/some/file.abc'
      })
    ).toThrow(
      GraphErrorMessage.SpecifierNotOkUnnecessaryIndex(
        'typeverse:index.ts',
        '/in/some/file.abc'
      )
    );

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'rootverse:index.ts',
        defaultOptions
      )
    ).toThrow(GraphErrorMessage.SpecifierNotOkUnnecessaryIndex('rootverse:index.ts'));

    expect(() =>
      ensureRawSpecifierOk(mockConfigOrderHybridrepoMappings, 'rootverse:index.ts', {
        ...defaultOptions,
        containingFilePath: '/in/some/file.abc'
      })
    ).toThrow(
      GraphErrorMessage.SpecifierNotOkUnnecessaryIndex(
        'rootverse:index.ts',
        '/in/some/file.abc'
      )
    );
  });

  it('throws if packageId is defined and multiverse import used self-referentially (with optional path info)', async () => {
    expect.hasAssertions();

    expect(() =>
      ensureRawSpecifierOk(mockConfigOrderHybridrepoMappings, 'multiverse+pkg-2', {
        ...defaultOptions,
        packageId: 'pkg-1'
      })
    ).not.toThrow();

    expect(() =>
      ensureRawSpecifierOk(mockConfigOrderHybridrepoMappings, 'multiverse+pkg-1', {
        ...defaultOptions,
        packageId: 'pkg-1'
      })
    ).toThrow(GraphErrorMessage.SpecifierNotOkSelfReferential('multiverse+pkg-1'));

    expect(() =>
      ensureRawSpecifierOk(mockConfigOrderHybridrepoMappings, 'multiverse+pkg-1', {
        ...defaultOptions,
        packageId: 'pkg-1',
        containingFilePath: '/in/some/file.abc'
      })
    ).toThrow(
      GraphErrorMessage.SpecifierNotOkSelfReferential(
        'multiverse+pkg-1',
        '/in/some/file.abc'
      )
    );

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'multiverse+pkg-1:something.ts',
        {
          ...defaultOptions,
          packageId: 'pkg-1'
        }
      )
    ).toThrow(
      GraphErrorMessage.SpecifierNotOkSelfReferential('multiverse+pkg-1:something.ts')
    );

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'multiverse+pkg-1:something.ts',
        {
          ...defaultOptions,
          packageId: 'pkg-1',
          containingFilePath: '/in/some/file.abc'
        }
      )
    ).toThrow(
      GraphErrorMessage.SpecifierNotOkSelfReferential(
        'multiverse+pkg-1:something.ts',
        '/in/some/file.abc'
      )
    );

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'multiverse+pkg-1:something/wrong.ts',
        { ...defaultOptions, packageId: 'pkg-1' }
      )
    ).toThrow(
      GraphErrorMessage.SpecifierNotOkSelfReferential(
        'multiverse+pkg-1:something/wrong.ts'
      )
    );

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'multiverse+pkg-1:something/wrong.ts',
        {
          ...defaultOptions,
          packageId: 'pkg-1',
          containingFilePath: '/in/some/file.abc'
        }
      )
    ).toThrow(
      GraphErrorMessage.SpecifierNotOkSelfReferential(
        'multiverse+pkg-1:something/wrong.ts',
        '/in/some/file.abc'
      )
    );

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'multiverse+pkg-2:something/wrong.ts',
        { ...defaultOptions, packageId: 'pkg-1' }
      )
    ).not.toThrow();
  });

  it('throws if packageId is defined and rootverse import used self-referentially (with optional path info)', async () => {
    expect.hasAssertions();

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'rootverse+pkg-2:src/cli.ts',
        {
          ...defaultOptions,
          packageId: 'pkg-2'
        }
      )
    ).toThrow(
      GraphErrorMessage.SpecifierNotOkSelfReferential('rootverse+pkg-2:src/cli.ts')
    );

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'rootverse+pkg-2:src/cli.ts',
        {
          ...defaultOptions,
          packageId: 'pkg-2',
          containingFilePath: 'some/path'
        }
      )
    ).toThrow(
      GraphErrorMessage.SpecifierNotOkSelfReferential(
        'rootverse+pkg-2:src/cli.ts',
        'some/path'
      )
    );
  });

  it('throws if rootverse import is suboptimal or rootverse imports from node_modules and allowRootverseNodeModules is false (both with optional path info)', async () => {
    expect.hasAssertions();

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'rootverse+pkg-2:not/src.ts',
        {
          ...defaultOptions,
          packageId: 'pkg-1'
        }
      )
    ).not.toThrow();

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'rootverse+pkg-2:not/src.ts',
        {
          ...defaultOptions,
          packageId: 'pkg-2'
        }
      )
    ).not.toThrow();

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'rootverse+pkg-2:not/src.ts',
        {
          ...defaultOptions
        }
      )
    ).not.toThrow();

    expect(() =>
      ensureRawSpecifierOk(mockConfigOrderHybridrepoMappings, 'rootverse:not/src.ts', {
        ...defaultOptions
      })
    ).not.toThrow();

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'rootverse+pkg-2:src/test.ts',
        {
          ...defaultOptions,
          packageId: 'pkg-2'
        }
      )
    ).toThrow(
      GraphErrorMessage.SpecifierNotOkSuboptimal(
        'rootverse+pkg-2:src/test.ts',
        'universe+pkg-2:test.ts'
      )
    );

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'rootverse+pkg-2:src/test.ts',
        {
          ...defaultOptions,
          packageId: 'pkg-1'
        }
      )
    ).toThrow(
      GraphErrorMessage.SpecifierNotOkSuboptimal(
        'rootverse+pkg-2:src/test.ts',
        'multiverse+pkg-2:test.ts'
      )
    );

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'rootverse+pkg-2:src/test.ts',
        {
          ...defaultOptions,
          allowMultiversalImports: false,
          packageId: 'pkg-1',
          containingFilePath: '/some/path.ts'
        }
      )
    ).toThrow(
      GraphErrorMessage.SpecifierNotOkVerseNotAllowed(
        'multiversal rootverse',
        'rootverse+pkg-2:src/test.ts',
        '/some/path.ts'
      )
    );

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'rootverse+pkg-2:src/test.ts',
        {
          ...defaultOptions,
          allowMultiversalImports: false,
          packageId: 'pkg-2',
          containingFilePath: '/some/path.ts'
        }
      )
    ).toThrow(
      GraphErrorMessage.SpecifierNotOkSuboptimal(
        'rootverse+pkg-2:src/test.ts',
        'universe+pkg-2:test.ts',
        '/some/path.ts'
      )
    );

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'rootverse+pkg-2:src/test.ts',
        {
          ...defaultOptions,
          allowMultiversalImports: false,
          packageId: 'pkg-1',
          containingFilePath: '/some/path.ts'
        }
      )
    ).toThrow(
      GraphErrorMessage.SpecifierNotOkVerseNotAllowed(
        'multiversal rootverse',
        'rootverse+pkg-2:src/test.ts',
        '/some/path.ts'
      )
    );

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'rootverse+pkg-2:test/test.ts',
        {
          ...defaultOptions,
          allowMultiversalImports: false,
          packageId: 'pkg-2'
        }
      )
    ).toThrow(
      GraphErrorMessage.SpecifierNotOkSuboptimal(
        'rootverse+pkg-2:test/test.ts',
        'testverse+pkg-2:test.ts'
      )
    );

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'rootverse+pkg-2:test/test.ts',
        {
          ...defaultOptions,
          allowMultiversalImports: false,
          packageId: 'pkg-1'
        }
      )
    ).toThrow(
      GraphErrorMessage.SpecifierNotOkSuboptimal(
        'rootverse+pkg-2:test/test.ts',
        'testverse+pkg-2:test.ts'
      )
    );

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'rootverse+pkg-2:test/test.ts',
        {
          ...defaultOptions,
          allowMultiversalImports: false,
          allowTestversalImports: false,
          packageId: 'pkg-1'
        }
      )
    ).toThrow(
      GraphErrorMessage.SpecifierNotOkVerseNotAllowed(
        'testversal rootverse',
        'rootverse+pkg-2:test/test.ts'
      )
    );

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'rootverse+pkg-2:test/test.ts',
        {
          ...defaultOptions,
          allowTestversalImports: false,
          packageId: 'pkg-1'
        }
      )
    ).toThrow(
      GraphErrorMessage.SpecifierNotOkVerseNotAllowed(
        'testversal rootverse',
        'rootverse+pkg-2:test/test.ts'
      )
    );

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'rootverse+pkg-2:test/test.ts',
        {
          ...defaultOptions,
          packageId: 'pkg-1'
        }
      )
    ).toThrow(
      GraphErrorMessage.SpecifierNotOkSuboptimal(
        'rootverse+pkg-2:test/test.ts',
        'testverse+pkg-2:test.ts'
      )
    );

    expect(() =>
      // * Edge case: has an extension but provides no valid verse hint
      // * Edge case: path component starts with valid verse hint, but isn't one
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'rootverse+pkg-2:test.ts',
        {
          ...defaultOptions,
          packageId: 'pkg-1'
        }
      )
    ).not.toThrow();

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'rootverse:types/test.ts',
        {
          ...defaultOptions,
          packageId: 'pkg-1'
        }
      )
    ).toThrow(
      GraphErrorMessage.SpecifierNotOkSuboptimal(
        'rootverse:types/test.ts',
        'typeverse:test.ts'
      )
    );

    expect(() =>
      // * Edge case: only the root rootverse can "access" the typeverse, so
      // *            this is just a normal rootverse import
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'rootverse+pkg-2:types/test.ts',
        {
          ...defaultOptions,
          packageId: 'pkg-1'
        }
      )
    ).not.toThrow();

    expect(() =>
      // * Edge case: only the root rootverse can "access" the "package-verse",
      // *            so this is just a normal rootverse import
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'rootverse+pkg-2:packages/pkg-1/src/test.ts',
        {
          ...defaultOptions,
          packageId: 'pkg-1'
        }
      )
    ).not.toThrow();

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'rootverse:packages/pkg-1/src/test.ts',
        {
          ...defaultOptions,
          packageId: 'pkg-1',
          containingFilePath: 'some/path'
        }
      )
    ).toThrow(
      GraphErrorMessage.SpecifierNotOkSuboptimal(
        'rootverse:packages/pkg-1/src/test.ts',
        'universe+pkg-1:test.ts',
        'some/path'
      )
    );

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'rootverse:packages/pkg-1/src/test.ts',
        {
          ...defaultOptions,
          packageId: 'pkg-2'
        }
      )
    ).toThrow(
      GraphErrorMessage.SpecifierNotOkSuboptimal(
        'rootverse:packages/pkg-1/src/test.ts',
        'multiverse+pkg-1:test.ts'
      )
    );

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'rootverse:packages/pkg-1/src/test.ts',
        {
          ...defaultOptions,
          allowMultiversalImports: false,
          packageId: 'pkg-2'
        }
      )
    ).toThrow(
      GraphErrorMessage.SpecifierNotOkVerseNotAllowed(
        'multiversal rootverse',
        'rootverse:packages/pkg-1/src/test.ts'
      )
    );

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'rootverse:packages/pkg-1/test/src.ts',
        {
          ...defaultOptions,
          allowMultiversalImports: false,
          // ? Doesn't do anything
          allowTestversalImports: false,
          packageId: 'pkg-2'
        }
      )
    ).toThrow(
      GraphErrorMessage.SpecifierNotOkVerseNotAllowed(
        'multiversal rootverse',
        'rootverse:packages/pkg-1/test/src.ts'
      )
    );

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'rootverse:packages/pkg-1/test/src.ts',
        {
          ...defaultOptions,
          allowTestversalImports: false,
          packageId: 'pkg-2'
        }
      )
    ).toThrow(
      GraphErrorMessage.SpecifierNotOkSuboptimal(
        'rootverse:packages/pkg-1/test/src.ts',
        undefined
      )
    );

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'rootverse:packages/pkg-1/test/src.ts',
        {
          ...defaultOptions,
          packageId: 'pkg-2'
        }
      )
    ).toThrow(
      GraphErrorMessage.SpecifierNotOkSuboptimal(
        'rootverse:packages/pkg-1/test/src.ts',
        'testverse+pkg-1:src.ts'
      )
    );

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'rootverse:packages/pkg-1/test/src.ts',
        {
          ...defaultOptions,
          packageId: 'pkg-1'
        }
      )
    ).toThrow(
      GraphErrorMessage.SpecifierNotOkSuboptimal(
        'rootverse:packages/pkg-1/test/src.ts',
        'testverse+pkg-1:src.ts'
      )
    );

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'rootverse:packages/pkg-1/src/dest.ts',
        {
          ...defaultOptions,
          packageId: 'pkg-2'
        }
      )
    ).toThrow(
      GraphErrorMessage.SpecifierNotOkSuboptimal(
        'rootverse:packages/pkg-1/src/dest.ts',
        'multiverse+pkg-1:dest.ts'
      )
    );

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'rootverse:packages/pkg-1/src/dest.ts',
        {
          ...defaultOptions,
          packageId: 'pkg-1'
        }
      )
    ).toThrow(
      GraphErrorMessage.SpecifierNotOkSuboptimal(
        'rootverse:packages/pkg-1/src/dest.ts',
        'universe+pkg-1:dest.ts'
      )
    );

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'rootverse:packages/pkg-1/src/dest.ts',
        { ...defaultOptions }
      )
    ).toThrow(
      GraphErrorMessage.SpecifierNotOkSuboptimal(
        'rootverse:packages/pkg-1/src/dest.ts',
        'multiverse+pkg-1:dest.ts'
      )
    );

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'rootverse:packages/pkg-1/test/dest.ts',
        { ...defaultOptions }
      )
    ).toThrow(
      GraphErrorMessage.SpecifierNotOkSuboptimal(
        'rootverse:packages/pkg-1/test/dest.ts',
        'testverse+pkg-1:dest.ts'
      )
    );

    expect(() =>
      // * Edge case: multiversal testverse imports are always allowed unless
      // * explicitly disallowed
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'rootverse:packages/pkg-1/test/dest.ts',
        { ...defaultOptions, allowMultiversalImports: false }
      )
    ).toThrow(
      GraphErrorMessage.SpecifierNotOkSuboptimal(
        'rootverse:packages/pkg-1/test/dest.ts',
        'testverse+pkg-1:dest.ts'
      )
    );

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'rootverse:packages/pkg-1/test/dest.ts',
        {
          ...defaultOptions,
          allowMultiversalImports: false,
          allowTestversalImports: false
        }
      )
    ).toThrow(
      GraphErrorMessage.SpecifierNotOkSuboptimal(
        'rootverse:packages/pkg-1/test/dest.ts',
        undefined
      )
    );

    expect(() =>
      // * Edge case: self-referential
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'rootverse:packages/pkg-1/something/else.ts',
        {
          ...defaultOptions,
          packageId: 'pkg-1'
        }
      )
    ).toThrow(
      GraphErrorMessage.SpecifierNotOkSuboptimal(
        'rootverse:packages/pkg-1/something/else.ts',
        'rootverse+pkg-1:something/else.ts'
      )
    );

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'rootverse:packages/pkg-1/something/else.ts',
        { ...defaultOptions }
      )
    ).toThrow(
      GraphErrorMessage.SpecifierNotOkSuboptimal(
        'rootverse:packages/pkg-1/something/else.ts',
        'rootverse+pkg-1:something/else.ts'
      )
    );

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'rootverse:types/dest.ts',
        {
          ...defaultOptions
        }
      )
    ).toThrow(
      GraphErrorMessage.SpecifierNotOkSuboptimal(
        'rootverse:types/dest.ts',
        'typeverse:dest.ts'
      )
    );

    expect(() =>
      // * Edge case: something awful
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'rootverse:node_modules/something/awful/dist/src/index.js',
        { ...defaultOptions, allowRootverseNodeModules: false }
      )
    ).toThrow(
      GraphErrorMessage.SpecifierNotOkSuboptimal(
        'rootverse:node_modules/something/awful/dist/src/index.js',
        undefined
      )
    );

    expect(() =>
      // * Edge case: something awful
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'rootverse:node_modules/something/awful/dist/src/index.js',
        { ...defaultOptions, allowRootverseNodeModules: true }
      )
    ).not.toThrow();

    expect(() =>
      // * Edge case: something awful
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'rootverse+pkg-1:node_modules/something/awful/dist/src/index.js',
        { ...defaultOptions, allowRootverseNodeModules: false }
      )
    ).toThrow(
      GraphErrorMessage.SpecifierNotOkSuboptimal(
        'rootverse+pkg-1:node_modules/something/awful/dist/src/index.js',
        undefined
      )
    );

    expect(() =>
      // * Edge case: something awful
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'rootverse+pkg-1:node_modules/something/awful/dist/src/index.js',
        { ...defaultOptions, allowRootverseNodeModules: true }
      )
    ).not.toThrow();

    expect(() =>
      // * Edge case: something awful
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'rootverse:node_modules/something/awful/dist/src/index.js',
        {
          ...defaultOptions,
          allowMultiversalImports: false,
          allowRootverseNodeModules: true
        }
      )
    ).not.toThrow();

    expect(() =>
      // * Edge case: something awful
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'rootverse+pkg-1:node_modules/something/awful/dist/src/index.js',
        {
          ...defaultOptions,
          allowMultiversalImports: false,
          allowRootverseNodeModules: true
        }
      )
    ).toThrow(
      GraphErrorMessage.SpecifierNotOkVerseNotAllowed(
        'multiversal rootverse',
        'rootverse+pkg-1:node_modules/something/awful/dist/src/index.js'
      )
    );
  });

  it('throws if alias path begins with "/" or "./" or "../" or "/" or equals "." or ".." (with optional path info)', async () => {
    expect.hasAssertions();

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'rootverse+pkg-2:../something.ts',
        {
          ...defaultOptions,
          packageId: 'pkg-1'
        }
      )
    ).toThrow(
      GraphErrorMessage.SpecifierNotOkRelative('rootverse+pkg-2:../something.ts')
    );

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'rootverse+pkg-2:../something.ts',
        {
          ...defaultOptions,
          packageId: 'pkg-2',
          containingFilePath: 'some/path'
        }
      )
    ).toThrow(
      GraphErrorMessage.SpecifierNotOkRelative(
        'rootverse+pkg-2:../something.ts',
        'some/path'
      )
    );

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'rootverse:/something.ts',
        {
          ...defaultOptions,
          packageId: 'pkg-2',
          containingFilePath: 'some/path'
        }
      )
    ).toThrow(
      GraphErrorMessage.SpecifierNotOkRelative('rootverse:/something.ts', 'some/path')
    );

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'universe:../something.ts',
        {
          ...defaultOptions,
          packageId: 'pkg-2'
        }
      )
    ).toThrow(GraphErrorMessage.SpecifierNotOkRelative('universe:../something.ts'));
  });

  it('throws if allowMultiversalImports is false and multiversal and/or foreign universe import used regardless of packageId (with optional path info)', async () => {
    expect.hasAssertions();

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'multiverse+pkg-1:types.ts',
        {
          ...defaultOptions,
          allowMultiversalImports: true,
          containingFilePath: 'some/path'
        }
      )
    ).not.toThrow();

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'multiverse+pkg-1:types.ts',
        {
          ...defaultOptions,
          allowMultiversalImports: false,
          containingFilePath: 'some/path'
        }
      )
    ).toThrow(
      GraphErrorMessage.SpecifierNotOkVerseNotAllowed(
        'multiverse',
        'multiverse+pkg-1:types.ts',
        'some/path'
      )
    );

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'multiverse+pkg-2:types.ts',
        {
          ...defaultOptions,
          packageId: 'pkg-1',
          allowMultiversalImports: true,
          containingFilePath: 'some/path'
        }
      )
    ).not.toThrow();

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'multiverse+pkg-2:types.ts',
        {
          ...defaultOptions,
          packageId: 'pkg-1',
          allowMultiversalImports: false,
          containingFilePath: 'some/path'
        }
      )
    ).toThrow(
      GraphErrorMessage.SpecifierNotOkVerseNotAllowed(
        'multiverse',
        'multiverse+pkg-2:types.ts',
        'some/path'
      )
    );

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'universe+pkg-1:types.ts',
        {
          ...defaultOptions,
          packageId: 'pkg-1',
          allowMultiversalImports: true
        }
      )
    ).not.toThrow();

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'universe+pkg-2:types.ts',
        {
          ...defaultOptions,
          packageId: 'pkg-1',
          allowMultiversalImports: true
        }
      )
    ).not.toThrow();

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'universe+pkg-2:types.ts',
        {
          ...defaultOptions,
          packageId: 'pkg-1',
          allowMultiversalImports: false
        }
      )
    ).toThrow(
      GraphErrorMessage.SpecifierNotOkVerseNotAllowed(
        'multiversal universe',
        'universe+pkg-2:types.ts'
      )
    );

    expect(() =>
      // * Edge case: allowMultiversalImports does not govern testversal
      // * rootverse, so this should be "suboptimal," not "verse-not-allowed"
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'rootverse+pkg-2:test/types.ts',
        {
          ...defaultOptions,
          packageId: 'pkg-1',
          allowMultiversalImports: false,
          allowTestversalImports: true
        }
      )
    ).toThrow(
      GraphErrorMessage.SpecifierNotOkSuboptimal(
        'rootverse+pkg-2:test/types.ts',
        'testverse+pkg-2:types.ts'
      )
    );
  });

  it('throws if allowForeignUniversalImports is false and foreign universe import used regardless of packageId (with optional path info)', async () => {
    expect.hasAssertions();

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'universe+pkg-1:types.ts',
        {
          ...defaultOptions,
          packageId: 'pkg-1',
          allowForeignUniversalImports: true
        }
      )
    ).not.toThrow();

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'universe+pkg-2:types.ts',
        {
          ...defaultOptions,
          packageId: 'pkg-1',
          allowForeignUniversalImports: false,
          containingFilePath: './some/path.js'
        }
      )
    ).toThrow(
      GraphErrorMessage.SpecifierNotOkVerseNotAllowed(
        'foreign universe (pkg-2)',
        'universe+pkg-2:types.ts',
        './some/path.js'
      )
    );

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'universe+pkg-2:types.ts',
        {
          ...defaultOptions,
          allowForeignUniversalImports: false,
          containingFilePath: './some/path.js'
        }
      )
    ).toThrow(
      GraphErrorMessage.SpecifierNotOkVerseNotAllowed(
        'foreign universe (pkg-2)',
        'universe+pkg-2:types.ts',
        './some/path.js'
      )
    );

    expect(() =>
      ensureRawSpecifierOk(mockConfigOrderHybridrepoMappings, 'universe:types.ts', {
        ...defaultOptions,
        packageId: 'pkg-1',
        allowForeignUniversalImports: false
      })
    ).toThrow(
      GraphErrorMessage.SpecifierNotOkVerseNotAllowed(
        'foreign universe',
        'universe:types.ts'
      )
    );

    expect(() =>
      ensureRawSpecifierOk(mockConfigOrderHybridrepoMappings, 'universe:types.ts', {
        ...defaultOptions,
        allowForeignUniversalImports: false,
        containingFilePath: './some/path.js'
      })
    ).not.toThrow();
  });

  it('throws if allowTestversalImports is false and testverse alias encountered (with optional path info)', async () => {
    expect.hasAssertions();

    expect(() =>
      ensureRawSpecifierOk(
        mockConfigOrderHybridrepoMappings,
        'rootverse+pkg-1:package.json',
        {
          ...defaultOptions,
          allowTestversalImports: true
        }
      )
    ).not.toThrow();

    expect(() =>
      ensureRawSpecifierOk(mockConfigOrderHybridrepoMappings, 'testverse:setup.ts', {
        ...defaultOptions,
        allowTestversalImports: false,
        containingFilePath: '/in/some/file.abc'
      })
    ).toThrow(
      GraphErrorMessage.SpecifierNotOkVerseNotAllowed(
        WellKnownImportAlias.Testverse,
        'testverse:setup.ts',
        '/in/some/file.abc'
      )
    );

    expect(() =>
      ensureRawSpecifierOk(mockConfigOrderHybridrepoMappings, 'testverse:setup.ts', {
        ...defaultOptions,
        allowTestversalImports: false
      })
    ).toThrow(
      GraphErrorMessage.SpecifierNotOkVerseNotAllowed(
        WellKnownImportAlias.Testverse,
        'testverse:setup.ts'
      )
    );
  });
});

describe('::rawAliasToRegExp', () => {
  it('returns the expected regular expression from raw alias', async () => {
    expect.hasAssertions();

    const dummy = { group: WellKnownImportAlias.Universe, packageId: undefined };

    expect(
      rawAliasToRegExp({ prefix: 'exact', alias: 'a', suffix: 'exact', ...dummy })
    ).toStrictEqual(/^a$/);

    expect(
      rawAliasToRegExp({ prefix: 'none', alias: 'b', suffix: 'exact', ...dummy })
    ).toStrictEqual(/b$/);

    expect(
      rawAliasToRegExp({ prefix: 'exact', alias: 'c', suffix: 'none', ...dummy })
    ).toStrictEqual(/^c/);

    expect(
      rawAliasToRegExp({ prefix: 'none', alias: 'd', suffix: 'none', ...dummy })
    ).toStrictEqual(/d/);

    expect(
      rawAliasToRegExp({ prefix: 'exact', alias: 'e', suffix: 'open', ...dummy })
    ).toStrictEqual(/^e:(.+)$/);

    expect(
      rawAliasToRegExp({ prefix: 'none', alias: 'f', suffix: 'open', ...dummy })
    ).toStrictEqual(/f:(.+)$/);
  });
});
