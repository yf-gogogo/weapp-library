import { uploadIdCardImg, updateUserInfoById } from '../../../../apis/user'
import Promisify from '../../../../utils/promisify'
import { getUID } from '../../../../utils/permission'
import { DOMAIN_NAME } from '../../../../apis/request'

var toptip // 保存toptip组件的引用
var app = getApp()
var isFromRegisterPage = false // 如果是从注册页进入，则在上传完资料后自动跳转到主页

Page({
  data: {
    userInfo: {
      name: '',
      birthday: '',
      id_number: '',
      postcode: '',
      address: '',
      id_card_img: {
        front: '',
        back: ''
      }
    }
  },

  onLoad: function (options) {
    if (options.from === 'register') {
      isFromRegisterPage = true
      return
    }

    wx.showLoading({title: '加载中', mask: true})
    app.getUserInfo().then(userInfo => this.setData({
      'userInfo.name': userInfo.name,
      'userInfo.birthday': userInfo.birthday,
      'userInfo.id_number': userInfo.id_number,
      'userInfo.postcode': userInfo.postcode,
      'userInfo.address': userInfo.address,
      'userInfo.id_card_img.front': userInfo.id_card_img.front,
      'userInfo.id_card_img.back': userInfo.id_card_img.back
    })).finally(() => wx.hideLoading())
  },

  onReady: function () {
    toptip = this.selectComponent('#toptip')
  },

  onInput: function (e) {
    var params = {}
    let label = e.currentTarget.dataset.label
    params['userInfo.' + label] = e.detail.value
    this.setData(params)
  },

  onChooseImage: function (e) {
    var prop = 'userInfo.id_card_img.' + e.currentTarget.dataset.type
    Promisify(wx.chooseImage)({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'] // 可以指定来源是相册还是相机，默认二者都有
    }).then(res => {
      // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
      var params = {}
      params[prop] = res.tempFilePaths[0]
      this.setData(params)
    })
  },

  onPreviewImage: function (e) {
    let { front, back } = this.data.userInfo.id_card_img
    let type = e.currentTarget.dataset.type
    wx.previewImage({
      // 当前显示图片的http链接
      current: this.data.userInfo.id_card_img[type],
      // 需要预览的图片http链接列表，filter过滤空url
      urls: [front, back].filter(e => e)
    })
  },

  onDeleteImage: function (e) {
    var params = {}
    params['userInfo.id_card_img.' + e.currentTarget.dataset.type] = ''
    this.setData(params)
  },

  /**
   * 修改用户信息
   * 如果是从注册页进入，则在修改完成后跳转到主页
   * 如果是从个人资料页进入，则返回上一页
   */
  onSubmit: function () {
    if (this.validate() !== true) return
    wx.showLoading({title: '加载中', mask: true})
    this.uploadIdCardImg().then(this.updateUserInfo).then(res => {
      wx.showToast({title: '成功', mask: true})
      if (isFromRegisterPage) {
        setTimeout(() => wx.switchTab({url: '/pages/home/home'}), 1000)
      } else {
        setTimeout(() => wx.navigateBack(), 1000)
      }
    }).catch(() => wx.hideLoading())
  },

  /**
   * 上传身份证图片。如果是刚刚选择的本地照片，需要重新上传
   * 如果是是服务器现在保存的照片，那么url中将含有域名，不需要再上传
   */
  uploadIdCardImg: function () {
    let { id_card_img: { front, back } } = this.data.userInfo
    return Promise.all([
      front.indexOf(DOMAIN_NAME) === -1 ? uploadIdCardImg(front) : front,
      back.indexOf(DOMAIN_NAME) === -1 ? uploadIdCardImg(back) : back
    ])
  },

  /**
   * 将服务器返回的图片路径加入到参数中，上传个人信息
   */
  updateUserInfo: function (imgPaths) {
    let uid = getUID()
    let userInfo = this.data.userInfo
    this.setData({
      'userInfo.id_card_img': {
        front: imgPaths[0],
        back: imgPaths[1]
      }
    })
    return updateUserInfoById(uid, userInfo).then(res => {
      app.setUserInfo(res.data)
    })
  },

  validate: function () {
    let {
      name, birthday, address, id_number, postcode,
      id_card_img: { front, back }
    } = this.data.userInfo

    // 检查信息是否全部填写
    if (!name) return toptip.show('请填写姓名')
    if (!birthday) return toptip.show('请填写出生日期')
    if (!id_number) return toptip.show('请填写身份证号')
    if (id_number.length !== 18) return toptip.show('身份证号必须为18位')
    if (!address) return toptip.show('请填写详细地址')
    if (!postcode) return toptip.show('请填写邮政编码')
    if (!front) return toptip.show('请上传身份证正面照片')
    if (!back) return toptip.show('请上传身份证反面照片')

    return true
  }
})
