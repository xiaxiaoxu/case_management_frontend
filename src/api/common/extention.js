import { axios } from '@/utils/request'
const urlPrefix = '/v1/extention/'

export function getIndustryDynamicsList (params) {
  return axios({
    method: 'get',
    url: `${urlPrefix}industryDynamics/list`,
    params: params
  })
}

export function getIndustryDynamicsDetail (params) {
  return axios({
    method: 'get',
    url: `${urlPrefix}industryDynamics/detail`,
    params: params
  })
}

export function addIndustryDynamics (params) {
  return axios({
    method: 'post',
    url: `${urlPrefix}industryDynamics/add`,
    data: params
  })
}

export function updateIndustryDynamicsData (params) {
  return axios({
    method: 'post',
    url: `${urlPrefix}industryDynamics/update`,
    data: params
  })
}

export function deleteIndustryDynamicsData (params) {
  return axios({
    method: 'post',
    url: `${urlPrefix}industryDynamics/delete`,
    data: params
  })
}
