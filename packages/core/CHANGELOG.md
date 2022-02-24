# Changelog

All notable changes to this project will be documented in this auto-generated
file. The format is based on [Conventional Commits][30]; this project adheres to
[Semantic Versioning][31].

### [1.1.1][32] (2022-02-24)

#### 🪄 Fixes

- **packages:** fix several bugs (all tests passing) ([3618e07][33])

#### ⚙️ Build system

- **packages/core:** update dependencies ([10923c2][34])
- **packages/core:** update exports ([3b35f0b][35])
- **packages/core:** update local webpack config ([81d6428][36])
- **packages/core:** update scripts, add placeholders (preparing for monorepo
  versions) ([48aa7ba][37])
- **packages:** update pinned dependencies ([a82a038][38])

## [1.1.0][1] (2022-02-22)

#### ✨ Features

- **packages/core:** add getRunContext to monorepo-utils ([090ef2e][2])
- **packages/core:** add project.packages key mapping workspace package names to
  paths ([c87af37][3])
- **packages/core:** rewrite getRunContext to return much more useful output
  ([2f714d0][4])

#### ⚙️ Build system

- **babel:** remove transform-default-named-imports (perhaps permanently)
  ([8996dd5][5])
- **package-lock:** update package-lock ([e5f9a65][6])
- **packages/cli:** update package scripts, module key ([e218ace][7])
- **packages/core:** remove unused deps ([9933e6d][8])
- **packages/core:** use latest webpack monorepo configuration features
  ([86bbfed][9])
- **packages/core:** use proper config.docs entry point ([8e14e6a][10])
- **packages/plugin-lint:** update engines to maintained node versions
  ([27d2aac][11])
- **packages:** add config.docs entry point ([204c6fc][12])
- **packages:** add new structure; add new packages ([8b21a3c][13])
- **packages:** add typesVersions to package.json ([d7d3901][14])
- **packages:** build-docs accepts space-separated args ([63d8867][15])
- **packages:** delete unused package ([3ff5376][16])
- **packages:** update build-docs script ([41cb417][17])
- **packages:** update initial version to 1.0.0 ([16c7e62][18])
- **types:** add manual typedef for @npmcli/map-workspaces ([febd113][19])
- Update tooling configs ([90839da][20])

## [1.0.0][21] (2021-11-24)

#### ✨ Features

- **packages/config-webpack:** add per-monorepo custom config ([538a45e][22])

#### 🪄 Fixes

- **packages/core:** ensure correct output when rootDir == cwd ([33f64f2][23])
- **packages/core:** issue TypeScript-related warnings conditionally
  ([1eebe1a][24])
- Upgrade bulma from 0.7.5 to 0.9.1 ([153dc11][25])

#### ⚙️ Build system

- Merge in babel and webpack updates from upstream ([6368966][26])
- **packages/cli:** update packages' metadata ([94c359f][27])
- **packages/config-webpack:** nested webpack configs support functions and
  object overrides ([0192ae2][28])
- **packages/core:** add custom webpack config ([76aee50][29])

[1]: https://github.com/Xunnamius/projector/compare/core@1.0.0...core@1.1.0
[2]:
  https://github.com/Xunnamius/projector/commit/090ef2efeeceecda6b343a99f24a03c17310e224
[3]:
  https://github.com/Xunnamius/projector/commit/c87af37db02b5c1cc98767a298dbf988a21cde78
[4]:
  https://github.com/Xunnamius/projector/commit/2f714d027744edc436d85539497d5ae1adf77c7f
[5]:
  https://github.com/Xunnamius/projector/commit/8996dd584b12e8fd72cd07c2a98cf0c07bad1cf9
[6]:
  https://github.com/Xunnamius/projector/commit/e5f9a6581e7321ed10ad4131842c1118f7ed2bce
[7]:
  https://github.com/Xunnamius/projector/commit/e218ace44391b294c07e403457ac944007328167
[8]:
  https://github.com/Xunnamius/projector/commit/9933e6d26443208dcd8aa6c45b744d12733a607c
[9]:
  https://github.com/Xunnamius/projector/commit/86bbfedd5b49b30922e86d52f52350a90d52ee06
[10]:
  https://github.com/Xunnamius/projector/commit/8e14e6a26b0faf9736b58c6dd87164b3e9911986
[11]:
  https://github.com/Xunnamius/projector/commit/27d2aaca08c2dcf046f89ab614c59cd2f95fab6a
[12]:
  https://github.com/Xunnamius/projector/commit/204c6fc2ff54bb26f68225bd3f019bd7b4304520
[13]:
  https://github.com/Xunnamius/projector/commit/8b21a3c775b57495ad8a387ad4ba2daffaa9946e
[14]:
  https://github.com/Xunnamius/projector/commit/d7d3901f02f78ff498338fbdf31aa8414b685802
[15]:
  https://github.com/Xunnamius/projector/commit/63d88674619c09c2b3d1084fff1127ee828ae834
[16]:
  https://github.com/Xunnamius/projector/commit/3ff53767b103c79d403db4dd61bd5e20974403bc
[17]:
  https://github.com/Xunnamius/projector/commit/41cb41774dabd008be2f10c0227926ab9cff6edc
[18]:
  https://github.com/Xunnamius/projector/commit/16c7e62df8703a08daa04464e0c15de860114b79
[19]:
  https://github.com/Xunnamius/projector/commit/febd113510b47084bb69e3357048592a8674910a
[20]:
  https://github.com/Xunnamius/projector/commit/90839daa37883a2b98373ad3078cb5fb65ebd531
[21]:
  https://github.com/Xunnamius/projector/compare/153dc114aea4fd79fa67994105d1af956f73a3e5...core@1.0.0
[22]:
  https://github.com/Xunnamius/projector/commit/538a45eb3e79ea0e41afc79ec19fd2d3d49a3338
[23]:
  https://github.com/Xunnamius/projector/commit/33f64f2d04b99c158ff28f4a42e856f26db32599
[24]:
  https://github.com/Xunnamius/projector/commit/1eebe1add3e9ea31a2f70b3097683c85ad9a2212
[25]:
  https://github.com/Xunnamius/projector/commit/153dc114aea4fd79fa67994105d1af956f73a3e5
[26]:
  https://github.com/Xunnamius/projector/commit/636896653f57a4c088388c7cc5d924d66b8b4528
[27]:
  https://github.com/Xunnamius/projector/commit/94c359f8b1b572cc027c077bd4da9f84f8ae3dac
[28]:
  https://github.com/Xunnamius/projector/commit/0192ae2e13334808b41eaab02c9cc016957b265b
[29]:
  https://github.com/Xunnamius/projector/commit/76aee507b6cfd3b00edafe6a287f65615d2900c9
[30]: https://conventionalcommits.org
[31]: https://semver.org
[32]: https://github.com/Xunnamius/projector/compare/core@1.1.0...core@1.1.1
[33]:
  https://github.com/Xunnamius/projector/commit/3618e07ceea8f156c17a5aa6eef778203997fc79
[34]:
  https://github.com/Xunnamius/projector/commit/10923c28ca50e466e78d3c89303f75beb65bc7d1
[35]:
  https://github.com/Xunnamius/projector/commit/3b35f0b74dff861994ea475e89de9cf486807b88
[36]:
  https://github.com/Xunnamius/projector/commit/81d6428de4f08b5870bd3e3486c71d4b9c4617d6
[37]:
  https://github.com/Xunnamius/projector/commit/48aa7bac51dfeca821604534ec6e888bedaa0dd4
[38]:
  https://github.com/Xunnamius/projector/commit/a82a038cb265b99cda0345054553d799e1722f38
