// ? Bad b/c it's importing a cross-dependency that isn't listed as a dependency
import * as W from 'pkgverse/1-tsbuildinfo/src/index';
// ? Bad b/c it's importing a cross-dependency w/o using pkgverse alias
import * as X from '@bad-monorepo/0-empty';
// ? Bad b/c it's a self-referential import not using pkgverse alias
import * as Y from '@bad-monorepo/2-bad-importer/something-else';
// ? Bad b/c it's importing a devDependency that isn't listed as a dependency
import * as Z from '@babel/core';
// ? Good b/c it's a self-referential import using pkgverse alias
import * as OK1 from 'pkgverse/2-bad-importer/something-else';
// ? Good b/c it's a self-referential import using pkgverse alias
import * as OK2 from 'pkgverse/0-empty/src/index';
void W, X, Y, Z, OK1, OK2;
console.log('raw source code here');
