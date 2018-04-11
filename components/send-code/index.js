import { sendCode } from '../../apis/user'
var reg = require('../../utils/regexp')
var timer, leftTime = 60

/**
 * 带倒计时的短信发送按钮
 */
Component({
  properties: {
    phone: String
  },
  data: {
    str: '获取验证码',
    isCounting: false // 是否正在倒计时
  },
  methods: {
    onTapSend: function () {
      if (!reg.phone.test(this.data.phone)) {
        this.triggerEvent('invalid')
        return
      }
      this.setData({
        isCounting: true,
        str: '获取中'
      })
      sendCode(this.phone).then(() => {
        this.countDown()
      }).catch(() => {
        this.setData({
          isCounting: false,
          str: '获取验证码'
        })
      })
    },

    countDown: function () {
      if (leftTime > 0) {
        leftTime--
        this.setData({ str: '已发送(' + leftTime + ')' })
        timer = setTimeout(() => {
          this.countDown()
        }, 1000)
      } else {
        this.setData({ 'isCounting': false })
        clearTimeout(timer)
        leftTime = 60
      }
    }
  }
})
