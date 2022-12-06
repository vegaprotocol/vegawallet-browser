# tooling

Tooling to support building and packaging applications as browser extensions.

### Building

Run `yarn nx build tooling` to build the library.

### Usage

The library has been generated using [@nrwl/nx-plugin](https://nx.dev/packages/nx-plugin). It exposes executors and generators to support the desired processes in the monorepo.

##### Build executor

The build executor can be called from any `project.json` file of a library in the nx context.

Example:
```
{
  "$schema": "../../node_modules/nx/schemas/project-schema.json",
  "sourceRoot": "libs/<my-app>",
  "projectType": "library",
  "targets": {
    "build": {
      "executor": "./libs/tooling:build",
      "options": {
        "name": "Vega Wallet",
        "description": "Vega Wallet Browser Extension",
        "outputPath": "dist/libs/<my-app>",
        "popup": {
          "main": "path/to/typescript-app",
          "styles": "path/to/css-file",
          "tsConfig": "path/to/tsConfig.json"
        }
      },
      "configurations": {
        "firefox": {
          "target": "firefox"
        }
      }
    }
  },
  ...
}
```

The above configuration can be called with `yarn nx run <my-lib>:build:firefox`, which will result in build in the
The executor uses the extension generator under the hood, generates the necessary source files into the `/dist/libs/<my-app>` folder, containing a `.zip` file which can be used to import it to a browser.

##### Run executor

Not yet implemented, coming soon.

##### Extension generator

The extension generator is used to generate extension specific files (manifest.json, etc) based on the target browser you want to build for, handling the potential overlaps as well as any platform specific criteria.
You most likely won't need to run this manually, as it's used internally by the executors, but you certainly can by calling `yarn nx generate libs/tooling:extension` with the following flags:
- `--name`: the name of the generated extension
- `--description`: description of the extension
- `--directory`: target directory to generate the source files
- `--popupHtml` (optional): source html file for the [browser action popup](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Browser_actions)
- `--popupJs` (optional): source javascript file for the browser action popup which will be embedded into the html file above automatically if provided
- `--popupStyles` (optional): source css file for the browser action popup which will be embedded into the html file above automatically if provided
- `--popupTitle` (optional): the title of the popup application (put into the generated html file mentioned above using a template)
- `--popupDescription` (optional): the description of the popup application (put into the generated html file mentioned above using a template)
- `--backgroundJs` (optional): source javascript file for the [background application](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Background_scripts) run by the browser extension

### Development

If you're actively developing the tooling codebase, you can run the build in watch mode by executing `yarn nx build tooling --watch`.

### Running unit tests

Run `yarn nx test tooling` to execute the unit tests via [Jest](https://jestjs.io).
