<template>
  <div>
    <a-card title="报告详情">
      <a-button slot="extra" class="button" @click="goback()">返回</a-button>
      <a-row :gutter="24">
        <a-col :md="24" :lg="16">
          <a-card type="inner" title="用例执行情况">
            <span slot="extra">状态：{{ report.state|stateFilter }}</span>
            <v-chart :options="caseOptions" :autoresize="true" style="height:276px"></v-chart>
          </a-card>
        </a-col>
        <a-col :md="24" :lg="8">
          <a-card type="inner" title="用例执行数据" :bodyStyle="{ height: '308px'}">
            <div class="case-data">执行设备:  {{ report.device_name }}</div>
            <div class="case-data">用例总数:  {{ report.case_numbers }}</div>
            <div class="case-data">用例成功数:  {{ report.success_numbers }}</div>
            <div class="case-data">用例失败数:  {{ report.fail_numbers }}</div>
            <div class="case-data">用例成功率:  {{ successRadio }}%</div>
            <div class="case-data">运行开始时间:  {{ report.start_time }}</div>
            <div class="case-data">运行结束时间:  {{ report.end_time }}</div>
            <div class="case-data">运行时长:  {{ runDuration }} </div>
            <div v-if="report.reasons" class="case-data">未开始原因：
              <ellipsis :length="70">{{ report.reasons }}</ellipsis>
            </div>
          </a-card>
        </a-col>
      </a-row>
      <a-card class="report-log" style="margin-top:16px">
        <a-tabs default-active-key="1">
          <a-tab-pane key="1" tab="测试报告">
            <iframe :src="logSrc" id="deviceReportLog" width="100%" height="500px" scrolling="yes"></iframe>
          </a-tab-pane>
          <a-tab-pane key="2" tab="运行日志">
            <a-textarea
              v-model="logInfo"
              placeholder="result"
              :rows="23"
              id="logInfoTextarea"
            />
          </a-tab-pane>
          <a-button slot="tabBarExtraContent" class="button" @click="download()">
            下载测试报告
          </a-button>
        </a-tabs>
      </a-card>
    </a-card>
  </div>
</template>
<script>
import { Ellipsis } from '@/components'
import { deviceReportDetail, reportExport, deviceRunLog } from '@/api/case/report'
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/pie'
const apiUrl = `${process.env.VUE_APP_API_BASE_URL}`
const stateMap = {
  '0': '已完成',
  '1': '未完成',
  '': '未开始'
}
export default {
  name: 'SDKReportDetail',
  components: {
    'v-chart': ECharts,
    Ellipsis
  },
  data () {
    return {
      deviceReportId: 0,
      reportDetail: '',
      reportId: 0,
      report: '',
      deivceInfo: '',
      deviceReportsList: [],
      caseNum: [],
      caseOptions: {},
      successRadio: 0,
      logSrc: '',
      runDuration: '00:00:00',
      logInfo: ''
    }
  },
  created () {
    this.deviceReportId = this.$route.query.deviceReportId
    this.reportId = this.$route.query.reportId
    console.log('this.deviceReportId')
    console.log(this.deviceReportId)
    console.log('this.reportId in sdk detail')
    console.log(this.reportId)
    this.getDeviceReportInfo()
    // this.getReportDetail()
    this.getCaseOptions()
    this.logSrc = apiUrl + '/case/v1/report/deviceLog/' + this.deviceReportId + '/report.html'
    this.getLogInfo()
  },
  filters: {
    stateFilter (state) {
      return stateMap[state]
    }
  },
  methods: {
    getDeviceReportInfo () {
      deviceReportDetail(this.deviceReportId).then(res => {
        const report = res.data.device_report_detail
        this.report = report
        const deivceInfo = report
        this.deivceInfo = deivceInfo
        const deviceReportsList = deivceInfo.device_reports_list
        this.deviceReportsList = deviceReportsList
        console.log('this.deviceReportsList')
        console.log(this.deviceReportsList)
        this.caseNum.push({ value: report.success_numbers, name: '成功用例数' })
        this.caseNum.push({ value: report.fail_numbers, name: '失败用例数' })
        // 计算成功比率
        if (report.case_numbers > 0) {
          this.successRadio = (report.success_numbers * 100 / report.case_numbers)
        }
        // 运行时长
        if (report.start_time && report.end_time) {
          this.countRunTime(report.start_time, report.end_time)
        }
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // getReportDetail () {
    //   reportDetail(this.reportId).then(res => {
    //     const report = res.data.report
    //     this.report = report
    //     this.caseNum.push({ value: report.success, name: '成功用例数' })
    //     this.caseNum.push({ value: report.failure, name: '失败用例数' })
    //     // 计算成功比率
    //     if (report.total > 0) {
    //       this.successRadio = (report.success * 100 / report.total).toFixed(2)
    //     }
    //     // 运行时长
    //     if (report.start_time && report.end_time) {
    //       this.countRunTime(report.start_time, report.end_time)
    //     }
    //   }).catch(err => {
    //     this.$message.error(err.message)
    //   })
    // },
    getCaseOptions () {
      this.caseOptions = {
        title: {
          text: '用例分布',
          left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{b} : {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['成功用例数', '失败用例数']
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
      // this.$emit('reportList')
      this.$router.push({ name: 'reportOverview',
          query: { reportId: this.reportId }
        })
    },
    download () {
      if (this.report.state !== 'end') {
        this.$message.error('该测试报告尚未运行结束，不能下载')
        return
      }
      reportExport(this.reportId).then(res => {
        const filename = res.data.filename
        const url = apiUrl + '/case/v1/report/download/' + this.reportId + '/' + filename
        const evt = document.createEvent('HTMLEvents')
        evt.initEvent('click', false, false)
        const link = document.createElement('a');
        link.href = url
        link.target = '_blank'
        link.style.display = 'none'
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(link.href)
        document.body.removeChild(link);
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    getLogInfo () {
      const data = {
        device_report_id: this.deviceReportId
      }
     // 获取subprocess上运行日志信息
     deviceRunLog(data).then(res => {
        if (res.data.content !== undefined) {
          this.logInfo = res.data.content
        }
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    countRunTime (startTime, endTime) {
      const startDate = new Date(startTime);
      const endDate = new Date(endTime);
      const intervalTime = endDate - startDate
      const second = 1000
      const minute = 60 * second
      const hour = 60 * minute
      // 计算出小时数
      var hours = Math.floor(intervalTime / hour)
      var hourMod = intervalTime % (hour) // 计算小时数后剩余的毫秒数
      // 计算相差分钟数
      var minutes = Math.floor(hourMod / minute)
      var minuteMod = hourMod % minute // 计算分钟数后剩余的毫秒数
      // 计算相差秒数
      var seconds = minuteMod / second
      this.runDuration = hours + ':' + minutes + ':' + seconds
    }
  }
}
</script>
<style lang="less" scoped>
  .report-log{
     height: 600px;
     /deep/ .ant-card-body {
      height:90%
    }
  }
  .case-data{
    margin-top: 6px ;
  }
  .reason-show{
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
</style>
