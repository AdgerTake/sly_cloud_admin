// 开发环境 or 生产环境
const dev = process.env.NODE_ENV == 'development'
 // 测试环境
const isTest = true
// 链接
const url = {
  // requestModuleOne: isTest?'http://118.31.228.25:38080/app/mock/22':'', // 请求地址1
  // requestModuleOne: isTest?'http://192.168.0.105:8080':'', // 请求地址1
  requestModuleOne: isTest?'http://gzh.5151xi.com/yd':'http://gzh.junhaoxidi.com/yd', // 请求地址1
  locationUrl: isTest?'':'' // 项目地址
}
export default {
  dev,
  isTest,
  url
}