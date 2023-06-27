export const silenceErrors = () => {
  jest.spyOn(console, 'error').mockImplementation(() => {})
}
