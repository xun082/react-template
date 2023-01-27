/**
 * @type {import('webpack').Configuration}
 */
const { PUBLIC_PATH } = require("./util/constants");
const webpackCommonConfig = require("./webpack.common");
const { merge } = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const copyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const globAll = require("glob-all");
const { PurgeCSSPlugin } = require("purgecss-webpack-plugin");
const path = require("path");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlMinimizerPlugin = require("html-minimizer-webpack-plugin");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const { gzip } = require("zlib");

//  优化效率工具 速度分析
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();

module.exports = merge(webpackCommonConfig, {
  mode: "production",
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
      paths: globAll.sync([
        `${path.join(__dirname, "../src")}/**/*.tsx`,
        `${path.join(__dirname, "../public")}/index.html`,
      ]),
      // safelist: {
      //   deep: [/css__module__/],
      // },
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
          fileName => !fileName.endsWith(".map"),
        );

        return {
          files: manifestFiles,
          entryPoints: entrypointFiles,
        };
      },
    }),
    // 打包体积分析
    new BundleAnalyzerPlugin(),
    new CompressionWebpackPlugin({
      filename: "[path][base].gz",
      algorithm: "gzip",
      test: /\.js$|\.json$|\.css/,
      threshold: 10240, // 只有大小大于该值的资源会被处理
      minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
      algorithm: gzip,
    }),
  ],
  performance: {
    // 如果一个资源超过则提示
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
  optimization: {
    chunkIds: "named",
    moduleIds: "deterministic", //单独模块id，模块内容变化再更新
    minimize: true,
    usedExports: true,
    minimizer: [
      new TerserPlugin({
        test: /\.(tsx?|jsx?)$/,
        parallel: true,
        terserOptions: {
          toplevel: true, // 最高级别，删除无用代码
          ie8: true,
          safari10: true,
          compress: {
            arguments: false,
            dead_code: true,
            pure_funcs: ["console.log"], // 删除console.log
          },
        },
      }),
      new CssMinimizerPlugin(),
      new HtmlMinimizerPlugin(),
    ],
    // 分包
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        vendor: {
          name: "vendors",
          enforce: true, // ignore splitChunks.minSize, splitChunks.minChunks, splitChunks.maxAsyncRequests and splitChunks.maxInitialRequests
          test: /[\\/]node_modules[\\/]/,
          filename: "static/js/[id]_vendors.js",
          priority: 10,
        },
        react: {
          test(module) {
            return (
              module.resource && module.resource.includes("node_modules/react")
            );
          },
          chunks: "initial",
          filename: "react.[contenthash].js",
          priority: 1,
          maxInitialRequests: 2,
          minChunks: 1,
        },
      },
    },
    runtimeChunk: {
      name: "runtime",
    },
  },
  externals: {
    react: "react",
    redux: "redux",
    "react-dom": "ReactDOM",
    "react-router-dom": "ReactRouterDOM",
    axios: "axios",
  },
});
