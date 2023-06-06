import { join } from 'path'
import theme from '@vegaprotocol/tailwindcss-config/src/theme'
import vegaCustomClasses from '@vegaprotocol/tailwindcss-config/src/vega-custom-classes'

export default {
  content: [
    join(__dirname, 'src/**/*.{js,ts,jsx,tsx}'),
    join(__dirname, './node_modules/@vegaprotocol/ui-toolkit/index.js')
  ],
  darkMode: 'class',
  theme: {
    extend: {
      ...theme
    }
  },
  plugins: [vegaCustomClasses]
}
