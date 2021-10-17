<template>
  <a-popover
    v-model="visible"
    trigger="click"
    placement="bottomRight"
    overlayClassName="header-notice-wrapper"
    :getPopupContainer="() => $refs.noticeRef.parentElement"
    :autoAdjustOverflow="true"
    :arrowPointAtCenter="true"
    :overlayStyle="{ width: '350px', top: '50px' }"
  >
    <template slot="content">
      <a-spin :spinning="loading">
        <a-list item-layout="horizontal" :data-source="data">
          <a-list-item slot="renderItem" slot-scope="item">
            <div style="overflow: hidden" v-html="item.notice_content">{{ item.notice_content }}</div>
          </a-list-item>
          <div v-if="data.length > 0" slot="footer">
            <a class="notice-bottom" @click="readAllNotice()">全部已读</a>
            <a-divider type="vertical" />
            <a class="notice-bottom" @click="viewMore()">查看更多</a>
          </div>
        </a-list>
      </a-spin>
    </template>
    <span @click="fetchNotice" class="header-notice" ref="noticeRef" style="padding: 0 14px">
      <a-badge :count="unreadNum" >
        <img src="~@/assets/header/notice.svg" />
      </a-badge>
    </span>
  </a-popover>
</template>

<script>
import { unReadList, unReadNum, readAll } from '@/api/common/notice'
import bus from '@/utils/bus'
export default {
  name: 'HeaderNotice',
  data () {
    return {
      loading: false,
      visible: false,
      unreadNum: 0,
      data: []
    }
  },
  computed: {
    username () {
      return this.$store.getters.username
    }
  },
  created () {
    this.getUnreadNum()
  },
  mounted () {
    // 用$on事件来接收参数
    bus.$on('updateNoticeNum', (data) => {
      this.getUnreadNum()
    })
  },
  methods: {
    fetchNotice () {
      if (!this.visible) {
        this.loading = true
        const params = { username: this.username }
        unReadList(params).then(res => {
          this.loading = false
          if (res.data.list.length > 5) {
            this.data = res.data.list.slice(0, 5)
          } else {
            this.data = res.data.list
          }
        })
      } else {
        this.loading = false
      }
      this.visible = !this.visible
    },
    getUnreadNum () {
      const params = { username: this.username }
      unReadNum(params).then(res => {
        this.unreadNum = res.data.num
      })
    },
    readAllNotice () {
      const params = { username: this.username }
      readAll(params).then(res => {
        this.$message.success('消息已清除')
        this.getUnreadNum()
        this.visible = false
      })
    },
    viewMore () {
      this.$router.push({ name: 'noticeList' })
    }
  }
}
</script>

<style lang="css">
  .header-notice-wrapper {
    top: 50px !important;
  }
</style>
<style lang="less" scoped>
  .header-notice{
    display: inline-block;
    transition: all 0.3s;

    span {
      vertical-align: initial;
    }
  }
  /deep/ .ant-scroll-number{
    margin:-4px;
    min-width: 15px;
  }
  .notice-bottom{
    width:50%;
    padding:0px 30px;
  }
</style>
