import { axios } from '@/utils/request'
const urlPrefix = 'case/v1/daystat/'

export function daystatList (params) {
  return axios({
    method: 'get',
    url: `${urlPrefix}list`,
    params: params
  })
}
