
/**
 * 底部弹出菜单
 */
Component({
  properties: {
    // 点击背景是否自动关闭，默认是
    tappableMask: {
      type: Boolean,
      value: true
    }
  },

  data: {
    show: false
  },

  methods: {
    show: function(){
      this.setData({show: true})
    },
    close: function(){
      this.setData({show: false})
    },
    onTapMask: function(){
      if(this.data.tappableMask) {
        this.close()
      }
    }
  }
})
