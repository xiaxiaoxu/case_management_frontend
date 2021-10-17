<template>
  <div>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :md="7" :sm="24">
              <a-form-item label="日期">
                <a-range-picker
                  @change="handleChange"
                />
              </a-form-item>
            </a-col>
            <a-col :md="7" :sm="24">
              <a-form-item label="描述">
                <a-input allowClear v-model="feedbackComment" placeholder="输入描述"/>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-button type="primary" @click="getFeedbackList">查询</a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>
    <a-card
      style="margin-top: 24px"
      :bordered="false"
      title="反馈列表"
    >
      <a-table
        :columns="feedbackColumns"
        :data-source="feedbackList"
        :pagination="paginationData"
        rowKey="id"
        :loading="loading"
      >
      </a-table>
    </a-card>
  </div>
</template>

<script>
  import * as feedbackApi from '@/api/common/feedback'
  export default {
    data () {
      return {
        selectedDate: ['', ''],
        feedbackComment: '',
        paginationData: {
          current: 1,
          defaultCurrent: 1, // 默认当前页数
          defaultPageSize: 10, // 默认当前页显示数据的大小
          total: 0, // 总数，必须先有
          showSizeChanger: true,
          showQuickJumper: false,
          showTotal: (total) => `共 ${total} 条`, // 显示总数
          onShowSizeChange: (current, pageSize) => {
            this.paginationData.defaultCurrent = 1
            this.paginationData.defaultPageSize = pageSize
          },
          // 改变每页数量时更新显示
          onChange: (current) => {
            this.paginationData.defaultCurrent = current
          }
        },
        loading: false,
        feedbackColumns: [
          {
            title: '描述',
            dataIndex: 'comment',
            width: '40%'
          },
          {
            title: '联系方式',
            dataIndex: 'contact',
            width: '20%'
          },
          {
            title: '反馈人',
            dataIndex: 'creator_name',
            width: '20%',
            ellipsis: true
          },
          {
            title: '反馈时间',
            dataIndex: 'creation_time',
            width: '20%'
          }
        ],
        feedbackList: []
      }
    },
    created () {
      this.getFeedbackList()
    },
    methods: {
      handleChange (date, dateString) {
        this.selectedDate = dateString
      },
      getFeedbackList () {
        feedbackApi.getFeedback().then(res => {
          let feedbackList = res.data
          if (this.feedbackComment !== '' || this.selectedDate[0] !== '') {
            if (this.feedbackComment !== '') {
              feedbackList = feedbackList.filter(item => item.comment.indexOf(this.feedbackComment) >= 0)
            }
            if (this.selectedDate[0] !== '') {
              feedbackList = feedbackList.filter(item => item.creation_time >= this.selectedDate[0] && item.creation_time <= this.selectedDate[1])
            }
          }
          this.feedbackList = feedbackList
        });
      }
    }
  }
</script>
