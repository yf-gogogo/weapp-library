/**
 * 鉴权，如检测是否登录、检测账号状态(是否被拉黑)等
 */

/**
 * 检测是否登录，并给出响应提示
 * 用于可分享页面（图书详情、书单详情）中的操作按钮被点击时
 * TODO --- 检测当前账号是否被拉黑
 * @param showModal {Boolean}
 * @return {Boolean}
 */
function isLogin (showModal = false) {
  try {
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
  } catch (e) {
    return false
  }
}

module.exports = {
  isLogin: isLogin
}
