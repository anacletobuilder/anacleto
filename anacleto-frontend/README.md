# anacleto-frontend

> Anacleto frontend library

[![NPM](https://img.shields.io/npm/v/anacleto-frontend.svg)](https://www.npmjs.com/package/anacleto-frontend) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

`anacleto-frontend` is a library that you can import into your React project.
> Note, anacleto-frontend cannot be run directly, but must be imported as a library in a NodeJS new project

```bash
npm install --save anacleto-frontend
```

## Usage

1. if you don't have it install `NodeJs` and `npm` [Docs](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

2. Create a new React app
```bash
npx create-react-app sample-app
```

3. Install `anacleto-frontend` from npm
```bash
npm install --save anacleto-frontend
```

4. Load Anacleto from `index.js` file

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {Anacleto} from 'anacleto-frontend';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Anacleto />
  </React.StrictMode>
);

```

5. Create `.env` file and save on project root.

```bash
#enviroment
REACT_APP_ENV=development
# backend url
REACT_APP_BACKEND_HOST=http://localhost:3001
# login message
REACT_APP_LOGIN_MESSAGE=Login to Anacleto DEMO Apps!
# firebase config
REACT_APP_FIREBASE_CONFIG={"apiKey":"...","authDomain":"xxx.firebaseapp.com","projectId":"xxx","storageBucket":"xxx","messagingSenderId":"197970136961","appId":"xxx"}
```

- `REACT_APP_ENV`: project enviroment: development / test / production
- `REACT_APP_BACKEND_HOST`: anacleto-backend url
- `REACT_APP_LOGIN_MESSAGE`: anacleto-frontend login message
- `REACT_APP_FIREBASE_CONFIG`: your [Firebase project configuration JSON](https://firebase.google.com/docs/web/learn-more#config-object)

> Before you can add Firebase to your JavaScript app, you need to create a Firebase project and register your app with that project. When you register your app with Firebase, you'll get a Firebase configuration object that you'll use to connect your app with your Firebase project resources. [Docs: follow step 1](https://firebase.google.com/docs/web/setup#create-firebase-project-and-app)


5. Start Anacleto frontend
```shell
npm start
```


## Devs: working with localy version of Anacleto
> Follow this guide if you are a dev and want to edit `anacleto-frontend`. If you have no intention of editing anacleto-frontend you can ignore this chapter.

We suggest that you organize your files this way, but feel free to organize them however you like.

```
workspace
│
└───anacleto
│   └───anacleto-backend
│   └───anacleto-frontend
└───anacleto-apps
│   └───sample-app-1-frontend
│   └───sample-app-1-data
│   └───sample-app-1-logs
│   └───sample-app-2-frontend
│   └───sample-app-2-data
│   └───sample-app-2-logs
```

1. Download `Anacleto` project from Git Repository

2. Connect yout `sample-app-frontend` applicaiton to the local version of `anacleto-frontend`:
```bash
cd <application-path>
npm link <anacleto-frontend-path>/anacleto-frontend
```
> Es: `cd workspace/anacleto-apps/sample-app-1-frontend && sudo npm link ../../anacleto/anacleto-frontend/`


3. Connect `anacleto-frontend` to you application react (to avoide react hook errors), run from <anacleto-frontend-path>:
```bash
cd <anacleto-frontend-path>
npm link <application-path>/node_modules/react
```
> Es: `cd workspace/anacleto/anacleto-frontend && sudo npm link ../../anacleto-apps/sample-app-1-frontend/node_modules/react`

4. Automatically recompile library and work locally on it (your src/ module are automatically recompile it into dist/ whenever you make changes.):

```bash
cd anacleto-frontend && npm start
```




# TSDX React User Guide

Congrats! You just saved yourself hours of work by bootstrapping this project with TSDX. Let’s get you oriented with what’s here and how to use it.

> This TSDX setup is meant for developing React component libraries (not apps!) that can be published to NPM. If you’re looking to build a React-based app, you should use `create-react-app`, `razzle`, `nextjs`, `gatsby`, or `react-static`.

> If you’re new to TypeScript and React, checkout [this handy cheatsheet](https://github.com/sw-yx/react-typescript-cheatsheet/)

## Commands

TSDX scaffolds your new library inside `/src`, and also sets up a [Parcel-based](https://parceljs.org) playground for it inside `/example`.

The recommended workflow is to run TSDX in one terminal:

```bash
npm start # or yarn start
```

This builds to `/dist` and runs the project in watch mode so any edits you save inside `src` causes a rebuild to `/dist`.

Then run the example inside another:

```bash
cd example
npm i # or yarn to install dependencies
npm start # or yarn start
```

The default example imports and live reloads whatever is in `/dist`, so if you are seeing an out of date component, make sure TSDX is running in watch mode like we recommend above. **No symlinking required**, we use [Parcel's aliasing](https://parceljs.org/module_resolution.html#aliases).

To do a one-off build, use `npm run build` or `yarn build`.

To run tests, use `npm test` or `yarn test`.

## Configuration

Code quality is set up for you with `prettier`, `husky`, and `lint-staged`. Adjust the respective fields in `package.json` accordingly.

### Jest

Jest tests are set up to run with `npm test` or `yarn test`.

### Bundle analysis

Calculates the real cost of your library using [size-limit](https://github.com/ai/size-limit) with `npm run size` and visulize it with `npm run analyze`.

#### Setup Files

This is the folder structure we set up for you:

```txt
/example
  index.html
  index.tsx       # test your component here in a demo app
  package.json
  tsconfig.json
/src
  index.tsx       # EDIT THIS
/test
  blah.test.tsx   # EDIT THIS
.gitignore
package.json
README.md         # EDIT THIS
tsconfig.json
```

#### React Testing Library

We do not set up `react-testing-library` for you yet, we welcome contributions and documentation on this.

### Rollup

TSDX uses [Rollup](https://rollupjs.org) as a bundler and generates multiple rollup configs for various module formats and build settings. See [Optimizations](#optimizations) for details.

### TypeScript

`tsconfig.json` is set up to interpret `dom` and `esnext` types, as well as `react` for `jsx`. Adjust according to your needs.

## Continuous Integration

### GitHub Actions

Two actions are added by default:

- `main` which installs deps w/ cache, lints, tests, and builds on all pushes against a Node and OS matrix
- `size` which comments cost comparison of your library on every pull request using [`size-limit`](https://github.com/ai/size-limit)

## Optimizations

Please see the main `tsdx` [optimizations docs](https://github.com/palmerhq/tsdx#optimizations). In particular, know that you can take advantage of development-only optimizations:

```js
// ./types/index.d.ts
declare var __DEV__: boolean;

// inside your code...
if (__DEV__) {
  console.log('foo');
}
```

You can also choose to install and use [invariant](https://github.com/palmerhq/tsdx#invariant) and [warning](https://github.com/palmerhq/tsdx#warning) functions.

## Module Formats

CJS, ESModules, and UMD module formats are supported.

The appropriate paths are configured in `package.json` and `dist/index.js` accordingly. Please report if any issues are found.

## Deploying the Example Playground

The Playground is just a simple [Parcel](https://parceljs.org) app, you can deploy it anywhere you would normally deploy that. Here are some guidelines for **manually** deploying with the Netlify CLI (`npm i -g netlify-cli`):

```bash
cd example # if not already in the example folder
npm run build # builds to dist
netlify deploy # deploy the dist folder
```

Alternatively, if you already have a git repo connected, you can set up continuous deployment with Netlify:

```bash
netlify init
# build command: yarn build && cd example && yarn && yarn build
# directory to deploy: example/dist
# pick yes for netlify.toml
```

## Named Exports

Per Palmer Group guidelines, [always use named exports.](https://github.com/palmerhq/typescript#exports) Code split inside your React app instead of your React library.

## Including Styles

There are many ways to ship styles, including with CSS-in-JS. TSDX has no opinion on this, configure how you like.

For vanilla CSS, you can include it at the root directory and add it to the `files` section in your `package.json`, so that it can be imported separately by your users and run through their bundler's loader.

## Publishing to NPM

We recommend using [np](https://github.com/sindresorhus/np).

## Usage with Lerna

When creating a new package with TSDX within a project set up with Lerna, you might encounter a `Cannot resolve dependency` error when trying to run the `example` project. To fix that you will need to make changes to the `package.json` file _inside the `example` directory_.

The problem is that due to the nature of how dependencies are installed in Lerna projects, the aliases in the example project's `package.json` might not point to the right place, as those dependencies might have been installed in the root of your Lerna project.

Change the `alias` to point to where those packages are actually installed. This depends on the directory structure of your Lerna project, so the actual path might be different from the diff below.

```diff
   "alias": {
-    "react": "../node_modules/react",
-    "react-dom": "../node_modules/react-dom"
+    "react": "../../../node_modules/react",
+    "react-dom": "../../../node_modules/react-dom"
   },
```

An alternative to fixing this problem would be to remove aliases altogether and define the dependencies referenced as aliases as dev dependencies instead. [However, that might cause other problems.](https://github.com/palmerhq/tsdx/issues/64)




# License

MIT © [lucabiasotto](https://github.com/lucabiasotto) & [AndreaDeP](https://github.com/AndreaDeP) & [Havock94](https://github.com/Havock94)

