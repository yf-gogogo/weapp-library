import { getOrderById, cancelOrderByOrderId, renewBookByOrderId } from '../../../../apis/order'

var ORDER_ID // 订单id
var app = getApp()

Page({
  data: {
    order: {
      id: undefined,
      status: undefined,
      book: {},
      library: {}
    },
    pageStatus: 'loading' // nodata, done
  },

  onLoad: function (options) {
    ORDER_ID = options.id
    this._fetchData()
  },

  /**
   * 续借
   * @event <orderRenewed> 事件在订单列表页(../order-ongoing)被监听
   */
  onRenew: function () {
    wx.showModal({
      title: '续借图书',
      content: '每本图书只能续借一次，续借时间为一个月',
      success: res => {
        if (res.confirm) {
          wx.showLoading({ title: '取消中', mask: true })
          renewBookByOrderId(ORDER_ID).then(res => {
            wx.showToast({ title: '续借成功', mask: true })
            this.setData({order: res.data})
            app.event.emit('orderRenewed', {order: this.data.order})
          }).finally(() => wx.hideLoading())
        }
      }
    })
  },

  /**
   * 取消订单
   * @event <orderCanceled> 事件在订单列表页(../order-ongoing)被监听
   */
  onCancel: function () {
    wx.showModal({
      title: '取消订单',
      content: '确定取消该订单？这项操作将无法撤销',
      success: res => {
        if (res.confirm) {
          wx.showLoading({ title: '取消中', mask: true })
          cancelOrderByOrderId(ORDER_ID).then(() => {
            wx.showToast({ title: '取消成功' })
            setTimeout(() => wx.navigateBack(), 1000)
            app.event.emit('orderCanceled', {order: this.data.order})
          }).finally(() => wx.hideLoading())
        }
      }
    })
  },

  onTapPageNoDataBtn: function () {
    this._fetchData()
  },

  _fetchData: function () {
    this.setData({pageStatus: 'loading'})
    getOrderById(ORDER_ID).then(res => {
      this.setData({
        order: res.data,
        pageStatus: 'done'
      })
    }).catch(() => this.setData({pageStatus: 'nodata'}))
  }
})
