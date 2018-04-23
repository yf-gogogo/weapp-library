// pages/profile/children/children/order-detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  onCancel: function (e) {
    let id = e.detail.id
    wx.showModal({
      title: '取消订单',
      content: '确定取消该订单？这项操作将无法撤销',
      success: res => {
        if (res.confirm) {
          wx.showLoading({ title: '取消中', mask: true })
          cancelOrderByOrderId(id).then(() => {
            // 从“全部(ongoing)”和“预约中(booking)”订单列表里同时删除该订单
            const { ongoing, booking } = this.data.orders
            this.setData({
              'orders.ongoing': ongoing.filter(e => e.id == id),
              'orders.booking': booking.filter(e => e.id == id)
            })
            wx.showToast({ title: '取消成功' })
          }).finally(() => wx.hideLoading())
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
