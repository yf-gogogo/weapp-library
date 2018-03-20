var reg = require("../../utils/regexp")
var toptip; // 保存toptip组件的引用

Page({
  data: {
    countries: ["中国(86)"],
    countryIndex: 0,
    phone: "",
    vrcode: ""
  },

  onReady: function() {
    toptip = this.selectComponent("#toptip")
  },

  onCountryChange: function(e) {
    this.setData({
      countryIndex: e.detail.value
    })
  },

  onInput: function(e) {
    var params = {}
    params[e.currentTarget.dataset.label] = e.detail.value
    this.setData(params)
  },

  onInvalid: function() {
    toptip.show("手机号格式不正确")
  },

  onSubmit: function() {
    if (!reg.phone.test(this.data.phone)) {
      toptip.show("手机号格式不正确")
      return
    }
    if (!reg.vrcode.test(this.data.vrcode)) {
      toptip.show("请输入6位数字验证码")
      return
    }
    wx.showToast({
      title: "加载中",
      icon: "loading"
    })
    setTimeout(() => { wx.hideToast() }, 1000)
  }
})