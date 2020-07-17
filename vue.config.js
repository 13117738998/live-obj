// require('fs').writeFile('./info.json', JSON.stringify(process.env), () => {})
const { env } = process
const isTestServer = env.npm_lifecycle_event === 'serve-test'
// const isProd = env.NODE_ENV === 'production'
module.exports = {
  publicPath: './',
  devServer: {
    open: true,
    host: '0.0.0.0',
    port: 9117,
    openPage: isTestServer
      ? '/c69d5ac7-44c0-4999-c399-08d7f3f1f624'
      : '/c69d5ac7-44c0-4999-c399-08d7f3f1f624',
    // https: false,
    // hotOnly: false,
    // proxy: null, // 设置代理
    before: app => {},
  },
  css: {
    loaderOptions: {
      stylus: {
        // @/ 是 src/ 的别名，想配的话可以alias上配
        import: '~@/assets/style/var.styl',
      },
    },
  },
  productionSourceMap: false,
}
