const path = require('path')
const webpack = require('webpack')
const createThemeColorReplacerPlugin = require('./config/plugin.config')

function resolve (dir) {
  return path.join(__dirname, dir)
}

const isProd = process.env.NODE_ENV === 'production'

const assetsCDN = {
  // webpack build externals
  externals: {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    vuex: 'Vuex',
    axios: 'axios'
  },
  css: [],
  // https://unpkg.com/browse/vue@2.6.10/
  js: [
    '//cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.min.js',
    '//cdn.jsdelivr.net/npm/vue-router@3.1.3/dist/vue-router.min.js',
    '//cdn.jsdelivr.net/npm/vuex@3.1.1/dist/vuex.min.js',
    '//cdn.jsdelivr.net/npm/axios@0.19.0/dist/axios.min.js'
  ]
}

// vue.config.js
const vueConfig = {
  // publicPath: isProd ? '/case/' : '/',
  configureWebpack: {
    // webpack plugins
    plugins: [
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ],
    // if prod, add externals
    externals: isProd ? assetsCDN.externals : {}
  },

  chainWebpack: (config) => {
    config.resolve.alias
      .set('@$', resolve('src'))

    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .oneOf('inline')
      .resourceQuery(/inline/)
      .use('vue-svg-icon-loader')
      .loader('vue-svg-icon-loader')
      .end()
      .end()
      .oneOf('external')
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'assets/[name].[hash:8].[ext]'
      })

    // if prod is on
    // assets require on cdn
    if (isProd) {
      config.plugin('html').tap(args => {
        args[0].cdn = assetsCDN
        return args
      })
    }
  },

  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          // less vars，customize ant design theme

          'primary-color': '#14c393',
          // 'link-color': '#14c393',
          'border-radius-base': '2px'
        },
        // DO NOT REMOVE THIS LINE
        javascriptEnabled: true
      }
    }
  },

  devServer: {
    // development server port 8001
    // port: 8001,
    port: 8005,
    // If you want to turn on the proxy, please remove the mockjs /src/main.jsL11
    proxy: {
      // '/api': {
      //   target: 'https://mock.ihx.me/mock/5baf3052f7da7e07e04a5116/antd-pro',
      //   ws: false,
      //   changeOrigin: true
      // }
      '/api-server/api': {
        target: 'http://127.0.0.1:4000', // 写真实的api地址
        pathRewrite: { '^/api-server/api': '/api' }, // 去掉前缀
        changeOrigin: true,
        secure: false
      },
      '/api-server/quality': {
        target: 'http://127.0.0.1:4215', // api的ip或域名
        pathRewrite: { '^/api-server/quality': '' }, // 去掉前缀
        changeOrigin: true,
        secure: false
      },
      '/api-server/case': {
        target: 'http://127.0.0.1:8200', //  api的ip或域名
        pathRewrite: { '^/api-server/case': '' }, // 去掉前缀
        changeOrigin: true,
        secure: false
      },
      '/api-server/v1/notice': {
        target: 'http://127.0.0.1:8091', //  api的ip或域名
        pathRewrite: { '^/api-server/v1/notice': 'v1/notice' }, // 去掉前缀
        changeOrigin: true,
        secure: false
      },
      '/api-server/v1/dashboard': {
        target: 'http://127.0.0.1:8091', //  api的ip或域名
        pathRewrite: { '^/api-server/v1/dashboard': 'v1/dashboard' }, // 去掉前缀
        changeOrigin: true,
        secure: false
      },
      '/api-server/v1/extention': {
        target: 'http://127.0.0.1:8091', //  api的ip或域名
        pathRewrite: { '^/api-server/v1/extention': 'v1/extention' }, // 去掉前缀
        changeOrigin: true,
        secure: false
      },
      '/api-server': {
        target: 'http://127.0.0.1:9000', // api的ip或域名
        pathRewrite: { '^/api-server': '' }, // 去掉前缀
        changeOrigin: true,
        secure: false
      }
    }
  },

  // disable source map in production
  productionSourceMap: false,
  lintOnSave: undefined,
  // babel-loader no-ignore node_modules/*
  transpileDependencies: []
}

// preview.pro.loacg.com only do not use in your production;
if (process.env.VUE_APP_PREVIEW === 'true') {
  console.log('VUE_APP_PREVIEW', true)
  // add `ThemeColorReplacer` plugin to webpack plugins
  vueConfig.configureWebpack.plugins.push(createThemeColorReplacerPlugin())
}

module.exports = vueConfig
