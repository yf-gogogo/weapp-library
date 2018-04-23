import { getOrdersByPhone, cancelOrderByOrderId } from '../../../apis/order'

const app = getApp()
const PHONE = app.globalData.phone

Page({
  data: {
    orders: {
      // 进行中订单
      ongoing: [],
      // 预约中
      booking: [],
      // 借阅中
      borrowing: []
    },
    loadMoreStatus: {
      ongoing: 'hidding', // loading, nomore
      booking: 'hidding',
      borrowing: 'hidding'
    },
    isNoData: {
      ongoing: false,
      booking: false,
      borrowing: false
    },
    tabs: ['全部', '预约中', '借阅中'],
    types: ['ongoing', 'booking', 'borrowing'],
    currentType: 'ongoing'
  },

  // 初始时加载所有类型订单
  onLoad: function () {
    wx.showLoading({ title: '加载中', mask: true })
    Promise.all([
      getOrdersByPhone(PHONE, 'ongoing'),
      getOrdersByPhone(PHONE, 'booking'),
      getOrdersByPhone(PHONE, 'borrowing')
    ]).then(res => {
      wx.hideLoading()
      this.setData({
        orders: {
          ongoing: res[0].data.orders,
          booking: res[1].data.orders,
          borrowing: res[2].data.orders
        },
        isNoData: {
          ongoing: res[0].data.orders.length === 0,
          booking: res[1].data.orders.length === 0,
          borrowing: res[2].data.orders.length === 0
        }
      })
    }).catch(() => wx.hideLoading())
  },

  // 根据订单类型，加载对应数据
  onScrollToLower: function () {
    const type = this.data.currentType
    const orders = this.data.orders[type]
    const length = orders.length

    const loadMoreStatus = this.data.loadMoreStatus[type]
    const isNoData = this.data.isNoData[type]
    if (isNoData || loadMoreStatus !== 'hidding') return

    let params = {}
    params[`loadMoreStatus.${type}`] = 'loading'
    this.setData(params)
    getOrdersByPhone(PHONE, type, length).then(res => {
      let params = {}
      params[`orders.${type}`] = orders.concat(res.data.orders)
      params[`loadMoreStatus.${type}`] = res.data.orders.length ? 'hidding' : 'nomore'
      this.setData(params)
    }).catch(() => this.setData({
      loadMoreStatus: {
        ongoing: 'hidding',
        booking: 'hidding',
        borrowing: 'hidding'
      }
    }))
  },

  onClickTabBar: function (e) {
    this.setData({
      currentType: this.data.types[e.detail.index]
    })
  }
})
