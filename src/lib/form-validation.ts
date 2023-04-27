export const Validation = {
  REQUIRED: 'Required',

  // Custom logic
  match: (value: string | number | boolean) => ({
    message: 'Password does not match',
    value: new RegExp(`^${value}$`)
  })
}
