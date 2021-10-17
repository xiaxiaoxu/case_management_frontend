<template>
  <div>
    <a-card title="报告总览">
      <a-button slot="extra" class="button" @click="goback()">返回</a-button>
      <a-row :gutter="24">
        <a-col :md="24" :lg="16">
          <a-card type="inner" title="设备执行情况">
            <span slot="extra">状态：{{ report.state|stateFilter }}</span>
            <v-chart :options="caseOptions" :autoresize="true" style="height:276px"></v-chart>
          </a-card>
        </a-col>
        <a-col :md="24" :lg="8">
          <a-card type="inner" title="设备执行数据" :bodyStyle="{ height: '308px'}">
            <div class="case-data">设备总数:  {{ deivceInfo.total }}</div>
            <div class="case-data">完成设备数:  {{ report.success }}</div>
            <div class="case-data">未完成设备数:  {{ report.failure }}</div>
            <div class="case-data">用例总数:  {{ report.total }}</div>
            <div class="case-data">运行开始时间:  {{ report.start_time }}</div>
            <div class="case-data">运行结束时间:  {{ report.end_time }}</div>
            <div class="case-data">运行总时长:  {{ runDuration }} </div>
            <!-- <div v-if="report.reasons" class="case-data">未开始原因：
              <ellipsis :length="70">{{ report.reasons }}</ellipsis>
            </div> -->
          </a-card>
        </a-col>
      </a-row>
      <a-card class="report-log" style="margin-top:16px">
        <div v-if="isShow">
          <SDKReportList :deviceReportsList="deviceReportsList"></SDKReportList>
        </div>
      </a-card>
    </a-card>
  </div>
</template>
<script>
import { Ellipsis } from '@/components'
import { reportDetail, reportExport, runLog } from '@/api/case/report'
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/pie'
import SDKReportList from './SDKReportList'
const apiUrl = `${process.env.VUE_APP_API_BASE_URL}`
const stateMap = {
  'notStart': '未开始',
  'running': '运行中',
  'end': '结束',
  '': '未开始'
}
export default {
  name: 'ReportOverview',
  components: {
    'v-chart': ECharts,
    Ellipsis,
    SDKReportList
  },
  data () {
    return {
      deivceInfo: '',
      deviceReportsList: [],
      reportId: 0,
      report: '',
      isShow: false,
      deviceNum: [],
      caseNum: [],
      caseOptions: {},
      successRadio: 0,
      logSrc: '',
      runDuration: '00:00:00',
      logInfo: ''
    }
  },
  created () {
    this.reportId = this.$route.query.reportId
    console.log('this.reportId in sdk overview')
    console.log(this.reportId)
    // this.getReportDetail() // 后面会去掉
    this.getDeviceReportInfo()
    this.getCaseOptions()
    this.logSrc = apiUrl + '/case/v1/report/log/' + this.reportId + '/report.html'
    this.getLogInfo()
  },
  filters: {
    stateFilter (state) {
      return stateMap[state]
    }
  },
  methods: {
    getDeviceReportInfo () {
      reportDetail(this.reportId).then(res => {
        const report = res.data.report
        this.report = report
        const deivceInfo = res.data.report.device_reports
        this.deivceInfo = deivceInfo
        const deviceReportsList = deivceInfo.device_reports_list
        this.deviceReportsList = deviceReportsList
        console.log('this.deviceReportsList')
        console.log(this.deviceReportsList)
        this.deviceNum.push({ value: report.success, name: '完成设备数' })
        this.deviceNum.push({ value: report.failure, name: '未完成设备数' })
        this.isShow = true
        // 计算成功比率
        if (deivceInfo > 0) {
          this.successRadio = (deivceInfo.success * 100 / deivceInfo.total).toFixed(2)
        }
        // 运行时长
        if (report.start_time && report.end_time) {
          this.countRunTime(report.start_time, report.end_time)
        }
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    getReportDetail () {
      reportDetail(this.reportId).then(res => {
        const report = res.data.report
        this.report = report
        this.deviceNum.push({ value: report.success, name: '完成设备数' })
        this.deviceNum.push({ value: report.failure, name: '未完成设备数' })
        // 计算成功比率
        if (report.total > 0) {
          this.successRadio = (report.success * 100 / report.total).toFixed(2)
        }
        // 运行时长
        if (report.start_time && report.end_time) {
          this.countRunTime(report.start_time, report.end_time)
        }
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    getCaseOptions () {
      this.caseOptions = {
        title: {
          text: '设备分布',
          left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{b} : {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['完成设备数', '未完成设备数']
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '60%',
            center: ['50%', '50%'],
            data: this.deviceNum,
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
      this.$router.push({ name: 'reportList' })
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
        report_id: this.reportId
      }
     // 获取subprocess上运行日志信息
     runLog(data).then(res => {
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
      console.log('startDate')
      console.log(startDate)
      console.log('endDate')
      console.log(endDate)
      console.log('intervalTime')
      console.log(intervalTime)
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
      var seconds = (minuteMod / second).toFixed(2)
      this.runDuration = hours + '小时:' + minutes + '分:' + seconds + '秒'
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
