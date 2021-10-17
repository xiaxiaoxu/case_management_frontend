
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
    <div class="table-page-search-wrapper">
      <a-card>
        <a-tabs default-active-key="1">
          <a-tab-pane key="1">
            <span slot="tab">模板管理</span>
            <div class="table-page-search-wrapper">
              <a-card :bordered="false">
                <div class="table-page-search-wrapper">
                  <a-row :gutter="12">
                    <a-col :md="38" :lg="19">
                      <a-input
                        allowClear
                        size="large"
                        v-model="template_name"
                        placeholder="搜索模板（按enter搜索）"
                        @pressEnter="getCaseTemplateList"
                        style="margin-left: -16px; width: 25%"
                      >
                        <a-icon slot="prefix" type="search" :style="{ fontSize: '15px', marginLeft: '-5px' }"/>
                      </a-input>
                    </a-col>
                    <a-col :md="10" :lg="5">
                      <a-button type="primary" @click="createOrModifyTestCaseTemplate()">+新建模板</a-button>
                      <span style="margin-left: 20px;">|</span>
                      <span style="margin-left: 20px;">共</span>
                      <span style="margin-left: 5px;">{{ this.caseTemplateList.length }}</span>
                      <span style="margin-left: 5px;">个模板</span>
                    </a-col>
                  </a-row>
                </div>
              </a-card>
              <div class="case-section">
                <a-table
                  bordered
                  :columns="caseTemplateColumns"
                  :customRow="rowclick"
                  rowKey="id"
                  :data-source="caseTemplateList"
                  :loading="loading"
                  class="select-table"
                >
                  <template slot="operation" slot-scope="text, record">
                    <a class="active" @click.stop="createOrModifyTestCaseTemplate(record.id)">编辑</a>
                    <a class="active" @click.stop="deleteTemplate(record)">删除</a>
                  </template>
                  <template slot="template_name" slot-scope="text">
                    <a-row :gutter="1">
                      <a-col :span="22">
                        <div style="margin-left: 12px">
                          <a-icon type="profile" />
                          <span style="margin-left: 5px">{{ text }}</span>
                        </div>
                      </a-col>
                    </a-row>
                  </template>
                </a-table>
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="2">
            <span slot="tab">回收站</span>
            <div class="table-page-search-wrapper">
              <a-card :bordered="false">
                <div class="table-page-search-wrapper">
                  <a-form :form="caseForm" layout="inline" @submit="handleSubmit">
                    <a-row :gutter="12">
                      <a-col :md="8" :lg="4">
                        <a-form-item label="标题">
                          <a-input
                            allowClear
                            placeholder="请输入"
                            v-decorator="[
                              'case_title',
                              { rules: [{ required: false }] },
                            ]"
                          />
                        </a-form-item>
                      </a-col>
                      <a-col :md="12" :lg="6">
                        <a-form-item label="创建时间">
                          <a-range-picker
                            :value="createDateValue"
                            :ranges="createDateRangeValues"
                            :defaultPickerValue="createDateDefaultPickerValue"
                            @panelChange="handleCreateDatePanelChange"
                            @change="handleCreateDataChange"
                          />
                        </a-form-item>
                      </a-col>
                      <a-col :md="12" :lg="6">
                        <a-form-item label="删除时间">
                          <a-range-picker
                            :value="deleteDateValue"
                            :ranges="deleteDateRangeValues"
                            :defaultPickerValue="deleteDateDefaultPickerValue"
                            @panelChange="handleDeleteDatePanelChange"
                            @change="handleDeleteDateChange"
                          />
                        </a-form-item>
                      </a-col>
                      <a-col :md="6" :lg="3">
                        <a-button style="float: right; margin-right: 10px;" type="primary" html-type="submit">查询</a-button>
                      </a-col>
                    </a-row>
                    <a-row :gutter="14" style="margin-top: 10px">
                      <a-col :md="8" :lg="4">
                        <a-form-item label="创建人">
                          <a-input
                            allowClear
                            placeholder="请输入"
                            v-decorator="[
                              'create_person',
                              { rules: [{ required: false }] },
                            ]"
                          />
                        </a-form-item>
                      </a-col>
                      <a-col :md="8" :lg="4">
                        <a-form-item label="删除人">
                          <a-input
                            allowClear
                            placeholder="请输入"
                            v-decorator="[
                              'delete_person',
                              { rules: [{ required: false }] },
                            ]"
                          />
                        </a-form-item>
                      </a-col>
                    </a-row>
                  </a-form>
                </div>
              </a-card>
              <div class="recybin-section">
                <div v-show="hasSelected" class="recyle-handle-select">
                  <span style="margin-left: 4px">
                    <template v-if="hasSelected">
                      {{ `已选中 ${selectedRowKeys.length} 项` }}
                    </template>
                  </span>
                  <a-button type="link" :loading="loading" @click="recoverCase(selectedRowKeys)">
                    恢复
                  </a-button>
                </div>
                <a-table
                  bordered
                  :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
                  :columns="recycleBinCaseColumns"
                  rowKey="id"
                  :data-source="testCaseList"
                  :loading="loading"
                  class="select-table"
                  :pagination="pagination"
                >
                  <template slot="operation" slot-scope="text, record">
                    <a class="active" @click="recoverCase([record.id])">恢复</a>
                    <a class="active" @click="recycleCaseDetail(record)">详情</a>
                  </template>
                  <template slot="case_name" slot-scope="text, record">
                    <a-row :gutter="1">
                      <a-col :span="2">
                        <a-tag v-if="record.if_need_automated === 'Y'" color="#14C393"><span class="title_tag">auto</span></a-tag>
                      </a-col>
                      <a-col :span="22">
                        <div style="margin-left: 12px">
                          <span style="margin-left: 0px">{{ text }}</span>
                        </div>
                      </a-col>
                    </a-row>
                  </template>
                  <template slot="case_level" slot-scope="text, record">
                    <a-tag v-if="record.case_level === 'Level 1'" color="#E86452"><div class="title_tag">{{ record.case_level }}</div></a-tag>
                    <a-tag v-if="record.case_level === 'Level 2'" color="#FF9845"><div class="title_tag">{{ record.case_level }}</div></a-tag>
                    <a-tag v-if="record.case_level === 'Level 3'" color="#F6BD16"><div class="title_tag">{{ record.case_level }}</div></a-tag>
                  </template>
                </a-table>
              </div>
            </div>
          </a-tab-pane>
        </a-tabs>
      </a-card>
    </div>
    <DeleteTemplate
      :deleteTemplateVisible="this.deleteTemplateVisible"
      ref="deleteTemplate"
      @changeDeleteTemplateVisible="changeDeleteTemplateVisible"
      @queryData="getCaseTemplateList"
    />
    <CreateTemplateForm
      :createTemplateVisible="this.createTemplateVisible"
      ref="createCaseTemplate"
      @changeCreateVisible="changeCreateVisible"
      @queryData="getCaseTemplateList"
    />
    <RecycleCaseDetail
      :recycleCaseDetailVisible="this.recycleCaseDetailVisible"
      :projectName="this.initialProjectName"
      :projectId="this.project_id"
      ref="recycleCaseDetail"
      @queryData="queryData"
      @changeRecycleCaseDetailVisible="changeRecycleCaseDetailVisible"
    />
  </div>
</template>
<script>
import CreateTemplateForm from './CreateTemplateForm'
import { getProjectList, findProjectById } from '@/api/case/project_two'
import { getRecycleBinCases, recoverRecycleBinCase, getCaseTemplateList } from '@/api/case/case_two'
import RecycleCaseDetail from './RecycleCaseDetail'
import moment from 'moment'
import ProjectListWindow from './component/ProjectListWindow.vue'
import DeleteTemplate from './component/DeleteTemplate.vue'

const recycleBinCaseColumns = [
    {
      title: '编号',
      dataIndex: 'id',
      key: 'id',
      scopedSlots: { customRender: 'id' },
      width: 100
    },
    {
      title: '用例id',
      dataIndex: 'case_id',
      key: 'case_id',
      scopedSlots: { customRender: 'case_id' },
      width: 100
    },
    {
      title: '标题',
      dataIndex: 'case_name',
      key: 'case_name',
      scopedSlots: { customRender: 'case_name' },
      width: 420
    },
    {
      title: '删除人',
      dataIndex: 'delete_person',
      key: 'delete_person',
      width: 120
    },
    {
      title: '删除时间',
      dataIndex: 'delete_time',
      key: 'delete_time',
      scopedSlots: { customRender: 'delete_time' }
    },
    {
      title: '创建人',
      dataIndex: 'create_person',
      key: 'create_person ',
      scopedSlots: { customRender: 'user_name_cn' }
    },
    {
      title: '创建时间',
      dataIndex: 'created_time',
      key: 'created_time ',
      scopedSlots: { customRender: 'created_time' }
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation ',
      scopedSlots: { customRender: 'operation' }
    }
  ]

const caseTemplateColumns = [
      {
        title: '模板名称',
        dataIndex: 'template_name',
        key: 'template_name',
        scopedSlots: { customRender: 'template_name' },
        width: '50%'
      },
      {
        title: '创建人',
        dataIndex: 'user_name_cn',
        key: 'user_name_cn ',
        scopedSlots: { customRender: 'user_name_cn' },
        align: 'center'
      },
      {
        title: '更新时间',
        dataIndex: 'modified_time',
        key: 'modified_time ',
        scopedSlots: { customRender: 'created_time' },
        align: 'center'
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation ',
        scopedSlots: { customRender: 'operation' },
        align: 'center'
      }
    ]
const nowDate = new Date()
const startDate = moment(new Date(nowDate.getFullYear(), nowDate.getMonth() - 1, nowDate.getDate()))
const endDate = moment()
export default {
  name: 'CaseTwoPlanList',
  components: {
    RecycleCaseDetail,
    ProjectListWindow,
    CreateTemplateForm,
    DeleteTemplate
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
      recycleBinCaseColumns,
      caseTemplateColumns,
      data: [],
      projectListWindowVisible: false,
      projectListWindowInited: false,
      projectForm: this.$form.createForm(this, { name: 'projectForm' }),
      caseForm: this.$form.createForm(this, { name: 'caseForm' }),
      projectList: [],
      categoryList: [],
      project: undefined,
      category: undefined,
      project_name: '',
      createTemplateVisible: false,
      confirmLoading: false,
      deleteTemplateVisible: false,
      planId: 0,
      loading: false,
      initialProjectName: '',
      template_id: 0,
      project_id: 0,
      case_id_list: [],
      caseTemplateList: [],
      testCaseList: [],
      project_list: [],
      selectedRowKeys: [],
      case_level_list: ['Level 1', 'Level 2', 'Level 3'],
      createDateValue: [],
      createDateDefaultPickerValue: [],
      createDateRangeValues: {},
      deleteDateValue: [],
      deleteDateDefaultPickerValue: [],
      deleteDateRangeValues: {},
      template_name: '',
      create_person: '',
      delete_person: '',
      recycleCaseDetailVisible: false,
      hasSelected: false,
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
    console.log('in created of Setting.vue:')
    this.setCreateDateDefaultDate()
    this.setCreateDateRangeValue()
    this.setDeleteDateDefaultDate()
    this.setDeleteDateRangeValue()
    console.log('this.$route.query.project_id: ', this.$route.query.project_id)
    console.log('this.$store.state.caseTwo: ', this.$store.state.caseTwo)
    if (this.$store.state.caseTwo.case_two_global_project_name && this.$store.state.caseTwo.case_two_global_project_id) {
      this.$router.push({
        name: 'caseTwoSetting',
        query: { project_id: this.$store.state.caseTwo.case_two_global_project_id }
      })
      this.initialProjectName = this.$store.state.caseTwo.case_two_global_project_name
      this.project_id = this.$store.state.caseTwo.case_two_global_project_id
      this.queryData()
    } else if (this.$route.query.project_id) {
      this.$router.push({
        name: 'caseTwoSetting',
        query: { project_id: this.$route.query.project_id }
      })
      this.project_id = parseInt(this.$route.query.project_id)
      findProjectById(this.$route.query.project_id).then(res => {
        this.initialProjectName = res.data.project_name
        this.$store.commit('case_two_global_project_name', res.data.project_name)
        this.$store.commit('case_two_global_project_id', res.data.id)
        console.log('this.$store.state.caseTwo: ', this.$store.state.caseTwo)
      })
      this.queryData()
    } else {
      console.log('this.$store.state.caseTwo.case_two_global_project_id: ', this.$store.state.caseTwo.case_two_global_project_id)
      this.$router.push({
          name: 'caseTwoProjectList'
      })
    }
  },
  watch: {
    selectedRowKeys () {
      console.log('in watch')
      this.hasSelected = this.selectedRowKeys.length > 0
      console.log('this.hasSelected:', this.hasSelected)
    }
  },
  methods: {
  rowclick (record, index) {
      return {
        on: {
          click: () => {
            console.log(record, index, 'in rowclick')
            this.createOrModifyTestCaseTemplate(record.id)
          }
        }
      }
    },
    changeCreateVisible () {
      this.createTemplateVisible = false
    },
    changeDeleteTemplateVisible () {
      this.deleteTemplateVisible = false
    },
    createOrModifyTestCaseTemplate (templateId) {
      console.log('in createOrModifyTestCaseTemplate')
      this.createTemplateVisible = true
      this.$refs.createCaseTemplate.init(templateId)
    },
    deleteTemplate (templateInfo) {
      console.log('templateInfo in deleteTemplate: ', templateInfo)
      console.log('templateId in deleteTemplate: ', templateInfo.template_name)
      this.deleteTemplateVisible = true
      this.$refs.deleteTemplate.init(templateInfo)
    },
    deleteTestCase (caseIdList, type = 'multile') {
      console.log('in deleteTestCase')
      console.log('caseIdList: ', caseIdList)
      this.deleteCaseVisible = true
      this.$refs.deleteCase.init(caseIdList, type)
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
    moment,
    // onSelectChange (selectedRowKeys) {
    //     console.log('selectedRowKeys changed: ', selectedRowKeys);
    //     this.selectedRowKeys = selectedRowKeys;
    //   },
    recoverCase (caseIdList) {
      console.log('in recoverCase')
      console.log('caseIdList in recoverCase: ', caseIdList)
      this.hasSelected = false
      this.selectedRowKeys = []
      const params = {
        case_id_list: caseIdList
      }
      recoverRecycleBinCase(params).then(res => {
        console.log('res.data in recoverRecycleBinCase: ', res.data)
        this.queryData()
      }).catch(err => {
          this.$message.error(err.message)
        })
    },
    changeHasSelected () {
        console.log('in changeHasSelected');
        this.selectedRowKeys = []
        console.log('this.hasSelected:', this.hasSelected)
      },
    recycleCaseDetail (caseInfo) {
      console.log('in recycleCaseDetail')
      this.recycleCaseDetailVisible = true
      this.$refs.recycleCaseDetail.init(caseInfo, this.initialProjectName)
    },
    changeRecycleCaseDetailVisible () {
      this.recycleCaseDetailVisible = false
    },
    queryData () {
      console.log('in queryData')
      const params = {
        case_title: '',
        project_id: this.project_id
      }
      console.log('params to getRecycleBinCases: ', params)
      getRecycleBinCases(params).then(res => {
        this.testCaseList = res.data
      }).catch(err => {
        this.$message.error(err.message)
      })
      this.getProjectList()
      this.getCaseTemplateList()
    },
    getCaseTemplateList () {
      console.log('in getCaseTemplateList')
      const params = {
        project_id: this.project_id,
        template_name: this.template_name
      }
      console.log('params in getCaseTemplateList:', params)
       getCaseTemplateList(params).then(res => {
         this.caseTemplateList = res.data
       }).catch(err => {
        this.$message.error(err.message)
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
            // console.log(`res.data[${i}]:`, res.data[i])
            if (res.data[i].id === this.project_id) {
              this.initialProjectName = res.data[i].project_name
              console.log('this.initialProjectName:', this.initialProjectName)
              break
            }
          }
        }
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    handleSubmit (e) {
      e.preventDefault();
      const { caseForm: { validateFields } } = this
      console.log()
      validateFields((errors, values) => {
        console.log('errors: ', errors)
        console.log('values: ', values)
        if (!errors) {
          console.log('in queryData')
          const createDate = []
          this.createDateValue.forEach(item => {
            createDate.push(item.format('YYYY-MM-DD'))
          })
          const deleteDate = []
          this.deleteDateValue.forEach(item => {
            deleteDate.push(item.format('YYYY-MM-DD'))
          })
          const params = {
            case_title: values.case_title,
            create_start_date: createDate[0],
            create_end_date: createDate[1],
            delete_start_date: deleteDate[0],
            delete_end_date: deleteDate[1],
            project_id: this.project_id,
            create_person: values.create_person,
            delete_person: values.delete_person
          }
          console.log('params to getRecycleBinCases: ', params)
          getRecycleBinCases(params).then(res => {
            this.testCaseList = res.data
          }).catch(err => {
            this.$message.error(err.message)
          })
        }
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
      // this.module_id重新设为0
      this.module_id = 0
      // 移除组件，用于刷新模型树，ModuleTree组件重新渲染时会根据project_id查找模型数据
      this.updateTreeComp = false
      // 在组件移除后，重新渲染组件
      // this.$nextTick可实现在DOM 状态更新后，执行传入的方法。
      this.$nextTick(() => {
          this.updateTreeComp = true
      })
      // 刷新模块树后，查询一遍用例，该项目下所有用例
      this.queryData()
    },
    onSelectChange (selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys;
    },
    setCreateDateDefaultDate () {
      this.createDateDefaultPickerValue.push(startDate)
      this.createDateDefaultPickerValue.push(endDate)
    },
    setCreateDateRangeValue () {
      const nowDate = new Date()
      let startDate = ''
      const valueDict = {}
      startDate = moment().subtract(7, 'days')
      valueDict['最近7天'] = [startDate, moment()]
      startDate = moment(new Date(nowDate.getFullYear(), nowDate.getMonth() - 2, nowDate.getDate()))
      valueDict['最近二月'] = [startDate, moment()]
      startDate = moment(new Date(nowDate.getFullYear(), nowDate.getMonth() - 3, nowDate.getDate()))
      valueDict['最近三月'] = [startDate, moment()]
      this.createDateRangeValues = valueDict
    },
    handleCreateDataChange (value) {
        this.createDateValue = value
    },
    handleCreateDatePanelChange (value, mode) {
      this.createDateValue = value
      this.mode = [mode[0] === 'date' ? 'month' : mode[0], mode[1] === 'date' ? 'month' : mode[1]]
    },
    setDeleteDateDefaultDate () {
      this.deleteDateDefaultPickerValue.push(startDate)
      this.deleteDateDefaultPickerValue.push(endDate)
    },
    setDeleteDateRangeValue () {
      const nowDate = new Date()
      let startDate = ''
      const valueDict = {}
      startDate = moment().subtract(7, 'days')
      valueDict['最近7天'] = [startDate, moment()]
      startDate = moment(new Date(nowDate.getFullYear(), nowDate.getMonth() - 2, nowDate.getDate()))
      valueDict['最近二月'] = [startDate, moment()]
      startDate = moment(new Date(nowDate.getFullYear(), nowDate.getMonth() - 3, nowDate.getDate()))
      valueDict['最近三月'] = [startDate, moment()]
      this.deleteDateRangeValues = valueDict
    },
    handleDeleteDateChange (value) {
        this.deleteDateValue = value
    },
    handleDeleteDatePanelChange (value, mode) {
      this.deleteDateValue = value
      this.mode = [mode[0] === 'date' ? 'month' : mode[0], mode[1] === 'date' ? 'month' : mode[1]]
    },
    handleProjectChange (value) {
      console.log(`Selected: ${value}`);
      console.log('value:', value)
      this.project_id = parseInt(`${value}`)
      console.log('this.project_id:', this.project_id)
      // this.module_id重新设为0
      this.module_id = 0
      this.queryData()
    },
    gotoHomePage () {
        console.log('### in gotoHomePage')
        this.$router.push({
        name: 'caseTwoProjectList'
      })
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

 .title_tag {
    font-weight: bold;
    color: white;
    font-size: 5px;
  }
</style>
