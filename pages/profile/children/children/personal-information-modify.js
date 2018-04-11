import { uploadIdCardImg, updateUserInfoByPhone } from '../../../../apis/user'

// 如果是从注册页进入，则在上传完资料后自动跳转到主页
var fromRegisterPage = false
var toptip // 保存toptip组件的引用

var scheme = [
  ['name', '请填写用户名'],
  ['birthday', '请填写出生日期'],
  ['idNumber', '请填写身份证号'],
  ['postcode', '请填写邮政编码'],
  ['address', '请填写详细地址'],
  ['idCardFront', '请上传身份证正面照片'],
  ['idCardBack', '请上传身份证反面照片']
]

Page({
  data: {
    name: undefined,
    birthday: undefined,
    idNumber: undefined,
    postcode: undefined,
    address: undefined,
    idCardFront: undefined,
    idCardBack: undefined
  },

  onLoad: function (options) {
    if (options.from == 'register') {
      fromRegisterPage = true
      return
    }

    // 如果从个人信息页进入修改页，url会附有各个参数
    this.setData({
      name: options.name,
      birthday: options.birthday,
      idNumber: options.id_number,
      address: options.address,
      postcode: options.postcode,
      idCardFront: options.id_card_img_front,
      idCardBack: options.id_card_img_back
    })
  },

  onReady: function () {
    toptip = this.selectComponent('#toptip')
  },

  onInput: function (e) {
    var params = {}
    params[e.currentTarget.dataset.label] = e.detail.value
    this.setData(params)
  },

  onChooseImage: function (e) {
    var that = this
    var prop = 'idCard' + e.currentTarget.id
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var params = {}
        params[prop] = res.tempFilePaths[0]
        that.setData(params)
      }
    })
  },

  onPreviewImage: function (e) {
    wx.previewImage({
      // 当前显示图片的http链接
      current: this.data['idCard' + e.currentTarget.id],
      // 需要预览的图片http链接列表，urls元素不能为空
      urls: [this.data.idCardFront, this.data.idCardBack].filter((e) => e)
    })
  },

  onDeleteImage: function (e) {
    var params = {}
    params['idCard' + e.currentTarget.id] = null
    this.setData(params)
  },

  onSubmit: function () {
    // 检查信息是否全部填写
    for (var i = 0; i < scheme.length; i++) {
      if (!this.data[scheme[i][0]]) {
        toptip.show(scheme[i][1])
        return
      }
    }

    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })

    // 先上传身份证图片，如果身份证已经上传到了服务器并获取到了返回值
    // 那么url中有域名，这个图片就不再重复上传
    Promise.all([
      this.data.idCardFront.indexOf('mymoonlight') == -1 ? uploadIdCardImg(this.data.idCardFront) : this.data.idCardFront,
      this.data.idCardBack.indexOf('mymoonlight') == -1 ? uploadIdCardImg(this.data.idCardBack) : this.data.idCardBack
    ]).then((res) => {
      // 将服务器返回的图片路径加入到参数中，上传个人信息
      var params = {
        'name': this.data.name,
        'address': this.data.address,
        'birthday': this.data.birthday,
        'idNumber': this.data.idNumber,
        'postcode': this.data.postcode,
        'idCardFront': res[0].data,
        'idCardBack': res[1].data
      }
      return updateUserInfoByPhone(getApp().globalData.phone, params)
    }).then(res => {
      wx.showToast({
        title: '成功',
        duration: 1500,
        mask: true
      })

      // 如果是从注册页进入，则在填写完成后跳转到主页
      // 如果是从个人资料页进入，则返回上一页
      if (fromRegisterPage) {
        setTimeout(() => wx.switchTab({
          url: '/pages/home/home'
        }), 1500)
      } else {
        setTimeout(() => wx.navigateBack({
          delta: 1
        }), 1500)
      }
    }).catch(() => {
      wx.hideToast()
    })
  }
})
