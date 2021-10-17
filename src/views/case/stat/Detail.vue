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
            <a-col :md="2" :sm="24" style="padding-left:12px;padding-right:12px">
              <a-button type="primary" @click="queryData">查询</a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>

    <a-card :title="projectName">
      <a-row :gutter="24">
        <a-col :md="24" :lg="16">
          <a-card type="inner" title="成功率明细">
            <v-chart
              :autoresize="true"
              :options="lineSuccessOptions"
              ref="project_detail_line"
              style="width:100%;height: 400px;">
            </v-chart>
          </a-card>
        </a-col>

        <a-col :md="24" :lg="8">
          <a-card type="inner" title="成功率总览">
            <v-chart
              :autoresize="true"
              :options="pieSuccessOptions"
              ref="project_detail_pie"
              style="width:100%;height: 400px;">
            </v-chart>
          </a-card>
        </a-col>
      </a-row>
    </a-card>

    <a-card :title="listTitle" style="margin-top: 16px">
      <a-table :columns="columns" :data-source="data" rowKey="id" :loading="loading">
        <span slot="successRadio" slot-scope="text, record">
          {{ record | successRadioFilter }}
        </span>
      </a-table>
    </a-card>
  </div>
</template>
<script>
import moment from 'moment'
import ArrowContainer from '../../quality/common/ArrowContainer'
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/pie'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'
import { statDetail } from '@/api/case/stat'
const columns = [
  {
    title: '计划总数',
    dataIndex: 'count',
    key: 'count'
  },
  {
    title: '执行时间',
    dataIndex: 'exec_time',
    key: 'exec_time'
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
    dataIndex: 'fail',
    key: 'fail'
  },
  {
      title: '成功率',
      dataIndex: 'successRadio',
      scopedSlots: { customRender: 'successRadio' }
  }
];
// const nowDate = new Date()
var startDate = moment().subtract(14, 'days')
var endDate = moment()

export default {
  name: 'ReportList',
  data () {
    return {
      columns,
      data: [{ 'fail': 0, 'name': 'jcache', 'exec_time': '2020-11-24', 'success': 1, 'total': 1 }],
      dateValue: [startDate, endDate],
      defaultDate: [],
      defaultPickerValue: [],
      rangeValues: {},
      name: '',
      project_id: 0,
      projectName: '',
      loading: true,
      listTitle: '项目数据',
      projectOptions: {},
      lineSuccessRadio: '对应项目每天的成功率',
      pieSuccessRadio: '对应项目总体的成功率和失败率',
      successRadio: 0,
      // 项目总的成功数
      all_success: 0,
      // 项目总的失败数
      all_fail: 0,
      // 这这里必须先设置默认值
      projectNameList: [],
      // 定义project项目总用例数的数据
      pieSuccessOptions: {
          title: {
            text: '项目累计成功率',
            left: 'center'
          },
          color: ['#14C393', '#5D7092'],
          tooltip: {
            trigger: 'item',
            // formatter: '{b} : {d}%'
            formatter: function (params) {
                  // console.log(params)
                  if (params.data.name === '成功率') {
                    return params.data.name + ':' + params.data.value + '%' + '<br />' + '成功数:' + params.data.success;
                  }
                  if (params.data.name === '失败率') {
                    return params.data.name + ':' + params.data.value + '%' + '<br />' + '失败数:' + params.data.fail;
                  }
                }

          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: ['成功率', '失败率']
          },
          series: [
            {
              name: '项目列表',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: [],
              label: {
                // formatter: '{b}: {@2012}'
                formatter: '{b} : {d}%'
              },
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        },
        lineSuccessOptions: {
          title: {
            text: '单天执行成功率'
          },
          color: ['#37CCA3'],
          tooltip: {
            trigger: 'axis',
            formatter: function (params) {
              const item = params[0];
              // console.log(item);
              return item.name + '<br />' + '总用例数:' + item.data.total + '<br />' + '成功用例数:' + item.data.success + '<br />' + '成功率:' + item.data.value + '%';
              },
            axisPointer: {
              type: 'cross',
              label: {
                // backgroundColor: '#6a7985'
              }
            }
          },
          legend: {
            data: ['成功率']
          },
          grid: {
            left: '2%',
            right: '5.5%',
            bottom: '2%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              data: [],
              axisLabel: {
                // 这里的两个属性一个是保证横坐标显示完全，另外一个是以一定角度展示，避免显示的标签挤在一起
                // interval: 0,
                rotate: 30
              }
            }
          ],
          yAxis: [
            {
              type: 'value'
              // minInterval: 1
            }
          ],
          series: [
            {
              name: '成功率',
              type: 'line',
              // stack: '总量',
              // areaStyle: {},
              data: []
            }
          ]
        }
    }
  },
  components: {
    'ArrowContainer': ArrowContainer,
    'v-chart': ECharts
  },
  filters: {
    successRadioFilter (record) {
      return (record.success * 100 / record.total).toFixed(2) + '%'
    }
  },
  created () {
    this.projectId = this.$route.query.projectId
    this.projectName = this.$route.query.projectName + '项目'
    this.successRadio = this.$route.query.successRadio
    this.setDefaultDate()
    this.setRangeValue()
  },
  mounted () {
    // this.getProjectList()
    this.queryData()
    this.setPieData()
  },
  methods: {
    moment,
    setDefaultDate () {
    //  console.log(this.$route.query.start_date)
      if (this.$route.query.start_date.length !== 0) {
          startDate = moment(this.$route.query.start_date + ' 00:00:00')
      }

      if (this.$route.query.end_date.length !== 0) {
          endDate = moment(this.$route.query.end_date + ' 23:59:59')
      }
    //   console.log(this.$route.query.end_date)

      // 重新初始化
      this.dateValue = [startDate, endDate]

      this.defaultDate.push(startDate.format('YYYY-MM-DD'))
      this.defaultDate.push(endDate.format('YYYY-MM-DD'))
      this.defaultPickerValue.push(startDate)
      this.defaultPickerValue.push(endDate)
      this.listTitle = '项目数据（' + this.dateValue[0].format('YYYY-MM-DD') + ' - ' + this.dateValue[1].format('YYYY-MM-DD') + '）'
    },
    setRangeValue () {
      const nowDate = new Date()
      let startDate = ''
      const valueDict = {}
      startDate = moment().subtract(14, 'days')
      valueDict['最近2周'] = [startDate, moment()]
      startDate = moment(new Date(nowDate.getFullYear(), nowDate.getMonth() - 1, nowDate.getDate()))
      valueDict['最近一月'] = [startDate, moment()]
      this.rangeValues = valueDict
    },
    handleChange (value) {
      this.dateValue = value
    },
    handlePanelChange (value, mode) {
      this.dateValue = value
    },
    createPlan () {
      this.createFormVisible = true
    },
    changeCreateVisible () {
      this.createFormVisible = false
    },
    setPieData () {
      var pieSeriesData = []
      pieSeriesData.push({ value: this.successRadio, name: '成功率', success: this.all_success });
      pieSeriesData.push({ value: (100 - this.successRadio).toFixed(2), name: '失败率', fail: this.all_fail });
      this.pieSuccessOptions.series[0].data = pieSeriesData;
    },
    setLineData () {
        var lineData = []
        var lineSeriesData = []
        for (var i = (this.data.length - 1); i > -1; i--) {
            lineData.push(this.data[i].exec_time)
            var successRadio = (this.data[i].success * 100 / this.data[i].total).toFixed(2)
            if (this.data[i].total === 0) {
              successRadio = 0
            }
            // lineSeriesData.push(successRadio)
            // 这里加入了一些自定义的值，折线图所取的值只有value字段
            var lineSeriesItem = { 'value': 0, 'success': 0, 'total': 0 }
            lineSeriesItem['value'] = successRadio;
            lineSeriesItem['success'] = this.data[i].success;
            lineSeriesItem['total'] = this.data[i].total;

            lineSeriesData.push(lineSeriesItem)
            // 计算总的成功数和失败数
            this.all_success += this.data[i].success;
            this.all_fail += this.data[i].fail;
        }
        this.lineSuccessOptions.xAxis[0].data = lineData
        this.lineSuccessOptions.series[0].data = lineSeriesData
    },
    queryData () {
      this.listTitle = '项目数据'
      const formData = []
      this.dateValue.forEach(item => {
        formData.push(item.format('YYYY-MM-DD'))
      })
      const params = {
        start_date: formData[0],
        end_date: formData[1],
        projectId: this.projectId
      }
      this.loading = true
      statDetail(params).then(res => {
        this.data = res.data.stat
        this.setLineData()
        this.setPieData()
      }).catch(err => {
        this.$message.error(err.message)
      }).finally(() => {
          this.loading = false
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
      this.$router.push({
        name: 'reportDetail',
        query: { reportId: record.id, project: record.project }
      })
    }
  }
}
</script>
<style lang="less" scoped>
</style>


<style lang="less" scoped>
  .project-detail {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    margin-top: 20px;
    width: 100%;

    .success-radio-detail {
      flex-direction: column;
      width: 59%;
    }

    .project-pie-detail {
      flex-direction: column;
      margin-left: 2%;
      width: 39%;
    }
  }
</style>
