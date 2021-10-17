
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
            <div class="project_select_option" @click="openProjectListWindow">
              <span style="font-size: 20px;">{{ this.initialProjectName }}</span>
              <a-icon type="down" style="margin-left: 12px; position: absolute; top: 10px;"/>
            </div>
          </a-popover>
        </a-col>
      </a-row>
    </div>
    <div class="plan_list_title_div">
      <a-row :gutter="24">
        <a-col :md="40" :lg="20" style="margin-top: 15px;">
          <span style="margin-left: 15px; ">版本列表</span>
        </a-col>
        <a-col :md="8" :lg="4" style="margin-top: 8px;">
          <a-button style="float: right; margin-right: 10px;" type="primary" @click="createOrModifyTestVersion()">+新建版本</a-button>
        </a-col>
      </a-row>
    </div>
    <a-card :bordered="false" style="margin-top: 10px;">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="12">
            <a-col :md="16" :lg="8" style="margin-top: 6px;">
              <a-form-item label="创建时间">
                <a-range-picker
                  :value="dateValue"
                  :ranges="rangeValues"
                  @panelChange="handlePanelChange"
                  @change="handleChange"
                />
              </a-form-item>
            </a-col>
            <a-col :md="12" :lg="6" style="margin-top: 6px; margin-left: -16px;">
              <a-form-item label="名称">
                <a-input
                  allowClear
                  v-model="test_version_name"
                  placeholder="搜索版本（按enter搜索）"
                  @pressEnter="getTestVersionList"
                >
                  <a-icon slot="prefix" type="search" :style="{ fontSize: '15px', marginLeft: '-5px' }"/>
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :md="10" :lg="5" style="margin-top: 6px; margin-left: 20px;">
              <a-form-item label="状态">
                <a-select
                  mode="multiple"
                  style="width: 100%;"
                  placeholder="选择状态进行搜索"
                  @change="handleStateSelectChange"
                >
                  <a-select-option v-for="(val, key, index) in stateMap" :key="index" :value="key">
                    <a-tag v-if="key === '0'" color="red">{{ val }}</a-tag>
                    <a-tag v-if="key === '1'" color="orange">{{ val }}</a-tag>
                    <a-tag v-if="key === '2'" color="green">{{ val }}</a-tag>
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>
    <a-card title="" style="margin-top: 10px">
      <a-table :columns="columns" :data-source="test_version_data" :customRow="rowclick" rowKey="id" :loading="loading">
        <template slot="test_version_status" slot-scope="text">
          <a-tag v-if="text === '0'" color="red">{{ text | stateFilter }}</a-tag>
          <a-tag v-if="text === '1'" color="orange">{{ text | stateFilter }}</a-tag>
          <a-tag v-if="text === '2'" color="green">{{ text | stateFilter }}</a-tag>
        </template>
        <template slot="test_version_name" slot-scope="text">
          <div>
            <a-row :gutter="12" >
              <a-col :md="40" :lg="20">
                <span style="cursor: pointer;">{{ text }}</span>
              </a-col>
            </a-row>
          </div>
        </template>
        <template slot="operation" slot-scope="text, record">
          <a @click.stop="createOrModifyTestVersion(record.id)">编辑</a>
          <span v-if="leaderList.indexOf(username) !== -1">
            <a-divider type="vertical"/>
            <a @click.stop="() => deleteTestVersion(record)">删除</a>
          </span>
        </template>
      </a-table>
    </a-card>
    <CreateTestVersionForm
      :createFormVisible="this.createFormVisible"
      ref="createOrModify"
      :projectList="projectList"
      @changeCreateVisible="changeCreateVisible"
      @queryData="getTestVersionList"
    />
    <DeleteTestVersion
      :deleteTestVersionVisible="this.deleteTestVersionVisible"
      ref="deleteTestVersion"
      @changeDeleteTestVersionVisible="changeDeleteTestVersionVisible"
      @queryData="queryData"
    />
    <ChangePlanStatusModal
      :changePlanStatusVisible="this.changePlanStatusVisible"
      ref="changePlanStatusModal"
      @setChangePlanStatusVisible="setChangePlanStatusVisible"
      @queryData="getTestVersionList"
    />
  </div>
</template>
<script>
import { getProjectList, findProjectById, getMembers } from '@/api/case/project_two'
import { getTestVersionList } from '@/api/case/test_version'
import CreateTestVersionForm from './CreateTestVersionForm'
import DeleteTestVersion from './component/DeleteTestVersion'
import ProjectListWindow from './component/ProjectListWindow.vue'
import ChangePlanStatusModal from './component/ChangePlanStatusModal.vue'
const stateMap = {
  '0': '未开始',
  '1': '运行中',
  '2': '已完成'
}
const columns = [
  {
    title: '版本名称',
    dataIndex: 'test_version_name',
    key: 'test_version_name',
    scopedSlots: { customRender: 'test_version_name' },
    width: 350
  },
  {
    title: '状态',
    dataIndex: 'test_version_status',
    key: 'test_version_status',
    scopedSlots: { customRender: 'test_version_status' },
    align: 'center',
    width: 100
  },
  {
    title: '包含story数',
    dataIndex: 'story_num',
    key: 'story_num',
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
// const nowDate = new Date()
// const startDate = moment(new Date(nowDate.getFullYear(), nowDate.getMonth() - 1, nowDate.getDate()))
// const endDate = moment()

const leaderList = ['huangzf', 'hejm', 'yanggw', 'wangsh', 'xiaxx']
export default {
  name: 'CaseTwoTestVersionList',
  components: {
    CreateTestVersionForm,
    DeleteTestVersion,
    ProjectListWindow,
    ChangePlanStatusModal
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
      test_version_data: [],
      rangeValues: {},
      // dateValue: [startDate, endDate],
      dateValue: [],
      projectList: [],
      categoryList: [],
      memberList: [],
      leaderList,
      username: '',
      changePlanStatusVisible: false,
      projectListWindowVisible: false,
      projectListWindowInited: false,
      project: undefined,
      category: undefined,
      project_name: '',
      createFormVisible: false,
      deleteTestVersionVisible: false,
      copyFormVisible: false,
      confirmLoading: false,
      planId: 0,
      loading: true,
      initialProjectName: '',
      form: this.$form.createForm(this, { name: 'testVersionSearchForm' }),
      plan_status: '',
      plan_name: '',
      test_version_name: '',
      test_version_list: [],
      deleteVisible: true,
      select_state_value: [],
      runIconVisible: false,
      runPlanIconStyle: { color: 'lightgrey', fontSize: '20px' }
    }
  },
  created () {
    console.log('in created of TestVersionList.vue:')
    console.log('this.$store.state.caseTwo.case_two_global_project_id: ', this.$store.state.caseTwo.case_two_global_project_id)
    if (this.$store.state.caseTwo.case_two_global_project_name && this.$store.state.caseTwo.case_two_global_project_id) {
        this.$router.push({
          name: 'caseTwoTestVersionList',
          query: { project_id: this.$store.state.caseTwo.case_two_global_project_id }
        })
        this.initialProjectName = this.$store.state.caseTwo.case_two_global_project_name
        this.project_id = this.$store.state.caseTwo.case_two_global_project_id
      } else if (this.$route.query.project_id) {
        this.$router.push({
          name: 'caseTwoTestVersionList',
          query: { project_id: this.$route.query.project_id }
        })
        this.project_id = parseInt(this.$route.query.project_id)
        findProjectById(this.$route.query.project_id).then(res => {
          this.initialProjectName = res.data.project_name
          this.$store.commit('case_two_global_project_name', res.data.project_name)
          this.$store.commit('case_two_global_project_id', res.data.id)
          console.log('this.$store.state.caseTwo: ', this.$store.state.caseTwo)
        })
      } else {
        console.log('this.$store.state.caseTwo.case_two_global_project_id: ', this.$store.state.caseTwo.case_two_global_project_id)
        this.$router.push({
            name: 'caseTwoProjectList'
        })
      }
    // 获取username
    this.username = this.$store.getters.username
    console.log('this.username: ', this.username)
    // this.$router.push({
    //     name: 'caseTwoTestVersionList',
    //     query: { project_id: this.$store.state.caseTwo.case_two_global_project_id }
    //   })
    console.log('this.project_id:', this.project_id)
    console.log('this.initialProjectName:', this.initialProjectName)
    this.queryData()
    this.getMembersList()
    this.setRangeValue()
  },
  filters: {
    stateFilter (state) {
      return stateMap[state]
    }
  },
  methods: {
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
    handlePanelChange (value, mode) {
      console.log('value, mode in handlePanelChange:', value, mode)
      this.dateValue = value
      this.mode = [mode[0] === 'date' ? 'month' : mode[0], mode[1] === 'date' ? 'month' : mode[1]]
    },
    handleChange (value) {
      console.log('value in handleChange:', value)
      this.dateValue = value
      this.getTestVersionList()
    },
    setChangePlanStatusVisible () {
      console.log('in setChangePlanStatusVisible')
      this.changePlanStatusVisible = false
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
    handleStateSelectChange (value) {
      console.log('value in handleStateSelectChange: ', value)
      this.select_state_value = value
      this.getTestVersionList()
    },
    createOrModifyTestVersion (testVersionId) {
      console.log('testVersionId in createOrModifyTestVersion:', testVersionId)
      this.createFormVisible = true
      this.$refs.createOrModify.init(testVersionId)
    },
    deleteTestVersion (record) {
      console.log('in deleteTestVersion')
      this.deleteTestVersionVisible = true
      this.$refs.deleteTestVersion.init(record.id, record.test_version_name)
    },
    rowclick (record, index) {
      return {
        on: {
          click: () => {
            console.log(record, index, 'in rowclick')
            this.$router.push({
              name: 'caseTwoPlanList',
              query: { project_id: this.project_id, test_version_id: record.id }
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
    getTestVersionList () {
      // 增加时间段查询
      const formData = []
      this.dateValue.forEach(item => {
        formData.push(item.format('YYYY-MM-DD'))
      })
      const params = {
        project_id: this.project_id,
        test_version_name: this.test_version_name,
        state_list: this.select_state_value,
        start_date: formData[0],
        end_date: formData[1]
      }
      console.log('params in getTestVersionList:', params)
      this.loading = true
      getTestVersionList(params).then(res => {
        this.test_version_data = res.data
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
      this.queryData()
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
    changeDeleteTestVersionVisible () {
      this.deleteTestVersionVisible = false
    },
    queryData () {
      console.log('in queryData')
      this.getProjectList()
      this.getTestVersionList()
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
  .project_select_option {
    cursor: pointer;
  }
  .project_select_option:hover {
    color: #14C393;
  }
</style>
