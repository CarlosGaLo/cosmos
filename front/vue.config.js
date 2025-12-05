const { defineConfig } = require("@vue/cli-service");
const webpack = require("webpack");

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,

  devServer: {
    port: 3110,
    host: "0.0.0.0",
    allowedHosts: "all",
    client: {
      webSocketURL: "auto://0.0.0.0:0/ws",
    },
    proxy: {
      "/api": {
        target: "https://localhost:3100",  // CAMBIADO: de cosmosrol.com a localhost
        changeOrigin: true,
        secure: false,
      },
    },
  },

  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),
      }),
    ],
    resolve: {
      fallback: {
        https: false,
        http: false,
        url: false,
        buffer: false,
        stream: false,
      },
    },
  },
});