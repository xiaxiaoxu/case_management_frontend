<template>
  <div ref="copyMoveModal">
    <a-modal
      :title="this.operation === 'copy' ? '复制用例' : '移动用例'"
      :width="670"
      :getContainer="()=>$refs.copyMoveModal"
      v-model="visible"
      centered
      @ok="handleCopyMove"
      @cancel="handleCancel"
      :confirmLoading="confirmLoading"
    >
      <div class="table-page-search-wrapper">
        <div style="width: 100%; height: 350px; overflow-x: hidden">
          <a-form :form="form" >
            <a-row :gutter="4">
              <a-col :span="23">
                <a-form-item
                  label="选择项目"
                >
                  <a-select
                    v-decorator="[
                      'select_project',
                      {
                        initialValue: projectName,
                        rules: [{ required: false, message: '请选择项目' }]
                      },
                    ]"
                    placeholder="请选择"
                    @change="handleChangeProject"
                  >
                    <a-select-option v-for="item in projectList" :key="item.id" :value="item.id">
                      {{ item.project_name }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row style="margin-top: 10px">
              <a-col :span="23">
                <a-form-item
                  label="选择模块"
                >
                  <a-card>
                    <a-spin :spinning="loading">
                      <a-directory-tree
                        :expanded-keys="expandedKeys"
                        :auto-expand-parent="autoExpandParent"
                        :selected-keys="selectedKeys"
                        :tree-data="moduleDataList"
                        @expand="onExpand"
                        @select="onSelect"
                      />
                    </a-spin>
                  </a-card>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { copyOrMoveCaseTestCase } from '@/api/case/case_two'
import { getModuleList } from '@/api/case/module_two'
import { getProjectList } from '@/api/case/project_two'
import { Tree } from 'ant-design-vue'
const { DirectoryTree, TreeNode } = Tree;
export default {
  name: 'CopyMoveCase',
  props: {
    copyMoveVisible: {
      type: Boolean,
      default: false
    },
    projectName: {
      type: String,
      default: ''
    },
    projectId: {
      type: Number,
      default: 0
    }
  },
  components: {
    'a-directory-tree': DirectoryTree,
    'a-tree-node': TreeNode
    },
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
      arr: [],
      stepData: [],
      formData: {},
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      },
      stepTitle: '',
      visible: this.copyMoveVisible,
      confirmLoading: false,
      form: this.$form.createForm(this, {
        name: 'copyMoveCaseForm'
      }),
      projectList: [],
      memberList: [],
      test_data: [],
      step_info: [],
      enableChecked: true,
      module_list: [],
      module_value: '',
      project_name: '',
      project_members: [],
      project_desc: '',
      project_id: 0,
      module_id: 0,
      case_id: 0,
      case_title: '',
      pre_condition: '',
      remark: '',
      belong_project: '',
      belong_module: '',
      case_level: '',
      maintainer: '',
      if_need_automated: '',
      case_level_list: ['P0', 'P1', 'P2', 'P3', 'P4'],
      moduleDataList: [],
      expandedKeys: [],
      autoExpandParent: true,
      selectedKeys: [],
      loading: true,
      case_list: [],
      operation: ''
    }
  },
  watch: {
  	// 这一步很关键，此时在父组件修改了组件的props，会同步到组件内对应的props上
  	// 但是不会同步到你刚刚在data对象中创建的 dialog 上
  	// 所以需要再创建一个针对props属性dialogFormVisible的watch（监听）
  	// 当props修改后对应data中的副本dialog 也要同步数据。
    copyMoveVisible (val) {
      this.visible = val
    }

  },
  beforecreate () {
    this.form.getFieldDecorator('keys', { initialValue: [], preserve: true });
  },
  created () {
    console.log('in created function')
    this.getProjectList()
    this.getModuleList(this.projectId)
  },
  methods: {
    onExpand (expandedKeys) {
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },
    onCheck (checkedKeys, info) {
      console.log('oncheck')
      this.checkedKeys = checkedKeys;
      if (info.node.dataRef.isLeaf) {
        const data = { path: info.node.dataRef.suite_path }
        this.$emit('getFileContent', data)
      }
      // 获取选择测试用例
      this.selectCases = []
      if (checkedKeys.length >= 0) {
          info.checkedNodes.forEach(item => {
            const selectCase = { path: item.data.props.suite_path, casename: item.data.props.title, isLeaf: item.data.props.isLeaf }
            this.selectCases.push(selectCase)
          });
      }
    },
    onSelect (selectedKeys, info) {
      console.log('onselect')
      this.selectedKeys = selectedKeys;
      this.module_id = parseInt(selectedKeys.toString())
      console.log('this.selectedKeys:', this.selectedKeys)
      console.log('this.module_id:', this.module_id)
    },
    handleChangeProject (value) {
      console.log(`Selected project: ${value}`);
      this.project_id = parseInt(`${value}`)
      // 切换了项目，先把moduleDataList清空
      this.moduleDataList = []
      this.loading = true
      this.getModuleList(this.project_id)
    },
    getModuleList (projectId) {
      const params = {
        project_id: projectId
      }
      getModuleList(params).then(res => {
        console.log('res.data:', res.data)
        this.moduleDataList = res.data
        this.loading = false
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
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    init (operation, projectId, caseList) {
      console.log('in init function ')
      console.log(`operation: ${operation}, projectId: ${projectId}, caseList: ${caseList}`)
      this.loading = true
      this.operation = operation
      this.project_id = projectId
      this.module_id = 0
      this.case_list = caseList
      this.moduleDataList = []
      this.form.resetFields()
      this.selectedKeys = []
      console.log('this.selectedKeys:', this.selectedKeys)
      console.log('this.operation: ', this.operation)
      this.getProjectList()
      this.getModuleList(projectId)
    },
    handleCopyMove () {
      this.form.validateFields((err, values) => {
        console.log('values in handleCopyMove:', values)
        if (!err) {
          this.confirmLoading = true
          const params = {}
          params['operation'] = this.operation
          params['project_id'] = this.project_id
          params['case_id_list'] = this.case_list
          params['module_id'] = this.module_id
          console.log('params in handleCopyMove:', params)
          copyOrMoveCaseTestCase(params).then(res => {
            this.$message.success('操作成功')
            this.form.resetFields();
            this.$emit('changeCopyMoveVisible')
            this.$emit('changeHasSelected')
            this.$emit('queryData')
          }).catch(err => {
            this.$message.error(err.message)
          }).finally(() => {
            this.confirmLoading = false
          })
        }
      });
    },
    handleCancel () {
      console.log('in handleCancel')
      this.form.resetFields()
      this.$emit('changeCopyMoveVisible')
      this.$emit('changeHasSelected')
    }
  }
}

</script>

<style lang="less" scoped>
/deep/ .ant-tree-node-content-wrapper{
    width: 95%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
</style>
