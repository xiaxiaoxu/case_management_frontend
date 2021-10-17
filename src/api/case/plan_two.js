import { axios } from '@/utils/request'
const urlPrefix = 'case/v2/plan/'


export function getTestPlanList (params) {
  console.log('in getTestPlanList function')
  return axios({
    method: 'post',
    url: `${urlPrefix}getTestPlanList`,
    data: params
  })
}

export function runTestPlan (params) {
  console.log('in runTestPlan function')
  return axios({
    method: 'post',
    url: `${urlPrefix}runTestPlan`,
    data: params
  })
}

export function stopTestPlan (params) {
  console.log('in stopTestPlan function')
  return axios({
    method: 'post',
    url: `${urlPrefix}stopTestPlan`,
    data: params
  })
}


export function savePlanSnapshotData (params) {
  console.log('in savePlanSnapshotData function')
  return axios({
    method: 'post',
    url: `${urlPrefix}savePlanSnapshotData`,
    data: params
  })
}

export function planAddOrModify (params) {
  console.log('in planAddOrModify function')
  var url = `${urlPrefix}` + `${!params.plan_id ? 'add' : 'modify'}`
  return axios({
    method: 'post',
    url: url,
    data: params
  })
}

export function planCopy (params) {
  console.log('in planCopy function')
  return axios({
    method: 'post',
    url: `${urlPrefix}copy`,
    data: params
  })
}

export function findPlanData (params) {
  console.log('in findPlanData function')
  return axios({
    method: 'post',
    url: `${urlPrefix}findPlanData`,
    data: params
  })
}

export function findPlanById (id) {
  console.log('in findPlanById function')
  return axios({
    method: 'get',
    url: `${urlPrefix}findPlanById/` + `${id}`
  })
}

export function createIterationData (params) {
  console.log('in createIterationData function')
  return axios({
    method: 'post',
    url: `${urlPrefix}createIterationData`,
    data: params
  })
}

export function modifyIterationName (params) {
  console.log('in modifyIterationName function')
  return axios({
    method: 'post',
    url: `${urlPrefix}modifyIterationName`,
    data: params
  })
}

export function getPlanCodeRepository (params) {
  console.log('in getPlanCodeRepository function')
  return axios({
    method: 'post',
    url: `${urlPrefix}getPlanCodeRepository`,
    data: params
  })
}

export function runAutoCase (params) {
  console.log('in runAutoCase function')
  return axios({
    method: 'post',
    url: `${urlPrefix}runAutoCase`,
    data: params
  })
}

export function getPlanRepositoryStatus (params) {
  console.log('in getPlanRepositoryStatus function')
  return axios({
    method: 'post',
    url: `${urlPrefix}getPlanRepositoryStatus`,
    data: params
  })
}

export function getPlanReportData (planId) {
  console.log('in findPlanById function')
  return axios({
    method: 'get',
    url: `${urlPrefix}getPlanReportData/` + `${planId}`
  })
}

export function getPlanReportTestSummary (planId) {
  console.log('in getPlanReportTestSummary function')
  return axios({
    method: 'get',
    url: `${urlPrefix}getPlanReportTestSummary/` + `${planId}`
  })
}

export function modifyTestSummary (params) {
  console.log('in modifyTestSummary function')
  return axios({
    method: 'post',
    url: `${urlPrefix}modifyTestSummary`,
    data: params
  })
}

export function deletePlan (params) {
  return axios({
    method: 'post',
    url: `${urlPrefix}delete`,
    data: params
  })
}
