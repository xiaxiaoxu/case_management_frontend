import { axios } from '@/utils/request'
const urlPrefix = 'case/v1/stat/'

export function statList (params) {
  return axios({
    method: 'get',
    url: `${urlPrefix}list`,
    params: params
  })
}

export function statDetail (params) {
    // console.log(params)
    return axios({
      method: 'get',
      url: `${urlPrefix}` + params.projectId,
      params: params
    })
  }
