<template>
  <div>
    <a-modal
      :title="!getImportCaseResult ? '导入用例' : '导入用例结果'"
      :width="'90%'"
      v-model="visible"
      style="top: 20px"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
    >
      <template slot="footer">
        <a-button @click="handleCancel">取消</a-button>
        <a-button type="primary" v-show="previousStepButtonVisible" @click="handlePreviousStep()">上一步</a-button>
        <a-button type="primary" v-show="nextStepButtonVisible" :disabled="nextStepButtonDisabled" @click="handleValidateCase()">下一步</a-button>
        <a-button type="primary" v-show="startImportButtonVisible" :disabled="startImportButtonDisabled" @click="handleStartImport()">开始导入</a-button>
        <a-button type="primary" v-show="confirmImportResultButtonVisible" @click="handleCancel()">确定</a-button>
      </template>
      <div v-show="uploadPageVisible">
        <div>
          <a-row>
            <a-col :md="24" :lg="12">
              <a-badge
                :count="1"
                :number-style="{ backgroundColor: '#30BF78' }"
                :overflowCount="100000"
                :showZero="true"
              />
              <span style="margin-left: 5px; color: #000000">下载模板</span>
            </a-col>
            <a-col :md="24" :lg="12">
              <a-button
                style="margin-left: 82%"
                type="primary"
                @click="downloadTemplateExcel()"
              >
                <a-icon type="download" />下载模板
              </a-button>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :md="20" :lg="10">
              <span style="margin-left: 24px">
                下载用例导入模板，按照以下规则填写导入数据
              </span>
            </a-col>
            <a-col :md="26" :lg="13">
              <span style="margin-left: 10px; color: red;">
                <a-icon type="info-circle" style="font-size: 15px;"/>
                <span style="margin-left: 5px;">请注意：如需指定模块导入用例，请选中对应模块后，再操作导入用例</span>
              </span>
            </a-col>
          </a-row>
        </div>
        <div
          style="
            margin-left: 24px;
            margin-top: 20px;
            height: 240px;
            overflow-x: hidden;
          "
        >
          <a-row :gutter="24">
            <a-col :md="48" :lg="24">
              <a-table
                :columns="columns"
                :data-source="data"
                :pagination="false"
                bordered
                rowKey="key"
              >
                <span slot="customTitle">
                  属性（带"<span style="color: red">*</span>"的为必填项）
                </span>
                <span slot="name" slot-scope="text">
                  {{
                    text.substring(text.length - 1) == '*'
                      ? text.substring(0, text.length - 1)
                      : text
                  }}<span style="color: red">{{
                    text.substring(text.length - 1) == '*' ? '*' : ''
                  }}</span>
                </span>
                <span slot="rule" slot-scope="text">
                  <span style="color: red">{{
                    text.substring(0, 3) == '必填项' ? text.substring(0, 3) : ''
                  }}</span>
                  {{
                    text.substring(0, 3) == '必填项' ? text.substring(3) : text
                  }}
                </span>
              </a-table>
            </a-col>
          </a-row>
        </div>
        <div style="margin-top: 20px">
          <a-row>
            <a-col :md="24" :lg="12">
              <a-badge
                :count="2"
                :number-style="{ backgroundColor: '#30BF78' }"
                :overflowCount="100000"
                :showZero="true"
              />
              <span style="margin-left: 5px; color: #000000">上传文件</span>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :md="24" :lg="12">
              <span style="margin-left: 24px">
                上传需要导入的Excel文件，仅支持xls，xlsx。
              </span>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-card
              style="
                background-color: #fafafa;
                margin-left: 24px;
                margin-top: 20px;
              "
            >
              <a-col :md="24" :lg="12">
                <span>点击此处</span>
                <!-- <a style="margin-left: 3px;" @click="uploadTestCaseExcel()">上传文件</a> -->
                <a-upload
                  :file-list="fileList"
                  v-if="uploadVisible"
                  list-type="text"
                  :showUploadList="{ showPreviewIcon: false, showRemoveIcon: false }"
                  accept=".xls, .xlsx"
                  :before-upload="beforeUpload"
                  @change="uploadChange"
                >
                  <a style="margin-left: 3px">
                    <span v-show="uploadTextVisible">上传文件</span>
                    <span @click="handleReUpload()" v-show="!uploadTextVisible">重新上传</span>
                  </a>
                </a-upload>
              </a-col>
            </a-card>
          </a-row>
        </div>
      </div>
      <div v-show="validatePageVisible">
        <div
          style="margin-left: 24px;"
        >
          <a-row :gutter="24">
            <a-col :md="48" :lg="24">
              <a-spin :spinning="validateLoading" tip="校验结果获取中">
                <a-card size="small" style="height: 60px;" :loading="validateLoading">
                  <a-badge style="margin-top: 8px">
                    <a-icon v-if="this.validateFailNumber > 0" type="close-circle" :style="{ fontSize: '20px', color: 'red' }"/>
                    <a-icon v-if="!this.validateFailNumber > 0" type="check-circle"  :style="{ fontSize: '20px', color: 'green' }"/>
                  </a-badge>
                  <span v-if="this.validateFailNumber > 0" style="margin-left: 8px;">
                    验证失败，共{{ this.validateFailNumber }}个用例未通过验证，请根据填写规则检查修改后重新上传文件。
                  </span>
                  <span v-else>
                    验证成功，本次共可导入{{ this.allCaseNumber }}个用例。
                  </span>
                </a-card>
              </a-spin>
            </a-col>
          </a-row>
        </div>
        <div style="margin-left: 24px; margin-top: 10px;">
          <a-row :gutter="24">
            <a-col :md="48" :lg="24">
              <a-tabs default-active-key="1" @change="handleTabChange()">
                <a-tab-pane key="1">
                  <span slot="tab">
                    全部（{{ this.allCaseNumber }}）
                  </span>
                  <div style="height: 240px; overflow-x: hidden;">
                    <a-table
                      :columns="validateResultColumns"
                      :data-source="allValidateResultData"
                      :pagination="false"
                      bordered
                      :loading="validateLoading"
                    >
                      <span slot="validate_result" slot-scope="text">
                        <a-icon v-if="text === 'fail'" :style="{ color: 'red' }" type="close" />
                        <a-icon v-if="text === 'ok'" :style="{ color: 'green' }" type="check" />
                      </span>
                    </a-table>
                  </div>
                </a-tab-pane>
                <a-tab-pane key="2" :forceRender="true">
                  <span slot="tab">
                    未通过（{{ this.validateFailNumber }}）
                  </span>
                  <div style="height: 240px; overflow-x: hidden;">
                    <a-table
                      :columns="validateResultColumns"
                      :data-source="validateFailedResultData"
                      :pagination="false"
                      bordered
                      :loading="validateLoading"
                      rowKey="key"
                    >
                      <span slot="validate_result" slot-scope="text">
                        <a-icon v-if="text === 'fail'" :style="{ color: 'red' }" type="close" />
                        <a-icon v-if="text === 'ok'" :style="{ color: 'green' }" type="check" />
                      </span>
                    </a-table>
                  </div>
                </a-tab-pane>
              </a-tabs>
            </a-col>
          </a-row>
        </div>
      </div>
      <div v-show="importResultPageVisible">
        <a-spin
          :spinning="importResultLoading"
          tip="用例导入结果获取中"
          style="height: 150px;"
        >
          <div v-show="!importResultLoading">
            <a-row>
              <a-col :md="24" :lg="12">
                <p>
                  <a-icon :style="{ color: 'green' }" type="check" />
                  <span style="margin-left: 10px;">
                    导入用例成功{{ this.importCaseSuccessResultData.length }}条
                  </span>
                </p>
                <p>
                  <a-icon :style="{ color: 'red' }" type="close" />
                  <span style="margin-left: 10px;">
                    导入用例失败{{ this.importCaseFailResultData.length }}条，其中重复导入用例{{ this.duplicateImportCaseResultData.length }}条
                  </span>
                </p>
              </a-col>
              <a-col :md="24" :lg="12">
                <a-button
                  style="margin-left: 78%"
                  type="primary"
                  @click="downloadImportCaseResult()"
                >
                  <a-icon type="download" />下载导入结果
                </a-button>
              </a-col>
            </a-row>
          </div>
        </a-spin>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { exportCaseTemplate, validateTestCase, importTestCase, getImportCaseResultExcel } from '@/api/case/case_two'
const columns = [
  {
    dataIndex: 'name',
    key: 'name',
    width: 470,
    slots: { title: 'customTitle' },
    scopedSlots: { customRender: 'name' }
  },
  {
    title: '填写规则',
    dataIndex: 'rule',
    key: 'rule',
    scopedSlots: { customRender: 'rule' }
  }
]
const data = [
  {
    key: '1',
    name: '编号*',
    rule: '必填项（导入过程根据"sheet名称+模块名称+编号+用例名称"作为唯一键标识，避免重复导入一样的用例）'
  },
  {
    key: '2',
    name: '功能模块*',
    rule: '必填项，如果夏目下没有该模块，则用例平台会自动创建该模块，不需要手动创建'
  },
  {
    key: '3',
    name: '子模块',
    rule: '选填项，如果“子模块”有值，导入时把用例挂载“子模块”对应的模块下'
  },
  {
    key: '4',
    name: '用例级别*',
    rule: '选填项，如果“子模块”有值，导入时把用例挂载“子模块”对应的模块下，忽略“功能模块”'
  },
  {
    key: '5',
    name: '用例类型*',
    rule: '必填项，选项为“功能测试”、“接口测试”、“界面测试”、“兼容性测试”、“安全测试”、“性能测试”'
  },
  {
    key: '6',
    name: '用例名称*',
    rule: '必填项'
  },
  {
    key: '7',
    name: '预置条件',
    rule: '选填项'
  },
  {
    key: '8',
    name: '操作步骤*',
    rule: '必填项，步骤请加编号填写，如1.xxx、2.xxx；每个步骤单元格内换行'
  },
  {
    key: '9',
    name: '预期结果*',
    rule: '必填项，预期结果保持编号与步骤对应，如1.xxx、2.xxx；每个预期结果单元格内换行。一条测试步骤，对应一条预期结果'
  },
  {
    key: '10',
    name: '实际结果',
    rule: '选填项，为了适配已有用例的格式，暂时保留该字段，便于处理已有用例的导入数据获取'
  },
  {
    key: '11',
    name: '维护人',
    rule: '选填项'
  },
  {
    key: '12',
    name: '备注',
    rule: '选填项'
  }
];
const validateResultColumns = [
  {
    title: 'sheet名称',
    dataIndex: 'sheet_name',
    width: 150
  },
  {
    title: '行数',
    dataIndex: 'row_num',
    width: 80
  },
  {
    title: '标题',
    dataIndex: 'title'
  },
  {
    title: '验证结果',
    dataIndex: 'validate_result',
    scopedSlots: { customRender: 'validate_result' }
  },
  {
    title: '错误原因',
    dataIndex: 'error_msg'
  }
]
export default {
  name: 'ImportCase',
  props: {
    importCaseVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      },
      data,
      columns,
      validateResultColumns,
      allValidateResultData: [],
      validateFailedResultData: [],
      visible: this.importCaseVisible,
      confirmLoading: false,
      form: this.$form.createForm(this, { name: 'createProjectForm' }),
      projectList: [],
      memberList: [],
      project_name: '',
      project_members: [],
      project_desc: '',
      project_id: 0,
      module_id: 0,
      actionUrl: `${process.env.VUE_APP_API_BASE_URL}/case/v2/case/uploadTestCase`,
      uploadTextVisible: false,
      uploadVisible: true,
      fileList: [],
      uploading: false,
      nextStepButtonDisabled: true,
      uploadPageVisible: true,
      validatePageVisible: false,
      validateLoading: true,
      previousStepButtonVisible: true,
      startImportButtonDisabled: false,
      nextStepButtonVisible: true,
      startImportButtonVisible: false,
      allCaseNumber: 0,
      validateFailNumber: 0,
      getImportCaseResult: false,
      importResultPageVisible: false,
      confirmImportResultButtonVisible: false,
      importCaseResultData: {},
      importCaseSuccessResultData: [],
      importCaseFailResultData: [],
      duplicateImportCaseResultData: [],
      importResultLoading: true
    }
  },
  watch: {
    // 这一步很关键，此时在父组件修改了组件的props，会同步到组件内对应的props上
    // 但是不会同步到你刚刚在data对象中创建的 dialog 上
    // 所以需要再创建一个针对props属性dialogFormVisible的watch（监听）
    // 当props修改后对应data中的副本dialog 也要同步数据。
    importCaseVisible (val) {
      this.visible = val
    }
  },
  created () {
    console.log('in created function')
    this.uploadTextVisible = true
  },
  methods: {
    handleReUpload () {
      console.log('in handleReUpload')
      this.fileList = []
    },
    beforeUpload (file) {
      console.log('in beforeUpload')
      this.fileList = [...this.fileList, file];
      console.log('this.fileList: ', this.fileList)
      return false;
    },
    handleUpload () {
      const { fileList } = this;
      const formData = new FormData();
      fileList.forEach(file => {
        formData.append('files[]', file);
      });
      this.uploading = true;
      // You can use any AJAX library you like
      validateTestCase(formData).then(res => {
        console.log('res.data in uploadTestCase:', res.data)
        this.fileList = [];
        this.uploading = false;
        this.$message.info('校验中，请稍等.');
        }).catch(err => {
            this.uploading = false;
            this.$message.error(err.message)
        })
    },
    uploadChange () {
      console.log('in uploadChange')
      this.uploadTextVisible = false
      this.nextStepButtonDisabled = false
      this.nextStepButtonVisible = true
      this.previousStepButtonVisible = false
    },
    downloadTemplateExcel () {
      console.log('in downloadTemplateExcel')
      console.log('this.uploadTextVisible in downloadTemplateExcel: ', this.uploadTextVisible)
      this.$message.info('用例模板下载中')
      exportCaseTemplate().then(res => {
        console.log('in exportTestCase')
        console.log('res.data in downloadTemplateExcel:', res.data)
        const caseImportTemplateName = res.data.case_import_template_name
        if (res.data) {
          // 下载操作
          const apiUrl = `${process.env.VUE_APP_API_BASE_URL}`
          const url = apiUrl + `/case/v2/case/downloadCaseImportTemplate/${caseImportTemplateName}`
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
        this.$message.error(err.message)
      })
    },
    downloadImportCaseResult () {
      console.log('in downloadImportCaseResult')
      this.$message.info('用例导入结果下载中');
      const params = {
        project_id: this.project_id,
        import_case_result_data: this.importCaseResultData
      }
      console.log('params in downloadImportCaseResult: ', params)
      getImportCaseResultExcel(params).then(res => {
        console.log('res.data in downloadImportCaseResultExcel:', res.data)
        if (res.data) {
          // 下载操作
          const importCaseResultFileName = res.data.import_case_result_file_name
          console.log('importCaseResultFileName in getImportCaseResultExcel: ', importCaseResultFileName)
          const apiUrl = `${process.env.VUE_APP_API_BASE_URL}`
          const url = apiUrl + `/case/v2/case/downloadImportCaseResultExcel/${importCaseResultFileName}`
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
        this.$message.error(err.message)
      })
    },
    handleValidateCase () {
      this.$message.info('用例校验中，请稍等。');
      this.uploadPageVisible = false
      this.validatePageVisible = true
      this.previousStepButtonVisible = true
      this.nextStepButtonVisible = false
      this.startImportButtonDisabled = true
      this.startImportButtonVisible = true
      this.allValidateResultData = []
      this.validateFailedResultData = []
      this.allCaseNumber = 0
      this.validateFailNumber = 0
      const { fileList } = this;
      const formData = new FormData();
      fileList.forEach(file => {
        formData.append('files', file);
      });
      this.validateLoading = true
      // You can use any AJAX library you like
      validateTestCase(formData).then(res => {
        console.log('res.data in validateTestCase: ', res.data)
        if (res.data) {
          this.allValidateResultData = res.data.validate_all_result
          this.validateFailedResultData = res.data.validate_failed_result
          this.allCaseNumber = res.data.validate_all_result.length
          this.validateFailNumber = res.data.validate_failed_result.length
          if (res.data.validate_failed_result.length === 0) {
            this.startImportButtonDisabled = false
          }
        }
        // this.fileList = [];
        this.validateLoading = false;
        }).catch(err => {
            this.validateLoading = false;
            this.$message.error(err.message)
        })
    },
    handlePreviousStep () {
      console.log('in handlePreviousStep')
      this.uploadPageVisible = true
      this.validatePageVisible = false
      this.startImportButtonVisible = false
      this.previousStepButtonVisible = false
      this.nextStepButtonVisible = true
    },
    handleCancel () {
      this.form.resetFields()
      this.$emit('changeImportCaseVisible')
      this.fileList = []
      this.nextStepButtonDisabled = true
      this.uploadTextVisible = true
    },
    handleStartImport () {
      console.log('in handleStartImport')
      this.validatePageVisible = false
      this.getImportCaseResult = true
      this.importResultPageVisible = true
      this.previousStepButtonVisible = false
      this.startImportButtonVisible = false
      this.confirmImportResultButtonVisible = true
      this.importResultLoading = true
      // 处理导入，后端写表
      const params = {
        project_id: this.project_id,
        module_id: this.module_id,
        import_test_case_data: this.allValidateResultData,
        tree_node_children: this.tree_node_children
      }
      console.log('params in handleStartImport: ', params)
      importTestCase(params).then(res => {
        console.log('res.data in importTestCase: ', res.data)
        if (res.data) {
          this.importCaseResultData = res.data
          this.importCaseSuccessResultData = res.data.import_case_success_result
          this.importCaseFailResultData = res.data.import_case_fail_result
          this.duplicateImportCaseResultData = res.data.duplicate_import_case_result
          this.importResultLoading = false
          }
        if (res.message.indexOf('异常') !== -1) {
             this.$message.error('用例导入异常')
          }
        this.$emit('queryData')
        }).catch(err => {
            this.$message.error(err.message)
            this.importResultLoading = false
        })
    },
    handleTabChange () {
      console.log('in handleTabChange')
    },
    init (projectId, moduleId, treeNodeChildren) {
      console.log('projectId in init of importCase:', projectId)
      console.log('moduleId in init of importCase:', moduleId)
      this.uploadPageVisible = true
      this.validatePageVisible = false
      this.importResultPageVisible = false
      this.nextStepButtonDisabled = true
      this.previousStepButtonVisible = false
      this.startImportButtonDisabled = false
      this.startImportButtonVisible = false
      this.confirmImportResultButtonVisible = false
      this.fileList = []
      this.project_id = projectId || 0
      this.module_id = moduleId || 0
      this.tree_node_children = treeNodeChildren || []
      // if (id) {
      //   findProjectById(id).then(res => {
      //     if (res.data) {
      //       this.project_name = res.data.project_name
      //       this.project_desc = res.data.project_desc
      //       this.project_members = res.data.project_members.split(',')
      //       console.log('this.project_members:', this.project_members)
      //       setTimeout(() => {
      //         this.form.setFieldsValue({
      //           project_name: res.data.project_name,
      //           project_desc: res.data.project_name,
      //           project_members: res.data.project_members.split(',')
      //         })
      //       }, 50)
      //     }
      //   }).catch(err => {
      //     this.$message.error(err.message)
      //   })
      // }
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .ant-form-item {
  margin-bottom: 8px;
}
.scirpt-tip {
  margin-left: 20px;
  font-size: 12px;
}
</style>
