<template>
  <div ref="deletePlanCaseModal">
    <a-modal
      title="确认移除"
      :width="670"
      v-model="visible"
      centered
      @ok="handleOk"
      @cancel="handleCancel"
      :confirmLoading="confirmLoading"
    >
      <div class="table-page-search-wrapper">
        <div style="width: 100%; height: 100px; overflow-x: hidden">
          <p>{{ `确认移除选择的${case_id_list.length}个用例么？` }}</p>
          <p>移除用例会一起移除测试计划内的执行记录，移除后可以重新规划用例。</p>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { removePlanCase } from '@/api/case/case_two'

export default {
  name: 'DeleteMultiplePlanCase',
  props: {
    deleteMultipleCaseVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      visible: this.deleteMultipleCaseVisible,
      confirmLoading: false,
      case_id: 0,
      case_id_list: []
    }
  },
  watch: {
  	// 这一步很关键，此时在父组件修改了组件的props，会同步到组件内对应的props上
  	// 但是不会同步到你刚刚在data对象中创建的 dialog 上
  	// 所以需要再创建一个针对props属性dialogFormVisible的watch（监听）
  	// 当props修改后对应data中的副本dialog 也要同步数据。
    deleteMultipleCaseVisible (val) {
      this.visible = val
    }

  },

  methods: {
    removePlanCase (planCaseIdList) {
      this.$message.info('移除中，请稍后')
      console.log('planCaseIdList in removePlanCase: ', planCaseIdList)
      const params = {
        plan_case_id_list: planCaseIdList
      }
      removePlanCase(params).then(res => {
        console.log('params in removePlanCase', params)
        this.$emit('queryData')
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    init (planCaseIdList) {
      console.log('planCaseIdList in init function: ', planCaseIdList)
      this.case_id_list = planCaseIdList
    },
    handleOk () {
      this.removePlanCase(this.case_id_list)
      this.$emit('changeDeleteMultileCaseVisible')
      this.$emit('changeHasSelected')
    },
    handleCancel () {
      console.log('in handleCancel')
      this.$emit('changeDeleteMultileCaseVisible')
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
