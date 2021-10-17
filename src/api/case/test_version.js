import { axios } from '@/utils/request'
const urlPrefix = 'case/v2/testVersion/'



export function getTestVersionList (params) {
  console.log('in getTestVersionList function')
  return axios({
    method: 'post',
    url: `${urlPrefix}getTestVersionList`,
    data: params
  })
}

export function testVersionAddOrModify (params) {
  console.log('in testVersionAddOrModify function')
  var url = `${urlPrefix}` + `${!params.test_version_id ? 'createTestVersion' : 'modifyTestVersion'}`
  return axios({
    method: 'post',
    url: url,
    data: params
  })
}

export function findTestVersionById (testVersionId) {
  console.log('in findTestVersionById function')
  return axios({
    method: 'get',
    url: `${urlPrefix}findTestVersionById/` + `${testVersionId}`
  })
}

export function deleteTestVersion (params) {
  return axios({
    method: 'post',
    url: `${urlPrefix}deleteTestVersion`,
    data: params
  })
}

