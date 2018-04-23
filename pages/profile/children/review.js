import { getReviewsByPhone, deleteReviewById } from '../../../apis/review'

var app = getApp()

Page({
  data: {
    reviews: [],
    // load-more组件状态：hidding, loading, nomore
    loadMoreStatus: 'hidding',
    // 是否暂无数据
    isNoData: false
  },

  onLoad: function (options) {
    wx.showLoading({title: '加载中', mask: true})
    getReviewsByPhone(app.globalData.phone).then(res => {
      this.setData({
        reviews: res.data.reviews,
        isNoData: res.data.reviews.length == 0
      })
    }).finally(() => wx.hideLoading())
  },

  onReachBottom: function () {
    let status = this.data.loadMoreStatus
    if (status !== 'hidding') return

    this.setData({ loadMoreStatus: 'loading' })
    let reviews = this.data.reviews
    let phone = app.globalData.phone
    getReviewsByPhone(phone, reviews.length).then(res => {
      if (res.data.reviews.length) {
        this.setData({
          'reviews': reviews.concat(res.data.reviews),
          'loadMoreStatus': 'hidding'
        })
      } else {
        this.setData({ loadMoreStatus: 'nomore' })
      }
    }).catch(() => this.setData({ loadMoreStatus: 'hidding' }))
  },

  onDelete: function (e) {
    let { id, index } = e.currentTarget.dataset
    wx.showModal({
      title: '删除评论',
      content: '确定删除该条评论？这项操作将无法撤销',
      success: res => {
        if (res.confirm) {
          wx.showLoading({title: '删除中', mask: true})
          deleteReviewById(id).then(() => {
            wx.hideLoading()
            this.data.reviews.splice(index, 1)
            this.setData({ reviews: this.data.reviews })
            wx.showToast({title: '删除成功'})
          }).catch(() => wx.hideLoading())
        }
      }
    })
  }
})
