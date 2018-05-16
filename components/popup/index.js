
/**
 * 底部弹出菜单
 * slot：菜单内容
 * @event <hide>
 */
Component({
  properties: {
    // 点击背景是否自动关闭，默认是
    tappableMask: {
      type: Boolean,
      value: true
    },
    // 菜单标题
    title: String,
    // 关闭按钮文字
    hideText: {
      type: String,
      value: '关闭'
    },
    // 由父组件控制菜单显示
    show: {
      type: Boolean,
      value: false
    }
  },

  methods: {
    _onTapMask: function () {
      if (this.data.tappableMask) {
        this.triggerEvent('hide')
      }
    },
    _onHide: function () {
      this.triggerEvent('hide')
    }
  }
})
