import { get, post } from './request.js'

module.exports = {
  sendCode: function (phone) {
    return post(`/codes?phone=${phone}&type=wechat`)
  },
  checkCode: function (phone, code) {
    return get('/codes/check', { phone, code, type: 'wechat' })
  },
  // TODO --- 与后台联动
  uploadIdCardImg: function (filepath) {
    // return Promisify(wx.uploadFile)({
    //   url: BASE_URL + '/images',
    //   filePath: filepath,
    //   name: 'picture'
    // })
    return new Promise(function (resolve, reject) {
      setTimeout(() => resolve(filepath), 1000)
    })
  },
  updateUserInfoById: function (id, params) {
    return post(`/users/${id}`, params)
  },
  getUserInfoById: function (id) {
    return get(`/users/${id}`)
  }
}
