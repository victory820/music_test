<template>
  <div class="recommend">
    <!-- better-scroll是父子级结构，子级内只有第一个元素可以滚动,这里监听的是歌单列表 -->
    <scroll class="recommend-content" :data="discList" ref="scroll">
      <div>
        <div class="slider-wrapper" v-if="recommends.length">
          <slider>
            <div v-for="item in recommends" :key="item.id">
              <a :href="item.linkUrl">
                <!-- 保证有一张图片加载完成后在去刷新下scroll组件，保证滚动的高度正确 -->
                <!-- 如果这里无法点击，记得加上class="needsclick",因为better-scroll和fast-click会有点击事件的冲突，解决：监听到此类说明需要手动点击，factclick不再阻止点击事件 -->
                <img @load="loadImage" :src="item.picUrl" alt="loading....">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li v-for="item in discList" :key="item.dissid" class="item">
              <div class="icon">
                <img v-lazy="item.imgurl" alt="" width="60" height="60">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>
<script>
import { getRecommend, getDiscList } from '@/api/recommend'
import Slider from '@/base/slider/slider'
import Scroll from '@/base/scroll/scroll'
import Loading from '@/base/loading/loading'
import { ERR_OK } from '@/api/config'

export default {
  components: {
    Slider,
    Scroll,
    Loading
  },
  data () {
    return {
      recommends: [],
      discList: []
    }
  },
  methods: {
    _getRecommend () {
      getRecommend()
        .then(res => {
          let data = res.data
          if (data.code === ERR_OK) {
            this.recommends = data.data.slider
          }
        })
        .catch(e => {
          console.log(e)
        })
    },
    _getDiscList () {
      getDiscList()
        .then(res => {
          let data = res.data
          if (data.code === ERR_OK) {
            this.discList = data.data.list
          }
        })
        .catch(e => {
          console.log(e)
        })
    },
    loadImage () {
      if (!this.checkLoaded) {
        this.$refs.scroll.refresh()
        this.checkLoaded = true
      }
    }
  },
  created () {
    this._getRecommend()
    this._getDiscList()
  }
}
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import '~common/stylus/variable'

  .recommend
    position fixed
    width 100%
    top 88px
    bottom 0
    .recommend-content
      height 100%
      overflow hidden
      .slider-wrapper
        position relative
        width 100%
        overflow hidden
      .recommend-list
        .list-title
          height 65px
          line-height 65px
          text-align center
          font-size $font-size-medium
          color $color-theme
        .item
          display flex
          box-sizing border-box
          align-items center
          padding 0 20px 20px 20px
          .icon
            flex 0 0 60px
            width 60px
            padding-right 20px
          .text
            display flex
            flex-direction column
            justify-content center
            flex 1
            line-height 20px
            overflow hidden
            font-size $font-size-medium
            .name
              margin-bottom 10px
              color $color-text
            .desc
              color $color-text-d
      .loading-container
        position absolute
        width 100%
        top 50%
        transform translateY(-50%)
</style>
