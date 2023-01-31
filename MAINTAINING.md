# Maintaining

This is documentation for maintainers of this project adapted from
[@kentcdodds][x-external-kentcdodds]'s document of the same name.

## Code of Conduct

Please [review][x-repo-coc], understand, and be an example of it. Violations of
the code of conduct are taken seriously, even (especially) for maintainers.

## Issues

We want to support and build the community. We do that best by helping people
learn to solve their own problems. We have an issue template and hopefully most
folks follow it. If it's not clear what the issue is, invite them to create a
[minimal reproducible example][x-external-mre] (sometimes called a "repro") of
what they're trying to accomplish or the bug they think they've found.

Once it's determined that a code change is necessary, point people to
[CONTRIBUTING.md][x-repo-contributing] and invite them to make a pull request.
If they're the one who needs the feature, they're the one who can build it. If
they need some hand holding and you have time to lend a hand, please do so. It's
an investment into another human being, and an investment into a potential
maintainer.

Remember that this is open source, so the code is not yours, it's ours. If
someone needs a change in the codebase, you don't have to make it happen
yourself. Commit as much time to the project as you want/need to. Nobody can ask
any more of you than that.

## Pull Requests

As a maintainer, you're fine to make your branches on the main repo or on your
own fork. Either way is fine.

When we receive a pull request, a GitHub Actions build is kicked off
automatically (see [`.github/workflows`][x-repo-workflows]). We avoid merging
anything that fails the Actions workflow.

Please review PRs and focus on the code rather than the individual. You never
know when this is someone's first ever PR and we want their experience to be as
positive as possible, so be uplifting and constructive.

When you merge a pull request **that <u>isn't</u> coming a [release
branch][x-projector-releaseconfig] like `main` or `canary`**, most of the time
you should use the [rebase and merge][x-external-about-prs] feature. This keeps
our git history clean. **On the other hand, when dealing with release branches:
[squashing][x-external-release-failure-2], [rebasing, and force
pushes][x-external-release-failure-1] must <u>never ever</u> happen!** If
commits need to be fixed up or their messages adjusted, maintainers should force
push new commits with adjusted messages to the PR branch before merging it in.

The [squash and merge][x-external-squashmerge] feature can also be used, but
keep in mind that squashing commits will likely damage the
[generated][x-external-conventional-changelog]
[CHANGELOG.md][x-external-conventional-commits], hinder
[bisection][x-external-bisect], and result in [non-atomic
commits][x-external-atomic], so use it sparingly.

## Release

Our releases are automatic. They happen whenever code lands into `main`. A
GitHub Actions build gets kicked off and, if it's successful, a tool called
[`semantic-release`][x-external-semantic-release] is used to automatically
publish a new release to npm and GitHub along with an updated changelog. It is
only able to determine the version and whether a release is necessary by the git
commit messages. With this in mind, **please brush up on [the commit message
convention][x-external-commit] which drives our releases.**

> **IMPORTANT!** Please make sure that commit messages do NOT contain the words
> "BREAKING CHANGE" in them unless we want to push a major version. That means
> do not include lines like "BREAKING CHANGE: None", which would end up
> releasing a new major version. **Do not do this!**

### Manual Releases

This project has an automated release set up. That means things are only
released when there are useful changes in the code that justify a release. See
[the release rules][x-projector-releaserules] for a list of commit types that
trigger releases.

However, sometimes things get messed up (e.g. CI workflow / GitHub Actions
breaks) and we need to trigger a release ourselves. When this happens,
semantic-release can be triggered locally by following these steps **very
carefully**:

> If one of these steps fails, you should assess and address the failure before
> running the next step.

```bash
# These command must be run from the project root. It is recommended to clone a
# fresh version of the repo to a temp directory and run these commands from
# there.

# 1. Install dependencies and add your auth tokens to the .env file.
# ! DO NOT COMMIT THE .env FILE !
cp .env.default .env
npm ci

# 2. Reset the working directory to a clean state (deletes all ignored files).
npm run clean

# 3. Lint all files.
npm run lint:all

# 4. Build distributables.
npm run build:dist -ws

# 5. Build auxiliary documentation.
npm run build:docs -ws

# 6. Build any external executables (used in GitHub Actions workflows).
npm run build:externals

# 7. Format all files.
npm run format

# 8. Run all possible tests and generate coverage information.
npm run test:all

# 9. Upload coverage information to codecov (only if you have the proper token).
CODECOV_TOKEN=$(npx --yes dotenv-cli -p CODECOV_TOKEN) codecov

# 10. Trigger semantic-release locally and generate a new release. This requires
# having tokens for NPM and GitHub with the appropriate permissions.
#
# First, set ROOT:
ROOT=`git rev-parse --show-toplevel`
# Then change directory into the package you want to release:
cd packages/package-id-here
# Then do a dry run:
NPM_TOKEN="$(cd $ROOT && npx --yes dotenv-cli -p NPM_TOKEN)" GH_TOKEN="$(cd $ROOT && npx --yes dotenv-cli -p GITHUB_TOKEN)" HUSKY=0 UPDATE_CHANGELOG=true GIT_AUTHOR_NAME="$(cd $ROOT && npx --yes dotenv-cli -p GIT_AUTHOR_NAME)" GIT_COMMITTER_NAME="$(cd $ROOT && npx --yes dotenv-cli -p GIT_COMMITTER_NAME)" GIT_AUTHOR_EMAIL="$(cd $ROOT && npx --yes dotenv-cli -p GIT_AUTHOR_EMAIL)" GIT_COMMITTER_EMAIL="$(cd $ROOT && npx --yes dotenv-cli -p GIT_COMMITTER_EMAIL)" npx --no-install semantic-release --no-ci --extends "$ROOT/release.config.js" --dry-run
# Finally, do the actual publish:
NPM_TOKEN="$(cd $ROOT && npx --yes dotenv-cli -p NPM_TOKEN)" GH_TOKEN="$(cd $ROOT && npx --yes dotenv-cli -p GITHUB_TOKEN)" HUSKY=0 UPDATE_CHANGELOG=true GIT_AUTHOR_NAME="$(cd $ROOT && npx --yes dotenv-cli -p GIT_AUTHOR_NAME)" GIT_COMMITTER_NAME="$(cd $ROOT && npx --yes dotenv-cli -p GIT_COMMITTER_NAME)" GIT_AUTHOR_EMAIL="$(cd $ROOT && npx --yes dotenv-cli -p GIT_AUTHOR_EMAIL)" GIT_COMMITTER_EMAIL="$(cd $ROOT && npx --yes dotenv-cli -p GIT_COMMITTER_EMAIL)" npx --no-install semantic-release --no-ci --extends "$ROOT/release.config.js"
```

<!-- lint ignore -->

## Thanks!

Thank you so much for helping to maintain this project!

[x-external-about-prs]:
  https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/incorporating-changes-from-a-pull-request/about-pull-request-merges#rebase-and-merge-your-commits
[x-external-atomic]:
  https://dev.to/paulinevos/atomic-commits-will-help-you-git-legit-35i7
[x-external-bisect]:
  https://www.metaltoad.com/blog/beginners-guide-git-bisect-process-elimination
[x-external-commit]:
  https://github.com/conventional-changelog-archived-repos/conventional-changelog-angular/blob/ed32559941719a130bb0327f886d6a32a8cbc2ba/convention.md
[x-external-conventional-changelog]:
  https://github.com/conventional-changelog/conventional-changelog
[x-external-conventional-commits]: https://www.conventionalcommits.org/en/v1.0.0
[x-external-kentcdodds]: https://github.com/kentcdodds
[x-external-mre]: https://stackoverflow.com/help/minimal-reproducible-example
[x-external-release-failure-1]:
  https://github.com/semantic-release/semantic-release/blob/master/docs/support/troubleshooting.md#release-not-found-release-branch-after-git-push---force
[x-external-release-failure-2]:
  https://github.com/semantic-release/semantic-release/blob/master/docs/support/troubleshooting.md#squashed-commits-are-ignored-by-semantic-release
[x-external-semantic-release]:
  https://github.com/semantic-release/semantic-release
[x-external-squashmerge]:
  https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/incorporating-changes-from-a-pull-request/about-pull-request-merges#squash-and-merge-your-commits
[x-projector-releaseconfig]:
  https://github.com/Xunnamius/projector/blob/d90bc141367f4114ecb890ca64b53bcaf997ed72/release.config.js#L32-L40
[x-projector-releaserules]:
  https://github.com/Xunnamius/unified-utils/blob/82312c4c1476796724169c1b44fc6128aeeb57fb/release.config.js#L46-L56
[x-repo-coc]: ./.github/CODE_OF_CONDUCT.md
[x-repo-contributing]: CONTRIBUTING.md
[x-repo-workflows]: ./.github/workflows
