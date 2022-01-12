module.exports = {
  lintOnSave: false,
  configureWebpack: config => {
    // config.module.rules.push({
    //   test: /\.vue$/,
    //   use: [{
    //     loader: 'vue-loader',
    //     options: {
    //       compilerOptions: {
    //         isCustomElement: tag => tag === 'menu'
    //       }
    //     }
    //   }]
    // })
  },
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
        .tap(options => {
          options.compilerOptions = {}
          return options
        })
  },
  devServer: {
    // 本地ip地址
    host: 'localhost',
    port: 8080,
    open: true,
    /* 使用代理 */
    proxy: {
        '/api': {
            /* 目标代理服务器地址 */
            target: 'http://localhost:8090/exam/',
            /* 允许跨域 */
            changeOrigin: true,
            //ws: true,
            pathRewrite: {
                '^/api': ''
            }
        }
    }
  },
}