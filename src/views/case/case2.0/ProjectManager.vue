<template>
  <div>
    <div class="handle-case_list_menu">
      <a-row :gutter="12" style="margin-left: 10px;">
        <a-col :md="8" :lg="4">
          <a-tooltip placement="bottom">
            <template slot="title">
              <span>首页</span>
            </template>
            <a-tag @click="gotoHomePage" color="#14C393" style="margin-top: 15px;">
              <span>T</span>
            </a-tag>
          </a-tooltip>
          <a-icon type="right" style="margin-left: 5px;"/>
        </a-col>
        <a-col :md="20" :lg="10" style="margin-top: 11px; margin-left: -15px;">
          <div class="project_select_option">
            <span style="font-size: 20px;">项目配置</span>
          </div>
        </a-col>
      </a-row>
    </div>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :span="6">
              <a-form-item label="名称">
                <a-input allowClear v-model="project_name" placeholder="请输入"/>
              </a-form-item>
            </a-col>
            <a-col :span="8" :offset="10">
              <a-button style="margin-left: 140px" type="primary" @click="queryData">查询</a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>
    <a-card title="" style="margin-top: 16px">
      <a-table :columns="columns" :data-source="data" rowKey="id" :loading="loading">
        <template slot="operation" slot-scope="text, record">
          <a class="active" @click="() => createOrModifyProject(record.id)">编辑</a>
          <a-popconfirm v-show="deleteVisible" placement="top" ok-text="确定" cancel-text="取消" @confirm="deleteProject(record)">
            <a-divider type="vertical"/>
            <template slot="title">
              <p>确认删除该数据么？</p>
            </template>
            <a>删除</a>
          </a-popconfirm>
        </template>
        <template slot="project_name" slot-scope="text">
          <!-- <a-avatar class="card-avatar" shape="square" slot="avatar" :src="photo" /> -->
          <!-- <a-avatar size="default" style="backgroundColor:#87d068" icon="container"/> -->
          <a-avatar size="default" style="backgroundColor:#5B8FF9" icon="container"/>
          <span style="padding-left:14px">{{ text }}</span>
        </template>
        <template slot="project_members" slot-scope="text">
          {{ text|memberFilter }}
          <!-- {{ record }} -->
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
import { getProjectList, deleteProject } from '@/api/case/project_two'
import moment from 'moment'
import CreateForm from './CreateForm'
import * as statisticsApi from '@/api/common/statistics'

const columns = [
  {
    title: '编号',
    dataIndex: 'id',
    key: 'id',
    scopedSlots: { customRender: 'id' },
    width: 70
  },
  {
    title: '项目名称',
    dataIndex: 'project_name',
    key: 'project_name',
    scopedSlots: { customRender: 'project_name' }
  },
  {
    title: '负责人',
    dataIndex: 'user_name_cn',
    key: 'user_name_cn',
    width: 160
  },
  {
    title: '成员',
    dataIndex: 'project_members',
    key: 'project_members',
    scopedSlots: { customRender: 'project_members' },
    width: 360
  },
  {
    title: '创建时间',
    dataIndex: 'created_time',
    key: 'created_time',
    width: 200
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation ',
    scopedSlots: { customRender: 'operation' },
    width: 140
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
      loading: true,
      deleteVisible: true
    }
  },
  filters: {
    memberFilter (members) {
      if (members) {
        return members.join('、')
      } else {
        return ''
      }
    }
  },
  created () {
    this.queryData()
    this.setDefaultDate()
    this.setRangeValue()
    // this.addStatOverview()
  },
  methods: {
    gotoHomePage () {
      console.log('### in gotoHomePage')
      this.$router.push({
        name: 'caseTwoProjectList'
      })
    },
    moment,
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
    deleteProject (record) {
        const params = {
          project_id: record.id
        }
        console.log('params in deleteProject func:')
        console.log(params)
        deleteProject(params).then(res => {
            const code = res.code
            if (code === 0) {
              this.$message.success('数据已删除')
              this.queryData()
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
  @import "./caseList.less";
  .active{
    margin-right: 5px;
  }
</style>
