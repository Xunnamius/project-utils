# Changelog

All notable changes to this project will be documented in this auto-generated
file. The format is based on [Conventional Commits][1];
this project adheres to [Semantic Versioning][2].

<br />

## @-xun/project-graph[@3.2.0][3] (2025-06-30)

### ✨ Features

- **packages/graph:** export `vercelignoreConfigProjectBase` ([e784a5e][4])

<br />

### 🏗️ Patch @-xun/project-graph[@3.2.2][5] (2025-07-12)

#### 🪄 Fixes

- **packages/graph:** generate proper aliases for Next.js and Webpack ([9a9a3b4][6])

#### ⚙️ Build System

- **deps:** bump internal monorepo interdependencies to latest versions ([30a969d][7])
- **deps:** bump rejoinder from 2.0.1 to 2.0.2 ([9bf338e][8])

<br />

### 🏗️ Patch @-xun/project-graph[@3.2.1][9] (2025-07-10)

#### ⚙️ Build System

- **deps:** bump @babel/core from 7.27.7 to 7.28.0 ([58c5a3f][10])
- **deps:** bump core-js from 3.43.0 to 3.44.0 ([b4769de][11])
- **deps:** bump internal monorepo interdependencies to latest versions ([e80e40b][12])
- **package:** integrate @-xun/error dependency ([77138f2][13])
- **package:** integrate @-xun/error dependency ([38edc03][14])
- Remove unused dependency ([9b404fe][15])

<br />

## @-xun/project-graph[@3.1.0][16] (2025-06-30)

### ✨ Features

- **packages/graph:** add `wranglerConfigPackageBase` export ([8083fdf][17])

<br />

### 🏗️ Patch @-xun/project-graph[@3.1.1][18] (2025-06-30)

#### 🪄 Fixes

- **packages/graph:** ensure `pathToPackage` is not confused by packages with very similar ids ([30ee33d][19])

<br />

## @-xun/project-graph[@3.0.0][20] (2025-06-30)

### 💥 BREAKING CHANGES 💥

- `nextjsConfigProjectBase` is no longer exported. Use `nextjsConfigPackageBase` instead

### ⚙️ Build System

- **deps:** bump @babel/core from 7.27.4 to 7.27.7 ([13b52c6][21])
- **deps:** bump browserslist from 4.25.0 to 4.25.1 ([bda47da][22])

### 🧙🏿 Refactored

- **packages/graph:** rename `nextjsConfigProjectBase` to `nextjsConfigPackageBase` ([986273c][23])

<br />

## @-xun/project-graph[@2.1.0][24] (2025-06-01)

### ✨ Features

- **packages/graph:** add support for "for-import-hinting" output target in `generateRawAliasMap` ([7607517][25])

<br />

### 🏗️ Patch @-xun/project-graph[@2.1.3][26] (2025-06-14)

#### ⚙️ Build System

- **deps:** bump internal monorepo interdependencies to latest versions ([3832635][27])
- **deps:** bump rejoinder from 2.0.0 to 2.0.1 ([cf9ea16][28])

<br />

### 🏗️ Patch @-xun/project-graph[@2.1.2][29] (2025-06-14)

#### 🪄 Fixes

- **packages/graph:** use proper tailwind config filename ([36ad3c5][30])

#### ⚙️ Build System

- **deps:** bump core-js from 3.42.0 to 3.43.0 ([fa9b209][31])
- **deps:** bump glob from 11.0.2 to 11.0.3 ([696f230][32])
- **deps:** bump internal monorepo interdependencies to latest versions ([5e43030][33])
- **deps:** bump rejoinder from 1.2.5 to 2.0.0 ([2bfcaaf][34])
- **deps:** bump validate-npm-package-name from 6.0.0 to 6.0.1 ([ee34864][35])

<br />

### 🏗️ Patch @-xun/project-graph[@2.1.1][36] (2025-06-01)

#### ⚙️ Build System

- **deps:** bump @-xun/fs from 1.0.0 to 2.0.0 ([3b53775][37])
- **deps:** bump @babel/core from 7.27.3 to 7.27.4 ([dd4af51][38])
- **deps:** bump internal monorepo interdependencies to latest versions ([c5fcdc3][39])

<br />

## @-xun/project-graph[@2.0.0][40] (2025-05-30)

### 💥 BREAKING CHANGES 💥

- Minimum supported node version is now 20.18.0

### ✨ Features

- **packages/graph:** allow different orderings for `generateRawAliasMap` ("for-config" becomes new default) ([e8c7d57][41])
- **packages/graph:** implement `includeInternalTestFiles` support in `gatherPackageBuildTargets` ([2730a29][42])

### ⚙️ Build System

- **deps:** bump @babel/core from 7.26.10 to 7.27.3 ([0902ca0][43])
- **deps:** bump @babel/plugin-syntax-typescript from 7.25.9 to 7.27.1 ([3934f3f][44])
- **deps:** bump @types/semver from 7.5.8 to 7.7.0 ([d5793f7][45])
- **deps:** bump browserslist from 4.24.4 to 4.25.0 ([93c54c3][46])
- **deps:** bump core-js from 3.41.0 to 3.42.0 ([4817bc9][47])
- **deps:** bump glob from 11.0.1 to 11.0.2 ([8b8633b][48])
- **deps:** bump internal monorepo interdependencies to latest versions ([aa08278][49])
- **deps:** bump semver from 7.7.1 to 7.7.2 ([cae84ba][50])
- **deps:** bump type-fest from 4.37.0 to 4.41.0 ([f2dd5c6][51])
- **package:** drop support for node\@18 ([19084da][52])

<br />

## @-xun/project-graph[@1.0.0][53] (2025-02-03)

### ⚙️ Build System

- Integrate externalized @-xun/memoize and bpma packages ([e672064][54])
- **release:** factor @-xun/project multirepo out from symbiote ([880d8ce][55])

<br />

### 🏗️ Patch @-xun/project-graph[@1.0.6][56] (2025-03-19)

#### ⚙️ Build System

- **deps:** bump @-xun/project-fs from 1.0.5 to 1.1.0 ([15c55b3][57])
- **deps:** bump @-xun/project-fs from 1.1.0 to 1.2.0 ([05b46a1][58])
- **deps:** bump core-js from 3.40.0 to 3.41.0 ([902d8d0][59])

<br />

### 🏗️ Patch @-xun/project-graph[@1.0.5][60] (2025-03-13)

#### 🪄 Fixes

- **packages/graph:** ensure .prettierignore files always interpreted relative to project root in `gatherProjectFiles` ([ed9bf6b][61])

#### ⚙️ Build System

- **deps:** bump @babel/core from 7.26.9 to 7.26.10 ([3e991c4][62])

<br />

### 🏗️ Patch @-xun/project-graph[@1.0.4][63] (2025-03-08)

#### ⚙️ Build System

- **deps:** bump type-fest from 4.35.0 to 4.36.0 ([6d029a0][64])
- **deps:** bump type-fest from 4.36.0 to 4.37.0 ([c1f1350][65])

<br />

### 🏗️ Patch @-xun/project-graph[@1.0.3][66] (2025-02-24)

#### 🪄 Fixes

- Handle unnamed packages (and other `XPackageJson` violations) more logically and consistently ([ebf5440][67])

#### ⚙️ Build System

- **deps:** bump @-xun/project-fs from 1.0.2 to 1.0.3 ([1e3a1ac][68])
- **packages/graph:** add missing "@types/semver" package ([6a643c7][69])

<br />

### 🏗️ Patch @-xun/project-graph[@1.0.2][70] (2025-02-17)

#### ⚙️ Build System

- Update @-xun/run to 1.0.1 ([ff90125][71])

<br />

### 🏗️ Patch @-xun/project-graph[@1.0.1][72] (2025-02-06)

#### 🪄 Fixes

- **packages/graph:** ensure `gatherX` exports use internally serializable data structures ([f358b63][73])

#### ⚙️ Build System

- **husky:** skip slow tests ([80a5ed7][74])
- **post-npm-install:** add common-dummies post-install to npm-post-install ([2747383][75])

[1]: https://conventionalcommits.org
[2]: https://semver.org
[3]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@3.1.1...@-xun/project-graph@3.2.0
[4]: https://github.com/Xunnamius/project-utils/commit/e784a5e8ae5bff24c71e3b35914b446e5dd59fe7
[5]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@3.2.1...@-xun/project-graph@3.2.2
[6]: https://github.com/Xunnamius/project-utils/commit/9a9a3b49afedc9f601f0f8cd850533e13b64e53d
[7]: https://github.com/Xunnamius/project-utils/commit/30a969d5eeb5da9fbe0449520ecf624feda68478
[8]: https://github.com/Xunnamius/project-utils/commit/9bf338ea814d069bf784c42b57d7112b4c5c2ea1
[9]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@3.2.0...@-xun/project-graph@3.2.1
[10]: https://github.com/Xunnamius/project-utils/commit/58c5a3feae333ec08a599d72497be1eb7e27921a
[11]: https://github.com/Xunnamius/project-utils/commit/b4769decbf4900d0f6e5a004c8091caf6a4a6d3f
[12]: https://github.com/Xunnamius/project-utils/commit/e80e40bc4fb6e665967b7f63ee216d87dd1563bd
[13]: https://github.com/Xunnamius/project-utils/commit/77138f23ddbeedfbb7756b65dd456f322127f808
[14]: https://github.com/Xunnamius/project-utils/commit/38edc03cff6bcc3e9e5e24ec85841d5d5838af58
[15]: https://github.com/Xunnamius/project-utils/commit/9b404fea29c1270372a5dfc8fffaead63ec97c56
[16]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@3.0.0...@-xun/project-graph@3.1.0
[17]: https://github.com/Xunnamius/project-utils/commit/8083fdfb8119466a16efa45bfe532af41d9ff256
[18]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@3.1.0...@-xun/project-graph@3.1.1
[19]: https://github.com/Xunnamius/project-utils/commit/30ee33dd3f520f95da3402a4b1c6901f010100cc
[20]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@2.1.3...@-xun/project-graph@3.0.0
[21]: https://github.com/Xunnamius/project-utils/commit/13b52c6d6421d2b4d8ce1af424f59e276713e8c0
[22]: https://github.com/Xunnamius/project-utils/commit/bda47dae6be8ce5874f699724d52e9de7ddc8bb7
[23]: https://github.com/Xunnamius/project-utils/commit/986273cd5b37beea573382ae6326ef643e1c39d5
[24]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@2.0.0...@-xun/project-graph@2.1.0
[25]: https://github.com/Xunnamius/project-utils/commit/7607517f14ad401cf959467e106fee9dead50bb3
[26]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@2.1.2...@-xun/project-graph@2.1.3
[27]: https://github.com/Xunnamius/project-utils/commit/3832635848c367fa594a23c71cc52b397ce16ec7
[28]: https://github.com/Xunnamius/project-utils/commit/cf9ea16b8d3dc3725ae0d2f913f63f880f9f7d57
[29]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@2.1.1...@-xun/project-graph@2.1.2
[30]: https://github.com/Xunnamius/project-utils/commit/36ad3c5e29f0b403de316cc06db4fc65e743299c
[31]: https://github.com/Xunnamius/project-utils/commit/fa9b20990f48d0cdc1751387f81ef45633ece018
[32]: https://github.com/Xunnamius/project-utils/commit/696f2308cbfc3edaa2e136ac3b978607ab644e5c
[33]: https://github.com/Xunnamius/project-utils/commit/5e430302a578d730dea4b3897e86097e493cc98f
[34]: https://github.com/Xunnamius/project-utils/commit/2bfcaafe278cb03ca0a140eaecf126b93ce41370
[35]: https://github.com/Xunnamius/project-utils/commit/ee34864ef2f0bd8e7b90e1189c48ed2b49f10406
[36]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@2.1.0...@-xun/project-graph@2.1.1
[37]: https://github.com/Xunnamius/project-utils/commit/3b5377536ea7a23a2424443e8ae9cf837b0c66cf
[38]: https://github.com/Xunnamius/project-utils/commit/dd4af519208e944d143ec79cf156b2a97d918ecd
[39]: https://github.com/Xunnamius/project-utils/commit/c5fcdc366d3971ddd22c7ca6285d620024f7f4f3
[40]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@1.0.6...@-xun/project-graph@2.0.0
[41]: https://github.com/Xunnamius/project-utils/commit/e8c7d57139ab536fa68a7a029a9ed071ed63d1b9
[42]: https://github.com/Xunnamius/project-utils/commit/2730a290426f956d4d09df6f5838fcf6186fbf1f
[43]: https://github.com/Xunnamius/project-utils/commit/0902ca0d45a2de36a813d870e869d5bb1f39c12e
[44]: https://github.com/Xunnamius/project-utils/commit/3934f3f692133a03a2f7818c3bcbc24b57751be1
[45]: https://github.com/Xunnamius/project-utils/commit/d5793f7a7c16f9b2e796eeff50ed8367b773d4ca
[46]: https://github.com/Xunnamius/project-utils/commit/93c54c33873c9e02ceadadc02270680f5b921cb2
[47]: https://github.com/Xunnamius/project-utils/commit/4817bc9ceddd43cbad15030d923f28b258bbe763
[48]: https://github.com/Xunnamius/project-utils/commit/8b8633ba14e8233817a5cca747bcdfbd59cb00c3
[49]: https://github.com/Xunnamius/project-utils/commit/aa08278023d4e011436c9cc0ac32511b2e71f1e8
[50]: https://github.com/Xunnamius/project-utils/commit/cae84baeaf7ce595867cb694b2a1d0333ee3cfa9
[51]: https://github.com/Xunnamius/project-utils/commit/f2dd5c645578f4eff798c2e342b144070c69cd59
[52]: https://github.com/Xunnamius/project-utils/commit/19084dae491dd3fb1056b307e670a0d5c6baeaf6
[53]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@0.0.0-init...@-xun/project-graph@1.0.0
[54]: https://github.com/Xunnamius/project-utils/commit/e6720648fa9dc975b0426fb558b4c4b10c6b2e73
[55]: https://github.com/Xunnamius/project-utils/commit/880d8ce103b19a190f99c2f5db4ca46d8da97664
[56]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@1.0.5...@-xun/project-graph@1.0.6
[57]: https://github.com/Xunnamius/project-utils/commit/15c55b3090095f9112ac67d134a3cfcf85094b42
[58]: https://github.com/Xunnamius/project-utils/commit/05b46a1dadbcb5e3519419043e79b5162dca2ab2
[59]: https://github.com/Xunnamius/project-utils/commit/902d8d0ecc927439df54b7959d7ce922d110df84
[60]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@1.0.4...@-xun/project-graph@1.0.5
[61]: https://github.com/Xunnamius/project-utils/commit/ed9bf6b9d6ec764bb105db626cfab54857141172
[62]: https://github.com/Xunnamius/project-utils/commit/3e991c46f16a5bafd09198df2bfc5d03714cbf1e
[63]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@1.0.3...@-xun/project-graph@1.0.4
[64]: https://github.com/Xunnamius/project-utils/commit/6d029a07b5c2c97465a53d0d7645a606c8ff76d0
[65]: https://github.com/Xunnamius/project-utils/commit/c1f1350fd0c4ab07a7f479dc97132824c003a59f
[66]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@1.0.2...@-xun/project-graph@1.0.3
[67]: https://github.com/Xunnamius/project-utils/commit/ebf54405456d5ea4b1a9fbe57c92ad44289d3b1b
[68]: https://github.com/Xunnamius/project-utils/commit/1e3a1acb0971ec922bd552eb50611364c2c5b9ba
[69]: https://github.com/Xunnamius/project-utils/commit/6a643c7575f40293f9c55119a69a7e2c0cc5269a
[70]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@1.0.1...@-xun/project-graph@1.0.2
[71]: https://github.com/Xunnamius/project-utils/commit/ff90125e0338879bf7bf87de3d6d4aed56521e4c
[72]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@1.0.0...@-xun/project-graph@1.0.1
[73]: https://github.com/Xunnamius/project-utils/commit/f358b6316be918b22cfc98428568deedc3ca7dd7
[74]: https://github.com/Xunnamius/project-utils/commit/80a5ed7472360ab582a2244137ed53d9f14dcec5
[75]: https://github.com/Xunnamius/project-utils/commit/274738346fdc425d391c09d88ec14c504de107a1
