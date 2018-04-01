/**
 * get，post方法的封装
 * 发生错误时显示错误 Modal
 * 如果不希望显示 Modal，可以直接使用 request
 *
 * 本项目 API 文档：
 * -- https://app.swaggerhub.com/apis/imageslr/weapp/1.0.0
 * Mock 数据：
 * -- https://www.easy-mock.com/project/5aacc9a1d3f6bd35dfb4be65
 * 
 * @param relativeUrl 相对路径 必填
 * @param param 参数 可选
 * @param header 请求头参数 可选
 * @returns {Promise}
 */

var Promise = require('../utils/es6-promise')

/** 
 * 服务器根路径
 */
let baseUrl = "https://www.easy-mock.com/mock/5aacc9a1d3f6bd35dfb4be65/api/v1"

export function get(relativeUrl, param, header) {
  return request("GET", relativeUrl, param, header).catch((res) => {
    wx.showModal({
      title: "获取数据失败",
      content: "请检查您的网络状态",
      showCancel: false
    })
    return Promise.reject()
  }).then((res) => {
    if (res.statusCode >= 400) {
      wx.showModal({
        content: res.data.message || "发生未知错误",
        showCancel: false
      })
      return Promise.reject(res.data)
    } else {
      return Promise.resolve(res.data)
    }
  })
}

export function post(relativeUrl, param, header) {
  return request("POST", relativeUrl, param, header)
}

export function request(method, relativeUrl, param, header) {
  let response, error
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseUrl + relativeUrl,
      method: method,
      header: Object.assign({ 'Content-Type': 'application/json' }, header),
      data: param || {},
      success(res) {
        response = res.data
        resolve(res)
      },
      fail(err) {
        error = err
        reject(err)
      },
      complete() {
        console.info('==============>请求开始<==============')
        console.warn(method, baseUrl + relativeUrl)
        if (param) console.warn('参数：', param)
        if (response) {
          console.warn("请求成功：", response)
        } else {
          console.warn("请求失败：", error)
        }
        console.info('==============>请求结束<==============')
      }
    })
  })
}