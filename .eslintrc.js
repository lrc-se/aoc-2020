module.exports = {
  root: true,

  env: {
    node: true
  },

  extends: [
    "plugin:vue/vue3-recommended",
    "@vue/standard",
    "@vue/typescript/recommended"
  ],

  parserOptions: {
    ecmaVersion: 2020
  },

  rules: {
    "no-console": "off",
    "no-debugger": "off",

    eqeqeq: "off",
    quotes: ["error", "double"],
    semi: ["error", "always"],
    "space-before-function-paren": [
      "error",
      {
        anonymous: "never",
        named: "never",
        asyncArrow: "always"
      }
    ],

    "@typescript-eslint/no-use-before-define": ["error", "nofunc"],

    "vue/max-attributes-per-line": [
      "error",
      {
        singleline: 2
      }
    ],
    "vue/singleline-html-element-content-newline": "off"
  }
};
