<template>
  <div>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="时间">
                <a-range-picker
                  :value="dateValue"
                  :ranges="rangeValues"
                  :placeholder="defaultDate"
                  :defaultPickerValue="defaultPickerValue"
                  @panelChange="handlePanelChange"
                  @change="handleChange"
                />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="通知内容">
                <a-input allowClear v-model="content" placeholder="请输入通知内容"/>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="接收人">
                <a-input allowClear v-model="receiver" placeholder="请输入接收人"/>
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="24">
              <a-button type="primary" @click="queryData">查询</a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>
    <a-table :columns="columns" :data-source="data" rowKey="id">
      <div slot="notice_content" slot-scope="text" v-html="text"> {{ text }}</div>
    </a-table>
  </div>
</template>
<script>
import moment from 'moment'
import { adminList } from '@/api/common/notice'
const columns = [
  {
    title: '编号',
    dataIndex: 'id',
    key: 'id',
    scopedSlots: { customRender: 'id' },
    width: '10%'
  },
  {
    title: '时间',
    dataIndex: 'created_time',
    key: 'created_time',
    width: '10%'
  },
  {
    title: '通知内容',
    dataIndex: 'notice_content',
    key: 'notice_content',
    scopedSlots: { customRender: 'notice_content' }
  },
  {
    title: '接收人',
    dataIndex: 'notice_receivers',
    key: 'notice_receivers',
    ellipsis: true,
    width: '10%'
  },
  {
    title: '渠道',
    dataIndex: 'channels',
    key: 'channels ',
    width: '10%'
  },
  {
    title: '发送平台',
    dataIndex: 'platform',
    key: 'platform',
    width: '10%'
  },
  {
    title: '告警结果',
    dataIndex: 'warning_result',
    key: 'warning_result',
    width: '10%'
  }
];

const nowDate = new Date()
const startDate = moment(new Date(nowDate.getFullYear(), nowDate.getMonth() - 1, nowDate.getDate()))
const endDate = moment()
export default {
  name: 'AdminNoticeList',
  data () {
    return {
      data: [],
      dateValue: [startDate, endDate],
      defaultDate: [],
      defaultPickerValue: [],
      rangeValues: {},
      content: '',
      receiver: '',
      columns
    }
  },
  created () {
    this.setDefaultDate()
    this.setRangeValue()
    this.queryData()
  },
  methods: {
    moment,
    setDefaultDate () {
      this.defaultDate.push(startDate.format('YYYY-MM-DD'))
      this.defaultDate.push(endDate.format('YYYY-MM-DD'))
      this.defaultPickerValue.push(startDate)
      this.defaultPickerValue.push(endDate)
    },
    setRangeValue () {
      const nowDate = new Date()
      let startDate = ''
      const valueDict = {}
      startDate = moment().subtract(7, 'days')
      valueDict['最近7天'] = [startDate, moment()]
      startDate = moment(new Date(nowDate.getFullYear(), nowDate.getMonth() - 2, nowDate.getDate()))
      valueDict['最近二月'] = [startDate, moment()]
      startDate = moment(new Date(nowDate.getFullYear(), nowDate.getMonth() - 3, nowDate.getDate()))
      valueDict['最近三月'] = [startDate, moment()]
      this.rangeValues = valueDict
    },
    handleChange (value) {
        this.dateValue = value
    },
    handlePanelChange (value, mode) {
      this.dateValue = value
      this.mode = [mode[0] === 'date' ? 'month' : mode[0], mode[1] === 'date' ? 'month' : mode[1]]
    },
    queryData () {
      const formData = []
      this.dateValue.forEach(item => {
        formData.push(item.format('YYYY-MM-DD'))
      })
      const params = {
        start_date: formData[0],
        end_date: formData[1],
        content: this.content,
        receiver: this.receiver
      }
      adminList(params).then(res => {
        this.data = res.data.list
      }).catch(err => {
          this.$message.error(`${err.message}`)
        })
    }
  }
}
</script>
