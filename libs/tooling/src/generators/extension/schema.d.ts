export interface ExtensionGeneratorSchema {
  name: string
  description: string
  directory: string
  target: 'firefox' | 'chrome'
  popupHtml: string | undefined
  popupJs: string | undefined
  popupStyles: string | undefined
  popupTitle: string | undefined
  popupDescription: string | undefined
  backgroundJs: string | undefined
}
