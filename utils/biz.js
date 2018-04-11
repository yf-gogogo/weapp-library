/**
 * 业务相关
 */

function showRegisterModal () {
  return wx.showModal({
    title: '您还未注册',
    content: '注册用户才可使用完整功能，是否前去注册？',
    success: res => {
      if (res.confirm) {
        wx.navigateTo({ url: '/pages/register/register' })
      }
    }
  })
}

module.exports = {
  showRegisterModal: showRegisterModal
}
