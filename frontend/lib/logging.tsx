import config from '!/config'

type ConsoleMethod = {
  [K in keyof Console]: Console[K] extends (...args: any[]) => unknown ? K : never
}[keyof Console] &
  string

export const log = (level: ConsoleMethod, ...args: any[]) => {
  /* istanbul ignore next */
  if (config.logging) {
    console[level].apply(console, args)
  }
}
