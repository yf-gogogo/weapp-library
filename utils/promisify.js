/**
 * 将小程序的API封装成支持Promise的API
 * @params fn {Function} 小程序原始API，如wx.login
 */

var Promise = require("./es6-promise.js")
module.exports = function wxPromisify(fn) {
  return function (obj = {}) {
    return new Promise((resolve, reject) => {
      obj.success = function (res) {
        resolve(res)
      }

      obj.fail = function (res) {
        reject(res)
      }

      fn(obj)
    })
  }
}

/**
用法：

import promisify from '...'
var getLocationPromisified = promisify(wx.getLocation)

getLocationPromisified({
  type: 'wgs84'
}).then(function (res) {
  var latitude = res.latitude 
  var longitude = res.longitude 
  var speed = res.speed 
  var accuracy = res.accuracy 
}).catch(function () {
  console.error("get location failed")
})

*/
