import { getOrdersByUserId } from '../../../apis/order'
import { getUID } from '../../../utils/permission'

Page({
  data: {
    orders: [],
    loadMoreStatus: 'hidding', // loading, nomore
    isNoData: false
  },

  onLoad: function () {
    wx.showLoading({ title: '加载中', mask: true })
    getOrdersByUserId(getUID(), 'history').then(res => {
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
    getOrdersByUserId(getUID(), 'history', orders.length).then(res => {
      this.setData({
        orders: orders.concat(res.data.orders),
        loadMoreStatus: res.data.orders.length ? 'hidding' : 'nomore'
      })
    }).catch(() => this.setData({loadMoreStatus: 'hidding'}))
  }
})
