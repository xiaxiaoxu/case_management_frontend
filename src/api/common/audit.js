import { axios } from '@/utils/request'
const urlPrefix = '/api/v1/'
export function getDeviceByStatus (params) {
    /*
     获取项目下所有用户
     */
    return axios({
      method: 'get',
      url: `${urlPrefix}device/audit`,
      params: params
    })
  }
 export function auditDevice (params) {
    /*
     获取项目下所有用户
     */
    return axios({
      method: 'post',
      url: `${urlPrefix}device/audit`,
      data: params
    })
  }


