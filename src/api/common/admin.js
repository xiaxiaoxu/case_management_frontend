import { axios } from '@/utils/request'
const urlPrefix = '/api/v1/'
export default {
    getAPKs (params) {
        return axios({
            method: 'get',
            url: `${urlPrefix}installapkinfo`,
            params: params
        })
    },
    // 获取全部安装包
    getallapk (params) {
        return axios({
            method: 'get',
            url: `${urlPrefix}admin/apkinfo`,
            params: params
        })
    },
    // 删除安装包
    delapk (apkid) {
        return axios({
            method: 'delete',
            url: `${urlPrefix}admin/apkinfo/${apkid}`,
            dataType: 'json'
        })
    },
    // 获取全部设备信息
    getdevceinfo () {
        return axios({
            method: 'get',
            url: `${urlPrefix}admin/borrow`
        })
    },
    // 借出设备
    borrowhandler (params) {
        return axios({
            method: 'post',
            url: `${urlPrefix}admin/borrow`,
            data: params
        })
    },
    // 归还设备
    returnhandler (params) {
        return axios({
            method: 'delete',
            url: `${urlPrefix}admin/borrow`,
            data: params
        })
    },
    getAllUsers () {
        return axios({
          method: 'get',
          url: '/v1/user/list'
        })
      },
    // 获取全部设备借用工单
    getAlldeviceOrder () {
        return axios({
            method: 'get',
            url: '/api/v2/admin/borrow'
          })
    },
    // 审批工单
    updateOrder (params) {
        return axios({
            method: 'put',
            url: '/api/v2/admin/borrow',
            data: params
        })
    }
}
