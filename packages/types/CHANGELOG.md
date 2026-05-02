# Changelog

All notable changes to this project will be documented in this auto-generated
file. The format is based on [Conventional Commits][1];
this project adheres to [Semantic Versioning][2].

<br />

## @-xun/project-types[@2.0.0][3] (2025-05-29)

### 💥 BREAKING CHANGES 💥

- Minimum supported node version is now 20.18.0

### ⚙️ Build System

- **deps:** bump type-fest from 4.37.0 to 4.41.0 ([766a42a][4])
- **package:** drop support for node\@18 ([19084da][5])

<br />

### 🏗️ Patch @-xun/project-types[@2.0.2][6] (2026-05-02)

#### ⚙️ Build System

- **deps:** bump type-fest from 4.41.0 to 5.6.0 ([a4cae15][7])

<br />

### 🏗️ Patch @-xun/project-types[@2.0.1][8] (2025-06-01)

#### ⚙️ Build System

- **deps:** bump @-xun/fs from 1.0.0 to 2.0.0 ([60ca858][9])

<br />

## @-xun/project-types[@1.0.0][10] (2025-02-02)

### ⚙️ Build System

- **release:** factor @-xun/project multirepo out from symbiote ([880d8ce][11])

<br />

### 🏗️ Patch @-xun/project-types[@1.0.4][12] (2025-03-08)

#### ⚙️ Build System

- **deps:** bump type-fest from 4.35.0 to 4.36.0 ([2bc21e1][13])
- **deps:** bump type-fest from 4.36.0 to 4.37.0 ([b2398ea][14])

<br />

### 🏗️ Patch @-xun/project-types[@1.0.3][15] (2025-02-24)

#### 🪄 Fixes

- Handle unnamed packages (and other `XPackageJson` violations) more logically and consistently ([ebf5440][16])

<br />

### 🏗️ Patch @-xun/project-types[@1.0.2][17] (2025-02-17)

#### ⚙️ Build System

- Update @-xun/run to 1.0.1 ([ff90125][18])

<br />

### 🏗️ Patch @-xun/project-types[@1.0.1][19] (2025-02-06)

#### 🪄 Fixes

- **packages/graph:** ensure `gatherX` exports use internally serializable data structures ([f358b63][20])

#### ⚙️ Build System

- **husky:** skip slow tests ([80a5ed7][21])
- **post-npm-install:** add common-dummies post-install to npm-post-install ([2747383][22])

[1]: https://conventionalcommits.org
[2]: https://semver.org
[3]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-types@1.0.4...@-xun/project-types@2.0.0
[4]: https://github.com/Xunnamius/project-utils/commit/766a42ac32202ea1b89e9f3532ab41aa9f463127
[5]: https://github.com/Xunnamius/project-utils/commit/19084dae491dd3fb1056b307e670a0d5c6baeaf6
[6]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-types@2.0.1...@-xun/project-types@2.0.2
[7]: https://github.com/Xunnamius/project-utils/commit/a4cae150df622106a0200a4b0599ad2b9b0c9b2b
[8]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-types@2.0.0...@-xun/project-types@2.0.1
[9]: https://github.com/Xunnamius/project-utils/commit/60ca85810f9db1506da10ea005e11b1064d4b8e2
[10]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-types@0.0.0-init...@-xun/project-types@1.0.0
[11]: https://github.com/Xunnamius/project-utils/commit/880d8ce103b19a190f99c2f5db4ca46d8da97664
[12]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-types@1.0.3...@-xun/project-types@1.0.4
[13]: https://github.com/Xunnamius/project-utils/commit/2bc21e170c656a34be054a0b4e58de6e15433172
[14]: https://github.com/Xunnamius/project-utils/commit/b2398eab46d68e65d6fe3b7c72440ff23126c998
[15]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-types@1.0.2...@-xun/project-types@1.0.3
[16]: https://github.com/Xunnamius/project-utils/commit/ebf54405456d5ea4b1a9fbe57c92ad44289d3b1b
[17]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-types@1.0.1...@-xun/project-types@1.0.2
[18]: https://github.com/Xunnamius/project-utils/commit/ff90125e0338879bf7bf87de3d6d4aed56521e4c
[19]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-types@1.0.0...@-xun/project-types@1.0.1
[20]: https://github.com/Xunnamius/project-utils/commit/f358b6316be918b22cfc98428568deedc3ca7dd7
[21]: https://github.com/Xunnamius/project-utils/commit/80a5ed7472360ab582a2244137ed53d9f14dcec5
[22]: https://github.com/Xunnamius/project-utils/commit/274738346fdc425d391c09d88ec14c504de107a1
