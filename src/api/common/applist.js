import { axios } from '@/utils/request'
const urlPrefix = '/api/v1/'
/**
 * getApplicationData func
 * parameter: {}
 * @param parameter
 * @returns {*}
 * description: 获取应用数据列表
 */
export function getApplicationData (parameter) {
  return axios({
    method: 'get',
    url: `${urlPrefix}application/datalist`,
    params: parameter
  })
}
/**
 * updateApplicationData func
 * parameter: {
 *   id: 应用id，新增填空，修改填当前应用id
 *   name: 应用名称
 *   project: 项目名称
 *   producter: 产品
 *   developer: 开发
 *   tester: 测试
 *   appKey: appKey
 *   appSecret: appSecret
 *   remark: remark
 *   userId: 用户id
 * }
 * @param parameter
 * @returns {*}
 * description: 更新应用
 */
export function updateApplicationData (parameter) {
  return axios({
    method: 'post',
    url: `${urlPrefix}application/update/data`,
    data: parameter
  })
}
/**
 * deleteApplicationData func
 * parameter: {
 *   id: 应用id
 * }
 * @param parameter
 * @returns {*}
 * description: 删除应用
 */
export function deleteApplicationData (parameter) {
  return axios({
    method: 'get',
    url: `${urlPrefix}application/del/data`,
    params: parameter
  })
}
