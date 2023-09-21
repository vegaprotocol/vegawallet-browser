import config from '!/config'

type ConsoleMethod = {
  [K in keyof Console]: Console[K] extends (...args: any[]) => unknown ? K : never
}[keyof Console] &
  string

export const log = (level: ConsoleMethod, ...args: any[]) => {
  /* istanbul ignore next */
  if (config.logging) {
    // @ts-ignore - TS doesn't like that this is not a tuple but as we can pass any amount of arguments the type is correct
    console[level](...args)
  }
}
