import Promisify from '../../utils/promisify'
import { updateUserInfoByPhone } from '../../apis/user'
import { logout } from '../../utils/permission'

var app = getApp()

Page({
  data: {
    userInfo: {} // 用户信息
  },

  onLoad: function () {
    Promisify(wx.login)().then(() => {
      // 获取用户授权，更新用户昵称与头像
      Promisify(wx.getUserInfo).then(res => {
        this.setData({
          'userInfo.nickname': res.userInfo.nickName,
          'userInfo.avatar': res.userInfo.avatar
        })
        app.setUserInfo(this.data.userInfo)
        updateUserInfoByPhone(app.globalData.phone, this.data.userInfo)
      }).catch(() => {
        // 用户拒绝授权时获取后台记录的用户信息和头像
        app.getUserInfo().then(userInfo => {
          this.setData({ userInfo })
        })
      })
    })
  },

  onLogout: function () {
    wx.showModal({
      title: '确定退出登录？',
      success: res => {
        if (res.confirm && logout()) {
          wx.reLaunch({ url: '/pages/register/register' })
        }
      }
    })
  }
})
