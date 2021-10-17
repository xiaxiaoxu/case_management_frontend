import { axios } from '@/utils/request'
const urlPrefix = 'case/v2/project/'

export function getProjectList (params) {
  return axios({
    method: 'post',
    url: `${urlPrefix}getProjectList`,
    data: params
  })
}

export function getProjectCaseNum (params) {
  return axios({
    method: 'post',
    url: `${urlPrefix}getProjectCaseNum`,
    data: params
  })
}

export function getProjectNameList () {
  return axios({
    method: 'get',
    url: `${urlPrefix}getProjectNameList`
  })
}

export function projectAddOrModify (params) {
  var url = `${urlPrefix}` + `${!params.project_id ? 'add' : 'modify'}`
  return axios({
    method: 'post',
    url: url,
    data: params
  })
}

export function findProjectById (id) {
  console.log('in findProjectById function')
  return axios({
    method: 'get',
    url: `${urlPrefix}find/` + `${id}`
  })
}

export function deleteProject (params) {
  return axios({
    method: 'post',
    url: `${urlPrefix}delete`,
    data: params
  })
}

export function getMembers () {
  console.log('in getMembers function')
  return axios({
    method: 'get',
    url: `${urlPrefix}getMembers`
  })
}
