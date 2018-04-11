
var timer

/**
 * 顶部提示
 */
Component({
  data: {
    content: '',
    type: 'error',
    show: false
  },

  methods: {
    /**
     * 显示 TopTip，父组件通过 TopTip 组件的引用调用
     * @param content {String}
     * @param option {Object}
     *        duration：持续时长，默认 1500 ms
     *        type：提示类型，默认error，可选 warning、success、error
     */
    show (content = '', options = {}) {
      // 如果已经有一个计时器在了，就先清理掉
      if (timer) {
        clearTimeout(timer)
        timer = undefined
      }

      // 扩展默认参数
      options = Object.assign({
        duration: 3000,
        type: 'error'
      }, options)

      // 设置定时器，定时关闭topTips
      timer = setTimeout(() => {
        this.setData({
          show: false
        })
      }, options.duration)

      // 展示出topTips
      this.setData({
        content: content,
        type: options.type,
        show: true
      })
    }
  }
})
