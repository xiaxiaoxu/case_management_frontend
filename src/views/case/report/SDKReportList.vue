<template>
  <div>
    <a-card title="测试设备报告列表" style="margin-top: 16px">
      <a-table :columns="columns" :data-source="data" rowKey="id" :loading="loading">
        <span slot="state" slot-scope="text">
          {{ text | stateFilter }}
        </span>
        <!-- <span slot="run_type" slot-scope="text">
          {{ text | runTypeFilter }}
        </span> -->
        <template slot="operation" slot-scope="text, record">
          <a class="active" @click="() => reportDetail(record)">查看报告</a>
          <!--<a-divider v-if="record.state=='running'" type="vertical"/>-->
          <!--<a v-if="record.state=='running'" @click="() => stopRun(record)">终止</a>-->
        </template>
      </a-table>
    </a-card>
  </div>
</template>
<script>
import moment from 'moment'
import { autoTestProjectList, autoTestCategoryList } from '@/api/case/setting'
import { reportList } from '@/api/case/report'
import { stopCase } from '@/api/case/case'
import * as statisticsApi from '@/api/common/statistics'
import SDKReportDetail from './SDKReportDetail'
const columns = [
  {
    title: '编号',
    dataIndex: 'id',
    key: 'id',
    scopedSlots: { customRender: 'id' }
  },
  {
    title: '执行设备',
    dataIndex: 'device_name',
    key: 'device_name'
  },
  {
    title: '设备udid',
    dataIndex: 'udid',
    key: 'udid',
    ellipsis: true
  },
  {
    title: '总用例数',
    dataIndex: 'case_numbers',
    key: 'case_numbers'
  },
  {
    title: '成功数',
    dataIndex: 'success_numbers',
    key: 'success_numbers'
  },
  {
    title: '失败数',
    dataIndex: 'fail_numbers',
    key: 'fail_numbers'
  },
  {
    title: '状态',
    dataIndex: 'state',
    key: 'state',
    scopedSlots: { customRender: 'state' }
  },
  {
    title: '执行时间',
    dataIndex: 'execute_time',
    key: 'execute_time'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' }
  }
];
const stateMap = {
  '0': {
    text: '已完成'
  },
  '1': {
    text: '未完成'
  }
}
// const runTypeMap = {
//   0: {
//     text: '立即执行'
//   },
//   1: {
//     text: '定时执行'
//   },
//   2: {
//     text: '在线调试'
//   }
// }
const nowDate = new Date()
const startDate = moment(new Date(nowDate.getFullYear(), nowDate.getMonth() - 1, nowDate.getDate()))
const endDate = moment()
export default {
  name: 'SDKReportList',
  props: { deviceReportsList: {
      type: Array,
      default () {
        return []
        }
      }
    },
  data () {
    return {
      columns,
      data: [],
      dateValue: [startDate, endDate],
      defaultDate: [],
      defaultPickerValue: [],
      rangeValues: {},
      projectList: [],
      categoryList: [],
      project: undefined,
      category: undefined,
      state: undefined,
      name: '',
      loading: true
    }
  },
  components: {
    SDKReportDetail
  },
  filters: {
    stateFilter (status) {
      return stateMap[status].text
    }
  },
  created () {
    this.data = this.deviceReportsList
    this.queryData()
    this.getProjectList()
    this.getCategoryList()
    this.setDefaultDate()
    this.setRangeValue()
    this.addStatOverview()
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
    createPlan () {
      this.createFormVisible = true
    },
    changeCreateVisible () {
      this.createFormVisible = false
    },
    queryData () {
      const formData = []
      this.dateValue.forEach(item => {
        formData.push(item.format('YYYY-MM-DD'))
      })
      const params = {
        start_date: formData[0],
        end_date: formData[1],
        project: this.project,
        category: this.category,
        state: this.state,
        name: this.name
      }
      this.loading = true
      reportList(params).then(res => {
        // this.data = res.data
      }).catch(err => {
        this.$message.error(err.message)
      }).finally(() => {
          this.loading = false
      })
    },
    getProjectList () {
      autoTestProjectList().then(res => {
        this.projectList = res.data
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    getCategoryList () {
      autoTestCategoryList().then(res => {
        this.categoryList = res.data
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    reportDetail (record) {
      if (record.state !== '0') {
        this.$info({
          title: '提示',
          content: '该设备尚未运行结束，暂不能查看测试报告'
        });
        return
      }
      this.$router.push({
        // name: 'reportDetail',
        name: 'SDKReportDetail',
        query: { deviceReportId: record.id, project: record.project, reportId: record.report_id }
      })
    },
    stopRun (record) {
      console.log('record:', record)
      this.$confirm({
        title: '确定要终止测试计划吗?',
        onOk: () => {
          stopCase({ report_id: record.id }).then(res => {
              this.$message.success('终止成功!');
              this.queryData();
            })
            .catch(err => {
              this.$message.error(err);
            });
        },
        onCancel: () => {
          this.$message.info('已取消终止测试计划!')
        }
      })
    },
    addStatOverview () {
      const data = {
        'platform': 'case',
        'func': 'case_report'
      };
      statisticsApi.statOerviewAdd(data)
      .then(
        res => {
          console.log('add overview success')
        },
        error => {
          this.$message.error(`添加总览数据失败: ${error.message}`);
        }
      )
    }
  }
}
</script>
<style lang="less" scoped>
</style>

