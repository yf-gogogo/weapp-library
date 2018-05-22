var timer
var leftTime

/**
 * 发送短信的倒计时按钮
 * @event <tap> <end>
 */
Component({
  properties: {
    // 默认文字
    defaultText: {
      type: String,
      value: '获取验证码'
    },
    // 点击后的文字
    pendingText: {
      type: String,
      value: '发送中'
    },
    // 倒计时文字
    countingText: {
      type: String,
      value: '已发送'
    },
    // 倒计时时长
    duration: {
      type: Number,
      value: 60
    }
  },

  data: {
    str: '获取验证码', // 当前显示的文字
    disabled: false // 倒计时过程中禁用
  },

  attached: function () {
    leftTime = this.data.duration
  },

  methods: {
    // 准备倒计时
    prepare: function () {
      this.setData({
        disabled: true,
        str: this.data.pendingText
      })
    },

    // 开始倒计时
    start: function () {
      this._countDown()
    },

    // 结束倒计时
    stop: function () {
      clearTimeout(timer)
      leftTime = this.data.duration
      this.setData({
        disabled: false,
        str: this.data.defaultText
      })
    },

    /**
     * 点击的时候不直接开始倒计时，父组件可以做一些参数判断
     */
    _onTap: function () {
      this.triggerEvent('tap')
    },

    _countDown: function () {
      let countingText = this.data.countingText
      if (leftTime > 0) {
        leftTime--
        this.setData({
          disabled: true,
          str: `${countingText}(${leftTime})`
        })
        timer = setTimeout(() => {
          this._countDown()
        }, 1000)
      } else {
        this.stop()
        this.triggerEvent('end')
      }
    }
  }
})
