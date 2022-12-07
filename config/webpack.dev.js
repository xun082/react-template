const { merge } = require("webpack-merge");
// const path = require("path");
const webpackCommonConfig = require("./webpack.common");

module.exports = merge(webpackCommonConfig, {
  mode: "development",
  devtool: "source-map",
  devServer: {
    open: true,
    host: "localhost",
    port: 3000,
    hot: true,
    compress: true, // 是否启用 gzip 压缩
  },
});
