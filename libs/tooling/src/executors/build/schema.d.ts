export interface BuildExecutorSchema {
  outputPath: string
  target: 'firefox'
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
}
