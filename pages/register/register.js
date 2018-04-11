import { checkCode } from '../../apis/user'

var app = getApp()
var reg = require('../../utils/regexp')
var toptip // 保存toptip组件的引用
var toast // 保存toast组件的引用

Page({
  data: {
    countries: ['中国(86)'],
    countryIndex: 0,
    phone: '',
    vrcode: ''
  },

  onReady: function () {
    toptip = this.selectComponent('#toptip')
    toast = this.selectComponent('#toast')
  },

  onCountryChange: function (e) {
    this.setData({
      countryIndex: e.detail.value
    })
  },

  onInput: function (e) {
    var params = {}
    params[e.currentTarget.dataset.label] = e.detail.value
    this.setData(params)
  },

  onInvalid: function () {
    toptip.show('手机号格式不正确')
  },

  onSend: function () {
    toast.show('验证码将以短信的形式发送至您的手机')
  },

  onSubmit: function () {
    if (!reg.phone.test(this.data.phone)) {
      toptip.show('手机号格式不正确')
      return
    }
    if (!reg.vrcode.test(this.data.vrcode)) {
      toptip.show('请输入6位数字验证码')
      return
    }
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
    checkCode(this.data.phone, this.data.vrcode).then((res) => {
      wx.setStorageSync('phone', this.data.phone)
      app.globalData.phone = this.data.phone

      // 201：创建了新的用户 200：登录成功
      if (res.statusCode === 201) {
        wx.redirectTo({ url: './children/result' })
      } else {
        wx.switchTab({ url: '/pages/home/home' })
      }
    }).finally(() => {
      wx.hideToast()
    })
  }
})
