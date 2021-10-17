import { axios } from '@/utils/request'
const urlPrefix = 'case/v2/module/'


export function getModuleList (params) {
  console.log('in getModuleList function')
  return axios({
    method: 'post',
    url: `${urlPrefix}getModuleList`,
    data: params
  })
}

export function moveModule (params) {
  console.log('in moveModule function')
  return axios({
    method: 'post',
    url: `${urlPrefix}moveModule`,
    data: params
  })
}

export function findModuleById (id) {
  console.log('in findModuleById function')
  return axios({
    method: 'get',
    url: `${urlPrefix}findModuleById/` + `${id}`
  })
}

export function getConfigPlanCaseModuleList (params) {
  console.log('in getConfigPlanCaseModuleList function')
  return axios({
    method: 'post',
    url: `${urlPrefix}getConfigPlanCaseModuleList`,
    data: params
  })
}

export function getPlanModuleList (params) {
  console.log('in getPlanModuleList function')
  return axios({
    method: 'post',
    url: `${urlPrefix}getPlanModuleList`,
    data: params
  })
}

export function getPlanSmokeCaseModuleList (params) {
  console.log('in getPlanSmokeCaseModuleList function')
  return axios({
    method: 'post',
    url: `${urlPrefix}getPlanSmokeCaseModuleList`,
    data: params
  })
}

export function addModuleData (params) {
  console.log('in addModuleData function')
  return axios({
    method: 'post',
    url: `${urlPrefix}addModuleData`,
    data: params
  })
}

export function modifyModuleData (params) {
  console.log('in modifyModuleData function')
  return axios({
    method: 'post',
    url: `${urlPrefix}modifyModuleData`,
    data: params
  })
}

export function deleteModuleData (params) {
  console.log('in deleteModuleData function')
  return axios({
    method: 'post',
    url: `${urlPrefix}deleteModuleData`,
    data: params
  })
}

export function deletePlanDetailModuleData (params) {
  console.log('in deletePlanDetailModuleData function')
  return axios({
    method: 'post',
    url: `${urlPrefix}deletePlanDetailModuleData`,
    data: params
  })
}

export function getModuleDirectoryTreeList (params) {
  console.log('in getModuleDirectoryTreeList function')
  return axios({
    method: 'post',
    url: `${urlPrefix}getModuleDirectoryTreeList`,
    data: params
  })
}


export function getModuleNameList (params) {
  console.log('in getModuleNameList function')
  return axios({
    method: 'post',
    url: `${urlPrefix}getModuleNameList`,
    data: params
  })
}
