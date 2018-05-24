
import { debounce } from '../../utils/utils'

var SYNC_ID = 0 // 获取元素信息为异步获取，因此用一个变量记录最后一次调用的方法的id

/**
 * 当元素滚动到页面顶部时固定，不再跟随滚动。元素高度不能超过视窗高度。
 * @event <stickystart> <stickyend> 事件对象为被包裹元素的布局信息
 *
 * 使用示例
 * ① wxml: 为sticky添加类名，用于选择器
 *  <sticky class="sticky" >
 *    我是固定的！
 *  </sticky>
 * ② 在页面的onPageScroll或scroll-view的bindscroll事件中添加：
 *  onPageScroll: function () {
 *     this.selectAllComponents('.sticky').forEach(sticky => sticky.onSticky())
 *   }
 *
 * TODO:
 * 1. 固定位置离页面顶部的距离
 * 2. 性能优化：现在渲染不够流畅，因为小程序获取wxml信息是异步的
 */
Component({
  properties: {
    // zindex
    zIndex: {
      type: Number,
      value: 5
    }
  },

  data: {
    isSticky: false,
    wrapperHeight: 0
  },

  methods: {
    onSticky: function () {
      const TEMP_ID = ++SYNC_ID // 记录当前id
      console.log(TEMP_ID)

      this.createSelectorQuery()
        .selectAll('.sticky--selected')
        .fields({
          rect: true,
          size: true
        },
        /**
         * @param nodesRef 元素布局信息数组，第一个是外部元素的信息，第二个是被包裹元素的信息
         * { left, right, top, bottom, width, height }
         */
        nodesRef => {
          if (TEMP_ID !== SYNC_ID) return

          let { isSticky } = this.data
          let { top: outTop, height: outHeight } = nodesRef[0] // 外部wrapper信息
          let { top: stickyTop, height: stickyHeight } = nodesRef[1] // 被包裹元素信息

          if (!isSticky && stickyTop < 0) {
            this.setData({
              isSticky: true,
              wrapperHeight: outHeight
            })
            this.triggerEvent('stickystart', nodesRef[1])
            console.log('trigger stickystart')
          } else if (isSticky && outTop + outHeight >= stickyTop + stickyHeight) {
            this.setData({
              isSticky: false
            })
            this.triggerEvent('stickyend', nodesRef[1])
            console.log('trigger stickyend')
          }
        }).exec()
    }
  }
})
