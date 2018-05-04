module.exports = {
  isPhone: str => /^1[3|4|5|7|8][0-9]{9}$/.test(str),
  isVrcode: str => /^[0-9]{6}$/.test(str) // 6位数字验证码
}
