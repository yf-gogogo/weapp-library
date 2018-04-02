import { getBookById, getBookByISBN } from "../../apis/book"
import { showRegisterModal } from "../../utils/biz"

var app = getApp()

Page({
  data: {
    book: {}, // 原 Book 对象
    bookInfo: [{ // 范式化后的图书信息
      key: "",
      value: ""
    }],
    bookDetail: [{ // 范式化后的图书详细介绍
      key: "",
      value: ""
    }],
    isPopupShow: false
  },

  onLoad: function(options) {
    wx.showLoading({ title: "加载中", mask: true })

    // 根据 id 或根据 isbn 获取图书信息
    let fn;
    if (options.id) {
      fn = getBookById(options.id)
    } else if (options.isbn) {
      fn = getBookByISBN(options.isbn)
    }

    fn.then(res =>
      this.setData({
        book: res,
        bookInfo: normalize(infoScheme, res),
        bookDetail: normalize(detailScheme, res)
      })
    ).then(_ => {
      wx.hideLoading()
    }).catch(_ => {
      wx.hideLoading()
      // 未找到该图书
      wx.navigateBack()
    })
  },

  onShowTip: function() {
    wx.showModal({
      title: '参与贡献',
      content: '您可访问 https://api.my-web-site.cn/wiki/#/book/' + this.data.book.id + ' 编辑本页内容 (PS: 这个维基项目还没有重构完成，暂时无公开链接)',
      showCancel: false
    })
  },

  onShowPopup: function() {
    this.setData({isPopupShow: true})
  },

  onClosePopup: function(){
    this.setData({isPopupShow: false})
  },

  // 如果没有注册，显示对话框
  onAdd: function() {
    if (app.globalData.phone) {
      wx.navigateTo({
        url: "./children/add?id=" + this.data.book.id
      })
    } else {
      showRegisterModal()
    }
  },
})


/**
 * 将 Book 对象范式化，使能通过 wx:for 遍历
 */

var infoScheme = [
  ["author", "作者"],
  ["translator", "译者"],
  ["publisher", "作者"],
  ["pubdate", "出版时间"],
  ["class_num", "分类号"],
  ["call_number", "索书号"],
  ["pages", "页数"],
  ["words", "字数"],
  ["isbn", "ISBN"]
]

var detailScheme = [
  ["summary", "内容简介"],
  ["author_intro", "作者简介"],
  ["translator_intro", "译者简介"],
  ["catalog", "目录"],
  ["preview", "试读"]
]

function normalize(scheme, book) {
  var res = []
  scheme.forEach((el) => {
    var t = {
      key: el[1],
      value: book[el[0]]
    }
    if (el[0] == "作者" || el[0] == "译者") {
      t.value = t.value.join(" / ")
    }
    if (el[0] == "页数") {
      t.value += " 页"
    }
    if (el[0] == "字数") {
      t.value = "约 " + t.value + "字"
    }
    res.push(t)
  })
  return res
}