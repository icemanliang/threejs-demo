const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = {
  entry: {
    index: "./src/index.js", 
    car: "./src/car.js",
    knight: "./src/knight.js",
    demo: "./src/demo.js"
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
      template: "./template/car.html" 
    }),
    new HtmlWebpackPlugin({
      filename: "knight.html",
      chunks: ['knight'],
      template: "./template/index.html" 
    }),
    new HtmlWebpackPlugin({
      filename: "demo.html",
      chunks: ['demo'],
      template: "./template/index.html" 
    }),
    process.env.NODE_ENV ==='production' ? new CopyPlugin({
      patterns: [
        { from: path.join(__dirname, "modal"), to: path.join(__dirname, "docs") },
        { from: path.join(__dirname, "music"), to: path.join(__dirname, "docs") },
      ],
    }) : ''
  ],
  devServer: {
    contentBase: [path.join(__dirname, "modal"), path.join(__dirname, "docs"), path.join(__dirname, "music")],
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
        test: /\.(woff|woff2|ttf|eot|jpg|png)$/,
        use: "file-loader?name=fonts/[name].[ext]!static",
      },
    ],
  },
};