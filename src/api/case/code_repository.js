import { axios } from '@/utils/request'
const urlPrefix = 'case/v2/codeRepository/'
export function getCodeRepositoryData (params) {
  return axios({
    method: 'post',
    url: `${urlPrefix}getCodeRepositoryList`,
    data: params

  })
}

export function getRepositoryCloneStatus (repositoryId) {
  return axios({
    method: 'get',
    url: `${urlPrefix}getRepositoryCloneStatus/` + `${repositoryId}`
  })
}


export function getRepositoryBranch (params) {
  return axios({
    method: 'post',
    url: `${urlPrefix}getRepositoryBranch`,
    data: params
  })
}

export function addOrModifyRepository (params) {
  var url = `${urlPrefix}` + `${!params.repository_id ? 'addRepository' : 'modifyRepository'}`
  return axios({
    method: 'post',
    url: url,
    data: params
  })
}

export function cloneCodeRepositoryProject (params) {
  return axios({
    method: 'post',
    url: `${urlPrefix}cloneCodeRepositoryProject`,
    data: params
  })
}

export function getTestSuiteData (params) {
  return axios({
    method: 'post',
    url: `${urlPrefix}getTestSuiteData`,
    data: params
  })
}

export function getSuiteCases (params) {
  return axios({
    method: 'post',
    url: `${urlPrefix}getSuiteCases`,
    data: params
  })
}

export function bindAutoCase (params) {
  return axios({
    method: 'post',
    url: `${urlPrefix}bindAutoCase`,
    data: params
  })
}

