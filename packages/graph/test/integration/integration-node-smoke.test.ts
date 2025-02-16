// * These are relatively-simple "smoke" tests to ensure this software is
// * fetchable/installable/executable and exits cleanly when run within the
// * runtimes we support (e.g. the currently maintained node versions).
// *
// * Typically, these tests involve the use of deep mock fixtures and/or Docker
// * containers, and are built to run in GitHub Actions CI pipelines; some can
// * also be run locally.

import { toAbsolutePath, toDirname } from '@-xun/fs';
import { readXPackageJsonAtRoot } from '@-xun/project-fs';
import { createDebugLogger } from 'rejoinder';

import {
  exports as packageExports,
  name as packageName
} from 'rootverse+graph:package.json';

import {
  dummyFilesFixture,
  dummyNpmPackageFixture,
  ensurePackageHasBeenBuilt,
  gitRepositoryFixture,
  mockFixturesFactory,
  nodeImportAndRunTestFixture,
  npmLinkPackageFixture,
  reconfigureJestGlobalsToSkipTestsInThisFileIfRequested
} from 'testverse:util.ts';

reconfigureJestGlobalsToSkipTestsInThisFileIfRequested({ it: true });

const TEST_IDENTIFIER = `${packageName.split('/').at(-1)!}-integration-node`;
const debug = createDebugLogger({ namespace: 'graph' }).extend(TEST_IDENTIFIER);
const nodeVersion = process.env.XPIPE_MATRIX_NODE_VERSION || process.version;

debug(`nodeVersion: "${nodeVersion}"`);

beforeAll(async () => {
  await ensurePackageHasBeenBuilt(
    toDirname(toAbsolutePath(require.resolve('rootverse+graph:package.json'))),
    packageName,
    packageExports
  );
});

const packageRoot = toAbsolutePath(__dirname, '../..');
const withMockedFixture = mockFixturesFactory(
  [
    dummyNpmPackageFixture,
    dummyFilesFixture,
    gitRepositoryFixture,
    npmLinkPackageFixture,
    nodeImportAndRunTestFixture
  ],
  {
    performCleanup: false,
    identifier: TEST_IDENTIFIER,
    packageUnderTest: {
      root: packageRoot,
      json: readXPackageJsonAtRoot.sync(packageRoot, { useCached: true }),
      attributes: { cjs: true, multiversal: true }
    },
    initialVirtualFiles: {
      'package.json': /* js */ `{
  "name":"dummy-pkg",
  "version":"0.1.2",
  "workspaces": ["packages/*"]
}`,
      'packages/pkg1/package.json': /* js */ `{
  "name":"pkg-1",
  "version":"1.2.3"
}`,
      'packages/pkg2/package.json': /* js */ `{
  "name":"pkg-2",
  "version":"4.5.6"
}`
    }
  }
);

const runTest = async (
  importAs: 'esm' | 'cjs',
  testFixtureFn: Parameters<typeof withMockedFixture>[0]
) => {
  await withMockedFixture(
    async (context) => {
      await testFixtureFn(context);
    },
    {
      initialVirtualFiles: {
        [`src/index.${importAs === 'esm' ? 'm' : ''}js`]:
          (importAs === 'esm'
            ? /* ts */ `import {
  analyzeProjectStructure,
  deriveAliasesForBabel,
  generateRawAliasMap
} from '${packageName}';`
            : /* ts */ `const {
  analyzeProjectStructure,
  deriveAliasesForBabel,
  generateRawAliasMap
} = require('${packageName}');`) +
          /* ts */ `

const projectMetadata = analyzeProjectStructure.sync({
  useCached: true
});

const { rootPackage, subRootPackages } = projectMetadata;
const rawAliasMappings = generateRawAliasMap(projectMetadata);

console.log(rootPackage.json.name === 'dummy-pkg');
console.log(subRootPackages.get('pkg-1').json.version === '1.2.3');
console.log(deriveAliasesForBabel(rawAliasMappings)['^universe$'] === './src/index.js');
`
      }
    }
  );
};

it('works as an ESM import', async () => {
  expect.hasAssertions();
  await runTest('esm', async (context) => {
    expect(context.testResult.stdout).toBe('true\ntrue\ntrue');
    expect(context.testResult.exitCode).toBe(0);
  });
});

it('works as a CJS require(...)', async () => {
  expect.hasAssertions();
  await runTest('cjs', async (context) => {
    expect(context.testResult.stdout).toBe('true\ntrue\ntrue');
    expect(context.testResult.exitCode).toBe(0);
  });
});
