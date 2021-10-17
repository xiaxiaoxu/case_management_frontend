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
            <div class="select_option" @click="openPlanListWindow">
              <span style="font-size: 20px;">{{ this.initialProjectName }}</span>
              <a-icon type="down" style="margin-left: 12px; position: absolute; top: 10px;"/>
            </div>
          </a-popover>
        </a-col>
      </a-row>
    </div>
    <div class="plan_list_title_div">
      <a-row :gutter="24">
        <a-col :md="30" :lg="15" style="margin-top: 14px;">
          <span style="margin-left: 15px;">全部代码库</span>
        </a-col>
      </a-row>
    </div>
    <div style="margin-top: 10px;">
      <a-row :gutter="24">
        <a-col :md="10" :lg="5">
          <div class="auto-case-case-repository-section">
            <a-card
              :bordered="false"
              type="inner"
              :body-style="{padding: '0 0 0 0'}">
              <span slot="title">
                <a-icon type="code" style="font-size: 16px; position: relative; top: 1px; "/>
                <span style="margin-left: 5px;">代码库</span>
                <a type="primary" style="position: absolute; right: 40px;" @click="addCodeRepository()">+添加代码库</a>
              </span>
              <div style="margin-top: 15px;">
                <div
                  class="codeRepositoryOption"
                  v-for="(item, index) in code_repository_list"
                  :key="index"
                  @mouseenter="onMouseEnter(item)"
                  @mouseleave="onMouseOut(item)"
                  @click="getCurrentRepository(item)">
                  <span style="position: relative; top: 3px;">
                    <a-icon type="gitlab" style="font-size: 15px; margin-left: 20px; position: relative; top: 2px;"/>
                    <span style="margin-left: 5px;">{{ item.repository_title }}</span>
                  </span>
                  <span style="float: right; margin-right: 15px; margin-top: 2px;">
                    <a-popover trigger="hover" placement="top" :auto-adjust-overflow="true">
                      <template slot="content">
                        <span>删除</span>
                      </template>
                      <span>
                        <a-icon v-if="item.delete_visible" type="delete" @click="delete_repository(item)"/>
                      </span>
                    </a-popover>
                  </span>
                </div>
              </div>
            </a-card>
          </div>
        </a-col>
        <a-col :md="38" :lg="19">
          <a-card
            :bordered="false"
            :body-style="{padding: '20px 10px 10px 10px'}">
            <div class="table-page-search-wrapper">
              <a-row :gutter="12" style="margin-top: -10px;">
                <a-col :md="18" :lg="9">
                  <span style="font-weight: bold; position: relative; top: 3px;">{{ current_repository_title }}</span>
                  <a-popover trigger="hover" placement="top" :auto-adjust-overflow="true">
                    <template slot="content">
                      <span>编辑</span>
                    </template>
                    <span>
                      <a-icon type="setting" style="margin-left: 5px; position: relative; top: 2px;" @click="addCodeRepository(current_repository_id)"/>
                    </span>
                  </a-popover>
                </a-col>
                <a-col :md="30" :lg="15">
                  <!-- <a-button type="primary" style="float: right;">重新解析</a-button> -->
                  <span style="float: right; margin-right: 15px; position: relative; top: 5px;">
                    <span v-if="current_repository_clone_status !== '0' && current_repository_clone_status !== ''">
                      <a-icon type="loading" style="color: green; margin-right: 5px;" />
                      <span>代码解析中...</span>
                    </span>
                    <span v-if="current_repository_clone_status === '0'">
                      <a-icon type="check-circle" style="color: green; margin-right: 5px;"/>
                      <span>代码解析完成</span>
                    </span>
                  </span>
                </a-col>
              </a-row>
              <a-card
                type="inner"
                :body-style="{padding: '0 0 0 0'}"
                style="margin-top: 10px;">
                <a-row :gutter="12" style="margin-top: 10px;">
                  <a-col :md="24" :lg="12">
                    <span style="margin-left: 10px;">代码库地址:</span>
                    <span style="margin-left: 10px;">{{ current_repository_address }}</span>
                  </a-col>
                  <a-col :md="10" :lg="5">
                    <span style="margin-left: 20px;">分支:</span>
                    <span style="margin-left: 10px;">{{ current_repository_branch }}</span>
                  </a-col>
                  <a-col :md="14" :lg="7">
                    <span style="margin-left: 20px;">项目:</span>
                    <span style="margin-left: 10px;">{{ initialProjectName }}</span>
                  </a-col>
                </a-row>
                <a-row :gutter="12" style="margin-top: 5px; margin-bottom: 5px;">
                  <!-- <a-col :md="24" :lg="12">
                    <span style="margin-left: 10px;">脚本命令:</span>
                    <span style="margin-left: 10px;">{{ current_repository_shell_cmd }}</span>
                  </a-col>
                  <a-col :md="10" :lg="5">
                    <span style="margin-left: 20px;">环境变量文件路径:</span>
                    <span style="margin-left: 10px;">{{ current_repository_environment_file_path }}</span>
                  </a-col> -->
                  <a-col :md="14" :lg="7">
                    <span style="margin-left: 10px;">测试框架:</span>
                    <span style="margin-left: 10px;">{{ current_repository_framework_type }}</span>
                  </a-col>
                </a-row>
              </a-card>
            </div>
          </a-card>
          <div class="case-section">
            <a-card
              type="inner"
              :body-style="{padding: '0 0 0 0'}">
              <a-row :gutter="12" style="margin-top: 10px;">
                <a-col :md="12" :lg="6">
                  <a-input
                    allowClear
                    v-model="search_case_name"
                    placeholder="搜索用例"
                    @pressEnter="queryCaseData()"
                    style="margin-left: 10px;"
                  >
                    <a-icon slot="prefix" type="search"/>
                  </a-input>
                </a-col>
              </a-row>
              <a-row :gutter="12" style="margin-top: 15px; margin-bottom: 15px;">
                <a-col :md="40" :lg="20">
                  <span style="margin-left: 10px; margin-top: 15px;">功能用例总数：</span><span>{{ this.testCaseList.length }}</span>
                  <span style="margin-left: 20px;">需匹配用例数：</span><span>{{ this.need_automated_num }}</span>
                  <span style="margin-left: 20px;">已匹配用例数：</span><span>{{ this.automated_num }}</span>
                  <span style="margin-left: 20px;">自动化覆盖率：</span><span>{{ this.auto_case_cover_rate }}</span>
                </a-col>
              </a-row>
            </a-card>
            <a-row :gutter="6" style="margin-top: 0px;">
              <a-col :md="10" :lg="5">
                <div class="auto-case-module-section">
                  <a-card
                    type="inner"
                    title="模块"
                    :body-style="{padding: '0 10px 0 10px'}">
                    <AutoCaseModuleTree
                      v-if="updateTreeComp"
                      ref="ModuleTreeRef"
                      @getTestCase="queryCaseData"
                      @changeHasSelected="changeHasSelected"
                      :projectId="this.project_id"
                      style="margin-top: 15px; height: 935px;"
                    />
                  </a-card>
                </div>
              </a-col>
              <a-col :md="38" :lg="19">
                <a-table
                  bordered
                  :columns="columns"
                  :customRow="rowclick"
                  rowKey="id"
                  :data-source="testCaseList"
                  :loading="loading"
                  class="select-table"
                  :pagination="pagination"
                  :scroll="{ y: 900 }"
                >
                  <template slot="operation" slot-scope="text, record">
                    <a-popconfirm placement="top" ok-text="确定" cancel-text="取消" @confirm="removePlanCase([record.id])">
                      <template slot="title">
                        <p>确认移除该用例么？</p>
                      </template>
                      <a :disabled="iteration_status !== '0'" @click.stop>移除</a>
                    </a-popconfirm>
                  </template>
                  <template slot="case_name" slot-scope="text">
                    <a-row :gutter="1">
                      <a-col :span="2">
                        <!-- <a-tag style="padding-left: 1px; padding-right: 1px;" v-if="record.if_need_automated === 'Y'" color="#14C393"><span class="class_tag">auto</span></a-tag> -->
                      </a-col>
                      <a-col :span="22">
                        <div style="margin-left: 5px">
                          <span>{{ text }}</span>
                        </div>
                      </a-col>
                    </a-row>
                  </template>
                  <div slot="auto_case_name" slot-scope="text, record">
                    <div>
                      <a-icon v-if="record.openAutoCaseWindowVisible" type="search" style="float: right; font-size: 15px;" />
                      <span style="cursor: default;">{{ text }}</span>
                    </div>
                  </div>
                </a-table>
              </a-col>
            </a-row>
          </div>
        </a-col>
      </a-row>
    </div>
    <CreateCodeRepositoryForm
      :createFormVisible="this.create_repository_visible"
      ref="createOrModify"
      @changeCreateVisible="changeCreateVisible"
      @queryData="getCodeRepositoryData"
    />
    <AutoCaseSelectWindow
      :autoCaseSelectWindowVisible="this.auto_case_select_window_visible"
      ref="autoCaseSelectWindowRef"
      :codeRepositoryId="this.current_repository_id"
      @changeSelectWindowVisible="changeSelectWindowVisible"
      @queryData="queryCaseData"
    />
  </div>
</template>

<script>

  import CreateCaseForm from './CreateCaseForm'
  import AutoCaseModuleTree from './component/AutoCaseModuleTree'
  import { getProjectList, findProjectById } from '@/api/case/project_two'
  import { getCodeRepositoryData, getRepositoryCloneStatus } from '@/api/case/code_repository'
  import { getPlanCaseData, getManualCasesWithAutoCaseInfo } from '@/api/case/case_two'
  import { findPlanData, getTestPlanList } from '@/api/case/plan_two'
  import PlanModuleTree from './component/PlanModuleTree'
  import CopyMoveCase from './component/CopyMoveCase'
  import DeleteCase from './component/DeleteCase'
  import ImportCase from './component/ImportCase'
  import PlanCaseDetail from './component/PlanCaseDetail'
  import SetExecutor from './component/SetExecutor'
  import DeleteMultiplePlanCase from './component/DeleteMultiplePlanCase'
  import CopyPlanForm from './component/CopyPlanForm'
  import DeletePlan from './component/DeletePlan'
  import ConfigPlanCase from './component/ConfigPlanCase'
  import TestReportModal from './TestReportModal'
  import ProjectListWindow from './component/ProjectListWindow.vue'
  import PlanListWindow from './component/PlanListWindow.vue'
  import ChangePlanStatusModal from './component/ChangePlanStatusModal.vue'
  import CreatePlanForm from './CreatePlanForm'
  import CreateCodeRepositoryForm from './CreateCodeRepositoryForm .vue'
  import ConfirmCreatePlanIteration from './component/ConfirmCreatePlanIteration.vue'
  import AutoCaseSelectWindow from './component/AutoCaseSelectWindow.vue'

  const stateMap = {
    '0': '未开始',
    '1': '运行中',
    '2': '已完成'
  }
  // case_priority: ['高', '中', '低'],
  //  execute_result: ['通过', '阻塞', '失败', '跳过', '未测'],
  const priorityMap = {
    '0': '高',
    '1': '中',
    '2': '低'
  }
  const executeResultMap = {
    '0': '通过',
    '1': '阻塞',
    '2': '失败',
    '3': '跳过',
    '4': '未测'
  }
  export default {
    name: 'Index',
    components: {
      AutoCaseModuleTree,
      CreateCaseForm,
      PlanModuleTree,
      CopyMoveCase,
      DeleteCase,
      ImportCase,
      PlanCaseDetail,
      SetExecutor,
      DeleteMultiplePlanCase,
      CopyPlanForm,
      DeletePlan,
      ConfigPlanCase,
      TestReportModal,
      ProjectListWindow,
      PlanListWindow,
      ChangePlanStatusModal,
      CreatePlanForm,
      ConfirmCreatePlanIteration,
      CreateCodeRepositoryForm,
      AutoCaseSelectWindow
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
        // columns定义到export里，便于访问this
        columns: [
          {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            scopedSlots: { customRender: 'id' },
            width: 50,
            align: 'center'
          },
          {
            title: '标题',
            dataIndex: 'case_name',
            key: 'case_name',
            scopedSlots: { customRender: 'case_name' },
            width: 300
          },
          {
            title: '自动化用例',
            dataIndex: 'auto_case_name',
            key: 'auto_case_name',
            scopedSlots: { customRender: 'auto_case_name' },
            width: 140,
            customCell: this.autoCaseNameCustomCell
          },
          {
            title: '代码库',
            dataIndex: 'code_repository_title',
            key: 'code_repository_title',
            scopedSlots: { customRender: 'code_repository_title' },
            width: 140
          }
        ],
        selectedRowKeys: [], // Check here to configure the default column
        data: [],
        project_name: '',
        code_repository_list: [],
        create_repository_visible: false,
        current_repository_id: 0,
        current_repository_title: '',
        current_repository_address: '',
        current_repository_branch: '',
        current_repository_shell_cmd: '',
        current_repository_environment_file_path: '',
        current_repository_framework_type: '',
        current_repository_desc: '',
        current_repository_clone_status: '',
        auto_case_select_window_visible: false,
        changePlanStatusVisible: false,
        planListWindowVisible: false,
        planListWindowInited: false,
        projectListWindowVisible: false,
        projectListWindowInited: false,
        testReportModalVisible: false,
        copyMoveVisible: false,
        editCaseVisible: false,
        caseDetailVisible: false,
        confirmLoading: false,
        loading: true,
        updateTreeComp: true,
        deleteVisible: true,
        setExecutorVisible: false,
        setExecuteResultPopOverVisible: false,
        setExecutePriorityPopOverVisible: false,
        deleteMultipleCaseVisible: false,
        confirmCreatePlanIterationVisible: false,
        deletePlanVisible: false,
        configPlanCaseVisible: false,
        execute_result_plan_case_id_list: [],
        execute_priority_plan_case_id_list: [],
        icon_visible: false,
        expandedKeys: [],
        checkedKeys: [],
        autoExpandParent: false,
        form: this.$form.createForm(this, { name: 'createCaseForm' }),
        projectForm: this.$form.createForm(this, { name: 'projectForm' }),
        add_title: '',
        search_case_name: '',
        add_show: false,
        createIterationNum: 0,
        modify_show: false,
        modify_iteration_name: '',
        span_show: false,
        defaultExpandedKeys: [],
        case_title: '',
        case_level_list: ['Level 1', 'Level 2', 'Level 3'],
        priorityMap,
        executeResultMap,
        search_case_level: '',
        if_need_automated: '',
        maintainer: '',
        initialProjectName: '',
        selectedKeys: [],
        deleteCaseVisible: false,
        hasSelected: false,
        testCaseList: [],
        iteration_id: 0,
        iteration_data_list: [],
        planOperationToolTipVisible: false,
        planOperationPopoverVisible: false,
        visible: false,
        importCaseVisible: false,
        module_loading: false,
        projectNameList: [],
        caseList: [],
        project_id: 0,
        plan_id: 0,
        plan_name: '',
        owner: '',
        pass_rate: '',
        plan_status: '',
        iteration_status: '',
        iteration_name: '',
        new_iteration_title: '',
        already_executed_case_num: '',
        automated_num: 0,
        need_automated_num: 0,
        auto_case_cover_rate: '',
        stateMap,
        module_id: 0,
        projectList: [],
        planList: [],
        treeDataList: [],
        totalPlanCases: 0,
        memberList: [],
        case_type_list: ['功能测试', '性能测试', '配置相关', '安装部署', '接口测试', '安全相关', '兼容性测试', 'UI测试', '其他'],
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
    filters: {
      stateFilter (state) {
        return stateMap[state]
      },
      priorityFilter (state) {
        return priorityMap[state]
      },
      executeResultFilter (state) {
        return executeResultMap[state]
      },
      memberFilter (members) {
        if (members) {
          return members.join('、')
        } else {
          return ''
        }
      }
    },
    created () {
      console.log('in created:')
      console.log('this.$route.query: ', this.$route.query)
      console.log('this.$route.query.project_id: ', this.$route.query.project_id)
      console.log('this.$store.state.caseTwo: ', this.$store.state.caseTwo)
      if (this.$store.state.caseTwo.case_two_global_project_name && this.$store.state.caseTwo.case_two_global_project_id) {
        this.$router.push({
          name: 'caseTwoAutoCaseList',
          query: { project_id: this.$store.state.caseTwo.case_two_global_project_id }
        })
        this.initialProjectName = this.$store.state.caseTwo.case_two_global_project_name
        this.project_id = this.$store.state.caseTwo.case_two_global_project_id
        this.queryData()
      } else if (this.$route.query.project_id) {
        this.$router.push({
          name: 'caseTwoAutoCaseList',
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
      openAutoCaseSelectWindow (caseId) {
        console.log('caseId in openAutoCaseSelectWindow: ', caseId)
        this.auto_case_select_window_visible = true
        this.$refs.autoCaseSelectWindowRef.init(caseId)
      },
      autoCaseNameCustomCell (record) {
        return {
          on: {
            mouseenter: (event) => {
              console.log('进入鼠标指向的单元格')
              console.log('data in mouseenter:', record)
              record.openAutoCaseWindowVisible = true
              console.log('record.openAutoCaseWindowVisible in mouseenter:', record.openAutoCaseWindowVisible)
            },
            mouseleave: (event) => {
              console.log('离开当前单元格')
              console.log('in mouseLeave')
              record.openAutoCaseWindowVisible = false
              console.log('record.openAutoCaseWindowVisible in mouseLeave:', record.openAutoCaseWindowVisible)
            },
            click: (event) => {
              event.stopPropagation()
              console.log('in click')
              console.log('this: ', this)
              this.openAutoCaseSelectWindow(record.id)
            }
          },
          style: record.openAutoCaseWindowVisible ? {
            'background-color': '#D3EEF9'
          } : {}
        }
      },
      editRepository () {
        console.log('in editRepository')
      },
      changeSelectWindowVisible () {
        console.log('in changeSelectWindowVisible')
        this.auto_case_select_window_visible = false
      },
      changeCreateVisible () {
        console.log('in changeCreateVisible')
        this.create_repository_visible = false
      },
      getCurrentRepository (data) {
        console.log('data in getCurrentRepository: ', data)
        this.current_repository_id = data.id
        this.current_repository_title = data.repository_title
        this.current_repository_address = data.repository_address
        this.current_repository_branch = data.branch
        this.current_repository_environment_file_path = data.environment_file_path
        this.current_repository_framework_type = data.framework_type
        this.current_repository_desc = data.repository_desc
        this.current_repository_clone_status = ''
        if (data.framework_type === 'Pytest') {
          this.current_repository_shell_cmd = 'pytest'
        } else {
          this.current_repository_shell_cmd = 'robot'
        }
        getRepositoryCloneStatus(data.id).then(res => {
          if (res.data) {
            this.current_repository_clone_status = res.data.clone_status
            console.log('res.data.clone_status: ', res.data.clone_status)
          }
        })
      },
      delete_repository (data) {
        console.log('data in delete_repository: ', data)
      },
      onMouseEnter (data) {
        console.log('in onMouseEnter')
        // data.delete_visible = true
      },
      onMouseOut (data) {
        console.log('in onMouseOut')
        data.delete_visible = false
      },
      changeHasSelected () {
        console.log('in changeHasSelected');
        this.selectedRowKeys = []
        console.log('this.hasSelected:', this.hasSelected)
      },
      queryCaseData (moduleId, treeNodeChildren) {
        // this.$message.info('用例查询中。')
        console.log('moduleId in queryCaseData:', moduleId)
        if (moduleId || moduleId === 0) {
          this.module_id = moduleId
        }
        if (treeNodeChildren) {
          this.tree_node_children = treeNodeChildren
        }
        const params = {
          project_id: this.project_id,
          module_id: moduleId || this.module_id,
          case_name: this.search_case_name,
          case_level: this.case_level,
          if_need_automated: this.if_need_automated,
          if_smoke_test: this.if_smoke_test,
          maintainer: this.maintainer,
          tree_node_children: treeNodeChildren
        }
        console.log('params in queryCaseData:', params)
        this.loading = true
        getManualCasesWithAutoCaseInfo(params).then(res => {
          this.testCaseList = res.data.case_data
          this.automated_num = res.data.automated_info.automated_num
          this.need_automated_num = res.data.automated_info.need_automated_num
          this.auto_case_cover_rate = res.data.automated_info.auto_case_cover_rate
          // // 移除组件，用于刷新模型树，ModuleTree组件重新渲染时会根据project_id查找模型数据
          // this.updateTreeComp = false
          // // 在组件移除后，重新渲染组件
          // // this.$nextTick可实现在DOM 状态更新后，执行传入的方法。
          // this.$nextTick(() => {
          //     this.updateTreeComp = true
          // })
        }).catch(err => {
          this.$message.error(err.message)
        }).finally(() => {
          this.loading = false
        })
      },
      searchTestCase () {
        console.log('in searchTestCase')
      },
      addCodeRepository (repositoryId) {
        console.log('repositoryId in addCodeRepository: ', repositoryId)
        this.create_repository_visible = true
        // 如果repositoryId有值，说明是编辑，则遍历代码库，把信息同步到编辑组件
        if (repositoryId) {
          for (let i = 0; i < this.code_repository_list.length; i++) {
            if (this.code_repository_list[i].id === repositoryId) {
              this.$refs.createOrModify.init(this.code_repository_list[i])
              return
            }
          }
          // 没返回说明没找到代码库，直接渲染空白页面
          this.$refs.createOrModify.init()
        } else {
          this.$refs.createOrModify.init()
        }
      },
      changeTestPlanStatus () {
        this.changePlanStatusVisible = true
        console.log('this.changePlanStatusVisible: ', this.changePlanStatusVisible)
        console.log('this.plan_id in runTestPlan:', this.plan_id)
        console.log('this.plan_name in runTestPlan:', this.plan_name)
        console.log('this.plan_status in runTestPlan:', this.plan_status)
        this.$refs.changePlanStatusModal.init(this.plan_status, this.plan_id, this.iteration_id, this.plan_name, this.iteration_name)
      },
      planListWindowInitedFun () {
        console.log('in planListWindowInitedFun')
        console.log('this.planListWindowInitedFun: ', this.planListWindowVisible)
        this.planListWindowInited = true
      },
      openPlanListWindow () {
        console.log('in openProjectListWindow')
        console.log('this.planList: ', this.planList)
        if (this.planListWindowInited === true) {
          this.$refs.planListWindowRef.init()
        }
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
      rowclick (record, index) {
        if (this.iteration_status !== '0') {
          return {}
        }
        return {
          on: {
            click: () => {
              console.log(record, index, 'in rowclick')
              this.testCaseDetail(record)
            }
          }
        }
      },
      gotoTestPlan () {
        console.log('in gotoTestPlan')
        this.$router.push({
        name: 'caseTwoPlanList',
        query: { project_id: this.$store.state.caseTwo.case_two_global_project_id }
        })
      },
      gotoHomePage () {
        console.log('### in gotoHomePage')
        this.$router.push({
        name: 'caseTwoProjectList'
        })
      },
      handleSubmit (e) {
        console.log('in handleSubmit')
        const { form: { validateFields } } = this
        validateFields((errors, values) => {
          console.log('errors: ', errors)
          console.log('values: ', values)
          if (!errors) {
            const params = {
              project_id: this.project_id,
              plan_id: this.plan_id,
              iteration_id: this.iteration_id,
              module_id: this.module_id,
              case_title: values.case_title,
              case_priority: values.case_priority,
              execute_result: values.execute_result,
              case_level: values.case_level,
              case_type: values.case_type,
              execute_person: values.execute_person
            }
            console.log('params in handleSubmit: ', params)
            getPlanCaseData(params).then(res => {
              this.testCaseList = res.data
              this.totalPlanCases = res.data.length
              // 移除组件，用于刷新模型树，ModuleTree组件重新渲染时会根据project_id查找模型数据
              this.updateTreeComp = false
              // 在组件移除后，重新渲染组件
              // this.$nextTick可实现在DOM 状态更新后，执行传入的方法。
              this.$nextTick(() => {
                  this.updateTreeComp = true
              })
            }).catch(err => {
              this.$message.error(err.message)
            })
          }
        })
      },
      handleChangePlan (planId) {
        console.log(`planId: ${planId}`);
        console.log('planId:', planId)
        this.planListWindowVisible = false
        // 重置迭代信息
        this.iteration_id = 0
        this.iteration_name = ''
        this.iteration_data_list = []
        for (var i = 0; i < this.planList.length; i++) {
          if (this.planList[i].id === planId) {
            console.log('this.planList[i].id === value: ', this.planList[i].id === planId)
            console.log('this.planList[i].plan_name: ', this.planList[i].plan_name)
            this.plan_id = this.planList[i].id
            this.plan_name = this.planList[i].plan_name
          }
        }
        // this.module_id重新设为0
        this.module_id = 0
        // 移除组件，用于刷新模型树，ModuleTree组件重新渲染时会根据project_id查找模型数据
        this.updateTreeComp = false
        // 在组件移除后，重新渲染组件
        // this.$nextTick可实现在DOM 状态更新后，执行传入的方法。
        this.$nextTick(() => {
            this.updateTreeComp = true
        })
        // 刷新模块树后，查询一遍项目信息和用例，该项目下所有用例
        this.findPlanData()
        this.queryPlanCaseData()
      },
      handleChangeProject (projectInfo) {
        console.log('projectInfo in handleChangeProject :', projectInfo)
        this.projectListWindowVisible = false
        this.initialProjectName = projectInfo.project_name
        this.project_id = projectInfo.id
        this.module_id = 0 // 重置this.module_id
        console.log('this.initialProjectName in handleChangeProject: ', this.initialProjectName)
        this.$store.commit('case_two_global_project_name', projectInfo.project_name)
        this.$store.commit('case_two_global_project_id', projectInfo.id)
        console.log('this.$store.state.caseTwo: ', this.$store.state.caseTwo)
        this.$router.push({
          name: 'caseTwoAutoCaseList',
          query: { project_id: projectInfo.id }
        })
        this.project_id = projectInfo.id
        this.current_repository_id = 0
        this.current_repository_title = ''
        this.current_repository_address = ''
        this.current_repository_branch = ''
        this.current_repository_environment_file_path = ''
        this.current_repository_framework_type = ''
        this.current_repository_desc = ''
        this.current_repository_clone_status = ''
        this.getCodeRepositoryData()
        this.queryCaseData()
        // 移除组件，用于刷新模型树，ModuleTree组件重新渲染时会根据project_id查找模型数据
        this.updateTreeComp = false
        // 在组件移除后，重新渲染组件
        // this.$nextTick可实现在DOM 状态更新后，执行传入的方法。
        this.$nextTick(() => {
            this.updateTreeComp = true
        })
      },
      cancelInputAndShowSpan (data) {
        console.log('this.add_title:', this.add_title)
        this.add_show = false
        this.span_show = true
        data.title = this.add_title
      },
      queryData () {
        console.log('in queryData of PlanDetail')
        this.getCodeRepositoryData()
        this.getProjectList()
        this.queryCaseData()
      },
      getCodeRepositoryData () {
        console.log('in getCodeRepositoryData')
        const params = {
          project_id: this.project_id
        }
        console.log('params in getCodeRepositoryData: ', params)
        getCodeRepositoryData(params).then(res => {
          this.code_repository_list = res.data
          if (res.data.length >= 1) {
            this.current_repository_id = res.data[0].id
            this.current_repository_title = res.data[0].repository_title
            this.current_repository_address = res.data[0].repository_address
            this.current_repository_branch = res.data[0].branch
            this.current_repository_environment_file_path = res.data[0].environment_file_path
            this.current_repository_framework_type = res.data[0].framework_type
            this.current_repository_desc = res.data[0].repository_desc
            this.current_repository_clone_status = res.data[0].clone_status
          }
        }).catch(err => {
          this.$message.error(err.message)
        })
      },
      findPlanData () {
        const params = {
          plan_id: this.plan_id,
          iteration_id: this.iteration_id
        }
        console.log('params in findPlanData: ', params)
        findPlanData(params).then(res => {
          console.log('res.data.project_id in findPlanData: ', res.data.project_id)
          console.log('this.project_id in findPlanData: ', this.project_id)
          if (res.data.project_id !== this.project_id) {
            this.$message.info('计划所属项目已修改，回到计划列表页')
            this.$router.push({
              name: 'caseTwoPlanList',
              query: { project_id: this.$store.state.caseTwo.case_two_global_project_id }
            })
          }
          this.iteration_data_list = res.data.iteration_data
          this.iteration_name = res.data.iteration_name
          this.iteration_id = res.data.iteration_id
          this.iteration_status = res.data.iteration_status
          console.log('this.iteration_status:', this.iteration_status)
          this.plan_name = res.data.plan_name
          this.owner = res.data.owner
          this.pass_rate = res.data.pass_rate
          this.already_executed_case_num = res.data.already_executed_case_num
          console.log('this.iteration_id in findPlanData: ', this.iteration_id)
          console.log('this.already_executed_case_num: ', this.already_executed_case_num)
          this.plan_status = res.data.plan_iteration_status
          console.log('this.plan_status:', this.plan_status)
          console.log('this.plan_name:', this.plan_name)
          this.selectedRowKeys = []
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
        const params = {
          project_id: this.project_id
        }
        console.log('params in getTestPlanList:', params)
        getTestPlanList(params).then(res => {
          this.planList = res.data
          console.log('this.planList: ', this.planList)
        }).catch(err => {
          this.$message.error(err.message)
        })
      },
      queryPlanCaseData (moduleId, treeNodeChildren) {
        // this.$message.info('用例查询中。')
        console.log('moduleId in queryPlanCaseData:', moduleId)
        const params = {
          module_id: moduleId || this.module_id,
          plan_id: this.plan_id,
          iteration_id: this.iteration_id,
          case_title: '',
          case_priority: '',
          execute_result: '',
          case_level: '',
          case_type: '',
          execute_person: '',
          tree_node_children: treeNodeChildren
        }
        console.log('params in queryPlanCaseData:', params)
        this.loading = true
        getPlanCaseData(params).then(res => {
          this.testCaseList = res.data
          this.totalPlanCases = res.data.length
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
  @import "./caseList.less";

  // 修改tabs滚动条粗细度
  /deep/ .ant-tabs-ink-bar-animated{
    bottom: 0;
  }
  .planOperationOption{
    width: 160px;
    height: 30px;
    cursor: pointer;
    margin-top: 5px;
    margin-bottom: 5px;
  }
  .planOperationOption:hover{
    background-color: #D3EEF9;
  }

  .executeResultOption{
    width: 160px;
    height: 30px;
    cursor: pointer;
    margin-bottom: 10px;
  }
  .executeResultOption:hover{
    background-color: #D3EEF9;
  }
  .codeRepositoryOption{
    // margin-left: 15px;
    // margin-top: 10px;
    height: 30px;
    cursor: pointer;
  }
 .codeRepositoryOption:hover{
    background-color: #D3EEF9;
  }

 .changeNameOption{
    width: 100px;
    height: 30px;
    cursor: pointer;
  }
 .changeNameOption:hover{
    background-color: #D3EEF9;
  }

  .executePriorityOption{
  width: 160px;
  height: 35px;
  cursor: pointer;
  margin-bottom: 10px;
  }
  .executePriorityOption:hover{
    background-color: #D3EEF9;
  }
  //直接在style中添加样式
  //这样使用会使得当前页面所有的table表格行样式都会改变
  //如果想要调整表头的行高，可以把下面的td改成th
  //调整body行属性
  /deep/ .ant-table-tbody > tr > td {
    padding: 12px;
  }
  //调整head行属性
  /deep/ .ant-table-thead > tr > th {
    padding: 12px;
  }

  /deep/ .ant-tree li span.ant-tree-switcher{
    width:16px;
    height:16px;
    margin:6px;
    // 修改树结构合起的icon
    &.ant-tree-switcher_close{
      // background:url('../../../assets/case/project.png') no-repeat;
      background-size:contain;
      // i{
      //   display: none;
      // }
    }
    // 修改树结构展开的icon
    &.ant-tree-switcher_open{
      // background:url('../../../assets/case/project_two.png') no-repeat;
      background-size:contain;
      // i{
      //   display: none;
      // }
    }
  }

  .links {
    a {
      display: block;
      margin: 12px 0;
      line-height: 24px;
      height: 24px;

      .link {
        font-size: 14px;
        color: #14C393;
        line-height: 24px;
        max-width: 100px;
        vertical-align: top;
        margin-left: 12px;
        transition: all 0.3s;
        display: inline-block;
        border-radius: 5px;
      }

      &:hover {
        span {
          color: #1890ff;
        }
      }
    }
  }

  .dashboard-img {
    img {
      width: 100%;
    }
  }
    .ant-card-body .but_type {
      float: right;
      position: absolute;
      right: 20px;
      width: 100px;
      text-align: right;
    }
  // new end
  /deep/ .ant-statistic-content {
    font-size: 19px;

    .active{
      margin-right: 5px;
    }

    .class_tag {
      font-weight: bold;
      color: white;
      font-size: 4px;
    }
  }

  .select_option {
    cursor: pointer;
  }
  .select_option:hover {
    color: #14C393;
  }
</style>
