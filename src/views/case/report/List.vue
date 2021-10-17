<template>
  <div>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="7" :sm="24" style="padding-left:12px;padding-right:12px">
              <a-form-item label="创建时间">
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
            <a-col :md="4" :sm="24" style="padding-left:12px;padding-right:12px">
              <a-form-item label="项目">
                <a-select v-model="project" placeholder="请选择项目" allowClear>
                  <a-select-option v-for="item in projectList" :key="item.id" :value="item.name">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <!-- <a-col :md="3" :sm="24" style="padding-left:12px;padding-right:12px">
              <a-form-item label="类型">
                <a-select v-model="category" placeholder="请选择" allowClear >
                  <a-select-option v-for="item in categoryList" :key="item.id" :value="item.name">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col> -->
            <a-col :md="3" :sm="24" style="padding-left:12px;padding-right:12px">
              <a-form-item label="状态">
                <a-select v-model="state" placeholder="请选择" allowClear >
                  <a-select-option value="notStart">未开始</a-select-option>
                  <a-select-option value="running">运行中</a-select-option>
                  <a-select-option value="end">结束</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="5" :sm="24" style="padding-left:12px;padding-right:12px">
              <a-form-item label="名称">
                <a-input allowClear v-model="name" placeholder="请输入"/>
              </a-form-item>
            </a-col>
            <a-col :md="2" :sm="24" style="padding-left:12px;padding-right:12px">
              <a-button type="primary" @click="queryData">查询</a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>
    <a-card title="测试报告" style="margin-top: 16px">
      <a-table :columns="columns" :data-source="data" rowKey="id" :loading="loading">
        <span slot="state" slot-scope="text">
          {{ text | stateFilter }}
        </span>
        <span slot="run_type" slot-scope="text">
          {{ text | runTypeFilter }}
        </span>
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
const columns = [
  {
    title: '编号',
    dataIndex: 'id',
    key: 'id',
    scopedSlots: { customRender: 'id' }
  },
  {
    title: '项目',
    dataIndex: 'project',
    key: 'project'
  },
  {
    title: '执行脚本',
    dataIndex: 'scripts',
    key: 'scripts',
    ellipsis: true
  },
  {
    title: '总用例数',
    dataIndex: 'total',
    key: 'total'
  },
  {
    title: '成功数',
    dataIndex: 'success',
    key: 'success'
  },
  {
    title: '失败数',
    dataIndex: 'failure',
    key: 'failure'
  },
  {
    title: '状态',
    dataIndex: 'state',
    key: 'state',
    scopedSlots: { customRender: 'state' }
  },
  {
    title: '执行类型',
    dataIndex: 'run_type',
    key: 'run_type',
    scopedSlots: { customRender: 'run_type' }
  },
  {
    title: '名称',
    dataIndex: 'planName',
    key: 'planName'
  },
  {
    title: '执行者',
    dataIndex: 'user_name_cn',
    key: 'user_name_cn '
  },
  {
    title: '创建时间',
    dataIndex: 'created_time',
    key: 'created_time'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' }
  }
];
const stateMap = {
  'notStart': {
    status: 'notStart',
    text: '未开始'
  },
  'running': {
    status: 'running',
    text: '运行中'
  },
  'end': {
    status: 'end',
    text: '结束'
  }
}
const runTypeMap = {
  0: {
    text: '立即执行'
  },
  1: {
    text: '定时执行'
  },
  2: {
    text: '在线调试'
  }
}
const nowDate = new Date()
const startDate = moment(new Date(nowDate.getFullYear(), nowDate.getMonth() - 1, nowDate.getDate()))
const endDate = moment()
export default {
  name: 'ReportList',
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
  filters: {
    stateFilter (type) {
      return stateMap[type].text
    },
    runTypeFilter (type) {
      return runTypeMap[type].text
    }
  },
  created () {
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
        this.data = res.data
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
      /*
      if (record.state !== 'end') {
        this.$info({
          title: '提示',
          content: '该测试尝未运行结束，暂不能查看测试报告'
        });
        return
      }
      */
     console.log('record:')
     console.log(record)
     if (record.category === 'API') {
       this.$router.push({
        name: 'reportDetail',
        query: { reportId: record.id, project: record.project }
      })
     } else {
       this.$router.push({
        name: 'reportOverview',
        query: { reportId: record.id, project: record.project }
      })
     }
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
      );
    }
  }
}
</script>
<style lang="less" scoped>
</style>

