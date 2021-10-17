<template>
  <div ref="caseDetailModal">
    <a-modal
      :width="'90%'"
      :getContainer="() => $refs.caseDetailModal"
      v-model="visible"
      style="top: 20px;"
      @ok="handleOk"
      @cancel="handleCancel"
      :confirmLoading="confirmLoading"
    >
      <div slot="title">
        <a-icon :style="{ color: '#14C393' }" type="solution" />
        <span style="margin-left: 5px;">用例详情</span>
        <a-divider type="vertical"/>
        <span>项目：{{ this.project_name }}</span>
        <!-- <span style="float: right; margin-right: 50px;">more</span> -->
      </div>
      <a-row :gutter="24" style="margin-top: 5px;">
        <a-col :md="34" :lg="17">
          <div style="height: 550px; overflow-x: hidden">
            <a-row :gutter="24">
              <a-col :md="24" :lg="12">
                <a-icon type="folder" />
                <span style="margin-left: 5px">模块：{{ this.module_name }}</span>
              </a-col>
            </a-row>
            <a-row :gutter="24" style="margin-top: 5px;">
              <a-col :md="24" :lg="12">
                <span style="font-size: 25px; color: #000000">
                  {{ this.case_name }}
                </span>
              </a-col>
            </a-row>
            <div style="margin-top: 20px;">
              <a-card style="width: 90%; margin-left: 5px;">
                <a-row :gutter="24">
                  <a-col :md="16" :lg="8">
                    <span>创建人：{{ this.maintainer }}</span>
                  </a-col>
                  <a-col :md="16" :lg="8">
                    <span style="margin-left: 5px;">用例等级：
                      <a-tag v-if="this.case_level === 'Level 1'" color="#E86452"><div class="title_tag">{{ this.case_level }}</div></a-tag>
                      <a-tag v-if="this.case_level === 'Level 2'" color="#FF9845"><div class="title_tag">{{ this.case_level }}</div></a-tag>
                      <a-tag v-if="this.case_level === 'Level 3'" color="#F6BD16"><div class="title_tag">{{ this.case_level }}</div></a-tag>
                    </span>
                  </a-col>
                  <a-col :md="16" :lg="8">
                    <span style="margin-left: 5px;">是否需要关联自动化：{{ this.if_need_automated === 'Y' ? '是' : '否' }}</span>
                  </a-col>
                </a-row>
                <a-row :gutter="24" style="margin-top: 20px;">
                  <a-col :md="16" :lg="8">
                    <span style="margin-left: 0px;">创建时间：{{ this.created_time }}</span>
                  </a-col>
                  <a-col :md="16" :lg="8">
                    <span style="margin-left: 5px;">更新时间：{{ this.modified_time }}</span>
                  </a-col>
                  <!-- <a-col :md="16" :lg="8">
                    <span style="margin-left: 5px;">是否冒烟测试：{{ this.if_smoke_test === 'Y' ? '是' : '否' }}</span>
                  </a-col> -->
                </a-row>
              </a-card>
            </div>
            <a-row :gutter="24" style="margin-top: 20px;">
              <a-col :md="48" :lg="24">
                <span style="color: #000000">前置条件：</span>
                <a-card style="width: 90%; margin-top: 5px; margin-left: 5px;">
                  <p v-if="this.pre_condition" v-html="this.pre_condition">{{ this.pre_condition }}</p>
                  <p v-else style="margin-top: 5px;">无</p>
                </a-card>
              </a-col>
            </a-row>
            <a-row :gutter="4" style="margin-top: 15px">
              <a-col :span="5">
                <span style="color: #000000">测试步骤：</span>
              </a-col>
            </a-row>
            <a-row :gutter="4" style="margin-top: 10px">
              <a-col :span="1">
                <span>序号</span>
              </a-col>
              <a-col :span="10">
                <span>步骤描述</span>
              </a-col>
              <a-col :span="12">
                <span>期望结果</span>
              </a-col>
            </a-row>
            <a-row
              v-for="item in keysList"
              :key="keysList.indexOf(item)"
              :gutter="4"
              style="margin-top: 10px"
            >
              <a-col :span="1">
                <div>
                  <a-badge
                    :count="keysList.indexOf(item) + 1"
                    :number-style="{ backgroundColor: '#14C393' }"
                    :overflowCount="100000"
                    :showZero="true"
                  />
                </div>
              </a-col>
              <a-col :span="10">
                <a-textarea style="resize: none; border: none; overflow-y: hidden;" readOnly :autoSize="true" :value="stepData[keysList.indexOf(item)] ? stepData[keysList.indexOf(item)].step_desc : undefined"/>
                <!-- <a-input
                  type="textarea"
                  v-model="item.expect_result"
                  readOnly
                  :autoSize="true"
                  style="resize: none; border: none; overflow-y: hidden;"
                /> -->
              </a-col>
              <a-col :span="11">
                <a-textarea style="resize: none; border: none; overflow-y: hidden;" readOnly :autoSize="true" :value="stepData[keysList.indexOf(item)] ? stepData[keysList.indexOf(item)].step_result : undefined"/>
              </a-col>
            </a-row>
            <a-row :gutter="24" style="margin-top: 30px;">
              <a-col :md="48" :lg="24">
                <span style="color: #000000">备注：</span>
                <a-card style="width: 90%; margin-top: 5px; margin-left: 5px;">
                  <p v-if="this.remark" v-html="this.remark">{{ this.remark }}</p>
                  <p v-else style="margin-top: 5px;">无</p>
                </a-card>
              </a-col>
            </a-row>
            <a-row :gutter="24" style="margin-top: 20px;">
              <a-col :md="48" :lg="24">
                <a-button @click="modifyTestCase()" style="margin-left: 88%;" type="primary">编辑用例</a-button>
              </a-col>
            </a-row>
          </div>
        </a-col>
        <a-col :md="14" :lg="7">
          <div>
            <a-tabs default-active-key="1">
              <a-tab-pane key="1" style="height: 500px;">
                <span slot="tab">
                  评论 {{ this.comment_data ? this.comment_data.length : undefined }}
                </span>
                <div :style="'overflow-x:' + 'hidden;' + 'margin-left:' + '10px;' + 'height:' + `${this.commentHeight}`">
                  <div
                    v-for="item in comment_data"
                    :key="comment_data.indexOf(item)"
                    style="margin-top: 15px;"
                    @mouseenter="onMouseEnter(item)"
                    @mouseleave="onMouseOut(item)"
                  >
                    <a-row :gutter="24">
                      <a-col :md="26" :lg="13">
                        <span :style="{ color: '#5B8FF9' }">
                          {{ item.name }}
                        </span>
                        <span style="margin-left: 5px;">
                          {{ item.time }}
                        </span>
                      </a-col>
                      <a-col :md="18" :lg="9">
                        <span>
                          <a-tooltip placement="top" v-model="item.tooltipVisible">
                            <template slot="title">
                              <span>删除</span>
                            </template>
                            <a-icon
                              v-if="item.deleteSeen"
                              a-icon
                              type="delete"
                              @click="(e)=> openDeleteConfirm(item)"
                              style="margin-left: 100%"
                            />
                          </a-tooltip>
                          <a-modal
                            v-model="deleteCommentConfirmvisible"
                            title="确认删除"
                            @ok="handleDeleteComment"
                            :width="700"
                          >
                            <p>确定要删除该评论吗？</p>
                          </a-modal>
                        </span>
                      </a-col>
                    </a-row>
                    <a-row :gutter="24">
                      <a-col :md="48" :lg="24">
                        <p v-html="item.comment_content" style="margin-top: 5px; margin-left: 5px;">
                          {{ item.comment_content }}
                        </p>
                      </a-col>
                    </a-row>
                  </div>
                  <a-empty v-if="comment_data.length == 0" description="暂无评论" :image="simpleImage" class="empty-info"/>
                </div>
                <div style="height: 20%;">
                  <CommentEditor
                    v-if="commentEditorVisible"
                    :editorContent="this.commentEditorContent"
                    @commentEditorChange="commentEditorChange"
                    @changeCommentEditorVisible="changeCommentEditorVisible"
                    style="margin-left: -5px; width: 105%; position: absolute; bottom: 10px; z-index: 1"
                  />
                  <a-button
                    v-if="commentEditorVisible"
                    style="position: absolute; bottom: 50px; right: 25px; z-index: 2"
                    type="primary"
                    @click="addComment()"
                  >
                    发送
                  </a-button>
                   <a-card v-show="!commentEditorVisible" @click="handleOpenCommentEditor()" style="position: absolute; bottom: 10px; width: 105%; margin-left: -5px;">
                    <span style="color: #A9AAAC;">发表评论</span>
                  </a-card>
                </div>
              </a-tab-pane>
              <a-tab-pane key="2" style="height: 500px;">
                <span slot="tab">
                  操作记录
                </span>
                <div style="overflow-x: hidden; margin-left: 10px; height: 98%">
                  <div
                    v-for="item in operation_record_data"
                    :key="operation_record_data.indexOf(item)"
                    style="margin-top: 15px;"
                  >
                    <a-row :gutter="24">
                      <a-col :md="26" :lg="13">
                        <span :style="{ color: '#5B8FF9' }">
                          {{ item.operation_person }}
                        </span>
                        <span style="margin-left: 5px;">
                          {{ item.operation_time }}
                        </span>
                      </a-col>
                    </a-row>
                    <a-row :gutter="24">
                      <a-col :md="48" :lg="24">
                        <!-- <p v-html="item.operation_type" style="margin-top: 5px; margin-left: 5px;"> -->
                        <div style="margin-top: 5px; margin-left: 5px;">
                          {{ item.operation_type|opertionTypeFilter }}
                          <!-- 类型为修改前置条件 -->
                          <span v-if="item.operation_type === '5'">
                            <a style="margin-left: 5px;" @click="handleComparePreCondition(item)">对比</a>
                          </span>
                          <!-- 类型为修改测试步骤 -->
                          <span v-if="item.operation_type === '6'">
                            <a style="margin-left: 5px;" @click="handleCompareCaseStep(item)">对比</a>
                          </span>
                          <!-- 类型为修改备注 -->
                          <span v-if="item.operation_type === '9'">
                            <a style="margin-left: 5px;" @click="handleCompareRemark(item)">对比</a>
                          </span>
                          <!-- 类型为创建用例/移动/赋值/删除 -->
                          <span v-if="['1', '11', '12', '14'].indexOf(item.operation_type) != -1">
                          </span>
                          <!-- 类型为修改标题/项目/模块/用例等级/用例类型/维护人/关联自动化选项 -->
                          <div style="margin-top: 5px;" v-if="['4', '2', '3', '7', '8', '10', '13'].indexOf(item.operation_type) != -1">
                            <span>
                              {{ item.original_value }}
                              <a-icon style="margin-left:6px; margin-right: 6px;" type="arrow-right" />
                              {{ item.present_value }}
                            </span>
                          </div>
                        </div>
                      </a-col>
                    </a-row>
                  </div>
                  <a-empty v-if="operation_record_data.length == 0" description="暂无操作记录" :image="simpleImage" class="empty-info"/>
                </div>
              </a-tab-pane>
            </a-tabs>
            <OperationRecordCompare
              :operationRecordCompareVisible="this.operationRecordCompareVisible"
              ref="operationRecordCompare"
              @changeOperationRecordCompareVisible="changeOperationRecordCompareVisible"
            />
            <CreateCaseForm
              :createFormVisible="this.createFormVisible"
              ref="createTestCase"
              @changeCreateVisible="changeCreateVisible"
              @queryData="handleOk"
            />
          </div>
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>
<script>
import { Empty } from 'ant-design-vue';
import { getTestCaseById, getCaseCommentsByCaseId, addCommentToCase, deleteComment, getCaseOperationRecordByCaseId } from '@/api/case/case_two'
import CommentEditor from './component/CommentEditor'
import OperationRecordCompare from './component/OperationRecordCompare'
import CreateCaseForm from './CreateCaseForm'
const operationTypeMap = {
  '1': '创建了用例',
  '2': '修改了项目',
  '3': '修改了模块',
  '4': '修改了标题',
  '5': '修改了前置条件',
  '6': '修改了测试步骤',
  '7': '修改了用例等级',
  '8': '修改了用例类型',
  '9': '修改了备注',
  '10': '修改了维护人',
  '11': '复制了测试用例',
  '12': '移动了测试用例',
  '13': '修改了是否关联自动化选项',
  '14': '删除了用例'
}
const commentColumns = [
  {
    dataIndex: 'name',
    key: 'name',
    width: 470,
    slots: { title: 'customTitle' },
    scopedSlots: { customRender: 'name' }
  }
]
export default {
  props: {
    caseDetailVisible: {
      type: Boolean,
      default: false
    }
  },
  components: { CommentEditor, OperationRecordCompare, CreateCaseForm },
  data () {
    return {
      id: 0,
      keysList: [1],
      isClear: false,
      detail: '',
      arr: [],
      stepData: [],
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      },
      stepTitle: '',
      visible: this.caseDetailVisible,
      createFormVisible: false,
      confirmLoading: false,
      commentColumns,
      projectList: [],
      memberList: [],
      test_data: [],
      step_info: [],
      enableChecked: true,
      module_list: [],
      module_value: '',
      project_name: '',
      module_name: '',
      comment_num: 1,
      commentLoading: false,
      deleteCommentConfirmvisible: false,
      commentEditorVisible: false,
      commentEditorContent: '',
      commentHeight: '',
      delete_comment_id: 0,
      project_members: [],
      project_desc: '',
      project_id: 0,
      module_id: 0,
      case_id: 0,
      case_name: '',
      case_level: '',
      if_need_automated: '',
      pre_condition: '',
      remark: '',
      created_time: '',
      modified_time: '',
      if_smoke_test: '',
      remarkEditorContent: '',
      preConditionEditorContent: '',
      remarkShowEditor: true,
      preConditionShowEditor: true,
      belong_project: '',
      belong_module: '',
      maintainer: '',
      case_level_list: ['leve1', 'level2', 'level3'],
      case_type_list: ['功能测试', '性能测试', '配置相关', '安装部署', '接口测试', '安全相关', '兼容性测试', 'UI测试', '其他'],
      case_type: '',
      treeDataList: [],
      comment_data: [],
      simpleImage: '',
      operationRecordCompareVisible: false,
      operation_record_data: [],
      operation_record_data_bkp: [
        {
          id: 1,
          operation_type: '1',
          original_value: '',
          present_value: '',
          operation_person: '夏晓旭',
          operation_time: '2021-04-14 19:49:24'
        },
        {
          id: 2,
          operation_type: '2',
          original_value: '项目一',
          present_value: '测试项目',
          operation_person: '夏晓旭',
          operation_time: '2021-04-14 19:49:24'
        },
        {
          id: 3,
          operation_type: '3',
          original_value: '模块一',
          present_value: '测试模块',
          operation_person: '夏晓旭',
          operation_time: '2021-04-14 19:49:24'
        },
        {
          id: 4,
          operation_type: '4',
          original_value: '标题一',
          present_value: '测试标题',
          operation_person: '夏晓旭',
          operation_time: '2021-04-14 19:49:24'
        },
        {
          id: 5,
          operation_type: '5',
          original_value: '前置条件一',
          present_value: '测试前置条件',
          operation_person: '夏晓旭',
          operation_time: '2021-04-14 19:49:24'
        },
        {
          id: 6,
          operation_type: '6',
          original_value: {
            step_desc: ['1、测试步骤一', '2、测试步骤2', '3、测试步骤3'],
            step_result: ['1、期望结果一', '2、期望结果2']
          },
          present_value: {
            step_desc: ['1、测试步骤一', '2、测试步骤2'],
            step_result: ['1、期望结果一', '2、期望结果2']
          },
          operation_person: '夏晓旭',
          operation_time: '2021-04-14 19:49:24'
        },
        {
          id: 7,
          operation_type: '7',
          original_value: 'Level 1',
          present_value: 'Level 2',
          operation_person: '夏晓旭',
          operation_time: '2021-04-14 19:49:24'
        },
        {
          id: 8,
          operation_type: '8',
          original_value: '功能测试',
          present_value: '性能测试',
          operation_person: '夏晓旭',
          operation_time: '2021-04-14 19:49:24'
        },
        {
          id: 9,
          operation_type: '9',
          original_value: '备注一',
          present_value: '备注二',
          operation_person: '夏晓旭',
          operation_time: '2021-04-14 19:49:24'
        },
        {
          id: 10,
          operation_type: '10',
          original_value: '张三',
          present_value: '李四',
          operation_person: '夏晓旭',
          operation_time: '2021-04-14 19:49:24'
        },
        {
          id: 11,
          operation_type: '11',
          original_value: '',
          present_value: '',
          operation_person: '夏晓旭',
          operation_time: '2021-04-14 19:49:24'
        },
        {
          id: 12,
          operation_type: '12',
          original_value: '',
          present_value: '',
          operation_person: '夏晓旭',
          operation_time: '2021-04-14 19:49:24'
        },
        {
          id: 13,
          operation_type: '13',
          original_value: '否',
          present_value: '是',
          operation_person: '夏晓旭',
          operation_time: '2021-04-14 19:49:24'
        }
      ]
    }
  },
  watch: {
    // 这一步很关键，此时在父组件修改了组件的props，会同步到组件内对应的props上
    // 但是不会同步到你刚刚在data对象中创建的 dialog 上
    // 所以需要再创建一个针对props属性dialogFormVisible的watch（监听）
    // 当props修改后对应data中的副本dialog 也要同步数据。
    caseDetailVisible (val) {
      console.log('in caseDetailVisible')
      this.visible = val
    }

  },
  beforecreate () {
    this.simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;
  },
  created () {
    console.log('in created function')
  },
  filters: {
    opertionTypeFilter (type) {
      return operationTypeMap[type]
    }
  },
  methods: {
    modifyTestCase () {
      this.createFormVisible = true
      this.$refs.createTestCase.init(this.case_id)
    },
    changeCreateVisible () {
      this.createFormVisible = false
      // 新建用例组件隐藏后，应该刷新一下模块树组件
      // 移除组件，用于刷新模型树，ModuleTree组件重新渲染时会根据project_id查找模型数据
      this.updateTreeComp = false
      // 在组件移除后，重新渲染组件
      // this.$nextTick可实现在DOM 状态更新后，执行传入的方法。
      this.$nextTick(() => {
          this.updateTreeComp = true
      })
    },
    changeOperationRecordCompareVisible () {
      console.log('in changeOperationRecordCompareVisible')
      this.operationRecordCompareVisible = false
    },
    handleComparePreCondition (operationData) {
      console.log('in handleComparePreCondition')
      this.operationRecordCompareVisible = true
      this.$refs.operationRecordCompare.init('preCondition', operationData)
    },
    handleCompareCaseStep (operationData) {
      console.log('operationData in handleCompareCaseStep: ', operationData)
      this.operationRecordCompareVisible = true
      this.$refs.operationRecordCompare.init('caseStep', operationData)
    },
    handleCompareRemark (operationData) {
      console.log('in handleCompareRemark')
      this.operationRecordCompareVisible = true
      this.$refs.operationRecordCompare.init('remark', operationData)
    },
    onMouseEnter (data) {
      console.log('data in onMouseEnter:', data)
      data.deleteSeen = true
      // console.log('data.ellipsisSeen:', data.ellipsisSeen)
    },
    onMouseOut (data) {
      console.log('in onMouseOut')
      data.deleteSeen = false
      // console.log('data.ellipsisSeen:', data.ellipsisSeen)
    },
    openDeleteConfirm (data) {
        console.log('in openDeleteConfirm');
        this.deleteCommentConfirmvisible = true;
        this.delete_comment_id = data.id
    },
    handleDeleteComment () {
      console.log('in handleDeleteComment')
      console.log('this.delete_comment_id: ', this.delete_comment_id)
      this.deleteCommentConfirmvisible = false
      const params = {
        comment_id: this.delete_comment_id
      }
      deleteComment(params).then(res => {
        console.log('params in deleteComment: ', params)
        this.getCaseCommentsByCaseId()
      }).catch(err => {
          this.$message.error(err.message)
        })
    },
    commentEditorChange (val) {
      console.log('val in commentEditorChange: ', val)
      this.commentEditorContent = val
      console.log('this.commentEditorContent:', this.commentEditorContent)
    },
    changeCommentEditorVisible () {
      console.log('in changeCommentEditorVisible')
       this.commentEditorVisible = false
       this.commentHeight = '84%'
    },
    handleOpenCommentEditor () {
      console.log('in handleOpenCommentEditor')
      this.commentEditorContent = ''
      this.commentEditorVisible = true
      console.log('this.commentEditorVisible: ', this.commentEditorVisible)
      this.commentHeight = '70%'
    },
    addComment () {
      console.log('in addComment')
      console.log('this.commentEditorContent in addComment: ', this.commentEditorContent)
      this.commentHeight = '84%'
      this.commentEditorVisible = false
      const params = {
        case_id: this.case_id,
        comment_content: this.commentEditorContent
      }
      addCommentToCase(params).then(res => {
        console.log('params in addComment: ', params)
        this.getCaseCommentsByCaseId()
      }).catch(err => {
          this.$message.error(err.message)
        })
    },
    init (caseInfo, projectName) {
      console.log('in init function of CaseDetail.vue ')
      console.log('caseInfo in init of CaseDetail.vue：', caseInfo)
      this.keysList = [1]
      this.stepData = []
      console.log('case_id:', caseInfo.id)
      console.log('this.keysList in init:', this.keysList)
      console.log('this.stepData in init:', this.stepData)
      this.case_id = caseInfo.id || 0
      this.case_name = caseInfo.case_name
      this.project_name = projectName
      this.project_id = caseInfo.project_id
      this.module_id = caseInfo.module_id
      this.case_type = caseInfo.case_type
      this.case_level = caseInfo.case_level
      this.if_need_automated = caseInfo.if_need_automated
      this.if_smoke_test = caseInfo.if_smoke_test
      this.maintainer = caseInfo.maintainer
      this.remark = caseInfo.remark
      this.created_time = caseInfo.created_time
      this.modified_time = caseInfo.modified_time
      this.pre_condition = caseInfo.pre_condition
      this.commentEditorVisible = false
      this.commentHeight = '84%'
      this.comment_data = []
      this.operation_record_data = []
      if (caseInfo) {
        this.loading = true
        getTestCaseById(caseInfo.id).then(res => {
          this.test_case = res.data
          console.log('res.data in init: ', res.data)
          if (res.data) {
            this.module_name = res.data.module_name
            this.stepInfo = res.data.step_info
            // 重新渲染富文本组件
            this.remarkShowEditor = false
            this.preConditionShowEditor = false
            this.$nextTick(() => {
              this.remarkShowEditor = true
              this.preConditionShowEditor = true
            })
            console.log('this.project_id in init:', this.project_id)
            console.log('this.module_id in init:', this.module_id)
            // 根据查询用例信息，赋值this.project_id, this.module_id
            console.log('this.stepInfo in init: ', this.stepInfo)
            console.log('this.case_type in init: ', this.case_type)
            console.log('this.remarkEditorContent in init: ', this.remarkEditorContent)
            console.log('this.preConditionEditorContent in init:', this.preConditionEditorContent)
            for (var i = 0; i < res.data.step_info.length; i++) {
              if (i !== 0) {
                this.keysList.push(i + 1)
              }
              this.stepData.push(
                { step_desc: res.data.step_info[i].step_desc, step_result: res.data.step_info[i].expect_result }
              )
            }
            console.log('this.keysList:', this.keysList)
            console.log('this.stepData:', this.stepData)
            this.enableChecked = res.data.if_need_automated === 'Y'
          }
        }).catch(err => {
          this.$message.error(err.message)
        }).finally(() => {
          this.loading = false
        })
        this.getCaseCommentsByCaseId()
        this.getCaseOperationRecordByCaseId()
      }
    },
    getCaseCommentsByCaseId () {
      const params = {
          case_id: this.case_id
        }
      getCaseCommentsByCaseId(params).then(res => {
        if (res.data) {
          this.comment_data = res.data
        }
        console.log('in getCaseCommentsByCaseId')
      }).catch(err => {
          this.$message.error(err.message)
        })
    },
    getCaseOperationRecordByCaseId () {
      const params = {
          case_id: this.case_id
        }
      getCaseOperationRecordByCaseId(params).then(res => {
        console.log('res.data in getCaseOperationRecordByCaseId: ', res.data)
        if (res.data) {
          this.operation_record_data = res.data
        }
        console.log('in getCaseOperationRecordByCaseId')
      })
    },
    handleOk () {
      this.$emit('changeCaseDetailVisible')
    },
    handleCancel () {
      this.$emit('changeCaseDetailVisible')
    }
  }
}
</script>

<style lang="less" scoped>
@import './caseList.less';
.empty-info {
  padding-bottom: 40px;
  padding-top: 40px;
  // border:1px solid #e8e8e8;
}

.title_tag {
  font-weight: bold;
  color: white;
  font-size: 5px;
}

.scirpt-tip {
  margin-left: 20px;
  font-size: 12px;
}

.dynamic-delete-button:hover {
  color: #777;
}
.dynamic-delete-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}

.dynamic-wrap {
  padding-top: 10px;
  background-color: white;
  overflow-y: scroll;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    width: 7px;
  }
  &::-webkit-scrollbar-thumb {
    background: #d8d8d8;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-track-piece {
    background: transparent;
  }
}
.minusRowBtn {
  color: #f5222d;
  background: #fff1f0;
  border-color: #ffa39e;
  padding-right: 7px;
  padding-left: 7px;
  height: 29px;
  margin-left: 10px;
}
.addRowBtn {
  width: 70%;
  color: #1890ff;
  border-color: #91d5ff;
  margin: 0px 0px 20px 70px;
}
</style>
