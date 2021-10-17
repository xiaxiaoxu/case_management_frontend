<template>
  <a-card title="通知详情" >
    <a slot="extra" @click="goback">返回</a>
    <div class="project-item">
      <span class="extra">创建于：{{ notice.created_time }}</span>
      <span class="extra">渠道：{{ notice.channels }}</span>
    </div>
    <a-card-meta>
      <div slot="description" class="card-description" v-html="notice.content">
        {{ notice.content }}
      </div>
    </a-card-meta>
  </a-card>
</template>
<script>
import { noticeDetail, updateReadState } from '@/api/common/notice'
import bus from '@/utils/bus'
export default {
  name: 'NoticeDetail',
  data () {
    return {
      noticeId: '',
      notice: {}
    }
  },
  computed: {
    username () {
      return this.$store.getters.username
    }
  },
  created () {
    this.noticeId = this.$route.query.noticeId
    this.updateNoticeReadState()
    this.noticeDetail()
  },
  methods: {
    noticeDetail () {
      const params = { username: this.username, noticeId: this.noticeId }
      noticeDetail(params).then(res => {
        this.notice = res.data
      })
    },
    updateNoticeReadState () {
      const params = { username: this.username, notice_id: this.noticeId }
      updateReadState(params).then(res => {
        bus.$emit('updateNoticeNum', '')
      })
    },
    goback () {
      this.$router.push({ name: 'noticeList' })
    }
  }
}
</script>
<style lang="less" scoped>
  .card-description {
    color: rgba(0, 0, 0, 0.65);
    margin-top: 16px;

  }
  .project-item {
      display: flex;
      margin-top: 8px;
      overflow: hidden;
      font-size: 14px;
      height: 20px;
      line-height: 20px;
      .extra {
        color: rgba(0, 0, 0, 0.45);
        margin-right: 5px;
      }
    }
</style>
