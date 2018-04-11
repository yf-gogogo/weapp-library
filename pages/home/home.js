import { getRankingBooks, getRecommendedBooksByPhone } from '../../apis/book'
import { getRecommendedBooklistsByPhone } from '../../apis/booklist'
import { getUserInfoByPhone } from '../../apis/user'

var app = getApp()

Page({
  data: {
    search: {
      isFocus: false,
      history: []
    },
    ranking: [],
    recommendBooks: {},
    recommendBooklists: {},
    statistics: {
      book_num: 0,
      page_num: 0
    }
  },

  onLoad: function (options) {
    wx.showNavigationBarLoading()
    this._fetchData().then(() => {
      wx.hideNavigationBarLoading()
    }).catch(() => {
      wx.hideNavigationBarLoading()
    })
    app.promisify(wx.getStorage)({ key: 'history' }).then((res) => {
      this.setData({
        'search.history': res.data || [] // res.data 可能是 undefined，下面要用filter 方法，因此必须是数组
      })
    })
  },

  onPullDownRefresh: function () {
    this._fetchData().then(() => {
      wx.stopPullDownRefresh()
    }).catch(() => {
      wx.stopPullDownRefresh()
    })
  },

  onFocus: function () {
    this.setData({ 'search.isFocus': true })
  },

  onCancel: function () {
    this.setData({ 'search.isFocus': false })
  },

  onClickSearchItem: function (e) {
    this._search('书名', e.currentTarget.dataset.title)
  },

  onSearch: function (e) {
    this._search(e.detail.type, e.detail.value)
  },

  onClearHistory: function () {
    wx.showModal({
      title: '清除搜索记录',
      content: '确定清除所有搜索历史？这项操作无法撤销',
      success: res => {
        if (res.confirm) {
          wx.removeStorage({ key: 'history' })
          this.setData({ 'search.history': [] })
        }
      }
    })
  },

  /**
   * @param {String} type   搜索类型
   * @param {String} value  关键字值
   */
  _search: function (type, value) {
    // 保存搜索记录，最多保存6个
    // 最新搜索的放在最前面
    let history = this.data.search.history.filter(v => v !== value)
    history.unshift(value)
    if (history.length > 6) {
      history = history.slice(0, 6)
    }
    this.setData({ 'search.history': history })
    app.promisify(wx.setStorage)({
      key: 'history',
      data: history
    })

    // 切换页面
    switch (type) {
      case '书名':
      case '作者':
        wx.navigateTo({
          url: './children/list?type=search&search_type=' + type + '&keyword=' + value
        })
        break
      case 'ISBN':
        wx.navigateTo({
          url: '../book-detail/book-detail?isbn=' + value
        })
        break
    }
  },

  /**
   * 获取首页数据
   */
  _fetchData: function () {
    return Promise.all([
      getRecommendedBooksByPhone(app.globalData.phone),
      getRankingBooks(),
      getRecommendedBooklistsByPhone(app.globalData.phone),
      getUserInfoByPhone(app.globalData.phone)
    ]).then(res => {
      this.setData({
        'recommendBooks': res[0].data.map(i => i.book),
        'ranking': res[1].data.books,
        'recommendBooklists': res[2].data,
        'statistics': res[3].data.reading_statistics
      })
    })
  }
})
