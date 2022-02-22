# Changelog

All notable changes to this project will be documented in this auto-generated
file. The format is based on [Conventional Commits][10]; this project adheres to
[Semantic Versioning][11].

## [1.1.0][12] (2022-02-22)

#### ✨ Features

- **packages/core:** add getRunContext to monorepo-utils ([090ef2e][13])
- **packages/core:** add project.packages key mapping workspace package names to
  paths ([c87af37][14])
- **packages/core:** rewrite getRunContext to return much more useful output
  ([2f714d0][15])

#### ⚙️ Build system

- **babel:** remove transform-default-named-imports (perhaps permanently)
  ([8996dd5][16])
- **package-lock:** update package-lock ([e5f9a65][17])
- **packages/cli:** update package scripts, module key ([e218ace][18])
- **packages/core:** remove unused deps ([9933e6d][19])
- **packages/core:** use latest webpack monorepo configuration features
  ([86bbfed][20])
- **packages/core:** use proper config.docs entry point ([8e14e6a][21])
- **packages/plugin-lint:** update engines to maintained node versions
  ([27d2aac][22])
- **packages:** add config.docs entry point ([204c6fc][23])
- **packages:** add new structure; add new packages ([8b21a3c][24])
- **packages:** add typesVersions to package.json ([d7d3901][25])
- **packages:** build-docs accepts space-separated args ([63d8867][26])
- **packages:** delete unused package ([3ff5376][27])
- **packages:** update build-docs script ([41cb417][28])
- **packages:** update initial version to 1.0.0 ([16c7e62][29])
- **types:** add manual typedef for @npmcli/map-workspaces ([febd113][30])
- Update tooling configs ([90839da][31])

## [1.0.0][1] (2021-11-24)

#### ✨ Features

- **packages/config-webpack:** add per-monorepo custom config ([538a45e][2])

#### 🪄 Fixes

- **packages/core:** ensure correct output when rootDir == cwd ([33f64f2][3])
- **packages/core:** issue TypeScript-related warnings conditionally
  ([1eebe1a][4])
- Upgrade bulma from 0.7.5 to 0.9.1 ([153dc11][5])

#### ⚙️ Build system

- Merge in babel and webpack updates from upstream ([6368966][6])
- **packages/cli:** update packages' metadata ([94c359f][7])
- **packages/config-webpack:** nested webpack configs support functions and
  object overrides ([0192ae2][8])
- **packages/core:** add custom webpack config ([76aee50][9])

[1]:
  https://github.com/Xunnamius/projector/compare/153dc114aea4fd79fa67994105d1af956f73a3e5...core@1.0.0
[2]:
  https://github.com/Xunnamius/projector/commit/538a45eb3e79ea0e41afc79ec19fd2d3d49a3338
[3]:
  https://github.com/Xunnamius/projector/commit/33f64f2d04b99c158ff28f4a42e856f26db32599
[4]:
  https://github.com/Xunnamius/projector/commit/1eebe1add3e9ea31a2f70b3097683c85ad9a2212
[5]:
  https://github.com/Xunnamius/projector/commit/153dc114aea4fd79fa67994105d1af956f73a3e5
[6]:
  https://github.com/Xunnamius/projector/commit/636896653f57a4c088388c7cc5d924d66b8b4528
[7]:
  https://github.com/Xunnamius/projector/commit/94c359f8b1b572cc027c077bd4da9f84f8ae3dac
[8]:
  https://github.com/Xunnamius/projector/commit/0192ae2e13334808b41eaab02c9cc016957b265b
[9]:
  https://github.com/Xunnamius/projector/commit/76aee507b6cfd3b00edafe6a287f65615d2900c9
[10]: https://conventionalcommits.org
[11]: https://semver.org
[12]: https://github.com/Xunnamius/projector/compare/core@1.0.0...core@1.1.0
[13]:
  https://github.com/Xunnamius/projector/commit/090ef2efeeceecda6b343a99f24a03c17310e224
[14]:
  https://github.com/Xunnamius/projector/commit/c87af37db02b5c1cc98767a298dbf988a21cde78
[15]:
  https://github.com/Xunnamius/projector/commit/2f714d027744edc436d85539497d5ae1adf77c7f
[16]:
  https://github.com/Xunnamius/projector/commit/8996dd584b12e8fd72cd07c2a98cf0c07bad1cf9
[17]:
  https://github.com/Xunnamius/projector/commit/e5f9a6581e7321ed10ad4131842c1118f7ed2bce
[18]:
  https://github.com/Xunnamius/projector/commit/e218ace44391b294c07e403457ac944007328167
[19]:
  https://github.com/Xunnamius/projector/commit/9933e6d26443208dcd8aa6c45b744d12733a607c
[20]:
  https://github.com/Xunnamius/projector/commit/86bbfedd5b49b30922e86d52f52350a90d52ee06
[21]:
  https://github.com/Xunnamius/projector/commit/8e14e6a26b0faf9736b58c6dd87164b3e9911986
[22]:
  https://github.com/Xunnamius/projector/commit/27d2aaca08c2dcf046f89ab614c59cd2f95fab6a
[23]:
  https://github.com/Xunnamius/projector/commit/204c6fc2ff54bb26f68225bd3f019bd7b4304520
[24]:
  https://github.com/Xunnamius/projector/commit/8b21a3c775b57495ad8a387ad4ba2daffaa9946e
[25]:
  https://github.com/Xunnamius/projector/commit/d7d3901f02f78ff498338fbdf31aa8414b685802
[26]:
  https://github.com/Xunnamius/projector/commit/63d88674619c09c2b3d1084fff1127ee828ae834
[27]:
  https://github.com/Xunnamius/projector/commit/3ff53767b103c79d403db4dd61bd5e20974403bc
[28]:
  https://github.com/Xunnamius/projector/commit/41cb41774dabd008be2f10c0227926ab9cff6edc
[29]:
  https://github.com/Xunnamius/projector/commit/16c7e62df8703a08daa04464e0c15de860114b79
[30]:
  https://github.com/Xunnamius/projector/commit/febd113510b47084bb69e3357048592a8674910a
[31]:
  https://github.com/Xunnamius/projector/commit/90839daa37883a2b98373ad3078cb5fb65ebd531
