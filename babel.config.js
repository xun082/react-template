const plugins = [[require("babel-plugin-await-add-trycatch")]];

module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "usage", // 代码中需要那些polyfill,就引用相关的api
        corejs: 3, // 配置使用core-js低版本
      },
    ],
    "@babel/preset-react",
    "@babel/preset-typescript",
  ],
  compact: true,
  // 魔法注释,用于分包
  comments: true,
  plugins: process.env.NODE_ENV === "production" ? [...plugins] : plugins,
};
