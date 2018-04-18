import { getBookById, getBookByISBN, getCollectionsByBookId, getCollectionsByBookISBN } from '../../apis/book'
import { isLogin } from '../../utils/permission'

Page({
  data: {
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
    wx.showLoading({ title: '加载中', mask: true })

    // 根据 id 或根据 isbn 获取图书信息
    let bookFn
    if (options.id) {
      bookFn = getBookById(options.id)
    } else if (options.isbn) {
      bookFn = getBookByISBN(options.isbn)
    }

    bookFn.then(res => {
      this.setData({book: res.data})
      wx.hideLoading()
    }).catch(_ => {
      wx.hideLoading()
      // 未找到该图书
      // wx.navigateBack()
    })

    // 根据 id 或根据 isbn 获取图书馆藏信息
    let collFn
    if (options.id) {
      collFn = getCollectionsByBookId(options.id)
    } else if (options.isbn) {
      collFn = getCollectionsByBookISBN(options.isbn)
    }
    collFn.then(res =>
      this.setData({
        'libraryList.status': res.data.collections.length ? 'done' : 'nodata',
        'libraryList.data': res.data.collections
      })
    ).catch(() => this.setData({'libraryList.status': 'nodata'}))
  },

  onShowTip: function () {
    wx.showModal({
      title: '参与贡献',
      content: '您可访问 https://api.my-web-site.cn/wiki/#/book/' + this.data.book.id + ' 编辑本页内容 (PS: 这个维基项目还没有重构完成，暂时无公开链接)',
      showCancel: false
    })
  },

  // 跳转页面前判断，如果没有登录，显示登录对话框
  onNavigate: function (e) {
    let target = e.currentTarget.dataset.target
    let url
    switch (target) {
      case 'add':
        url = './children/add?id=' + this.data.book.id
        break
      case 'review':
        url = './children/review?id=' + this.data.book.id
        break
      case 'libraryItem':
        url = `./children/confirm_order?book_id=${this.data.book.id}&library_id=${e.currentTarget.dataset.id}`
        break
      case 'libraryList':
        url = './children/library-list?id=' + this.data.book.id
        break
    }
    if (isLogin(true)) {
      wx.navigateTo({url: url})
    }
  },

  onShowPopup: function () {
    this.setData({'libraryList.show': true})
  },

  onHidePopup: function () {
    this.setData({'libraryList.show': false})
  },

  onShareAppMessage: function () {
    return {
      title: '向你分享图书',
      desc: this.data.book.title,
      path: '/pages/book-detail/book-detail?id=' + this.data.book.id
    }
  }
})
