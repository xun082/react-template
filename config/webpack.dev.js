const { merge } = require("webpack-merge");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const webpackCommonConfig = require("./webpack.common");
const path = require("path");
const EslintWebpackPlugin = require("eslint-webpack-plugin");

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
    new EslintWebpackPlugin({
      context: path.resolve(__dirname, "../src"),
      exclude: "node_modules",
      cache: true,
      cacheLocation: path.resolve(
        __dirname,
        "../node_modules/.cache/.eslintCache"
      ),
    }),
  ],
});
