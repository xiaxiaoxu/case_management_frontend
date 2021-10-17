<template>
  <div>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="7" :sm="24" style="padding-left:12px;padding-right:12px">
              <a-form-item label="时间">
                <a-range-picker
                  :value="dateValue"
                  :ranges="rangeValues"
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
            <a-col :md="3" :sm="24" style="padding-left:12px;padding-right:12px">
              <a-form-item label="类型">
                <a-select v-model="category" placeholder="请选择" allowClear >
                  <a-select-option v-for="item in categoryList" :key="item.id" :value="item.name">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="5" :sm="24" style="padding-left:12px;padding-right:12px">
              <a-form-item label="名称">
                <a-input allowClear v-model="name" placeholder="请输入"/>
              </a-form-item>
            </a-col>
            <a-col :md="5" :sm="24" style="padding-left:12px;padding-right:12px">
              <a-button type="primary" @click="queryData">查询</a-button>
              <a-button style="margin-left: 10px" @click="createOrModifyPlan()">创建测试计划</a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>
    <a-card title="测试计划" style="margin-top: 16px">
      <a-table :columns="columns" :data-source="data" rowKey="id" :loading="loading">
        <template slot="operation" slot-scope="text, record">
          <a class="active" @click="() => createOrModifyPlan(record.id)">编辑</a>
          <a class="active" @click="() => realtime(record)">立即执行</a>
          <a class="active" @click="() => historyDetail(record)">历史详情</a>
          <a class="active" @click="() => delit(record)">删除</a>
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
import store from '@/store'
import { delPlanById, planList, realtimeRun } from '@/api/case/plan'
import { autoTestProjectList, autoTestCategoryList } from '@/api/case/setting'
import moment from 'moment'
import CreateForm from './CreateForm'
import * as statisticsApi from '@/api/common/statistics'
const columns = [
  {
    title: '编号',
    dataIndex: 'id',
    key: 'id',
    scopedSlots: { customRender: 'id' },
    width: 60
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '项目',
    dataIndex: 'project',
    key: 'project'
  },
  {
    title: '类型',
    dataIndex: 'category',
    key: 'category'
  },
  {
    title: '执行脚本',
    dataIndex: 'scripts',
    key: 'scripts',
    ellipsis: true
  },
  {
    title: '创建者',
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
    scopedSlots: { customRender: 'operation' },
    width: 220
  }
];
const nowDate = new Date()
const startDate = moment(new Date(nowDate.getFullYear(), nowDate.getMonth() - 1, nowDate.getDate()))
const endDate = moment()
export default {
  name: 'PlanList',
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
      name: '',
      createFormVisible: false,
      confirmLoading: false,
      planId: 0,
      loading: true,
      username: store.getters.username,
      isAdmin: store.getters.isAdmin

    }
  },
  created () {
    this.testSetWindowLocation()
    this.queryData()
    this.getProjectList()
    this.getCategoryList()
    this.setDefaultDate()
    this.setRangeValue()
    this.addStatOverview()
  },
  methods: {
    moment,
    testSetWindowLocation () {
      console.log('this.$router:')
      console.log(this.$router)
      // window.parent.location.href = this.router
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
      const formData = []
      this.dateValue.forEach(item => {
        formData.push(item.format('YYYY-MM-DD'))
      })
      const params = {
        start_date: formData[0],
        end_date: formData[1],
        project: this.project,
        category: this.category,
        name: this.name
      }
      this.loading = true
      planList(params).then(res => {
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
    realtime (record) {
      this.$confirm({
        title: '提示',
        content: '确定立即执行计划 ?',
        onOk: () => {
          const params = { plan_id: record.id }
          realtimeRun(params).then(res => {
            this.$message.success('创建任务成功等待执行，请在测试报告查看结果')
          }).catch(err => {
            this.$message.error(err.message)
          })
        },
        onCancel () {
        }
      })
    },
    delit (record) {
      this.$confirm({
        title: '确定删除',
        content: '删除测试计划：' + record.name + ' ?',
        onOk: () => {
          if (record.enable === 1) {
            this.$message.error('可用状态的测试计划不能删除!')
          } else if (this.username !== record.user_name && this.isAdmin === false) {
            this.$message.error('只有创建者或者管理员才能删除!')
          } else {
            delPlanById(record.id).then(res => {
              // 刷新列表页面
              this.queryData()
              this.$message.success('删除成功')
            }).catch(err => {
              this.$message.error(err.message)
            })
          }
        },
        onCancel () {
        }
      })
    },
    historyDetail (record) {
      this.$router.push({
        name: 'planHistoryDetail',
        query: { planId: record.id }
      })
      // const TCUrl = `${process.env.VUE_APP_TC_FRONTEND}`
      // const href = TCUrl + '/case?t=' + encodeURIComponent('/case/plan/historyDetail') + '?planId=' + record.id
      // // window.open(href, '_blank')
      // window.open(href)
    },
    modifyPlan (record) {
      this.createFormVisible = true
      this.planId = record.id
    },
    createOrModifyPlan (id) {
      this.createFormVisible = true
      this.$nextTick(() => {
        this.$refs.createOrModify.init(id)
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
          this.$message.error(`添加总览数据失败: ${error.message}`);
        }
      );
    }
  }
}
</script>
<style lang="less" scoped>
  .active{
    margin-right: 5px;
  }
</style>
