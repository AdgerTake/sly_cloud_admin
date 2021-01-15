let UglifyPlugin = require('uglifyjs-webpack-plugin')
module.exports = {
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          // 'primary-color': '#1DA57A',
          // 'padding-sm': '4px' // small
          // 'link-color': '#333',
          // 'link-hover-color': '#1890ff',
          // 'btn-danger-color': '#fff',
          // 'btn-danger-bg': '#f5222d',
          // 'btn-danger-border': '#f5222d'
          // 'border-radius-base': '2px',
        },
        javascriptEnabled: true
      }
    }
  },
  devServer: {
    port: 8888,
    open: true
  },
  configureWebpack: (config) => {
    if (process.env.NODE_ENV == 'production') {
      // 为生产环境修改配置
      config.mode = 'production'
      // 将每个依赖包打包成单独的js文件
      let optimization = {
        minimizer: [new UglifyPlugin({
          uglifyOptions: {
              warnings: false,
              compress: {
                drop_console: true, 
                drop_debugger: false,
                pure_funcs: ['console.log'] 
              }
          }
        })]
      }
      Object.assign(config, {
        optimization
      })
    } else {
      // 为开发环境修改配置
      config.mode = 'development'
    }
  }
}