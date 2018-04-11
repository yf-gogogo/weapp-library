
/**
 * 底部弹出菜单
 * slot： 菜单内容
 * @event <close>
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
    closeText: {
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
    onTapMask: function () {
      if (this.data.tappableMask) {
        this.triggerEvent('close')
      }
    },
    onClose: function () {
      this.triggerEvent('close')
    }
  }
})
