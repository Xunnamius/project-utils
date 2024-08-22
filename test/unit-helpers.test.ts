import * as util from 'pkgverse/core/src/helpers';
import * as errors from 'pkgverse/core/src/errors';

describe('::ensurePathIsAbsolute', () => {
  it('throws a PathIsNotAbsoluteError error if path is not absolute', async () => {
    expect.hasAssertions();

    expect(() => util.ensurePathIsAbsolute({ path: '/absolute/path' })).not.toThrow();
    expect(() => util.ensurePathIsAbsolute({ path: 'relative/path' })).toThrowError(
      errors.PathIsNotAbsoluteError
    );
    expect(() => util.ensurePathIsAbsolute({ path: './relative/path' })).toThrowError(
      errors.PathIsNotAbsoluteError
    );
  });
});
