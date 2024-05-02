const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = {
  entry: {
    index: "./src/index.js", 
    car: "./src/car.js"
  },
  output: {
    path: path.resolve(__dirname, "./docs"),
    filename: "[name]_bundle.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      chunks: ['index'],
      template: "./template/index.html" 
    }),
    new HtmlWebpackPlugin({
      filename: "car.html",
      chunks: ['car'],
      template: "./template/index.html" 
    }),
    process.env.NODE_ENV ==='production' ? new CopyPlugin({
      patterns: [
        { from: path.join(__dirname, "modal"), to: path.join(__dirname, "docs") },
      ],
    }) : ''
  ],
  devServer: {
    contentBase: [path.join(__dirname, "modal"), path.join(__dirname, "docs")],
    port: 3000,
    proxy: {
      "/api": "http://localhost:8080",
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(woff|woff2|ttf|eot|jpg)$/,
        use: "file-loader?name=fonts/[name].[ext]!static",
      },
    ],
  },
};