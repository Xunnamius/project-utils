# Changelog

All notable changes to this project will be documented in this auto-generated
file. The format is based on [Conventional Commits][1];
this project adheres to [Semantic Versioning][2].

<br />

## @-xun/project-types[@1.0.0][3] (2025-02-02)

### ⚙️ Build System

- **release:** factor @-xun/project multirepo out from symbiote ([880d8ce][4])

<br />

### 🏗️ Patch @-xun/project-types[@1.0.3][5] (2025-02-24)

#### 🪄 Fixes

- Handle unnamed packages (and other `XPackageJson` violations) more logically and consistently ([ebf5440][6])

<br />

### 🏗️ Patch @-xun/project-types[@1.0.2][7] (2025-02-17)

#### ⚙️ Build System

- Update @-xun/run to 1.0.1 ([ff90125][8])

<br />

### 🏗️ Patch @-xun/project-types[@1.0.1][9] (2025-02-06)

#### 🪄 Fixes

- **packages/graph:** ensure `gatherX` exports use internally serializable data structures ([f358b63][10])

#### ⚙️ Build System

- **husky:** skip slow tests ([80a5ed7][11])
- **post-npm-install:** add common-dummies post-install to npm-post-install ([2747383][12])

[1]: https://conventionalcommits.org
[2]: https://semver.org
[3]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-types@0.0.0-init...@-xun/project-types@1.0.0
[4]: https://github.com/Xunnamius/project-utils/commit/880d8ce103b19a190f99c2f5db4ca46d8da97664
[5]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-types@1.0.2...@-xun/project-types@1.0.3
[6]: https://github.com/Xunnamius/project-utils/commit/ebf54405456d5ea4b1a9fbe57c92ad44289d3b1b
[7]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-types@1.0.1...@-xun/project-types@1.0.2
[8]: https://github.com/Xunnamius/project-utils/commit/ff90125e0338879bf7bf87de3d6d4aed56521e4c
[9]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-types@1.0.0...@-xun/project-types@1.0.1
[10]: https://github.com/Xunnamius/project-utils/commit/f358b6316be918b22cfc98428568deedc3ca7dd7
[11]: https://github.com/Xunnamius/project-utils/commit/80a5ed7472360ab582a2244137ed53d9f14dcec5
[12]: https://github.com/Xunnamius/project-utils/commit/274738346fdc425d391c09d88ec14c504de107a1
