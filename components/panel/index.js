
/**
 * 带有一个导航标题栏的面板
 * 定义成组件主要是因为 slot 功能
 */
Component({
  properties: {
    url: String,
    title: String,
    isLastChild: Boolean
  }
})
