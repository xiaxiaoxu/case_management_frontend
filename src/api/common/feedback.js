import { axios } from '@/utils/request'

const urlPrefix = '/v1/'

export function getFeedback (params) {
  return axios({
    method: 'get',
    url: `${urlPrefix}feedback/`,
    params: params
  })
}

export function createFeedback (params) {
  return axios({
    method: 'post',
    url: `${urlPrefix}feedback/`,
    data: params
  })
}



