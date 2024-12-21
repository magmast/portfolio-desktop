/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  plugins: [
    "@trivago/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
  importOrder: ["^node:", "<THIRD_PARTY_MODULES>", "^~/", "^[./]"],
  importOrderSeparation: true,
  importOrderSideEffects: false,
};

export default config;
