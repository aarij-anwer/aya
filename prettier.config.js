/** @type {import('prettier').Options} */
module.exports = {
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindStylesheet: './src/styles/tailwind.css',
};
