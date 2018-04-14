
/**
 * 搜索框
 * @event <search>
 */
Component({
  properties: {
    defaultText: {
      type: String,
      value: '搜索'
    },
    focusText: {
      type: String,
      value: '搜索'
    },
    // 是否显示背景遮罩
    showMask: {
      type: Boolean,
      value: true
    },
    // 点击背景是否自动关闭，默认是
    tappableMask: {
      type: Boolean,
      value: true
    }
  },
  data: {
    isFocus: false,
    value: ''
  },
  methods: {
    onFocus: function () {
      this.setData({
        isFocus: true
      })
    },
    onHide: function () {
      this.setData({
        value: '',
        isFocus: false
      })
    },
    onClear: function () {
      this.setData({
        value: ''
      })
    },
    onInput: function (e) {
      this.setData({
        value: e.detail.value
      })
    },
    onTapMask: function () {
      if (this.data.tappableMask) {
        this.onHide()
      }
    },

    // 在输入框不为空时搜索
    onSearch: function (e) {
      if (this.data.value) {
        this.triggerEvent('search', {
          value: this.data.value
        })
      }
    }
  }
})
