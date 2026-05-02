# Changelog

All notable changes to this project will be documented in this auto-generated
file. The format is based on [Conventional Commits][1];
this project adheres to [Semantic Versioning][2].

<br />

## @-xun/project-graph[@3.2.0][3] (2025-06-30)

### ✨ Features

- **packages/graph:** export `vercelignoreConfigProjectBase` ([e784a5e][4])

<br />

### 🏗️ Patch @-xun/project-graph[@3.2.4][5] (2026-05-02)

#### 🪄 Fixes

- **packages/graph:** upgrade typescript 6.0 alias paths to include leading ./ ([5bc3b9c][6])

#### ⚙️ Build System

- **deps:** bump @babel/core from 7.28.3 to 7.29.0 ([5edb29f][7])
- **deps:** bump @babel/plugin-syntax-typescript from 7.27.1 to 7.28.6 ([9f08bc8][8])
- **deps:** bump browserslist from 4.25.4 to 4.28.2 ([2ea2ec0][9])
- **deps:** bump core-js from 3.45.1 to 3.49.0 ([728ac8b][10])
- **deps:** bump glob from 11.0.3 to 13.0.6 ([55a1bcc][11])
- **deps:** bump internal monorepo interdependencies to latest versions ([04f95d1][12])
- **deps:** bump semver from 7.7.2 to 7.7.4 ([7d64bc2][13])
- **deps:** bump type-fest from 4.41.0 to 5.6.0 ([15e695d][14])
- **deps:** bump validate-npm-package-name from 6.0.2 to 7.0.2 ([50476f3][15])

<br />

### 🏗️ Patch @-xun/project-graph[@3.2.3][16] (2025-09-04)

#### ⚙️ Build System

- **deps:** bump @babel/core from 7.28.0 to 7.28.3 ([c45f4b6][17])
- **deps:** bump @types/semver from 7.7.0 to 7.7.1 ([4363d94][18])
- **deps:** bump babel-plugin-metadata-accumulator from 1.0.1 to 1.0.2 ([2018709][19])
- **deps:** bump browserslist from 4.25.1 to 4.25.4 ([353aef2][20])
- **deps:** bump core-js from 3.44.0 to 3.45.1 ([3b85fbd][21])
- **deps:** bump internal monorepo interdependencies to latest versions ([8a4893d][22])
- **deps:** bump rejoinder from 2.0.2 to 2.1.0 ([ce71905][23])
- **deps:** bump validate-npm-package-name from 6.0.1 to 6.0.2 ([7ee5e7a][24])

<br />

### 🏗️ Patch @-xun/project-graph[@3.2.2][25] (2025-07-12)

#### 🪄 Fixes

- **packages/graph:** generate proper aliases for Next.js and Webpack ([9a9a3b4][26])

#### ⚙️ Build System

- **deps:** bump internal monorepo interdependencies to latest versions ([30a969d][27])
- **deps:** bump rejoinder from 2.0.1 to 2.0.2 ([9bf338e][28])

<br />

### 🏗️ Patch @-xun/project-graph[@3.2.1][29] (2025-07-10)

#### ⚙️ Build System

- **deps:** bump @babel/core from 7.27.7 to 7.28.0 ([58c5a3f][30])
- **deps:** bump core-js from 3.43.0 to 3.44.0 ([b4769de][31])
- **deps:** bump internal monorepo interdependencies to latest versions ([e80e40b][32])
- **package:** integrate @-xun/error dependency ([77138f2][33])
- **package:** integrate @-xun/error dependency ([38edc03][34])
- Remove unused dependency ([9b404fe][35])

<br />

## @-xun/project-graph[@3.1.0][36] (2025-06-30)

### ✨ Features

- **packages/graph:** add `wranglerConfigPackageBase` export ([8083fdf][37])

<br />

### 🏗️ Patch @-xun/project-graph[@3.1.1][38] (2025-06-30)

#### 🪄 Fixes

- **packages/graph:** ensure `pathToPackage` is not confused by packages with very similar ids ([30ee33d][39])

<br />

## @-xun/project-graph[@3.0.0][40] (2025-06-30)

### 💥 BREAKING CHANGES 💥

- `nextjsConfigProjectBase` is no longer exported. Use `nextjsConfigPackageBase` instead

### ⚙️ Build System

- **deps:** bump @babel/core from 7.27.4 to 7.27.7 ([13b52c6][41])
- **deps:** bump browserslist from 4.25.0 to 4.25.1 ([bda47da][42])

### 🧙🏿 Refactored

- **packages/graph:** rename `nextjsConfigProjectBase` to `nextjsConfigPackageBase` ([986273c][43])

<br />

## @-xun/project-graph[@2.1.0][44] (2025-06-01)

### ✨ Features

- **packages/graph:** add support for "for-import-hinting" output target in `generateRawAliasMap` ([7607517][45])

<br />

### 🏗️ Patch @-xun/project-graph[@2.1.3][46] (2025-06-14)

#### ⚙️ Build System

- **deps:** bump internal monorepo interdependencies to latest versions ([3832635][47])
- **deps:** bump rejoinder from 2.0.0 to 2.0.1 ([cf9ea16][48])

<br />

### 🏗️ Patch @-xun/project-graph[@2.1.2][49] (2025-06-14)

#### 🪄 Fixes

- **packages/graph:** use proper tailwind config filename ([36ad3c5][50])

#### ⚙️ Build System

- **deps:** bump core-js from 3.42.0 to 3.43.0 ([fa9b209][51])
- **deps:** bump glob from 11.0.2 to 11.0.3 ([696f230][52])
- **deps:** bump internal monorepo interdependencies to latest versions ([5e43030][53])
- **deps:** bump rejoinder from 1.2.5 to 2.0.0 ([2bfcaaf][54])
- **deps:** bump validate-npm-package-name from 6.0.0 to 6.0.1 ([ee34864][55])

<br />

### 🏗️ Patch @-xun/project-graph[@2.1.1][56] (2025-06-01)

#### ⚙️ Build System

- **deps:** bump @-xun/fs from 1.0.0 to 2.0.0 ([3b53775][57])
- **deps:** bump @babel/core from 7.27.3 to 7.27.4 ([dd4af51][58])
- **deps:** bump internal monorepo interdependencies to latest versions ([c5fcdc3][59])

<br />

## @-xun/project-graph[@2.0.0][60] (2025-05-30)

### 💥 BREAKING CHANGES 💥

- Minimum supported node version is now 20.18.0

### ✨ Features

- **packages/graph:** allow different orderings for `generateRawAliasMap` ("for-config" becomes new default) ([e8c7d57][61])
- **packages/graph:** implement `includeInternalTestFiles` support in `gatherPackageBuildTargets` ([2730a29][62])

### ⚙️ Build System

- **deps:** bump @babel/core from 7.26.10 to 7.27.3 ([0902ca0][63])
- **deps:** bump @babel/plugin-syntax-typescript from 7.25.9 to 7.27.1 ([3934f3f][64])
- **deps:** bump @types/semver from 7.5.8 to 7.7.0 ([d5793f7][65])
- **deps:** bump browserslist from 4.24.4 to 4.25.0 ([93c54c3][66])
- **deps:** bump core-js from 3.41.0 to 3.42.0 ([4817bc9][67])
- **deps:** bump glob from 11.0.1 to 11.0.2 ([8b8633b][68])
- **deps:** bump internal monorepo interdependencies to latest versions ([aa08278][69])
- **deps:** bump semver from 7.7.1 to 7.7.2 ([cae84ba][70])
- **deps:** bump type-fest from 4.37.0 to 4.41.0 ([f2dd5c6][71])
- **package:** drop support for node\@18 ([19084da][72])

<br />

## @-xun/project-graph[@1.0.0][73] (2025-02-03)

### ⚙️ Build System

- Integrate externalized @-xun/memoize and bpma packages ([e672064][74])
- **release:** factor @-xun/project multirepo out from symbiote ([880d8ce][75])

<br />

### 🏗️ Patch @-xun/project-graph[@1.0.6][76] (2025-03-19)

#### ⚙️ Build System

- **deps:** bump @-xun/project-fs from 1.0.5 to 1.1.0 ([15c55b3][77])
- **deps:** bump @-xun/project-fs from 1.1.0 to 1.2.0 ([05b46a1][78])
- **deps:** bump core-js from 3.40.0 to 3.41.0 ([902d8d0][79])

<br />

### 🏗️ Patch @-xun/project-graph[@1.0.5][80] (2025-03-13)

#### 🪄 Fixes

- **packages/graph:** ensure .prettierignore files always interpreted relative to project root in `gatherProjectFiles` ([ed9bf6b][81])

#### ⚙️ Build System

- **deps:** bump @babel/core from 7.26.9 to 7.26.10 ([3e991c4][82])

<br />

### 🏗️ Patch @-xun/project-graph[@1.0.4][83] (2025-03-08)

#### ⚙️ Build System

- **deps:** bump type-fest from 4.35.0 to 4.36.0 ([6d029a0][84])
- **deps:** bump type-fest from 4.36.0 to 4.37.0 ([c1f1350][85])

<br />

### 🏗️ Patch @-xun/project-graph[@1.0.3][86] (2025-02-24)

#### 🪄 Fixes

- Handle unnamed packages (and other `XPackageJson` violations) more logically and consistently ([ebf5440][87])

#### ⚙️ Build System

- **deps:** bump @-xun/project-fs from 1.0.2 to 1.0.3 ([1e3a1ac][88])
- **packages/graph:** add missing "@types/semver" package ([6a643c7][89])

<br />

### 🏗️ Patch @-xun/project-graph[@1.0.2][90] (2025-02-17)

#### ⚙️ Build System

- Update @-xun/run to 1.0.1 ([ff90125][91])

<br />

### 🏗️ Patch @-xun/project-graph[@1.0.1][92] (2025-02-06)

#### 🪄 Fixes

- **packages/graph:** ensure `gatherX` exports use internally serializable data structures ([f358b63][93])

#### ⚙️ Build System

- **husky:** skip slow tests ([80a5ed7][94])
- **post-npm-install:** add common-dummies post-install to npm-post-install ([2747383][95])

[1]: https://conventionalcommits.org
[2]: https://semver.org
[3]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@3.1.1...@-xun/project-graph@3.2.0
[4]: https://github.com/Xunnamius/project-utils/commit/e784a5e8ae5bff24c71e3b35914b446e5dd59fe7
[5]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@3.2.3...@-xun/project-graph@3.2.4
[6]: https://github.com/Xunnamius/project-utils/commit/5bc3b9cb02af1296c29666badda4c86af6c33d68
[7]: https://github.com/Xunnamius/project-utils/commit/5edb29ff401096ee87f14b414b63f57c4285d5fb
[8]: https://github.com/Xunnamius/project-utils/commit/9f08bc89ad53ac2cad20bc59d2ac2e75dd55f4dc
[9]: https://github.com/Xunnamius/project-utils/commit/2ea2ec09c4054585bed4e0cfef79e83bd78c823b
[10]: https://github.com/Xunnamius/project-utils/commit/728ac8b66e20351aa6724e65e6ee0c0aa5bb835c
[11]: https://github.com/Xunnamius/project-utils/commit/55a1bcca8a5918bffd1293c33b06394fbdc48aae
[12]: https://github.com/Xunnamius/project-utils/commit/04f95d1a4721e5fa5d768c0ae17e14c61f26e423
[13]: https://github.com/Xunnamius/project-utils/commit/7d64bc248c15a4fcb127e2b0e8ee61b4a3c5396c
[14]: https://github.com/Xunnamius/project-utils/commit/15e695dbe90bc299704053102873801010b210a9
[15]: https://github.com/Xunnamius/project-utils/commit/50476f312811972cf18165cd7f9bf8568cd13c66
[16]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@3.2.2...@-xun/project-graph@3.2.3
[17]: https://github.com/Xunnamius/project-utils/commit/c45f4b6fbebda0ccd6cb68c9adc36fb3c3999f4a
[18]: https://github.com/Xunnamius/project-utils/commit/4363d94e12a24f374f8407d8f7c3f3466f0283bb
[19]: https://github.com/Xunnamius/project-utils/commit/2018709d17a5e2bfe2906a8d169125b184113acd
[20]: https://github.com/Xunnamius/project-utils/commit/353aef2aeda1d85186174e7ce7c37139bb90b81a
[21]: https://github.com/Xunnamius/project-utils/commit/3b85fbd741820b65331c6833756801c8ec755cdf
[22]: https://github.com/Xunnamius/project-utils/commit/8a4893d14519c4798127a94ac2c3f19a1a5085ca
[23]: https://github.com/Xunnamius/project-utils/commit/ce71905dcd071bd22c126222902a1ca0ccff8a8e
[24]: https://github.com/Xunnamius/project-utils/commit/7ee5e7a0fda7e737c7af709aa45b27643c9a726c
[25]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@3.2.1...@-xun/project-graph@3.2.2
[26]: https://github.com/Xunnamius/project-utils/commit/9a9a3b49afedc9f601f0f8cd850533e13b64e53d
[27]: https://github.com/Xunnamius/project-utils/commit/30a969d5eeb5da9fbe0449520ecf624feda68478
[28]: https://github.com/Xunnamius/project-utils/commit/9bf338ea814d069bf784c42b57d7112b4c5c2ea1
[29]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@3.2.0...@-xun/project-graph@3.2.1
[30]: https://github.com/Xunnamius/project-utils/commit/58c5a3feae333ec08a599d72497be1eb7e27921a
[31]: https://github.com/Xunnamius/project-utils/commit/b4769decbf4900d0f6e5a004c8091caf6a4a6d3f
[32]: https://github.com/Xunnamius/project-utils/commit/e80e40bc4fb6e665967b7f63ee216d87dd1563bd
[33]: https://github.com/Xunnamius/project-utils/commit/77138f23ddbeedfbb7756b65dd456f322127f808
[34]: https://github.com/Xunnamius/project-utils/commit/38edc03cff6bcc3e9e5e24ec85841d5d5838af58
[35]: https://github.com/Xunnamius/project-utils/commit/9b404fea29c1270372a5dfc8fffaead63ec97c56
[36]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@3.0.0...@-xun/project-graph@3.1.0
[37]: https://github.com/Xunnamius/project-utils/commit/8083fdfb8119466a16efa45bfe532af41d9ff256
[38]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@3.1.0...@-xun/project-graph@3.1.1
[39]: https://github.com/Xunnamius/project-utils/commit/30ee33dd3f520f95da3402a4b1c6901f010100cc
[40]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@2.1.3...@-xun/project-graph@3.0.0
[41]: https://github.com/Xunnamius/project-utils/commit/13b52c6d6421d2b4d8ce1af424f59e276713e8c0
[42]: https://github.com/Xunnamius/project-utils/commit/bda47dae6be8ce5874f699724d52e9de7ddc8bb7
[43]: https://github.com/Xunnamius/project-utils/commit/986273cd5b37beea573382ae6326ef643e1c39d5
[44]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@2.0.0...@-xun/project-graph@2.1.0
[45]: https://github.com/Xunnamius/project-utils/commit/7607517f14ad401cf959467e106fee9dead50bb3
[46]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@2.1.2...@-xun/project-graph@2.1.3
[47]: https://github.com/Xunnamius/project-utils/commit/3832635848c367fa594a23c71cc52b397ce16ec7
[48]: https://github.com/Xunnamius/project-utils/commit/cf9ea16b8d3dc3725ae0d2f913f63f880f9f7d57
[49]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@2.1.1...@-xun/project-graph@2.1.2
[50]: https://github.com/Xunnamius/project-utils/commit/36ad3c5e29f0b403de316cc06db4fc65e743299c
[51]: https://github.com/Xunnamius/project-utils/commit/fa9b20990f48d0cdc1751387f81ef45633ece018
[52]: https://github.com/Xunnamius/project-utils/commit/696f2308cbfc3edaa2e136ac3b978607ab644e5c
[53]: https://github.com/Xunnamius/project-utils/commit/5e430302a578d730dea4b3897e86097e493cc98f
[54]: https://github.com/Xunnamius/project-utils/commit/2bfcaafe278cb03ca0a140eaecf126b93ce41370
[55]: https://github.com/Xunnamius/project-utils/commit/ee34864ef2f0bd8e7b90e1189c48ed2b49f10406
[56]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@2.1.0...@-xun/project-graph@2.1.1
[57]: https://github.com/Xunnamius/project-utils/commit/3b5377536ea7a23a2424443e8ae9cf837b0c66cf
[58]: https://github.com/Xunnamius/project-utils/commit/dd4af519208e944d143ec79cf156b2a97d918ecd
[59]: https://github.com/Xunnamius/project-utils/commit/c5fcdc366d3971ddd22c7ca6285d620024f7f4f3
[60]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@1.0.6...@-xun/project-graph@2.0.0
[61]: https://github.com/Xunnamius/project-utils/commit/e8c7d57139ab536fa68a7a029a9ed071ed63d1b9
[62]: https://github.com/Xunnamius/project-utils/commit/2730a290426f956d4d09df6f5838fcf6186fbf1f
[63]: https://github.com/Xunnamius/project-utils/commit/0902ca0d45a2de36a813d870e869d5bb1f39c12e
[64]: https://github.com/Xunnamius/project-utils/commit/3934f3f692133a03a2f7818c3bcbc24b57751be1
[65]: https://github.com/Xunnamius/project-utils/commit/d5793f7a7c16f9b2e796eeff50ed8367b773d4ca
[66]: https://github.com/Xunnamius/project-utils/commit/93c54c33873c9e02ceadadc02270680f5b921cb2
[67]: https://github.com/Xunnamius/project-utils/commit/4817bc9ceddd43cbad15030d923f28b258bbe763
[68]: https://github.com/Xunnamius/project-utils/commit/8b8633ba14e8233817a5cca747bcdfbd59cb00c3
[69]: https://github.com/Xunnamius/project-utils/commit/aa08278023d4e011436c9cc0ac32511b2e71f1e8
[70]: https://github.com/Xunnamius/project-utils/commit/cae84baeaf7ce595867cb694b2a1d0333ee3cfa9
[71]: https://github.com/Xunnamius/project-utils/commit/f2dd5c645578f4eff798c2e342b144070c69cd59
[72]: https://github.com/Xunnamius/project-utils/commit/19084dae491dd3fb1056b307e670a0d5c6baeaf6
[73]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@0.0.0-init...@-xun/project-graph@1.0.0
[74]: https://github.com/Xunnamius/project-utils/commit/e6720648fa9dc975b0426fb558b4c4b10c6b2e73
[75]: https://github.com/Xunnamius/project-utils/commit/880d8ce103b19a190f99c2f5db4ca46d8da97664
[76]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@1.0.5...@-xun/project-graph@1.0.6
[77]: https://github.com/Xunnamius/project-utils/commit/15c55b3090095f9112ac67d134a3cfcf85094b42
[78]: https://github.com/Xunnamius/project-utils/commit/05b46a1dadbcb5e3519419043e79b5162dca2ab2
[79]: https://github.com/Xunnamius/project-utils/commit/902d8d0ecc927439df54b7959d7ce922d110df84
[80]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@1.0.4...@-xun/project-graph@1.0.5
[81]: https://github.com/Xunnamius/project-utils/commit/ed9bf6b9d6ec764bb105db626cfab54857141172
[82]: https://github.com/Xunnamius/project-utils/commit/3e991c46f16a5bafd09198df2bfc5d03714cbf1e
[83]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@1.0.3...@-xun/project-graph@1.0.4
[84]: https://github.com/Xunnamius/project-utils/commit/6d029a07b5c2c97465a53d0d7645a606c8ff76d0
[85]: https://github.com/Xunnamius/project-utils/commit/c1f1350fd0c4ab07a7f479dc97132824c003a59f
[86]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@1.0.2...@-xun/project-graph@1.0.3
[87]: https://github.com/Xunnamius/project-utils/commit/ebf54405456d5ea4b1a9fbe57c92ad44289d3b1b
[88]: https://github.com/Xunnamius/project-utils/commit/1e3a1acb0971ec922bd552eb50611364c2c5b9ba
[89]: https://github.com/Xunnamius/project-utils/commit/6a643c7575f40293f9c55119a69a7e2c0cc5269a
[90]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@1.0.1...@-xun/project-graph@1.0.2
[91]: https://github.com/Xunnamius/project-utils/commit/ff90125e0338879bf7bf87de3d6d4aed56521e4c
[92]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@1.0.0...@-xun/project-graph@1.0.1
[93]: https://github.com/Xunnamius/project-utils/commit/f358b6316be918b22cfc98428568deedc3ca7dd7
[94]: https://github.com/Xunnamius/project-utils/commit/80a5ed7472360ab582a2244137ed53d9f14dcec5
[95]: https://github.com/Xunnamius/project-utils/commit/274738346fdc425d391c09d88ec14c504de107a1
