
module.exports = {
  "parser": "babel-eslint",
  "extends": [
    "standard",
    "standard-jsx"
  ],
  "plugins": [
    "standard",
    "promise",
    "filenames"
  ],
  "rules": {
    "jsx-quotes": ["error", "prefer-double"],
    "filenames/match-exported": [2, [null, "snake", "kebab"]]
  }
};
