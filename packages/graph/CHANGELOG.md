# Changelog

All notable changes to this project will be documented in this auto-generated
file. The format is based on [Conventional Commits][1];
this project adheres to [Semantic Versioning][2].

<br />

## @-xun/project-graph[@1.0.0][3] (2025-02-03)

### ⚙️ Build System

- Integrate externalized @-xun/memoize and bpma packages ([e672064][4])
- **release:** factor @-xun/project multirepo out from symbiote ([880d8ce][5])

<br />

### 🏗️ Patch @-xun/project-graph[@1.0.6][6] (2025-03-19)

#### ⚙️ Build System

- **deps:** bump @-xun/project-fs from 1.0.5 to 1.1.0 ([15c55b3][7])
- **deps:** bump @-xun/project-fs from 1.1.0 to 1.2.0 ([05b46a1][8])
- **deps:** bump core-js from 3.40.0 to 3.41.0 ([902d8d0][9])

<br />

### 🏗️ Patch @-xun/project-graph[@1.0.5][10] (2025-03-13)

#### 🪄 Fixes

- **packages/graph:** ensure .prettierignore files always interpreted relative to project root in `gatherProjectFiles` ([ed9bf6b][11])

#### ⚙️ Build System

- **deps:** bump @babel/core from 7.26.9 to 7.26.10 ([3e991c4][12])

<br />

### 🏗️ Patch @-xun/project-graph[@1.0.4][13] (2025-03-08)

#### ⚙️ Build System

- **deps:** bump type-fest from 4.35.0 to 4.36.0 ([6d029a0][14])
- **deps:** bump type-fest from 4.36.0 to 4.37.0 ([c1f1350][15])

<br />

### 🏗️ Patch @-xun/project-graph[@1.0.3][16] (2025-02-24)

#### 🪄 Fixes

- Handle unnamed packages (and other `XPackageJson` violations) more logically and consistently ([ebf5440][17])

#### ⚙️ Build System

- **deps:** bump @-xun/project-fs from 1.0.2 to 1.0.3 ([1e3a1ac][18])
- **packages/graph:** add missing "@types/semver" package ([6a643c7][19])

<br />

### 🏗️ Patch @-xun/project-graph[@1.0.2][20] (2025-02-17)

#### ⚙️ Build System

- Update @-xun/run to 1.0.1 ([ff90125][21])

<br />

### 🏗️ Patch @-xun/project-graph[@1.0.1][22] (2025-02-06)

#### 🪄 Fixes

- **packages/graph:** ensure `gatherX` exports use internally serializable data structures ([f358b63][23])

#### ⚙️ Build System

- **husky:** skip slow tests ([80a5ed7][24])
- **post-npm-install:** add common-dummies post-install to npm-post-install ([2747383][25])

[1]: https://conventionalcommits.org
[2]: https://semver.org
[3]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@0.0.0-init...@-xun/project-graph@1.0.0
[4]: https://github.com/Xunnamius/project-utils/commit/e6720648fa9dc975b0426fb558b4c4b10c6b2e73
[5]: https://github.com/Xunnamius/project-utils/commit/880d8ce103b19a190f99c2f5db4ca46d8da97664
[6]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@1.0.5...@-xun/project-graph@1.0.6
[7]: https://github.com/Xunnamius/project-utils/commit/15c55b3090095f9112ac67d134a3cfcf85094b42
[8]: https://github.com/Xunnamius/project-utils/commit/05b46a1dadbcb5e3519419043e79b5162dca2ab2
[9]: https://github.com/Xunnamius/project-utils/commit/902d8d0ecc927439df54b7959d7ce922d110df84
[10]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@1.0.4...@-xun/project-graph@1.0.5
[11]: https://github.com/Xunnamius/project-utils/commit/ed9bf6b9d6ec764bb105db626cfab54857141172
[12]: https://github.com/Xunnamius/project-utils/commit/3e991c46f16a5bafd09198df2bfc5d03714cbf1e
[13]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@1.0.3...@-xun/project-graph@1.0.4
[14]: https://github.com/Xunnamius/project-utils/commit/6d029a07b5c2c97465a53d0d7645a606c8ff76d0
[15]: https://github.com/Xunnamius/project-utils/commit/c1f1350fd0c4ab07a7f479dc97132824c003a59f
[16]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@1.0.2...@-xun/project-graph@1.0.3
[17]: https://github.com/Xunnamius/project-utils/commit/ebf54405456d5ea4b1a9fbe57c92ad44289d3b1b
[18]: https://github.com/Xunnamius/project-utils/commit/1e3a1acb0971ec922bd552eb50611364c2c5b9ba
[19]: https://github.com/Xunnamius/project-utils/commit/6a643c7575f40293f9c55119a69a7e2c0cc5269a
[20]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@1.0.1...@-xun/project-graph@1.0.2
[21]: https://github.com/Xunnamius/project-utils/commit/ff90125e0338879bf7bf87de3d6d4aed56521e4c
[22]: https://github.com/Xunnamius/project-utils/compare/@-xun/project-graph@1.0.0...@-xun/project-graph@1.0.1
[23]: https://github.com/Xunnamius/project-utils/commit/f358b6316be918b22cfc98428568deedc3ca7dd7
[24]: https://github.com/Xunnamius/project-utils/commit/80a5ed7472360ab582a2244137ed53d9f14dcec5
[25]: https://github.com/Xunnamius/project-utils/commit/274738346fdc425d391c09d88ec14c504de107a1
