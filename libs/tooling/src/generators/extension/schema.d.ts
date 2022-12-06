export interface ExtensionGeneratorSchema {
  name: string
  description: string
  directory: string
  popupHtml: string | undefined
  popupJs: string | undefined
  popupStyles: string | undefined
  popupTitle: string | undefined
  popupDescription: string | undefined
  backgroundJs: string | undefined
}
