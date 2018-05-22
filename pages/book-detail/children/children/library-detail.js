import { getLibraryById } from '../../../../apis/library'

Page({
  data: {
    isPageLoading: true,
    library: {
      id: undefined,
      status: 1, // 0：未认证，1：已认证
      name: '',
      phone: '',
      address: '',
      introduction: '',
      book_type_num: 0,
      book_total_num: 0,
      photos: []
    }
  },

  onLoad: function (options) {
    getLibraryById(options.id).then(res => {
      this.setData({ library: res.data })
    }).finally(() => this.setData({isPageLoading: false}))
  },

  onPreview: function (e) {
    let library = this.data.library
    let id = e.currentTarget.dataset.index
    wx.previewImage({
      current: library.photos[id],
      urls: library.photos
    })
  }
})
