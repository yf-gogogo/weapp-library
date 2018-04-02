/**
 * 底部弹出菜单
 */
Component({
  properties: {
    // 点击背景是否自动关闭，默认是
    tappableMask: {
      type: Boolean,
      value: true
    },
    show: {
      type: Boolean,
      value: false
    }
  },

  methods: {
    onTapMask: function() {
      if (this.data.tappableMask) {
        this.setData({ show: false })
      }
    }
  }
})