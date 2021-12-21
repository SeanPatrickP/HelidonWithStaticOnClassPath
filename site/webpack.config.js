const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

/**
 * We associate each entry point with an HTML file:
 * <li> bundlePrefix is the prefix of the bundle name,
 * <li> src is the original file which is the entry point,
 * <li> htmlName is the resulting name and location of the HTML file that starts the entry point.
 */

function createWebpackConfig(rootDir, entryPoints) {
  let entry = {};
  let htmlWebpackConfig = [];
  entryPoints.forEach((ep) => {
    entry[ep.bundlePrefix] = ep.src;
    htmlWebpackConfig.push({
      template: `src/${ep.htmlName}`,
      filename: ep.htmlName,
      inject: "body",
      chunks: [ep.bundlePrefix],
    });
  });
  console.log(entry);
  console.log(htmlWebpackConfig);
  /**
   * Compiles the list of WebPack plugins - they are:
   * CleanWebpack for cleaning the target directory before building
   * MiniCssExtract for minifying the CSS into separate CSS files
   * several HtmlWebpack ones - one for each entry point - this places the JavaScript references in the HTML
   * HtmlBeautify because I like beautiful HTML :)
   * @returns {*[]}
   */
  let compilePlugins = () => {
    let plugins = [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: "css/[name].css",
        chunkFilename: "css/[name].[hash].css",
      }),
    ];
    htmlWebpackConfig.forEach((config) =>
      plugins.push(new HtmlWebpackPlugin(config))
    );
    return plugins;
  };

  return {
    entry: entry,
    mode: "production",
    optimization: {
      runtimeChunk: "single",
      splitChunks: {
        chunks: "all",
      },
    },
    resolve: {
      extensions: [".js", ".jsx", ".css", ".scss"],
    },
    devtool: "source-map",
    module: {
      rules: [
        {
          test: /\.(css|scss)$/i,
          use: [
            { loader: MiniCssExtractPlugin.loader, options: {} },
            { loader: "css-loader", options: {} },
            {
              loader: "sass-loader",
              options: {
                sassOptions: {
                  includePaths: [
                    // Where to look for referenced SCSS files
                    path.resolve(rootDir, "./src/css"),
                    path.resolve(rootDir, "./node_modules"),
                  ],
                },
              },
            },
          ],
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          loader: "babel-loader",
          options: { presets: ["@babel/env"] },
        },
        {
          test: /\.(woff(2)?|ttf|eot|otf)(\?v=\d+\.\d+\.\d+)?$/,
          loader: "file-loader",
          options: { name: "fonts/[name].[ext]" },
        },
        {
          test: /\.(png|gif|jpg)$/,
          loader: "file-loader",
          options: { name: "img/[name].[ext]" },
        },
        {
          test: /[\\/]img[\\/].*\.svg$/,
          loader: "@svgr/webpack",
          options: {
            name: "img/[name].[ext]",
            svgoConfig: {
              plugins: {
                removeViewBox: false,
              },
            },
          },
        },
      ],
    },
    externals: { jquery: "jQuery" }, // jQuery is expected to be available globally
    plugins: compilePlugins(),
    output: {
      path: path.resolve(rootDir, "../target/classes/site"), // distribute into the Java classpath
      publicPath: "/",
      filename: "js/[name].[hash].js",
    },
  };
}

let entryPoints = [
  {
    bundlePrefix: "index",
    src: "./src/js/App.js",
    template: "src/index.html",
    htmlName: "index.html",
  },
];

module.exports = createWebpackConfig(__dirname, entryPoints);
