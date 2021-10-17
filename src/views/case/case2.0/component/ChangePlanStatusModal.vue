<template>
  <div ref="changePlanStatusModal">
    <a-modal
      :title="this.plan_status === '0' ? '确认开始' : '确认结束'"
      :width="670"
      :getContainer="()=>$refs.changePlanStatusModal"
      v-model="visible"
      centered
      @ok="setPlanStatus"
      @cancel="handleCancel"
      :confirmLoading="confirmLoading"
    >
      <div class="table-page-search-wrapper">
        <div style="width: 100%; height: 50px; overflow-x: hidden">
          <p style="font-size: 15px;">
            <span v-if="this.plan_status === '0'">确认开始测试计划</span>
            <span v-if="this.plan_status !== '0'">确认结束测试计划</span>
            <a-tag color="blue" style="font-size: 15px; margin-left: 5px;">
              {{ this.plan_name }}
            </a-tag>
            <span>中迭代</span>
            <a-tag color="green" style="font-size: 15px; margin-left: 5px;">
              {{ this.iteration_name }}
            </a-tag>
            <span>吗？</span>
          </p>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { runTestPlan, stopTestPlan, savePlanSnapshotData } from '@/api/case/plan_two'

export default {
  name: 'ChangePlanStatusModal',
  props: {
    changePlanStatusVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      visible: this.changePlanStatusVisible,
      confirmLoading: false,
      plan_id: 0,
      iteration_id: 0,
      plan_name: '',
      plan_status: '0',
      iteration_name: ''
    }
  },
  watch: {
  	// 这一步很关键，此时在父组件修改了组件的props，会同步到组件内对应的props上
  	// 但是不会同步到你刚刚在data对象中创建的 dialog 上
  	// 所以需要再创建一个针对props属性dialogFormVisible的watch（监听）
  	// 当props修改后对应data中的副本dialog 也要同步数据。
    changePlanStatusVisible (val) {
      this.visible = val
    }

  },

  methods: {
    init (planStatus, planId, iterationId, planName, iterationName) {
      console.log('planId init function of DeletePlan: ', planId)
      this.plan_id = planId
      this.iteration_id = iterationId
      this.plan_name = planName
      this.plan_status = planStatus
      this.iteration_name = iterationName
    },
    setPlanStatus () {
      const params = {
        plan_id: this.plan_id,
        iteration_id: this.iteration_id
      }
      if (this.plan_status === '0') {
        runTestPlan(params).then(res => {
          console.log('run plan successfully')
          this.$emit('queryData')
        })
      } else {
        stopTestPlan(params).then(res => {
          console.log('stop plan successfully')
          this.$emit('queryData')
          savePlanSnapshotData(params).then(res => {
            console.log('stop plan successfully')
            this.$emit('queryPlanCaseData')
          })
        })
      }
      this.$emit('setChangePlanStatusVisible')
    },
    handleCancel () {
      console.log('in handleCancel')
      this.$emit('setChangePlanStatusVisible')
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
