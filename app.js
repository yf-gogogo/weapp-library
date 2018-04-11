import promisePolyfill from './utils/promise-polyfill' // 添加 promise.finally
import { setTipSettings } from './utils/tip' // 使用帮助

App({
  globalData: {
    phone: null
  },

  onLaunch: function () {
    this.globalData.phone = wx.getStorageSync('phone')

    // 从本地缓存中加载 TIP_SETTINGS
    let tmp = wx.getStorageSync('TIP_SETTINGS')
    if (tmp) {
      setTipSettings(tmp)
    }
  }
})
