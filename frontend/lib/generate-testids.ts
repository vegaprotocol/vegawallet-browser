import config from '!/config'

export const generateTestIds = (locator: string) => {
  const isTestBuild = config.addMobileIds
  if (isTestBuild) {
    return {
      'data-testid': locator,
      'aria-label': locator,
      role: locator
    }
  }
  return {
    'data-testid': locator
  }
}
