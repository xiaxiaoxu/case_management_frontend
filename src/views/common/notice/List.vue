<template>
  <a-card title="通知列表" :bordered="false">
    <a-list item-layout="vertical" size="large" :pagination="pagination" :data-source="listData">
      <a-list-item slot="renderItem" key="item.title" slot-scope="item">
        <a-badge v-if="item.state === 0" dot/>
        <a class="notice" @click="detail(item.id)" v-html="item.notice_content">{{ item.notice_content }}</a>
        <span slot="actions" style="padding: 0px 10px;">创建于： {{ item.created_time }}</span>
        <span slot="actions" style="padding: 0px 10px;">渠道： {{ item.channels }}</span>
      </a-list-item>
    </a-list>
  </a-card>
</template>
<script>
import { userAllList } from '@/api/common/notice'
export default {
  name: 'NoticeList',
  data () {
    return {
      listData: [],
      pagination: {
        onChange: page => {
          console.log('page:', page);
        },
        pageSize: 10
      }
    }
  },
  computed: {
    username () {
      return this.$store.getters.username
    }
  },
  created () {
    this.allNoitceList()
  },
  methods: {
    allNoitceList () {
      const params = { username: this.username }
      userAllList(params).then(res => {
        this.listData = res.data.list
      })
    },
    detail (noticeId) {
      this.$router.push({ name: 'noticeDetail', query: { noticeId: noticeId } })
    }
  }
}
</script>
<style lang="less" scoped>
  .notice{
    padding:0px 10px;
    color:rgba(0, 0, 0, 0.65);
  }
  /deep/ .ant-list-vertical .ant-list-item{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
