/* eslint-disable unicorn/no-array-push-push */
import * as Constants from './constants';
import * as Utils from './utils';
import { run } from 'multiverse/run';
import { CliError, ErrorMessage } from './errors';
import {
  getRunContext,
  flattenPackageJsonSubpathMap
} from 'pkgverse/core/src/project-utils';
import { getMaintainedNodeVersions } from 'pkgverse/core/src/helpers';
import { access } from 'node:fs/promises';
import { glob } from 'glob';
import { promisify } from 'node:util';
import { toss } from 'toss-expression';
import semver from 'semver';
import stripAnsi from 'strip-ansi';
import chalk from 'chalk';

import {
  PackageJsonNotFoundError,
  BadPackageJsonError,
  NotAGitRepositoryError,
  DuplicatePackageIdError,
  DuplicatePackageNameError
} from 'pkgverse/core/src/errors';

import type { PackageJsonWithConfig } from 'types/global';

const globAsync = promisify(glob);

type UnifiedReturnType = Promise<{
  success: boolean;
  output: string | undefined;
  summary: string;
}>;

/**
 * Checks a project or package for structural correctness, adherence to standard
 * practices, and avoidance of certain anti-patterns. The project's package.json
 * file will also be validated.
 */
export async function runProjectLinter({
  rootDir,
  linkProtectionMarkdownPaths,
  mode = 'complete'
}: {
  /**
   * The project or package root directory that relative paths and node globs
   * are resolved against. Must contain a package.json file.
   */
  rootDir: string;
  /**
   * Absolute paths, relative paths, and/or globs that resolve to one or more
   * markdown files to check for potentially erroneously disabled links.
   */
  linkProtectionMarkdownPaths: readonly string[];
  /**
   * Determines how the project is linted. By default, the `"complete"` suite of
   * checks are performed. Alternatively, `runProjectLinter` can be made to run
   * only `"link-protection"` or `"pre-push"` checks.
   *
   * @default "complete"
   */
  mode?: 'complete' | 'link-protection' | 'pre-push';
}): UnifiedReturnType {
  try {
    const outputTree: { [filename: string]: string[] } = {};

    let errorCount = 0;
    let warnCount = 0;

    /**
     * Log an error or a warning
     */
    const reporterFactory: Utils.ReporterFactory = (currentFile) => (type, message) => {
      type == 'warn' ? warnCount++ : errorCount++;
      if (!outputTree[currentFile]) outputTree[currentFile] = [];
      outputTree[currentFile].push(
        `${
          type == 'warn'
            ? chalk.hex('#340343').bgYellow(' warn ')
            : chalk.hex('#340343').bgRed(' ERR! ')
        } ${message}`
      );
    };

    const context = (() => {
      try {
        // ? Technically we could accept cwd instead of forcing rootDir, but
        // ? accepting a cwd would not align with the other linter interfaces...
        return getRunContext({ cwd: rootDir });
      } catch (error) {
        if (error instanceof PackageJsonNotFoundError) {
          reporterFactory(`${rootDir}/package.json`)(
            'error',
            ErrorMessage.FatalMissingFile()
          );
        } else if (error instanceof BadPackageJsonError) {
          reporterFactory(error.packageJsonPath)(
            'error',
            ErrorMessage.PackageJsonUnparsable()
          );
        } else if (error instanceof NotAGitRepositoryError) {
          reporterFactory(rootDir)('error', ErrorMessage.NotAGitRepository());
        } else if (error instanceof DuplicatePackageIdError) {
          reporterFactory(error.firstPath)(
            'error',
            ErrorMessage.DuplicatePackageId(error.id, error.secondPath)
          );
          reporterFactory(error.secondPath)(
            'error',
            ErrorMessage.DuplicatePackageId(error.id, error.firstPath)
          );
        } else if (error instanceof DuplicatePackageNameError) {
          reporterFactory(error.firstPath)(
            'error',
            ErrorMessage.DuplicatePackageName(error.pkgName, error.secondPath)
          );
          reporterFactory(error.secondPath)(
            'error',
            ErrorMessage.DuplicatePackageName(error.pkgName, error.firstPath)
          );
        } else {
          throw error;
        }

        return undefined;
      }
    })();

    // ? Checks are performed asynchronously
    const tasks: Promise<unknown>[] = [];

    // ? Some checks are performed regardless of context
    if (context !== undefined) {
      const startedAtMonorepoRoot = context.context == 'monorepo' && !context.package;

      /**
       * Ensure the current repository has no unpublished fixup/mergeme commits.
       */
      const checkForUnpublishedFixupCommits = () => {
        tasks.push(
          (async () => {
            const status = await run('git', ['status', '-sb'], {
              reject: true,
              cwd: context.project.root
            });
            const rawReferences = status.stdout.split('\n')[0];

            // ? Repos not tracking upstream won't return "..."
            if (rawReferences.includes('...')) {
              const references = rawReferences.split(' ').at(-1) || toss(new CliError(2));
              const commits = await run(
                'git',
                ['log', '--oneline', references, '--grep', 'fixup', '--grep', 'mergeme'],
                { reject: true, cwd: context.project.root }
              );

              commits.stdout
                .split('\n')
                .filter(Boolean)
                .forEach((commit) => {
                  const sha = commit.split(' ')[0];
                  reporterFactory(`git commit ${sha}`)(
                    'error',
                    ErrorMessage.CommitNeedsFixup()
                  );
                });
            }
          })()
        );
      };

      /**
       * Shared checks across monorepo/polyrepo roots and sub-roots
       */
      const rootAndSubRootChecks = ({
        root,
        json,
        isCheckingMonorepoRoot,
        isCheckingMonorepoSubRoot
      }: {
        root: string;
        json: PackageJsonWithConfig;
        isCheckingMonorepoRoot: boolean;
        isCheckingMonorepoSubRoot: boolean;
      }) => {
        const reportPkg = reporterFactory(`${root}/package.json`);

        // ? package.json must have required fields
        Constants.globalPkgJsonRequiredFields.forEach((field) => {
          if (json[field] === undefined) {
            reportPkg('error', ErrorMessage.PackageJsonMissingKey(field));
          }
        });

        if (!isCheckingMonorepoRoot) {
          // ? package.json must have required fields (if not a monorepo root)
          Constants.nonMonoRootPkgJsonRequiredFields.forEach((field) => {
            if (json[field] === undefined) {
              reportPkg('error', ErrorMessage.PackageJsonMissingKey(field));
            }
          });

          // ? package.json must also have required fields (if not private)
          if (!json.private) {
            Constants.publicPkgJsonRequiredFields.forEach((field) => {
              if (json[field] === undefined) {
                reportPkg('error', ErrorMessage.PackageJsonMissingKey(field));
              }
            });
          }
        }

        // ? package.json has duplicate dependencies
        if (json.dependencies && json.devDependencies) {
          const devDependencies = Object.keys(json.devDependencies);
          Object.keys(json.dependencies)
            .filter((d) => devDependencies.includes(d))
            .forEach((dep) => {
              reportPkg('error', ErrorMessage.PackageJsonDuplicateDependency(dep));
            });
        }

        // ? package.json has baseline distributable contents whitelist
        if (json.files) {
          Constants.pkgJsonRequiredFiles.forEach((file) => {
            if (!json.files?.includes(file)) {
              reportPkg('error', ErrorMessage.PackageJsonMissingValue('files', file));
            }
          });
        }

        // ? package.json has standard entry points
        if (json.exports !== undefined) {
          const xports =
            !json.exports ||
            typeof json.exports == 'string' ||
            Array.isArray(json.exports)
              ? {}
              : json.exports;

          const entryPoints = Object.keys(xports);
          const distPaths = flattenPackageJsonSubpathMap({ map: xports });

          Constants.pkgJsonRequiredExports.forEach((requiredEntryPoint) => {
            if (!entryPoints.includes(requiredEntryPoint)) {
              reportPkg(
                'error',
                ErrorMessage.PackageJsonMissingEntryPoint(requiredEntryPoint)
              );
            }
          });

          // ? All package.json entry points either exist or are private (null)
          distPaths.forEach(({ filesystemPaths, exportsObjectPath }) => {
            tasks.push(
              (async () => {
                const results = await Promise.all(
                  filesystemPaths.map((path) => {
                    if (path === null) return true;
                    if (path === undefined) return false;
                    return globAsync(path, {
                      cwd: root,
                      ignore: Constants.globIgnorePatterns
                    }).then((files) => !!files.length);
                  })
                );

                if (!results.some(Boolean)) {
                  reportPkg(
                    'error',
                    ErrorMessage.PackageJsonBadEntryPoint(exportsObjectPath)
                  );
                }
              })()
            );
          });
        }

        // ? Types entry points exist
        if (json.typesVersions) {
          Object.entries(json.typesVersions).forEach(([version, spec]) => {
            Object.entries(spec || {}).forEach(([alias, paths]) => {
              tasks.push(
                (async () => {
                  const results = await Promise.all(
                    (paths || []).map((path) => {
                      return globAsync(path, {
                        cwd: root,
                        ignore: Constants.globIgnorePatterns
                      }).then((files) => !!files.length);
                    })
                  );

                  if (!results.some(Boolean)) {
                    reportPkg(
                      'error',
                      ErrorMessage.PackageJsonBadTypesEntryPoint([version, alias])
                    );
                  }
                })()
              );
            });
          });
        }

        // ? No .tsbuildinfo files allowed under dist
        tasks.push(
          (async () => {
            const files = await globAsync('dist/**/*.tsbuildinfo', {
              cwd: root,
              absolute: true,
              ignore: Constants.globIgnorePatterns
            });

            for (const filePath of files) {
              reporterFactory(filePath)(
                'error',
                ErrorMessage.IllegalItemInDirectory(`${root}/dist`)
              );
            }
          })()
        );

        // ? Has required files
        tasks.push(
          Utils.checkPathsExist(Constants.requiredFiles, root, reporterFactory, 'error')
        );

        // ? Has correct license
        if (json.license != Constants.pkgJsonLicense) {
          reportPkg(
            'warn',
            ErrorMessage.PackageJsonMissingValue('license', Constants.pkgJsonLicense)
          );
        }

        // ? Has non-experimental non-whitelisted version
        if (!isCheckingMonorepoRoot && json.version && semver.major(json.version) == 0) {
          reportPkg('warn', ErrorMessage.PackageJsonExperimentalVersion());
        }

        // ? Does not use outdated entry fields
        Constants.pkgJsonObsoleteEntryKeys.forEach((outdatedKey) => {
          if (json[outdatedKey]) {
            reportPkg('warn', ErrorMessage.PackageJsonObsoleteKey(outdatedKey));
          }
        });

        if (json.scripts) {
          const scriptKeys = Object.keys(json.scripts);

          // ? Does not use outdated script fields
          Constants.pkgJsonObsoleteScripts.forEach((outdatedKey) => {
            const isRegExp = outdatedKey instanceof RegExp;
            if (
              scriptKeys.some((key) =>
                isRegExp ? outdatedKey.test(key) : key == outdatedKey
              )
            ) {
              reportPkg('warn', ErrorMessage.PackageJsonObsoleteScript(outdatedKey));
            }
          });

          if (isCheckingMonorepoSubRoot) {
            // ? package.json in sub-root has expected script fields
            Constants.subRootScripts.forEach((script) => {
              if (!scriptKeys.includes(script)) {
                reportPkg(
                  'warn',
                  ErrorMessage.PackageJsonMissingKey(`scripts['${script}']`)
                );
              }
            });
          }
        }

        // ? Has maintained node version engines.node entries
        if (json.engines) {
          if (json.engines.node) {
            const expectedNodeEngines = getMaintainedNodeVersions({ format: 'engines' });
            if (json.engines.node != expectedNodeEngines) {
              reportPkg('warn', ErrorMessage.PackageJsonBadEngine(expectedNodeEngines));
            }
          } else {
            reportPkg('warn', ErrorMessage.PackageJsonMissingKey('engines.node'));
          }
        }

        // ? Has no pinned, dist-tag, or non-pinned pre-release dependencies
        [
          json.dependencies,
          json.devDependencies,
          json.peerDependencies,
          json.optionalDependencies
        ].forEach((depsObj) => {
          if (depsObj) {
            Object.entries(depsObj).forEach(([dep, version]) => {
              // ? Since dist-tags shouldn't start with numbers anyway...
              // ? See: https://docs.npmjs.com/adding-dist-tags-to-packages
              if (version && !Number.isNaN(Number.parseInt(version[0]))) {
                reportPkg('warn', ErrorMessage.PackageJsonPinnedDependency(dep));
              } else if (version && semver.validRange(version)) {
                if (semver.prerelease(version.replace(/^\D+/i, ''))) {
                  reportPkg(
                    'error',
                    ErrorMessage.PackageJsonNonPinnedPreReleaseDependency(dep)
                  );
                }
              } else if (
                !semver.valid(version) &&
                (!version || !version.startsWith('https://xunn.at'))
              ) {
                reportPkg('warn', ErrorMessage.PackageJsonNonSemverDependency(dep));
              }
            });
          }
        });

        // ? Has a docs entry point pointing to an existing file (if not a
        // ? monorepo root)
        if (!isCheckingMonorepoRoot) {
          const documentationEntry = json.project?.documentation?.entry;

          if (!documentationEntry) {
            reportPkg(
              'warn',
              ErrorMessage.PackageJsonMissingKey("config['plugin-build'].docs.entry")
            );
          } else {
            tasks.push(
              (async () => {
                const doesExist = await globAsync(documentationEntry, {
                  cwd: root,
                  ignore: Constants.globIgnorePatterns
                }).then((files) => !!files.length);
                if (!doesExist) {
                  reportPkg('warn', ErrorMessage.PackageJsonBadConfigDocsEntry());
                }
              })()
            );
          }
        }

        // ? README.md has standard well-configured topmatter and links
        tasks.push(
          Utils.checkReadmeFile({
            readmePath: `${root}/README.md`,
            pkgJson: json,
            reporterFactory,
            condition: isCheckingMonorepoRoot
              ? 'monorepo'
              : isCheckingMonorepoSubRoot
              ? 'subroot'
              : 'polyrepo'
          })
        );

        // ? These checks are performed ONLY IF linting a sub-root
        if (isCheckingMonorepoSubRoot) {
          // ? Has certain tsconfig files
          tasks.push(
            Utils.checkPathsExist(
              Constants.subRootTsconfigFiles,
              root,
              reporterFactory,
              'warn'
            )
          );

          // ? Has codecov flag config
          if (!json.project?.codecov?.flag) {
            reportPkg(
              'warn',
              ErrorMessage.PackageJsonMissingKey("config['plugin-build'].codecov.flag")
            );
          }

          // ? Has no "devDependencies"
          if (context.project.json.devDependencies) {
            reportPkg('warn', ErrorMessage.PackageJsonIllegalKey('devDependencies'));
          }
        }

        // ? Source files have well-formed imports
        tasks.push(Utils.checkForWellFormedImports({ pkgJson: json, reporterFactory }));
      };

      if (mode == 'link-protection') {
        // ? Check for potentially disabled links in Markdown files
        if (linkProtectionMarkdownPaths) {
          tasks.push(
            Utils.checkForPotentiallyDisabledLinks({
              rootDir,
              markdownPaths: linkProtectionMarkdownPaths,
              projectContext: context,
              reporterFactory
            })
          );
        }
      } else if (mode == 'pre-push') {
        // ? Has no unpublished fixup/mergeme commits
        checkForUnpublishedFixupCommits();
      } else {
        rootAndSubRootChecks({
          root: context.package?.root || context.project.root,
          json: context.package?.json || context.project.json,
          isCheckingMonorepoRoot: startedAtMonorepoRoot,
          isCheckingMonorepoSubRoot: !!context.package
        });

        const isNextJsProject = await (async () => {
          try {
            await access(`${context.project.root}/next.config.js`);
            return true;
          } catch {}
          return false;
        })();

        const reportPkg = reporterFactory(`${context.project.root}/package.json`);

        // ? These additional checks are performed ONLY IF linting a monorepo root
        if (startedAtMonorepoRoot) {
          // ? Has certain tsconfig files
          tasks.push(
            Utils.checkPathsExist(
              Constants.monorepoRootTsconfigFiles,
              context.project.root,
              reporterFactory,
              'warn'
            )
          );

          // ? Has no "broken" packages (workspaces missing a package.json file)
          if (context.project.packages.broken.length) {
            context.project.packages.broken.forEach((pkgRoot) =>
              reporterFactory(`${pkgRoot}/package.json`)(
                'error',
                ErrorMessage.MissingFile()
              )
            );
          }

          // ? Has a "name" field (the case where !private is already covered)
          if (context.project.json.private && !context.project.json.name) {
            reportPkg('warn', ErrorMessage.PackageJsonMissingKey('name'));
          }

          // ? Is private
          if (context.project.json.private === undefined) {
            reportPkg('warn', ErrorMessage.PackageJsonMissingKey('private'));
          } else if (context.project.json.private !== true) {
            reportPkg('warn', ErrorMessage.PackageJsonMissingValue('private', 'true'));
          }

          if (context.project.json.scripts) {
            const scriptKeys = Object.keys(context.project.json.scripts);

            // ? package.json has expected script fields
            Constants.monorepoRootScripts.forEach((script) => {
              if (!scriptKeys.includes(script)) {
                reportPkg(
                  'warn',
                  ErrorMessage.PackageJsonMissingKey(`scripts['${script}']`)
                );
              }
            });

            if (isNextJsProject) {
              // ? package.json has expected script fields
              Constants.nextjsProjectRootAdditionalScripts.forEach((script) => {
                if (!scriptKeys.includes(script)) {
                  reportPkg(
                    'warn',
                    ErrorMessage.PackageJsonMissingKey(`scripts['${script}']`)
                  );
                }
              });
            }
          }

          if (!isNextJsProject) {
            // ? Has no "dependencies" field
            if (context.project.json.dependencies) {
              reportPkg('warn', ErrorMessage.PackageJsonIllegalKey('dependencies'));
            }

            // ? Has no non-whitelisted "version" field
            if (
              context.project.json.version &&
              !Constants.pkgVersionWhitelist.includes(
                context.project.json
                  .version as (typeof Constants.pkgVersionWhitelist)[number]
              )
            ) {
              reportPkg('warn', ErrorMessage.PackageJsonIllegalKey('version'));
            }
          }

          // ? Recursively lint all sub-roots
          context.project.packages.all.forEach(({ root, json }) => {
            rootAndSubRootChecks({
              root,
              json,
              isCheckingMonorepoRoot: false,
              isCheckingMonorepoSubRoot: true
            });
          });
        }
        // ? These additional checks are performed ONLY IF linting a polyrepo root
        else if (!context.package) {
          // ? Has certain tsconfig files
          tasks.push(
            Utils.checkPathsExist(
              Constants.polyrepoTsconfigFiles,
              context.project.root,
              reporterFactory,
              'warn'
            )
          );

          if (context.project.json.scripts) {
            const scriptKeys = Object.keys(context.project.json.scripts);

            // ? package.json has expected script fields
            Constants.polyrepoScripts.forEach((script) => {
              if (!scriptKeys.includes(script)) {
                reportPkg(
                  'warn',
                  ErrorMessage.PackageJsonMissingKey(`scripts['${script}']`)
                );
              }
            });

            if (isNextJsProject) {
              // ? package.json has expected script fields
              Constants.nextjsProjectRootAdditionalScripts.forEach((script) => {
                if (!scriptKeys.includes(script)) {
                  reportPkg(
                    'warn',
                    ErrorMessage.PackageJsonMissingKey(`scripts['${script}']`)
                  );
                }
              });
            }
          }
        }

        // ? These additional checks are performed ONLY IF NOT linting a sub-root
        if (!context.package) {
          const root = context.project.root;

          // ? Has required files
          tasks.push(
            Utils.checkPathsExist(
              Constants.repoRootRequiredFiles,
              root,
              reporterFactory,
              'warn'
            )
          );

          // ? Has standard directories
          tasks.push(
            Utils.checkPathsExist(
              Constants.repoRootRequiredDirectories,
              root,
              reporterFactory,
              'warn',
              'MissingDirectory'
            )
          );

          // ? Has release.config.js if not private
          if (!context.project.json.private) {
            tasks.push(
              Utils.checkPathsExist(['release.config.js'], root, reporterFactory, 'warn')
            );
          }

          // ? SECURITY.md has standard well-configured topmatter and links and is
          // ? consistent with blueprints
          tasks.push(
            Utils.checkStandardMdFile({
              mdPath: `${root}/SECURITY.md`,
              pkgJson: context.project.json,
              standardTopmatter: Constants.markdownSecurityStandardTopmatter,
              standardLinks: Constants.markdownSecurityStandardLinks,
              reporterFactory
            })
          );

          // ? SUPPORT.md has standard well-configured topmatter and links and is
          // ? consistent with blueprints
          tasks.push(
            Utils.checkStandardMdFile({
              mdPath: `${root}/.github/SUPPORT.md`,
              pkgJson: context.project.json,
              standardTopmatter: Constants.markdownSupportStandardTopmatter,
              standardLinks: Constants.markdownSupportStandardLinks,
              reporterFactory
            })
          );

          // ? CONTRIBUTING.md has standard well-configured topmatter and links
          // ? and is consistent with blueprints
          tasks.push(
            Utils.checkStandardMdFile({
              mdPath: `${root}/CONTRIBUTING.md`,
              pkgJson: context.project.json,
              standardTopmatter: null,
              standardLinks: Constants.markdownContributingStandardLinks,
              reporterFactory
            })
          );

          // ? CODE_OF_CONDUCT.md is consistent with blueprints
          tasks.push(
            Utils.checkStandardMdFile({
              mdPath: `${root}/.github/CODE_OF_CONDUCT.md`,
              pkgJson: context.project.json,
              standardTopmatter: null,
              standardLinks: null,
              reporterFactory
            })
          );

          // ? PULL_REQUEST_TEMPLATE.md is consistent with blueprints
          tasks.push(
            Utils.checkStandardMdFile({
              mdPath: `${root}/.github/PULL_REQUEST_TEMPLATE.md`,
              pkgJson: context.project.json,
              standardTopmatter: null,
              standardLinks: null,
              reporterFactory
            })
          );

          // ? BUG_REPORT.md is consistent with blueprints
          tasks.push(
            Utils.checkStandardMdFile({
              mdPath: `${root}/.github/ISSUE_TEMPLATE/BUG_REPORT.md`,
              pkgJson: context.project.json,
              standardTopmatter: null,
              standardLinks: null,
              reporterFactory
            })
          );

          // ? FEATURE_REQUEST.md is consistent with blueprints
          tasks.push(
            Utils.checkStandardMdFile({
              mdPath: `${root}/.github/ISSUE_TEMPLATE/FEATURE_REQUEST.md`,
              pkgJson: context.project.json,
              standardTopmatter: null,
              standardLinks: null,
              reporterFactory
            })
          );

          // ? config.yml is consistent with blueprints
          tasks.push(
            Utils.checkStandardMdFile({
              mdPath: `${root}/.github/ISSUE_TEMPLATE/config.yml`,
              pkgJson: context.project.json,
              standardTopmatter: null,
              standardLinks: null,
              reporterFactory
            })
          );

          // ? dependabot.yml is consistent with blueprints
          tasks.push(
            Utils.checkStandardMdFile({
              mdPath: `${root}/.github/dependabot.yml`,
              pkgJson: context.project.json,
              standardTopmatter: null,
              standardLinks: null,
              reporterFactory
            })
          );
        }

        // ? Check for potentially disabled links in Markdown files
        if (linkProtectionMarkdownPaths) {
          tasks.push(
            Utils.checkForPotentiallyDisabledLinks({
              rootDir,
              markdownPaths: linkProtectionMarkdownPaths,
              projectContext: context,
              reporterFactory
            })
          );
        }

        // ? Has no unpublished fixup/mergeme commits
        checkForUnpublishedFixupCommits();
      }
    }

    // ? Wait for checks to finish
    await Promise.all(tasks);

    return {
      success: errorCount == 0,
      output: Object.entries(outputTree).reduce<string>(
        (output, [filename, messages]) => {
          return `${output}\n\n${chalk.underline(filename)}\n  ${messages.join(
            '\n  '
          )}`.trim();
        },
        ''
      ),
      summary:
        errorCount + warnCount
          ? `${errorCount} error${errorCount != 1 ? 's' : ''}, ${warnCount} warning${
              warnCount != 1 ? 's' : ''
            }`
          : 'no issues'
    };
  } catch (error) {
    throw new Error(`project linting failed: ${error}`, { cause: error as Error });
  }
}

/**
 * Performs project-wide type checking with the TypeScript `tsc` compiler.
 */
export async function runTypescriptLinter({
  rootDir,
  tsconfig
}: {
  /**
   * The project root directory containing a tsconfig.lint.json configuration
   * file.
   */
  rootDir: string;
  /**
   * An absolute or relative path to a TypeScript tsconfig.json configuration
   * file.
   */
  tsconfig: string;
}): UnifiedReturnType {
  const tscOutput = await run(
    'npx',
    ['--no-install', 'tsc', '--pretty', '--project', tsconfig],
    {
      cwd: rootDir,
      all: true
    }
  );

  const lastLine =
    tscOutput.all
      ?.trimEnd()
      .split('\n')
      // TODO: filter smarter (fix TypeScript output bug)
      .filter((line) => Utils.ignoreEmptyAndDebugLines(line))
      .at(-1) || '';

  const lastLineMeta =
    /Found ((?<errors>\d+) errors?(, )?)?((?<warnings>\d+) warning)?/.exec(lastLine);

  return {
    success: tscOutput.code == 0,
    output: tscOutput.all || tscOutput.shortMessage,
    summary: Utils.summarizeLinterOutput(tscOutput.code, lastLine, lastLineMeta)
  };
}

/**
 * Lints the contents of the specified source files using ESLint.
 */
export async function runEslintLinter({
  sourcePaths,
  rootDir,
  tsconfig
}: {
  /**
   * Absolute or relative paths that resolve to one or more directories
   * containing source files, or to one or more source files themselves.
   */
  sourcePaths: string[];
  /**
   * The project root directory 1) containing ESLint and tsconfig.lint.json
   * configuration files and 2) that relative paths and node globs are resolved
   * against.
   */
  rootDir: string;
  /**
   * An absolute or relative path to a TypeScript tsconfig.json configuration
   * file.
   */
  tsconfig: string;
}): UnifiedReturnType {
  const eslintOutput = await run(
    'npx',
    [
      '--no-install',
      'eslint',
      '--color',
      `--parser-options=project:${tsconfig}`,
      ...sourcePaths
    ],
    { cwd: rootDir, all: true }
  );

  let output = eslintOutput.all?.trimEnd() || '';

  // TODO: redo this... does this even work?
  // ? Split this into two so we can save the knowledge from this step for later
  const lastLinesWithContent = stripAnsi(output)
    .split('\n')
    .filter((line) => Utils.ignoreEmptyAndDebugLines(line));

  const lastLine =
    lastLinesWithContent.filter((line) => !line.includes('--fix')).at(-1) || '';

  const lastLineMeta =
    /problems? \(((?<errors>\d+) errors?(, )?)?((?<warnings>\d+) warning)?/.exec(
      lastLine
    );

  // ? Use slice to get rid of empty newlines surrounded by ansi codes and
  // ? other undesirable lines that should not appear at the start of output
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const indexOfNewLine = output.indexOf('\n');
    // ? Stop deleting on the first line that isn't empty or ignorable
    if (
      indexOfNewLine < 0 ||
      Utils.ignoreEmptyAndDebugLines(output.slice(0, indexOfNewLine))
    ) {
      break;
    } else {
      // ? DELETE!
      output = output.slice(indexOfNewLine + 1);
    }
  }

  // ? Use slice to get rid of empty newlines surrounded by ansi codes and
  // ? other undesirable lines that should not appear at the end of output
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const lastIndexOfNewLine = output.lastIndexOf('\n');
    // ? Stop deleting on the first line that isn't empty or ignorable
    if (
      lastIndexOfNewLine < 0 ||
      Utils.ignoreEmptyAndDebugLines(output.slice(0, lastIndexOfNewLine))
    ) {
      break;
    } else {
      // ? DELETE!
      output = output.slice(0, lastIndexOfNewLine + 1);
    }
  }

  return {
    success: eslintOutput.code == 0,
    output: output || eslintOutput.shortMessage,
    summary: Utils.summarizeLinterOutput(eslintOutput.code, lastLine, lastLineMeta)
  };
}

/**
 * Lints the contents of the specified Markdown files using Remark.
 */
export async function runRemarkLinter({
  markdownPaths,
  rootDir
}: {
  /**
   * Absolute paths, relative paths, and/or globs that resolve to one or more
   * markdown files.
   */
  markdownPaths: string[];
  /**
   * The project root directory that relative paths and node globs are resolved
   * against.
   */
  rootDir: string;
}): UnifiedReturnType {
  const remarkOutput = await run(
    'npx',
    [
      '--no-install',
      'remark',
      '--quiet',
      '--use',
      'gfm',
      '--use',
      'frontmatter',
      '--use',
      'lint-final-newline',
      '--use',
      'lint-no-auto-link-without-protocol',
      '--use',
      'lint-no-blockquote-without-marker',
      '--use',
      'lint-ordered-list-marker-style',
      '--use',
      'lint-hard-break-spaces',
      '--use',
      'lint-no-duplicate-definitions',
      '--use',
      'lint-no-heading-content-indent',
      '--use',
      'lint-no-inline-padding',
      '--use',
      'lint-no-undefined-references',
      '--use',
      'lint-no-unused-definitions',
      '--use',
      'validate-links',
      // ? We specify the paths twice here because, without more than one .md
      // ? file specified, remark will shit all over stdout for whatever reason.
      ...markdownPaths,
      ...markdownPaths
    ],
    { cwd: rootDir, all: true }
  );

  const lastLine =
    stripAnsi(remarkOutput.all?.trimEnd() || '')
      .split('\n')
      .filter((line) => Utils.ignoreEmptyAndDebugLines(line))
      .at(-1) || '';

  const lastLineMeta =
    /(?:(?<errors1>\d+) errors?, .*?(?<warnings1>\d+) warning)|(?:(?<errors2>\d+) errors?)|(?:(?<warnings2>\d+) warning)/.exec(
      lastLine
    );

  return {
    success: remarkOutput.code == 0,
    output: remarkOutput.all || remarkOutput.shortMessage,
    summary: Utils.summarizeLinterOutput(remarkOutput.code, lastLine, {
      groups: {
        errors: lastLineMeta?.groups?.errors1 || lastLineMeta?.groups?.errors2,
        warnings: lastLineMeta?.groups?.warnings1 || lastLineMeta?.groups?.warnings2
      }
    } as unknown as RegExpExecArray)
  };
}
