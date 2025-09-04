# Changelog

All notable changes to this project will be documented in this auto-generated
file. The format is based on [Conventional Commits][1];
this project adheres to [Semantic Versioning][2].

<br />

## @-xun/project-fs[@2.0.0][3] (2025-05-29)

### 💥 BREAKING CHANGES 💥

- Minimum supported node version is now 20.18.0

### ⚙️ Build System

- **deps:** bump core-js from 3.41.0 to 3.42.0 ([45ed1ff][4])
- **deps:** bump internal monorepo interdependencies to latest versions ([64362b0][5])
- **deps:** bump type-fest from 4.37.0 to 4.41.0 ([773a174][6])
- **package:** drop support for node\@18 ([19084da][7])

<br />

### 🏗️ Patch @-xun/project-fs[@2.0.6][8] (2025-09-04)

#### ⚙️ Build System

- **deps:** bump @-xun/run from 1.1.0 to 2.0.0 ([1b23a4f][9])
- **deps:** bump core-js from 3.44.0 to 3.45.1 ([9b2e25a][10])
- **deps:** bump rejoinder from 2.0.2 to 2.1.0 ([24208df][11])

<br />

### 🏗️ Patch @-xun/project-fs[@2.0.5][12] (2025-07-12)

#### ⚙️ Build System

- **deps:** bump rejoinder from 2.0.1 to 2.0.2 ([182e771][13])

<br />

### 🏗️ Patch @-xun/project-fs[@2.0.4][14] (2025-07-10)

#### ⚙️ Build System

- **deps:** bump core-js from 3.43.0 to 3.44.0 ([13ef932][15])
- **package:** integrate @-xun/error dependency ([77138f2][16])
- **package:** integrate @-xun/error dependency ([38edc03][17])
- Remove unused dependency ([9b404fe][18])

<br />

### 🏗️ Patch @-xun/project-fs[@2.0.3][19] (2025-06-14)

#### ⚙️ Build System

- **deps:** bump rejoinder from 2.0.0 to 2.0.1 ([eb73ca3][20])

<br />

### 🏗️ Patch @-xun/project-fs[@2.0.2][21] (2025-06-14)

#### ⚙️ Build System

- **deps:** bump core-js from 3.42.0 to 3.43.0 ([4951aa4][22])
- **deps:** bump rejoinder from 1.2.5 to 2.0.0 ([e1b8dff][23])

<br />

### 🏗️ Patch @-xun/project-fs[@2.0.1][24] (2025-06-01)

#### ⚙️ Build System

- **deps:** bump @-xun/fs from 1.0.0 to 2.0.0 ([9c537c6][25])
- **deps:** bump internal monorepo interdependencies to latest versions ([b9ed4a0][26])

<br />

## @-xun/project-fs[@1.2.0][27] (2025-03-19)

### ✨ Features

- **packages/fs:** allow `extractExamplesFromDocument` to return RegExp Maps with respect to `options.asRegExp` ([7eae313][28])

### ⚙️ Build System

- **deps:** bump core-js from 3.40.0 to 3.41.0 ([3415388][29])

<br />

## @-xun/project-fs[@1.1.0][30] (2025-03-19)

### ✨ Features

- **packages/fs:** implement `extractExamplesFromDocument` ([124f6e6][31])

<br />

## @-xun/project-fs[@1.0.0][32] (2025-02-03)

### ⚙️ Build System

- Integrate externalized @-xun/memoize and bpma packages ([e672064][33])
- **release:** factor @-xun/project multirepo out from symbiote ([880d8ce][34])

<br />

### 🏗️ Patch @-xun/project-fs[@1.0.5][35] (2025-03-08)

#### ⚙️ Build System

- **deps:** bump @-xun/run from 1.0.3 to 1.1.0 ([a8fc033][36])
- **deps:** bump type-fest from 4.35.0 to 4.36.0 ([2fa0714][37])
- **deps:** bump type-fest from 4.36.0 to 4.37.0 ([1031a44][38])

#### 🔥 Reverted

- _"build(deps): bump core-js from 3.40.0 to 3.41.0"_ ([60c1d5e][39])

<br />

### 🏗️ Patch @-xun/project-fs[@1.0.4][40] (2025-02-24)

#### 🪄 Fixes

- **packages/fs:** improve `readXPackageJsonAtRoot` error message output ([a847b98][41])

<br />

### 🏗️ Patch @-xun/project-fs[@1.0.3][42] (2025-02-24)

#### 🪄 Fixes

- **packages/fs:** improve debug output and provide more accurate return types for `readJson` and `readJsonc` exports ([79c4ff5][43])
- **packages/fs:** throw in `readXPackageJsonAtRoot` when reading a non-`XPackageJson` JSON file ([33d431e][44])

#### ⚙️ Build System

- **deps:** bump @-xun/run from 1.0.2 to 1.0.3 ([9a72b4f][45])

<br />

### 🏗️ Patch @-xun/project-fs[@1.0.2][46] (2025-02-17)

#### ⚙️ Build System

- Update @-xun/run to 1.0.1 ([ff90125][47])

<br />

### 🏗️ Patch @-xun/project-fs[@1.0.1][48] (2025-02-06)

#### ⚙️ Build System

- **husky:** skip slow tests ([80a5ed7][49])
- **post-npm-install:** add common-dummies post-install to npm-post-install ([2747383][50])

[1]: https://conventionalcommits.org
[2]: https://semver.org
[3]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-fs@1.2.0...@-xun/project-fs@2.0.0
[4]: https://github.com/Xunnamius/project-utils/commit/45ed1ff1ad4c3bef9c739408dda53225b16038ad
[5]: https://github.com/Xunnamius/project-utils/commit/64362b01f24c6c59988db9f068ede4ce16e5426d
[6]: https://github.com/Xunnamius/project-utils/commit/773a174835927ef22171f6d21a2dedc008359a82
[7]: https://github.com/Xunnamius/project-utils/commit/19084dae491dd3fb1056b307e670a0d5c6baeaf6
[8]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-fs@2.0.5...@-xun/project-fs@2.0.6
[9]: https://github.com/Xunnamius/project-utils/commit/1b23a4f4c5a66181680ec584cedd971eb9593346
[10]: https://github.com/Xunnamius/project-utils/commit/9b2e25a54d3461adddab08efc344bf7e23ce54bb
[11]: https://github.com/Xunnamius/project-utils/commit/24208dfc8331dc0ae4d95ff53e25fceb0c8e6c47
[12]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-fs@2.0.4...@-xun/project-fs@2.0.5
[13]: https://github.com/Xunnamius/project-utils/commit/182e7716f443869bbd34aeef583f2afeee710175
[14]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-fs@2.0.3...@-xun/project-fs@2.0.4
[15]: https://github.com/Xunnamius/project-utils/commit/13ef932ac4a1a41781d26cf90805a5aecd381359
[16]: https://github.com/Xunnamius/project-utils/commit/77138f23ddbeedfbb7756b65dd456f322127f808
[17]: https://github.com/Xunnamius/project-utils/commit/38edc03cff6bcc3e9e5e24ec85841d5d5838af58
[18]: https://github.com/Xunnamius/project-utils/commit/9b404fea29c1270372a5dfc8fffaead63ec97c56
[19]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-fs@2.0.2...@-xun/project-fs@2.0.3
[20]: https://github.com/Xunnamius/project-utils/commit/eb73ca37cded51c115a1d2110374a648fe874cf1
[21]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-fs@2.0.1...@-xun/project-fs@2.0.2
[22]: https://github.com/Xunnamius/project-utils/commit/4951aa433f72d0ec35b08e1547139ab0abb65745
[23]: https://github.com/Xunnamius/project-utils/commit/e1b8dff3776b1a0ff976d25554f9d24101ff7e78
[24]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-fs@2.0.0...@-xun/project-fs@2.0.1
[25]: https://github.com/Xunnamius/project-utils/commit/9c537c66f40a4ce99d199dd239cd4e58e66cb3b7
[26]: https://github.com/Xunnamius/project-utils/commit/b9ed4a06f870e70fddad5d0f08720666aeeab7b0
[27]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-fs@1.1.0...@-xun/project-fs@1.2.0
[28]: https://github.com/Xunnamius/project-utils/commit/7eae313be5b26fe85e1c6ce76044bc731b50b838
[29]: https://github.com/Xunnamius/project-utils/commit/3415388ba58de8dd25b7d9d90b50d1dbb6b8a72d
[30]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-fs@1.0.5...@-xun/project-fs@1.1.0
[31]: https://github.com/Xunnamius/project-utils/commit/124f6e6b6e700d669a6e7832c4ad15585be7dc80
[32]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-fs@0.0.0-init...@-xun/project-fs@1.0.0
[33]: https://github.com/Xunnamius/project-utils/commit/e6720648fa9dc975b0426fb558b4c4b10c6b2e73
[34]: https://github.com/Xunnamius/project-utils/commit/880d8ce103b19a190f99c2f5db4ca46d8da97664
[35]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-fs@1.0.4...@-xun/project-fs@1.0.5
[36]: https://github.com/Xunnamius/project-utils/commit/a8fc03374e06a987e19d82e1a8d79618a516c6f6
[37]: https://github.com/Xunnamius/project-utils/commit/2fa0714dbedab52c4a82a33adf20982b9fc3a34b
[38]: https://github.com/Xunnamius/project-utils/commit/1031a44179c373e44b77aabad30d4505d263a012
[39]: https://github.com/Xunnamius/project-utils/commit/60c1d5ecb7a22e53a2e1a7c32b140b925b2ce39f
[40]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-fs@1.0.3...@-xun/project-fs@1.0.4
[41]: https://github.com/Xunnamius/project-utils/commit/a847b9875ec701ad22e6bc41ef194cc3890cf59f
[42]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-fs@1.0.2...@-xun/project-fs@1.0.3
[43]: https://github.com/Xunnamius/project-utils/commit/79c4ff57591d529d751f338a01f8fae9485cbb10
[44]: https://github.com/Xunnamius/project-utils/commit/33d431e58f082c1e978760f850868fb2b98938b9
[45]: https://github.com/Xunnamius/project-utils/commit/9a72b4f54dbdddbb352c04844a10b2e6a28d17e6
[46]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-fs@1.0.1...@-xun/project-fs@1.0.2
[47]: https://github.com/Xunnamius/project-utils/commit/ff90125e0338879bf7bf87de3d6d4aed56521e4c
[48]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-fs@1.0.0...@-xun/project-fs@1.0.1
[49]: https://github.com/Xunnamius/project-utils/commit/80a5ed7472360ab582a2244137ed53d9f14dcec5
[50]: https://github.com/Xunnamius/project-utils/commit/274738346fdc425d391c09d88ec14c504de107a1
