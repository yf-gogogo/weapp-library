import Promisify from "./utils/promisify.js"  // 小程序 API promise 化
import promisePolyfill from "./utils/promise-polyfill.js" // 添加 promise.finally

App({
  promisify: Promisify,

  globalData: {
    phone: null
  }
})