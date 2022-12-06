const { merge } = require("webpack-merge");
// const path = require("path");
const webpackCommonConfig = require("./webpack.common");

module.exports = merge(webpackCommonConfig, {
  mode: "development",
  //dev环境开启代码代码同步行数
  devtool: "eval-cheap-module-source-map",
  devServer: {
    host: "localhost",
    port: 30000,
    hot: true,
    compress: true, // 是否启用 gzip 压缩
  },
});
