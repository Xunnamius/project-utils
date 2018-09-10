This is a boilerplate website with the following features:

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

<!-- TOC -->

- [Required Reading](#required-reading)
    - [NPM Run Scripts](#npm-run-scripts)
        - [`regenerate`](#regenerate)
        - [`(todo)`](#todo)
- [Good Questions](#good-questions)
    - [I cloned it! What do I do now?](#i-cloned-it-what-do-i-do-now)
    - [What is this `.env-dist` thing? (AKA: `.env`)](#what-is-this-env-dist-thing-aka-env)
    - [What's going on in `package.json`?](#whats-going-on-in-packagejson)
    - [What's going on in `babel.config.js`?](#whats-going-on-in-babelconfigjs)
    - [What's going on in `next.config.js`?](#whats-going-on-in-nextconfigjs)
    - [Why is `package-lock.js` included in `.gitignore`?](#why-is-package-lockjs-included-in-gitignore)
    - [What's up with `static/`?](#whats-up-with-static)
    - [What's up with `pages/`?](#whats-up-with-pages)
    - [What's up with `flow-typed/`?](#whats-up-with-flow-typed)
    - [What's up with `config/`?](#whats-up-with-config)
    - [What's up with `components/`?](#whats-up-with-components)
    - [Why are `.vscode/`, `node_modules/`, `build/`, `components/`, `.next/`, etc hidden in VS Code?](#why-are-vscode-node_modules-build-components-next-etc-hidden-in-vs-code)
- [Further Research Materials](#further-research-materials)

<!-- /TOC -->

***

## Required Reading

### NPM Run Scripts

#### `regenerate`

Any changes to [gulpfile.js](config/gulpfile.js) or
[next.config.js](config/next.config.js) *must* be made in the `config/`
directory and *must* be accompanied by regeneration of the root configuration
files. To trigger this, use the following command:

```bash
npm run regenerate
```

#### `(todo)`

## Good Questions

### I cloned it! What do I do now?

> 0. Explore the [getting started documentation](https://git.xunn.io/DarkTools/ergo-provision/wikis/home)
1. Delete the `.git/` directory **RIGHT NOW!**
2. Rename this project directory
3. Edit `name`, `description`, and `url` keys in [package.json](package.json)
4. Rename [.env-dist](.env-dist) to `.env`; customize `.env` to your liking
5. Initialize a new git repository and/or link this repository and branch to gitlab/github
6. (todo)

### What is this `.env-dist` thing? (AKA: `.env`)

(todo) [.env-dist](.env-dist)

### What's going on in `package.json`?

(todo) [package.json](package.json)

### What's going on in `babel.config.js`?

(todo) [babel.config.js](babel.config.js)

### What's going on in `next.config.js`?

(todo) [next.config.js](next.config.js)

### Why is `package-lock.js` included in `.gitignore`?

While incorrect and illegal for npm packages that are going to be published,
including [package-lock.js](package-lock.js) in your new project's repository
isn't initially useful thanks to semver semantics. If you determine you need it,
remove the entry from the root [.gitignore](.gitignore).

<detail>
    <summary><strong>What are all these other files at the project root?</strong></summary>
    
(todo)
</detail>

### What's up with `static/`?

(todo)

### What's up with `pages/`?

(todo)

### What's up with `flow-typed/`?

(todo)

### What's up with `config/`?

(todo)

### What's up with `components/`?

(todo)

### Why are `.vscode/`, `node_modules/`, `build/`, `components/`, `.next/`, etc hidden in VS Code?

Because of the workplace scope rules defined in
[.vscode/settings.json](.vscode/settings.json). You can customize them to your
heart's content. Specifically, the `files.exclude` key.

## Further Research Materials

* [Tutorial: Intro to React](https://reactjs.org/tutorial/tutorial.html)
* [Redux: Basics](https://redux.js.org/basics)
* [Create React component libraries with Storybook and styled-jsx](https://medium.com/@efreyreg/create-react-component-libraries-with-storybook-and-styled-jsx-8999f423f06b)
* [Next.js Getting Started Tutorial](https://nextjs.org/learn/)
