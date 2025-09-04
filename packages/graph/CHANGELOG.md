# Changelog

All notable changes to this project will be documented in this auto-generated
file. The format is based on [Conventional Commits][1];
this project adheres to [Semantic Versioning][2].

<br />

## @-xun/project-graph[@3.2.0][3] (2025-06-30)

### ✨ Features

- **packages/graph:** export `vercelignoreConfigProjectBase` ([e784a5e][4])

<br />

### 🏗️ Patch @-xun/project-graph[@3.2.3][5] (2025-09-04)

#### ⚙️ Build System

- **deps:** bump @babel/core from 7.28.0 to 7.28.3 ([c45f4b6][6])
- **deps:** bump @types/semver from 7.7.0 to 7.7.1 ([4363d94][7])
- **deps:** bump babel-plugin-metadata-accumulator from 1.0.1 to 1.0.2 ([2018709][8])
- **deps:** bump browserslist from 4.25.1 to 4.25.4 ([353aef2][9])
- **deps:** bump core-js from 3.44.0 to 3.45.1 ([3b85fbd][10])
- **deps:** bump internal monorepo interdependencies to latest versions ([8a4893d][11])
- **deps:** bump rejoinder from 2.0.2 to 2.1.0 ([ce71905][12])
- **deps:** bump validate-npm-package-name from 6.0.1 to 6.0.2 ([7ee5e7a][13])

<br />

### 🏗️ Patch @-xun/project-graph[@3.2.2][14] (2025-07-12)

#### 🪄 Fixes

- **packages/graph:** generate proper aliases for Next.js and Webpack ([9a9a3b4][15])

#### ⚙️ Build System

- **deps:** bump internal monorepo interdependencies to latest versions ([30a969d][16])
- **deps:** bump rejoinder from 2.0.1 to 2.0.2 ([9bf338e][17])

<br />

### 🏗️ Patch @-xun/project-graph[@3.2.1][18] (2025-07-10)

#### ⚙️ Build System

- **deps:** bump @babel/core from 7.27.7 to 7.28.0 ([58c5a3f][19])
- **deps:** bump core-js from 3.43.0 to 3.44.0 ([b4769de][20])
- **deps:** bump internal monorepo interdependencies to latest versions ([e80e40b][21])
- **package:** integrate @-xun/error dependency ([77138f2][22])
- **package:** integrate @-xun/error dependency ([38edc03][23])
- Remove unused dependency ([9b404fe][24])

<br />

## @-xun/project-graph[@3.1.0][25] (2025-06-30)

### ✨ Features

- **packages/graph:** add `wranglerConfigPackageBase` export ([8083fdf][26])

<br />

### 🏗️ Patch @-xun/project-graph[@3.1.1][27] (2025-06-30)

#### 🪄 Fixes

- **packages/graph:** ensure `pathToPackage` is not confused by packages with very similar ids ([30ee33d][28])

<br />

## @-xun/project-graph[@3.0.0][29] (2025-06-30)

### 💥 BREAKING CHANGES 💥

- `nextjsConfigProjectBase` is no longer exported. Use `nextjsConfigPackageBase` instead

### ⚙️ Build System

- **deps:** bump @babel/core from 7.27.4 to 7.27.7 ([13b52c6][30])
- **deps:** bump browserslist from 4.25.0 to 4.25.1 ([bda47da][31])

### 🧙🏿 Refactored

- **packages/graph:** rename `nextjsConfigProjectBase` to `nextjsConfigPackageBase` ([986273c][32])

<br />

## @-xun/project-graph[@2.1.0][33] (2025-06-01)

### ✨ Features

- **packages/graph:** add support for "for-import-hinting" output target in `generateRawAliasMap` ([7607517][34])

<br />

### 🏗️ Patch @-xun/project-graph[@2.1.3][35] (2025-06-14)

#### ⚙️ Build System

- **deps:** bump internal monorepo interdependencies to latest versions ([3832635][36])
- **deps:** bump rejoinder from 2.0.0 to 2.0.1 ([cf9ea16][37])

<br />

### 🏗️ Patch @-xun/project-graph[@2.1.2][38] (2025-06-14)

#### 🪄 Fixes

- **packages/graph:** use proper tailwind config filename ([36ad3c5][39])

#### ⚙️ Build System

- **deps:** bump core-js from 3.42.0 to 3.43.0 ([fa9b209][40])
- **deps:** bump glob from 11.0.2 to 11.0.3 ([696f230][41])
- **deps:** bump internal monorepo interdependencies to latest versions ([5e43030][42])
- **deps:** bump rejoinder from 1.2.5 to 2.0.0 ([2bfcaaf][43])
- **deps:** bump validate-npm-package-name from 6.0.0 to 6.0.1 ([ee34864][44])

<br />

### 🏗️ Patch @-xun/project-graph[@2.1.1][45] (2025-06-01)

#### ⚙️ Build System

- **deps:** bump @-xun/fs from 1.0.0 to 2.0.0 ([3b53775][46])
- **deps:** bump @babel/core from 7.27.3 to 7.27.4 ([dd4af51][47])
- **deps:** bump internal monorepo interdependencies to latest versions ([c5fcdc3][48])

<br />

## @-xun/project-graph[@2.0.0][49] (2025-05-30)

### 💥 BREAKING CHANGES 💥

- Minimum supported node version is now 20.18.0

### ✨ Features

- **packages/graph:** allow different orderings for `generateRawAliasMap` ("for-config" becomes new default) ([e8c7d57][50])
- **packages/graph:** implement `includeInternalTestFiles` support in `gatherPackageBuildTargets` ([2730a29][51])

### ⚙️ Build System

- **deps:** bump @babel/core from 7.26.10 to 7.27.3 ([0902ca0][52])
- **deps:** bump @babel/plugin-syntax-typescript from 7.25.9 to 7.27.1 ([3934f3f][53])
- **deps:** bump @types/semver from 7.5.8 to 7.7.0 ([d5793f7][54])
- **deps:** bump browserslist from 4.24.4 to 4.25.0 ([93c54c3][55])
- **deps:** bump core-js from 3.41.0 to 3.42.0 ([4817bc9][56])
- **deps:** bump glob from 11.0.1 to 11.0.2 ([8b8633b][57])
- **deps:** bump internal monorepo interdependencies to latest versions ([aa08278][58])
- **deps:** bump semver from 7.7.1 to 7.7.2 ([cae84ba][59])
- **deps:** bump type-fest from 4.37.0 to 4.41.0 ([f2dd5c6][60])
- **package:** drop support for node\@18 ([19084da][61])

<br />

## @-xun/project-graph[@1.0.0][62] (2025-02-03)

### ⚙️ Build System

- Integrate externalized @-xun/memoize and bpma packages ([e672064][63])
- **release:** factor @-xun/project multirepo out from symbiote ([880d8ce][64])

<br />

### 🏗️ Patch @-xun/project-graph[@1.0.6][65] (2025-03-19)

#### ⚙️ Build System

- **deps:** bump @-xun/project-fs from 1.0.5 to 1.1.0 ([15c55b3][66])
- **deps:** bump @-xun/project-fs from 1.1.0 to 1.2.0 ([05b46a1][67])
- **deps:** bump core-js from 3.40.0 to 3.41.0 ([902d8d0][68])

<br />

### 🏗️ Patch @-xun/project-graph[@1.0.5][69] (2025-03-13)

#### 🪄 Fixes

- **packages/graph:** ensure .prettierignore files always interpreted relative to project root in `gatherProjectFiles` ([ed9bf6b][70])

#### ⚙️ Build System

- **deps:** bump @babel/core from 7.26.9 to 7.26.10 ([3e991c4][71])

<br />

### 🏗️ Patch @-xun/project-graph[@1.0.4][72] (2025-03-08)

#### ⚙️ Build System

- **deps:** bump type-fest from 4.35.0 to 4.36.0 ([6d029a0][73])
- **deps:** bump type-fest from 4.36.0 to 4.37.0 ([c1f1350][74])

<br />

### 🏗️ Patch @-xun/project-graph[@1.0.3][75] (2025-02-24)

#### 🪄 Fixes

- Handle unnamed packages (and other `XPackageJson` violations) more logically and consistently ([ebf5440][76])

#### ⚙️ Build System

- **deps:** bump @-xun/project-fs from 1.0.2 to 1.0.3 ([1e3a1ac][77])
- **packages/graph:** add missing "@types/semver" package ([6a643c7][78])

<br />

### 🏗️ Patch @-xun/project-graph[@1.0.2][79] (2025-02-17)

#### ⚙️ Build System

- Update @-xun/run to 1.0.1 ([ff90125][80])

<br />

### 🏗️ Patch @-xun/project-graph[@1.0.1][81] (2025-02-06)

#### 🪄 Fixes

- **packages/graph:** ensure `gatherX` exports use internally serializable data structures ([f358b63][82])

#### ⚙️ Build System

- **husky:** skip slow tests ([80a5ed7][83])
- **post-npm-install:** add common-dummies post-install to npm-post-install ([2747383][84])

[1]: https://conventionalcommits.org
[2]: https://semver.org
[3]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@3.1.1...@-xun/project-graph@3.2.0
[4]: https://github.com/Xunnamius/project-utils/commit/e784a5e8ae5bff24c71e3b35914b446e5dd59fe7
[5]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@3.2.2...@-xun/project-graph@3.2.3
[6]: https://github.com/Xunnamius/project-utils/commit/c45f4b6fbebda0ccd6cb68c9adc36fb3c3999f4a
[7]: https://github.com/Xunnamius/project-utils/commit/4363d94e12a24f374f8407d8f7c3f3466f0283bb
[8]: https://github.com/Xunnamius/project-utils/commit/2018709d17a5e2bfe2906a8d169125b184113acd
[9]: https://github.com/Xunnamius/project-utils/commit/353aef2aeda1d85186174e7ce7c37139bb90b81a
[10]: https://github.com/Xunnamius/project-utils/commit/3b85fbd741820b65331c6833756801c8ec755cdf
[11]: https://github.com/Xunnamius/project-utils/commit/8a4893d14519c4798127a94ac2c3f19a1a5085ca
[12]: https://github.com/Xunnamius/project-utils/commit/ce71905dcd071bd22c126222902a1ca0ccff8a8e
[13]: https://github.com/Xunnamius/project-utils/commit/7ee5e7a0fda7e737c7af709aa45b27643c9a726c
[14]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@3.2.1...@-xun/project-graph@3.2.2
[15]: https://github.com/Xunnamius/project-utils/commit/9a9a3b49afedc9f601f0f8cd850533e13b64e53d
[16]: https://github.com/Xunnamius/project-utils/commit/30a969d5eeb5da9fbe0449520ecf624feda68478
[17]: https://github.com/Xunnamius/project-utils/commit/9bf338ea814d069bf784c42b57d7112b4c5c2ea1
[18]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@3.2.0...@-xun/project-graph@3.2.1
[19]: https://github.com/Xunnamius/project-utils/commit/58c5a3feae333ec08a599d72497be1eb7e27921a
[20]: https://github.com/Xunnamius/project-utils/commit/b4769decbf4900d0f6e5a004c8091caf6a4a6d3f
[21]: https://github.com/Xunnamius/project-utils/commit/e80e40bc4fb6e665967b7f63ee216d87dd1563bd
[22]: https://github.com/Xunnamius/project-utils/commit/77138f23ddbeedfbb7756b65dd456f322127f808
[23]: https://github.com/Xunnamius/project-utils/commit/38edc03cff6bcc3e9e5e24ec85841d5d5838af58
[24]: https://github.com/Xunnamius/project-utils/commit/9b404fea29c1270372a5dfc8fffaead63ec97c56
[25]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@3.0.0...@-xun/project-graph@3.1.0
[26]: https://github.com/Xunnamius/project-utils/commit/8083fdfb8119466a16efa45bfe532af41d9ff256
[27]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@3.1.0...@-xun/project-graph@3.1.1
[28]: https://github.com/Xunnamius/project-utils/commit/30ee33dd3f520f95da3402a4b1c6901f010100cc
[29]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@2.1.3...@-xun/project-graph@3.0.0
[30]: https://github.com/Xunnamius/project-utils/commit/13b52c6d6421d2b4d8ce1af424f59e276713e8c0
[31]: https://github.com/Xunnamius/project-utils/commit/bda47dae6be8ce5874f699724d52e9de7ddc8bb7
[32]: https://github.com/Xunnamius/project-utils/commit/986273cd5b37beea573382ae6326ef643e1c39d5
[33]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@2.0.0...@-xun/project-graph@2.1.0
[34]: https://github.com/Xunnamius/project-utils/commit/7607517f14ad401cf959467e106fee9dead50bb3
[35]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@2.1.2...@-xun/project-graph@2.1.3
[36]: https://github.com/Xunnamius/project-utils/commit/3832635848c367fa594a23c71cc52b397ce16ec7
[37]: https://github.com/Xunnamius/project-utils/commit/cf9ea16b8d3dc3725ae0d2f913f63f880f9f7d57
[38]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@2.1.1...@-xun/project-graph@2.1.2
[39]: https://github.com/Xunnamius/project-utils/commit/36ad3c5e29f0b403de316cc06db4fc65e743299c
[40]: https://github.com/Xunnamius/project-utils/commit/fa9b20990f48d0cdc1751387f81ef45633ece018
[41]: https://github.com/Xunnamius/project-utils/commit/696f2308cbfc3edaa2e136ac3b978607ab644e5c
[42]: https://github.com/Xunnamius/project-utils/commit/5e430302a578d730dea4b3897e86097e493cc98f
[43]: https://github.com/Xunnamius/project-utils/commit/2bfcaafe278cb03ca0a140eaecf126b93ce41370
[44]: https://github.com/Xunnamius/project-utils/commit/ee34864ef2f0bd8e7b90e1189c48ed2b49f10406
[45]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@2.1.0...@-xun/project-graph@2.1.1
[46]: https://github.com/Xunnamius/project-utils/commit/3b5377536ea7a23a2424443e8ae9cf837b0c66cf
[47]: https://github.com/Xunnamius/project-utils/commit/dd4af519208e944d143ec79cf156b2a97d918ecd
[48]: https://github.com/Xunnamius/project-utils/commit/c5fcdc366d3971ddd22c7ca6285d620024f7f4f3
[49]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@1.0.6...@-xun/project-graph@2.0.0
[50]: https://github.com/Xunnamius/project-utils/commit/e8c7d57139ab536fa68a7a029a9ed071ed63d1b9
[51]: https://github.com/Xunnamius/project-utils/commit/2730a290426f956d4d09df6f5838fcf6186fbf1f
[52]: https://github.com/Xunnamius/project-utils/commit/0902ca0d45a2de36a813d870e869d5bb1f39c12e
[53]: https://github.com/Xunnamius/project-utils/commit/3934f3f692133a03a2f7818c3bcbc24b57751be1
[54]: https://github.com/Xunnamius/project-utils/commit/d5793f7a7c16f9b2e796eeff50ed8367b773d4ca
[55]: https://github.com/Xunnamius/project-utils/commit/93c54c33873c9e02ceadadc02270680f5b921cb2
[56]: https://github.com/Xunnamius/project-utils/commit/4817bc9ceddd43cbad15030d923f28b258bbe763
[57]: https://github.com/Xunnamius/project-utils/commit/8b8633ba14e8233817a5cca747bcdfbd59cb00c3
[58]: https://github.com/Xunnamius/project-utils/commit/aa08278023d4e011436c9cc0ac32511b2e71f1e8
[59]: https://github.com/Xunnamius/project-utils/commit/cae84baeaf7ce595867cb694b2a1d0333ee3cfa9
[60]: https://github.com/Xunnamius/project-utils/commit/f2dd5c645578f4eff798c2e342b144070c69cd59
[61]: https://github.com/Xunnamius/project-utils/commit/19084dae491dd3fb1056b307e670a0d5c6baeaf6
[62]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@0.0.0-init...@-xun/project-graph@1.0.0
[63]: https://github.com/Xunnamius/project-utils/commit/e6720648fa9dc975b0426fb558b4c4b10c6b2e73
[64]: https://github.com/Xunnamius/project-utils/commit/880d8ce103b19a190f99c2f5db4ca46d8da97664
[65]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@1.0.5...@-xun/project-graph@1.0.6
[66]: https://github.com/Xunnamius/project-utils/commit/15c55b3090095f9112ac67d134a3cfcf85094b42
[67]: https://github.com/Xunnamius/project-utils/commit/05b46a1dadbcb5e3519419043e79b5162dca2ab2
[68]: https://github.com/Xunnamius/project-utils/commit/902d8d0ecc927439df54b7959d7ce922d110df84
[69]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@1.0.4...@-xun/project-graph@1.0.5
[70]: https://github.com/Xunnamius/project-utils/commit/ed9bf6b9d6ec764bb105db626cfab54857141172
[71]: https://github.com/Xunnamius/project-utils/commit/3e991c46f16a5bafd09198df2bfc5d03714cbf1e
[72]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@1.0.3...@-xun/project-graph@1.0.4
[73]: https://github.com/Xunnamius/project-utils/commit/6d029a07b5c2c97465a53d0d7645a606c8ff76d0
[74]: https://github.com/Xunnamius/project-utils/commit/c1f1350fd0c4ab07a7f479dc97132824c003a59f
[75]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@1.0.2...@-xun/project-graph@1.0.3
[76]: https://github.com/Xunnamius/project-utils/commit/ebf54405456d5ea4b1a9fbe57c92ad44289d3b1b
[77]: https://github.com/Xunnamius/project-utils/commit/1e3a1acb0971ec922bd552eb50611364c2c5b9ba
[78]: https://github.com/Xunnamius/project-utils/commit/6a643c7575f40293f9c55119a69a7e2c0cc5269a
[79]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@1.0.1...@-xun/project-graph@1.0.2
[80]: https://github.com/Xunnamius/project-utils/commit/ff90125e0338879bf7bf87de3d6d4aed56521e4c
[81]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@1.0.0...@-xun/project-graph@1.0.1
[82]: https://github.com/Xunnamius/project-utils/commit/f358b6316be918b22cfc98428568deedc3ca7dd7
[83]: https://github.com/Xunnamius/project-utils/commit/80a5ed7472360ab582a2244137ed53d9f14dcec5
[84]: https://github.com/Xunnamius/project-utils/commit/274738346fdc425d391c09d88ec14c504de107a1
