/**
 * @type {import('webpack').Configuration}
 */
const { PUBLIC_PATH } = require("./util/constants");
const webpackCommonConfig = require("./webpack.common");
const { merge } = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const copyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const glob = require("glob");
const { PurgeCSSPlugin } = require("purgecss-webpack-plugin");
const path = require("path");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = merge(webpackCommonConfig, {
  mode: "production",
  devtool: "hidden-source-map",
  plugins: [
    new MiniCssExtractPlugin({
      filename: "static/css/[name].[contenthash].css",
      chunkFilename: "static/css/[name].[contenthash].css",
      ignoreOrder: true,
    }),
    new CleanWebpackPlugin(),
    new copyWebpackPlugin({
      patterns: [
        {
          from: PUBLIC_PATH,
          to: "./",
          globOptions: {
            dot: true,
            gitignore: true,
            ignore: ["**/index.html*"],
          },
        },
      ],
    }),
    // 清除没有使用的css代码
    // TODO
    new PurgeCSSPlugin({
      paths: glob.sync(`${path.join(__dirname, "src")}/**/*`, { nodir: true }),
      only: ["bundle", "vendor"],
    }),
    // 生成目录文件
    new WebpackManifestPlugin({
      fileName: "asset-manifest.json",
      generate: (seed, files, entryPoints) => {
        const manifestFiles = files.reduce((manifest, file) => {
          if (manifest) manifest[file.name] = file.path;
          return manifest;
        }, seed);
        const entrypointFiles = entryPoints.index.filter(
          (fileName) => !fileName.endsWith(".map")
        );

        return {
          files: manifestFiles,
          entryPoints: entrypointFiles,
        };
      },
    }),
    // 打包体积分析
    new BundleAnalyzerPlugin(),
  ],

  // 如果一个资源超过则提示
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
});
