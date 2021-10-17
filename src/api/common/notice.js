import { axios } from '@/utils/request'
const urlPrefix = '/v1/notice/'

export function unReadList (params) {
  return axios({
    method: 'get',
    url: `${urlPrefix}user/unread/list`,
    params: params
  })
}

export function unReadNum (params) {
  return axios({
    method: 'get',
    url: `${urlPrefix}user/unread/num`,
    params: params
  })
}

export function readAll (params) {
  return axios({
    method: 'post',
    url: `${urlPrefix}readAll`,
    data: params
  })
}

export function userAllList (params) {
  return axios({
    method: 'get',
    url: `${urlPrefix}user/list`,
    params: params
  })
}

export function noticeDetail (params) {
  return axios({
    method: 'get',
    url: `${urlPrefix}detail`,
    params: params
  })
}

export function updateReadState (params) {
  return axios({
    method: 'post',
    url: `${urlPrefix}update/readState`,
    data: params
  })
}

export function adminList (params) {
  return axios({
    method: 'get',
    url: `${urlPrefix}admin/list`,
    params: params
  })
}
