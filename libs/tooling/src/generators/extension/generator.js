'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const tslib_1 = require('tslib')
const devkit_1 = require('@nrwl/devkit')
const path = tslib_1.__importStar(require('path'))
function normalizeOptions(options) {
  const projectDirectory = options.directory
  const projectName = options.name
  const projectRoot = projectDirectory
  const parsedTags = []
  return Object.assign(Object.assign({}, options), {
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
  })
}
function addFiles(tree, options) {
  const templateOptions = Object.assign(
    Object.assign(
      Object.assign({}, options),
      (0, devkit_1.names)(options.name)
    ),
    {
      offsetFromRoot: (0, devkit_1.offsetFromRoot)(options.projectRoot),
      template: '',
    }
  )
  ;(0, devkit_1.generateFiles)(
    tree,
    path.join(__dirname, 'files'),
    options.projectRoot,
    templateOptions
  )
  ;(0, devkit_1.generateFiles)(
    tree,
    path.join(__dirname, `files-${options.target}`),
    options.projectRoot,
    templateOptions
  )
}
function default_1(tree, options) {
  return tslib_1.__awaiter(this, void 0, void 0, function* () {
    const normalizedOptions = normalizeOptions(options)
    addFiles(tree, normalizedOptions)
    yield (0, devkit_1.formatFiles)(tree)
  })
}
exports.default = default_1
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZ2VuZXJhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHlDQU1xQjtBQUNyQixtREFBNEI7QUFVNUIsU0FBUyxnQkFBZ0IsQ0FBQyxPQUFpQztJQUN6RCxNQUFNLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUE7SUFDMUMsTUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQTtJQUNoQyxNQUFNLFdBQVcsR0FBRyxnQkFBZ0IsQ0FBQTtJQUNwQyxNQUFNLFVBQVUsR0FBYSxFQUFFLENBQUE7SUFFL0IsdUNBQ0ssT0FBTyxLQUNWLFdBQVc7UUFDWCxXQUFXO1FBQ1gsZ0JBQWdCO1FBQ2hCLFVBQVUsSUFDWDtBQUNILENBQUM7QUFFRCxTQUFTLFFBQVEsQ0FBQyxJQUFVLEVBQUUsT0FBeUI7SUFDckQsTUFBTSxlQUFlLGlEQUNoQixPQUFPLEdBQ1AsSUFBQSxjQUFLLEVBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUN0QixjQUFjLEVBQUUsSUFBQSx1QkFBYyxFQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsRUFDbkQsUUFBUSxFQUFFLEVBQUUsR0FDYixDQUFBO0lBQ0QsSUFBQSxzQkFBYSxFQUNYLElBQUksRUFDSixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsRUFDN0IsT0FBTyxDQUFDLFdBQVcsRUFDbkIsZUFBZSxDQUNoQixDQUFBO0lBQ0QsSUFBQSxzQkFBYSxFQUNYLElBQUksRUFDSixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxTQUFTLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUMvQyxPQUFPLENBQUMsV0FBVyxFQUNuQixlQUFlLENBQ2hCLENBQUE7QUFDSCxDQUFDO0FBRUQsbUJBQStCLElBQVUsRUFBRSxPQUFpQzs7UUFDMUUsTUFBTSxpQkFBaUIsR0FBRyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUNuRCxRQUFRLENBQUMsSUFBSSxFQUFFLGlCQUFpQixDQUFDLENBQUE7UUFDakMsTUFBTSxJQUFBLG9CQUFXLEVBQUMsSUFBSSxDQUFDLENBQUE7SUFDekIsQ0FBQztDQUFBO0FBSkQsNEJBSUMifQ==
