import type { PackageJsonWithConfig } from 'types/global';
import type { ReporterFactory } from './index';

/**
 * Checks for monorepo sub-root package distributables with cross-dependencies
 * that are not listed in said package's package.json file, or that are not
 * imported using the pkgverse alias. These types of errors **are not normally
 * caught by unit or integration tests**, making them especially pernicious!
 */
export async function checkCrossDependencies({
  pkgJson,
  reporterFactory
}: {
  pkgJson: PackageJsonWithConfig;
  reporterFactory: ReporterFactory;
}) {
  void pkgJson, reporterFactory;
  // TODO: Ensure pkgverse alias is used
  // TODO: Check "module" first, then check "default"/isImplicitDefault

  // TODO: Ignore if checked export field entry paths do not exist or don't end
  // TODO: in .js/.mjs/.cjs, but PackageJsonMissingExportCheckSkipped warning if
  // TODO: checked export field entry is itself missing from package.json
}
