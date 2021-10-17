<template>
  <div>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="7" :sm="24" style="padding-left:12px;padding-right:12px">
              <a-form-item label="统计时间">
                <a-date-picker
                  :value="dateValue"
                  :defaultPickerValue="defaultPickerValue"
                  :allowClear="false"
                  @change="handleChange"
                  @panelChange="handlePanelChange"
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
    <a-card :title="listTitle" style="margin-top: 16px">
      <a-table :columns="columns" :data-source="data" rowKey="id" :loading="loading">
        <span slot="w1" slot-scope="text">
          {{ text | successRadioFilter }}
        </span>
        <span slot="w2" slot-scope="text">
          {{ text | successRadioFilter }}
        </span>
        <span slot="w3" slot-scope="text">
          {{ text | successRadioFilter }}
        </span>
        <span slot="w4" slot-scope="text">
          {{ text | successRadioFilter }}
        </span>
        <span slot="w5" slot-scope="text">
          {{ text | successRadioFilter }}
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
import { daystatList } from '@/api/case/daystat'
const columns = [
  {
    title: '项目',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '服务',
    dataIndex: 'plan_name',
    key: 'plan_name'
  },
  {
    title: '负责人',
    dataIndex: 'user_name_cn',
    key: 'user_name_cn'
  },
  {
    title: '测试计划',
    dataIndex: 'plan_id',
    key: 'plan_id'
  },
  {
    title: '星期一',
    dataIndex: 'w1',
    key: 'w1',
    scopedSlots: { customRender: 'w1' }
  },
  {
    title: '星期二',
    dataIndex: 'w2',
    key: 'w2',
    scopedSlots: { customRender: 'w2' }
  },
  {
    title: '星期三',
    dataIndex: 'w3',
    key: 'w3',
    scopedSlots: { customRender: 'w3' }
  },
    {
    title: '星期四',
    dataIndex: 'w4',
    key: 'w4',
    scopedSlots: { customRender: 'w4' }
  },
  {
    title: '星期五',
    dataIndex: 'w5',
    key: 'w5',
    scopedSlots: { customRender: 'w5' }
  },
  {
    title: '趋势图',
    dataIndex: 'graph',
    key: 'graph'
  }
];
// const nowDate = new Date()
const endDate = moment()

export default {
  name: 'ReportList',
  data () {
    return {
      columns,
      data: [],
      dateValue: '',
      defaultPickerValue: '',
      myweekstart: '',
      myweekend: '',
      rangeValues: {},
      name: '',
      loading: true,
      listTitle: '日报数据',
      projectOptions: {},
      // 这这里必须先设置默认值
      projectNameList: ['dmp', 'iapp', 'portal', 'janalytics', 'jcache', 'jmessage', 'jmlink', 'jmqs', 'jpush', 'jsms', 'jverification', 'pricloud', 'sdk', 'ad-hdt', 'ad-push']
    }
  },
  components: {
    'ArrowContainer': ArrowContainer,
    'v-chart': ECharts
  },
  filters: {
    successRadioFilter (text) {
      if (text === '') {
        return '未执行'
      } else {
         return (text * 100).toFixed(2) + '%'
      }
    }
  },
  created () {
    this.setDefaultDate()
  },
  mounted () {
    // this.getProjectList()
    this.queryData()
  },
  methods: {
    moment,
    setDefaultDate () {
      this.dateValue = endDate
      this.defaultPickerValue = endDate
      this.setWeekDay(endDate)
      this.listTitle = '项目数据（' + this.myweekstart + ' - ' + this.myweekend + '）'
    },
    handleChange (value) {
      this.dateValue = value
    },
    handlePanelChange (value, mode) {
      this.dateValue = value
    },
    setWeekDay (value) {
      const tmpvalue = value
      this.myweekstart = tmpvalue.weekday(0).format('YYYY-MM-DD')
      this.myweekend = tmpvalue.weekday(4).format('YYYY-MM-DD')
    },
    createPlan () {
      this.createFormVisible = true
    },
    changeCreateVisible () {
      this.createFormVisible = false
    },
    queryData () {
      this.loading = true
      this.setWeekDay(this.dateValue)
      this.listTitle = '项目数据（' + this.myweekstart + ' - ' + this.myweekend + '）'
      const params = {
        start_date: this.myweekstart,
        end_date: this.myweekend
      }
      daystatList(params).then(res => {
        this.data = res.data
      }).catch(err => {
        this.$message.error(err.message)
      }).finally(() => {
          this.loading = false
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
