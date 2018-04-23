
/**
 * 有三个tab的tabbar
 */
Component({
  options: {
    multipleSlots: true
  },
  properties: {
    tabs: {
      type: Array,
      value: ['tab1', 'tab2', 'tab3']
    }
  },

  data: {
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0
  },

  attached: function () {
    wx.getSystemInfo({
      success: res => {
        let sliderWidth = 96 // 需要设置slider的宽度，用于计算中间位置
        this.setData({
          sliderLeft: (res.windowWidth / this.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / this.data.tabs.length * this.data.activeIndex
        })
      }
    })
  },

  methods: {
    // 设置当前激活页
    setActiveIndex: function (index) {
      this.setData({activeIndex: index})
    },
    // 切换当前激活页
    _onClick: function (e) {
      this.setData({
        sliderOffset: e.currentTarget.offsetLeft,
        activeIndex: e.currentTarget.id
      })
    }
  }
})
