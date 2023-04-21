const { join } = require("path");
const theme = require("@vegaprotocol/tailwindcss-config/src/theme");
const vegaCustomClasses = require("@vegaprotocol/tailwindcss-config/src/vega-custom-classes");

module.exports = {
  content: [
    join(__dirname, "src/**/*.{js,ts,jsx,tsx}"),
    join(__dirname, "./node_modules/@vegaprotocol/ui-toolkit/index.js"),
  ],
  darkMode: "class",
  theme: {
    extend: {
      ...theme,
    },
  },
  plugins: [vegaCustomClasses],
};
