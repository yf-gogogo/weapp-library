import { get } from "./request.js";

module.exports = {
  uploadIdCardImg: function(url) {
    return ""
  },
  updateUserInfoByPhone: function(phone, params) {
    return Promise.resolve()
  },
  getUserInfoByPhone: function(phone) {
    return get("/users/" + phone)
  }
}