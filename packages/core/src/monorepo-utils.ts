import { sep } from 'path';

export function getRunContext({ cwd }: { cwd: string } = { cwd: process.cwd() }) {
  const path = cwd.split(sep).slice(-2);
  const [parentDir, basename] = path;

  return parentDir != 'packages'
    ? ({
        context: 'polyrepo',
        basename: null,
        path: null
      } as const)
    : ({
        context: 'monorepo',
        basename,
        path: path.join(sep)
      } as const);
}
