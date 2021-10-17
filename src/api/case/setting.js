import { axios } from '@/utils/request'
const urlPrefix = 'case/v1/setting/'
export function autoTestProjectList () {
  return axios({
    method: 'get',
    url: `${urlPrefix}project/list`
  })
}


export function getGitBranch (params) {
  return axios({
    method: 'post',
    url: `${urlPrefix}gitBranch`,
    data: params
  })
}


export function autoTestProjectById (id) {
  return axios({
    method: 'get',
    url: `${urlPrefix}project/` + `${id}`
  })
}

export function autoTestCategoryList () {
  return axios({
    method: 'get',
    url: `${urlPrefix}category/list`
  })
}
