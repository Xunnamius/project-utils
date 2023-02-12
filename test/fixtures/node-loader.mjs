import path from 'node:path';

const splitUrlRegex = /^.*\bnode_modules(?:\/|\\)dummy-[^-]+-pkg(?:\/|\\)(.*)$/;
const splitSubUrlRegex = /^.*\bnode_modules(?:\/|\\)(.*)$/;

export async function resolve(specifier, context, nextResolver) {
  // ? Remove default conditions
  context.conditions = context.conditions.slice(3);

  const resolved = await nextResolver(specifier, context, nextResolver);
  const { url } = resolved;
  let result = '<error>';

  // ? Ensure OS-agnostic relative path (or package-relative path) is returned

  const externalMatches = url.match(splitUrlRegex);

  if (externalMatches !== null) {
    result = externalMatches[1];
    const internalMatches = result.match(splitSubUrlRegex);

    if (internalMatches !== null) {
      result = internalMatches[1].replace(/(\/|\\)index\.\w+$/, '');
    } else {
      result = `./${result}`;
    }
  }

  console.log(`${specifier} => ${result.replace('\\', '/')}`);
  return resolved;
}
