import { basename } from 'node:path';
import { readFile } from 'node:fs/promises';
import { ErrorMessage } from '../errors';

import {
  markdownReadmeStandardLinks,
  markdownReadmeStandardTopmatter,
  type Condition,
  type StandardUrlParameters,
  type StandardTopmatter,
  type StandardLinks
} from '../constants';

import type { ReporterFactory } from './index';
import type { PackageJsonWithConfig } from 'types/global';

export type Root = import('mdast-util-from-markdown/lib').Root;
export type Definition = import('mdast-util-from-markdown/lib').Definition;

/**
 * Accepts an path to a markdown file and returns an mdast abstract syntax tree.
 */
export async function getAst(path: string) {
  try {
    return (
      await import(/* webpackIgnore: true */ 'mdast-util-from-markdown')
    ).fromMarkdown(await readFile(path));
  } catch (error) {
    if (!(error as Error).message.includes('ENOENT')) {
      throw error;
    }
  }
}

/**
 * Accepts a package.json object and returns a `StandardUrlParams` object or
 * `null` if the package.json object is missing the `"name"` or `"repository"`
 * fields.
 */
export function getUrlParameters(
  json: PackageJsonWithConfig
): StandardUrlParameters | null {
  const match = /^https:\/\/github.com\/(?<user>[^/]+)\/(?<repo>[^/]+)/.exec(
    typeof json.repository == 'string' ? json.repository : json.repository?.url || ''
  );

  if (!match?.groups?.repo || !match?.groups?.user || !json.name) {
    return null;
  }

  return {
    pkgName: json.name,
    repo: match.groups.repo,
    user: match.groups.user,
    flag: json.project?.codecov?.flag
  };
}

/**
 * A helper function that checks a Markdown AST for the existence of a set of
 * "standard" link references.
 */
export function checkStandardLinks({
  mdAst,
  urlParams,
  standardLinks,
  reporter
}: {
  mdAst: Root;
  urlParams: StandardUrlParameters;
  standardLinks: StandardLinks;
  reporter: ReturnType<ReporterFactory>;
}) {
  Object.entries(standardLinks).forEach(([, linkSpec]) => {
    const link = mdAst.children.find((child): child is Definition => {
      return child.type == 'definition' && child.label == linkSpec.label;
    });

    if (!link) {
      reporter('warn', ErrorMessage.MarkdownMissingLink(linkSpec.label));
    } else {
      const url = linkSpec.url(urlParams);
      if (link.url != url) {
        reporter('warn', ErrorMessage.MarkdownBadLink(linkSpec.label, url));
      }
    }
  });
}

/**
 * Checks a standard markdown file at `mdPath` for correctness given the current
 * package.json data (`pkgJson`), reporting any issues via the `reporterFactory`
 * instance.
 */
export async function checkStandardMdFile({
  mdPath,
  pkgJson,
  standardTopmatter,
  standardLinks,
  reporterFactory
}: {
  mdPath: string;
  pkgJson: PackageJsonWithConfig;
  standardTopmatter: StandardTopmatter | null;
  standardLinks: StandardLinks | null;
  reporterFactory: ReporterFactory;
}) {
  const isAdvancedCheck = !!(standardTopmatter || standardLinks);
  let mdFile: string | undefined;

  try {
    mdFile = await readFile(mdPath, {
      encoding: 'utf8'
    });
  } catch (error) {
    if (!(error as Error).message.includes('ENOENT')) {
      throw error;
    }
  }

  if (mdFile !== undefined) {
    const reportMdFile = reporterFactory(mdPath);
    const blueprintBasename = `${basename(mdPath).toLowerCase()}.txt`;
    const blueprint = await readFile(`${__dirname}/../blueprints/${blueprintBasename}`, {
      encoding: 'utf8'
    });

    if (!(isAdvancedCheck ? mdFile.startsWith(blueprint) : mdFile == blueprint)) {
      reportMdFile('warn', ErrorMessage.MarkdownBlueprintMismatch(blueprintBasename));
    }

    if (isAdvancedCheck) {
      const mdAst = await getAst(mdPath);

      if (mdAst) {
        const urlParameters = getUrlParameters(pkgJson);

        if (!urlParameters) {
          reportMdFile('warn', ErrorMessage.PackageJsonMissingKeysCheckSkipped());
        } else {
          if (standardTopmatter) {
            Object.entries(standardTopmatter).forEach(([, badgeSpec]) => {
              const badge = mdAst.children.find((child): child is Definition => {
                return child.type == 'definition' && child.label == badgeSpec.label;
              });

              if (!badge) {
                reportMdFile(
                  'warn',
                  ErrorMessage.MarkdownBadTopmatterMissingImageRefDef(badgeSpec.label)
                );
              } else {
                const badgeUrl = badgeSpec.url(urlParameters);

                if (badge.url != badgeUrl) {
                  reportMdFile(
                    'warn',
                    ErrorMessage.MarkdownBadTopmatterImageRefDefUrl(badge.label, badgeUrl)
                  );
                }

                if (badge.title != badgeSpec.title) {
                  reportMdFile(
                    'warn',
                    ErrorMessage.MarkdownBadTopmatterImageRefDefTitle(
                      badge.label,
                      badgeSpec.title
                    )
                  );
                }
              }

              const link = mdAst.children.find((child): child is Definition => {
                return child.type == 'definition' && child.label == badgeSpec.link.label;
              });

              if (!link) {
                reportMdFile(
                  'warn',
                  ErrorMessage.MarkdownBadTopmatterMissingLinkRefDef(badgeSpec.link.label)
                );
              } else {
                const linkUrl = badgeSpec.link.url(urlParameters);
                if (link.url != linkUrl) {
                  reportMdFile(
                    'warn',
                    ErrorMessage.MarkdownBadTopmatterLinkRefDefUrl(link.label, linkUrl)
                  );
                }
              }
            });
          }

          if (standardLinks) {
            checkStandardLinks({
              mdAst,
              urlParams: urlParameters,
              standardLinks,
              reporter: reportMdFile
            });
          }
        }
      }
    }
  }
}

/**
 * Checks a README.md file at `readmePath` for correctness given the current
 * runtime context (`condition`) and package.json data (`pkgJson`), reporting
 * any issues via the `reporterFactory` instance.
 */
export async function checkReadmeFile({
  readmePath,
  pkgJson,
  reporterFactory,
  condition
}: {
  readmePath: string;
  pkgJson: PackageJsonWithConfig;
  reporterFactory: ReporterFactory;
  condition: Condition;
}) {
  const reportReadme = reporterFactory(readmePath);
  const readmeAst = await getAst(readmePath);

  if (readmeAst) {
    const urlParameters = getUrlParameters(pkgJson);

    if (!urlParameters) {
      reportReadme('warn', ErrorMessage.PackageJsonMissingKeysCheckSkipped());
    }

    const startIndex = readmeAst.children.findIndex(
      (child) =>
        child.type == 'html' &&
        child.value == markdownReadmeStandardTopmatter.comment.start
    );

    const startChild = readmeAst.children[startIndex] || {};
    const endChild = readmeAst.children[startIndex + 2] || {};
    const topmatter = readmeAst.children[startIndex + 1] || {};

    if (
      startChild.type != 'html' ||
      startChild.value != markdownReadmeStandardTopmatter.comment.start
    ) {
      reportReadme('warn', ErrorMessage.MarkdownInvalidSyntaxOpeningComment());
    } else if (
      endChild.type != 'html' ||
      endChild.value != markdownReadmeStandardTopmatter.comment.end
    ) {
      reportReadme('warn', ErrorMessage.MarkdownInvalidSyntaxClosingComment());
    } else {
      let handled = false;
      let wellOrdered = true;
      const seenBadgeKeys = [] as string[];

      if (topmatter.type == 'paragraph') {
        topmatter.children.forEach((badgeLinkReference) => {
          if (badgeLinkReference.type == 'linkReference') {
            if (
              !badgeLinkReference.label ||
              badgeLinkReference.children.length != 1 ||
              badgeLinkReference.children[0].type != 'imageReference'
            ) {
              reportReadme(
                'warn',
                ErrorMessage.MarkdownInvalidSyntaxLinkRef(badgeLinkReference.label)
              );
            } else {
              let topmatterIndex = Number.POSITIVE_INFINITY;
              const badgeImageReference = badgeLinkReference.children[0];
              const [badgeKey, badgeSpec] =
                Object.entries(markdownReadmeStandardTopmatter.badge).find(
                  ([, spec], ndx) => {
                    topmatterIndex = ndx;
                    return spec.label == badgeImageReference.label;
                  }
                ) || [];

              handled = true;

              if (badgeKey && badgeSpec) {
                if (badgeSpec.conditions.includes(condition)) {
                  wellOrdered =
                    wellOrdered &&
                    Object.keys(markdownReadmeStandardTopmatter.badge).indexOf(
                      seenBadgeKeys.at(-1) || ''
                    ) < topmatterIndex;

                  seenBadgeKeys.push(badgeKey);

                  const linkReferenceDefinition = readmeAst.children.find(
                    (child): child is Definition =>
                      child.type == 'definition' &&
                      child.label == badgeLinkReference.label
                  );

                  const imageReferenceDefinition = readmeAst.children.find(
                    (child): child is Definition =>
                      child.type == 'definition' &&
                      child.label == badgeImageReference.label
                  );

                  if (badgeLinkReference.label != badgeSpec.link.label) {
                    reportReadme(
                      'warn',
                      ErrorMessage.MarkdownBadTopmatterLinkRefLabel(
                        badgeLinkReference.label,
                        badgeSpec.link.label
                      )
                    );
                  }

                  if (badgeImageReference.alt != badgeSpec.alt) {
                    reportReadme(
                      'warn',
                      ErrorMessage.MarkdownBadTopmatterImageRefAlt(
                        badgeImageReference.label,
                        badgeSpec.alt
                      )
                    );
                  }

                  if (!linkReferenceDefinition) {
                    reportReadme(
                      'warn',
                      ErrorMessage.MarkdownBadTopmatterMissingLinkRefDef(
                        badgeLinkReference.label
                      )
                    );
                  } else if (!imageReferenceDefinition) {
                    reportReadme(
                      'warn',
                      ErrorMessage.MarkdownBadTopmatterMissingImageRefDef(
                        badgeImageReference.label
                      )
                    );
                  } else {
                    if (urlParameters) {
                      if (imageReferenceDefinition.title != badgeSpec.title) {
                        reportReadme(
                          'warn',
                          ErrorMessage.MarkdownBadTopmatterImageRefDefTitle(
                            badgeImageReference.label,
                            badgeSpec.title
                          )
                        );
                      }

                      if (imageReferenceDefinition.url != badgeSpec.url(urlParameters)) {
                        reportReadme(
                          'warn',
                          ErrorMessage.MarkdownBadTopmatterImageRefDefUrl(
                            badgeImageReference.label,
                            badgeSpec.url(urlParameters)
                          )
                        );
                      }

                      if (
                        linkReferenceDefinition.url != badgeSpec.link.url(urlParameters)
                      ) {
                        reportReadme(
                          'warn',
                          ErrorMessage.MarkdownBadTopmatterLinkRefDefUrl(
                            linkReferenceDefinition.label,
                            badgeSpec.link.url(urlParameters)
                          )
                        );
                      }
                    }
                  }
                }
              } else {
                reportReadme(
                  'warn',
                  ErrorMessage.MarkdownUnknownTopmatterItem(
                    badgeImageReference.label || badgeLinkReference.label
                  )
                );
              }
            }
          }
        });
      }

      if (!handled) {
        reportReadme('warn', ErrorMessage.MarkdownMissingTopmatter());
      } else {
        if (!wellOrdered) {
          reportReadme('warn', ErrorMessage.MarkdownTopmatterOutOfOrder());
        }

        Object.entries(markdownReadmeStandardTopmatter.badge)
          .filter(
            ([k, v]) => !seenBadgeKeys.includes(k) && v.conditions.includes(condition)
          )
          .forEach(([, { label }]) => {
            reportReadme('warn', ErrorMessage.MarkdownMissingTopmatterItem(label));
          });
      }
    }

    if (urlParameters) {
      checkStandardLinks({
        mdAst: readmeAst,
        urlParams: urlParameters,
        standardLinks: markdownReadmeStandardLinks,
        reporter: reportReadme
      });
    }
  }
}
