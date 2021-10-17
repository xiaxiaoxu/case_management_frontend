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

    <div class="case-stat-list">
      <div class="total-list">
        <ArrowContainer head-text="自动化项目" :head-desc="totalCaseDesc">
          <div slot="content">
            <v-chart
              :autoresize="true"
              :options="totalCaseOptions"
              ref="requirement_projectinfo"
              style="width:100%;height: 400px;">
            </v-chart>
          </div>
        </ArrowContainer>
      </div>

      <div class="success-radio-detail">
        <ArrowContainer headText="成功率" :headDesc="successRadioDesc">
          <div slot="content">
            <v-chart
              :autoresize="true"
              :options="successRadioOptions"
              ref="requirement_assignee"
              style="width:100%;height: 400px;">
            </v-chart>
          </div>
        </ArrowContainer>
      </div>
    </div>
    <a-card :title="listTitle" style="margin-top: 16px">
      <a-table :columns="columns" :data-source="data" rowKey="id" :loading="loading">
        <span slot="successRadio" slot-scope="text, record">
          {{ record | successRadioFilter }}
        </span>
        <template slot="operation" slot-scope="text, record">
          <a class="active" @click="() => statDetail(record)">查看详情</a>
          <!--<a-divider v-if="record.state=='running'" type="vertical"/>-->
          <!--<a v-if="record.state=='running'" @click="() => stopRun(record)">终止</a>-->
        </template>
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
import { statList } from '@/api/case/stat'
import { autoTestProjectList } from '@/api/case/setting'
const columns = [
  {
    title: '项目编号',
    dataIndex: 'project_id',
    key: 'project_id',
    scopedSlots: { customRender: 'project_id' }
  },
  {
    title: '项目名称',
    dataIndex: 'name',
    key: 'name'
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
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' }
  }
];
// const nowDate = new Date()
const startDate = moment().subtract(14, 'days')
const endDate = moment()
export default {
  name: 'ReportList',
  data () {
    return {
      columns,
      data: [{ 'fail': 0, 'name': 'jcache', 'project_id': 7, 'success': 1, 'total': 1 }],
      dateValue: [startDate, endDate],
      defaultDate: [],
      defaultPickerValue: [],
      rangeValues: {},
      name: '',
      loading: true,
      listTitle: '项目数据',
      projectOptions: {},
      totalCaseDesc: '各项目的执行用例总数累加',
      successRadioDesc: '各项目的指定时间内累计成功率',
      // 这这里必须先设置默认值
      projectNameList: ['dmp', 'iapp', 'portal', 'janalytics', 'jcache', 'jmessage', 'jmlink', 'jmqs', 'jpush', 'jsms', 'jverification', 'pricloud', 'sdk', 'ad-hdt', 'ad-push'],
      // 定义project项目总用例数的数据
      totalCaseOptions: {
          title: {
            text: '各项目总数分布',
            left: 'center'
          },
          color: ['#5B8FF9', '#BBDEDE', '#5D7092', '#FFE0C7', '#F6BD16', '#DECFEA', '#E86452', '#D3EEF9', '#6DC8EC',
            '#F8D0CB', '#945FB9', '#FCEBB9', '#FF9845', '#CED4DE', '#1E9493', '#CDDDFD'],
          tooltip: {
            trigger: 'item',
            formatter: '{b} : {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: []
          },
          series: [
            {
              name: '项目列表',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: [],
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
          ]
        },
        successRadioOptions: {
          title: {
            text: '成功率'
          },
          color: ['#37CCA3'],
          tooltip: {
            trigger: 'axis',
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
              // boundaryGap: false,
              data: [],
              axisLabel: {
                // 这里的两个属性一个是保证横坐标显示完全，另外一个是以一定角度展示，避免显示的标签挤在一起
                interval: 0,
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
              type: 'bar',
              stack: '总量',
              areaStyle: {},
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
    this.setDefaultDate()
    this.setRangeValue()
    this.getProjectList()
  },
  mounted () {
    // this.getProjectList()
    this.queryData()
  },
  methods: {
    moment,
    setDefaultDate () {
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
    // 用例总数图表数据填充
    getProjectCaseTotal () {
      // 临时存放实际的数据值变量
      var seriesData = []
      const nameList = this.projectNameList
      // 检查没有数据的project，设置默认值为
      for (var x = 0; x < nameList.length; x++) {
        for (var k = 0; k < this.data.length; k++) {
          if (nameList[x] === this.data[k].name) {
            // console.log('x=' + x)
            seriesData.push({ value: this.data[k].total, name: this.data[k].name })
          }
        }
        if (seriesData.length !== (x + 1)) {
          seriesData.push({ value: 0, name: nameList[x] })
        }
      }
      // console.log(seriesData)
      this.totalCaseOptions.series[0].data = seriesData
    },
    getProjectCaseRadio () {
      var seriesData = []
      const nameList = this.projectNameList
      for (var x = 0; x < nameList.length; x++) {
        for (var k = 0; k < this.data.length; k++) {
          if (nameList[x] === this.data[k].name) {
            var radio = (this.data[k].success * 100 / this.data[k].total).toFixed(2)
            seriesData.push(radio)
          }
        }
        // 这里如果对应的项目在api中未返回，设置默认值
        if (seriesData.length !== x + 1) {
          seriesData.push(0.00)
        }
      }
      this.successRadioOptions.series[0].data = seriesData
    },
    queryData () {
      this.listTitle = '项目数据（' + this.dateValue[0].format('YYYY-MM-DD') + ' - ' + this.dateValue[1].format('YYYY-MM-DD') + '）'
      const formData = []
      this.dateValue.forEach(item => {
        formData.push(item.format('YYYY-MM-DD'))
      })
      const params = {
        start_date: formData[0],
        end_date: formData[1],
        name: this.name
      }
      this.loading = true
      statList(params).then(res => {
        this.data = res.data
        // 如果获取道数据，然后开始绘制图表
        this.getProjectCaseTotal()
        this.getProjectCaseRadio()
      }).catch(err => {
        this.$message.error(err.message)
      }).finally(() => {
          this.loading = false
      })
    },
    getProjectList () {
      autoTestProjectList().then(res => {
        const projectInfo = res.data
        const nameList = []
        for (var i = 0; i < projectInfo.length; i++) {
          nameList.push(projectInfo[i].name)
        }
        this.totalCaseOptions.legend.data = nameList
        this.projectNameList = nameList
        this.successRadioOptions.xAxis[0].data = this.projectNameList
      }).catch(err => {
        this.$message.error(err.message)
      }).finally(() => {
      })
    },
    statDetail (record) {
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
        name: 'statDetail',
        query: { start_date: this.dateValue[0].format('YYYY-MM-DD'),
        end_date: this.dateValue[1].format('YYYY-MM-DD'),
        projectId: record.project_id,
        projectName: record.name,
        successRadio: (record.success * 100 / record.total).toFixed(2)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
</style>


<style lang="less" scoped>
  .case-stat-list {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    margin-top: 20px;
    width: 100%;

    .total-list {
      flex-direction: column;
      width: 49%;
    }

    .success-radio-detail {
      flex-direction: column;
      margin-left: 2%;
      width: 49%;
    }
  }
</style>
