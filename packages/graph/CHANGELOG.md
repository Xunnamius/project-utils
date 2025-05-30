# Changelog

All notable changes to this project will be documented in this auto-generated
file. The format is based on [Conventional Commits][1];
this project adheres to [Semantic Versioning][2].

<br />

## @-xun/project-graph[@2.0.0][3] (2025-05-30)

### 💥 BREAKING CHANGES 💥

- Minimum supported node version is now 20.18.0

### ✨ Features

- **packages/graph:** allow different orderings for `generateRawAliasMap` ("for-config" becomes new default) ([e8c7d57][4])
- **packages/graph:** implement `includeInternalTestFiles` support in `gatherPackageBuildTargets` ([2730a29][5])

### ⚙️ Build System

- **deps:** bump @babel/core from 7.26.10 to 7.27.3 ([0902ca0][6])
- **deps:** bump @babel/plugin-syntax-typescript from 7.25.9 to 7.27.1 ([3934f3f][7])
- **deps:** bump @types/semver from 7.5.8 to 7.7.0 ([d5793f7][8])
- **deps:** bump browserslist from 4.24.4 to 4.25.0 ([93c54c3][9])
- **deps:** bump core-js from 3.41.0 to 3.42.0 ([4817bc9][10])
- **deps:** bump glob from 11.0.1 to 11.0.2 ([8b8633b][11])
- **deps:** bump internal monorepo interdependencies to latest versions ([aa08278][12])
- **deps:** bump semver from 7.7.1 to 7.7.2 ([cae84ba][13])
- **deps:** bump type-fest from 4.37.0 to 4.41.0 ([f2dd5c6][14])
- **package:** drop support for node\@18 ([19084da][15])

<br />

## @-xun/project-graph[@1.0.0][16] (2025-02-03)

### ⚙️ Build System

- Integrate externalized @-xun/memoize and bpma packages ([e672064][17])
- **release:** factor @-xun/project multirepo out from symbiote ([880d8ce][18])

<br />

### 🏗️ Patch @-xun/project-graph[@1.0.6][19] (2025-03-19)

#### ⚙️ Build System

- **deps:** bump @-xun/project-fs from 1.0.5 to 1.1.0 ([15c55b3][20])
- **deps:** bump @-xun/project-fs from 1.1.0 to 1.2.0 ([05b46a1][21])
- **deps:** bump core-js from 3.40.0 to 3.41.0 ([902d8d0][22])

<br />

### 🏗️ Patch @-xun/project-graph[@1.0.5][23] (2025-03-13)

#### 🪄 Fixes

- **packages/graph:** ensure .prettierignore files always interpreted relative to project root in `gatherProjectFiles` ([ed9bf6b][24])

#### ⚙️ Build System

- **deps:** bump @babel/core from 7.26.9 to 7.26.10 ([3e991c4][25])

<br />

### 🏗️ Patch @-xun/project-graph[@1.0.4][26] (2025-03-08)

#### ⚙️ Build System

- **deps:** bump type-fest from 4.35.0 to 4.36.0 ([6d029a0][27])
- **deps:** bump type-fest from 4.36.0 to 4.37.0 ([c1f1350][28])

<br />

### 🏗️ Patch @-xun/project-graph[@1.0.3][29] (2025-02-24)

#### 🪄 Fixes

- Handle unnamed packages (and other `XPackageJson` violations) more logically and consistently ([ebf5440][30])

#### ⚙️ Build System

- **deps:** bump @-xun/project-fs from 1.0.2 to 1.0.3 ([1e3a1ac][31])
- **packages/graph:** add missing "@types/semver" package ([6a643c7][32])

<br />

### 🏗️ Patch @-xun/project-graph[@1.0.2][33] (2025-02-17)

#### ⚙️ Build System

- Update @-xun/run to 1.0.1 ([ff90125][34])

<br />

### 🏗️ Patch @-xun/project-graph[@1.0.1][35] (2025-02-06)

#### 🪄 Fixes

- **packages/graph:** ensure `gatherX` exports use internally serializable data structures ([f358b63][36])

#### ⚙️ Build System

- **husky:** skip slow tests ([80a5ed7][37])
- **post-npm-install:** add common-dummies post-install to npm-post-install ([2747383][38])

[1]: https://conventionalcommits.org
[2]: https://semver.org
[3]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@1.0.6...@-xun/project-graph@2.0.0
[4]: https://github.com/Xunnamius/project-utils/commit/e8c7d57139ab536fa68a7a029a9ed071ed63d1b9
[5]: https://github.com/Xunnamius/project-utils/commit/2730a290426f956d4d09df6f5838fcf6186fbf1f
[6]: https://github.com/Xunnamius/project-utils/commit/0902ca0d45a2de36a813d870e869d5bb1f39c12e
[7]: https://github.com/Xunnamius/project-utils/commit/3934f3f692133a03a2f7818c3bcbc24b57751be1
[8]: https://github.com/Xunnamius/project-utils/commit/d5793f7a7c16f9b2e796eeff50ed8367b773d4ca
[9]: https://github.com/Xunnamius/project-utils/commit/93c54c33873c9e02ceadadc02270680f5b921cb2
[10]: https://github.com/Xunnamius/project-utils/commit/4817bc9ceddd43cbad15030d923f28b258bbe763
[11]: https://github.com/Xunnamius/project-utils/commit/8b8633ba14e8233817a5cca747bcdfbd59cb00c3
[12]: https://github.com/Xunnamius/project-utils/commit/aa08278023d4e011436c9cc0ac32511b2e71f1e8
[13]: https://github.com/Xunnamius/project-utils/commit/cae84baeaf7ce595867cb694b2a1d0333ee3cfa9
[14]: https://github.com/Xunnamius/project-utils/commit/f2dd5c645578f4eff798c2e342b144070c69cd59
[15]: https://github.com/Xunnamius/project-utils/commit/19084dae491dd3fb1056b307e670a0d5c6baeaf6
[16]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@0.0.0-init...@-xun/project-graph@1.0.0
[17]: https://github.com/Xunnamius/project-utils/commit/e6720648fa9dc975b0426fb558b4c4b10c6b2e73
[18]: https://github.com/Xunnamius/project-utils/commit/880d8ce103b19a190f99c2f5db4ca46d8da97664
[19]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@1.0.5...@-xun/project-graph@1.0.6
[20]: https://github.com/Xunnamius/project-utils/commit/15c55b3090095f9112ac67d134a3cfcf85094b42
[21]: https://github.com/Xunnamius/project-utils/commit/05b46a1dadbcb5e3519419043e79b5162dca2ab2
[22]: https://github.com/Xunnamius/project-utils/commit/902d8d0ecc927439df54b7959d7ce922d110df84
[23]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@1.0.4...@-xun/project-graph@1.0.5
[24]: https://github.com/Xunnamius/project-utils/commit/ed9bf6b9d6ec764bb105db626cfab54857141172
[25]: https://github.com/Xunnamius/project-utils/commit/3e991c46f16a5bafd09198df2bfc5d03714cbf1e
[26]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@1.0.3...@-xun/project-graph@1.0.4
[27]: https://github.com/Xunnamius/project-utils/commit/6d029a07b5c2c97465a53d0d7645a606c8ff76d0
[28]: https://github.com/Xunnamius/project-utils/commit/c1f1350fd0c4ab07a7f479dc97132824c003a59f
[29]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@1.0.2...@-xun/project-graph@1.0.3
[30]: https://github.com/Xunnamius/project-utils/commit/ebf54405456d5ea4b1a9fbe57c92ad44289d3b1b
[31]: https://github.com/Xunnamius/project-utils/commit/1e3a1acb0971ec922bd552eb50611364c2c5b9ba
[32]: https://github.com/Xunnamius/project-utils/commit/6a643c7575f40293f9c55119a69a7e2c0cc5269a
[33]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@1.0.1...@-xun/project-graph@1.0.2
[34]: https://github.com/Xunnamius/project-utils/commit/ff90125e0338879bf7bf87de3d6d4aed56521e4c
[35]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@1.0.0...@-xun/project-graph@1.0.1
[36]: https://github.com/Xunnamius/project-utils/commit/f358b6316be918b22cfc98428568deedc3ca7dd7
[37]: https://github.com/Xunnamius/project-utils/commit/80a5ed7472360ab582a2244137ed53d9f14dcec5
[38]: https://github.com/Xunnamius/project-utils/commit/274738346fdc425d391c09d88ec14c504de107a1
