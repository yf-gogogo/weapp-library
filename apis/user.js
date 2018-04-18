import { get, post, BASE_URL } from './request.js'
import Promisify from '../utils/promisify'

module.exports = {
  sendCode: function (phone) {
    return post(`/vrcodes?phone=${phone}`)
  },
  checkCode: function (phone, vrcode) {
    return get('/vrcodes/check', { phone, vrcode })
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
  updateUserInfoByPhone: function (phone, params) {
    return post(`/users/${phone}`, params)
  },
  getUserInfoByPhone: function (phone) {
    return get(`/users/${phone}`)
  }
}
