import { axios } from '@/utils/request'
const urlPrefix = 'case/v1/case/'
const tcUrlPrefix = '/api/v1/'

export function runCase (params) {
  return axios({
    method: 'post',
    url: `${urlPrefix}run`,
    data: params
  })
}


export function stopCase (params) {
  return axios({
    method: 'post',
    url: `${urlPrefix}stop`,
    data: params
  })
}

// 获取设备
export function getTcDevices (params) {
  return axios({
      method: 'get',
      url: `${tcUrlPrefix}tcloud/devices`,
      params: params
  })
}
