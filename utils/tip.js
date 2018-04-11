/**
 * 使用帮助的类别、内容、是否显示、控制显示
 */

import Promisify from './promisify'

// 使用帮助是否显示，应用启动时从缓存中初始化，只能通过下面的 setter 修改
var TIP_SETTINGS = {
  SEARCH_SCAN: true, // 扫描二维码搜索图书
  HISTORY: true // 搜索历史记录
}

// 使用帮助的内容
var TIP_MSG = {
  SEARCH_SCAN: '手动输入ISBN太麻烦？您可以点击输入框右侧的扫描图标，直接扫描图书条形码',
  HISTORY: '搜索历史会保留搜索类型与关键字，最多保留六条历史记录'
}

/**
 * 显示使用帮助
 * @param type {string}
 * @return {Promise}
 */
function showTip (type) {
  if (TIP_SETTINGS[type]) {
    return Promisify(wx.showModal)({
      title: '帮助',
      content: TIP_MSG[type],
      cancelText: '关闭',
      confirmText: '不再显示'
    }).then(res => {
      if (res.confirm) {
        setTipSettingByType(type, false)
      }
    })
  } else {
    return Promise.resolve()
  }
}

/**
 * 设置整个 TIP_SETTINGS
 */
function setTipSettings (obj) {
  TIP_SETTINGS = obj
  wx.setStorageSync('TIP_SETTINGS', TIP_SETTINGS)
}

/**
 * 设置某一项使用帮助的显示
 */
function setTipSettingByType (type, value) {
  TIP_SETTINGS[type] = value
  wx.setStorageSync('TIP_SETTINGS', TIP_SETTINGS)
}

module.exports = {
  setTipSettings: setTipSettings,
  setTipSettingByType: setTipSettingByType,
  showTip: showTip
}
