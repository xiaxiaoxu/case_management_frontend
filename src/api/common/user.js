import { axios } from '@/utils/request'
const urlPrefix = '/v1/'

/*
    获取所有人员信息
  */
export function getUserInfoList (parameter) {
  return axios({
    method: 'get',
    url: `${urlPrefix}user/list`,
    params: parameter
  })
}
  /*
    更新人员信息
  */
export function updateUserInfo (parameter) {
  return axios({
    method: 'post',
    url: `${urlPrefix}user/updateInfo/${parameter.id}`,
    data: parameter
  })
}
