<style>
    * { outline: none; }
</style>

This is one of several [boilerplate](https://git.xunn.io/boilerplate) futuristic web dev environment your parents warned you about.

<!-- TOC -->

- [Simple Quick Start Guide](#simple-quick-start-guide)
- [Feature Scope](#feature-scope)
- [Required Reading](#required-reading)
    - [](#)
    - [NPM Run Scripts](#npm-run-scripts)
- [Good Questions](#good-questions)
- [Further Research Materials](#further-research-materials)

<!-- /TOC -->

***

## Simple Quick Start Guide

> 0. Explore the [getting started documentation](https://git.xunn.io/DarkTools/ergo-provision/wikis/home)
1. Delete the `.git/` directory **RIGHT NOW!**
2. Rename this project directory
3. Edit `name`, `description`, and `url` keys in [package.json](package.json)
4. Rename [.env-dist](.env-dist) to `.env`; customize `.env` to your liking
5. Initialize a new git repository and/or link this repository and branch to gitlab/github
6. (todo)

It is recommended that you also check out the so-called [Required Reading](#required-reading) and [FAQ](#further-research-materials) sections if you don't want to get lost.

## Feature Scope

* **Shopify** ready (see [.env-dist](.env-dist))
* **React** and **JSX** are fully support
* **Webpack** and all its powers come preconfigured (webpack can be further customized in [config/next.config.js](config/next.config.js))
* **Babel** (latest JS features are available in every file everywhere **except in [babel.config.js](babel.config.js)**)
* **Next.js** Here's everything you get **FOR FREE NO EXTRA LINES OF CODE FOR YOU**:
    * [HMR]() as a LiveReload replacement
    * [SSR](https://hackernoon.com/next-js-react-server-side-rendering-done-right-f9700078a3b6)
    * [CSR](http://krasimirtsonev.com/blog/article/deep-dive-into-client-side-routing-navigo-pushstate-hash)
    * [Styled-jsx](https://github.com/zeit/styled-jsx)
    * [Prefetch](https://nextjs.org/docs/#prefetching-pages)
    * [Code splitting](https://zeit.co/blog/next#automatic-server-rendering-and-code-splitting)
    * Can use Express, Hapi, or Koa under the hood!
    * [Will eventually migrate to react-router](https://react-etc.net/entry/next-js-to-adopt-react-router) (still keeping PHP-style `pages/` support)

* Optimizations for serving static files through `static/` (not as good as Nginx, though)
* Local and remote Chrome and Node debugging support
* Ready for Jest testing
* Source maps handled automatically (mostly by Next.js itself)
* Supports and encourages [progressive web app](https://en.wikipedia.org/wiki/Progressive_Web_Apps) (think: Google Docs) development, [universal JavaScript](https://cdb.reacttraining.com/universal-javascript-4761051b7ae9) (rather than [isomorphic JavaScript](https://medium.com/@ghengeveld/isomorphism-vs-universal-javascript-4b47fb481beb)), [everything as a SPA]() and all the other buzzwords and phrases
* Rich server-less development (ie. no internet connection required after `npm install`)
* Ready to work behind an Nginx (or any) reverse proxy out-of-box
* Tiny gulp file (read: offload as many commands to the `scripts` key in [package.json](package.json) as possible)

***

## Required Reading

### 

### NPM Run Scripts

<details>
    <summary><strong>dev</strong></summary>
(todo)
</details>

<details>
    <summary><strong>build</strong></summary>
(todo)
</details>

<details>
    <summary><strong>test</strong></summary>
(todo)
</details>

<details>
    <summary><strong>install-types</strong></summary>
(todo)
</details>

<details>
    <summary><strong>clean-types</strong></summary>
(todo)
</details>

<details>
    <summary><strong>prepare</strong></summary>
(todo)
</details>

<details>
    <summary><strong>start</strong></summary>
(todo)
</details>

<details>
    <summary><strong>regenerate</strong></summary>

Any changes to [gulpfile.js](config/gulpfile.js) or
[next.config.js](config/next.config.js) *must* be made in the `config/`
directory and *must* be accompanied by regeneration of the root configuration
files. To trigger this, use the following command:

```bash
npm run regenerate
```
</details>

## Good Questions

<details>
    <summary><strong>What is this `.env-dist` thing? (AKA: `.env`)</strong></summary>

(todo) [.env-dist](.env-dist)
</details>

<details>
    <summary><strong>What's going on in `package.json`?</strong></summary>

(todo) [package.json](package.json)
</details>

<details>
    <summary><strong>What's going on in `babel.config.js`?</strong></summary>

(todo) [babel.config.js](babel.config.js)
</details>

<details>
    <summary><strong>What's going on in `next.config.js`?</strong></summary>

(todo) [next.config.js](next.config.js)
</details>

<details>
    <summary><strong>Why is `package-lock.js` included in `.gitignore`?</strong></summary>

While incorrect and illegal for npm packages that are going to be published,
including [package-lock.js](package-lock.js) in your new project's repository
isn't initially useful thanks to semver semantics. If you determine you need it,
remove the entry from the root [.gitignore](.gitignore).
</details>

<details>
    <summary><strong>What are all these other files at the project root?</strong></summary>

(todo)
</details>

<details>
    <summary><strong>What's up with `static/`?</strong></summary>

(todo)
</details>

<details>
    <summary><strong>What's up with `pages/`?</strong></summary>

(todo)
</details>

<details>
    <summary><strong>What's up with `flow-typed/`?</strong></summary>

(todo)
</details>

<details>
    <summary><strong>What's up with `config/`?</strong></summary>

(todo)
</details>

<details>
    <summary><strong>What's up with `components/`?</strong></summary>

(todo)
</details>

<details>
    <summary><strong>Why are `.vscode/`, `node_modules/`, `build/`, `components/`, `.next/`, etc hidden in VS Code?</strong></summary>

Because of the workplace scope rules defined in
[.vscode/settings.json](.vscode/settings.json). You can customize them to your
heart's content. Specifically, the `files.exclude` key.
</details>

## Further Research Materials

* [Tutorial: Intro to React](https://reactjs.org/tutorial/tutorial.html)
* [Redux: Basics](https://redux.js.org/basics)
* [Create React component libraries with Storybook and styled-jsx](https://medium.com/@efreyreg/create-react-component-libraries-with-storybook-and-styled-jsx-8999f423f06b)
* [Next.js Getting Started Tutorial](https://nextjs.org/learn/)
