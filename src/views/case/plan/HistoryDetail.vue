<template>
  <div>
    <a-card title="历史详情">
      <a-button slot="extra" class="button" @click="goback()">返回</a-button>
      <a-card :bordered="false">
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="48">
              <a-col :md="7" :sm="24" >
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
              <a-col :md="5" :sm="24" >
                <a-button type="primary" @click="getHistoryDetail">查询</a-button>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </a-card>
      <a-row :gutter="24">
        <a-col :md="24" :lg="12">
          <a-card type="inner" title="成功率占比情况">
            <v-chart v-if="dataLength !== 0" :options="this.successOptions" :autoresize="true" style="height:306px"></v-chart>
            <a-empty v-else description="暂无数据" :image="simpleImage" style="height:242px" />
          </a-card>
        </a-col>
        <a-col :md="24" :lg="12">
          <a-card type="inner" title="执行数据统计">
            <v-chart v-if="dataLength !== 0" :options="this.caseOptions" :autoresize="true" style="height:306px"></v-chart>
            <a-empty v-else description="暂无数据" :image="simpleImage" style="height:242px" />
          </a-card>
        </a-col>
      </a-row>
      <a-card style="margin-top: 16px;" type="inner" title="数据" >
        <a-table :columns="columns" :data-source="data" rowKey="id">
          <template slot="successRadio" slot-scope="text, record">
            {{ record.success|percent(record.total) }}%
          </template>
          <template slot="stateConvert" slot-scope="text, record">
            {{ record.state|stateFilter }}
          </template>
          <template slot="operation" slot-scope="text, record">
            <a class="active" @click="() => reportUrl(record.id,record.project,record.category)">测试报告</a>
          </template>
        </a-table>
      </a-card>
    </a-card>
  </div>
</template>
<script>
import { Empty } from 'ant-design-vue';
import { reportPlanList } from '@/api/case/report'
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/toolbox'
import moment from 'moment'
const nowDate = new Date()
const startDate = moment(new Date(nowDate.getFullYear(), nowDate.getMonth() - 1, nowDate.getDate()))
const endDate = moment()
const columns = [
  {
    title: '创建时间',
    dataIndex: 'created_time',
    key: 'created_time',
    customRender: (text, row, index) => {
      if (!text) {
        return '--';
      }
      return text;
    }
  },
  {
    title: '执行人',
    dataIndex: 'user_name_cn',
    key: 'user_name_cn'
  },
  {
    title: '执行总数',
    dataIndex: 'total',
    key: 'total'
  },
  {
    title: '执行成功数',
    dataIndex: 'success',
    key: 'success'
  },
  {
    title: '执行失败数',
    dataIndex: 'failure',
    key: 'failure'
  },
  {
    title: '成功率',
    dataIndex: 'successRadio',
    scopedSlots: { customRender: 'successRadio' }
  },
  {
    title: '状态',
    dataIndex: 'state',
    scopedSlots: { customRender: 'stateConvert' }
  },
  {
    title: '测试报告',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' }
  }
];
const stateMap = {
  'notStart': '未开始',
  'running': '运行中',
  'end': '结束',
  '': '未开始'
}
export default {
  name: 'PlanHistoryDetail',
  components: {
    'v-chart': ECharts
  },
  data () {
    return {
      columns,
      planId: 0,
      data: [],
      successRadioData: [],
      historyDateData: [],
      dateValue: [startDate, endDate],
      defaultDate: [],
      defaultPickerValue: [],
      rangeValues: {},
      successOptions: {},
      successNum: 0,
      failNum: 0,
      dataLength: 0,
      caseOptions: {},
      caseNum: []
    }
  },
  filters: {
    percent (val1, val2) {
      if (val2) {
        return ((val1 * 100) / val2).toFixed(2);
      }
      return 0
    },
    stateFilter (state) {
      return stateMap[state]
    }
  },
  beforeCreate () {
      this.simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;
    },
  created () {
    this.planId = this.$route.query.planId
    this.getHistoryDetail()
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
    getHistoryDetail () {
      var historyDateData = []
      var successRadioData = []
      const formData = []
      this.dateValue.forEach(item => {
        formData.push(item.format('YYYY-MM-DD'))
      })
      const params = {
        start_date: formData[0],
        end_date: formData[1],
        plan_id: this.planId
      }
      reportPlanList(params).then(res => {
        var successNum = 0
        var failNum = 0
        var caseNum = []
        const historyData = res.data
        this.dataLength = res.data.length
        this.data = res.data
        historyData.forEach(item => {
          historyDateData.push(item.created_time)
          successRadioData.push(this.countRadio(item.success, item.total))
          if (this.countRadio(item.success, item.total) > 0) {
            successNum += 1
          } else {
            failNum += 1
          }
        })
        caseNum.push({ value: successNum, name: '成功次数' })
        caseNum.push({ value: failNum, name: '失败次数' })
        this.caseNum = caseNum
        this.successNum = successNum
        this.historyDateData = historyDateData
        this.successRadioData = successRadioData
        this.getSuccessOptions()
        this.getCaseOptions()
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    getSuccessOptions () {
      this.successOptions = {
        toolbox: {
          show: true,
          feature: {
            saveAsImage: {}
          }
        },
        title: {
          text: '成功率'
        },
         xAxis: {
          type: 'category',
          data: this.historyDateData
        },
        yAxis: [
          {
            type: 'value'
          }
        ],
        tooltip: {
          trigger: 'axis',
          minInterval: 1
        },
        series: [{
            data: this.successRadioData,
            type: 'line'
        }],
        color: ['#14C393']
      }
    },
    getCaseOptions () {
      this.caseOptions = {
        tooltip: {
            trigger: 'item',
            formatter: '{b} : {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['成功次数', '失败次数']
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '60%',
            center: ['50%', '50%'],
            data: this.caseNum,
            label: {
              formatter: '{b}: {@2012}'
            },
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
          }
        ],
        color: ['#14C393', '#5D7092']
      }
    },
    goback () {
      this.$router.push({ name: 'planList' })
    },
    countRadio (val1, val2) {
      if (val2) {
        return ((val1 * 100) / val2).toFixed(2);
      }
      return 0
    },
    reportUrl (id, project, category) {
      if (category === 'API') {
       this.$router.push({
        name: 'reportDetail',
        query: { reportId: id, project: project }
      })
     } else {
       this.$router.push({
        name: 'reportOverview',
        query: { reportId: id, project: project }
      })
     }
    }
  }
}
</script>
