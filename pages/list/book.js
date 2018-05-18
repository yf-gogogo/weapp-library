import { getRankingBooks, getRecommendedBooksByUserId, getBooksByKeyword, getBooksByAuthor, getBooksByAdvancedSearch, getBooksByClassificationNumber } from '../../apis/book'
import { getUID } from '../../utils/permission'

var isLoading = false // 是否正在加载数据
var options // options 参数

Page({
  data: {
    type: {},
    books: [],
    comments: [], // 推荐图书的描述
    loadMoreStatus: 'hidding', // loading, nomore
    isNoData: false // 是否没有数据
  },

  onLoad: function (opt) {
    options = opt
    this.setData({
      type: options.type
    })
    switch (options.type) {
      case 'search':
      case 'advanced_search':
      case 'classify_search':
        wx.setNavigationBarTitle({ title: '搜索结果' })
        break
      case 'recommend':
        wx.setNavigationBarTitle({ title: '推荐图书' })
        break
      case 'ranking':
        wx.setNavigationBarTitle({ title: '近期热门图书' })
        break
    }

    wx.showLoading({ title: '加载中', mask: true })
    this._fetchData().then(books => {
      // 第一次加载数据时判断是否“暂无数据”
      if (!books.length) {
        this.setData({ isNoData: true })
      }
    }).finally(() => wx.hideLoading())
  },

  onReachBottom: function () {
    if (isLoading || this.data.loadMoreStatus === 'nomore' || options.type === 'recommend') return
    this.setData({ loadMoreStatus: 'loading' })

    // 当返回数据长度为 0 或时类型为“推荐图书”时，设置为“没有更多图书”
    this._fetchData(this.data.books.length).then(books => books.length || options.type === 'recommend' ? this.setData({ loadMoreStatus: 'hidding' }) : this.setData({ loadMoreStatus: 'nomore' }))
  },

  /**
   * 获取图书数据
   * @param start {Integer} 搜索偏移量
   */
  _fetchData: function (start = 0) {
    isLoading = true // 设置为“正在加载”

    let fn
    switch (options.type) {
      case 'search':
        if (options.search_type === '书名') {
          fn = getBooksByKeyword(options.keyword, start)
        } else {
          fn = getBooksByAuthor(options.keyword, start)
        }
        break
      case 'advanced_search':
        options['start'] = start
        fn = getBooksByAdvancedSearch(options)
        break
      case 'classify_search':
        fn = getBooksByClassificationNumber(options.class_num, start)
        break
      case 'recommend':
        fn = getRecommendedBooksByUserId(getUID())
        break
      case 'ranking':
        fn = getRankingBooks(start)
        break
    }

    return fn.then(res => {
      isLoading = false

      let books

      // 推荐图书接口的返回值为 [{books: Book, comment: String}]
      // 其他接口的返回值为 {books: [Book], total: Integer}
      if (options.type === 'recommend') {
        books = res.data.map(e => e.book)
        this.setData({
          books: books,
          comments: res.data.map(e => e.comment)
        })
      } else {
        books = res.data.books
        this.setData({
          books: this.data.books.concat(res.data.books)
        })
      }

      return books
    }).catch(() => {
      isLoading = false
      return []
    })
  }
})
