<template>
  <div ref="deleteModal">
    <a-modal
      title="确认删除"
      :width="720"
      :getContainer="()=>$refs.deleteModal"
      v-model="visible"
      centered
      @ok="handleOk"
      @cancel="handleCancel"
      :confirmLoading="confirmLoading"
    >
      <div class="table-page-search-wrapper">
        <div style="width: 100%; overflow: hidden">
          <p style="font-size: 16px;">
            确认删除模块
            <a-tag color="red" style="font-size: 16px;">
              {{ this.module_title }}
            </a-tag>
            吗？
          </p>
          <p style="color: rgb(170, 170, 170); font-size: 16px;">
            <span v-if="this.parent_module_title == ''">模块删除后不可恢复，删除模块会一起删除子模块，模块中的测试用例会移动到</span>
            <span v-if="this.parent_module_title === ''">回收站。</span>
            <span v-if="this.parent_module_title !== ''">模块删除后不可恢复，删除模块会一起删除子模块。</span>
            <span style="display: block;" v-if="this.parent_module_title !== ''">请选择模块中用例处理方式（默认移动到父模块）：</span>
          </p>
          <div v-if="this.parent_module_title !== ''">
            <a-row :gutter="12">
              <a-col :md="10" :lg="5">
                <a-checkbox :checked="!moveToParentNode" v-if="!case_id" @change="onChangeCheckbox">
                  <span>移动到回收站</span>
                </a-checkbox>
              </a-col>
              <a-col :md="20" :lg="10">
                <a-checkbox :checked="moveToParentNode" v-if="!case_id" @change="onChangeCheckbox">
                  <span>移动到父模块</span>
                  <a-tag color="red" style="font-size: 16px; margin-left: 5px;">
                    {{ this.parent_module_title }}
                  </a-tag>
                </a-checkbox>
              </a-col>
            </a-row>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { deleteModuleData } from '@/api/case/module_two'

export default {
  name: 'DeleteModule',
  props: {
    deleteModuleVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      visible: this.deleteModuleVisible,
      confirmLoading: false,
      delete_module_id: 0,
      module_title: '',
      parent_module_title: '',
      paren_module_id: 0,
      child_node_id_list: [],
      moveToParentNode: true
    }
  },
  watch: {
  	// 这一步很关键，此时在父组件修改了组件的props，会同步到组件内对应的props上
  	// 但是不会同步到你刚刚在data对象中创建的 dialog 上
  	// 所以需要再创建一个针对props属性dialogFormVisible的watch（监听）
  	// 当props修改后对应data中的副本dialog 也要同步数据。
    deleteModuleVisible (val) {
      this.visible = val
    }

  },

  methods: {
    onChangeCheckbox () {
      this.moveToParentNode = !this.moveToParentNode
      console.log('this.moveToParentNode in onChangeCheckbox: ', this.moveToParentNode)
    },
    init (moduleData, parentNode, childNodeIdList, projectId) {
      if (parentNode !== undefined) {
        this.parent_module_title = parentNode.title
        this.paren_module_id = parentNode.id
      } else {
        this.parent_module_title = ''
        this.paren_module_id = 0
      }
      console.log('moduleData init function of DeleteModule: ', moduleData)
      this.child_node_id_list = childNodeIdList
      this.moveToParentNode = true
      this.project_id = projectId
      this.module_title = moduleData.title
      this.delete_module_id = moduleData.id
    },
    handleOk () {
      const params = {}
      params['module_id'] = this.delete_module_id
      params['project_id'] = this.project_id
      params['parent_module_id'] = this.paren_module_id
      params['child_node_id_list'] = this.child_node_id_list
      params['move_to_parent_node'] = this.moveToParentNode
      console.log('params in DeleteModule:', params)
      // 先请求后端接口，删除成功后执行
      deleteModuleData(params).then(res => {
        this.$emit('queryData')
        this.$emit('changeDeleteModuleVisible')
      })
      // deletePlan(params).then(res => {
      //   this.$emit('changeDeletePlanVisible')
      //   this.$message.success('操作成功')
      //   this.$emit('queryData')
      // }).catch(err => {
      //   this.$message.error(err.message)
      // }).finally(() => {
      //   this.confirmLoading = false
      // })
    },
    handleCancel () {
      console.log('in handleCancel')
      this.$emit('changeDeleteModuleVisible')
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
