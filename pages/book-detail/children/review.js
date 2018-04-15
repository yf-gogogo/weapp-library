import { showTip } from '../../../utils/tip'
import { getReviewsByBookId, addReviewByBookId } from '../../../apis/review'

var toptip // 保存toptip组件的引用
var once = false // 只提醒一次

Page({
  data: {
    // 图书id
    id: undefined,
    // 评论列表
    reviews: [],
    // popup组件数据
    popup: {
      show: false,
      score: 0, // 评分
      review: '', // 评论文本
      label: [
        '点击星星评分', '很差', '很差', '较差', '较差',
        '还行', '还行', '推荐', '推荐', '力荐', '力荐'
      ],
      loading: false // 按钮加载状态
    },
    // load-more组件状态：hidding, loading, nomore
    loadMoreStatus: 'hidding'
  },

  onLoad: function (options) {
    this.data.id = options.id
    toptip = this.selectComponent('#toptip')
    wx.showLoading({title: '加载中', mask: true})
    getReviewsByBookId(options.id).then(res => {
      wx.hideLoading()
      this.setData({reviews: res.data.reviews})
    }).catch(() => wx.hideLoading())
  },

  onReachBottom: function () {
    let status = this.data.loadMoreStatus
    if (status !== 'hidding') return

    this.setData({ loadMoreStatus: 'loading' })
    let { id, reviews } = this.data
    getReviewsByBookId(id, reviews.length).then(res => {
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

  onChange: function (e) {
    this.setData({'popup.score': e.detail.value})
  },

  onShowPopup: function () {
    this.setData({'popup.show': true})
    if (!once) {
      once = true
      showTip('ADD_REVIEW')
    }
  },

  onHidePopup: function () {
    this.setData({'popup.show': false})
  },

  onInput: function (e) {
    this.setData({'popup.review': e.detail.value})
  },

  onSubmit: function () {
    let { id, reviews } = this.data
    let { score, review, loading } = this.data.popup

    if (loading) return
    if (!score) return toptip.show('请点击星星评分')
    if (!review) return toptip.show('请输入评论')

    this.setData({'popup.loading': true})
    addReviewByBookId(id, score, review).then(res => {
      wx.showToast({title: '操作成功'})
      this.setData({
        'popup.loading': false,
        'popup.show': false,
        'popup.score': 0,
        'popup.review': '',
        'reviews': [res.data, ...reviews]
      })
    })
  }
})
