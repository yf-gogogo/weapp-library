/**
 * 主页的搜索输入框
 */

import Promisify from '../../../utils/promisify'
import { showTip } from '../../../utils/tip'

Component({
  properties: {

  },

  data: {
    options: {
      selected: '书名',
      list: [
        '书名', '作者', 'ISBN', '标签', '高级搜索'
      ],
      show: false
    },
    focus: false,
    value: ''
  },

  methods: {
    onFocus: function () {
      this.setData({
        'options.selected': this.data.options.list[0],
        'focus': true
      })
      this.triggerEvent('focus')
    },

    onClear: function () {
      this.setData({
        'value': ''
      })
    },

    onCancel: function () {
      this.setData({
        'value': '',
        'focus': false,
        'options.show': false
      })
      this.triggerEvent('cancel')
    },

    onInput: function (e) {
      this.setData({
        'value': e.detail.value
      })
    },

    onTapOptionBtn: function () {
      this.setData({
        'options.show': !this.data.options.show // 切换列表显示
      })
    },

    onSelectOption: function (e) {
      if (e.currentTarget.dataset.option === '高级搜索') {
        wx.navigateTo({ url: './children/advanced-search' })
        return
      }
      if (e.currentTarget.dataset.option === 'ISBN') {
        showTip('SEARCH_SCAN')
      }
      this.setData({
        'options.selected': e.currentTarget.dataset.option,
        'options.show': false
      })
    },

    onScan: function () {
      var scanfn = Promisify(wx.scanCode)
      scanfn().then(res => {
        if (res.scanType !== 'CODE_128') { return wx.showModal({ title: '扫描内容不合法', content: '请扫描图书ISBN条形码', showCancel: false }) }
        wx.navigateTo({
          url: '../book-detail/book-detail?isbn=' + res.result
        })
      }).catch(e => wx.showModal({
        title: '扫码失败',
        content: e.errMsg,
        showCancel: false
      }))
    },

    // 在输入框不为空时搜索
    onSearch: function (e) {
      if (this.data.value) {
        this.triggerEvent('search', {
          type: this.data.options.selected,
          value: this.data.value
        })
      }
    }
  }
})
