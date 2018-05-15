import { getOrdersByPhone } from '../../../apis/order'

const app = getApp()

Page({
  data: {
    orders: [],
    loadMoreStatus: 'hidding', // loading, nomore
    isNoData: false
  },

  onLoad: function () {
    wx.showLoading({ title: '加载中', mask: true })
    getOrdersByPhone(PHONE, 'history').then(res => {
      this.setData({
        orders: res.data.orders,
        isNoData: res.data.orders.length === 0
      })
    }).finally(() => wx.hideLoading())
  },

  onReachBottom: function () {
    const { loadMoreStatus, isNoData, orders } = this.data
    if (isNoData || loadMoreStatus !== 'hidding') return

    this.setData({loadMoreStatus: 'loading'})
    getOrdersByPhone(PHONE, 'history', orders.length).then(res => {
      this.setData({
        orders: orders.concat(res.data.orders),
        loadMoreStatus: res.data.orders.length ? 'hidding' : 'nomore'
      })
    }).catch(() => this.setData({loadMoreStatus: 'hidding'}))
  }
})
