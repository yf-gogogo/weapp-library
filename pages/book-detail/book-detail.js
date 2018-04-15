import { getBookById, getBookByISBN, getCollectionsByBookId, getCollectionsByBookISBN } from '../../apis/book'
import { isLogin } from '../../utils/permission'

Page({
  data: {
    // 原 Book 对象
    book: {},
    // 范式化后的图书信息
    bookInfo: [{
      key: '',
      value: ''
    }],
    // 范式化后的图书详细介绍
    bookDetail: [{
      key: '',
      value: ''
    }],
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
      this.setData({
        book: res.data,
        bookInfo: normalize(infoScheme, res.data),
        bookDetail: normalize(detailScheme, res.data)
      })
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
    ).catch(() => {
      this.setData({
        'libraryList.status': 'nodata'
      })
    })
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

/**
 * 将 Book 对象范式化，使能通过 wx:for 遍历
 */

var infoScheme = [
  ['author', '作者'],
  ['translator', '译者'],
  ['publisher', '作者'],
  ['pubdate', '出版时间'],
  ['class_num', '分类号'],
  ['call_number', '索书号'],
  ['pages', '页数'],
  ['words', '字数'],
  ['isbn', 'ISBN']
]

var detailScheme = [
  ['summary', '内容简介'],
  ['author_intro', '作者简介'],
  ['translator_intro', '译者简介'],
  ['catalog', '目录'],
  ['preview', '试读']
]

function normalize (scheme, book) {
  var res = []
  scheme.forEach((el) => {
    var t = {
      key: el[1],
      value: book[el[0]]
    }
    if (el[0] === '作者' || el[0] === '译者') {
      t.value = t.value.join(' / ')
    }
    if (el[0] === '页数') {
      t.value += ' 页'
    }
    if (el[0] === '字数') {
      t.value = '约 ' + t.value + '字'
    }
    res.push(t)
  })
  return res
}
