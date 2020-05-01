const path = require("path");
const webpack = require("webpack");
const config = require("./webpack.config.js");

module.exports = (env) => {
  config.output = {
    path: path.resolve(__dirname, "dist/"),
    publicPath: "/",
    filename: "bundle.js"
  };

  config.devServer = {
    contentBase: path.join(__dirname, "public/"),
    port: 3000,
    publicPath: "http://localhost:3000/",
    hot: true,
    historyApiFallback: true
  };

  config.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
  );

  const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
  }, {});
  config.plugins.push(
    new webpack.DefinePlugin(envKeys)
  );
  return config;
};
