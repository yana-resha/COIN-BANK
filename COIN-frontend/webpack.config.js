/* eslint-disable no-undef */
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// оптимизация картинок
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const { extendDefaultPlugins } = require("svgo");
// для копирования целых папок
// const CopyPlugin = require("copy-webpack-plugin");

module.exports = (env) => ({
  entry: "./src/index.js",
  output: {
    filename: "main.[contenthash].js",
    publicPath: "/",
  },
  module: {
    rules: [
      // babel loader
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      // картинки и шрифты
      {
        test: /\.(png|svg|jpg|jpeg|gif|ttf)$/i,
        type: "asset/resource",
        // use: [{ loader: 'file-loader'}],
      },
      //  bootstrap у меня уже компилируемый
      {
        test: /\.scss$/,
        use: [
          env.prod ? MiniCssExtractPlugin.loader : "style-loader",
          "css-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.css$/,
        use: [
          env.prod ? MiniCssExtractPlugin.loader : "style-loader",
          "css-loader",
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "COIN BANK",
    }),
    new MiniCssExtractPlugin({
      filename: "main.[contenthash].css",
    }),
    // для копирования целых папок
    // new CopyPlugin({
    //   patterns: [
    //     { from: './src/assets/img', to: 'image'},
    //   ],
    // }),
  ],
  devServer: {
    historyApiFallback: true,
    hot: true,
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin(),
      // new ImageMinimizerPlugin({
      //   minimizer: {
      //     implementation: ImageMinimizerPlugin.imageminMinify,
      //     options: {
      //       // Lossless optimization with custom option
      //       // Feel free to experiment with options for better result for you
      //       plugins: [
      //         ["gifsicle", { interlaced: true }],
      //         ["jpegtran", { progressive: true }],
      //         ["optipng", { optimizationLevel: 5 }],
      //         [
      //           "svgo",
      //           {
      //             plugins: extendDefaultPlugins([
      //               {
      //                 name: "removeViewBox",
      //                 active: false,
      //               },
      //               {
      //                 name: "addAttributesToSVGElement",
      //                 params: {
      //                   attributes: [{ xmlns: "http://www.w3.org/2000/svg" }],
      //                 },
      //               },
      //             ]),
      //           },
      //         ],
      //       ],
      //     },
      //   },
      // }),
    ],
  },
});
