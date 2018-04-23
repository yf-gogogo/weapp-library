
var QR = require('../../../utils/qrcode.js')
var app = getApp()

Page({
  onReady: function () {
    var size = this.setCanvasSize() // 动态设置画布大小
    var params = JSON.stringify({ phone: app.globalData.phone, time: Date.now()})
    QR.qrApi.draw(params, 'qrcode', size.w, size.h)
  },

  // 适配不同屏幕大小的canvas
  setCanvasSize: function () {
    var size = {}
    try {
      var res = wx.getSystemInfoSync()
      var scale = 750 / 686// 不同屏幕下canvas的适配比例；设计稿是750宽
      var width = res.windowWidth / scale
      var height = width// canvas画布为正方形
      size.w = width
      size.h = height
    } catch (e) {
      console.log('获取设备信息失败' + e)
    }
    return size
  }
})
