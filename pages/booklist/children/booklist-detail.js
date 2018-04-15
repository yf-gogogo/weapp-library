import { getBooklistById, getBooksByBooklistId, updateBooklistById, favoriteBooklistById, deleteBooklistById } from '../../../apis/booklist'
import { isLogin } from '../../../utils/permission'

Page({
  data: {
    // 书单信息
    booklistInfo: {
      // 用户是否创建或收藏了此书单(0: 未收藏, 1: 创建, 2: 收藏)
      status: undefined,
      // 书单id
      id: undefined,
      // 书单创建者
      creator: {
        avatar: '',
        phone: '',
        nickname: ''
      },
      // 书单标题
      title: '',
      // 书单描述
      description: '',
      // 书单封面
      image: '',
      // 书单内图书
      items: [{
        // 图书信息
        book: {},
        // 图书个性化描述
        comment: ''
      }],
      // 图书总数
      total: undefined,
      // 收藏人数
      favorited_num: undefined
    },
    // 是否展开书单描述
    showDescription: false,
    // 是否书单为空
    isNoData: false,
    // load-more 组件状态：hidding, loading, nomore
    loadMoreStatus: 'hidding',
    // 是否正在多选书目
    isSelecting: false,
    // async-switch 组件的加载状态
    isSwitchLoading: false,
    // 选择的书目的 id
    selectedBooks: []
  },

  onLoad: function (options) {
    wx.showLoading({ title: '加载中', mask: true })
    getBooklistById(options.id).then(res => {
      // 第一次加载数据时判断是否“书单为空”
      this.setData({
        isNoData: res.data.items.length === 0,
        booklistInfo: res.data
      })
      wx.hideLoading()
    }).catch(() => wx.hideLoading())
  },

  onToggleDescription: function () {
    this.setData({ 'showDescription': !this.data.showDescription })
  },

  onReachBottom: function () {
    let status = this.data.loadMoreStatus
    if (status !== 'hidding') return

    this.setData({ loadMoreStatus: 'loading' })

    let id = this.data.booklistInfo.id
    let start = this.data.booklistInfo.items.length
    getBooksByBooklistId(id, start).then(res => {
      // 当返回数据长度为 0 时，设置为“没有更多图书”
      if (res.data.books.length) {
        let tmp = this.data.booklistInfo.items
        tmp = tmp.concat(res.data.books)
        this.setData({
          'booklistInfo.items': tmp,
          'loadMoreStatus': 'hidding'
        })
      } else {
        this.setData({loadMoreStatus: 'nomore'})
      }
    }).catch(() => this.setData({loadMoreStatus: 'hidding'}))
  },

  // 用户是书单创建者，打开/关闭书目多选，关闭多选时清空已选择书目
  onToggleEditStatus: function () {
    let isSelecting = this.data.isSelecting
    this.setData({isSelecting: !isSelecting})
    if (isSelecting) {
      this.setData({selectedBooks: []})
    }
  },

  // 用户不是书单创建者，收藏/取消收藏书单
  onToggleFavoriteStatus: function () {
    // 如果没有登录，显示登录对话框
    if (!isLogin(true)) return

    let { id, status } = this.data.booklistInfo
    this.setData({isSwitchLoading: true})
    if (status === 0) {
      favoriteBooklistById(id).then(res => {
        this.setData({
          'isSwitchLoading': false,
          'booklistInfo.status': 2
        })
      }).catch(() => {
        this.setData({'isSwitchLoading': false})
      })
    } else {
      deleteBooklistById(id).then(res => {
        this.setData({
          'isSwitchLoading': false,
          'booklistInfo.status': 0
        })
      }).catch(() => {
        this.setData({'isSwitchLoading': false})
      })
    }
  },

  // 选中某图书时将其加入已选择书目中，否则从中删除
  onChange: function (e) {
    let checked = e.detail.checked
    let index = e.currentTarget.dataset.index
    let id = this.data.booklistInfo.items[index].book.id
    let selectedBooks = this.data.selectedBooks

    if (checked && !selectedBooks.includes(id)) {
      selectedBooks.push(id)
    } else {
      selectedBooks = selectedBooks.filter(e => e !== id)
    }
    this.setData({selectedBooks: selectedBooks})
  },

  // 删除书目
  onDelete: function () {
    let id = this.data.booklistInfo.id
    let selectedBooks = this.data.selectedBooks
    let books = this.data.booklistInfo.items

    if (!selectedBooks.length) return

    wx.showModal({
      title: '删除书目',
      content: '确定从书单内删除所选书目？这项操作将无法撤销',
      success: res => {
        if (res.confirm) {
          wx.showLoading({ title: '加载中', mask: true })
          updateBooklistById(id, {
            delete_items: selectedBooks
          }).then(() => {
            wx.showToast({ title: '操作成功', duration: 2000 })

            // 更新数据
            // TODO --- BUG FIX：更新 items 后不会重新创建组件而是复用之前创建的组件
            books = books.filter(e => !selectedBooks.includes(e.book.id))
            this.setData({
              'booklistInfo.items': books,
              'selectedBooks': [],
              'isSelecting': false
            })
          }).catch(() => wx.hideLoading())
        }
      }
    })
  },

  // 编辑图书个性化描述
  onModify: function (e) {
    let index = e.currentTarget.dataset.index
    let booklistId = this.data.booklistInfo.id
    let bookId = this.data.booklistInfo.items[index].book.id
    let description = this.data.booklistInfo.items[index].comment
    let url = `./children/modify?booklist_id=${booklistId}&book_id=${bookId}&description=${description}`
    wx.navigateTo({url: url})
  },

  onShareAppMessage: function () {
    return {
      title: '向你分享书单',
      desc: this.data.booklistInfo.title,
      path: '/pages/booklist/children/booklist-detail?id=' + this.data.booklistInfo.id
    }
  }
})
