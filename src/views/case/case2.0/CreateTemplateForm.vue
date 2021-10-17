<template>
  <div ref="caseTemplateModal">
    <a-modal
      :title="!template_id ? '新建模板' : '修改模板'"
      :width="'90%'"
      :getContainer="() => $refs.caseTemplateModal"
      style="top: 15px;"
      v-model="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      :confirmLoading="confirmLoading"
    >
      <div class="table-page-search-wrapper">
        <div style="width: 70%; height: 560px; overflow-x: hidden">
          <a-form :form="form">
            <a-row :gutter="4">
              <a-col :span="22">
                <a-form-item label="模板名称">
                  <a-input
                    v-decorator="[
                      'template_name',
                      { rules: [{ required: true, message: '请输入模板名称' }] }
                    ]"
                    placeholder="请输入模板名称"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="4">
              <a-col :span="22">
                <a-form-item label="用例标题">
                  <a-input
                    v-decorator="[
                      'case_title'
                    ]"
                    placeholder="请输入用例标题"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="4">
              <a-col :span="22">
                <a-form-item label="前置条件">
                  <Editor
                    v-if="preConditionShowEditor"
                    :editorContent="this.preConditionEditorContent"
                    :preConditionEditor="true"
                    @preConditionEditorChange="preConditionEditorChange"
                  ></Editor>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="4" style="margin-top: 10px">
              <a-col :span="5">
                <span>测试步骤：</span>
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
            >
              <a-col :span="1">
                <div style="margin-top: 4px">
                  <a-badge
                    :count="keysList.indexOf(item) + 1"
                    :number-style="{ backgroundColor: '#14C393' }"
                    :overflowCount="100000"
                    :showZero="true"
                  />
                </div>
              </a-col>
              <a-col :span="10">
                <a-form-item>
                  <a-input
                    type="textarea"
                    :autoSize="true"
                    style="resize: none; overflow-y: hidden; border: 0px;"
                    placeholder="请输入步骤描述"
                    v-decorator="[
                      `step_desc_${keysList.indexOf(item)}`,
                      {
                        initialValue: stepData[keysList.indexOf(item)]
                          ? stepData[keysList.indexOf(item)].step_desc
                          : undefined
                      }
                    ]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item>
                  <a-input
                    type="textarea"
                    :autoSize="true"
                    style="resize: none; overflow-y: hidden; border: 0px; width: 92%; margin-right: 8px"
                    placeholder="请输入预期结果"
                    v-decorator="[
                      `step_result_${keysList.indexOf(item)}`,
                      {
                        initialValue: stepData[keysList.indexOf(item)]
                          ? stepData[keysList.indexOf(item)].step_result
                          : undefined
                      }
                    ]"
                  />
                  <template v-if="item > 1">
                    <a-icon
                      type="minus-circle"
                      class="dynamic-delete-button"
                      @click="removeRow(item)"
                    />
                  </template>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="6">
                <a-form-item>
                  <a-button
                    type="link"
                    style="margin-left: -10px"
                    @click="addRow"
                  >
                    <a-icon type="plus-circle" /> 添加步骤
                  </a-button>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="4">
              <a-col :span="22">
                <a-form-item label="备注">
                  <Editor
                    v-if="remarkShowEditor"
                    :editorContent="this.remarkEditorContent"
                    :remarkEditor="true"
                    @remarkEditorChange="remarkEditorChange"
                  ></Editor>
                </a-form-item>
              </a-col>
            </a-row>
            <div style="width: 80%; position: absolute; left: 75%; top: 10%">
              <a-row style="margin-top: 10px">
                <a-col :span="6">
                  <a-form-item label="所属项目">
                    <a-select
                      v-decorator="[
                        'belong_project',
                        { rules: [{ required: true, message: '请选择项目' }] }
                      ]"
                      placeholder="请选择"
                      @change="handleChangeProject"
                    >
                      <a-select-option
                        v-for="item in projectList"
                        :key="item.id"
                        :value="item.id"
                      >
                        {{ item.project_name }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row style="margin-top: 10px">
                <a-col :span="6">
                  <a-form-item label="所属模块">
                    <a-tree-select
                      style="width: 100%"
                      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                      :tree-data="treeDataList"
                      placeholder="请选择"
                      @change="handleChangeModule"
                      v-decorator="[
                        'belong_module'
                      ]"
                    >
                    </a-tree-select>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row style="margin-top: 10px">
                <a-col :span="6">
                  <a-form-item label="用例类型">
                    <a-select
                      v-decorator="[
                        'case_type',
                        {
                          initialValue: '功能测试'
                        }
                      ]"
                      placeholder="请选择"
                      @change="handleChangeCaseType"
                    >
                      <a-select-option
                        v-for="item in case_type_list"
                        :key="item"
                      >
                        {{ item }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row style="margin-top: 10px">
                <a-col :span="6">
                  <a-form-item label="用例等级">
                    <a-select
                      v-decorator="[
                        'case_level'
                      ]"
                      placeholder="请选择"
                    >
                      <a-select-option
                        v-for="case_level_info in case_level_list"
                        :key="case_level_info"
                      >
                        {{ case_level_info }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row style="margin-top: 7px;">
                <a-col :md="6" :sm="24">
                  <span style="color: rgba(0, 0, 0, 0.85); font-size: 14px;">是否冒烟测试：</span>
                  <a-switch style="margin-left: 2px; margin-top: -2px;" v-model="enableSmokeTestChecked" @change="enableSmokeTestChange" />
                </a-col>
              </a-row>
              <a-row style="margin-top: 5px">
                <a-col :md="6" :sm="24">
                  <a-form-item label="维护人">
                    <a-input
                      v-decorator="[
                        'maintainer'
                      ]"
                      placeholder="请输入维护人"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row style="margin-top: 10px">
                <a-col :md="6" :sm="24">
                  <span style="color: rgba(0, 0, 0, 0.85); font-size: 14px;">是否关联自动化：</span>
                  <a-switch style="margin-left: 2px; margin-top: -2px;" v-model="enableChecked" @change="enableChange" />
                </a-col>
              </a-row>
            </div>
          </a-form>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { getProjectNameList } from '@/api/case/project_two'
import { createOrModifyCaseTemplate, getCaseTemplateById } from '@/api/case/case_two'
import { getModuleList } from '@/api/case/module_two'
import { TreeSelect } from 'ant-design-vue'
import Editor from './component/Editor'
export default {
  props: {
    createTemplateVisible: {
      type: Boolean,
      default: false
    }
  },
  components: { TreeSelect, Editor },
  data () {
    return {
      id: 0,
      keysList: [1],
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      formItemLayoutWithOutLabel: {
        wrapperCol: {
          xs: { span: 24, offset: 0 },
          sm: { span: 20, offset: 4 }
        }
      },
      isClear: false,
      detail: '',
      arr: [],
      stepData: [],
      formData: {},
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      },
      stepTitle: '',
      visible: this.createTemplateVisible,
      confirmLoading: false,
      form: this.$form.createForm(this, {
        name: 'createCaseTemplateForm'
      }),
      projectList: [],
      memberList: [],
      test_data: [],
      step_info: [],
      enableChecked: false,
      enableSmokeTestChecked: false,
      module_list: [],
      module_value: '',
      project_name: '',
      project_members: [],
      project_desc: '',
      project_id: 0,
      module_id: 0,
      template_id: 0,
      case_title: '',
      pre_condition: '',
      remark: '',
      remarkEditorContent: '',
      preConditionEditorContent: '',
      remarkShowEditor: true,
      preConditionShowEditor: true,
      belong_project: '',
      belong_module: '',
      case_level: '',
      maintainer: '',
      createNext: false,
      if_need_automated: '',
      case_level_list: ['Level 1', 'Level 2', 'Level 3'],
      case_type_list: ['功能测试', '性能测试', '配置相关', '安装部署', '接口测试', '安全相关', '兼容性测试', 'UI测试', '其他'],
      case_type: '',
      treeDataList: [],
      treeData: [
        {
          title: 'Node1',
          value: '0-0',
          key: '0-0',
          children: [
            {
              value: '0-0-1',
              key: '0-0-1',
              scopedSlots: {
                // custom title
                title: 'title'
              }
            },
            {
              title: 'Child Node2',
              value: '0-0-2',
              key: '0-0-2'
            }
          ]
        },
        {
          title: 'Node2',
          value: '0-1',
          key: '0-1'
        }
      ]
    }
  },
  watch: {
    // 这一步很关键，此时在父组件修改了组件的props，会同步到组件内对应的props上
    // 但是不会同步到你刚刚在data对象中创建的 dialog 上
    // 所以需要再创建一个针对props属性dialogFormVisible的watch（监听）
    // 当props修改后对应data中的副本dialog 也要同步数据。
    createTemplateVisible (val) {
      this.visible = val
    }

  },
  beforecreate () {
    this.form.getFieldDecorator('keys', { initialValue: [], preserve: true });
  },
  created () {
    console.log('in created function')
    this.getProjectNameList()
    // this.getModuleList()
  },
  methods: {
    onChangeCheckbox (e) {
      console.log(`checked = ${e.target.checked}`)
      this.createNext = e.target.checked
      console.log('this.createNext: ', this.createNext)
    },
    preConditionEditorChange (val) {
      console.log('val in preConditionEditorChange:', val)
      this.pre_condition = val
      console.log('this.pre_condition:', this.pre_condition)
    },
    remarkEditorChange (val) {
      console.log('val in remarkEditorChange:', val)
      this.remark = val
      console.log('this.remark:', this.remark)
    },
    // 移除某行
    removeRow (k) {
      if (this.keysList.length === 0) { // 如果存在可以移除所有行的情况，把条件改为this.keysList.length === 0即可
        return
      }
      const index = this.keysList.indexOf(k)
      this.keysList = this.keysList.filter(item => item !== k)
      console.log('this.keysList in removeRow:', this.keysList)
      console.log('this.stepData:', this.stepData)
      console.log('index:', index)
      // keysList减少一个元素，同步删除stepData中对应位置的数据，以防再次添加一行时，之前的内容又重复展示，交互效果不好
      console.log('k:', k)
      console.log('this.stepData[index]:', this.stepData[index])
      if (this.stepData[index]) {
        this.stepData.splice(index, 1)
        console.log('this.stepData after splice:', this.stepData)
      }
    },
    // 新增一行
    addRow () {
      this.id = this.id + 2
      // this.keysList = this.keysList.concat(this.id)
      this.keysList.push(this.keysList[this.keysList.length - 1] + 1)
      console.log('this.keysList in addRow:', this.keysList)
      console.log('this.stepData in addRow:', this.stepData)
      console.log('this.arr in addRow:', this.arr)
    },
    handleChangeProject (value) {
      console.log(`selected project: ${value}`);
      this.project_id = parseInt(`${value}`)
      // 切换了项目后，模块先清空
      this.form.setFieldsValue({ belong_module: '' })
      this.getModuleList(this.project_id)
    },
    handleChangeModule (value) {
      console.log(`selected module: ${value}`);
      this.module_id = parseInt(`${value}`)
    },
    handleChangeCaseType (value) {
      console.log(`selected case_type: ${value}`);
      this.case_type = value
    },
    getProjectNameList () {
      getProjectNameList().then(res => {
        this.projectList = res.data
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    getModuleList (projectId) {
      this.loading = true
      const params = {
        project_id: projectId
      }
      this.treeDataList = []
      getModuleList(params).then(res => {
        console.log('res.data:', res.data)
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].title !== '所有用例') {
            this.treeDataList.push(res.data[i])
          }
        }
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    createTestStep () {
      console.log('create test step')
    },
    enableSmokeTestChange (checked) {
      console.log(`if_smoke_test ${checked}`)
      this.enableSmokeTestChecked = checked
    },
    enableChange (checked) {
      console.log(`if_need_automated ${checked}`)
      this.enableChecked = checked
    },
    init (templateId) {
      console.log('templateId in init function: ', templateId)
      this.keysList = [1]
      this.stepData = []
      console.log('this.keysList in init:', this.keysList)
      console.log('this.stepData in init:', this.stepData)
      this.form.resetFields()
      this.template_id = templateId || 0
      this.remarkEditorContent = ''
      this.preConditionEditorContent = ''
      this.remark = ''
      this.pre_condition = ''
      // 重新渲染富文本组件
      this.remarkShowEditor = false
      this.preConditionShowEditor = false
      this.$nextTick(() => {
        this.remarkShowEditor = true
        this.preConditionShowEditor = true
      })
      if (templateId) {
        this.loading = true
        getCaseTemplateById(templateId).then(res => {
          this.test_case = res.data
          console.log('res.data in init: ', res.data)
          if (res.data) {
            // 查询模块信息
            this.getModuleList(res.data.project_id)
            this.stepInfo = res.data.step_info
            this.project_id = res.data.project_id
            this.module_id = res.data.module_id
            this.case_type = res.data.case_type
            this.remark = res.data.remark
            this.pre_condition = res.data.pre_condition
            this.remarkEditorContent = res.data.remark
            this.preConditionEditorContent = res.data.pre_condition
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
            this.enableSmokeTestChecked = res.data.if_smoke_test === 'Y'
            setTimeout(() => {
              console.log(' in setFieldsValue')
              this.form.setFieldsValue({
                case_title: res.data.case_name,
                case_type: res.data.case_type,
                template_name: res.data.template_name,
                belong_project: res.data.project_name,
                belong_module: res.data.module_name,
                case_level: res.data.case_level,
                maintainer: res.data.maintainer
              })
            }, 100)
          }
        }).catch(err => {
          this.$message.error(err.message)
        }).finally(() => {
          this.loading = false
        })
      }
    },
    handleOk () {
      this.form.validateFields((err, values) => {
        console.log('values in handleOk:', values)
        console.log('detail:', this.detail)
        if (!err) {
          this.confirmLoading = true
          const params = values
          params['if_need_automated'] = this.enableChecked ? 'Y' : 'N'
          params['if_smoke_test'] = this.enableSmokeTestChecked ? 'Y' : 'N'
          params['template_id'] = this.template_id
          params['project_id'] = this.project_id
          params['module_id'] = this.module_id
          params['remark'] = this.remark
          params['pre_condition'] = this.pre_condition
          console.log('params in handle ok:')
          console.log(params)
          createOrModifyCaseTemplate(params).then(res => {
            this.$message.success('操作成功')
            this.form.resetFields();
            this.keysList = [1]
            this.pre_condition = ''
            this.remark = ''
            this.enableChecked = false
            this.enableSmokeTestChecked = false
            this.$emit('queryData')
            this.$emit('changeCreateVisible')
          }).catch(err => {
            this.$message.error(err.message)
          }).finally(() => {
            this.confirmLoading = false
          })
        }
      });
    },
    handleCancel () {
      this.form.resetFields()
      this.remarkEditorContent = ''
      this.$emit('changeCreateVisible')
    }
  }
}
</script>

<style lang="less" scoped>
@import './caseList.less';
/deep/ .ant-form-item {
  margin-bottom: 8px;
}
.scirpt-tip {
  margin-left: 20px;
  font-size: 12px;
}

// .ant-modal-body {
//   &::-webkit-scrollbar {
//     width: 6px; /*高宽分别对应横竖滚动条的尺寸*/
//     height: 1px;
//   }
//   &::-webkit-scrollbar-thumb {
//     border-radius: 6px;
//     // -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
//     background: rgba(144, 147, 153, 0.5);
//   }
//   &::-webkit-scrollbar-track {
//     // -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
//     border-radius: 5px;
//     background: transparent;
//   }
// }
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
