/**
 * 权限控制，如登录、退出、检测是否登录、检测账号状态(是否被拉黑)等
 */

/**
 * 登录
 * @return {Boolean}
 */
function login (phone) {
  try {
    wx.setStorageSync('phone', phone)
    getApp().globalData.phone = phone
    return true
  } catch (e) {
    console.error('设置storage失败: ' + e)
    return false
  }
}

/**
 * 登出
 * @return {Boolean}
 */
function logout () {
  try {
    wx.clearStorageSync()
    getApp().globalData.phone = undefined
    return true
  } catch (e) {
    console.error('清空storage失败: ' + e)
    return false
  }
}

/**
 * 检测是否登录，并给出相应提示
 * 用于可分享页面（图书详情、书单详情）中的操作按钮被点击时
 * TODO --- 检测当前账号是否被拉黑
 * @param showModal {Boolean}
 * @return {Boolean}
 */
function isLogin (showModal = false) {
  var phone = getApp().globalData.phone
  if (phone) {
    return true
  } else {
    if (showModal) {
      wx.showModal({
        title: '您还未登录',
        content: '登录后才可使用完整功能，是否前去登录？',
        success: res => {
          if (res.confirm) {
            wx.navigateTo({ url: '/pages/register/register?need_return=true' })
          }
        }
      })
    }
    return false
  }
}

module.exports = {
  login: login,
  logout: logout,
  isLogin: isLogin
}
