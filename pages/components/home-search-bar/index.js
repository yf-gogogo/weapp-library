/**
 * 主页的搜索输入框
 */
Component({
  properties: {

  },

  data: {
    options: {
      selected: "书名",
      list: [
        "书名", "作者", "ISBN", "高级搜索" //'标签' '全部'
      ],
      show: false
    },
    isFocus: false,
    value: ""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onFocus: function() {
      this.setData({
        "options.selected": this.data.options.list[0],
        "isFocus": true
      })
    },

    onClear: function() {
      this.setData({
        "value": ""
      })
    },

    onCancel: function() {
      this.setData({
        "value": "",
        "isFocus": false,
        "options.show": false
      })
    },

    onInput: function(e) {
      this.setData({
        "value": e.detail.value
      })
    },

    onTapOptionBtn: function() {
      this.setData({
        "options.show": !this.data.options.show // 切换列表显示
      })
    },

    onSelectOption: function(e) {
      if (e.currentTarget.dataset.option == "高级搜索") {
        wx.navigateTo({ url: "./children/advance_search" })
        return
      }
      this.setData({
        "options.selected": e.currentTarget.dataset.option,
        "options.show": false
      })
    },

    onScan: function() {
      
    },

    onSearch: function(e) {
      
    }
  }
})