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
        <div style="width: 100%; height: 80px; overflow-x: hidden">
          <span style="font-size: 16px;">
            确认删除模块
            <a-tag color="red" style="font-size: 16px; margin-left: 3px;">
              {{ this.module_title }}
            </a-tag>
            吗？
          </span>
          <p style="color: rgb(170, 170, 170); font-size: 16px;">
            <span>删除模块会一起删除执行用例和执行记录，删除后可以重新规划用例。</span>
          </p>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { deletePlanDetailModuleData } from '@/api/case/module_two'

export default {
  name: 'DeletePlanDetailModule',
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
      plan_id: 0,
      module_title: '',
      child_node_id_list: []
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
    init (moduleData, childNodeIdList, projectId, planId) {
      console.log('moduleData init function of DeleteModule: ', moduleData)
      this.child_node_id_list = childNodeIdList
      this.project_id = projectId
      this.plan_id = planId
      this.module_title = moduleData.title
      this.delete_module_id = moduleData.id
    },
    handleOk () {
      const params = {}
      params['module_id'] = this.delete_module_id
      params['project_id'] = this.project_id
      params['plan_id'] = this.plan_id
      params['child_node_id_list'] = this.child_node_id_list
      console.log('params in DeleteModule:', params)
      // 先请求后端接口，删除成功后执行
      deletePlanDetailModuleData(params).then(res => {
        this.$emit('queryData')
        this.$emit('changeDeleteModuleVisible')
      })
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
