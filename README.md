# vegawallet-browser

The monorepo contains the Vega browser extensions.

This repository is managed using [Nx](https://nx.dev).

# 🔎 Libraries

### [Tooling](./libs/tooling)

Tools for building and running an app as an extension, tool for generating extension environments and packaging an app as a browser extension.

### [Wallet popup](./libs/wallet-popup)

The application rendered when clicking the extension icon in the browser's address bar.

### [Wallet web](./libs/wallet-web)

The base application for the browser extensions, contains only the essential build configurations.

# 💻 Development

### Dependencies

To run the code in this repository, you will need the following:

- nodejs > `18.12`
- yarn > `1.22.19`

### Set up

Check you have the correct version of Node. You can [install NVM to switch between node versions](https://github.com/nvm-sh/nvm#installing-and-updating). Then `NVM install`.
Before you build you will need to `yarn install` in the root directory.

### Build

Run `yarn nx run <my-app>:build:<browser>` to build the project. The build artifacts will be stored in the `dist/` directory, with a `.zip` file which you can import into your browser, or upload to the specific extension store. You will need to specify which browser you want to build the app for. 

### Running tests

Run `yarn nx run <my-app>:test` to execute the unit tests with [Jest](https://jestjs.io), or `nx affected:test` to execute just unit tests affected by a change. You can also use `--watch` with these test to run jest in watch mode, see [Jest executor](https://nx.dev/packages/jest/executors/jest) for all CLI flags.

### Formatting

In CI linting, formatting and also run. These checks can be seen in the [CI workflow file](.github/workflows//test.yml).

- To fix linting errors locally run `yarn nx lint --fix`
- To fix formatting errors local run `yarn nx format:write`
- For either command you may use `--all` to run across the entire repository

### Further help with Nx

Visit the [Nx Documentation](https://nx.dev/getting-started/intro) to learn more.

# 📑 License

[MIT](./LICENSE)
