import { join } from 'path'
import { theme, vegaCustomClasses } from '@vegaprotocol/tailwindcss-config'

export default {
  content: [
    join(__dirname, 'frontend/**/*.{js,ts,jsx,tsx}'),
    join(__dirname, './node_modules/@vegaprotocol/ui-toolkit/index.cjs.js')
  ],
  darkMode: 'class',
  theme: {
    extend: {
      ...theme
    }
  },
  plugins: [vegaCustomClasses]
}
