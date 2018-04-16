import { sendCode, checkCode } from '../../apis/user'
import reg from '../../utils/regexp'

var toptip // 保存toptip组件的引用
var toast // 保存toast组件的引用
var sendBtn // 保存send-code组件的引用
var needReturn // 从登录对话框跳转过来时，需要在登录完成后返回上一页

Page({
  data: {
    countries: ['中国(86)'],
    countryIndex: 0,
    phone: '',
    vrcode: ''
  },

  onLoad: function (options) {
    needReturn = options.need_return
  },

  onReady: function () {
    toptip = this.selectComponent('#toptip')
    toast = this.selectComponent('#toast')
    sendBtn = this.selectComponent('#send-btn')
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

  onSend: function () {
    if (!reg.phone.test(this.data.phone)) {
      return toptip.show('手机号格式不正确')
    }
    sendBtn.prepare()
    sendCode(this.data.phone).then(() => {
      toast.show('验证码将以短信的形式发送至您的手机')
      sendBtn.start()
    }).catch(() => sendBtn.stop())
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
      getApp().globalData.phone = this.data.phone

      // 201：创建了新的用户 200：登录成功
      if (res.statusCode === 201) {
        wx.redirectTo({ url: './children/result' })
      } else if (needReturn) {
        wx.navigateBack()
      } else {
        wx.switchTab({ url: '/pages/home/home' })
      }
    }).finally(() => {
      wx.hideToast()
    })
  }
})
