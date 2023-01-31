module.exports = {
  "*.{ts,tsx}": filenames =>
    filenames.map(filename => `eslint --cache --fix '${filename}'`),
};
