import Promisify from '../../../utils/promisify'

/**
 * 书单页的图书条目
 * @event <change> <modify>
 */
Component({
  properties: {
    // 图书数据
    book: Object,
    // 个性化描述
    comment: String,
    // 是否处于选择模式
    isSelecting: {
      type: Boolean,
      value: false,
      observer: function (newVal, oldVal) {
        if (!newVal) this.setData({checked: false})
      }
    }
  },

  data: {
    // 是否被选中
    checked: false
  },

  methods: {
    onTapCard: function () {
      const { isSelecting, checked, id } = this.data
      if (isSelecting) {
        this.setData({checked: !checked})
        this.triggerEvent('change', {
          checked: !checked
        })
      } else {
        wx.navigateTo({url: `/pages/book-detail/book-detail?id=${id}`})
      }
    },

    onShowActionSheet: function () {
      Promisify(wx.showActionSheet)({
        itemList: ['编辑图书描述'],
        itemColor: '#000'
      }).then(res => {
        this.triggerEvent('modify')
      })
    }
  }
})
