import { axios } from '@/utils/request'
const urlPrefix = 'case/v2/case/'


export function getCaseData (params) {
  console.log('in getCaseData function')
  return axios({
    method: 'post',
    url: `${urlPrefix}getTestCases`,
    data: params
  })
}

export function getManualCasesWithAutoCaseInfo (params) {
  console.log('in getManualCasesWithAutoCaseInfo function')
  return axios({
    method: 'post',
    url: `${urlPrefix}getManualCasesWithAutoCaseInfo`,
    data: params
  })
}

export function addPlanAssociatedCases (params) {
  console.log('in addPlanAssociatedCases function')
  return axios({
    method: 'post',
    url: `${urlPrefix}addPlanAssociatedCases`,
    data: params
  })
}

export function getPlanCaseData (params) {
  console.log('in getPlanCaseData function')
  return axios({
    method: 'post',
    url: `${urlPrefix}getPlanTestCases`,
    data: params
  })
}

export function getPlanSmokeCaseData (params) {
  console.log('in getPlanSmokeCaseData function')
  return axios({
    method: 'post',
    url: `${urlPrefix}getPlanSmokeTestCases`,
    data: params
  })
}

export function getConfigPlanCaseTestCases (params) {
  console.log('in getConfigPlanCaseTestCases function')
  return axios({
    method: 'post',
    url: `${urlPrefix}getConfigPlanCaseTestCases`,
    data: params
  })
}

export function removePlanCase (params) {
  console.log('in removePlanCase function')
  return axios({
    method: 'post',
    url: `${urlPrefix}removePlanCase`,
    data: params
  })
}

export function setPlanCaseExecutor (params) {
  console.log('in setPlanCaseExecutor function')
  return axios({
    method: 'post',
    url: `${urlPrefix}setPlanCaseExecutor`,
    data: params
  })
}


export function setPlanSmokeCaseExecutor (params) {
  console.log('in setPlanSmokeCaseExecutor function')
  return axios({
    method: 'post',
    url: `${urlPrefix}setPlanSmokeCaseExecutor`,
    data: params
  })
}

export function setPlanCaseExecuteResult (params) {
  console.log('in setPlanCaseExecuteResult function')
  return axios({
    method: 'post',
    url: `${urlPrefix}setPlanCaseExecuteResult`,
    data: params
  })
}

export function setPlanSmokeCaseExecuteResult (params) {
  console.log('in setPlanSmokeCaseExecuteResult function')
  return axios({
    method: 'post',
    url: `${urlPrefix}setPlanSmokeCaseExecuteResult`,
    data: params
  })
}

export function setPlanCaseExecutePriority (params) {
  console.log('in setPlanCaseExecutePriority function')
  return axios({
    method: 'post',
    url: `${urlPrefix}setPlanCaseExecutePriority`,
    data: params
  })
}



export function setPlanCaseSmokeTest (params) {
  console.log('in setPlanCaseSmokeTest function')
  return axios({
    method: 'post',
    url: `${urlPrefix}setPlanCaseSmokeTest`,
    data: params
  })
}

export function cancelPlanCaseSmokeTest (params) {
  console.log('in cancelPlanCaseSmokeTest function')
  return axios({
    method: 'post',
    url: `${urlPrefix}cancelPlanCaseSmokeTest`,
    data: params
  })
}

export function getTestCaseById (id) {
  console.log('in getTestCaseById function')
  return axios({
    method: 'get',
    url: `${urlPrefix}getTestCaseById/` + `${id}`
  })
}


export function getCaseTemplateById (id) {
  console.log('in getCaseTemplateById function')
  return axios({
    method: 'get',
    url: `${urlPrefix}getCaseTemplateById/` + `${id}`
  })
}

export function getPlanCaseDetail (params) {
  console.log('in getPlanCaseDetail function')
  return axios({
    method: 'post',
    url: `${urlPrefix}getPlanCaseDetail`,
    data: params
  })
}

export function planCaseDetailSetExecuteResult (params) {
  console.log('in planCaseDetailSetExecuteResult function')
  return axios({
    method: 'post',
    url: `${urlPrefix}planCaseDetailSetExecuteResult`,
    data: params
  })
}

export function planSmokeCaseDetailSetExecuteResult (params) {
  console.log('in planSmokeCaseDetailSetExecuteResult function')
  return axios({
    method: 'post',
    url: `${urlPrefix}planSmokeCaseDetailSetExecuteResult`,
    data: params
  })
}

export function createOrModifyTestCase (params) {
  console.log('in createOrModifyTestCase function')
  var url = `${urlPrefix}` + `${!params.case_id ? 'createTestCase' : 'modifyTestCase'}`
  return axios({
    method: 'post',
    url: url,
    data: params
  })
}

export function createOrModifyCaseTemplate (params) {
  console.log('in createOrModifyCaseTemplate function')
  var url = `${urlPrefix}` + `${!params.template_id ? 'createCaseTemplate' : 'modifyCaseTemplate'}`
  return axios({
    method: 'post',
    url: url,
    data: params
  })
}

export function copyOrMoveCaseTestCase (params) {
  console.log('in copyOrMoveCaseTestCase function')
  var url = `${urlPrefix}` + `${params.operation === 'copy' ? 'copyTestCase' : 'moveTestCase'}`
  console.log('url: ', url)
  return axios({
    method: 'post',
    url: url,
    data: params
  })
}

export function deleteTestCase (params) {
  console.log('in deleteTestCase function')
  return axios({
    method: 'post',
    url: `${urlPrefix}deleteTestCase`,
    data: params
  })
}

export function deleteCaseTemplate (params) {
  console.log('in deleteCaseTemplate function')
  return axios({
    method: 'post',
    url: `${urlPrefix}deleteCaseTemplate`,
    data: params
  })
}

export function exportTestCase (params) {
  console.log('in exportTestCase function')
  return axios({
    method: 'post',
    url: `${urlPrefix}exportTestCase`,
    data: params
    // responseType: 'blob'
  })
}

export function setMultipleCaseLevel (params) {
  console.log('in setMultipleCaseLevel function')
  return axios({
    method: 'post',
    url: `${urlPrefix}setMultipleCaseLevel`,
    data: params
  })
}

export function saveCaseOrderNumber (params) {
  console.log('in saveCaseOrderNumber function')
  return axios({
    method: 'post',
    url: `${urlPrefix}saveCaseOrderNumber`,
    data: params
  })
}

export function exportCaseTemplate () {
  console.log('in exportCaseTemplate function')
  return axios({
    method: 'get',
    url: `${urlPrefix}exportCaseImportTemplate`
  })
}

export function getImportCaseResultExcel (params) {
  console.log('in getImportCaseResultExcel function')
  return axios({
    method: 'post',
    url: `${urlPrefix}getImportCaseResultExcel`,
    data: params
  })
}

export function validateTestCase (formData) {
  console.log('in validateTestCase function')
  return axios({
    method: 'post',
    url: `${urlPrefix}validateTestCase`,
    data: formData,
    processData: false,
    timeout: 15 * 60 * 1000
  })
}

export function importTestCase (params) {
  console.log('in importTestCase function')
  return axios({
    method: 'post',
    url: `${urlPrefix}importTestCase`,
    data: params,
    processData: false,
    timeout: 15 * 60 * 1000
  })
}

export function getCaseCommentsByCaseId (params) {
  console.log('params in getCaseCommentsByCaseId function: ', params)
  return axios({
    method: 'post',
    url: `${urlPrefix}getCaseCommentsByCaseId`,
    data: params
  })
}

export function getCaseExecuteComments (params) {
  console.log('params in getCaseExecuteComments function: ', params)
  return axios({
    method: 'post',
    url: `${urlPrefix}getCaseExecuteComments`,
    data: params
  })
}

export function addCommentToCase (params) {
  console.log('params in addCommentToCase function: ', params)
  return axios({
    method: 'post',
    url: `${urlPrefix}addCommentToCase`,
    data: params
  })
}

export function addCaseExecuteComment (params) {
  console.log('params in addCaseExecuteComment function: ', params)
  return axios({
    method: 'post',
    url: `${urlPrefix}addCaseExecuteComment`,
    data: params
  })
}

export function deleteComment (params) {
  console.log('params in addCommentdeleteCommentToCase function: ', params)
  return axios({
    method: 'post',
    url: `${urlPrefix}deleteComment`,
    data: params
  })
}

export function deleteCaseExecuteComment (params) {
  console.log('params in deleteCaseExecuteComment function: ', params)
  return axios({
    method: 'post',
    url: `${urlPrefix}deleteCaseExecuteComment`,
    data: params
  })
}

export function getCaseOperationRecordByCaseId (params) {
  console.log('params in getCaseOperationRecordByCaseId function: ', params)
  return axios({
    method: 'post',
    url: `${urlPrefix}getCaseOperationRecordByCaseId`,
    data: params
  })
}

export function getCaseExecuteOperationRecords (params) {
  console.log('params in getCaseExecuteOperationRecords function: ', params)
  return axios({
    method: 'post',
    url: `${urlPrefix}getCaseExecuteOperationRecords`,
    data: params
  })
}

export function getRecycleBinCases (params) {
  console.log('params in getRecycleBinCases function: ', params)
  return axios({
    method: 'post',
    url: `${urlPrefix}getRecycleBinCases`,
    data: params
  })
}


export function getCaseTemplateList (params) {
  console.log('params in getCaseTemplateList function: ', params)
  return axios({
    method: 'post',
    url: `${urlPrefix}getCaseTemplateList`,
    data: params
  })
}



export function recoverRecycleBinCase (params) {
  console.log('params in recoverRecycleBinCase function: ', params)
  return axios({
    method: 'post',
    url: `${urlPrefix}recoverRecycleBinCase`,
    data: params
  })
}
