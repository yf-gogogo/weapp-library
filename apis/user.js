import { get } from './request.js'

module.exports = {
  sendCode: function (phone) {
    return new Promise(function (resolve, reject) {
      setTimeout(() => resolve(), 1000)
    })
  },
  checkCode: function (phone, vrcode) {
    return get('/vrcodes/check', { phone, vrcode })
  },
  uploadIdCardImg: function (url) {
    return new Promise(function (resolve, reject) {
      setTimeout(() => resolve(), 1000)
    })
  },
  updateUserInfoByPhone: function (phone, params) {
    return new Promise(function (resolve, reject) {
      setTimeout(() => resolve(), 1000)
    })
  },
  getUserInfoByPhone: function (phone) {
    return get('/users/' + phone)
  }
}
