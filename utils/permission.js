/**
 * 权限控制，如登录、退出、检测是否登录、检测账号状态(是否被拉黑)等
 */

const UID_KEY = 'UID'

/**
 * 登录
 * @return {Boolean}
 */
function login (userInfo) {
  try {
    wx.setStorageSync(UID_KEY, userInfo.id)
    getApp().setUserInfo(userInfo)
    getApp().setUID(userInfo.id)
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
    getApp().setUID(null)
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
  var id = getApp().getUID()
  if (id) {
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
  UID_KEY: UID_KEY,
  login: login,
  logout: logout,
  isLogin: isLogin
}
