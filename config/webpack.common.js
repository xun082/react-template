/**
 * @type {import('webpack').Configuration}
 */

const {
  SRC_PATH,
  DIST_PATH,
  IS_DEVELOPMENT,
  IS_PRODUCTION,
  PUBLIC_PATH,
} = require("./util/constants");

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { DefinePlugin } = require("webpack");

module.exports = {
  entry: {
    index: path.join(SRC_PATH, "index.tsx"),
  },
  output: {
    path: DIST_PATH,
    globalObject: "this",
    // 图片、字体资源
    assetModuleFilename: "assets/[hash][ext][query]",
    filename: IS_DEVELOPMENT
      ? "js/[name].bundle.js"
      : "js/[name].[contenthash:8].bundle.js",
    // 动态导入资源
    chunkFilename: IS_DEVELOPMENT
      ? "js/[name].chunk.js"
      : "js/[name].[contenthash:8].chunk.js",
    clean: true,
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

      {
        test: /\.css$|\.scss$/i,
        include: [SRC_PATH],
        exclude: /node_module/,
        use: [
          IS_DEVELOPMENT ? "style-loader" : MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: true,
              sourceMap: !IS_PRODUCTION,
            },
          },
          "postcss-loader",
          "sass-loader",
        ],
      },
      // 处理图片
      {
        test: /\.(jpe?g|png|gif|webp|svg)$/,
        type: "asset",
        // 文件生成路径
        generator: {
          filename: "./images/[hash:8][ext][query]",
        },
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb会被压缩成base64
          },
        },
      },
      // 处理字体
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: {
          filename: "./assets/fonts/[hash][ext][query]",
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(PUBLIC_PATH, "index.html"),
      filename: "index.html",
      title: "moment",
      inject: true, // js引入在body里面
      hash: true,
      minify: IS_DEVELOPMENT
        ? false
        : {
            // https://github.com/terser/html-minifier-terser#options-quick-reference
            removeComments: true, // 删除注释
            collapseWhitespace: true, //是否去除空格
            minifyCSS: true, // 压缩 HTML 中的 css 代码
            minifyJS: true, // 压缩 HTML 中出现的 JS 代码
            caseSensitive: true, // 区分大小写
            removeRedundantAttributes: true, // 当值与默认值匹配时删除属性。
            removeEmptyAttributes: true, // 删除所有只有空白值的属性
            removeStyleLinkTypeAttributes: true, // 从样式和链接标签中删除type="text/css"。其他类型属性值保持不变
            removeScriptTypeAttributes: true, // 从脚本标签中删除type="text/javascript"其他类型属性值保持不变
            useShortDoctype: true, // 将文档类型替换为短(HTML5)文档类型
          },
    }),
    // 定义全局常量
    new DefinePlugin({
      BASE_URL: '"./"',
    }),
  ],
};
