import { resolve } from 'path';
import { readFile } from 'fs/promises';
import { glob } from 'glob';
import { promisify } from 'util';
import { disabledLinkRegex, globIgnorePatterns } from '../constants';
import { ErrorMessage } from '../errors';

import type { ReporterFactory } from './index';

import type {
  MonorepoRunContext,
  PolyrepoRunContext
} from 'pkgverse/core/src/project-utils';

const globAsync = promisify(glob);

/**
 * Checks specified Markdown files for lines lines containing links that may
 * have been erroneously disabled.
 */
export async function checkForPotentiallyDisabledLinks({
  rootDir,
  markdownPaths,
  projectCtx: ctx,
  reporterFactory
}: {
  rootDir: string;
  markdownPaths: readonly string[];
  projectCtx: MonorepoRunContext | PolyrepoRunContext;
  reporterFactory: ReporterFactory;
}) {
  const configIgnorePatterns: string[] = [
    ...(ctx.project.json.project?.lint?.linkProtection?.ignore || [])
  ];

  for (const pkg of ctx.project.packages?.all || []) {
    // ? Append resolved ignore paths (if they exist) to configIgnorePatterns
    configIgnorePatterns.splice(
      -1,
      0,
      ...(pkg.json.project?.lint?.linkProtection?.ignore || []).map((path) =>
        resolve(pkg.root, path)
      )
    );
  }

  await Promise.all(
    markdownPaths.map(async (path) => {
      const files = await globAsync(path, {
        cwd: rootDir,
        absolute: true,
        ignore: [...globIgnorePatterns, ...configIgnorePatterns]
      });

      return Promise.all(
        files.map(async (filePath) => {
          const reportFile = reporterFactory(filePath);
          const fileContents = await readFile(filePath, 'utf-8');
          for (const badLine of fileContents.match(disabledLinkRegex) || []) {
            reportFile('error', ErrorMessage.MarkdownDisabledLink(badLine));
          }
        })
      );
    })
  );
}
