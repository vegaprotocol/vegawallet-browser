export interface BuildExecutorSchema {
  outputPath: string
  target: 'firefox' | 'chrome'
  name: string
  description: string
  popup?: {
    main: string
    styles: string
    tsConfig: string
  }
  background?: {
    main: string
    tsConfig: string
  }
  content?: {
    main: string
    tsConfig: string
  }
}
