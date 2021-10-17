<template>
  <div ref="operationRecordCompareModal">
    <a-modal
      title="变更对比"
      :width="'90%'"
      :getContainer="()=>$refs.operationRecordCompareModal"
      v-model="visible"
      style="top: 20px;"
      @ok="handleOk"
      @cancel="handleCancel"
      :confirmLoading="confirmLoading"
    >
      <div>
        <a-row v-if="stepCompareVisible" :gutter="24">
          <a-col :md="24" :lg="12">
            <div style="height: 460px; overflow_x: hidden; border: 1px solid #CED4DE">
              <!-- <p style="margin-left: 5px; margin-top: 5px;">变更前</p> -->
              <a-row :gutter="24" style="margin-top: 10px;">
                <a-col :md="24" :lg="12">
                  <span style="margin-left: 10px;">变更前</span>
                </a-col>
              </a-row>
              <div style="margin-left: 15px; margin-top: 20px;">
                <a-row :gutter="24">
                  <a-col :md="4" :lg="2">
                    <span style="margin-left: 2px;">序号</span>
                  </a-col>
                  <a-col :md="18" :lg="9">
                    <span style="margin-left: 2px;">步骤描述</span>
                  </a-col>
                  <a-col :md="16" :lg="8">
                    <span style="margin-left: 2px;">期望结果</span>
                  </a-col>
                </a-row>
                <a-row
                  v-for="index in Math.max(case_step_operation_data.original_value.step_desc.length, case_step_operation_data.original_value.step_result.length)"
                  :key="index"
                  :gutter="24"
                  style="margin-top: 10px; margin-bottom: 15px;"
                >
                  <a-col :md="4" :lg="2">
                    <span style="margin-left: 2px;">
                      <a-badge
                        :count="index"
                        :number-style="{ backgroundColor: '#14C393' }"
                        :overflowCount="100000"
                        :showZero="true"
                      />
                    </span>
                  </a-col>
                  <a-col :md="18" :lg="9">
                    <span>{{ case_step_operation_data.original_value && case_step_operation_data.original_value.step_desc.length > 1 ? case_step_operation_data.original_value.step_desc[index - 1] : undefined }}</span>
                  </a-col>
                  <a-col :md="16" :lg="8">
                    <span>
                      <span>{{ case_step_operation_data.original_value &&  case_step_operation_data.original_value.step_result.length > 1 ? case_step_operation_data.original_value.step_result[index - 1] : undefined }}</span>
                    </span>
                  </a-col>
                  <a-col :md="12" :lg="6">
                  </a-col>
                  <a-col :md="16" :lg="8">
                  </a-col>
                  <a-col :md="16" :lg="8">
                  </a-col>
                </a-row>
              </div>
            </div>
          </a-col>
          <a-col :md="24" :lg="12">
            <div style="height: 460px; border: 1px solid #CED4DE">
              <a-row :gutter="24" style="margin-top: 10px;">
                <a-col :md="28" :lg="14">
                  <span style="margin-left: 10px;">变更后</span>
                </a-col>
                <a-col :md="20" :lg="10">
                  <span :style="{ color: '#5B8FF9' }">{{ case_step_operation_data.operation_person }}</span>
                   <span style="margin-left: 5px;">修改于 {{ case_step_operation_data.operation_time }}</span>
                </a-col>
              </a-row>
              <div style="margin-left: 15px; margin-top: 20px;">
                <a-row :gutter="24">
                  <a-col :md="4" :lg="2">
                    <span>序号</span>
                  </a-col>
                  <a-col :md="18" :lg="9">
                    <span style="margin-left: 2px;">步骤描述</span>
                  </a-col>
                  <a-col :md="16" :lg="8">
                    <span style="margin-left: 2px;">期望结果</span>
                  </a-col>
                </a-row>
                <a-row
                  v-for="index in Math.max(case_step_operation_data.present_value.step_desc.length, case_step_operation_data.present_value.step_result.length)"
                  :key="index"
                  :gutter="24"
                  style="margin-top: 10px; margin-bottom: 15px;"
                >
                  <a-col :md="4" :lg="2">
                    <span style="margin-left: 2px;">
                      <a-badge
                        :count="index"
                        :number-style="{ backgroundColor: '#14C393' }"
                        :overflowCount="100000"
                        :showZero="true"
                      />
                    </span>
                  </a-col>
                  <a-col :md="18" :lg="9">
                    <span>{{ case_step_operation_data.present_value && case_step_operation_data.present_value.step_desc.length > 1 ? case_step_operation_data.present_value.step_desc[index - 1] : undefined }}</span>
                  </a-col>
                  <a-col :md="16" :lg="8">
                    <span>
                      <span>{{ case_step_operation_data.present_value && case_step_operation_data.present_value.step_result.length > 1 ? case_step_operation_data.present_value.step_result[index - 1] : undefined }}</span>
                    </span>
                  </a-col>
                  <a-col :md="12" :lg="6">
                  </a-col>
                  <a-col :md="16" :lg="8">
                  </a-col>
                  <a-col :md="16" :lg="8">
                  </a-col>
                </a-row>
              </div>
            </div>
          </a-col>
        </a-row>
        <a-row v-if="!stepCompareVisible" :gutter="24">
          <a-col :md="24" :lg="12">
            <div style="height: 460px; overflow_x: hidden; border: 1px solid #CED4DE">
              <a-row :gutter="24" style="margin-top: 10px;">
                <a-col :md="24" :lg="12">
                  <span style="margin-left: 10px;">变更前</span>
                </a-col>
              </a-row>
              <div style="margin-left: 15px; margin-top: 20px;">
                <a-row
                  :gutter="24"
                  style="margin-top: 10px; margin-bottom: 15px;"
                >
                  <a-col :md="18" :lg="9">
                    <span v-html="pre_condition_remark_operation_data.original_value">{{ pre_condition_remark_operation_data.original_value }}</span>
                  </a-col>
                </a-row>
              </div>
            </div>
          </a-col>
          <a-col :md="24" :lg="12">
            <div style="height: 460px; border: 1px solid #CED4DE">
              <a-row :gutter="24" style="margin-top: 10px;">
                <a-col :md="28" :lg="14">
                  <span style="margin-left: 10px;">变更后</span>
                </a-col>
                <a-col :md="20" :lg="10">
                  <span :style="{ color: '#5B8FF9' }">{{ pre_condition_remark_operation_data.operation_person }}</span>
                   <span style="margin-left: 5px;">修改于 {{ pre_condition_remark_operation_data.operation_time }}</span>
                </a-col>
              </a-row>
              <div style="margin-left: 15px; margin-top: 20px;">
                <a-row
                  :gutter="24"
                  style="margin-top: 10px; margin-bottom: 15px;"
                >
                  <a-col :md="18" :lg="9">
                    <span v-html="pre_condition_remark_operation_data.present_value">{{ pre_condition_remark_operation_data.present_value }}</span>
                  </a-col>
                </a-row>
              </div>
            </div>
          </a-col>
        </a-row>
      </div>
    </a-modal>
  </div>
</template>
<script>

export default {
  name: 'OperationRecordCompare',
  props: {
    operationRecordCompareVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      visible: this.operationRecordCompareVisible,
      confirmLoading: false,
      pre_condition_remark_operation_data: {
        original_value: '',
        present_value: '',
        operation_person: '',
        operation_time: ''
      },
      case_step_operation_data: {
        original_value: {
          step_desc: [],
          step_result: []
        },
        present_value: {
          step_desc: [],
          step_result: []
        },
        operation_person: '',
        operation_time: ''
      },
      stepCompareVisible: true
    }
  },
  watch: {
  	// 这一步很关键，此时在父组件修改了组件的props，会同步到组件内对应的props上
  	// 但是不会同步到你刚刚在data对象中创建的 dialog 上
  	// 所以需要再创建一个针对props属性dialogFormVisible的watch（监听）
  	// 当props修改后对应data中的副本dialog 也要同步数据。
    operationRecordCompareVisible (val) {
      this.visible = val
    }

  },

  methods: {
    init (operationType, operationData) {
      console.log('in init function of OperationRecordCompare.vue ')
      console.log('operationType in init: ', operationType)
      console.log('operationData in init: ', operationData)
      if (operationType === 'caseStep') {
        this.case_step_operation_data = operationData
        this.stepCompareVisible = true
      } else {
        this.stepCompareVisible = false
         this.pre_condition_remark_operation_data = operationData
      }
    },
    handleOk () {
      console.log('in handleOk')
      this.$emit('changeOperationRecordCompareVisible')
    },
    handleCancel () {
      console.log('in handleCancel')
      this.$emit('changeOperationRecordCompareVisible')
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
