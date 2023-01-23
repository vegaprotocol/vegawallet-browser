'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const tslib_1 = require('tslib')
const node_path_1 = tslib_1.__importDefault(require('node:path'))
const node_child_process_1 = require('node:child_process')
const fs_extra_1 = require('fs-extra')
const webpack_1 = require('@nrwl/webpack')
const tree_1 = require('nx/src/generators/tree')
const generator_1 = tslib_1.__importDefault(
  require('../../generators/extension/generator')
)
const prepareOutput = (outputPath) =>
  tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
      const outputStats = yield (0, fs_extra_1.stat)(outputPath)
      if (outputStats.isDirectory()) {
        yield (0, fs_extra_1.remove)(outputPath)
      }
      // eslint-disable-next-line
    } catch (err) {
      if ('code' in err && err.code === 'ENOENT') {
        return
      }
      throw err
    }
  })
const buildJs = (options, context) =>
  tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    var e_1, _a
    const result = { success: false }
    try {
      for (
        var _b = tslib_1.__asyncValues(
            (0, webpack_1.webpackExecutor)(
              Object.assign(Object.assign({}, options), {
                sourceMap: true,
                fileReplacements: [],
                assets: [],
              }),
              context
            )
          ),
          _c;
        (_c = yield _b.next()), !_c.done;

      ) {
        const item = _c.value
        result.success = item.success
      }
    } catch (e_1_1) {
      e_1 = { error: e_1_1 }
    } finally {
      try {
        if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b)
      } finally {
        if (e_1) throw e_1.error
      }
    }
    return result
  })
const generateExtenstionFiles = (options, context) =>
  tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    var _d
    const tree = new tree_1.FsTree(context.root, false)
    yield (0, generator_1.default)(tree, {
      name: options.name,
      description: options.description,
      directory: options.outputPath,
      target: options.target,
      popupHtml: options.popup ? './popup/index.html' : undefined,
      popupJs: options.popup ? './main.js' : undefined,
      popupTitle: options.name,
      popupDescription: options.description,
      popupStyles: (
        (_d = options.popup) === null || _d === void 0 ? void 0 : _d.styles
      )
        ? './styles.css'
        : undefined,
      backgroundJs: options.background ? './main.js' : undefined,
    })
    const changes = tree.listChanges()
    ;(0, tree_1.flushChanges)(context.root, changes)
  })
const packExtension = ({ sourceDir, targetDir }) =>
  tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    yield new Promise((resolve, reject) => {
      const process = (0, node_child_process_1.spawn)('yarn', [
        'web-ext',
        'build',
        `--source-dir=${sourceDir}`,
        `--artifacts-dir=${targetDir || sourceDir}`,
      ])
      process.on('error', (err) => {
        reject(err)
      })
      process.on('close', () => {
        resolve(null)
      })
    })
  })
function runExecutor(options, context) {
  return tslib_1.__awaiter(this, void 0, void 0, function* () {
    const project =
      context.projectName && context.workspace.projects[context.projectName]
    if (!project) {
      return {
        success: false,
      }
    }
    try {
      yield prepareOutput(options.outputPath)
      if (options.popup) {
        yield buildJs(
          {
            compiler: 'swc',
            outputPath: node_path_1.default.join(
              context.root,
              options.outputPath,
              'popup'
            ),
            main: node_path_1.default.join(context.root, options.popup.main),
            tsConfig: node_path_1.default.join(
              context.root,
              options.popup.tsConfig
            ),
            styles: [
              node_path_1.default.join(context.root, options.popup.styles),
            ],
            webpackConfig: node_path_1.default.join(
              context.root,
              project.root,
              'webpack.popup.config.js'
            ),
          },
          context
        )
      }
      if (options.background) {
        yield buildJs(
          {
            compiler: 'swc',
            outputPath: node_path_1.default.join(
              context.root,
              options.outputPath,
              'background'
            ),
            main: node_path_1.default.join(
              context.root,
              options.background.main
            ),
            tsConfig: node_path_1.default.join(
              context.root,
              options.background.tsConfig
            ),
            webpackConfig: node_path_1.default.join(
              context.root,
              project.root,
              'webpack.background.config.js'
            ),
          },
          context
        )
      }
      yield generateExtenstionFiles(options, context)
      if (options.target === 'firefox') {
        yield packExtension({
          sourceDir: node_path_1.default.join(context.root, options.outputPath),
        })
      }
    } catch (err) {
      console.error(err)
      return {
        success: false,
      }
    }
    return {
      success: true,
    }
  })
}
exports.default = runExecutor
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhlY3V0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJleGVjdXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxrRUFBNEI7QUFDNUIsMkRBQTBDO0FBQzFDLHVDQUF1QztBQUN2QywyQ0FBdUU7QUFDdkUsaURBQTZEO0FBRzdELDZGQUFxRTtBQUVyRSxNQUFNLGFBQWEsR0FBRyxDQUFPLFVBQWtCLEVBQUUsRUFBRTtJQUNqRCxJQUFJO1FBQ0YsTUFBTSxXQUFXLEdBQUcsTUFBTSxJQUFBLGVBQUksRUFBQyxVQUFVLENBQUMsQ0FBQTtRQUMxQyxJQUFJLFdBQVcsQ0FBQyxXQUFXLEVBQUUsRUFBRTtZQUM3QixNQUFNLElBQUEsaUJBQU0sRUFBQyxVQUFVLENBQUMsQ0FBQTtTQUN6QjtRQUNELDJCQUEyQjtLQUM1QjtJQUFDLE9BQU8sR0FBUSxFQUFFO1FBQ2pCLElBQUksTUFBTSxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLFFBQVEsRUFBRTtZQUMxQyxPQUFNO1NBQ1A7UUFDRCxNQUFNLEdBQUcsQ0FBQTtLQUNWO0FBQ0gsQ0FBQyxDQUFBLENBQUE7QUFPRCxNQUFNLE9BQU8sR0FBRyxDQUNkLE9BQStCLEVBQy9CLE9BQXdCLEVBQ3hCLEVBQUU7O0lBQ0YsTUFBTSxNQUFNLEdBQUcsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUE7O1FBRWpDLEtBQXlCLElBQUEsS0FBQSxzQkFBQSxJQUFBLHlCQUFlLGtDQUVqQyxPQUFPLEtBQ1YsU0FBUyxFQUFFLElBQUksRUFDZixnQkFBZ0IsRUFBRSxFQUFFLEVBQ3BCLE1BQU0sRUFBRSxFQUFFLEtBRVosT0FBTyxDQUNSLENBQUEsSUFBQTtZQVJVLE1BQU0sSUFBSSxXQUFBLENBQUE7WUFTbkIsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFBO1NBQzlCOzs7Ozs7Ozs7SUFFRCxPQUFPLE1BQU0sQ0FBQTtBQUNmLENBQUMsQ0FBQSxDQUFB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
