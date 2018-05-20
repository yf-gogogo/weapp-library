import { getCollectionsByBookId } from '../../../apis/collection'
import { debounce } from '../../../utils/utils'

var DEFAULT_CONFIG = {
  searchedLibraries: [],
  loadMoreStatus: 'hidding',
  inputValue: '',
  isNoData: false
}

Page({
  data: {
    id: undefined, // 图书id
    allLibraries: [], // 默认状态下的的图书馆列表，未输入关键字时展示
    searchedLibraries: [], // 搜索结果，输入关键字时展示
    currentKeyword: '', // 当前展示的搜索结果所对应的关键字
    inputValue: '', // 输入框内容
    loadMoreStatus: 'hidding', // 加载更多组件：loading, nomore，hidding
    isNoData: false, // 是否暂无数据
    isFocus: false // 是否正在输入
  },

  // 加载默认图书馆列表
  onLoad: function (options) {
    this.setData({id: options.id})
    this._debouncedFetchData = debounce(this._fetchData, 500)
    wx.showLoading({title: '加载中', mask: true})
    this._fetchData().finally(() => wx.hideLoading())
  },

  onFocus: function () {
    this.setData({isFocus: true})
  },

  // 失去焦点时显示所有图书馆列表
  onUnfocus: function () {
    this.setData({
      ...DEFAULT_CONFIG,
      isNoData: !this.data.allLibraries.length,
      isFocus: false
    })
  },

  // 清空输入框时显示所有图书馆列表
  onClear: function () {
    this.setData({
      ...DEFAULT_CONFIG,
      isNoData: !this.data.allLibraries.length
    })
  },

  // 在输入文字或点击确认时动态搜索数据
  onInput: function (e) {
    let value = e.detail.value
    this.setData({
      ...DEFAULT_CONFIG,
      inputValue: value
    })

    // 如果数据为空，停止因为未完成的网络请求而显示的Loading
    if (!value) return wx.hideNavigationBarLoading()

    wx.showNavigationBarLoading()
    this._debouncedFetchData().finally(() => wx.hideNavigationBarLoading())
  },

  // 触底时加载数据，并设置“加载更多”组件的状态
  onReachBottom: function () {
    // 如果正在加载或者暂无数据，返回
    let status = this.data.loadMoreStatus
    let isNoData = this.data.isNoData
    if (status !== 'hidding' || isNoData) return

    // 当返回数据长度为 0 时，设置为“没有更多图书”
    this.setData({loadMoreStatus: 'loading'})
    this._fetchData().then(res => {
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
    let keyword = this.data.inputValue

    if (this.data.isFocus) {
      // 关键字为空时不搜索
      if (!keyword.trim()) {
        return Promise.reject(new Error('关键字不能为空'))
      }

      // 关键字不为空时，搜索并存储本次搜索的关键字
      this.data.currentKeyword = keyword
      return getCollectionsByBookId(id, {
        start: this.data.searchedLibraries.length,
        library_name: keyword
      }).then(res => {
        /**
         * 在网络慢的情况下，有可能关键字已经被改变但是上次请求还没有完成。
         * 因此需要判断本次响应内容是否对应当前查询的关键字，如果对应则更新数据，
         * 否则不更新数据。非输入状态(查询状态)下也不更新数据。

         * FIX BUG --- inputValue.trim()
         * 操作：输入关键字，开始搜索，立刻删除所有关键字
         * 期望：输入框为空时不进行搜索，也不显示搜索结果
         * 实际：仍然会从上次请求中获取数据并更新searchedLibraries
         */
        let { inputValue, currentKeyword, isFocus, searchedLibraries } = this.data
        if (inputValue.trim() && keyword === currentKeyword && isFocus) {
          let libraries = this.data.searchedLibraries
          this.setData({
            searchedLibraries: libraries.concat(res.data.collections),
            isNoData: !libraries.length && !res.data.collections.length
          })
          return res.data.collections
        } else {
          return Promise.reject(new Error('timeout 结果返回超时'))
        }
      })
    } else {
      let libraries = this.data.allLibraries
      let start = libraries.length
      return getCollectionsByBookId(id, { start }).then(res => {
        this.setData({
          allLibraries: libraries.concat(res.data.collections),
          isNoData: !libraries.length && !res.data.collections.length
        })
        return res.data.collections
      })
    }
  },

  // 防止文字输入过快时频繁请求，在 onLoad 中初始化
  _debouncedFetchData: function () {}
})
