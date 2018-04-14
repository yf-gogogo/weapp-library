import { isLogin } from '../../utils/permission'

/**
 * 自动登录
 */
Page({
  onLoad: function () {
    wx.showLoading({ title: '加载中', mask: true })
    if (isLogin()) {
      wx.switchTab({ url: '/pages/home/home' })
    } else {
      wx.redirectTo({url: '/pages/register/register'})
    }
    wx.hideLoading()
  }
})
