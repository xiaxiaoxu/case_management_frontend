import { axios } from '@/utils/request'
const urlPrefix = 'case/v1/plan/'

export function planAddOrModify (params) {
  var url = `${urlPrefix}` + `${!params.plan_id ? 'add' : 'modify'}`
  return axios({
    method: 'post',
    url: url,
    data: params
  })
}

export function planList (params) {
  return axios({
    method: 'get',
    url: `${urlPrefix}find`,
    params: params
  })
}

export function scheduleAdd (params) {
  return axios({
    method: 'post',
    url: `${urlPrefix}schedule`,
    data: params
  })
}
export function scheduleById (id) {
  return axios({
    method: 'get',
    url: `${urlPrefix}schedule/` + `${id}`
  })
}

export function realtimeRun (params) {
  return axios({
    method: 'post',
    url: `${urlPrefix}realtime`,
    data: params
  })
}

export function findPlanById (id) {
  return axios({
    method: 'get',
    url: `${urlPrefix}` + `${id}`
  })
}

export function delPlanById (id) {
  return axios({
    method: 'delete',
    url: `${urlPrefix}` + `${id}`
  })
}
