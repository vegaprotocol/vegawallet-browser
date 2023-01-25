"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const node_path_1 = tslib_1.__importDefault(require("node:path"));
const node_child_process_1 = require("node:child_process");
const fs_extra_1 = require("fs-extra");
const webpack_1 = require("@nrwl/webpack");
const tree_1 = require("nx/src/generators/tree");
const generator_1 = tslib_1.__importDefault(require("../../generators/extension/generator"));
const prepareOutput = (outputPath) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        const outputStats = yield (0, fs_extra_1.stat)(outputPath);
        if (outputStats.isDirectory()) {
            yield (0, fs_extra_1.remove)(outputPath);
        }
        // eslint-disable-next-line
    }
    catch (err) {
        if ('code' in err && err.code === 'ENOENT') {
            return;
        }
        throw err;
    }
});
const buildJs = (options, context) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    var e_1, _a;
    const result = { success: true };
    try {
        for (var _b = tslib_1.__asyncValues((0, webpack_1.webpackExecutor)(Object.assign(Object.assign({}, options), { sourceMap: true, fileReplacements: [], assets: [] }), context)), _c; _c = yield _b.next(), !_c.done;) {
            const item = _c.value;
            result.success = result.success && item.success;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return result;
});
const generateExtenstionFiles = (options, context) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const tree = new tree_1.FsTree(context.root, false);
    yield (0, generator_1.default)(tree, {
        name: options.name,
        description: options.description,
        directory: options.outputPath,
        target: options.target,
        popupHtml: options.popup ? './popup/index.html' : undefined,
        popupJs: options.popup ? './main.js' : undefined,
        popupTitle: options.name,
        popupDescription: options.description,
        popupStyles: ((_d = options.popup) === null || _d === void 0 ? void 0 : _d.styles) ? './styles.css' : undefined,
        backgroundJs: options.background ? './background/main.js' : undefined,
    });
    const changes = tree.listChanges();
    (0, tree_1.flushChanges)(context.root, changes);
});
const packExtension = ({ sourceDir, targetDir }) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    yield new Promise((resolve, reject) => {
        const process = (0, node_child_process_1.spawn)('yarn', [
            'web-ext',
            'build',
            `--source-dir=${sourceDir}`,
            `--artifacts-dir=${targetDir || sourceDir}`,
        ]);
        process.on('error', (err) => {
            reject(err);
        });
        process.on('close', () => {
            resolve(null);
        });
    });
});
function runExecutor(options, context) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const project = context.projectName && context.workspace.projects[context.projectName];
        if (!project) {
            return {
                success: false,
            };
        }
        try {
            yield prepareOutput(options.outputPath);
            if (options.popup) {
                yield buildJs({
                    compiler: 'swc',
                    outputPath: node_path_1.default.join(context.root, options.outputPath, 'popup'),
                    main: node_path_1.default.join(context.root, options.popup.main),
                    tsConfig: node_path_1.default.join(context.root, options.popup.tsConfig),
                    styles: [node_path_1.default.join(context.root, options.popup.styles)],
                    webpackConfig: node_path_1.default.join(context.root, project.root, 'webpack.popup.config.js'),
                }, context);
            }
            if (options.background) {
                // await build({
                //   entryPoints: [path.join(context.root, options.background.main)],
                //   bundle: true,
                //   format: 'cjs',
                //   outfile: path.join(context.root, options.outputPath, 'background', 'main.js'),
                //   tsconfig: path.join(context.root, options.background.tsConfig),
                //   alias: {
                //     '@vegaprotocol/wallet-ui/src/types': path.join(context.root, 'node_modules/@vegaprotocol/wallet-ui/src/types/index.d.ts')
                //   }
                // })
                //
                yield buildJs({
                    compiler: 'swc',
                    outputPath: node_path_1.default.join(context.root, options.outputPath, 'background'),
                    main: node_path_1.default.join(context.root, options.background.main),
                    tsConfig: node_path_1.default.join(context.root, options.background.tsConfig),
                    styles: [],
                    webpackConfig: node_path_1.default.join(context.root, project.root, 'webpack.background.config.js'),
                }, context);
            }
            yield generateExtenstionFiles(options, context);
            if (options.target === 'firefox') {
                yield packExtension({
                    sourceDir: node_path_1.default.join(context.root, options.outputPath),
                });
            }
        }
        catch (err) {
            console.error(err);
            return {
                success: false,
            };
        }
        return {
            success: true,
        };
    });
}
exports.default = runExecutor;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhlY3V0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJleGVjdXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxrRUFBNEI7QUFDNUIsMkRBQTBDO0FBQzFDLHVDQUF1QztBQUV2QywyQ0FBdUU7QUFDdkUsaURBQTZEO0FBRzdELDZGQUFxRTtBQUVyRSxNQUFNLGFBQWEsR0FBRyxDQUFPLFVBQWtCLEVBQUUsRUFBRTtJQUNqRCxJQUFJO1FBQ0YsTUFBTSxXQUFXLEdBQUcsTUFBTSxJQUFBLGVBQUksRUFBQyxVQUFVLENBQUMsQ0FBQTtRQUMxQyxJQUFJLFdBQVcsQ0FBQyxXQUFXLEVBQUUsRUFBRTtZQUM3QixNQUFNLElBQUEsaUJBQU0sRUFBQyxVQUFVLENBQUMsQ0FBQTtTQUN6QjtRQUNELDJCQUEyQjtLQUM1QjtJQUFDLE9BQU8sR0FBUSxFQUFFO1FBQ2pCLElBQUksTUFBTSxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLFFBQVEsRUFBRTtZQUMxQyxPQUFNO1NBQ1A7UUFDRCxNQUFNLEdBQUcsQ0FBQTtLQUNWO0FBQ0gsQ0FBQyxDQUFBLENBQUE7QUFPRCxNQUFNLE9BQU8sR0FBRyxDQUNkLE9BQStCLEVBQy9CLE9BQXdCLEVBQ3hCLEVBQUU7O0lBQ0YsTUFBTSxNQUFNLEdBQUcsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUE7O1FBRWhDLEtBQXlCLElBQUEsS0FBQSxzQkFBQSxJQUFBLHlCQUFlLGtDQUVqQyxPQUFPLEtBQ1YsU0FBUyxFQUFFLElBQUksRUFDZixnQkFBZ0IsRUFBRSxFQUFFLEVBQ3BCLE1BQU0sRUFBRSxFQUFFLEtBRVosT0FBTyxDQUNSLENBQUEsSUFBQTtZQVJVLE1BQU0sSUFBSSxXQUFBLENBQUE7WUFTbkIsTUFBTSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUE7U0FDaEQ7Ozs7Ozs7OztJQUVELE9BQU8sTUFBTSxDQUFB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