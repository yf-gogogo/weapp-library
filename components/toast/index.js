
var timer

/**
 * Toast
 * TODO --- 实现淡入淡出
 */
Component({
  properties: {
    // 自定义显示位置：top，center，bottom
    position: {
      type: String,
      value: 'bottom'
    }
  },
  data: {
    title: '',
    show: false
  },
  methods: {
    /**
     * 显示 Toast，父组件通过 Toast 组件的引用调用
     * @param content {String}
     * @param option {Object}
     *        duration：持续时长，默认 3000 ms
     */
    show (title = '', options = {}) {
      // 如果已经有一个计时器在了，就先清理掉
      if (timer) {
        clearTimeout(timer)
        timer = undefined
      }

      // 扩展默认参数
      options = Object.assign({
        duration: 3000
      }, options)

      // 设置定时器，定时关闭topTips
      timer = setTimeout(() => {
        this.setData({
          show: false
        })
      }, options.duration)

      // 展示出topTips
      this.setData({
        title: title,
        show: true
      })
    }
  }
})
