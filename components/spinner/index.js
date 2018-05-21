
/**
 * 加载组件
 * 修改了下面的库的css，目前只整合了两个样式
 * https://github.com/ConnorAtherton/loaders.css/blob/master/loaders.css
 */
Component({
  externalClasses: ['class'], // 可以为根元素添加外部class
  properties: {
    /**
     * 动画类型
     * 可选：line-scale，line-scale-pulse-out
     */
    type: {
      type: String,
      value: 'line-scale-pulse-out'
    },
    /**
     * 背景颜色
     */
    bgColor: {
      type: String,
      value: '#999'
    },
    /**
     * 加载组件显示时，页面是否可点击
     */
    mask: {
      type: Boolean,
      value: false
    }
  }
})
