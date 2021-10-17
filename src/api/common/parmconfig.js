import { axios } from '@/utils/request'
const urlPrefix = '/v1/'
export function addParm (params) {
    return axios({
      method: 'post',
      url: `${urlPrefix}parmconfig/add`,
      data: params
    })
  }
export function deleteParm (params) {
    return axios({
      method: 'delete',
      url: `${urlPrefix}parmconfig/${params.id}`
    })
  }
export function getParmConfigList (parameter) {
  return axios({
    method: 'get',
    url: `${urlPrefix}parmconfig/list`
  })
}
