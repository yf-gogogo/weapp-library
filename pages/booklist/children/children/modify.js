import { updateBooklistById } from '../../../../apis/booklist'

var options = {
  book_id: undefined,
  booklist_id: undefined
}

Page({
  data: {
    description: ''
  },

  onLoad: function (opts) {
    options = opts
    this.setData({
      description: opts.description
    })
  },

  onInput: function (e) {
    this.setData({ description: e.detail.value })
  },

  onSubmit: function () {
    wx.showLoading({ title: '加载中', mask: true })
    updateBooklistById(options.booklist_id, { add_items: {
      id: options.book_id,
      description: this.data.description
    } }).then(() => {
      wx.hideLoading()
      wx.showToast({ title: '操作成功', mask: true })
      setTimeout(_ => wx.navigateBack(), 1000)
    }).catch(_ => {
      wx.hideLoading()
    })
  }
})
