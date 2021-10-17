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
    <div class="case-section">
      <a-row :gutter="24">
        <a-col :md="10" :lg="5">
          <div class="module-section">
            <a-card
              :bordered="true"
              type="inner"
              title="模块"
              :body-style="{padding: '0 10px 0 10px'}">
              <ModuleTree
                v-if="updateTreeComp"
                ref="ModuleTreeRef"
                @getTestCase="queryCaseData"
                @changeHasSelected="changeHasSelected"
                @openMoveModuleWindow="openMoveModuleWindow"
                :projectId="this.project_id"
                style="margin-top: 15px;"
              />
            </a-card>
          </div>
        </a-col>
        <a-col :md="38" :lg="19">
          <a-card :bordered="false">
            <div class="table-page-search-wrapper">
              <a-form :form="form" layout="inline" @submit="handleSubmit">
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
                  <a-col :md="10" :lg="5">
                    <a-form-item
                      label="用例级别"
                    >
                      <a-select
                        allowClear
                        v-decorator="[
                          'case_level',
                          { rules: [{ required: false, message: '请选择用例级别' }] },
                        ]"
                        placeholder="请选择"
                      >
                        <a-select-option v-for="case_level in case_level_list" :key="case_level">
                          {{ case_level }}
                        </a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :md="10" :lg="5">
                    <a-form-item label="维护人">
                      <a-input
                        allowClear
                        placeholder="请输入"
                        v-decorator="[
                          'maintainer',
                          { rules: [{ required: false }] },
                        ]"
                      />
                    </a-form-item>
                  </a-col>
                  <a-col :md="16" :lg="8">
                    <a-button style="float: right; margin-right: 10px;" type="primary" @click="createOrModifyTestCase()">+新建用例</a-button>
                    <a-button style="float: right; margin-right: 10px;" type="primary" html-type="submit">查询</a-button>
                  </a-col>
                  <a-col :md="2" :lg="1">
                    <a-tooltip placement="top" v-model="importExporttoolTipVisible">
                      <template slot="title">
                        <span>更多</span>
                      </template>
                      <a-icon
                        a-icon
                        type="menu"
                        @click="(e)=> openImportExportPopOver()"
                        style="fontSize: 30px; margin-top: 1px; color: #14C393;"
                      />
                    </a-tooltip>
                    <a-popover v-model="importExportPopoverVisible" placement="bottom" :auto-adjust-overflow="true">
                      <template slot="content">
                        <p>
                          <a-icon type="import" />
                          <a style="margin: 10px 20px 10px 10px" @click="importCase()">导入用例</a>
                          <ImportCase
                            :importCaseVisible="this.importCaseVisible"
                            ref="importCase"
                            @changeImportCaseVisible="changeImportCaseVisible"
                            @queryData="queryData"
                          />
                        </p>
                        <p>
                          <a-icon type="export" />
                          <a style="margin: 10px 20px 10px 10px" @click="exportCase()">导出用例</a>
                        </p>
                      </template>
                    </a-popover>
                  </a-col>
                </a-row>
                <a-row :gutter="14" style="margin-top: 5px">
                  <a-col :md="14" :lg="7">
                    <a-form-item
                      label="是否需要关联自动化"
                    >
                      <a-select
                        allowClear
                        v-decorator="[
                          'if_need_automated',
                          { rules: [{ required: false, message: '请选择' }] },
                        ]"
                        placeholder="请选择"
                      >
                        <a-select-option v-for="item in ['Y', 'N']" :key="item">
                          {{ item === 'Y' ? '是' : '否' }}
                        </a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <!-- <a-col :md="10" :lg="5">
                    <a-form-item
                      label="是否冒烟测试"
                    >
                      <a-select
                        allowClear
                        v-decorator="[
                          'if_smoke_test',
                          { rules: [{ required: false, message: '请选择' }] },
                        ]"
                        placeholder="请选择"
                      >
                        <a-select-option v-for="item in ['Y', 'N']" :key="item">
                          {{ item === 'Y' ? '是' : '否' }}
                        </a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col> -->
                </a-row>
              </a-form>
            </div>
          </a-card>
          <div>
            <div v-show="hasSelected" class="handle-select">
              <span style="margin-left: 4px">
                <template v-if="hasSelected">
                  {{ `已选中 ${selectedRowKeys.length} 项` }}
                </template>
              </span>
              <a-button type="link" :loading="loading" @click="copyTestCase(selectedRowKeys)">
                复制
              </a-button>
              <a-button type="link" :loading="loading" @click="moveTestCase(selectedRowKeys)">
                移动
              </a-button>
              <a-button type="link" :loading="loading" @click="deleteTestCase(selectedRowKeys, 'multiple')">
                删除
              </a-button>
              <a-popover v-model="setCaseLevelPopOverVisible" trigger="click" placement="bottomRight" :auto-adjust-overflow="true">
                <template slot="content">
                  <div class="setCaseLevelOption" @click="setMultipleCaseLevel('Level 1')">
                    <a-tag color="#E86452" style="margin-top: 8px; margin-left: 10px;"><div class="class_tag">Level 1</div></a-tag>
                  </div>
                  <div class="setCaseLevelOption" @click="setMultipleCaseLevel('Level 2')">
                    <a-tag color="#FF9845" style="margin-top: 8px; margin-left: 10px;"><div class="class_tag">Level 2</div></a-tag>
                  </div>
                  <div class="setCaseLevelOption" @click="setMultipleCaseLevel('Level 3')">
                    <a-tag color="#F6BD16" style="margin-top: 8px; margin-left: 10px;"><div class="class_tag">Level 3</div></a-tag>
                  </div>
                </template>
                <a-button type="link" :loading="loading" @click="openSetMultipleCaseLevelWindow(selectedRowKeys)">
                  设置用例级别
                </a-button>
                <!-- <a-button type="link" :loading="loading" @click="openMultiplePlanCaseExecutePriorityPopOver(selectedRowKeys)">
                  设置优先级
                </a-button> -->
              </a-popover>
              <a-button type="link" :loading="loading" @click="cancelSelectKeys()">
                取消选择
              </a-button>
            </div>
            <a-table
              bordered
              :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
              :columns="columns"
              :customRow="rowclick"
              rowKey="id"
              :data-source="testCaseList"
              :loading="loading"
              class="select-table"
              :pagination="pagination"
            >
              <template slot="operation" slot-scope="text, record">
                <a class="active" @click.stop="createOrModifyTestCase(record.id)">编辑</a>
                <a-divider type="vertical"/>
                <a class="active" @click.stop="deleteTestCase([record.id], 'single')">删除</a>
              </template>
              <template slot="order_number" slot-scope="text, record">
                <a-input
                  v-if="record.edit_visible"
                  :autoSize="true"
                  style="margin: -5px 0"
                  :value="text"
                  @change="e => handleChangeOrderNumber(e.target.value, record)"
                  @pressEnter="saveCaseOrderNumber(record)"
                  @click.stop=""
                  size="large"
                  @blur="cancelEdit(record)"
                />
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>修改编号</span>
                  </template>
                  <span v-if="!record.edit_visible" @click.stop="changeOrderNumber(record)" style="cursor: pointer;">{{ text }}</span>
                </a-tooltip>
              </template>
              <template slot="case_name" slot-scope="text">
                <a-row :gutter="1">
                  <!-- <a-col :span="2">
                    <a-tag style="padding-left: 2px; padding-right: 2px;" v-if="record.if_need_automated === 'Y'" color="#14C393"><span class="title_tag">auto</span></a-tag>
                  </a-col> -->
                  <a-col :span="22" style="margin-left: 5px;">
                    <div>
                      <span style="cursor: pointer;">{{ text }}</span>
                      <!-- <a-tag style="margin-left: 5px; padding-left: 2px; padding-right: 2px;" v-if="record.if_smoke_test === 'Y'" color="#FAAD14"><span class="title_tag">smoke</span></a-tag> -->
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
        </a-col>
      </a-row>
      <CreateCaseForm
        :createFormVisible="this.createFormVisible"
        ref="createTestCase"
        @changeCreateVisible="changeCreateVisible"
        @queryData="queryCaseData"
      />
      <CopyMoveCase
        :copyMoveVisible="this.copyMoveVisible"
        :projectName="this.initialProjectName"
        :projectId="this.project_id"
        ref="copyMoveCase"
        @changeCopyMoveVisible="changeCopyMoveVisible"
        @queryData="queryCaseData"
        @changeHasSelected="changeHasSelected"
      />
      <MoveModule
        :moveModuleVisible="this.moveModuleVisible"
        :projectName="this.initialProjectName"
        :projectId="this.project_id"
        ref="moveModuleRef"
        @queryData="updateModuleTree"
        @changeMoveModuleVisible="changeMoveModuleVisible"
      />
      <CaseDetail
        :caseDetailVisible="this.caseDetailVisible"
        :projectName="this.initialProjectName"
        :projectId="this.project_id"
        ref="caseDetail"
        @changeCaseDetailVisible="changeCaseDetailVisible"
      />
      <DeleteCase
        :deleteCaseVisible="this.deleteCaseVisible"
        ref="deleteCase"
        @changeDeleteCaseVisible="changeDeleteCaseVisible"
        @queryData="queryCaseDataAndReloadModuleTree"
        @changeHasSelected="changeHasSelected"
      />
    </div>
  </div>
</template>

<script>

  import CreateCaseForm from './CreateCaseForm'
  import { getProjectList, deleteProject } from '@/api/case/project_two'
  import { getCaseData, exportTestCase, saveCaseOrderNumber, setMultipleCaseLevel } from '@/api/case/case_two'
  import ModuleTree from './component/ModuleTree'
  import CopyMoveCase from './component/CopyMoveCase'
  import DeleteCase from './component/DeleteCase'
  import ImportCase from './component/ImportCase'
  import CaseDetail from './CaseDetail'
  import ProjectListWindow from './component/ProjectListWindow.vue'
  import MoveModule from './component/MoveModule.vue'

  // const apiUrl = `${process.env.VUE_APP_API_BASE_URL}`
  const columns = [
      {
        title: '编号',
        dataIndex: 'order_number',
        key: 'order_number',
        scopedSlots: { customRender: 'order_number' },
        width: 120
      },
      {
        title: '标题',
        dataIndex: 'case_name',
        key: 'case_name',
        scopedSlots: { customRender: 'case_name' },
        width: 500
      },
      {
        title: '维护人',
        dataIndex: 'maintainer',
        key: 'maintainer',
        width: 120,
        align: 'center'
      },
      {
        title: '用例级别',
        dataIndex: 'case_level',
        key: 'case_level',
        scopedSlots: { customRender: 'case_level' },
        align: 'center',
        width: 140
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation ',
        scopedSlots: { customRender: 'operation' },
        align: 'center',
        width: 140
      }
    ]
  export default {
    name: 'Index',
    components: {
      CreateCaseForm,
      ModuleTree,
      CopyMoveCase,
      DeleteCase,
      ImportCase,
      CaseDetail,
      ProjectListWindow,
      MoveModule
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
        editingKey: '',
        selectedRowKeys: [], // Check here to configure the default column
        data: [],
        dateValue: [],
        rangeValues: {},
        categoryList: [],
        project_name: '',
        projectListWindowVisible: false,
        projectListWindowInited: false,
        recycleBinVisible: false,
        createFormVisible: false,
        copyMoveVisible: false,
        editCaseVisible: false,
        caseDetailVisible: false,
        confirmLoading: false,
        loading: true,
        updateTreeComp: true,
        openAllModuleFolderVisible: false,
        verticalRightVisible: false,
        expandedKeys: [],
        checkedKeys: [],
        autoExpandParent: false,
        form: this.$form.createForm(this, { name: 'createCaseForm' }),
        projectForm: this.$form.createForm(this, { name: 'projectForm' }),
        add_title: '',
        span_title: 'hello',
        add_show: true,
        span_show: false,
        defaultExpandedKeys: [],
        case_title: '',
        case_level_list: ['Level 1', 'Level 2', 'Level 3'],
        search_case_level: '',
        if_need_automated: '',
        if_smoke_test: '',
        maintainer: '',
        initialProjectName: '',
        selectedKeys: [],
        deleteCaseVisible: false,
        hasSelected: false,
        moveModuleVisible: false,
        testCaseList: [],
        importExporttoolTipVisible: false,
        importExportPopoverVisible: false,
        setCaseLevelPopOverVisible: false,
        set_case_level_case_id_list: [],
        visible: false,
        importCaseVisible: false,
        module_loading: false,
        todoListTitle: '',
        tree_node_children: [],
        projectNameList: [],
        caseList: [],
        project_id: 0,
        module_id: 0,
        projectList: [],
        treeDataList: [],
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
      memberFilter (members) {
        if (members) {
          return members.join('、')
        } else {
          return ''
        }
      }
    },
    created () {
      console.log('in created of CaseList.vue:')
      console.log('this.$route.query.project_id: ', this.$route.query.project_id)
      if (!this.$route.query.project_id) {
        console.log('this.$store.state.caseTwo.case_two_global_project_id: ', this.$store.state.caseTwo.case_two_global_project_id)
        this.$router.push({
            name: 'caseTwoTestCaseList',
            query: { project_id: this.$store.state.caseTwo.case_two_global_project_id }
        })
      }
      this.initialProjectName = this.$store.state.caseTwo.case_two_global_project_name
      this.project_id = parseInt(this.$route.query.project_id)
      console.log('this.project_id:', this.project_id)
      this.queryData()
    },
    watch: {
      selectedRowKeys () {
        console.log('in watch')
        this.hasSelected = this.selectedRowKeys.length > 0
        console.log('this.hasSelected:', this.hasSelected)
      }
    },
    methods: {
      updateModuleTree () {
        console.log('刷新模块树形结构')
        // 移除组件，用于刷新模型树，ModuleTree组件重新渲染时会根据project_id查找模型数据
        this.updateTreeComp = false
        // 在组件移除后，重新渲染组件
        // this.$nextTick可实现在DOM 状态更新后，执行传入的方法。
        this.$nextTick(() => {
            this.updateTreeComp = true
        })
      },
      openMoveModuleWindow (moduleInfo) {
        console.log('moduleInfo in openMoveModuleWindow: ', moduleInfo)
        console.log('this.moveModuleVisible:', this.moveModuleVisible)
        this.moveModuleVisible = true
        this.$refs.moveModuleRef.init(this.project_id, moduleInfo)
      },
      changeMoveModuleVisible () {
        this.moveModuleVisible = false
      },
      openSetMultipleCaseLevelWindow (caseIdList) {
        console.log('in openSetMultipleCaseLevelWindow')
        console.log('this.setCaseLevelPopOverVisible: ', this.setCaseLevelPopOverVisible)
        console.log('caseIdList: ', caseIdList)
        console.log('this.project_id: ', this.project_id)
        this.set_case_level_case_id_list = caseIdList
        // const projectId = this.project_id
        // this.$refs.copyMoveCase.init('move', projectId, caseIdList)
      },
      setMultipleCaseLevel (caseLevel) {
        console.log('caseLevel in setMultipleCaseLevel: ', caseLevel)
        this.setCaseLevelPopOverVisible = false
        this.changeHasSelected()
        const params = {
          case_id_list: this.set_case_level_case_id_list,
          case_level: caseLevel
        }
        setMultipleCaseLevel(params).then(res => {
          console.log('params in setMultipleCaseLevel: ', params)
          for (var item = 0; item < this.set_case_level_case_id_list.length; item++) {
            console.log('this.set_case_level_case_id_list[item]: ', this.set_case_level_case_id_list[item])
            for (var i = 0; i < this.testCaseList.length; i++) {
              if (this.testCaseList[i].id === this.set_case_level_case_id_list[item]) {
                console.log('找到数据，开始设置用例级别')
                this.testCaseList[i].case_level = caseLevel
              }
            }
          }
          }).catch(err => {
            this.$message.error(err.message)
          }).finally(() => {
            this.queryCaseData()
          })
      },
      cancelEdit (record) {
        record.edit_visible = false
      },
      handleChangeOrderNumber (value, record) {
        console.log('value in handleChangeOrderNumber: ', value)
        record.order_number = value
      },
      saveCaseOrderNumber (record) {
        record.edit_visible = false;
        const params = {
          case_id: record.id,
          order_number: record.order_number
        }
        console.log('params in saveCaseOrderNumber: ', params)
        saveCaseOrderNumber(params).then(res => {
          console.log('res.code: ', res.code)
          this.queryCaseData(this.module_id, this.tree_node_children)
        })
      },
      changeOrderNumber (record) {
        console.log('in changeOrderNumber')
        record.edit_visible = true;
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
      changeOpenAllModuleFolderVisible () {
        console.log('in changeOpenAllModuleFolderVisible')
        this.openAllModuleFolderVisible = !this.openAllModuleFolderVisible
      },
      changeVerticalRightVisible () {
        console.log('in changeVerticalRightVisible')
        this.verticalRightVisible = !this.verticalRightVisible
      },
      rowclick (record, index) {
        return {
          on: {
            click: () => {
              console.log(record, index, 'in rowclick')
              this.testCaseDetail(record)
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
      openRecycleBin () {
        console.log('in openRecycleBin')
        this.recycleBinVisible = true
        console.log('this.testCaseList in openRecycleBin:', this.testCaseList)
        this.$nextTick(() => {
            this.$refs.recycleBin.init(this.project_id)
        })
      },
      changeRecycleBinVisible () {
        console.log('in changeRecycleBinVisible')
        this.recycleBinVisible = false
      },
      importCase () {
        this.importCaseVisible = true
        this.$nextTick(() => {
          this.$refs.importCase.init(this.project_id, this.module_id, this.tree_node_children)
        })
      },
      exportCase () {
        const params = {
          project_id: this.project_id,
          case_list: this.testCaseList
        }
        exportTestCase(params).then(res => {
          console.log('in exportTestCase')
          console.log('res.data:', res.data)
          const testCaseName = res.data.test_case_name
          if (res.data) {
            // 下载操作
            const apiUrl = `${process.env.VUE_APP_API_BASE_URL}`
            const url = apiUrl + `/case/v2/case/downloadTestCase/${testCaseName}`
            const evt = document.createEvent('HTMLEvents')
            evt.initEvent('click', false, false)
            const link = document.createElement('a');
            link.href = url
            link.target = '_blank'
            link.style.display = 'none'
            link.download = 'test.xlsx';
            document.body.appendChild(link);
            link.click();
            window.URL.revokeObjectURL(link.href)
            document.body.removeChild(link);
            }
        }).catch(err => {
          console.log('err:', err)
        })
      },
      onSelectChange (selectedRowKeys) {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.selectedRowKeys = selectedRowKeys;
      },
      handleSubmit (e) {
        this.loading = true
        e.preventDefault();
        const { form: { validateFields } } = this
        console.log()
        validateFields((errors, values) => {
          console.log('errors: ', errors)
          console.log('values: ', values)
          if (!errors) {
            const params = {
              project_id: this.project_id,
              case_title: values.case_title,
              case_level: values.case_level,
              if_need_automated: values.if_need_automated,
              if_smoke_test: values.if_smoke_test,
              module_id: this.module_id,
              maintainer: values.maintainer
            }
            if (this.module_id !== 0 && this.tree_node_children.length > 0) {
              params['tree_node_children'] = this.tree_node_children
            }
            console.log('params to getCaseData: ', params)
            getCaseData(params).then(res => {
              this.testCaseList = res.data
              this.loading = false
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
        this.queryCaseData()
      },
      cancelInputAndShowSpan (data) {
        console.log('this.add_title:', this.add_title)
        this.add_show = false
        this.span_show = true
        data.title = this.add_title
      },
      openPopOver (data) {
        console.log('open popover and close tooltip');
        data.popoverVisible = true;
        data.tooltipVisible = false;
      },
      append (data) {
        this.add_show = true
        this.span_show = false
      // 模拟添加
        const newChild = {
          title: 'ceshi1',
          key: 'ceshi1',
          scopedSlots: { title: 'custom_add', icon: 'folder' },
          ellipsisSeen: false,
          popoverVisible: false,
          tooltipVisible: false,
          children: [] }
        if (!data.children) {
          this.$set(data, 'children', [])
        }
        data.scopedSlots.icon = 'folder-open'
        data.children.push(newChild)
        console.log('this.treeDataList after append:', this.treeDataList)
        this.expandedKeys.push(data.key)
        this.autoExpandParent = false
        // const params = {}
        // params['parent_module_id'] = data.id
        // params['add_children'] = newChild
        // addModuleData(params)
      },
      edit (data) {
        console.log('this.treeDataList when edit:', this.treeDataList)
        // 先请求后端接口，编辑成功后执行
        this.dataHandle(data, this.treeDataList, 'edit')
      },
      onExpand (expandedKeys) {
        console.log('onExpand', expandedKeys);
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        this.expandedKeys.push(expandedKeys);
        console.log('this.expandedKeys:', this.expandedKeys)
        this.autoExpandParent = false;
      },
      onCheck (checkedKeys) {
        console.log('onCheck', checkedKeys);
        this.checkedKeys = checkedKeys;
      },
      changeHasSelected () {
        console.log('in changeHasSelected');
        this.selectedRowKeys = []
        console.log('this.hasSelected:', this.hasSelected)
      },
      changeCreateVisible () {
        this.createFormVisible = false
        // 新建用例组件隐藏后，应该刷新一下模块树组件
        // // 移除组件，用于刷新模型树，ModuleTree组件重新渲染时会根据project_id查找模型数据
        // this.updateTreeComp = false
        // // 在组件移除后，重新渲染组件
        // // this.$nextTick可实现在DOM 状态更新后，执行传入的方法。
        // this.$nextTick(() => {
        //     this.updateTreeComp = true
        // })
      },
      changeCopyMoveVisible () {
        this.copyMoveVisible = false
      },
      changeCaseDetailVisible () {
        this.caseDetailVisible = false
      },
      changeDeleteCaseVisible () {
        console.log('in changeDeleteCaseVisible')
        this.deleteCaseVisible = false
      },
      changeImportCaseVisible () {
        console.log('in changeImportCaseVisible')
        this.importCaseVisible = false
      },
      openImportExportPopOver () {
        this.importExportPopoverVisible = true
        this.importExportTooltipVisible = false
      },
      copyTestCase (caseList) {
        console.log('in copyTestCase')
        console.log('caseList: ', caseList)
        console.log('this.project_id: ', this.project_id)
        const projectId = this.project_id
        this.copyMoveVisible = true
        this.$refs.copyMoveCase.init('copy', projectId, caseList)
      },
      moveTestCase (caseIdList) {
        console.log('in moveTestCase')
        console.log('caseIdList: ', caseIdList)
        console.log('this.project_id: ', this.project_id)
        const projectId = this.project_id
        this.copyMoveVisible = true
        this.$refs.copyMoveCase.init('move', projectId, caseIdList)
      },
      deleteTestCase (caseIdList, type = 'multile') {
        console.log('in deleteTestCase')
        console.log('caseIdList: ', caseIdList)
        this.deleteCaseVisible = true
        this.$refs.deleteCase.init(caseIdList, type)
      },
      cancelSelectKeys () {
        this.selectedRowKeys = []
      },
      queryData () {
        console.log('in queryData')
        this.getProjectList()
        this.queryCaseData()
        // 刷新模块树组件
        // 移除组件，用于刷新模型树，ModuleTree组件重新渲染时会根据project_id查找模型数据
        this.updateTreeComp = false
        // 在组件移除后，重新渲染组件
        // this.$nextTick可实现在DOM 状态更新后，执行传入的方法。
        this.$nextTick(() => {
            this.updateTreeComp = true
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
          case_title: this.case_title,
          case_level: this.case_level,
          if_need_automated: this.if_need_automated,
          if_smoke_test: this.if_smoke_test,
          maintainer: this.maintainer,
          tree_node_children: treeNodeChildren
        }
        console.log('params in queryCaseData:', params)
        this.loading = true
        getCaseData(params).then(res => {
          this.testCaseList = res.data
        }).catch(err => {
          this.$message.error(err.message)
        }).finally(() => {
          this.loading = false
        })
      },
      queryCaseDataAndReloadModuleTree (moduleId, treeNodeChildren) {
        // this.$message.info('用例查询中。')
        console.log('moduleId in queryCaseData:', moduleId)
        const params = {
          project_id: this.project_id,
          module_id: moduleId || this.module_id,
          case_title: this.case_title,
          case_level: this.case_level,
          if_need_automated: this.if_need_automated,
          maintainer: this.maintainer,
          tree_node_children: treeNodeChildren
        }
        console.log('params in queryCaseData:', params)
        this.loading = true
        getCaseData(params).then(res => {
          this.testCaseList = res.data
          // 刷新模块树组件
          // 移除组件，用于刷新模型树，ModuleTree组件重新渲染时会根据project_id查找模型数据
          this.updateTreeComp = false
          // 在组件移除后，重新渲染组件
          // this.$nextTick可实现在DOM 状态更新后，执行传入的方法。
          this.$nextTick(() => {
              this.updateTreeComp = true
          })
        }).catch(err => {
          this.$message.error(err.message)
        }).finally(() => {
          this.loading = false
        })
      },
      createOrModifyTestCase (caseId) {
        this.createFormVisible = true
        this.$refs.createTestCase.init(caseId, this.project_id, this.initialProjectName, this.module_id)
      },
      testCaseDetail (caseInfo) {
        console.log('in testCaseDetail')
        this.caseDetailVisible = true
        this.$refs.caseDetail.init(caseInfo, this.initialProjectName)
      },
      createCase () {
        console.log('')
      },
      createModule () {
        console.log('in createModule.')
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
        }
    }
  }
</script>

<style lang="less" scoped>
  @import "./caseList.less";
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
    height:35px;
    padding-top: 5px;
    // margin:6px;
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
.setCaseLevelOption{
  width: 150px;
  height: 35px;
  cursor: pointer;
  margin-bottom: 10px;
  }
.setCaseLevelOption:hover{
  background-color: #D3EEF9;
}
.class_tag {
  font-weight: bold;
  color: white;
  font-size: 5px;
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

  .title_tag {
    font-weight: bold;
    color: white;
    font-size: 5px;
  }
  }
  .project_select_option {
    cursor: pointer;
  }
  .project_select_option:hover {
    color: #14C393;
  }
</style>
