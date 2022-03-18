import { readFile } from 'fs/promises';
import { ErrorMessage } from '../errors';

import {
  markdownReadmeStandardLinks,
  markdownReadmeStandardTopmatter
} from '../constants';

import type {
  Condition,
  StandardUrlParams,
  StandardTopmatter,
  StandardLinks
} from '../constants';

import type { ReporterFactory } from './index';
import type { PackageJson } from 'type-fest';

export type Definition = import('mdast-util-from-markdown/lib').Definition;

/**
 * Accepts an path to a markdown file and returns an mdast abstract syntax tree.
 */
export async function getAst(path: string) {
  try {
    return (
      await import(/* webpackIgnore: true */ 'mdast-util-from-markdown')
    ).fromMarkdown(await readFile(path));
  } catch (e) {
    if (!(e as Error).message.includes('ENOENT')) {
      throw e;
    }
  }
}

/**
 * Accepts a package.json object and returns a `StandardUrlParams` object or
 * `null` if the package.json object is missing the `"name"` or `"repository"`
 * fields.
 */
export function getUrlParams(json: PackageJson): StandardUrlParams | null {
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
    flag: (json.config?.codecov as Record<string, string>)?.flag
  };
}

/**
 * Checks a standard markdown file (i.e. SECURITY.md, CONTRIBUTING.md,
 * .github/SUPPORT.md) at `mdPath` for correctness given the current
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
  pkgJson: PackageJson;
  standardTopmatter: StandardTopmatter | null;
  standardLinks: StandardLinks;
  reporterFactory: ReporterFactory;
}) {
  void mdPath, pkgJson, standardTopmatter, standardLinks, reporterFactory;
  // TODO: more generic version of the checkReadmeFile function

  // TODO: also check startsWith blueprint file contents; throw an error if
  // TODO: blueprint doesn't exist
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
  pkgJson: PackageJson;
  reporterFactory: ReporterFactory;
  condition: Condition;
}) {
  const reportReadme = reporterFactory(readmePath);
  const readmeAst = await getAst(readmePath);

  if (readmeAst) {
    const urlParams = getUrlParams(pkgJson);

    if (!urlParams) {
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
        topmatter.children.forEach((badgeLinkRef) => {
          if (badgeLinkRef.type == 'linkReference') {
            if (
              !badgeLinkRef.label ||
              badgeLinkRef.children.length != 1 ||
              badgeLinkRef.children[0].type != 'imageReference'
            ) {
              reportReadme(
                'warn',
                ErrorMessage.MarkdownInvalidSyntaxLinkRef(badgeLinkRef.label)
              );
            } else {
              let topmatterIndex = Infinity;
              const badgeImageRef = badgeLinkRef.children[0];
              const [badgeKey, badgeSpec] =
                Object.entries(markdownReadmeStandardTopmatter.badge).find(
                  ([, spec], ndx) => {
                    topmatterIndex = ndx;
                    return spec.label == badgeImageRef.label;
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

                  const linkRefDef = readmeAst.children.find(
                    (child): child is Definition =>
                      child.type == 'definition' && child.label == badgeLinkRef.label
                  );

                  const imageRefDef = readmeAst.children.find(
                    (child): child is Definition =>
                      child.type == 'definition' && child.label == badgeImageRef.label
                  );

                  if (badgeLinkRef.label != badgeSpec.link.label) {
                    reportReadme(
                      'warn',
                      ErrorMessage.MarkdownBadTopmatterLinkRefLabel(
                        badgeLinkRef.label,
                        badgeSpec.link.label
                      )
                    );
                  }

                  if (badgeImageRef.alt != badgeSpec.alt) {
                    reportReadme(
                      'warn',
                      ErrorMessage.MarkdownBadTopmatterImageRefAlt(
                        badgeImageRef.label,
                        badgeSpec.alt
                      )
                    );
                  }

                  if (!linkRefDef) {
                    reportReadme(
                      'warn',
                      ErrorMessage.MarkdownBadTopmatterMissingLinkRefDef(
                        badgeLinkRef.label
                      )
                    );
                  } else if (!imageRefDef) {
                    reportReadme(
                      'warn',
                      ErrorMessage.MarkdownBadTopmatterMissingImageRefDef(
                        badgeImageRef.label
                      )
                    );
                  } else {
                    if (urlParams) {
                      if (imageRefDef.title != badgeSpec.title) {
                        reportReadme(
                          'warn',
                          ErrorMessage.MarkdownBadTopmatterImageRefDefTitle(
                            badgeImageRef.label,
                            badgeSpec.title
                          )
                        );
                      }

                      if (imageRefDef.url != badgeSpec.url(urlParams)) {
                        reportReadme(
                          'warn',
                          ErrorMessage.MarkdownBadTopmatterImageRefDefUrl(
                            badgeImageRef.label,
                            badgeSpec.url(urlParams)
                          )
                        );
                      }

                      if (linkRefDef.url != badgeSpec.link.url(urlParams)) {
                        reportReadme(
                          'warn',
                          ErrorMessage.MarkdownBadTopmatterLinkRefDefUrl(
                            linkRefDef.label,
                            badgeSpec.link.url(urlParams)
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
                    badgeImageRef.label || badgeLinkRef.label
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

    if (urlParams) {
      Object.entries(markdownReadmeStandardLinks).forEach(([, linkSpec]) => {
        const link = readmeAst.children.find((child): child is Definition => {
          return child.type == 'definition' && child.label == linkSpec.label;
        });

        if (!link) {
          reportReadme('warn', ErrorMessage.MarkdownMissingLink(linkSpec.label));
        } else {
          const url = linkSpec.url(urlParams);
          if (link.url != url) {
            reportReadme('warn', ErrorMessage.MarkdownBadLink(linkSpec.label, url));
          }
        }
      });
    }
  }
}
