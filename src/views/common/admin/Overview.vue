<template>
  <div class="Overview">
    <a-card style="margin-top:24px; margin-bottom:24px;">
      <p style="font-size: 16px;color: rgba(0, 0, 0, 0.85); line-height: 24px;">
        关键指标
      </p>
      <div class="item">
        <div class="container-title">
          <div class="text">总浏览量</div>
          <div class="desc">
            <a-tooltip placement="right">
              <template slot="title">
                <span style="max-width: 400px;font-size: 12px">{{ headDesc }}</span>
              </template>
              <a-icon type="question-circle"/>
            </a-tooltip>
          </div>
        </div>
        <span class="num">{{ browseSum }}</span>
        <div v-if="sameDay === 1" class="radio">
        </div>
      </div>
      <a-divider type="vertical" :class="{'divider1': sameDay === 0,'divider2': sameDay === 1}" />
      <div class="item item1">
        <p class="title">云测平台浏览量</p>
        <span class="num">{{ atxBrowseSum }}</span>
      </div>
      <a-divider type="vertical" :class="{'divider1': sameDay === 0,'divider2': sameDay === 1}" />
      <div class="item item1">
        <p class="title">用例平台浏览量</p>
        <span class="num">{{ caseBrowseSum }}</span>
        <!-- 同比昨日数据暂时不要 -->
        <!-- <div v-if="sameDay === 1" class="radio">
          <span><span class="descripe">同比昨日 </span>{{ atxRadio.toFixed(2) }}%</span>
        </div> -->
      </div>
      <a-divider type="vertical" :class="{'divider1': sameDay === 0,'divider2': sameDay === 1}" />
      <div class="item item1">
        <p class="title">度量平台浏览量</p>
        <span class="num">{{ qualityBrowseSum }}</span>
        <div v-if="sameDay === 1" class="radio">
        </div>
      </div>
    </a-card>
    <a-card>
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col style="width: 400px;">
              <a-form-item label="日期">
                <a-range-picker
                  :value="value"
                  :placeholder="defaultDate"
                  :defaultPickerValue="defaultPickerValue"
                  @change="dateChange"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>

    <a-card style="margin-top:24px;" class="overview-card3">
      <p style="font-size: 16px;color: rgba(0, 0, 0, 0.85); line-height: 24px;">
        数据统计
      </p>
      <a-tabs type="card">
        <a-tab-pane key="1" tab="总浏览量">
          <v-chart :options="viewOptionsTotal" :autoresize="true" class="views-info"></v-chart>
        </a-tab-pane>
        <a-tab-pane key="2" tab="浏览量（PV）">
          <v-chart :options="viewOptionsPageView" :autoresize="true" class="views-info"></v-chart>
        </a-tab-pane>
        <a-tab-pane key="3" tab="独立用户（UV）">
          <v-chart :options="viewOptionsUserView" :autoresize="true" class="views-info"></v-chart>
        </a-tab-pane>
      </a-tabs>
      <a-card title="数据详情" :style="{ marginTop: '24px' }">
        <a-table
          :columns="platformColumns"
          :data-source="overviewData"
          :pagination="platformPagination"
          rowKey="key"
          class="overview-detail"
          bordered>
          <!-- <template slot="overviewDate" slot-scope="text, record">
            <span>{{ record.time }}</span>
          </template> -->
          <template slot="platform" slot-scope="text, record">
            <span>{{ platformList[record.platform] }}</span>
          </template>
          <template slot="ratio" slot-scope="text, record">
            {{ browseSum === 0 ? 0 : parseInt(record.count * 100 / browseSum) }}%
          </template>
        </a-table>
      </a-card>
    </a-card>
  </div>
</template>

<script>
  import ECharts from 'vue-echarts'
  import 'echarts/lib/chart/line'
  import 'echarts/lib/component/title'
  import 'echarts/lib/component/toolbox'
  import 'echarts/lib/component/tooltip'
  import 'echarts/lib/component/legend'
  import moment from 'moment'
  import * as statisticsApi from '@/api/common/statistics'
  export default {
    name: 'Overview',
    components: { 'v-chart': ECharts },
    data () {
      return {
        value: [],
        defaultDate: [],
        defaultPickerValue: [],
        selectedDate: ['', ''],
        browseSum: 0,
        previousBrowseSum: 0,
        browseRadio: 0,
        atxBrowseSum: 0,
        caseBrowseSum: 0,
        qualityBrowseSum: 0,
        previousAtxBrowseSum: 0,
        atxRadio: 0,
        sameDay: 0,
        assigneeDesc: '指定项目中,Bug类型的问题单,在选定的时间间隔内,状态为未关闭的经办人和问题单数量,取Top15条数据',
        viewOptionsTotal: {},
        viewOptionsPageView: {},
        viewOptionsUserView: {},
        platformData: [],
        previousPlatformData: [],
        overviewData: [],
        platformColumns: [
          {
            title: '日期',
            dataIndex: 'overviewdate',
            width: '20%',
            align: 'center',
            customRender: (value, row, index) => {
              const obj = {
                children: value,
                attrs: {}
              };
              if ((index === 0) || (index % 3 === 0)) {
                obj.attrs.rowSpan = 3;
              } else {
                obj.attrs.rowSpan = 0;
              }
              return obj;
            }
          },
          {
            title: '平台',
            dataIndex: 'platform',
            scopedSlots: { customRender: 'platform' },
            width: '20%',
            align: 'center'
          },
          {
            title: '浏览量PV',
            dataIndex: 'count',
            scopedSlots: { customRender: 'count' },
            width: '20%',
            align: 'center'
          },
          {
            title: '独立用户UV',
            dataIndex: 'user_num',
            scopedSlots: { customRender: 'user_num' },
            width: '20%',
            align: 'center'
          },
          {
            title: '总浏览量',
            dataIndex: 'total',
            scopedSlots: { customRender: 'total' },
            width: '20%',
            align: 'center'
          }
        ],
        platformPagination: {
          defaultCurrent: 1, // 默认当前页数
          defaultPageSize: 21, // 默认当前页显示数据的大小
          total: 0, // 总数，必须先有
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ['21', '30', '36', '48'],
          showTotal: (total) => `共 ${total} 条`, // 显示总数
          onShowSizeChange: (current, pageSize) => {
            this.platformPagination.defaultCurrent = 1
            this.platformPagination.defaultPageSize = pageSize
          },
          // 改变每页数量时更新显示
          onChange: (current) => {
            this.platformPagination.defaultCurrent = current
          }
        },
        platformList: {
          atx: '云测平台',
          case: '用例平台',
          quality: '度量平台'
        },
        dateFormat: 'YYYY/MM/DD'
      }
    },
    props: {
      headDesc: {
        type: String,
        default: '总浏览量计算公式为：云测平台浏览量+用例平台浏览量+度量平台浏览量+首页浏览量'
      }
    },
    created () {
      this.getDefaultDate()
    },
    methods: {
      getDefaultDate () {
        const nowDate = new Date()
        const startDate = moment(new Date(nowDate.getFullYear(), nowDate.getMonth() - 1, nowDate.getDate()))
        const endDate = moment()
        this.defaultDate.push(startDate.format('YYYY-MM-DD'))
        this.defaultDate.push(endDate.format('YYYY-MM-DD'))
        this.defaultPickerValue.push(startDate)
        this.defaultPickerValue.push(endDate)
        console.log('this.defaultDate:')
        console.log(this.defaultDate)
        this.selectedDate = [startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD')]
        this.formatDate(this.selectedDate)
        console.log('this.selectedDate:')
        console.log(this.selectedDate)
      },
      dateChange (value, dateString) {
        this.value = value
        this.selectedDate = dateString
        this.formatDate(this.selectedDate)
        console.log('this.selectedDate:')
        console.log(this.selectedDate)
      },
      formatDate (val) {
        const start = moment(val[0]).format('YYYY-MM-DD');
        const end = moment(val[1]).format('YYYY-MM-DD');
        this.sameDay = 0;
        if (start === end) {
          this.sameDay = 1;
        }
        this.overviewList(start, end);
      },
      platformBrowseNum (platformData, platform) {
        let num = 0;
        platformData.forEach(function (item) {
          if (item.platform === platform) {
            num = item.count;
          }
        });
        return num;
      },
      countScale (val, previousVal) {
        let scale = 0;
        if (!previousVal && val) {
          scale = 100;
        }
        if (previousVal && !val) {
          scale = -100;
        }
        if (previousVal && val) {
          scale = ((val - previousVal) * 100) / previousVal;
        }
        return scale;
      },
      // 加载echars
      getChars (data, detailData) {
        if (!data && !detailData) {
          return;
        }
        const xAxis = [];
        const browseData = [];
        const atxBrowseData = [];
        const caseBrowseData = [];
        const qualityBrowseData = [];
        const atxUserViewData = [];
        const caseUserViewData = [];
        const qualityUserViewData = [];
        data.forEach(item => {
          xAxis.push(item.time);
          browseData.push(item.total);
          atxBrowseData.push(item.atx_sum);
          // PV数据添加用例平台浏览量和度量平台浏览量
          caseBrowseData.push(item.case_sum);
          qualityBrowseData.push(item.quality_sum)
        })
        detailData.forEach(item => {
          // 对于UV数据，生成每天的不同平台的数据
          if (item.platform === 'atx') {
            atxUserViewData.unshift(item.user_num);
          };
          if (item.platform === 'case') {
            caseUserViewData.unshift(item.user_num);
          };
          if (item.platform === 'quality') {
            qualityUserViewData.unshift(item.user_num);
          };
        });
        this.viewOptionsTotal = {
          tooltip: {
            trigger: 'axis'
          },
          color: ['#5B8FF9'],
          legend: {
            itemHeight: 12,
            left: '20px',
            data: [
              {
                name: '总浏览量',
                textStyle: {
                  color: '#5B8FF9'
                }
              }]
          },
          grid: {
            left: '20px',
            right: '35px',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {
                show: false
              }
            }
          },
          xAxis: {
            // x轴
            type: 'category',
            boundaryGap: false,
            data: xAxis
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: '总浏览量',
              type: 'line',
              data: browseData
            }
          ]
        }
        this.viewOptionsPageView = {
          tooltip: {
            trigger: 'axis'
          },
          color: ['#14C393', '#F6BD16', '#E86452'],
          legend: {
            itemHeight: 12,
            left: '20px',
            data: [
              {
                name: '云测平台',
                textStyle: {
                  color: '#14C393'
                }
              },
              {
                name: '用例平台',
                textStyle: {
                  color: '#F6BD16'
                }
              },
              {
                name: '度量平台',
                textStyle: {
                  color: '#E86452'
                }
              }]
          },
          grid: {
            left: '20px',
            right: '35px',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {
                show: false
              }
            }
          },
          xAxis: {
            // x轴
            type: 'category',
            boundaryGap: false,
            data: xAxis
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: '云测平台',
              type: 'line',
              data: atxBrowseData
            },
            {
              name: '用例平台',
              type: 'line',
              data: caseBrowseData
            },
            {
              name: '度量平台',
              type: 'line',
              data: qualityBrowseData
            }
          ]
        }
        this.viewOptionsUserView = {
          tooltip: {
            trigger: 'axis'
          },
          color: ['#14C393', '#F6BD16', '#E86452'],
          legend: {
            itemHeight: 12,
            left: '20px',
            data: [
             {
                name: '云测平台',
                textStyle: {
                  color: '#14C393'
                }
              },
              {
                name: '用例平台',
                textStyle: {
                  color: '#F6BD16'
                }
              },
              {
                name: '度量平台',
                textStyle: {
                  color: '#E86452'
                }
              }]
          },
          grid: {
            left: '20px',
            right: '35px',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {
                show: false
              }
            }
          },
          xAxis: {
            // x轴
            type: 'category',
            boundaryGap: false,
            data: xAxis
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: '云测平台',
              type: 'line',
              data: atxUserViewData
            },
            {
              name: '用例平台',
              type: 'line',
              data: caseUserViewData
            },
            {
              name: '度量平台',
              type: 'line',
              data: qualityUserViewData
            }
          ]
        }
      },
      overviewList (start, end) {
        const params = {
          start_date: start,
          end_date: end
        };
        statisticsApi
          .getOverviewList(params)
          .then(res => {
            if (res.code === 0) {
              this.browseSum = res.data.browse_sum;
              this.previousBrowseSum = res.data.previous_browse_sum;
              this.platformData = res.data.platform_data;
              // this.overviewData = res.data.key_indicators_data;
              this.overviewData = res.data.overview_detail_data_list;
              // this.overviewDetail = this.getOverViewDetail(res.data.key_indicators_data);
              this.previousPlatformData = res.data.previous_platform_data;
              this.atxBrowseSum = this.platformBrowseNum(
                this.platformData,
                'atx'
              );
              this.caseBrowseSum = this.platformBrowseNum(
                this.platformData,
                'case'
              );
              this.qualityBrowseSum = this.platformBrowseNum(
                this.platformData,
                'quality'
              );
              this.previousAtxBrowseSum = this.platformBrowseNum(
                this.previousPlatformData,
                'atx'
              );
              this.browseRadio = this.countScale(
                this.browseSum,
                this.previousBrowseSum
              );
              this.atxRadio = this.countScale(
                this.atxBrowseSum,
                this.previousAtxBrowseSum
              );
              this.getChars(res.data.key_indicators_data, res.data.overview_detail_data_list);
            }
          })
          .catch(err => {
            this.$message.error(`数据获取失败：${err.message}`);
          });
      }
    }
  }
</script>

<style lang="less" scoped>
  .Overview {
    .item {
      float: left;
      width: 200px;
      .container-title {
        position: relative;
        background: white;
        line-height: 45px;
        .text {
          font-size: 14px;
          color: rgba(0,0,0,0.85);
          line-height: 22px;
          margin-bottom: 0px;
        }
        .desc {
          position: absolute;
          left: 63px;
          top: -12px;
          font-weight: 400;
        }
      }
      .title {
        font-size: 14px;
        color: rgba(0,0,0,0.85);
        line-height: 22px;
        margin-bottom: 0px;
      }
      .num {
        display: block;
        font-family: Helvetica;
        font-size: 30px;
        color: rgba(0,0,0,0.85);
        line-height: 38px;
      }
      .radio {
        margin-top: 12px;
        font-family: Helvetica;
        font-size: 12px;
        color: #F5222D;
        line-height: 20px;
      }
      .descripe {
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: rgba(0,0,0,0.45);
        line-height: 20px;
      }
    }
    .item1 {
      margin-left: 24px;
    }
    .divider1 {
      height: 60px;
      float:left;
    }
    .divider2 {
      height: 92px;
      float:left;
    }
    .overview-card3 {
      .views-info {
        width: auto;
        height: 295px;
      }
      /deep/ .ant-card-head {
        background: rgba(0,0,0,0.02);
      }
      /deep/ .ant-card-head-title {
          font-size: 14px;
          padding: 13px 0;
        }
    }
  }
</style>
