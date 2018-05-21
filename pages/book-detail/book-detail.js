import { getBookById, getBookByISBN, getCollectionsByBookISBN } from '../../apis/book'
import { getCollectionsByBookId } from '../../apis/collection'
import { isLogin } from '../../utils/permission'

Page({
  data: {
    // 页面状态
    pageStatus: {
      // 是否正在获取图书信息
      loading: true,
      /**
       * 图书信息接口返回的状态码：
       * 200: 成功，显示图书信息
       * 404: 数据库无该图书信息，显示创建条目提示
       * 其他: 获取数据失败
       */
      code: 404
    },
    // 图书信息
    book: {},
    // 图书馆列表
    libraryList: {
      show: false,
      status: 'loading', // loading, nodata, done
      data: [ ]
    }
  },

  onLoad: function (options) {
    this._getBook(options).then(() => this._getCollections(options))
  },

  onShowTip: function () {
    wx.showModal({
      title: '参与贡献',
      content: '您可访问 https://api.my-web-site.cn/wiki/#/book/' + this.data.book.id + ' 编辑本页内容 (PS: 这个维基项目还没有重构完成，暂时无公开链接)',
      showCancel: false
    })
  },

  onPreview: function () {
    let img = this.data.book.imgs.small
    wx.previewImage({
      current: img,
      urls: [img]
    })
  },

  onShowPopup: function () {
    this.setData({'libraryList.show': true})
  },

  onHidePopup: function () {
    this.setData({'libraryList.show': false})
  },

  // 跳转页面前判断是否登录，如果没有登录，显示登录对话框
  onNavigate: function (e) {
    if (!isLogin(true)) return

    let target = e.currentTarget.dataset.target
    let libraryId = e.currentTarget.dataset.id
    let bookId = this.data.book.id
    let url
    switch (target) {
      case 'add':
        url = `./children/add?id=${bookId}`
        break
      case 'review':
        url = `./children/review?id=${bookId}`
        break
      case 'libraryItem':
        url = `./children/order?book_id=${bookId}&library_id=${libraryId}`
        break
      case 'libraryList':
        url = `./children/library-list?id=${bookId}`
        break
    }
    wx.navigateTo({url: url})
  },

  onShareAppMessage: function () {
    return {
      title: '向你分享图书',
      desc: this.data.book.title,
      path: '/pages/book-detail/book-detail?id=' + this.data.book.id
    }
  },

  /**
   * 根据 id 或根据 isbn 获取图书信息
   */
  _getBook: function (options) {
    let fn = options.id
      ? getBookById(options.id)
      : getBookByISBN(options.isbn)
    return fn.then(res => {
      this.setData({book: res.data})
      this.setData({
        'pageStatus.loading': false,
        'pageStatus.code': res.statusCode
      })
    }).catch(res => {
      this.setData({
        'pageStatus.loading': false,
        'pageStatus.code': res.statusCode || 500 // 没网的时候不会有statusCode
      })
      return Promise.reject(new Error('图书不存在'))
    })
  },

  /**
   * 根据 id 或根据 isbn 获取图书馆藏信息
   */
  _getCollections: function (options) {
    let fn = options.id
      ? getCollectionsByBookId(options.id)
      : getCollectionsByBookISBN(options.isbn)
    return fn.then(res =>
      this.setData({
        'libraryList.status': res.data.collections.length ? 'done' : 'nodata',
        'libraryList.data': res.data.collections
      })
    ).catch(() => this.setData({'libraryList.status': 'nodata'}))
  }
})
