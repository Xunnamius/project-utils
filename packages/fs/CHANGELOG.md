# Changelog

All notable changes to this project will be documented in this auto-generated
file. The format is based on [Conventional Commits][1];
this project adheres to [Semantic Versioning][2].

<br />

## @-xun/project-fs[@1.0.0][3] (2025-02-03)

### ⚙️ Build System

- Integrate externalized @-xun/memoize and bpma packages ([e672064][4])
- **release:** factor @-xun/project multirepo out from symbiote ([880d8ce][5])

<br />

### 🏗️ Patch @-xun/project-fs[@1.0.4][6] (2025-02-24)

#### 🪄 Fixes

- **packages/fs:** improve `readXPackageJsonAtRoot` error message output ([a847b98][7])

<br />

### 🏗️ Patch @-xun/project-fs[@1.0.3][8] (2025-02-24)

#### 🪄 Fixes

- **packages/fs:** improve debug output and provide more accurate return types for `readJson` and `readJsonc` exports ([79c4ff5][9])
- **packages/fs:** throw in `readXPackageJsonAtRoot` when reading a non-`XPackageJson` JSON file ([33d431e][10])

#### ⚙️ Build System

- **deps:** bump @-xun/run from 1.0.2 to 1.0.3 ([9a72b4f][11])

<br />

### 🏗️ Patch @-xun/project-fs[@1.0.2][12] (2025-02-17)

#### ⚙️ Build System

- Update @-xun/run to 1.0.1 ([ff90125][13])

<br />

### 🏗️ Patch @-xun/project-fs[@1.0.1][14] (2025-02-06)

#### ⚙️ Build System

- **husky:** skip slow tests ([80a5ed7][15])
- **post-npm-install:** add common-dummies post-install to npm-post-install ([2747383][16])

[1]: https://conventionalcommits.org
[2]: https://semver.org
[3]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-fs@0.0.0-init...@-xun/project-fs@1.0.0
[4]: https://github.com/Xunnamius/project-utils/commit/e6720648fa9dc975b0426fb558b4c4b10c6b2e73
[5]: https://github.com/Xunnamius/project-utils/commit/880d8ce103b19a190f99c2f5db4ca46d8da97664
[6]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-fs@1.0.3...@-xun/project-fs@1.0.4
[7]: https://github.com/Xunnamius/project-utils/commit/a847b9875ec701ad22e6bc41ef194cc3890cf59f
[8]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-fs@1.0.2...@-xun/project-fs@1.0.3
[9]: https://github.com/Xunnamius/project-utils/commit/79c4ff57591d529d751f338a01f8fae9485cbb10
[10]: https://github.com/Xunnamius/project-utils/commit/33d431e58f082c1e978760f850868fb2b98938b9
[11]: https://github.com/Xunnamius/project-utils/commit/9a72b4f54dbdddbb352c04844a10b2e6a28d17e6
[12]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-fs@1.0.1...@-xun/project-fs@1.0.2
[13]: https://github.com/Xunnamius/project-utils/commit/ff90125e0338879bf7bf87de3d6d4aed56521e4c
[14]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-fs@1.0.0...@-xun/project-fs@1.0.1
[15]: https://github.com/Xunnamius/project-utils/commit/80a5ed7472360ab582a2244137ed53d9f14dcec5
[16]: https://github.com/Xunnamius/project-utils/commit/274738346fdc425d391c09d88ec14c504de107a1
