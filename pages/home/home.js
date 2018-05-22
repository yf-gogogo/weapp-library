import { getRankingBooks, getRecommendedBooksByUserId } from '../../apis/book'
import { getRecommendedBooklistsByUserId } from '../../apis/booklist'
import { showTip } from '../../utils/tip'
import { getUID } from '../../utils/permission'
import { isISBN } from '../../utils/validator'

var app = getApp()
var searchBar // 保存home-search-bar组件的引用

Page({
  data: {
    search: {
      focus: false,
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

    // 下面要用 search.history.filter 方法，因此必须是一个数组
    // getStorage的返回值可能是 undefined
    let tmp = wx.getStorageSync('history')
    this.setData({'search.history': tmp || []})
  },

  onReady: function () {
    searchBar = this.selectComponent('#searchBar')
  },

  onPullDownRefresh: function () {
    this._fetchData().then(() => {
      wx.stopPullDownRefresh()
    }).catch(() => {
      wx.stopPullDownRefresh()
    })
  },

  onFocus: function () {
    this.setData({ 'search.focus': true })
  },

  onCancel: function () {
    this.setData({ 'search.focus': false })
  },

  onClickHistoryItem: function (e) {
    showTip('HISTORY').then(() => {
      let value = e.currentTarget.dataset.value
      searchBar.setInputValue(value)
      this._search(searchBar.getSelectedOption(), value)
    })
  },

  onClickTrendingItem: function (e) {
    this._search('书名', e.currentTarget.dataset.title)
  },

  onSearch: function (e) {
    this._search(e.detail.type, e.detail.value)
  },

  onClearHistory: function () {
    wx.showModal({
      title: '清除搜索记录',
      content: '确定清除所有搜索历史？这项操作将无法撤销',
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
    // 去除前后空白符
    value = value.trim()

    // 保存搜索记录
    this._saveHistory(type, value)

    // 页面跳转
    switch (type) {
      case '书名':
      case '作者':
      case '标签':
        wx.navigateTo({
          url: '/pages/list/book?type=search&search_type=' + type + '&keyword=' + value
        })
        break
      case 'ISBN':
        if (isISBN(value)) {
          wx.navigateTo({url: '../book-detail/book-detail?isbn=' + value})
        } else {
          wx.showModal({content: '请输入正确的13位ISBN', showCancel: false})
        }
        break
      default:
        throw new Error('wrong type: 不支持的搜索类型！')
    }
  },

  /**
   * 获取首页数据
   */
  _fetchData: function () {
    return Promise.all([
      getRecommendedBooksByUserId(getUID()),
      getRankingBooks(),
      getRecommendedBooklistsByUserId(getUID()),
      app.getUserInfo()
    ]).then(res => {
      this.setData({
        'recommendBooks': res[0].data.map(i => i.book),
        'ranking': res[1].data.books,
        'recommendBooklists': res[2].data,
        'statistics': res[3].reading_statistics
      })
    })
  },

  /**
   * 保存搜索记录，最多保存6个
   * 最新搜索的放在最前面
   */
  _saveHistory: function (type, value) {
    let history = this.data.search.history.filter(v => v !== value)
    history.unshift(value)
    if (history.length > 6) {
      history = history.slice(0, 6)
    }
    this.setData({ 'search.history': history })
    wx.setStorage({
      key: 'history',
      data: history
    })
  }
})
