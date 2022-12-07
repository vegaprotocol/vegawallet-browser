import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing'
import { Tree, readProjectConfiguration } from '@nrwl/devkit'

import generator from './generator'
import { ExtensionGeneratorSchema } from './schema'

describe('extension generator', () => {
  let appTree: Tree
  const options: ExtensionGeneratorSchema = {
    name: 'test',
    description: 'Test Description',
    directory: './',
    popupHtml: undefined,
    popupJs: undefined,
    popupStyles: undefined,
    popupTitle: undefined,
    popupDescription: undefined,
    backgroundJs: undefined,
  }

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace()
  })

  it('should run successfully', async () => {
    await generator(appTree, options)
    const config = readProjectConfiguration(appTree, 'test')
    expect(config).toBeDefined()
  })
})
