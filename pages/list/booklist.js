import { getRecommendedBooklistsByUserId, getBooklistsByKeyword, favoriteBooklistById, deleteBooklistById } from '../../apis/booklist'
import Promisify from '../../utils/promisify'
import { getUID } from '../../utils/permission'

Page({
  data: {
    booklists: [
    /*
    {
      id: '',
      status: 0, // 0：没有任何关系 1：创建者 2：已收藏
      title: '',
      creator: {
        nickname: '', // 创建者
        avatar: '' // 头像url
      },
      favorited_num: 0, // 收藏人数
      total: 0 // 书单内图书总数
    }
    */
    ],
    type: '', // 页面类型：recommend，search
    keyword: '', // 搜索关键字
    loadMoreStatus: 'hidding', // loading, nomore
    isNoData: false // 是否没有数据
  },

  onLoad: function (options) {
    this.setData({
      keyword: options.keyword || '',
      type: options.type
    })
    if (options.type === 'search') {
      wx.setNavigationBarTitle({ title: '搜索结果' })
    } else if (options.type === 'recommend') {
      wx.setNavigationBarTitle({ title: '推荐书单' })
    }

    wx.showLoading({ title: '加载中', mask: true })
    this._fetchData().then(booklists => {
      // 第一次加载数据时判断是否“暂无数据”
      this.setData({
        booklists: this.data.booklists.concat(booklists),
        isNoData: booklists.length === 0
      })
    }).finally(() => wx.hideLoading())
  },

  onReachBottom: function () {
    let { type, loadMoreStatus, isNoData } = this.data
    if (loadMoreStatus !== 'hidding' || isNoData || type === 'recommend') return
    this.setData({ loadMoreStatus: 'loading' })
    this._fetchData().then(booklists => {
      this.setData({
        booklists: this.data.booklists.concat(booklists),
        loadMoreStatus: booklists.length === 0 ? 'nomore' : 'hidding'
      })
    }).catch(() => this.setData({ loadMoreStatus: 'hidding' }))
  },

  onShowActionSheet: function (e) {
    let booklists = this.data.booklists
    let index = e.currentTarget.dataset.index
    let { id, status } = booklists[index]
    let actions
    if (status == 1) {
      actions = ['编辑书单']
    } else if (status == 2) {
      actions = ['取消收藏']
    } else {
      actions = ['收藏书单']
    }

    Promisify(wx.showActionSheet)({
      itemList: actions,
      itemColor: '#000'
    }).then(res => {
      if (status == 1) {
        // 编辑书单
        wx.navigateTo({url: `/pages/booklist/children/modify?type=modify&id=${id}`})
      } else if (status == 0) {
        // 收藏书单
        wx.showLoading({title: '加载中', mask: true})
        favoriteBooklistById(id).then(() => {
          wx.showToast({title: '操作成功'})
          booklists[index].status = 2
          this.setData({booklists: booklists})
        }).catch(() => wx.hideLoading())
      } else if (status == 2) {
        // 取消收藏
        Promisify(wx.showModal)({
          title: '取消收藏',
          content: '确定取消收藏此书单？这项操作将无法撤销'
        }).then(res => {
          if (res.confirm) {
            wx.showLoading({title: '加载中', mask: true})
            deleteBooklistById(id).then(() => {
              wx.showToast({title: '操作成功'})
              booklists[index].status = 0
              this.setData({booklists: booklists})
            }).catch(() => wx.hideLoading())
          }
        })
      }
    }).catch(e => {
      // cancel
    })
  },

  _fetchData: function (start = 0) {
    let { type, keyword } = this.data
    if (type === 'recommend') {
      return getRecommendedBooklistsByUserId(getUID()).then(res => res.data)
    } else {
      return getBooklistsByKeyword(keyword, start).then(res => res.data.booklists)
    }
  }
})
