
/**
 * 评分组件，满分10分
 * @event <change>
 */
Component({
  properties: {
    // 当前评分
    value: Number,
    // 能否点击组件评分
    disabled: Boolean
  },

  data: {
    // 满星、半星、空星图片url
    fullSrc: '/images/icon_star_full.png',
    halfSrc: '/images/icon_star_half.png',
    normalSrc: '/images/icon_star_normal.png'
  },

  methods: {
    // 点击左边选择半颗星
    onTapLeft: function (e) {
      var value = e.currentTarget.dataset.value
      if (this.data.value === 1 && e.currentTarget.dataset.value === 1) {
        value = 0 // 只有一颗星的时候,再次点击,变为0颗
      }
      this.setData({value: value})
      this.triggerEvent('change', {value: value})
    },

    // 点击右边选择整颗星
    onTapRight: function (e) {
      var value = e.currentTarget.dataset.value
      this.setData({value: value})
      this.triggerEvent('change', {value: value})
    }
  }
})
