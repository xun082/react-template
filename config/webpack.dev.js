/**
 * @type {import('webpack').Configuration}
 */

const { merge } = require("webpack-merge");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const webpackCommonConfig = require("./webpack.common");
const path = require("path");
const ESLintPlugin = require("eslint-webpack-plugin");
const CircularDependencyPlugin = require("circular-dependency-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const { SRC_PATH, IS_DEVELOPMENT } = require("./util/constants");
const portFinder = require("portfinder");

const devWebpackConfig = merge(webpackCommonConfig, {
  mode: "development",
  devtool: "source-map",
  devServer: {
    open: true,
    host: "localhost",
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
  module: {
    rules: [
      {
        test: /\.(tsx?|jsx?)$/,
        include: [SRC_PATH],
        loader: "babel-loader",
        options: {
          cacheDirectory: true,
          cacheCompression: false, // 缓存不压缩
          plugins: [
            IS_DEVELOPMENT && "react-refresh/babel", // 激活 js 的 HMR
          ],
        },
        exclude: [/node_modules/, /public/, /(.|_)min\.js$/],
      },
    ],
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
    //  解决模块循环引入问题
    new CircularDependencyPlugin({
      exclude: /node_modules/,
      include: /src/,
      failOnError: true,
      allowAsyncCycles: false,
      cwd: process.cwd(),
    }),
  ],
});

module.exports = new Promise((resolve, reject) => {
  portFinder.getPort(
    {
      port: 3000, // 默认端口为3000,如果占用了则加一,以此类推
      stopPort: 30000,
    },
    (error, port) => {
      if (error) reject(error);
      devWebpackConfig.devServer.port = port;
      resolve(devWebpackConfig);
    }
  );
});
