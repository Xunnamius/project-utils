# Changelog

All notable changes to this project will be documented in this auto-generated
file. The format is based on [Conventional Commits][1];
this project adheres to [Semantic Versioning][2].

<br />

## @-xun/project[@2.0.0][3] (2025-05-30)

### 💥 BREAKING CHANGES 💥

- Minimum supported node version is now 20.18.0

### ⚙️ Build System

- **deps:** bump @-xun/project-fs from 1.2.0 to 2.0.0 ([44d7782][4])
- **deps:** bump @-xun/project-types from 1.0.4 to 2.0.0 ([e188fa0][5])
- **deps:** bump core-js from 3.41.0 to 3.42.0 ([af8fbc3][6])
- **deps:** bump internal monorepo interdependencies to latest versions ([268098a][7])
- **package:** drop support for node\@18 ([19084da][8])

<br />

## @-xun/project[@1.0.0][9] (2025-02-03)

### ⚙️ Build System

- Integrate externalized @-xun/memoize and bpma packages ([e672064][10])
- **release:** factor @-xun/project multirepo out from symbiote ([880d8ce][11])

<br />

### 🏗️ Patch @-xun/project[@1.0.5][12] (2025-03-19)

#### ⚙️ Build System

- **deps:** bump @-xun/project-fs from 1.0.5 to 1.1.0 ([3890403][13])
- **deps:** bump @-xun/project-fs from 1.1.0 to 1.2.0 ([366cf7a][14])
- **deps:** bump core-js from 3.40.0 to 3.41.0 ([f9ccc15][15])

<br />

### 🏗️ Patch @-xun/project[@1.0.4][16] (2025-03-13)

#### ⚙️ Build System

- **deps:** bump @-xun/project-fs from 1.0.4 to 1.0.5 ([14698d1][17])
- **deps:** bump @-xun/project-graph from 1.0.3 to 1.0.4 ([8ab5e22][18])
- **deps:** bump @-xun/project-types from 1.0.3 to 1.0.4 ([d113f0b][19])

<br />

### 🏗️ Patch @-xun/project[@1.0.3][20] (2025-02-24)

#### ⚙️ Build System

- **deps:** bump @-xun/project-fs from 1.0.2 to 1.0.3 ([33c2322][21])
- **packages/graph:** add missing "@types/semver" package ([6a643c7][22])

<br />

### 🏗️ Patch @-xun/project[@1.0.2][23] (2025-02-17)

#### ⚙️ Build System

- Update @-xun/run to 1.0.1 ([ff90125][24])

<br />

### 🏗️ Patch @-xun/project[@1.0.1][25] (2025-02-06)

#### ⚙️ Build System

- **husky:** skip slow tests ([80a5ed7][26])
- **post-npm-install:** add common-dummies post-install to npm-post-install ([2747383][27])

[1]: https://conventionalcommits.org
[2]: https://semver.org
[3]: https://github.com/Xunnamius/project-utils/compare/@-xun/project@1.0.5...@-xun/project@2.0.0
[4]: https://github.com/Xunnamius/project-utils/commit/44d77827bc8a16ba4539f7c99f20b979c5a0d904
[5]: https://github.com/Xunnamius/project-utils/commit/e188fa098a77a81dfda0f401939c74a7bcb6b072
[6]: https://github.com/Xunnamius/project-utils/commit/af8fbc3825cd5ef2fd19c4bced71487d8472f94f
[7]: https://github.com/Xunnamius/project-utils/commit/268098af59787123b416ede82139069547b84b3a
[8]: https://github.com/Xunnamius/project-utils/commit/19084dae491dd3fb1056b307e670a0d5c6baeaf6
[9]: https://github.com/Xunnamius/project-utils/compare/@-xun/project@0.0.0-init...@-xun/project@1.0.0
[10]: https://github.com/Xunnamius/project-utils/commit/e6720648fa9dc975b0426fb558b4c4b10c6b2e73
[11]: https://github.com/Xunnamius/project-utils/commit/880d8ce103b19a190f99c2f5db4ca46d8da97664
[12]: https://github.com/Xunnamius/project-utils/compare/@-xun/project@1.0.4...@-xun/project@1.0.5
[13]: https://github.com/Xunnamius/project-utils/commit/389040340d116d412352559015399d2805c68f2e
[14]: https://github.com/Xunnamius/project-utils/commit/366cf7a15f26e201378e7d7c58b86d52798025f0
[15]: https://github.com/Xunnamius/project-utils/commit/f9ccc15927dc834a70c81cc9f31d96f6ed1ec9e8
[16]: https://github.com/Xunnamius/project-utils/compare/@-xun/project@1.0.3...@-xun/project@1.0.4
[17]: https://github.com/Xunnamius/project-utils/commit/14698d1436d3e8fc067837863378f952ce2e3284
[18]: https://github.com/Xunnamius/project-utils/commit/8ab5e22d2602e3e1319f0628ac56aacb24bb6abe
[19]: https://github.com/Xunnamius/project-utils/commit/d113f0b09b963ba4a043b10be57f23fa90f7ccf5
[20]: https://github.com/Xunnamius/project-utils/compare/@-xun/project@1.0.2...@-xun/project@1.0.3
[21]: https://github.com/Xunnamius/project-utils/commit/33c2322ace484b27ca7ffbda7c2c3b614afa59b5
[22]: https://github.com/Xunnamius/project-utils/commit/6a643c7575f40293f9c55119a69a7e2c0cc5269a
[23]: https://github.com/Xunnamius/project-utils/compare/@-xun/project@1.0.1...@-xun/project@1.0.2
[24]: https://github.com/Xunnamius/project-utils/commit/ff90125e0338879bf7bf87de3d6d4aed56521e4c
[25]: https://github.com/Xunnamius/project-utils/compare/@-xun/project@1.0.0...@-xun/project@1.0.1
[26]: https://github.com/Xunnamius/project-utils/commit/80a5ed7472360ab582a2244137ed53d9f14dcec5
[27]: https://github.com/Xunnamius/project-utils/commit/274738346fdc425d391c09d88ec14c504de107a1
