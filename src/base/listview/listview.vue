<template>
  <scroll class="listview"
          :data="data"
          ref="listView"
          :listen-scroll="listenScroll"
          :probe-type="probeType"
          @scroll="scroll">
    <ul>
      <li v-for="group in data" :key="group.title" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li @click="selectItem(item)" class="list-group-item" v-for="item in group.singers" :key="item.id">
            <img class="avatar" v-lazy="item.avatar" alt="">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item, index) in shortList"
        :key="item.title"
        class="item"
        :class="{'current': currentIndex === index}"
        :data-index="index">{{item}}</li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <div class="fixed-title">{{fixedTitle}}</div>
    </div>
    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>
  </scroll>
</template>
<script>
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import { getData } from 'common/js/dom'
const ANCHOR_HEIGHT = 18
const TITLE_HEIGHT = 30

export default {
  created () {
    // 存放一些记录滚动的临时变量
    this.touch = {}
    this.probeType = 3
    this.listenScroll = true
    this.listHeight = [] // 每个数据的高度
  },
  props: {
    data: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      scrollY: -1, // 向下滚动就是负值
      currentIndex: 0,
      diff: 0
    }
  },
  computed: {
    shortList () {
      return this.data.map(group => {
        return group.title.substring(0, 1)
      })
    },
    fixedTitle () {
      if (this.scrollY > 0) {
        return ''
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },
  components: {
    Scroll,
    Loading
  },
  methods: {
    onShortcutTouchStart (e) {
      let authorIndex = getData(e.target, 'index')
      let firstTouch = e.touches[0]
      this.touch.y1 = firstTouch.pageY
      this.touch.anchorIndex = authorIndex
      this._scrollTo(authorIndex)
    },
    onShortcutTouchMove (e) {
      let firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY
      // 向下取整用|0
      let detal = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
      // 因为data-index绑定的是字符串
      this._scrollTo(detal + parseInt(this.touch.anchorIndex))
    },
    scroll (pos) {
      // {x: 0, y: -20.97564697265625}
      this.scrollY = pos.y
    },
    selectItem (item) {
      this.$emit('select', item)
    },
    // 计算所有元素的高度
    _calculateHeight () {
      this.listHeight = []
      // listGroup已经分好组的数据
      const list = this.$refs.listGroup
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        height += item.clientHeight // 一定累加
        // 获取到每组的高度
        this.listHeight.push(height)
      }
    },
    _scrollTo (index) {
      // 点击顶部底部黑色区块的处理
      if (!index && index !== 0) {
        return
      }
      // 滚动到顶部的处理
      if (index < 0) {
        index = 0
      } else if (index > this.listHeight.length - 2) { // 滚动到底部无限大的处理
        index = this.listHeight.length - 2
      }
      this.scrollY = -this.listHeight[index]
      // 第二个参数是否需要滚动时的动画，即：是否缓慢滚动
      this.$refs['listView'].scrollToElement(this.$refs.listGroup[index], 0)
    }
  },
  watch: {
    data () {
      // 保证数据渲染到dom
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    scrollY (newY) {
      const listHeight = this.listHeight
      // 当滚动到顶部，newY > 0
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      // 在中间部分滚动
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i
          // 当滚动时，最大上限加滚动的值，获得还可以滚动多少
          this.diff = height2 + newY
          return
        }
      }
      // 当滚动到底部，且-newY大于最后一个元素的上限
      this.currentIndex = listHeight.length - 2
    },
    diff (newVal) {
      // 当滚动的title和固定的title区域有重合时会计算下面值
      let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? (newVal - TITLE_HEIGHT) : 0
      console.log(fixedTop)
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      this.$refs.fixed.style.transform = `translate3d(0, ${fixedTop}px, 0)`
    }
  }
}
</script>
<style lang="stylus">
@import '~common/stylus/variable';

.listview
  position relative
  width 100%
  height 100%
  overflow hidden
  background $color-background
  .list-group
    padding-bottom 30px
    .list-group-title
      height 30px
      line-height 30px
      padding-left 20px
      font-size $font-size-small
      color $color-text-l
      background $color-highlight-background
    .list-group-item
      display flex
      align-items center
      padding 20px 0 0 30px
      .avatar
        width 50px
        height 50px
        border-radius 50%
      .name
        margin-left 20px
        color $color-text-l
        font-size $font-size-medium
  .list-shortcut
    position absolute
    z-index 30
    right 0
    top 50%
    transform translateY(-50%)
    width 20px
    padding 20px 0
    border-radius 10px
    text-align center
    background $color-background-d
    font-family Helvetica
    .item
      padding 3px
      line-height 1
      color $color-text-l
      font-size $font-size-small
      &.current
        color $color-theme
  .list-fixed
    position absolute
    top 0
    left 0
    width 100%
    .fixed-title
      height 30px
      line-height 30px
      padding-left 20px
      font-size $font-size-small
      color $color-text-l
      background $color-highlight-background
  .loading-container
    position absolute
    width 100%
    top 50%
    transform translateY(-50%)
</style>
