import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing'
import { Tree } from '@nrwl/devkit'

import generator from './generator'
import { ExtensionGeneratorSchema } from './schema'

const NAME = 'wallet-test'

describe('extension generator', () => {
  let appTree: Tree
  const options: ExtensionGeneratorSchema = {
    name: NAME,
    description: 'Test Description',
    directory: `./dist/libs/${NAME}`,
    target: 'firefox',
    popupHtml: undefined,
    popupJs: undefined,
    popupStyles: undefined,
    popupTitle: undefined,
    popupDescription: undefined,
    backgroundJs: undefined,
    contentJs: undefined,
  }

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace()
  })

  it('should run successfully', async () => {
    await generator(appTree, options)
    expect(appTree.exists(`dist/libs/${NAME}/manifest.json`)).toBe(true)
  })
})
