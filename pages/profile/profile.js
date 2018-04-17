import { logout } from '../../utils/permission'

Page({
  data: {
    // 用户信息
    userInfo: {
      // 昵称
      nickname: ''
      //
    }
  },

  onLoad: function () {
    var that = this
    app.wechat.login().then(_ => {
      // 登录后更新用户昵称与头像
      app.wechat.getUserInfo().then(res => {
        that.setData({
          userInfo: res.userInfo
        })
        app.library.updateUserInfoByPhone(
          app.globalData.phone, {
            username: that.data.userInfo.nickName,
            avatarUrl: that.data.userInfo.avatarUrl
          }
        )
      }).catch(_ => {
        // 登录失败时获取后台记录的用户信息和头像
        app.library.getUserInfoByPhone(app.globalData.phone).then(res => {
          that.setData({
            'userInfo.nickName': res.data.username,
            'userInfo.avatarUrl': res.data.avatarUrl
          })
        })
      })
    })
  },

  onShow: function () {
    this.setData({
      largeFontWeight: app.globalData.largeFontWeight
    })
  },

  logout: function () {
    wx.showModal({
      title: '确定退出登录？',
      success: res => {
        if (res.confirm) {
          wx.removeStorageSync('phone')
          wx.reLaunch({ url: '/pages/register/register' })
        }
      }
    })
  }
})
