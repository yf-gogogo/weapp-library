import Promisify from '../../utils/promisify'
import { updateUserInfoById } from '../../apis/user'
import { logout, getUID } from '../../utils/permission'

var app = getApp()

Page({
  data: {
    userInfo: {
      nickname: '',
      avatar: ''
    }
  },

  onLoad: function () {
    /**
     * getUserInfo 接口即将取消
     */
    Promisify(wx.login)().then(() => {
      // 获取用户授权，更新用户昵称与头像
      Promisify(wx.getUserInfo)().then(res => {
        app.setUserInfo(this.data.userInfo)
        updateUserInfoById(getUID(), {
          nickname: res.userInfo.nickName,
          avatar: res.userInfo.avatarUrl
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
