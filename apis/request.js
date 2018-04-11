/**
 * get，post方法的封装
 *
 * 本项目 API 文档：
 * -- https://app.swaggerhub.com/apis/imageslr/weapp/1.0.0
 * Mock 数据：
 * -- https://www.easy-mock.com/project/5aacc9a1d3f6bd35dfb4be65
 */

var Promise = require('../utils/es6-promise')

/**
 * 服务器根路径
 */
let baseUrl = 'https://www.easy-mock.com/mock/5aacc9a1d3f6bd35dfb4be65/api/v1'

/**
 * get 方法
 * @param relativeUrl 相对路径 必填
 * @param param 参数 可选
 * @param header 请求头参数 可选
 * @returns {Promise}
 */
export function get (relativeUrl, param, header) {
  return requestWithModal('GET', relativeUrl, param, header)
}

/**
 * post 方法
 */
export function post (relativeUrl, param, header) {
  return requestWithModal('POST', relativeUrl, param, header)
}

/**
 * 发生错误时显示错误信息
 * @param method 请求方式 必填
 * @param relativeUrl 相对路径 必填
 * @param param 参数 可选
 * @param header 请求头参数 可选
 * @returns {Promise}
 */
export function requestWithModal (method, relativeUrl, param, header) {
  return request(method, relativeUrl, param, header).catch((res) => {
    wx.showModal({
      title: '获取数据失败',
      content: '请检查您的网络状态',
      showCancel: false
    })
    return Promise.reject()
  }).then((res) => {
    if (res.statusCode >= 400) {
      wx.showModal({
        content: res.data.message || '发生未知错误',
        showCancel: false
      })
      return Promise.reject(res)
    } else {
      return Promise.resolve(res)
    }
  })
}

/**
 * request 基类方法
 * @param method 请求方式 必填
 * @param relativeUrl 相对路径 必填
 * @param param 参数 可选
 * @param header 请求头参数 可选
 * @returns {Promise} 返回响应完整内容
 */
export function request (method, relativeUrl, param, header) {
  let response, error
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseUrl + relativeUrl,
      method: method,
      header: Object.assign({ 'Content-Type': 'application/json' }, header),
      data: param || {},
      success (res) {
        response = res.data
        resolve(res)
      },
      fail (err) {
        error = err
        reject(err)
      },
      complete () {
        console.info('==============>请求开始<==============')
        console.warn(method, baseUrl + relativeUrl)
        if (param) console.warn('参数：', param)
        if (response) {
          console.warn('请求成功：', response)
        } else {
          console.warn('请求失败：', error)
        }
        console.info('==============>请求结束<==============')
      }
    })
  })
}
