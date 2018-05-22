import { showTip } from '../../../utils/tip'
import { getReviewsByBookId, addReviewByBookId, deleteReviewById } from '../../../apis/review'
import { getUID } from '../../../utils/permission'

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
      content: '', // 评论文本
      label: [
        '点击星星评分', '很差', '很差', '较差', '较差',
        '还行', '还行', '推荐', '推荐', '力荐', '力荐'
      ],
      loading: false // 按钮加载状态
    },
    // load-more组件状态：hidding, loading, nomore
    loadMoreStatus: 'hidding',
    // 页面是否正在加载
    isPageLoading: true
  },

  onLoad: function (options) {
    this.data.id = options.id
    toptip = this.selectComponent('#toptip')
    getReviewsByBookId(options.id).then(res => {
      this.setData({reviews: res.data.reviews})
    }).finally(() => {
      this.setData({isPageLoading: false})
    })
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

  onTapPageNoDataBtn: function () {
    this.onShowPopup()
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
    this.setData({'popup.content': e.detail.value})
  },

  onDelete: function (e) {
    var { id, index } = e.currentTarget.dataset
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
  },

  onSubmit: function () {
    let { id, reviews } = this.data
    let { score, content, loading } = this.data.popup
    let wechat_user_id = getUID()

    if (loading) return
    if (!score) return toptip.show('请点击星星评分')
    if (!content) return toptip.show('请输入评论')

    this.setData({'popup.loading': true})
    addReviewByBookId(id, { score, content, wechat_user_id }).then(res => {
      wx.showToast({title: '操作成功'})
      this.setData({
        'popup.loading': false,
        'popup.show': false,
        'popup.score': 0,
        'popup.content': '',
        'reviews': [res.data, ...reviews]
      })
    }).finally(() => this.setData({'popup.loading': false}))
  }
})
