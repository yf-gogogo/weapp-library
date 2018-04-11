
/**
 * 加载更多
 */
Component({
  properties: {
    status: {
      type: String,
      value: 'loading' // nomore
    },
    loadingText: {
      type: String,
      value: '加载中'
    },
    nomoreText: {
      type: String,
      value: '没有更多数据了'
    }
  }
})
