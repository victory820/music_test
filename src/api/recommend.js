import axios from 'axios'
import { commonParams } from './config'

const debug = process.env.NODE_ENV !== 'production'

export function getRecommend () {
  const url = '/api/getSliders'

  const datas = Object.assign({}, commonParams, {
    platform: 'h5'
  })

  return axios.get(url, {
    params: datas
  })
}

export function getDiscList () {
  const url = debug ? '/api/getDiscList' : 'http://ustbhuangyi.com/music/api/getDiscList'

  const datas = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  })
  return axios.get(url, {
    params: datas
  })
}
