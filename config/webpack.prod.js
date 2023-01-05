/**
 * @type {import('webpack').Configuration}
 */
const { IS_PRODUCTION } = require("./util/constants");
const webpackCommonConfig = require("./webpack.common");
const { merge } = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = merge(webpackCommonConfig, {
  plugins: [new MiniCssExtractPlugin()],
});
