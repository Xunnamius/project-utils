//import { parseAsync } from '@babel/core';

import type { PackageJsonWithConfig } from 'types/global';
import type { ReporterFactory } from './index';

/**
 * Checks non-test source files for dubious imports of packages not listed
 * under `dependencies`, `peerDependencies`, or `optionalDependencies`. For
 * monorepos, also checks that cross-dependencies are imported via `pkgverse`
 * alias, and that `pkgverse` aliases map onto entry points under `"exports"` in
 * `package.json`.
 *
 * These types of errors **are not normally caught by unit or integration
 * tests**, making them especially pernicious!
 */
export async function checkForWellFormedImports({
  pkgJson,
  reporterFactory
}: {
  pkgJson: PackageJsonWithConfig;
  reporterFactory: ReporterFactory;
}) {
  void pkgJson, reporterFactory;
  // TODO: Ensure pkgverse alias is used
  // TODO: Move pkgverse correctness test from Webpack config into plugin-lint

  // TODO: Also check in peerDependencies, optionalDependencies

  // TODO: Under certain circumstances, check devDependencies (from the project
  // TODO: root!) too, i.e. files of the form `.test.(ext)`, files with `/test/`
  // TODO: or `/__test__/` in their path, type imports, etc

  // TODO: Use sourceExtensionsThatSupportImports (ignore others) but also check
  // TODO: .js files if the project OR SUB-ROOT (depending) package.json type ==
  // TODO: module

  // TODO: config['plugin-lint']['imports'].considerDevDeps = ['relative/path/or/glob']
}
