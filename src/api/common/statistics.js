import { axios } from '@/utils/request'
const urlPrefix = '/v1/stat/'

export function getOverviewList (parameter) {
  return axios({
    method: 'get',
    url: `${urlPrefix}overview`,
    params: parameter
  })
}

export function statDeviceAdd (parameter) {
  return axios({
    method: 'post',
    url: `${urlPrefix}devices/add`,
    data: parameter
  })
}

export function getAllDevicesKeyIndicators (parameter) {
  return axios({
    method: 'get',
    url: `${urlPrefix}all/devices/indicator`,
    params: parameter
  })
}

export function getAllDevicesData (parameter) {
  return axios({
    method: 'get',
    url: `${urlPrefix}all/devices/list`,
    params: parameter
  })
}

export function getTopList (parameter) {
  return axios({
    method: 'get',
    url: `${urlPrefix}/device/top`,
    params: parameter
  })
}

export function getDeviceData (parameter) {
  return axios({
    method: 'get',
    url: `${urlPrefix}device/list`,
    params: parameter
  })
}

export function getKeyIndicators (parameter) {
  return axios({
    method: 'get',
    url: `${urlPrefix}device/indicator`,
    params: parameter
  })
}

export function statOerviewAdd (parameter) {
  return axios({
    method: 'post',
    url: `${urlPrefix}overview/add`,
    data: parameter
  })
}
