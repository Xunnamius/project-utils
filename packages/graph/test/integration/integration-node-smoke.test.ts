// * These are relatively-simple "smoke" tests to ensure this software is
// * fetchable/installable/executable and exits cleanly when run within the
// * runtimes we support (e.g. the currently maintained node versions).
// *
// * Typically, these tests involve the use of deep mock fixtures and/or Docker
// * containers, and are built to run in GitHub Actions CI pipelines; some can
// * also be run locally.

/* eslint-disable unicorn/no-abusive-eslint-disable */
/* eslint-disable */

test.todo('disable this for now');

// import {
//   dummyDirectoriesFixture,
//   dummyFilesFixture,
//   dummyNpmPackageFixture,
//   ensurePackageHasBeenBuilt,
//   mockFixtureFactory,
//   nodeImportAndRunTestFixture,
//   npmLinkPackageFixture,
//   reconfigureJestGlobalsToSkipTestsInThisFileIfRequested
// } from 'testverse:util.ts';

// import { createDebugLogger } from 'rejoinder';
// import { toDirname } from '@-xun/fs';
// import {
//   name as packageName,
//   version as packageVersion,
//   exports as packageExports
// } from 'rootverse+graph:package.json';

// reconfigureJestGlobalsToSkipTestsInThisFileIfRequested({ it: true });

// const TEST_IDENTIFIER = 'integration-node';
// const debug = createDebugLogger({ namespace: 'graph' }).extend(TEST_IDENTIFIER);
// const nodeVersion = process.env.XPIPE_MATRIX_NODE_VERSION || process.version;

// debug(`nodeVersion: "${nodeVersion}"`);

// beforeAll(async () => {
//   await ensurePackageHasBeenBuilt(
//     toDirname(require.resolve('rootverse+graph:package.json')),
//     packageName,
//     packageExports
//   );
// });

// const withMockedFixture = mockFixtureFactory(
//   [
//     dummyNpmPackageFixture,
//     dummyDirectoriesFixture,
//     dummyFilesFixture,
//     npmLinkPackageFixture,
//     nodeImportAndRunTestFixture
//   ],
//   {
//     performCleanup: true,
//     identifier: TEST_IDENTIFIER,
//     directoryPaths: ['packages/pkg1', 'packages/pkg2', '.git'],
//     initialVirtualFiles: {
//       'package.json': /* js */ `{
//         "name":"dummy-pkg",
//         "workspaces": ["packages/*"],
//         "dependencies": {
//           "${packageName}": "${packageVersion}"
//         }
//       }`,
//       'packages/pkg1/package.json': /* js */ `{
//         "name":"pkg-1",
//         "version":"1.2.3"
//       }`,
//       'packages/pkg2/package.json': /* js */ `{
//         "name":"pkg-2",
//         "version":"1.2.3"
//       }`
//     }
//   }
// );

// const runTest = async (
//   importAs: 'esm' | 'cjs',
//   testFixtureFn: Parameters<typeof withMockedFixture>[0]
// ) => {
//   await withMockedFixture(
//     async (context) => {
//       await testFixtureFn(context);
//     },
//     {
//       initialVirtualFiles: {
//         [`src/index.${importAs === 'esm' ? 'm' : ''}js`]:
//           (importAs === 'esm'
//             ? /* ts */ `import { analyzeProjectStructure } from '${packageName}/project-utils';`
//             : /* ts */ `const { analyzeProjectStructure } = require('${packageName}/project-utils');`) +
//           '\n' +
//           (importAs === 'esm'
//             ? /* ts */ `import { getEslintAliases } from '${packageName}/???';`
//             : /* ts */ `const { getEslintAliases } = require('${packageName}/???');`) +
//           /* ts */ `
// console.log(analyzeProjectStructure().project.json.name === 'dummy-pkg');
// console.log(analyzeProjectStructure().project.packages.get('pkg-1').json.name === 'pkg-1');
// console.log(getEslintAliases()[0][0] === 'universe' && getEslintAliases()[0][1] === './src');
// `
//       }
//     }
//   );
// };

// it('works as an ESM import', async () => {
//   expect.hasAssertions();
//   await runTest('esm', async (context) => {
//     expect(context.testResult.stdout).toBe('true\ntrue\ntrue');
//     expect(context.testResult.exitCode).toBe(0);
//   });
// });

// it('works as a CJS require(...)', async () => {
//   expect.hasAssertions();
//   await runTest('cjs', async (context) => {
//     expect(context.testResult.stdout).toBe('true\ntrue\ntrue');
//     expect(context.testResult.exitCode).toBe(0);
//   });
// });
