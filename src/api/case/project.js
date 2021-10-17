import { axios } from '@/utils/request'
const urlPrefix = 'case/v1/project/'

export function projectList () {
  return axios({
    method: 'get',
    url: `${urlPrefix}list`
  })
}

export function addProject (params) {
  return axios({
    method: 'post',
    url: `${urlPrefix}add`,
    data: params
  })
}

export function subProject (projectName) {
  return axios({
    method: 'get',
    url: `${urlPrefix}subProject/${projectName}`
  })
}

export function subProjectDir (params) {
  return axios({
    method: 'get',
    url: `${urlPrefix}subProjectDir`,
    params: params
  })
}

export function getSuite (params) {
  return axios({
    method: 'get',
    url: `${urlPrefix}suite`,
    params: params
  })
}

export function fileContent (params) {
  return axios({
    method: 'get',
    url: `${urlPrefix}file/content`,
    params: params
  })
}

export function syncCode (params) {
  return axios({
    method: 'post',
    url: `${urlPrefix}update`,
    data: params
  })
}

export function projectBranch (projectName) {
  return axios({
    method: 'get',
    url: `${urlPrefix}branch/${projectName}`
  })
}

