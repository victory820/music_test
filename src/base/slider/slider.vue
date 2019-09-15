<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(item, index) in dots" :class="{'active': currentPageIndex === index}" :key="index"></span>
    </div>
  </div>
</template>
<script>
import BScroll from 'better-scroll'
import { addClass } from '@/common/js/dom'

export default {
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoplay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 4000
    }
  },
  data () {
    return {
      dots: [],
      currentPageIndex: 0
    }
  },
  methods: {
    setSliderWidth (isResize) {
      this.children = this.$refs.sliderGroup.children // 获取全部元素
      let width = 0
      let sliderWidth = this.$refs.slider.clientWidth // 展示区域的宽度
      for (let obj of this.children) { // 为每一个slider添加类名，并设置轮播图的总长度
        addClass(obj, 'slider-item')
        obj.style.width = sliderWidth + 'px'
        width += sliderWidth
      }
      if (this.loop && !isResize) { // 循环轮播时，要到无缝滚动需要多加两个slider
        width += (2 * sliderWidth)
      }
      this.$refs.sliderGroup.style.width = width + 'px'
    },
    initSlider () {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop,
          threshold: 0.3,
          speed: 400
        }
      })
      // 切换下一张图的回掉
      this.slider.on('scrollEnd', this.onScrollEnd)
    },
    onScrollEnd () {
      let pageIndex = this.slider.getCurrentPage().pageX // 获取横向滚动的下标
      this.currentPageIndex = pageIndex
      if (this.autoplay) {
        this.play()
      }
    },
    initDots () {
      this.dots = new Array(this.children.length)
    },
    play () {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.slider.next()
      }, this.interval)
    }
  },
  mounted () {
    setTimeout(() => {
      this.setSliderWidth()
      this.initDots()
      this.initSlider()
      if (this.autoplay) {
        this.play()
      }
    }, 20)
    window.addEventListener('resize', () => {
      if (!this.slider) {
        return
      }
      this.setSliderWidth(true)
      this.slider.refresh()
    })
  },
  beforeDestroy () {
    clearTimeout(this.timer)
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/variable'

  .slider
    min-height 1px
    .slider-group
      position relative
      overflow hidden
      white-space nowrap
      .slider-item
        float left
        box-sizing border-box
        overflow hidden
        text-align center
        a
          display block
          width 100%
          overflow hidden
          text-decoration none
        img
          display block
          width 100%
    .dots
      position absolute
      right 0
      left 0
      bottom 12px
      text-align center
      font-size 0
      .dot
        display inline-block
        margin 0 4px
        width 8px
        height 8px
        border-radius 50%
        background $color-text-l
        &.active
          width 20px
          border-radius 5px
          background $color-text-ll
</style>
