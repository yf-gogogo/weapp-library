## 微信小程序

```
wechat-app
├─apis                  // 网络请求
├─components            // 可复用组件
├─images                // 图标
├─pages                 // 页面，子页面在父页面的children文件夹中
│ └─components          // 与业务相关的特殊组件
├─templates             // 模板
├─style                 // 样式
├─utils                 // 辅助模块
│ ├─es6-promise.js      // Promise语法支持
│ ├─promise-polyfill.js // Promise.finally()语法
│ ├─permission.js       // 登录鉴权
│ ├─qrcode.js           // 二维码生成
│ ├─tip.js              // 使用帮助
│ ├─regexp.js           // 正则表达式
│ └─promisify.js        // 微信小程序API Promise化
├─app.js            
├─app.json
└─app.wxss
```