import { BASE_URL, get, post } from './request'
import Promisify from '../utils/promisify'

module.exports = {
  sendCode: function (phone) {
    return post(`/codes?phone=${phone}&type=wechat`)
  },
  checkCode: function (phone, code) {
    return get('/codes/check', { phone, code, type: 'wechat' })
  },
  uploadIdCardImg: function (filepath) {
    // return Promisify(wx.uploadFile)({
    //   url: `${BASE_URL}/upload`,
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
