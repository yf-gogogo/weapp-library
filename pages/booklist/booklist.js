import { getBooklistsByPhone, deleteBooklistById } from '../../apis/booklist'

var app = getApp()

Page({
  data: {
    booklists: {
      create: [], // 我创建的书单
      favorite: [] // 我收藏的书单
    }
  },

  onLoad: function (options) {
    wx.showNavigationBarLoading()
    this._fetchData().then(() => {
      wx.hideNavigationBarLoading()
    }).catch(() => {
      wx.hideNavigationBarLoading()
    })
  },

  // 从书单详情页返回后更新数据，因为有可能在书单详情页操作过
  onShow: function () {
    this._fetchData()
  },

  onPullDownRefresh: function () {
    this._fetchData().then(() => {
      wx.stopPullDownRefresh()
    }).catch(() => {
      wx.stopPullDownRefresh()
    })
  },

  onSearch: function (e) {
    wx.navigateTo({
      url: '/pages/list/booklist?type=search&keyword=' + e.detail.value
    })
  },

  onCreate: function () {
    wx.navigateTo({
      url: './children/modify?action=create'
    })
  },

  _fetchData: function () {
    return getBooklistsByPhone(app.globalData.phone).then(res => {
      this.setData({
        booklists: res.data
      })
    })
  }
})
