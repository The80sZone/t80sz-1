const cssExtract = require("mini-css-extract-plugin")
const cssMinimize = require("css-minimizer-webpack-plugin")
const htmlWebpack = require("html-webpack-plugin")
const copyPlug = require("copy-webpack-plugin")
const compress = require("compression-webpack-plugin")
const path = require("path")
const defcfg = require("./webpack.config")
const { merge } = require("webpack-merge")
module.exports = merge(defcfg, {
  mode: "production",
  entry: {
    main: "./src/svelte/index.ts",
    bobby: "./src/svelte/standalone-bobby.ts",
    404: "./src/svelte/status-code/404.ts",
  },
  output: {
    filename: "src/t80sz.[name].js",
    path: path.resolve(__dirname, "public"),
  },
  plugins: [
    new htmlWebpack({
      title: "The 80s Zone",
      filename: "home/index.html",
      meta: {
        viewport: "width=device-width, initial-scale=1",
        description: "EST. 2017-10-31",
        "theme-color": "#150411",
      },
      templateContent: ({ htmlWebpackPlugin }) => `
      <html>
        <head>
        </head>
        <body>
          <noscript>
            <div style="color: #ffffff; width:100%; height: 100%; display: flex; justify-content: center; align-items: center; text-align: center;">
            <div style="width: 50%;">
              <h1 style="color: #ffe500;">It looks like you don't have Javascript enabled!</h1>
              <p>As much as we respect your opinion (especially with tons of websites invading privacy using such language),</p>
              <p>our default site does not functions without JS toggled.</p>
              <br>
              <p>We promise that we do not include any sorts of shady tracking services, or even store your data in general as we genuinely despise privacy invasion. (our source code is open to allow you to research this!)</p>
              <p>If you still prefer having javascript disabled, though.. <a href="/nojs">We have something special for you.</a></p>
              </div>
            </div>
          </noscript>
        </body>
      </html>
      `,
      excludeChunks: ["bobby", "404"],
      hash: true,
    }),
    new htmlWebpack({
      title: "standalone bobby weeeeeeeeee",
      filename: "bobby/index.html",
      meta: {
        viewport: "width=device-width, initial-scale=1",
        description: "EST. 2017-10-31",
        "theme-color": "#150411",
      },
      excludeChunks: ["main", "404"],
      hash: true,
    }),
    new htmlWebpack({
      title: "404 - The 80s Zone",
      filename: "status/404/index.html",
      meta: {
        viewport: "width=device-width, initial-scale=1",
        description: "EST. 2017-10-31",
        "theme-color": "#150411",
      },
      excludeChunks: ["main", "bobby"],
      hash: true,
    }),
    new cssExtract({
      filename: "src/[name].css",
    }),
    new compress({ exclude: /node_modules/, compressionOptions: { level: 7 } }),
    new copyPlug({
      patterns: [
        { from: "src/assets/team/", to: "src/assets/team" },
        { from: "src/nojs", to: "nojs/" },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(css|pcss)$/i,
        exclude: /node_modules/,
        use: [cssExtract.loader, "css-loader", "postcss-loader"],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: {
          filename: "src/fonts/[hash][ext][query]",
          publicPath: "../",
        },
      },
      {
        test: /\.(webp|png|jpg|mp3)$/i,
        type: "asset/resource",
        generator: {
          filename: "src/assets/[name][ext][query]",
          publicPath: "../",
        },
      },
      {
        test: /\.(html)$/i,
        use: [
          "html-loader",
          {
            loader: "posthtml-loader",
            options: {
              plugins: [require("htmlnano")()],
            },
          },
        ],
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [new cssMinimize()],
    splitChunks: {
      chunks: "all",
    },
  },
})
