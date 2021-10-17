<template>
  <div>
    <div class="plan_list_detail_data">
      <a-row :gutter="24">
        <a-col :md="34" :lg="17" style="margin-top: 14px; margin-left: 0px;">
          <div style="float: left; margin-left: 15px;">
            <span style="margin-left: 10px; display: inline">通过率</span>
            <span style="margin-left: 15px; display: inline">{{ this.pass_rate }}</span>
          </div>
          <div style="float: left; margin-left: 20px;">
            <span style="display: inline">已测用例数</span>
            <span style="margin-left: 15px; display: inline">{{ this.executed_case_num }}</span>
            <span style="margin-left: 5px; display: inline">/</span>
            <span style="margin-left: 5px; display: inline">{{ this.total_case_num }}</span>
          </div>
        </a-col>
      </a-row>
    </div>
    <div style="margin-top: 10px;">
      <div class="plan_dedail_page">
        <a-row :gutter="24">
          <a-col :md="10" :lg="5">
            <div class="plan_detail_module-section">
              <a-card
                :bordered="false"
                type="inner"
                title="模块"
                :body-style="{padding: '0 10px 0 0'}">
                <PlanSmokeCaseModuleTree
                  v-if="updateTreeComp"
                  ref="ModuleTreeRef"
                  @getTestCase="getPlanSmokeCaseData"
                  @changeHasSelected="changeHasSelected"
                  :projectId="this.project_id"
                  :planId="this.plan_id"
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
                    <a-col :md="10" :lg="5">
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
                        label="执行结果"
                      >
                        <a-select
                          allowClear
                          v-decorator="[
                            'execute_result',
                            { rules: [{ required: false, message: '请选择执行结果' }] },
                          ]"
                          placeholder="请选择"
                        >
                          <a-select-option v-for="(val, key, index) in executeResultMap" :key="index" :value="key">
                            <a-icon v-if="val === '通过'" type="check-circle"  :style="{ fontSize: '16px', color: 'green' }"/>
                            <a-icon v-if="val === '阻塞'" type="minus-circle" :style="{ fontSize: '16px', color: 'orange' }"/>
                            <a-icon v-if="val === '失败'" type="close-circle" :style="{ fontSize: '16px', color: 'red' }"/>
                            <a-icon v-if="val === '未测'" type="question-circle" :style="{ fontSize: '16px', color: 'grey' }"/>
                            <a-icon v-if="val === '跳过'" type="right-circle" :style="{ fontSize: '16px', color: 'blue' }"/>
                            <span style="margin-left: 5px;">{{ val }}</span>
                          </a-select-option>
                        </a-select>
                      </a-form-item>
                    </a-col>
                    <a-col :md="10" :lg="5">
                      <a-form-item
                        label="执行人"
                      >
                        <a-select
                          allowClear
                          v-decorator="[
                            'execute_person',
                            { rules: [{ required: false, message: '请选择' }] },
                          ]"
                          placeholder="请选择"
                        >
                          <a-select-option v-for="item in memberList" :key="item">
                            {{ item }}
                          </a-select-option>
                        </a-select>
                      </a-form-item>
                    </a-col>
                    <a-col :md="4" :lg="2">
                      <!-- <a-button style="float: right;" type="primary" html-type="submit" @click=handleSubmit>查询</a-button> -->
                      <a-button style="float: right;" type="primary" @click="handleSubmit">查询</a-button>
                    </a-col>
                  </a-row>
                </a-form>
              </div>
            </a-card>
            <div class="case-section">
              <div v-show="hasSelected" class="handle-select">
                <span style="margin-left: 4px">
                  <template v-if="hasSelected">
                    {{ `已选中 ${selectedRowKeys.length} 项` }}
                  </template>
                </span>
                <a-popover v-model="setExecuteResultPopOverVisible" trigger="click" placement="bottomRight" :auto-adjust-overflow="true">
                  <template slot="content">
                    <div class="executeResultOption" @click="()=> setMultiplePlanCaseExecuteResult('0')">
                      <a-icon type="check-circle" :style="{ fontSize: '16px', color: 'green', marginTop: '7px' }"/>
                      <span style="margin-left:5px;">通过</span>
                    </div>
                    <div class="executeResultOption" @click="()=> setMultiplePlanCaseExecuteResult('1')">
                      <a-icon type="minus-circle" :style="{ fontSize: '16px', color: 'orange', marginTop: '7px' }"/>
                      <span style="margin-left:5px;">阻塞</span>
                    </div>
                    <div class="executeResultOption" @click="()=> setMultiplePlanCaseExecuteResult('2')">
                      <a-icon type="close-circle" :style="{ fontSize: '16px', color: 'red', marginTop: '7px' }"/>
                      <span style="margin-left:5px;">失败</span>
                    </div>
                    <div class="executeResultOption" @click="()=> setMultiplePlanCaseExecuteResult('4')">
                      <a-icon type="right-circle" :style="{ fontSize: '16px', color: 'blue', marginTop: '7px' }"/>
                      <span style="margin-left:5px;">跳过</span>
                    </div>
                  </template>
                  <a-button type="link" :loading="loading" @click="openMultiplePlanCaseExecuteResultPopOver(selectedRowKeys)">
                    设置执行结果
                  </a-button>
                </a-popover>
                <a-button type="link" :loading="loading" @click="changeExecutePerson(selectedRowKeys)">
                  设置执行人
                </a-button>
                <a-popover v-model="setExecutePriorityPopOverVisible" trigger="click" placement="bottomRight" :auto-adjust-overflow="true">
                  <template slot="content">
                    <div class="executePriorityOption" @click="setMultiplePlanCaseExecutePriority('0')">
                      <a-tag color="#E86452" style="margin-top: 8px; margin-left: 10px;"><div class="class_tag">高</div></a-tag>
                    </div>
                    <div class="executePriorityOption" @click="setMultiplePlanCaseExecutePriority('1')">
                      <a-tag color="#F6BD16" style="margin-top: 8px; margin-left: 10px;"><div class="class_tag">中</div></a-tag>
                    </div>
                    <div class="executePriorityOption" @click="setMultiplePlanCaseExecutePriority('2')">
                      <a-tag color="#5AD8A6" style="margin-top: 8px; margin-left: 10px;"><div class="class_tag">低</div></a-tag>
                    </div>
                  </template>
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
                  <a-popconfirm placement="top" ok-text="确定" cancel-text="取消" @confirm="removePlanCase([record.id])">
                    <template slot="title">
                      <p>确认移除该用例么？</p>
                    </template>
                    <a @click.stop>移除</a>
                  </a-popconfirm>
                </template>
                <template slot="case_name" slot-scope="text, record">
                  <a-row :gutter="1">
                    <!-- <a-col :span="2">
                      <a-tag style="padding-left: 2px; padding-right: 2px;" v-if="record.automated" color="#14C393"><span class="class_tag">auto</span></a-tag>
                    </a-col> -->
                    <a-col :span="22">
                      <div style="margin-left: 5px">
                        <span style="cursor: pointer;">{{ text }}</span>
                        <a-tag style="margin-left: 2px; margin-right: 2px; padding-left: 1px; padding-right: 1px;" v-if="record.automated" color="#14C393"><span class="class_tag">auto</span></a-tag>
                        <a-tag style="margin-left: 2px; padding-left: 1px; padding-right: 1px;" v-if="record.if_smoke_test === 'Y'" color="#FAAD14"><span class="title_tag">smoke</span></a-tag>
                      </div>
                    </a-col>
                  </a-row>
                </template>
                <template slot="execute_result" slot-scope="text, record">
                  <a-popover v-model="record.setExecuteResultPopOverVisible" trigger="click" placement="bottomRight" :auto-adjust-overflow="true">
                    <template slot="content">
                      <div class="executeResultOption" @click="()=> setPlanSmokeCaseExecuteResult(record, '0')">
                        <a-icon type="check-circle" :style="{ fontSize: '16px', color: 'green', marginTop: '7px' }"/>
                        <span style="margin-left:5px;">通过</span>
                        <a-icon v-if="record.execute_result === '0'" type="check" :style="{ fontSize: '16px', color: '#5B8FF9', float: 'right', marginTop: '8px' }"/>
                      </div>
                      <div class="executeResultOption" @click="()=> setPlanSmokeCaseExecuteResult(record, '1')">
                        <a-icon type="minus-circle" :style="{ fontSize: '16px', color: 'orange', marginTop: '7px' }"/>
                        <span style="margin-left:5px;">阻塞</span>
                        <a-icon v-if="record.execute_result === '1'" type="check" :style="{ fontSize: '16px', color: '#5B8FF9', float: 'right', marginTop: '8px' }"/>
                      </div>
                      <div class="executeResultOption" @click="()=> setPlanSmokeCaseExecuteResult(record, '2')">
                        <a-icon type="close-circle" :style="{ fontSize: '16px', color: 'red', marginTop: '7px' }"/>
                        <span style="margin-left:5px;">失败</span>
                        <a-icon v-if="record.execute_result === '2'" type="check" :style="{ fontSize: '16px', color: '#5B8FF9', float: 'right', marginTop: '8px' }"/>
                      </div>
                      <div class="executeResultOption" @click="()=> setPlanSmokeCaseExecuteResult(record, '4')">
                        <a-icon type="right-circle" :style="{ fontSize: '16px', color: 'blue', marginTop: '7px' }"/>
                        <span style="margin-left:5px;">跳过</span>
                        <a-icon v-if="record.execute_result === '3'" type="check" :style="{ fontSize: '16px', color: '#5B8FF9', float: 'right', marginTop: '8px' }"/>
                      </div>
                    </template>
                    <div>
                      <a-icon v-if="record.execute_result === '0'" type="check-circle" :style="{ fontSize: '16px', color: 'green' }"/>
                      <a-icon v-if="record.execute_result === '1'" type="minus-circle" :style="{ fontSize: '16px', color: 'orange' }"/>
                      <a-icon v-if="record.execute_result === '2'" type="close-circle" :style="{ fontSize: '16px', color: 'red' }"/>
                      <a-icon v-if="record.execute_result === '3'" type="right-circle" :style="{ fontSize: '16px', color: 'blue' }"/>
                      <a-icon v-if="record.execute_result === '4'" type="question-circle" :style="{ fontSize: '16px', color: 'grey' }"/>
                      <span style="margin-left: 5px; cursor: default">{{ record.execute_result | executeResultFilter }}</span>
                      <a-icon v-if="record.setExecuteResultVisible" type="down" style="float: right; margin-top: 5px;" />
                    </div>
                  </a-popover>
                </template>
                <template slot="priority" slot-scope="text, record">
                  <a-popover v-model="record.setExecutePriorityPopOverVisible" trigger="click" placement="bottomRight" :auto-adjust-overflow="true">
                    <template slot="content">
                      <div class="executePriorityOption" @click="setPlanCaseExecutePriority(record, '0')">
                        <a-tag color="#E86452" style="margin-top: 8px; margin-left: 10px;"><div class="class_tag">高</div></a-tag>
                      </div>
                      <div class="executePriorityOption" @click="setPlanCaseExecutePriority(record, '1')">
                        <a-tag color="#F6BD16" style="margin-top: 8px; margin-left: 10px;"><div class="class_tag">中</div></a-tag>
                      </div>
                      <div class="executePriorityOption" @click="setPlanCaseExecutePriority(record, '2')">
                        <a-tag color="#5AD8A6" style="margin-top: 8px; margin-left: 10px;"><div class="class_tag">低</div></a-tag>
                      </div>
                    </template>
                    <div>
                      <a-tag v-if="text === '0'" color="#E86452"><div class="class_tag">{{ text | priorityFilter }}</div></a-tag>
                      <a-tag v-if="text === '1'" color="#F6BD16"><div class="class_tag">{{ text | priorityFilter }}</div></a-tag>
                      <a-tag v-if="text === '2'" color="#5AD8A6"><div class="class_tag">{{ text | priorityFilter }}</div></a-tag>
                      <span style="margin-left: 5px; cursor: default"></span>
                      <a-icon v-if="record.setExecutePriorityVisible" type="down" style="float: right; margin-top: 5px;" />
                    </div>
                  </a-popover>
                </template>
                <!-- <div slot="execute_person" slot-scope="text, record" @mouseover="mouseOver(record)" @mouseleave="mouseLeave(record)"> -->
                <div slot="execute_person" slot-scope="text, record">
                  <div>
                    <a-icon v-if="record.setExecutorVisible" type="user-add" style="float: right;" />
                    <span style="cursor: default;">{{ text }}</span>
                  </div>
                </div>
              </a-table>
            </div>
          </a-col>
        </a-row>
      </div>
      <SetSmokeCaseExecutor
        :setExecutorVisible="this.setExecutorVisible"
        :memberList="memberList"
        ref="setExecutor"
        @setExecutor="setExecutor"
        @queryData="getPlanSmokeCaseData"
        @changeSetExetorVisible="changeSetExetorVisible"
        @changeHasSelected="changeHasSelected"
      />
      <PlanSmokeCaseDetail
        :caseDetailVisible="this.caseDetailVisible"
        :projectName="this.initialProjectName"
        :projectId="this.project_id"
        :testCaseList="this.testCaseList"
        ref="planSmokeCaseDetail"
        @changeCaseDetailVisible="changeCaseDetailVisible"
        @queryData="getPlanSmokeCaseData"
      />
    </div>
  </div>
</template>
<script>
  import { getMembers } from '@/api/case/project_two'
  import { getPlanSmokeCaseData, setPlanSmokeCaseExecuteResult } from '@/api/case/case_two'
  import PlanSmokeCaseModuleTree from './PlanSmokeCaseModuleTree'
  import PlanSmokeCaseDetail from './PlanSmokeCaseDetail'
  import SetSmokeCaseExecutor from './SetSmokeCaseExecutor'
  const stateMap = {
    '0': '未开始',
    '1': '运行中',
    '2': '已完成'
  }
  const automaticStateMap = {
  'need_auto': '需关联自动化',
  'automated': '已关联自动化'
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
  const smokeTestStateMap = {
    'Y': '是',
    'N': '否'
  }
  export default {
    name: 'SmokeCaseList',
    components: {
      PlanSmokeCaseDetail,
      SetSmokeCaseExecutor,
      PlanSmokeCaseModuleTree
    },
    props: {
      planId: {
        type: Number,
        default: 0
      }
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
        columns: [
          {
            title: '编号',
            dataIndex: 'id',
            key: 'id',
            scopedSlots: { customRender: 'id' },
            width: 70,
            align: 'center'
          },
          {
            title: '执行结果',
            dataIndex: 'execute_result',
            key: 'execute_result',
            scopedSlots: { customRender: 'execute_result' },
            width: 140,
            customCell: this.executeResultCustomCell
          },
          {
            title: '标题',
            dataIndex: 'case_name',
            key: 'case_name',
            scopedSlots: { customRender: 'case_name' }
          },
          {
            title: '执行人',
            dataIndex: 'execute_person',
            key: 'execute_person',
            scopedSlots: { customRender: 'execute_person' },
            width: 140,
            customCell: this.executePersonCustomCell
          }
        ],
        autoCodeRepositoryList: [],
        total_execute_over: false,
        repository_report_id_list: [],
        selectedRowKeys: [], // Check here to configure the default column
        data: [],
        caseDetailVisible: false,
        confirmLoading: false,
        loading: true,
        updateTreeComp: true,
        setExecutorVisible: false,
        setExecuteResultPopOverVisible: false,
        setExecutePriorityPopOverVisible: false,
        deleteMultipleCaseVisible: false,
        confirmCreatePlanIterationVisible: false,
        deletePlanVisible: false,
        configPlanCaseVisible: false,
        execute_result_plan_case_id_list: [],
        execute_priority_plan_case_id_list: [],
        expandedKeys: [],
        checkedKeys: [],
        autoExpandParent: false,
        form: this.$form.createForm(this, { name: 'createCaseForm' }),
        projectForm: this.$form.createForm(this, { name: 'projectForm' }),
        add_title: '',
        span_title: 'hello',
        add_show: false,
        plan_code_repository_window_visible: false,
        smoke_case_window_visible: false,
        createIterationNum: 0,
        modify_show: false,
        modify_iteration_name: '',
        span_show: false,
        defaultExpandedKeys: [],
        case_title: '',
        case_level_list: ['Level 1', 'Level 2', 'Level 3'],
        automatic_state_list: ['need_auto', 'automated'],
        smoke_test_state_list: ['Y', 'N'],
        priorityMap,
        executeResultMap,
        search_case_level: '',
        if_need_automated: '',
        maintainer: '',
        selectedKeys: [],
        hasSelected: false,
        testCaseList: [],
        visible: false,
        module_loading: false,
        caseList: [],
        project_id: 0,
        iteration_id: 0,
        plan_id: 0,
        test_version_id: 0,
        plan_name: '',
        test_version_name: '',
        owner: '',
        pass_rate: '',
        automated_cover_rate: '',
        auto_case_pass_rate: '',
        plan_status: '',
        new_iteration_title: '',
        already_executed_case_num: 0,
        stateMap,
        module_id: 0,
        projectList: [],
        planList: [],
        testVersionList: [],
        treeDataList: [],
        total_case_num: 0,
        executed_case_num: 0,
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
      automaticStateFilter (state) {
        return automaticStateMap[state]
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
      },
      smokeTestFilter (state) {
        return smokeTestStateMap[state]
      }
    },
    created () {
      console.log('in created:')
      console.log('this.$route in planDetail: ', this.$route)
      console.log('this.$route.query: ', this.$route.query)
      this.project_id = parseInt(this.$route.query.project_id)
      this.plan_id = parseInt(this.$route.query.plan_id)
      this.test_version_id = parseInt(this.$route.query.test_version_id)
      console.log('this.project_id:', this.project_id)
      console.log('this.plan_id:', this.plan_id)
      console.log('this.test_version_id:', this.test_version_id)
      this.total_case_num = 0
      this.pass_rate = ''
      this.executed_case_num = 0
      this.initialProjectName = this.$store.state.caseTwo.case_two_global_project_name
      this.getMembersList()
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
      testCaseDetail (planCaseInfo) {
        console.log('in testCaseDetail')
        this.caseDetailVisible = true
        this.$refs.planSmokeCaseDetail.init(planCaseInfo, this.initialProjectName)
      },
      executePriorityCustomCell (record) {
        return {
          on: {
            mouseenter: (event) => {
              console.log('进入鼠标指向的单元格')
              // 通过setExecutePriorityVisible
              record.setExecutePriorityVisible = true
              console.log('record.setExecutePriorityVisible in mouseenter:', record.setExecutePriorityVisible)
            },
            mouseleave: (event) => {
              event.preventDefault()
              console.log('离开当前单元格')
              record.setExecutePriorityVisible = false
              console.log('record.setExecutePriorityVisible in mouseLeave:', record.setExecutePriorityVisible)
            },
            click: (event) => {
              event.stopPropagation()
              console.log('in click')
              // record.setExecutePriorityPopOverVisible = true
              // this.changeExecutePerson([record.id])
            }
          },
          style: record.setExecutePriorityVisible ? {
            'background-color': '#D3EEF9'
          } : {}
        }
      },
      executeResultCustomCell (record) {
        return {
          on: {
            mouseenter: (event) => {
              console.log('进入鼠标指向的单元格')
              record.setExecuteResultVisible = true
              console.log('record.setExecuteResultVisible in mouseenter:', record.setExecuteResultVisible)
            },
            mouseleave: (event) => {
              event.preventDefault()
              console.log('离开当前单元格')
              record.setExecuteResultVisible = false
              console.log('record.setExecuteResultVisible in mouseLeave:', record.setExecuteResultVisible)
            },
            click: (event) => {
              event.stopPropagation()
              console.log('in click')
              // this.changeExecutePerson([record.id])
            }
          },
          style: record.setExecuteResultVisible ? {
            'background-color': '#D3EEF9'
          } : {}
        }
      },
      executePersonCustomCell (record) {
        return {
          on: {
            mouseenter: (event) => {
              console.log('进入鼠标指向的单元格')
              console.log('data in mouseenter:', record)
              record.setExecutorVisible = true
              console.log('record.setExecutorVisible in mouseenter:', record.setExecutorVisible)
            },
            mouseleave: (event) => {
              console.log('离开当前单元格')
              console.log('in mouseLeave')
              record.setExecutorVisible = false || this.setExecutorVisible
              console.log('record.setExecutorVisible in mouseLeave:', record.setExecutorVisible)
            },
            click: (event) => {
              event.stopPropagation()
              console.log('in click')
              console.log('this: ', this)
              this.changeExecutePerson([record.id])
            }
          },
          style: record.setExecutorVisible ? {
            'background-color': '#D3EEF9'
          } : {}
        }
      },
      openSetPriorityPopOver (data) {
        data.setExecutePriorityPopOverVisible = true
        console.log('data after openSetPriorityPopOver: ', data)
      },
      changeDeleteMultileCaseVisible () {
        console.log('in  changeDeleteMultileCaseVisible')
        this.deleteMultipleCaseVisible = false
      },
      removeMultiplePlanCase (planCaseIdList) {
        console.log('planCaseIdList in removeMultiplePlanCase: ', planCaseIdList)
        this.deleteMultipleCaseVisible = true
        this.$refs.deleteMultipleCase.init(planCaseIdList)
      },
      cancelSelectKeys () {
        this.selectedRowKeys = []
      },
      openMultiplePlanCaseExecuteResultPopOver (planCaseIdList) {
        console.log('planCaseIdList in openMultiplePlanCaseExecuteResultPopOver: ', planCaseIdList)
        this.setExecuteResultPopOverVisible = true
        this.execute_result_plan_case_id_list = planCaseIdList
      },
      setMultiplePlanCaseExecuteResult (resultCode) {
        console.log('resultCode in setMultiplePlanCaseExecuteResult: ', resultCode)
        this.setExecuteResultPopOverVisible = false
        this.changeHasSelected()
        const params = {
          plan_case_id_list: this.execute_result_plan_case_id_list,
          result_code: resultCode
        }
        setPlanSmokeCaseExecuteResult(params).then(res => {
          console.log('params in setPlanSmokeCaseExecuteResult: ', params)
          for (var item = 0; item < this.execute_result_plan_case_id_list.length; item++) {
            console.log('this.execute_result_plan_case_id_list[item]: ', this.execute_result_plan_case_id_list[item])
            for (var i = 0; i < this.testCaseList.length; i++) {
              if (this.testCaseList[i].id === this.execute_result_plan_case_id_list[item]) {
                console.log('找到数据，开始设置执行结果')
                this.testCaseList[i].execute_result = resultCode
              }
            }
          }
          }).catch(err => {
            this.$message.error(err.message)
          }).finally(() => {
            this.getPlanSmokeCaseData()
          })
      },
      openMultiplePlanCaseExecutePriorityPopOver (planCaseIdList) {
        console.log('planCaseIdList in openMultiplePlanCaseExecutePriorityPopOver: ', planCaseIdList)
        this.setExecutePriorityPopOverVisible = true
        this.execute_priority_plan_case_id_list = planCaseIdList
      },
      changeHasSelected () {
        console.log('in changeHasSelected');
        this.selectedRowKeys = []
        console.log('this.hasSelected:', this.hasSelected)
      },
      changeCaseDetailVisible () {
        console.log('in changeCaseDetailVisible')
        this.caseDetailVisible = false
      },
      setPlanSmokeCaseExecuteResult (data, resultCode) {
        console.log('data, resultCode in setPlanSmokeCaseExecuteResult: ', data, resultCode)
        data.setExecuteResultPopOverVisible = false
        const params = {
          plan_case_id_list: [data.id],
          result_code: resultCode
        }
        setPlanSmokeCaseExecuteResult(params).then(res => {
          console.log('params in setPlanSmokeCaseExecuteResult: ', params)
          data.execute_result = resultCode
          }).catch(err => {
            this.$message.error(err.message)
          }).finally(() => {
            this.getPlanSmokeCaseData()
          })
      },
      openSetResultPopOver (data) {
        data.setExecuteResultPopOverVisible = true
        console.log('data after openSetResultPopOver: ', data)
      },
      setExecutor (planCaseIdList, executor) {
        console.log('planCaseIdList, executor in setExecutor:', planCaseIdList, executor)
        for (var item = 0; item < planCaseIdList.length; item++) {
          console.log('planCaseIdList[item]: ', planCaseIdList[item])
          for (var i = 0; i < this.testCaseList.length; i++) {
            if (this.testCaseList[i].id === planCaseIdList[item]) {
              console.log('找到数据，开始设置执行人')
              this.testCaseList[i].execute_person = executor
            }
          }
        }
      },
      changeSetExetorVisible () {
        console.log('in changeSetExetorVisible')
        this.setExecutorVisible = false
        for (var i = 0; i < this.testCaseList.length; i++) {
          this.testCaseList[i].setExecutorVisible = false
        }
      },
      changeExecutePerson (planCaseIdList) {
        console.log('planCaseIdList in changeExecutePerson: ', planCaseIdList)
        this.setExecutorVisible = true
        this.$refs.setExecutor.init(planCaseIdList)
        console.log('planCaseIdList in changeMultipleCaseExecutePerson: ', planCaseIdList)
      },
      getMembersList () {
        console.log('in getMembersList function')
        getMembers().then(res => {
        this.memberList = res.data
        }).catch(err => {
          this.$message.error(err.message)
        })
      },
      onSelectChange (selectedRowKeys) {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.selectedRowKeys = selectedRowKeys;
      },
      handleSubmit () {
        console.log('in handleSubmit')
        const { form: { validateFields } } = this
        validateFields((errors, values) => {
          console.log('errors: ', errors)
          console.log('values: ', values)
          if (!errors) {
            const params = {
              plan_id: this.plan_id,
              module_id: this.module_id,
              case_title: values.case_title,
              execute_result: values.execute_result,
              execute_person: values.execute_person
            }
            console.log('params in handleSubmit: ', params)
            getPlanSmokeCaseData(params).then(res => {
              this.testCaseList = res.data.case_data
              this.total_case_num = res.data.total_case_num
              this.pass_rate = res.data.pass_rate
              this.executed_case_num = res.data.executed_case_num
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
      queryData () {
        console.log('in queryData of PlanDetail')
        this.total_case_num = 0
        this.pass_rate = ''
        this.executed_case_num = 0
        this.getPlanSmokeCaseData()
      },
      getPlanSmokeCaseData (moduleId, treeNodeChildren) {
        // this.$message.info('用例查询中。')
        console.log('moduleId in getPlanSmokeCaseData:', moduleId)
        const params = {
          module_id: moduleId || this.module_id,
          plan_id: this.plan_id,
          case_title: '',
          execute_result: '',
          execute_person: '',
          tree_node_children: treeNodeChildren
        }
        console.log('params in getPlanSmokeCaseData:', params)
        this.loading = true
        getPlanSmokeCaseData(params).then(res => {
          this.testCaseList = res.data.case_data
          this.total_case_num = res.data.total_case_num
          this.pass_rate = res.data.pass_rate
          this.executed_case_num = res.data.executed_case_num
        }).catch(err => {
          this.$message.error(err.message)
        }).finally(() => {
          this.loading = false
        })
      },
      init () {
        console.log('in init of SmokeCaseList.vue')
        this.getPlanSmokeCaseData()
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../caseList.less";

  // 修改tabs滚动条粗细度
  /deep/ .ant-tabs-ink-bar-animated{
    bottom: 0;
  }

  .create_iteration_button{
    margin-left: 50px;
    cursor: pointer;
    color: #5D7092
  }
  .create_iteration_button:hover{
    color: #14C393;
  }

  .automatic_code_repository{
    float: right;
    margin-left: 50px;
    cursor: pointer;
    // color: rgb(52, 143, 228)
    color: #5D7092;
  }
  .automatic_code_repository:hover{
    color: #14C393;
  }

  .smoke_case_page_button{
    float: right;
    margin-left: 50px;
    cursor: pointer;
    // color: rgb(52, 143, 228)
    color: #5D7092;
  }
  .smoke_case_page_button:hover{
    color: #14C393;
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
      font-size: 5px;
    }
  }

  .select_option {
    cursor: pointer;
  }
  .select_option:hover {
    color: #14C393;
  }
</style>


