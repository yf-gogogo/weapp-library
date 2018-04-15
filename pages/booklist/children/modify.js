import { getBooklistById, createBooklist, updateBooklistById } from '../../../apis/booklist'
import { showTip } from '../../../utils/tip'

var options = {
  type: undefined, // 操作类型：create，modify
  id: undefined // 书单id
}
var toptip // 保存toptip组件的引用

Page({

  data: {
    title: '',
    description: '',
    isWarning: false,
    id: undefined
  },

  onLoad: function (opts) {
    options = opts
    toptip = this.selectComponent('#toptip')

    if (options.type === 'modify') {
      wx.showLoading({ title: '加载中', mask: true })
      getBooklistById(options.id).then(res => {
        wx.hideLoading()
        this.setData({
          title: res.data.title,
          description: res.data.description
        })
      }).catch(() => {
        wx.hideLoading()
        wx.navigateBack()
      })
    }

    if (options.type === 'create') {
      showTip('CREATE_BOOKLIST')
    }
  },

  onInput: function (e) {
    let label = e.currentTarget.dataset.label
    let params = {}
    params[label] = e.detail.value
    this.setData(params)
  },

  onSubmit: function () {
    if (!this.data.title.length) return toptip.show('请输入书单标题')

    wx.showLoading({ title: '加载中', mask: true })

    let { title, description } = this.data
    let params = { title, description }
    let fn

    if (options.type === 'create') fn = () => createBooklist(params)
    else fn = () => updateBooklistById(options.id, params)
    fn().then(() => {
      wx.hideLoading()
      wx.showToast({ title: '操作成功', mask: true })
      setTimeout(() => wx.navigateBack(), 1000) // 直接后退时当前页面的toast会消失
    }).catch(() => wx.hideLoading())
  }
})
