<template>
  <div class="singer">
    <list-view :data="singers" @select="selectSinger"></list-view>
    <router-view></router-view>
  </div>
</template>
<script>
import { getSingerList } from '@/api/singer'
import Singer from 'common/js/singer'
import ListView from 'base/listview/listview'
import { ERR_OK } from 'api/config'
import { mapMutations } from 'vuex'
const HOT_TITLE = '热门'
const HOT_SINGER_LEN = 10

export default {
  data () {
    return {
      singers: []
    }
  },
  components: {
    ListView
  },
  methods: {
    selectSinger (singer) {
      this.$router.push({ path: `/singer/${singer.id}` })
      this.setSinger(singer)
    },
    _getSingerList () {
      getSingerList()
        .then((res) => {
          if (res.code === ERR_OK) {
            this.singers = this.normalizeSinger(res.data.list)
          }
        })
    },
    // 拆解数据，实现外层数组套内层数组
    normalizeSinger (arr) {
      let map = {
        hot: {
          title: HOT_TITLE,
          singers: []
        }
      }
      arr.forEach((item, index) => {
        if (index < HOT_SINGER_LEN) {
          map.hot.singers.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        }
        let key = item.Findex
        if (!map[key]) {
          map[key] = {
            title: key,
            singers: []
          }
        } else {
          map[key].singers.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        }
      })
      let hot = []
      let ret = []
      for (let key in map) {
        let val = map[key]
        if (val.title === HOT_TITLE) {
          hot.push(val)
        } else {
          if (val.title.match(/[a-zA-Z]/)) {
            ret.push(val)
          }
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(ret)
    },
    ...mapMutations({
      'setSinger': 'SET_SINGER'
    })
  },
  mounted () {
    this._getSingerList()
  }
}
</script>
<style lang="stylus">
  .singer
    position fixed
    top 88px
    bottom 0
    width 100%
</style>
