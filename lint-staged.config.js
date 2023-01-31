module.exports = {
  "*.{ts,tsx}": filenames =>
    filenames.map(filename => `eslint  --fix '${filename}'`),
};
