const path = require("path");
const config = require('./webpack.config.js');

config.output = {
  path: path.resolve(__dirname, "dist/"),
  filename: "[name].bundle.[chunkhash].js",
  chunkFilename: "[name].[chunkhash].js",
  publicPath: "/"
};

module.exports = config;