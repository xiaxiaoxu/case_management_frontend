
<template>
  <div>
    <div class="handle-menu">
      <div style="margin-left: 10px;">
        <a-tag color="#14C393" style="margin-top: 15px;">
          <span>T</span>
        </a-tag>
        <span>首页</span>
      </div>
    </div>
    <a-card :bordered="false" style="margin-top: 10px;">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :md="12" :lg="6">
              <a-form-item label="名称">
                <a-input allowClear v-model="project_name" placeholder="请输入"/>
              </a-form-item>
            </a-col>
            <a-col :md="36" :lg="18">
              <a-button style="float: right" @click="projectManager()">
                <a-icon type="setting"></a-icon>
                配置项目
              </a-button>
              <a-button style="float: right; margin-right: 10px;" @click="createOrModifyProject()">+ 新建项目</a-button>
              <a-button style="float: right; margin-right: 10px; " type="primary" @click="queryData">查询</a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>
    <a-card title="" style="margin-top: 16px">
      <a-table :columns="columns" :data-source="data" :customRow="rowclick" rowKey="id" :loading="loading">
        <template slot="project_name" slot-scope="text">
          <a-avatar size="default" style="backgroundColor:#5B8FF9" icon="container"/>
          <span style="margin-left: 10px; cursor: pointer;">{{ text }}</span>
        </template>
      </a-table>
    </a-card>
    <CreateForm
      :createFormVisible="this.createFormVisible"
      ref="createOrModify"
      @changeCreateVisible="changeCreateVisible"
      @queryData="queryData"
    />
  </div>
</template>
<script>
import { getProjectList, getProjectCaseNum } from '@/api/case/project_two'
import moment from 'moment'
import CreateForm from './CreateForm'
import * as statisticsApi from '@/api/common/statistics'

const columns = [
  {
    title: '编号',
    dataIndex: 'id',
    key: 'id',
    scopedSlots: { customRender: 'id' },
    width: 100
  },
  {
    title: '项目名称',
    dataIndex: 'project_name',
    key: 'project_name',
    scopedSlots: { customRender: 'project_name' }
  },
  {
    title: '模块数',
    dataIndex: 'module_num',
    key: 'module_num',
    align: 'center'
  },
  {
    title: '总用例数',
    dataIndex: 'case_num',
    key: 'case_num',
    ellipsis: true,
    align: 'center'
  },
  {
    title: '本周新增用例数',
    dataIndex: 'add_case_num_this_week',
    key: 'add_case_num_this_week',
    ellipsis: true,
    align: 'center'
  },
  {
    title: '负责人',
    dataIndex: 'user_name_cn',
    key: 'user_name_cn '
  },
  {
    title: '创建时间',
    dataIndex: 'created_time',
    key: 'created_time'
  }
];
const nowDate = new Date()
const startDate = moment(new Date(nowDate.getFullYear(), nowDate.getMonth() - 1, nowDate.getDate()))
const endDate = moment()
export default {
  name: 'CaseTwoPlanList',
  components: {
    CreateForm
  },
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 }
      },
      columns,
      data: [],
      dateValue: [],
      defaultPickerValue: [],
      rangeValues: {},
      projectList: [],
      categoryList: [],
      project: undefined,
      category: undefined,
      project_name: '',
      createFormVisible: false,
      confirmLoading: false,
      planId: 0,
      loading: true
    }
  },
  created () {
    this.queryData()
  },
  methods: {
    moment,
    rowclick (record, index) {
      return {
        on: {
          click: () => {
            console.log(record, index, 'in rowclick')
            this.gotoTestVersionList(record.id, record.project_name)
          }
        }
      }
    },
    gotoTestVersionList (id, name) {
      console.log('id in gotoTestVersionList:', id)
      this.$store.commit('case_two_global_project_name', name)
      this.$store.commit('case_two_global_project_id', id)
      this.$router.push({
        name: 'caseTwoTestVersionList',
        query: { project_id: id }
      })
    },
    setDefaultDate () {
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
      this.getProjectList()
      this.getProjectCaseNum()
    },
    getProjectList () {
      const params = {
        project_name: this.project_name
      }
      this.loading = true
      getProjectList(params).then(res => {
       this.data = res.data
      }).catch(err => {
        this.$message.error(err.message)
      }).finally(() => {
        this.loading = false
      })
    },
    getProjectCaseNum () {
      const params = {
        project_name: this.project_name
      }
      this.loading = true
      getProjectCaseNum(params).then(res => {
       console.log('re.data:', res.data)
       for (let i = 0; i < this.data.length; i++) {
          for (let j = 0; j < res.data.length; j++) {
            if (this.data[i].id === res.data[j].project_id) {
              this.data[i].module_num = res.data[j].module_num
              this.data[i].case_num = res.data[j].case_num
              this.data[i].add_case_num_this_week = res.data[j].add_case_num_this_week
            }
          }
       }
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    historyDetail (record) {
      this.$router.push({
        name: 'planHistoryDetail',
        query: { planId: record.id }
      })
    },
    modifyPlan (record) {
      this.createFormVisible = true
      this.planId = record.id
    },
    createOrModifyProject (id) {
      this.createFormVisible = true
      this.$nextTick(() => {
        this.$refs.createOrModify.init(id)
      })
    },
    projectManager () {
      this.$router.push({
        name: 'caseTwoProjectManager'
      })
    },
    addStatOverview () {
      const data = {
        'platform': 'case',
        'func': 'case_plan'
      };
      statisticsApi.statOerviewAdd(data)
      .then(
        res => {
          console.log('add overview success')
        },
        error => {
          // this.$message.info(`添加总览数据失败: ${error.message}`);
          console.log(`添加总览数据失败: ${error.message}`)
        }
      );
    }
  }
}
</script>
<style lang="less" scoped>
 @import "./caseList.less";
  .active{
    margin-left: 14px;
  }

</style>
