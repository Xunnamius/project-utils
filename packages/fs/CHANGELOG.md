# Changelog

All notable changes to this project will be documented in this auto-generated
file. The format is based on [Conventional Commits][1];
this project adheres to [Semantic Versioning][2].

<br />

## @-xun/project-fs[@1.2.0][3] (2025-03-19)

### ✨ Features

- **packages/fs:** allow `extractExamplesFromDocument` to return RegExp Maps with respect to `options.asRegExp` ([7eae313][4])

### ⚙️ Build System

- **deps:** bump core-js from 3.40.0 to 3.41.0 ([3415388][5])

<br />

## @-xun/project-fs[@1.1.0][6] (2025-03-19)

### ✨ Features

- **packages/fs:** implement `extractExamplesFromDocument` ([124f6e6][7])

<br />

## @-xun/project-fs[@1.0.0][8] (2025-02-03)

### ⚙️ Build System

- Integrate externalized @-xun/memoize and bpma packages ([e672064][9])
- **release:** factor @-xun/project multirepo out from symbiote ([880d8ce][10])

<br />

### 🏗️ Patch @-xun/project-fs[@1.0.5][11] (2025-03-08)

#### ⚙️ Build System

- **deps:** bump @-xun/run from 1.0.3 to 1.1.0 ([a8fc033][12])
- **deps:** bump type-fest from 4.35.0 to 4.36.0 ([2fa0714][13])
- **deps:** bump type-fest from 4.36.0 to 4.37.0 ([1031a44][14])

#### 🔥 Reverted

- _"build(deps): bump core-js from 3.40.0 to 3.41.0"_ ([60c1d5e][15])

<br />

### 🏗️ Patch @-xun/project-fs[@1.0.4][16] (2025-02-24)

#### 🪄 Fixes

- **packages/fs:** improve `readXPackageJsonAtRoot` error message output ([a847b98][17])

<br />

### 🏗️ Patch @-xun/project-fs[@1.0.3][18] (2025-02-24)

#### 🪄 Fixes

- **packages/fs:** improve debug output and provide more accurate return types for `readJson` and `readJsonc` exports ([79c4ff5][19])
- **packages/fs:** throw in `readXPackageJsonAtRoot` when reading a non-`XPackageJson` JSON file ([33d431e][20])

#### ⚙️ Build System

- **deps:** bump @-xun/run from 1.0.2 to 1.0.3 ([9a72b4f][21])

<br />

### 🏗️ Patch @-xun/project-fs[@1.0.2][22] (2025-02-17)

#### ⚙️ Build System

- Update @-xun/run to 1.0.1 ([ff90125][23])

<br />

### 🏗️ Patch @-xun/project-fs[@1.0.1][24] (2025-02-06)

#### ⚙️ Build System

- **husky:** skip slow tests ([80a5ed7][25])
- **post-npm-install:** add common-dummies post-install to npm-post-install ([2747383][26])

[1]: https://conventionalcommits.org
[2]: https://semver.org
[3]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-fs@1.1.0...@-xun/project-fs@1.2.0
[4]: https://github.com/Xunnamius/project-utils/commit/7eae313be5b26fe85e1c6ce76044bc731b50b838
[5]: https://github.com/Xunnamius/project-utils/commit/3415388ba58de8dd25b7d9d90b50d1dbb6b8a72d
[6]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-fs@1.0.5...@-xun/project-fs@1.1.0
[7]: https://github.com/Xunnamius/project-utils/commit/124f6e6b6e700d669a6e7832c4ad15585be7dc80
[8]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-fs@0.0.0-init...@-xun/project-fs@1.0.0
[9]: https://github.com/Xunnamius/project-utils/commit/e6720648fa9dc975b0426fb558b4c4b10c6b2e73
[10]: https://github.com/Xunnamius/project-utils/commit/880d8ce103b19a190f99c2f5db4ca46d8da97664
[11]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-fs@1.0.4...@-xun/project-fs@1.0.5
[12]: https://github.com/Xunnamius/project-utils/commit/a8fc03374e06a987e19d82e1a8d79618a516c6f6
[13]: https://github.com/Xunnamius/project-utils/commit/2fa0714dbedab52c4a82a33adf20982b9fc3a34b
[14]: https://github.com/Xunnamius/project-utils/commit/1031a44179c373e44b77aabad30d4505d263a012
[15]: https://github.com/Xunnamius/project-utils/commit/60c1d5ecb7a22e53a2e1a7c32b140b925b2ce39f
[16]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-fs@1.0.3...@-xun/project-fs@1.0.4
[17]: https://github.com/Xunnamius/project-utils/commit/a847b9875ec701ad22e6bc41ef194cc3890cf59f
[18]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-fs@1.0.2...@-xun/project-fs@1.0.3
[19]: https://github.com/Xunnamius/project-utils/commit/79c4ff57591d529d751f338a01f8fae9485cbb10
[20]: https://github.com/Xunnamius/project-utils/commit/33d431e58f082c1e978760f850868fb2b98938b9
[21]: https://github.com/Xunnamius/project-utils/commit/9a72b4f54dbdddbb352c04844a10b2e6a28d17e6
[22]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-fs@1.0.1...@-xun/project-fs@1.0.2
[23]: https://github.com/Xunnamius/project-utils/commit/ff90125e0338879bf7bf87de3d6d4aed56521e4c
[24]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-fs@1.0.0...@-xun/project-fs@1.0.1
[25]: https://github.com/Xunnamius/project-utils/commit/80a5ed7472360ab582a2244137ed53d9f14dcec5
[26]: https://github.com/Xunnamius/project-utils/commit/274738346fdc425d391c09d88ec14c504de107a1
