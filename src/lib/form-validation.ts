export const Validation = {
  REQUIRED: 'Required',

  // Patterns
  URL: {
    value:
      // Complains about unnecessary escape character but I don't want to mess with it as
      // its copied from Stack Overflow
      // eslint-disable-next-line
      /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/i,
    message: 'Invalid URL'
  },

  // Custom logic
  match: (value: string | number | boolean) => ({
    message: 'Password does not match',
    value: new RegExp(`^${value}$`)
  })
}
