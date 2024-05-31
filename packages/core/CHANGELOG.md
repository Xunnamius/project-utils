# Changelog

All notable changes to this project will be documented in this auto-generated
file. The format is based on [Conventional Commits][1]; this project adheres to
[Semantic Versioning][2].

## [1.3.0][3] (2024-05-31)

#### ✨ Features

- **packages/core:** add ctx.project.packages.all sugar property ([ba0fd24][4])
- **packages/core:** add imports/exports map forward and reverse resolvers
  ([bfa500f][5])
- **packages:** ensure path parameters are always absolute ([13dac8b][6])

#### 🪄 Fixes

- **packages/core:** fix bug where sub-roots with same name as root package
  caused misclassification ([098b2a5][7])
- Support node10 and node16 import resolutions ([9a08bf0][8])

#### ⚙️ Build System

- **babel:** add babelrcRoots ([4c0b97a][9])
- **babel:** add explicit configuration entry for "development" NODE_ENV
  ([38e2e78][10])
- Bring monorepo build system into 2024 ([71c7725][11])
- **deps:** bump debug from 4.3.3 to 4.3.4 ([bdd12c5][12])
- **deps:** bump debug from 4.3.3 to 4.3.4 ([abfeee9][13])
- **env:** remove fossa key ([547212c][14])
- **eslintrc:** add [@typescript-][15]eslint/no-misused-promises check
  ([24f1d97][16])
- **husky:** add post-checkout script for creating dummy fixture .git dirs
  ([3c4ccf3][17])
- **husky:** ensure post-checkout script does not choke on reinstall
  ([d789c8b][18])
- Ignore/exclude uninteresting source files ([a5e924d][19])
- **jest:** ensure jest-haste-map does not try to parse/cache fixtures
  ([57876f9][20])
- **package:** add preliminary support for post-checkout hook ([6186549][21])
- **package:** fix prepare script ([46c0604][22])
- **package:** remove unnecessary experimental vm modules node options from
  test-unit script ([393f626][23])
- **packages/core:** update dependencies ([bc45c10][24])
- **package:** update prepare script to run post-checkout hook only if exists
  ([ddf4a9f][25])
- **package:** use jest\@next for exports support ([a6021ce][26])
- Remove webpack from standard tool chain ([f0aefec][27])
- **tsconfig:** exclude test/fixtures ([096e3ed][28])
- **webpack:** add pkgverse resolver functionality ([811c64f][29])
- **webpack:** fix webpack pkgverse resolution for non-js files ([4a0f075][30])
- **webpack:** more robust base webpack config ([3bd5701][31])

## [1.2.0][32] (2022-02-25)

#### ✨ Features

- **packages:** getWorkspacePackages additionally returns "broken" package paths
  ([41e461b][33])

### [1.1.1][34] (2022-02-24)

#### 🪄 Fixes

- **packages:** fix several bugs (all tests passing) ([3618e07][35])

#### ⚙️ Build System

- **packages/core:** update dependencies ([10923c2][36])
- **packages/core:** update exports ([3b35f0b][37])
- **packages/core:** update local webpack config ([81d6428][38])
- **packages/core:** update scripts, add placeholders (preparing for monorepo
  versions) ([48aa7ba][39])
- **packages:** update pinned dependencies ([a82a038][40])

## [1.1.0][41] (2022-02-22)

#### ✨ Features

- **packages/core:** add getRunContext to monorepo-utils ([090ef2e][42])
- **packages/core:** add project.packages key mapping workspace package names to
  paths ([c87af37][43])
- **packages/core:** rewrite getRunContext to return much more useful output
  ([2f714d0][44])

#### ⚙️ Build System

- **babel:** remove transform-default-named-imports (perhaps permanently)
  ([8996dd5][45])
- **package-lock:** update package-lock ([e5f9a65][46])
- **packages/cli:** update package scripts, module key ([e218ace][47])
- **packages/core:** remove unused deps ([9933e6d][48])
- **packages/core:** use latest webpack monorepo configuration features
  ([86bbfed][49])
- **packages/core:** use proper config.docs entry point ([8e14e6a][50])
- **packages/plugin-lint:** update engines to maintained node versions
  ([27d2aac][51])
- **packages:** add config.docs entry point ([204c6fc][52])
- **packages:** add new structure; add new packages ([8b21a3c][53])
- **packages:** add typesVersions to package.json ([d7d3901][54])
- **packages:** build-docs accepts space-separated args ([63d8867][55])
- **packages:** delete unused package ([3ff5376][56])
- **packages:** update build-docs script ([41cb417][57])
- **packages:** update initial version to 1.0.0 ([16c7e62][58])
- **types:** add manual typedef for @npmcli/map-workspaces ([febd113][59])
- Update tooling configs ([90839da][60])

## [1.0.0][61] (2021-11-24)

#### ✨ Features

- **packages/config-webpack:** add per-monorepo custom config ([538a45e][62])

#### 🪄 Fixes

- **packages/core:** ensure correct output when rootDir == cwd ([33f64f2][63])
- **packages/core:** issue TypeScript-related warnings conditionally
  ([1eebe1a][64])
- Upgrade bulma from 0.7.5 to 0.9.1 ([153dc11][65])

#### ⚙️ Build System

- Merge in babel and webpack updates from upstream ([6368966][66])
- **packages/cli:** update packages' metadata ([94c359f][67])
- **packages/config-webpack:** nested webpack configs support functions and
  object overrides ([0192ae2][68])
- **packages/core:** add custom webpack config ([76aee50][69])

[1]: https://conventionalcommits.org
[2]: https://semver.org
[3]: https://github.com/Xunnamius/projector/compare/core@1.2.0...core@1.3.0
[4]:
  https://github.com/Xunnamius/projector/commit/ba0fd248ea9cd8aab94a09d27f320a94361534d6
[5]:
  https://github.com/Xunnamius/projector/commit/bfa500ffac4213532f116bf0408864ab18c68a9f
[6]:
  https://github.com/Xunnamius/projector/commit/13dac8b823e7737667e0c30ab6179cccd2dbcf0c
[7]:
  https://github.com/Xunnamius/projector/commit/098b2a5f1c4fdb1c3569715f786a200ea7220cc3
[8]:
  https://github.com/Xunnamius/projector/commit/9a08bf0c75ca47bb381e068b8757770785a82bb6
[9]:
  https://github.com/Xunnamius/projector/commit/4c0b97a56961a6b881aa396abdfefbbd0dd9d2e5
[10]:
  https://github.com/Xunnamius/projector/commit/38e2e78f32ea42a6fd6114ac450b54d400f55bb1
[11]:
  https://github.com/Xunnamius/projector/commit/71c77257a92767f4761a21bce6135126d13137e0
[12]:
  https://github.com/Xunnamius/projector/commit/bdd12c51924bebfbc601e238e3fef8184b49653e
[13]:
  https://github.com/Xunnamius/projector/commit/abfeee948c9f8f55bac0d7c7174606244d11ea77
[14]:
  https://github.com/Xunnamius/projector/commit/547212c584f25d9cabee2694d1c7b34579b5e0d3
[15]: https://github.com/typescript-
[16]:
  https://github.com/Xunnamius/projector/commit/24f1d970a01d4ea18cc7b1c03c01e7cf2b7c1a3f
[17]:
  https://github.com/Xunnamius/projector/commit/3c4ccf325980ac35eddd67359cb48cd95b7f8ca0
[18]:
  https://github.com/Xunnamius/projector/commit/d789c8ba839c64337751e784b06b38c99574d913
[19]:
  https://github.com/Xunnamius/projector/commit/a5e924db977d6127b44098287058a62bf8c766c4
[20]:
  https://github.com/Xunnamius/projector/commit/57876f98d3a39efae777bfad939736b12378abf2
[21]:
  https://github.com/Xunnamius/projector/commit/618654932bb5c0ac50f51d19535523fa9be54c68
[22]:
  https://github.com/Xunnamius/projector/commit/46c06044b1611f61c910cdcfbb57e0f9e3f6641b
[23]:
  https://github.com/Xunnamius/projector/commit/393f62619464cf6607da98b97c939a6c4ee8a84a
[24]:
  https://github.com/Xunnamius/projector/commit/bc45c1038492ac11d7136f360a314556261ec221
[25]:
  https://github.com/Xunnamius/projector/commit/ddf4a9f399308d1e4a2125a0e963f676bb507535
[26]:
  https://github.com/Xunnamius/projector/commit/a6021ce3a1b68dd9b2a12b72f866e0a2f1e9912a
[27]:
  https://github.com/Xunnamius/projector/commit/f0aefeceb0e97a4564f34958ee73b2d411c3beb7
[28]:
  https://github.com/Xunnamius/projector/commit/096e3ed26327058dcbef2d1b8d80f95d6dc9b42c
[29]:
  https://github.com/Xunnamius/projector/commit/811c64f47f17b81ab022549db226265b9767fe22
[30]:
  https://github.com/Xunnamius/projector/commit/4a0f075adaf1e9c48ec17f431437529b80c4d886
[31]:
  https://github.com/Xunnamius/projector/commit/3bd570114be81ffd0d607356bc4732ceeb807581
[32]: https://github.com/Xunnamius/projector/compare/core@1.1.1...core@1.2.0
[33]:
  https://github.com/Xunnamius/projector/commit/41e461b12a7ab0ad6edcc2f08dc3ff97729cce5f
[34]: https://github.com/Xunnamius/projector/compare/core@1.1.0...core@1.1.1
[35]:
  https://github.com/Xunnamius/projector/commit/3618e07ceea8f156c17a5aa6eef778203997fc79
[36]:
  https://github.com/Xunnamius/projector/commit/10923c28ca50e466e78d3c89303f75beb65bc7d1
[37]:
  https://github.com/Xunnamius/projector/commit/3b35f0b74dff861994ea475e89de9cf486807b88
[38]:
  https://github.com/Xunnamius/projector/commit/81d6428de4f08b5870bd3e3486c71d4b9c4617d6
[39]:
  https://github.com/Xunnamius/projector/commit/48aa7bac51dfeca821604534ec6e888bedaa0dd4
[40]:
  https://github.com/Xunnamius/projector/commit/a82a038cb265b99cda0345054553d799e1722f38
[41]: https://github.com/Xunnamius/projector/compare/core@1.0.0...core@1.1.0
[42]:
  https://github.com/Xunnamius/projector/commit/090ef2efeeceecda6b343a99f24a03c17310e224
[43]:
  https://github.com/Xunnamius/projector/commit/c87af37db02b5c1cc98767a298dbf988a21cde78
[44]:
  https://github.com/Xunnamius/projector/commit/2f714d027744edc436d85539497d5ae1adf77c7f
[45]:
  https://github.com/Xunnamius/projector/commit/8996dd584b12e8fd72cd07c2a98cf0c07bad1cf9
[46]:
  https://github.com/Xunnamius/projector/commit/e5f9a6581e7321ed10ad4131842c1118f7ed2bce
[47]:
  https://github.com/Xunnamius/projector/commit/e218ace44391b294c07e403457ac944007328167
[48]:
  https://github.com/Xunnamius/projector/commit/9933e6d26443208dcd8aa6c45b744d12733a607c
[49]:
  https://github.com/Xunnamius/projector/commit/86bbfedd5b49b30922e86d52f52350a90d52ee06
[50]:
  https://github.com/Xunnamius/projector/commit/8e14e6a26b0faf9736b58c6dd87164b3e9911986
[51]:
  https://github.com/Xunnamius/projector/commit/27d2aaca08c2dcf046f89ab614c59cd2f95fab6a
[52]:
  https://github.com/Xunnamius/projector/commit/204c6fc2ff54bb26f68225bd3f019bd7b4304520
[53]:
  https://github.com/Xunnamius/projector/commit/8b21a3c775b57495ad8a387ad4ba2daffaa9946e
[54]:
  https://github.com/Xunnamius/projector/commit/d7d3901f02f78ff498338fbdf31aa8414b685802
[55]:
  https://github.com/Xunnamius/projector/commit/63d88674619c09c2b3d1084fff1127ee828ae834
[56]:
  https://github.com/Xunnamius/projector/commit/3ff53767b103c79d403db4dd61bd5e20974403bc
[57]:
  https://github.com/Xunnamius/projector/commit/41cb41774dabd008be2f10c0227926ab9cff6edc
[58]:
  https://github.com/Xunnamius/projector/commit/16c7e62df8703a08daa04464e0c15de860114b79
[59]:
  https://github.com/Xunnamius/projector/commit/febd113510b47084bb69e3357048592a8674910a
[60]:
  https://github.com/Xunnamius/projector/commit/90839daa37883a2b98373ad3078cb5fb65ebd531
[61]:
  https://github.com/Xunnamius/projector/compare/153dc114aea4fd79fa67994105d1af956f73a3e5...core@1.0.0
[62]:
  https://github.com/Xunnamius/projector/commit/538a45eb3e79ea0e41afc79ec19fd2d3d49a3338
[63]:
  https://github.com/Xunnamius/projector/commit/33f64f2d04b99c158ff28f4a42e856f26db32599
[64]:
  https://github.com/Xunnamius/projector/commit/1eebe1add3e9ea31a2f70b3097683c85ad9a2212
[65]:
  https://github.com/Xunnamius/projector/commit/153dc114aea4fd79fa67994105d1af956f73a3e5
[66]:
  https://github.com/Xunnamius/projector/commit/636896653f57a4c088388c7cc5d924d66b8b4528
[67]:
  https://github.com/Xunnamius/projector/commit/94c359f8b1b572cc027c077bd4da9f84f8ae3dac
[68]:
  https://github.com/Xunnamius/projector/commit/0192ae2e13334808b41eaab02c9cc016957b265b
[69]:
  https://github.com/Xunnamius/projector/commit/76aee507b6cfd3b00edafe6a287f65615d2900c9
