
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
        <a-col :md="20" :lg="10" style="margin-top: 10px; margin-left: -15px;">
          <a-popover v-model="projectListWindowVisible" placement="bottomLeft" trigger="click" :bodyStyle="{padding: 0}">
            <ProjectListWindow
              slot="content"
              ref="projectListWindowRef"
              :projectName="this.initialProjectName"
              :projectId="this.project_id"
              :projectList="this.projectList"
              @handleChangeProject="handleChangeProject"
              @projectListWindowInited="projectListWindowInitedFun"
            />
            <div class="select_option" @click="openProjectListWindow">
              <span style="font-size: 20px;">{{ this.initialProjectName }}</span>
              <a-icon type="down" style="margin-left: 12px; position: absolute; top: 10px;"/>
            </div>
          </a-popover>
        </a-col>
      </a-row>
    </div>
    <div class="test_version_title_div">
      <a-row :gutter="24">
        <a-col :md="36" :lg="18" style="margin-top: 14px;">
          <a-icon type="arrow-left" style="margin-left: 15px; font-size: 20px;" @click="goToTestVersion"/>
          <a-divider type="vertical" style="margin-left: 20px; font-size: 20px;"/>
          <a-popover v-model="testVersionListWindowVisible" placement="bottomLeft" trigger="click" :bodyStyle="{padding: 0}">
            <TestVersionListWindow
              slot="content"
              ref="testVersionListWindowRef"
              :testVersionName="testVersionName"
              :testVersionList="testVersionList"
              @handleChangeTestVersion="handleChangeTestVersion"
              @testVersionListWindowInited="testVersionListWindowInitedFun"
              @queryData="getTestPlanList"
            />
            <span class="select_option" @click="openTestVersionListWindow">
              <span style="margin-left: 15px; font-size: 17px;">{{ this.testVersionName }}</span>
              <a-icon type="down" style="margin-left: 10px; font-size: 14px;" />
            </span>
          </a-popover>
        </a-col>
        <a-col :md="12" :lg="6" style="margin-top: 16px;">
          <div style="float: right;">
            <span style="cursor: pointer;" @click="openTestReportModal()">
              <a-icon :style="{ color: '#14C393', fontSize: '18px' }" type="pie-chart" />
              <a class="active" style="margin-left: 5px; margin-right: 20px;" >版本测试报告</a>
            </span>
            <span style="cursor: pointer;" @click="openPlanCodeRepository()">
              <a-icon :style="{ color: '#14C393', fontSize: '18px', marginLeft: '15px', marginTop: '1px' }" type="ordered-list" />
              <span style="margin-left: 5px; margin-right: 20px; cursor: pointer; color: #14C393;">版本操作记录</span>
            </span>
          </div>
        </a-col>
      </a-row>
    </div>
    <div class="test_version_detail_plan_list_div">
      <a-row :gutter="24">
        <a-col :md="36" :lg="18" style="margin-top: 15px;">
          <span style="margin-left: 15px; ">story列表</span>
        </a-col>
        <a-col :md="12" :lg="6" style="margin-top: 8px;">
          <a-button style="float: right; margin-right: 20px;" type="primary" @click="createOrModifyTestPlan()">+新建story</a-button>
        </a-col>
      </a-row>
    </div>
    <a-card :bordered="false" style="margin-top: 10px;">
      <div class="table-page-search-wrapper">
        <a-row :gutter="12">
          <a-col :md="2" :lg="1" style="margin-top: 10px;">
            <span>名称：</span>
          </a-col>
          <a-col :md="10" :lg="5">
            <a-input
              allowClear
              size="large"
              v-model="plan_name"
              placeholder="搜索story（按enter搜索）"
              @pressEnter="getTestPlanList"
              style="margin-left: -16px;"
            >
              <a-icon slot="prefix" type="search" :style="{ fontSize: '15px', marginLeft: '-5px' }"/>
            </a-input>
          </a-col>
          <a-col :md="2" :lg="1" style="margin-top: 10px;">
            <span>状态：</span>
          </a-col>
          <a-col :md="8" :lg="4">
            <a-select
              mode="multiple"
              style="width: 100%; margin-left: -15px;"
              placeholder="选择状态进行搜索"
              @change="handleStateSelectChange"
              size="large"
            >
              <a-select-option v-for="(val, key, index) in stateMap" :key="index" :value="key">
                <a-tag v-if="key === '0'" color="red">{{ val }}</a-tag>
                <a-tag v-if="key === '1'" color="orange">{{ val }}</a-tag>
                <a-tag v-if="key === '2'" color="green">{{ val }}</a-tag>
              </a-select-option>
            </a-select>
          </a-col>
        </a-row>
      </div>
    </a-card>
    <a-card title="" style="margin-top: 10px">
      <a-table
        :columns="columns"
        :data-source="plan_data"
        :customRow="rowclick"
        rowKey="id"
        :loading="loading"
        :pagination="pagination"
      >
        <template slot="plan_status" slot-scope="text">
          <a-tag v-if="text === '0'" color="red">{{ text | stateFilter }}</a-tag>
          <a-tag v-if="text === '1'" color="orange">{{ text | stateFilter }}</a-tag>
          <a-tag v-if="text === '2'" color="green">{{ text | stateFilter }}</a-tag>
        </template>
        <template slot="plan_name" slot-scope="text, record">
          <div @mouseenter="onMouseEnter(record)" @mouseleave="onMouseOut(record)">
            <a-row :gutter="12" >
              <a-col :md="40" :lg="20">
                <span style="cursor: pointer;">{{ text }}</span>
              </a-col>
              <a-col :md="8" :lg="4">
                <a-tooltip placement="top" v-show="record.runIconVisible">
                  <template slot="title">
                    <span v-show="record.plan_status === '0'">开始测试</span>
                    <span v-show="record.plan_status === '1'">结束测试</span>
                  </template>
                  <a-icon
                    v-show="record.plan_status === '0'"
                    :style="runPlanIconStyle"
                    type="play-circle"
                    @mouseover="mouseOver"
                    @mouseleave="mouseLeave"
                    @click.stop="changeTestPlanStatus(record)"
                  />
                  <a-icon
                    v-show="record.plan_status === '1'"
                    :style="runPlanIconStyle"
                    type="pause-circle"
                    @mouseover="mouseOver"
                    @mouseleave="mouseLeave"
                    @click.stop="changeTestPlanStatus(record)"
                  />
                </a-tooltip>
              </a-col>
            </a-row>
          </div>
        </template>
        <template slot="operation" slot-scope="text, record">
          <a @click.stop="createOrModifyTestPlan(record.id)">编辑</a>
          <a-divider type="vertical"/>
          <a @click.stop="() => copyTestPlan(record)">复制</a>
          <a-divider type="vertical"/>
          <a @click.stop="() => deleteTestPlan(record)">删除</a>
        </template>
      </a-table>
    </a-card>
    <CreatePlanForm
      :createFormVisible="this.createFormVisible"
      :memberList="this.memberList"
      ref="createOrModify"
      :projectList="projectList"
      :testVersionList="testVersionList"
      @changeCreateVisible="changeCreateVisible"
      @queryData="queryData"
    />
    <CopyPlanForm
      :copyFormVisible="this.copyFormVisible"
      ref="copyPlan"
      :projectList="projectList"
      :memberList="this.memberList"
      @changeCopyVisible="changeCopyVisible"
      @queryData="queryData"
    />
    <DeletePlan
      :deletePlanVisible="this.deletePlanVisible"
      ref="deletePlan"
      @changeDeletePlanVisible="changeDeletePlanVisible"
      @queryData="queryData"
    />
    <ChangePlanStatusModal
      :changePlanStatusVisible="this.changePlanStatusVisible"
      ref="changePlanStatusModal"
      @setChangePlanStatusVisible="setChangePlanStatusVisible"
      @queryData="getTestPlanList"
    />
  </div>
</template>
<script>
import { getProjectList, findProjectById, getMembers } from '@/api/case/project_two'
import { getTestPlanList } from '@/api/case/plan_two'
import { findTestVersionById, getTestVersionList } from '@/api/case/test_version'
import TestVersionListWindow from './component/TestVersionListWindow.vue'
import CreatePlanForm from './CreatePlanForm'
import CopyPlanForm from './component/CopyPlanForm'
import DeletePlan from './component/DeletePlan'
import ProjectListWindow from './component/ProjectListWindow.vue'
import ChangePlanStatusModal from './component/ChangePlanStatusModal.vue'
const stateMap = {
  '0': '未开始',
  '1': '运行中',
  '2': '已完成'
}
const columns = [
  {
    title: 'story名称',
    dataIndex: 'plan_name',
    key: 'plan_name',
    scopedSlots: { customRender: 'plan_name' },
    width: 500
  },
  {
    title: '状态',
    dataIndex: 'plan_status',
    key: 'plan_status',
    scopedSlots: { customRender: 'plan_status' },
    align: 'center',
    width: 100
  },
  {
    title: '通过率',
    dataIndex: 'pass_rate',
    key: 'pass_rate',
    ellipsis: true,
    align: 'center'
  },
  {
    title: '开始时间',
    dataIndex: 'start_time',
    key: 'start_time '
  },
  {
    title: '结束时间',
    dataIndex: 'end_time',
    key: 'end_time'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    scopedSlots: { customRender: 'operation' },
    align: 'center'
  }
];

export default {
  name: 'CaseTwoPlanList',
  components: {
    CreatePlanForm,
    CopyPlanForm,
    DeletePlan,
    ProjectListWindow,
    ChangePlanStatusModal,
    TestVersionListWindow
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
      stateMap,
      plan_data: [],
      dateValue: [],
      defaultPickerValue: [],
      rangeValues: {},
      projectList: [],
      categoryList: [],
      memberList: [],
      testVersionName: '',
      testVersionListWindowInited: false,
      testVersionList: [],
      testVersionListWindowVisible: false,
      planListWindowVisible: false,
      changePlanStatusVisible: false,
      projectListWindowVisible: false,
      projectListWindowInited: false,
      project: undefined,
      category: undefined,
      project_name: '',
      createFormVisible: false,
      deletePlanVisible: false,
      copyFormVisible: false,
      confirmLoading: false,
      planId: 0,
      loading: true,
      initialProjectName: '',
      projectForm: this.$form.createForm(this, { name: 'projectForm' }),
      plan_status: '',
      plan_list: [],
      plan_name: '',
      test_version_id: 0,
      deleteVisible: true,
      select_state_value: [],
      runIconVisible: false,
      runPlanIconStyle: { color: 'lightgrey', fontSize: '20px' },
      pagination: {
        defaultCurrent: 1, // 默认当前页数
        defaultPageSize: 20, // 默认当前页显示数据的大小
        total: 0, // 总数，必须先有
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '30', '40'],
        showTotal: (total) => `共 ${total} 条`, // 显示总数
        onShowSizeChange: (current, pageSize) => {
          this.pagination.defaultCurrent = 1
          this.pagination.defaultPageSize = pageSize
        },
        // 改变每页数量时更新显示
        onChange: (current) => {
          this.pagination.defaultCurrent = current
        }
      }
    }
  },
  created () {
    console.log('in created of PlanList.vue:')
    console.log('this.$store.state.caseTwo.case_two_global_project_id: ', this.$store.state.caseTwo.case_two_global_project_id)
    this.project_id = parseInt(this.$route.query.project_id)
    this.test_version_id = parseInt(this.$route.query.test_version_id)
    console.log('this.project_id:', this.project_id)
    console.log('this.test_version_id:', this.test_version_id)
    // this.$router.push({
    //     name: 'caseTwoPlanList',
    //     query: { project_id: this.$store.state.caseTwo.case_two_global_project_id, test_version_id: this.test_version_id }
    //   })
    if (this.$store.state.caseTwo.case_two_global_project_name && this.$store.state.caseTwo.case_two_global_project_id) {
        this.initialProjectName = this.$store.state.caseTwo.case_two_global_project_name
        this.project_id = this.$store.state.caseTwo.case_two_global_project_id
      } else if (this.$route.query.project_id) {
        this.project_id = parseInt(this.$route.query.project_id)
        findProjectById(this.$route.query.project_id).then(res => {
          this.initialProjectName = res.data.project_name
          this.$store.commit('case_two_global_project_name', res.data.project_name)
          this.$store.commit('case_two_global_project_id', res.data.id)
          console.log('this.$store.state.caseTwo: ', this.$store.state.caseTwo)
          console.log('this.initialProjectName in create of Planlist of findProjectById: ', this.initialProjectName)
        })
      } else {
        console.log('this.$store.state.caseTwo.case_two_global_project_id: ', this.$store.state.caseTwo.case_two_global_project_id)
        this.$router.push({
            name: 'caseTwoProjectList'
        })
      }
    this.queryData()
    this.getMembersList()
    this.getTestVersionList()
  },
  filters: {
    stateFilter (state) {
      return stateMap[state]
    }
  },
  methods: {
    openPlanCodeRepository () {
      console.log('in openPlanCodeRepository')
    },
    handleChangeTestVersion (testVersionId) {
      console.log('testVersionId:', testVersionId)
      console.log('this.project_id:', this.project_id)
      this.$router.push({
          name: 'caseTwoPlanList',
          query: { project_id: this.project_id, test_version_id: testVersionId }
        })
      this.testVersionListWindowVisible = false
      this.test_version_id = testVersionId
      for (var i = 0; i < this.testVersionList.length; i++) {
        if (this.testVersionList[i].id === testVersionId) {
          console.log('this.testVersionList[i].test_version_name: ', this.testVersionList[i].test_version_name)
          this.testVersionName = this.testVersionList[i].test_version_name
        }
      }
      this.getTestPlanList()
    },
    openTestVersionListWindow () {
      console.log('in openTestVersionListWindow')
      console.log('this.testVersionList: ', this.testVersionList)
      if (this.testVersionListWindowInited === true) {
        // 当window组件初始化后，再调用init方法，否则报错
        this.$refs.testVersionListWindowRef.init()
      }
    },
    // 当window组件初始化后，再调用init方法，否则报错
    testVersionListWindowInitedFun () {
      console.log('in testVersionListWindowInitedFun')
      this.testVersionListWindowInited = true
    },
    goToTestVersion () {
      console.log('in goToTestVersion')
      this.$router.push({
      name: 'caseTwoTestVersionList',
      query: { project_id: this.project_id }
      })
    },
    getTestVersionList () {
      const params = {
        project_id: this.project_id
      }
      console.log('params in getTestVersionList:', params)
      getTestVersionList(params).then(res => {
        this.testVersionList = res.data
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    setChangePlanStatusVisible () {
      console.log('in setChangePlanStatusVisible')
      this.changePlanStatusVisible = false
    },
    changeTestPlanStatus (planData) {
      planData.runIconVisible = false
      this.changePlanStatusVisible = true
      console.log('planData in changeTestPlanStatus: ', planData)
      this.$refs.changePlanStatusModal.init(planData.plan_status, planData.id, planData.iteration_id, planData.plan_name, planData.iteration_name)
    },
    projectListWindowInitedFun () {
      console.log('in projectListWindowInited')
      console.log('this.projectListWindowVisible: ', this.projectListWindowVisible)
      this.projectListWindowInited = true
    },
    openProjectListWindow () {
      console.log('in openProjectListWindow')
      if (this.projectListWindowInited === true) {
        this.$refs.projectListWindowRef.init()
      }
    },
    getMembersList () {
      console.log('in getMembersList function')
      getMembers().then(res => {
       this.memberList = res.data
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 移入
    mouseOver () {
      console.log('in mouseOver')
      this.runPlanIconStyle = { color: '#14C393', fontSize: '20px' }
    },
    // 移出
    mouseLeave () {
      console.log('in mouseLeave')
      this.runPlanIconStyle = { color: 'lightgrey', fontSize: '20px' }
    },
    onMouseEnter (data) {
      console.log('data in onMouseEnter:', data)
      data.runIconVisible = true
      console.log('data.runIconVisible in onMouseEnter:', data.runIconVisible)
      console.log('data in onMouseEnter:', data)
    },
    onMouseOut (data) {
      console.log('in onMouseOut')
      data.runIconVisible = false
      console.log('data.runIconVisible in onMouseEnter:', data.runIconVisible)
    },
    handleStateSelectChange (value) {
      console.log('value in handleStateSelectChange: ', value)
      this.select_state_value = value
      this.getTestPlanList()
    },
    createOrModifyTestPlan (planId) {
      console.log('planId in createOrModifyTestPlan:', planId)
      console.log('this.testVersionName: ', this.testVersionName)
      console.log('this.test_version_id: ', this.test_version_id)
      this.createFormVisible = true
      this.$refs.createOrModify.init(planId, this.testVersionName, this.test_version_id, this.initialProjectName)
    },
    deleteTestPlan (record) {
      console.log('in deleteTestPlan')
      this.deletePlanVisible = true
      this.$refs.deletePlan.init(record.id, record.plan_name)
    },
    copyTestPlan (record) {
      console.log('record in copyTestPlan:', record)
      console.log('this.testVersionName: ', this.testVersionName)
      this.copyFormVisible = true
      this.$refs.copyPlan.init(record.id, record.test_version_id, this.testVersionName)
      this.planOperationPopoverVisible = false
    },
    rowclick (record, index) {
      return {
        on: {
          click: () => {
            console.log(record, index, 'in rowclick')
            this.$router.push({
              name: 'caseTwoPlanDetail',
              query: { project_id: this.project_id, plan_id: record.id, test_version_id: record.test_version_id }
            })
          }
        }
      }
    },
    gotoHomePage () {
      console.log('### in gotoHomePage')
      this.$router.push({
      name: 'caseTwoProjectList'
      })
    },
    openTestCase (id) {
      console.log('id in openTestCase:', id)
      this.$router.push({
        name: 'caseTwoTestCaseList',
        query: { project_id: id }
      })
    },
    getProjectList () {
      const params = {
        project_name: ''
      }
      console.log('params in getProjectList:', params)
      getProjectList(params).then(res => {
        this.projectList = res.data
        console.log('res.data in getProjectList:', res.data)
        if (res.data) {
          for (var i in res.data) {
            if (res.data[i].id === this.project_id) {
              this.initialProjectName = res.data[i].project_name
              this.$store.commit('case_two_global_project_name', res.data[i].project_name)
              this.$store.commit('case_two_global_project_id', res.data[i].id)
              console.log('this.$store.state.caseTwo: ', this.$store.state.caseTwo)
              console.log('this.initialProjectName:', this.initialProjectName)
              break
            }
          }
        }
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    getTestPlanList () {
      // 先清空计划数据
      this.plan_data = []
      const params = {
        project_id: this.project_id,
        test_version_id: this.test_version_id,
        plan_name: this.plan_name,
        state_list: this.select_state_value
      }
      console.log('params in getTestPlanList:', params)
      this.loading = true
      getTestPlanList(params).then(res => {
        this.plan_data = res.data
      }).catch(err => {
        this.$message.error(err.message)
      }).finally(() => {
        this.loading = false
      })
    },
    handleChangeProject (projectInfo) {
      console.log('projectInfo in handleChangeProject :', projectInfo)
      this.projectListWindowVisible = false
      this.initialProjectName = projectInfo.project_name
      this.project_id = projectInfo.id
      console.log('this.initialProjectName in handleChangeProject: ', this.initialProjectName)
      this.$store.commit('case_two_global_project_name', projectInfo.project_name)
      this.$store.commit('case_two_global_project_id', projectInfo.id)
      console.log('this.$store.state.caseTwo: ', this.$store.state.caseTwo)
      // this.queryData()
      this.$router.push({
        name: 'caseTwoPlanList',
        query: { project_id: this.project_id }
      })
      this.goToTestVersion()
    },
    createPlan () {
      this.createFormVisible = true
    },
    changeCreateVisible () {
      this.createFormVisible = false
    },
    changeCopyVisible () {
      this.copyFormVisible = false
    },
    changeDeletePlanVisible () {
      this.deletePlanVisible = false
    },
    queryData () {
      console.log('in queryData')
      this.findTestVersionById()
      this.getProjectList()
      this.getTestPlanList()
    },
    findTestVersionById () {
      findTestVersionById(this.test_version_id).then(res => {
          if (res.data) {
            this.testVersionName = res.data.test_version_name
            console.log('this.testVersionName in findTestVersionById :', this.testVersionName)
          }
        }).catch(err => {
          this.$message.error(err.message)
        })
    },
    modifyPlan (record) {
      this.createFormVisible = true
      this.planId = record.id
    }
  }
}
</script>
<style lang="less" scoped>
 @import "./caseList.less";
  .active{
    margin-left: 14px;
  }
  .select_option {
    cursor: pointer;
  }
  .select_option:hover {
    color: #14C393;
  }
</style>
