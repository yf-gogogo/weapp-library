import { getCollectionsByBookId } from '../../../apis/book'
import { throttle } from '../../../utils/utils'

// 页面数据的默认状态
var DEFAULT_CONFIG = {
  filteredLibraries: [], // 搜索结果，输入关键字时展示
  loadMoreStatus: 'hidding', // loading, nomore
  isNoData: false // 是否没有数据
}

Page({
  data: {
    id: undefined, // 图书id
    libraries: [], // 默认图书馆列表，未输入关键字时展示
    filteredLibraries: [], // 搜索结果，输入关键字时展示
    filterText: '', // 当前搜索结果所对应的关键字
    loadMoreStatus: 'hidding', // loading, nomore
    isNoData: false, // 是否没有数据
    isFocus: false, // 是否正在输入
    inputValue: '' // 搜索关键字
  },

  // 初始化属性，加载默认图书馆列表
  onLoad: function (options) {
    this.setData({id: options.id})
    this._throttledFetchData = throttle(this._fetchData, 1000)
    this.onSearch()
  },

  onFocus: function () {
    this.setData({isFocus: true})
  },

  // 在输入文字或点击确认时动态搜索数据
  onInput: function (e) {
    // 搜索前先恢复默认状态
    let value = e.detail.value
    this.setData(Object.assign({}, DEFAULT_CONFIG, {inputValue: value}))
    if (!value) return

    wx.showNavigationBarLoading()
    this._throttledFetchData().finally(() => wx.hideNavigationBarLoading())
  },

  // 清空输入框时恢复默认状态
  onClear: function () {
    this.setData(Object.assign({}, DEFAULT_CONFIG, {inputValue: ''}))
  },

  // 失去焦点时恢复默认状态
  onUnfocus: function () {
    this.setData(Object.assign({}, DEFAULT_CONFIG, {isFocus: false, inputValue: ''}))
  },

  onSearch: function () {
    wx.showLoading({title: '加载中', mask: true})
    this._fetchData().finally(() => wx.hideLoading())
  },

  // 触底时加载数据，并设置“加载更多”组件的状态
  onReachBottom: function () {
    let status = this.data.loadMoreStatus
    let isNodata = this.data.isNodata
    if (status !== 'hidding' || isNodata) return // 如果正在加载或者没有数据，返回

    this.setData({loadMoreStatus: 'loading'})

    this._fetchData().then(res => {
      // 当返回数据长度为 0 时，设置为“没有更多图书”
      if (res.length) {
        this.setData({loadMoreStatus: 'hidding'})
      } else {
        this.setData({loadMoreStatus: 'nomore'})
      }
    }).catch(() => this.setData({loadMoreStatus: 'hidding'}))
  },

  // 获取数据，并设置是否“暂无数据”
  _fetchData: function () {
    let id = this.data.id
    if (this.data.isFocus) {
      // 存储本次搜索的关键字
      let queryText = this.data.inputValue
      this.data.filterText = queryText

      return getCollectionsByBookId(id, {
        start: this.data.filteredLibraries.length,
        library: queryText
      }).then(res => {
        // 在网络慢的情况下，有可能 filterText 已经被改变但是上次请求还没有完成。
        // 因此需要判断本次响应内容是否对应当前查询的关键字，如果对应则更新数据，
        // 否则不更新数据。非输入状态(查询状态)下也不更新数据。
        let libraries = this.data.filteredLibraries
        if (queryText === this.data.filterText && this.data.isFocus) {
          this.setData({
            filteredLibraries: libraries.concat(res.data.collections),
            isNoData: !libraries.length && !res.data.collections.length
          })
          return res.data.collections
        } else {
          return Promise.reject(new Error('timeout'))
        }
      })
    } else {
      let libraries = this.data.libraries
      let start = this.data.libraries.length
      return getCollectionsByBookId(id, { start }).then(res => {
        this.setData({
          libraries: libraries.concat(res.data.collections),
          isNoData: !libraries.length && !res.data.collections.length
        })
        return res.data.collections
      })
    }
  },

  // 限制调用频率，在 onLoad 中初始化
  _throttledFetchData: function () {}
})
