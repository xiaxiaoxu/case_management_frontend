import { axios } from '@/utils/request'
const urlPrefix = '/v1/'

export function getIpInfo (parameter) {
  return axios({
    method: 'get',
    url: `${urlPrefix}tool/ip`,
    params: parameter
  })
}
