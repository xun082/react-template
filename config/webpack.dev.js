/**
 * @type {import('webpack').Configuration}
 */

const { merge } = require("webpack-merge");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const webpackCommonConfig = require("./webpack.common");
const path = require("path");
const ESLintPlugin = require("eslint-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = merge(webpackCommonConfig, {
  mode: "development",
  devtool: "source-map",
  devServer: {
    open: true,
    host: "localhost",
    port: 3000,
    hot: true,
    compress: true, // 是否启用 gzip 压缩
    historyApiFallback: true, // 解决前端路由刷新404现象
  },
  resolve: {
    extensions: [".js", ".json", ".jsx", ".ts", ".css", ".tsx"],
    alias: {
      "@": path.resolve(__dirname, "../src"),
    },
  },
  plugins: [
    new ReactRefreshWebpackPlugin(),
    // 解决babel-loader无法检查ts类型错误问题
    new ForkTsCheckerWebpackPlugin({
      async: false,
    }),
    new ESLintPlugin({
      extensions: [".js", ".jsx", ".ts", ".tsx"],
      context: path.resolve(__dirname, "../src"),
      exclude: "node_modules",
      cache: true, // 开启缓存
      // 缓存目录
      cacheLocation: path.resolve(
        __dirname,
        "../node_modules/.cache/.eslintCache"
      ),
    }),
  ],
});
