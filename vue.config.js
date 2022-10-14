module.exports = {
  configureWebpack: {
    externals: {
      AMap: 'AMap', // 高德地图配置
    },
  },
  // 关闭eslint报错
  lintOnSave: false,
  productionSourceMap: false,
  devServer: {
    overlay: {
      warnings: true,
      error: true,
    },
    proxy: {
      '/cbp': {
        target: process.env.VUE_APP_BASE_URL_JAVA,
        secure: false,
        changeOrigin: true,
        logLeve: 'debug',
        onProxyRes(proxyRes, req, res) { // 查看真实路径
          const realUrl = new URL(req.url || '', process.env.VUE_APP_BASE_URL_JAVA)?.href || ''
          console.log(realUrl,'realUrl')
          proxyRes.headers['x-real-url2'] =realUrl
        },
        // pathRewrite: {
        //   "^/cbt":''
        // }
      },
    },
  },
  css: {
    // loaderOptions: {
    //   sass: {
    //     additionalData: `
    //     $vm_fontsize: 192;
    //
    //     html {
    //       font-size: 100vh / 1080 * $vm_fontsize;
    //     }
    //     `,
    //   },
    //   postcss: {
    //     plugins: [
    //       require('./src/util/postcss-px2rem2')({
    //         remUnit: 192,
    //       }),
    //       require('autoprefixer'),
    //     ],
    //   },
    // },
  }
};
