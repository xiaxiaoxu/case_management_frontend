<template>
  <div ref="moveModuleModal">
    <a-modal
      :title="'移动模块'"
      :width="690"
      :getContainer="()=>$refs.moveModuleModal"
      v-model="visible"
      centered
      @ok="handleMoveModule"
      @cancel="handleCancel"
      :confirmLoading="confirmLoading"
    >
      <div class="table-page-search-wrapper">
        <a-row>
          <a-col :md="48" :lg="24">
            <span>
              <span>提示：当前模块为：</span>
              <span style="color: red;">{{ this.original_module_name }}</span>
              <span>，选择目标模块并确定后，当前模块及其子模块将移动到目标模块下。</span>
            </span>
          </a-col>
        </a-row>
        <!-- <div style="margin-top: 10px; width: 100%; height: 350px; overflow-x: hidden"> -->
        <a-form :form="form" style="margin-top: 10px;">
          <a-row :gutter="4">
            <a-col :span="23">
              <a-form-item
                label="选择项目"
                style="margin-bottom: 0"
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
          <!-- <div style="width: 100%; height: 350px; overflow-x: hidden"> -->
          <a-row style="margin-top: 5px;">
            <a-col :span="23">
              <a-form-item
                label="选择模块"
                style="margin-bottom: 0"
              >
                <div style="margin-top: 10px; width: 100%; height: 300px; overflow-x: hidden">
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
                </div>
              </a-form-item>
            </a-col>
          </a-row>
          <!-- </div> -->
        </a-form>
        <!-- </div> -->
      </div>
    </a-modal>
  </div>
</template>
<script>

import { moveModule, getModuleList } from '@/api/case/module_two'
import { getProjectList } from '@/api/case/project_two'
import { Tree } from 'ant-design-vue'
const { DirectoryTree, TreeNode } = Tree;
export default {
  name: 'MoveModule',
  props: {
    moveModuleVisible: {
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
      original_module_id: 0,
      original_module_name: '',
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
    moveModuleVisible (val) {
      this.visible = val
    }

  },
  beforecreate () {
    this.form.getFieldDecorator('keys', { initialValue: [], preserve: true });
  },
  created () {
    console.log('in created function')
    this.getProjectList()
    // this.getModuleList(this.projectId)
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
        const tempModuleList = res.data
        console.log('tempModuleList before: ', tempModuleList, tempModuleList.length)
        this.deleteChildrenNode(tempModuleList, this.original_module_id)
        console.log('tempModuleList after: ', tempModuleList, tempModuleList.length)
        this.moduleDataList = tempModuleList
        this.loading = false
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 递归获取所有节点id
    deleteChildrenNode (nodeList, nodeId) {
      console.log('nodeId in deleteChildrenNode:', nodeId)
      // 遍历所有节点，获取节点的children，遍历所有chilren，查看children.id是否等于当前节点的id，是则说明当前节点是父节点
      // 否，则继续遍历所有children的children，同样的逻辑查找节点
      for (let i = 0; i < nodeList.length; i++) {
        console.log('nodeList[i].id  in getNodeParent: ', nodeList[i].id)
        if (nodeList[i].id === nodeId) {
          // 删除该子节点
          console.log('找到目标节点，删除该节点')
          delete nodeList[i]
          return
        } else if (nodeList[i].children.length > 0) {
          this.deleteChildrenNode(nodeList[i].children, nodeId)
        }
      }
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
    init (projectId, moduleInfo) {
      console.log('moduleInfo in init function:', moduleInfo)
      this.loading = true
      this.project_id = projectId
      this.module_id = 0
      this.original_module_id = moduleInfo.id
      this.original_module_name = moduleInfo.title
      this.moduleDataList = []
      this.expandedKeys = []
      this.form.resetFields()
      this.selectedKeys = []
      console.log('this.selectedKeys:', this.selectedKeys)
      console.log('this.operation: ', this.operation)
      this.getProjectList()
      this.getModuleList(projectId)
    },
    handleMoveModule () {
      console.log('this.module_id:', this.module_id)
      if (!this.module_id) {
        console.log('未选择模块')
        this.$message.error('请选择模块')
        return
      }
      this.form.validateFields((err, values) => {
        console.log('values in handleMoveModule:', values)
        if (!err) {
          this.confirmLoading = true
          const params = {}
          params['project_id'] = this.project_id
          params['original_module_id'] = this.original_module_id
          params['dest_module_id'] = this.module_id
          console.log('params in handleMoveModule:', params)
          moveModule(params).then(res => {
            this.$message.success('模块移动成功')
            this.form.resetFields();
            this.$emit('changeMoveModuleVisible')
            this.$emit('queryData')
          }).catch(err => {
            this.$message.error(err.message)
            this.$emit('changeMoveModuleVisible')
          }).finally(() => {
            this.confirmLoading = false
          })
        }
      });
    },
    handleCancel () {
      console.log('in handleCancel')
      this.form.resetFields()
      this.$emit('changeMoveModuleVisible')
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
