import Vue from 'vue'
import Router from 'vue-router'
import Rank from 'views/rank/rank'
import Recommend from 'views/recommend/recommend'
import Search from 'views/search/search'
import Singer from 'views/singer/singer'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/rank',
      name: 'rank',
      component: Rank
    },
    {
      path: '/recommend',
      name: 'recommend',
      component: Recommend
    },
    {
      path: '/search',
      name: 'search',
      component: Search
    },
    {
      path: '/singer',
      name: 'singer',
      component: Singer
    }
  ]
})
