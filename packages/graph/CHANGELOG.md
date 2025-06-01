# Changelog

All notable changes to this project will be documented in this auto-generated
file. The format is based on [Conventional Commits][1];
this project adheres to [Semantic Versioning][2].

<br />

## @-xun/project-graph[@2.1.0][3] (2025-06-01)

### ✨ Features

- **packages/graph:** add support for "for-import-hinting" output target in `generateRawAliasMap` ([7607517][4])

<br />

### 🏗️ Patch @-xun/project-graph[@2.1.1][5] (2025-06-01)

#### ⚙️ Build System

- **deps:** bump @-xun/fs from 1.0.0 to 2.0.0 ([3b53775][6])
- **deps:** bump @babel/core from 7.27.3 to 7.27.4 ([dd4af51][7])
- **deps:** bump internal monorepo interdependencies to latest versions ([c5fcdc3][8])

<br />

## @-xun/project-graph[@2.0.0][9] (2025-05-30)

### 💥 BREAKING CHANGES 💥

- Minimum supported node version is now 20.18.0

### ✨ Features

- **packages/graph:** allow different orderings for `generateRawAliasMap` ("for-config" becomes new default) ([e8c7d57][10])
- **packages/graph:** implement `includeInternalTestFiles` support in `gatherPackageBuildTargets` ([2730a29][11])

### ⚙️ Build System

- **deps:** bump @babel/core from 7.26.10 to 7.27.3 ([0902ca0][12])
- **deps:** bump @babel/plugin-syntax-typescript from 7.25.9 to 7.27.1 ([3934f3f][13])
- **deps:** bump @types/semver from 7.5.8 to 7.7.0 ([d5793f7][14])
- **deps:** bump browserslist from 4.24.4 to 4.25.0 ([93c54c3][15])
- **deps:** bump core-js from 3.41.0 to 3.42.0 ([4817bc9][16])
- **deps:** bump glob from 11.0.1 to 11.0.2 ([8b8633b][17])
- **deps:** bump internal monorepo interdependencies to latest versions ([aa08278][18])
- **deps:** bump semver from 7.7.1 to 7.7.2 ([cae84ba][19])
- **deps:** bump type-fest from 4.37.0 to 4.41.0 ([f2dd5c6][20])
- **package:** drop support for node\@18 ([19084da][21])

<br />

## @-xun/project-graph[@1.0.0][22] (2025-02-03)

### ⚙️ Build System

- Integrate externalized @-xun/memoize and bpma packages ([e672064][23])
- **release:** factor @-xun/project multirepo out from symbiote ([880d8ce][24])

<br />

### 🏗️ Patch @-xun/project-graph[@1.0.6][25] (2025-03-19)

#### ⚙️ Build System

- **deps:** bump @-xun/project-fs from 1.0.5 to 1.1.0 ([15c55b3][26])
- **deps:** bump @-xun/project-fs from 1.1.0 to 1.2.0 ([05b46a1][27])
- **deps:** bump core-js from 3.40.0 to 3.41.0 ([902d8d0][28])

<br />

### 🏗️ Patch @-xun/project-graph[@1.0.5][29] (2025-03-13)

#### 🪄 Fixes

- **packages/graph:** ensure .prettierignore files always interpreted relative to project root in `gatherProjectFiles` ([ed9bf6b][30])

#### ⚙️ Build System

- **deps:** bump @babel/core from 7.26.9 to 7.26.10 ([3e991c4][31])

<br />

### 🏗️ Patch @-xun/project-graph[@1.0.4][32] (2025-03-08)

#### ⚙️ Build System

- **deps:** bump type-fest from 4.35.0 to 4.36.0 ([6d029a0][33])
- **deps:** bump type-fest from 4.36.0 to 4.37.0 ([c1f1350][34])

<br />

### 🏗️ Patch @-xun/project-graph[@1.0.3][35] (2025-02-24)

#### 🪄 Fixes

- Handle unnamed packages (and other `XPackageJson` violations) more logically and consistently ([ebf5440][36])

#### ⚙️ Build System

- **deps:** bump @-xun/project-fs from 1.0.2 to 1.0.3 ([1e3a1ac][37])
- **packages/graph:** add missing "@types/semver" package ([6a643c7][38])

<br />

### 🏗️ Patch @-xun/project-graph[@1.0.2][39] (2025-02-17)

#### ⚙️ Build System

- Update @-xun/run to 1.0.1 ([ff90125][40])

<br />

### 🏗️ Patch @-xun/project-graph[@1.0.1][41] (2025-02-06)

#### 🪄 Fixes

- **packages/graph:** ensure `gatherX` exports use internally serializable data structures ([f358b63][42])

#### ⚙️ Build System

- **husky:** skip slow tests ([80a5ed7][43])
- **post-npm-install:** add common-dummies post-install to npm-post-install ([2747383][44])

[1]: https://conventionalcommits.org
[2]: https://semver.org
[3]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@2.0.0...@-xun/project-graph@2.1.0
[4]: https://github.com/Xunnamius/project-utils/commit/7607517f14ad401cf959467e106fee9dead50bb3
[5]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@2.1.0...@-xun/project-graph@2.1.1
[6]: https://github.com/Xunnamius/project-utils/commit/3b5377536ea7a23a2424443e8ae9cf837b0c66cf
[7]: https://github.com/Xunnamius/project-utils/commit/dd4af519208e944d143ec79cf156b2a97d918ecd
[8]: https://github.com/Xunnamius/project-utils/commit/c5fcdc366d3971ddd22c7ca6285d620024f7f4f3
[9]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@1.0.6...@-xun/project-graph@2.0.0
[10]: https://github.com/Xunnamius/project-utils/commit/e8c7d57139ab536fa68a7a029a9ed071ed63d1b9
[11]: https://github.com/Xunnamius/project-utils/commit/2730a290426f956d4d09df6f5838fcf6186fbf1f
[12]: https://github.com/Xunnamius/project-utils/commit/0902ca0d45a2de36a813d870e869d5bb1f39c12e
[13]: https://github.com/Xunnamius/project-utils/commit/3934f3f692133a03a2f7818c3bcbc24b57751be1
[14]: https://github.com/Xunnamius/project-utils/commit/d5793f7a7c16f9b2e796eeff50ed8367b773d4ca
[15]: https://github.com/Xunnamius/project-utils/commit/93c54c33873c9e02ceadadc02270680f5b921cb2
[16]: https://github.com/Xunnamius/project-utils/commit/4817bc9ceddd43cbad15030d923f28b258bbe763
[17]: https://github.com/Xunnamius/project-utils/commit/8b8633ba14e8233817a5cca747bcdfbd59cb00c3
[18]: https://github.com/Xunnamius/project-utils/commit/aa08278023d4e011436c9cc0ac32511b2e71f1e8
[19]: https://github.com/Xunnamius/project-utils/commit/cae84baeaf7ce595867cb694b2a1d0333ee3cfa9
[20]: https://github.com/Xunnamius/project-utils/commit/f2dd5c645578f4eff798c2e342b144070c69cd59
[21]: https://github.com/Xunnamius/project-utils/commit/19084dae491dd3fb1056b307e670a0d5c6baeaf6
[22]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@0.0.0-init...@-xun/project-graph@1.0.0
[23]: https://github.com/Xunnamius/project-utils/commit/e6720648fa9dc975b0426fb558b4c4b10c6b2e73
[24]: https://github.com/Xunnamius/project-utils/commit/880d8ce103b19a190f99c2f5db4ca46d8da97664
[25]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@1.0.5...@-xun/project-graph@1.0.6
[26]: https://github.com/Xunnamius/project-utils/commit/15c55b3090095f9112ac67d134a3cfcf85094b42
[27]: https://github.com/Xunnamius/project-utils/commit/05b46a1dadbcb5e3519419043e79b5162dca2ab2
[28]: https://github.com/Xunnamius/project-utils/commit/902d8d0ecc927439df54b7959d7ce922d110df84
[29]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@1.0.4...@-xun/project-graph@1.0.5
[30]: https://github.com/Xunnamius/project-utils/commit/ed9bf6b9d6ec764bb105db626cfab54857141172
[31]: https://github.com/Xunnamius/project-utils/commit/3e991c46f16a5bafd09198df2bfc5d03714cbf1e
[32]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@1.0.3...@-xun/project-graph@1.0.4
[33]: https://github.com/Xunnamius/project-utils/commit/6d029a07b5c2c97465a53d0d7645a606c8ff76d0
[34]: https://github.com/Xunnamius/project-utils/commit/c1f1350fd0c4ab07a7f479dc97132824c003a59f
[35]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@1.0.2...@-xun/project-graph@1.0.3
[36]: https://github.com/Xunnamius/project-utils/commit/ebf54405456d5ea4b1a9fbe57c92ad44289d3b1b
[37]: https://github.com/Xunnamius/project-utils/commit/1e3a1acb0971ec922bd552eb50611364c2c5b9ba
[38]: https://github.com/Xunnamius/project-utils/commit/6a643c7575f40293f9c55119a69a7e2c0cc5269a
[39]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@1.0.1...@-xun/project-graph@1.0.2
[40]: https://github.com/Xunnamius/project-utils/commit/ff90125e0338879bf7bf87de3d6d4aed56521e4c
[41]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@1.0.0...@-xun/project-graph@1.0.1
[42]: https://github.com/Xunnamius/project-utils/commit/f358b6316be918b22cfc98428568deedc3ca7dd7
[43]: https://github.com/Xunnamius/project-utils/commit/80a5ed7472360ab582a2244137ed53d9f14dcec5
[44]: https://github.com/Xunnamius/project-utils/commit/274738346fdc425d391c09d88ec14c504de107a1
