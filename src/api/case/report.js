import { axios } from '@/utils/request'
const urlPrefix = 'case/v1/report/'

export function reportList (params) {
  return axios({
    method: 'get',
    url: `${urlPrefix}list`,
    params: params
  })
}

export function reportDetail (id) {
  return axios({
    method: 'get',
    url: `${urlPrefix}` + `${id}`
  })
}

export function deviceReportDetail (id) {
  return axios({
    method: 'get',
    url: `${urlPrefix}` + 'deviceReportDetail/' + `${id}`
  })
}

export function reportPlanList (params) {
  return axios({
    method: 'get',
    url: `${urlPrefix}plan/history`,
    params: params
  })
}

export function reportExport (id) {
  return axios({
    method: 'get',
    url: `${urlPrefix}export/` + `${id}`
  })
}
export function reportLog (id) {
  return axios({
    method: 'get',
    url: `${urlPrefix}log/` + `${id}`
  })
}

export function deviceReportLog (id) {
  return axios({
    method: 'get',
    url: `${urlPrefix}deviceLog/` + `${id}`
  })
}

export function runLog (params) {
  return axios({
    method: 'get',
    url: `${urlPrefix}run/log`,
    params: params
  })
}

export function deviceRunLog (params) {
  return axios({
    method: 'get',
    url: `${urlPrefix}deviceRun/log`,
    params: params
  })
}

