<template>
  <a-card :bordered="false">
    <detail-list title="个人信息" :col="1">
      <detail-list-item term="昵称"> {{ userData.username }}</detail-list-item>
      <detail-list-item term="用户名"> {{ userData.user_name_cn }}</detail-list-item>
      <detail-list-item term="角色"> {{ roleName }}</detail-list-item>
      <detail-list-item term="邮箱"> {{ userData.email }}</detail-list-item>
    </detail-list>
  </a-card>
</template>

<script>
import { getInfo } from '@/api/common/login'
import store from '@/store'
import DetailList from '@/components/tools/DetailList'
const DetailListItem = DetailList.Item
const roleNames = {
  1: '管理员',
  2: '高级用户',
  3: '普通用户'
}

export default {
  name: 'UserInfo',
  components: {
    DetailList,
    DetailListItem
  },
  data () {
    return {
       userData: {},
       roleName: ''
    }
  },
  created () {
    this.getUserInfo()
  },
  methods: {
    getUserInfo () {
      getInfo({ userId: store.getters.userId }).then(res => {
        console.log('store.getters.userId:' + store.getters.userId)
        this.userData = res.data[0]
        console.log('this.userData:')
        console.log(this.userData)
        this.roleName = roleNames[res.data[0].part]
      }).catch(err => {
        this.$message.error(err.message)
      })
    }
  }
}
</script>
