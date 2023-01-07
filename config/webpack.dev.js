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
const portFinder = require("portfinder");
const WebpackBar = require("webpackbar");

//  优化效率工具 速度分析
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();

const devWebpackConfig = merge(
  webpackCommonConfig,
  {
    stats: "errors-only",
    mode: "development",
    devtool: "source-map",
    devServer: {
      open: true,
      host: "localhost",
      hot: true,
      compress: true, // 是否启用 gzip 压缩
      historyApiFallback: true, // 解决前端路由刷新404现象
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
      // 进度条
      new WebpackBar({
        color: "green",
        basic: false,
        profile: false,
      }),
    ],
    optimization: {
      // 这些优化适用于小型代码库，但是在大型代码库中却非常耗费性能
      removeAvailableModules: false,
      removeEmptyChunks: false,
      splitChunks: false,

      minimize: false,
      concatenateModules: false,
      usedExports: false,
    },
  },
  smp.wrap({})
);

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
