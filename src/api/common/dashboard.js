import { axios } from '@/utils/request'

const urlPrefix = '/v1/dashboard/'

export function todoList (params) {
  return axios({
    method: 'get',
    url: `${urlPrefix}todoList`,
    params: params
  })
}

export function addIndustryDynamics (params) {
  return axios({
    method: 'post',
    url: `${urlPrefix}industyDynamics/add`,
    data: params
  })
}

export function getJiraData (params) {
  return axios({
    method: 'get',
    url: `${urlPrefix}jira`,
    params: params
  })
}

export function getIndustryDynamicsList (params) {
  return axios({
    method: 'get',
    url: `${urlPrefix}industryDynamics/list`,
    params: params
  })
}

export function addIndustryDynamicsViewNum (params) {
  return axios({
    method: 'post',
    url: `${urlPrefix}industryDynamics/addViewNum`,
    data: params
  })
}

export function getActiveList (params) {
  return axios({
    method: 'get',
    url: `${urlPrefix}active/list`,
    params: params
  })
}
