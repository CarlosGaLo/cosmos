const { defineConfig } = require("@vue/cli-service");
const webpack = require("webpack");

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,

  devServer: {
    port: 3110,
    host: "0.0.0.0",
    allowedHosts: "all",
    proxy: {
      "/api": {
        target: "https://79.145.123.81:3100",
        changeOrigin: true,
        secure: false, // ⚠️ Ignora certificados autofirmados
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
