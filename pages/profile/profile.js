import Promisify from '../../utils/promisify'
import { updateUserInfoById } from '../../apis/user'
import { logout } from '../../utils/permission'

var app = getApp()

Page({
  data: {
    userInfo: {
      nickname: '',
      avatar: ''
    }
  },

  onLoad: function () {
    Promisify(wx.login)().then(() => {
      // 获取用户授权，更新用户昵称与头像
      Promisify(wx.getUserInfo)().then(res => {
        this.setData({
          'userInfo.nickname': res.userInfo.nickName,
          'userInfo.avatar': res.userInfo.avatarUrl
        })
        app.setUserInfo(this.data.userInfo)
        updateUserInfoById(app.getUID(), this.data.userInfo)
      }).catch(() => {
        // 用户拒绝授权时获取后台记录的用户信息和头像
        app.getUserInfo().then(userInfo => {
          this.setData({
            'userInfo.nickname': userInfo.nickname,
            'userInfo.avatar': userInfo.avatar
          })
        })
      })
    })
  },

  onLogout: function () {
    wx.showModal({
      content: '确定退出登录？',
      success: res => {
        if (res.confirm && logout()) {
          wx.reLaunch({ url: '/pages/register/register' })
        }
      }
    })
  }
})
