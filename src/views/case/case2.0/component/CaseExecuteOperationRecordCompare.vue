<template>
  <div ref="caseExecuteOperationRecordCompareModal">
    <a-modal
      title="变更对比"
      :width="'90%'"
      :getContainer="() => $refs.caseExecuteOperationRecordCompareModal"
      v-model="visible"
      style="top: 20px"
      @ok="handleOk"
      @cancel="handleCancel"
      :confirmLoading="confirmLoading"
    >
      <div>
        <a-row v-if="stepCompareVisible" :gutter="24">
          <a-col :md="24" :lg="12">
            <div
              style="
                height: 580px;
                overflow-y: auto;
                overflow-x: hidden;
                border: 1px solid #ced4de;
              "
            >
              <a-row :gutter="24" style="margin-top: 10px">
                <a-col :md="24" :lg="12">
                  <span style="margin-left: 10px">变更前</span>
                </a-col>
              </a-row>
              <div style="margin-left: 15px; margin-top: 20px">
                <a-row :gutter="24">
                  <a-col :md="4" :lg="2">
                    <span>序号</span>
                  </a-col>
                  <a-col :md="34" :lg="17">
                    <span>步骤</span>
                  </a-col>
                  <a-col style="margin-left: 8px" :md="6" :lg="3">
                    <span>步骤结果</span>
                  </a-col>
                </a-row>
                <a-row
                  v-for="item in case_step_operation_data.original_value"
                  :key="case_step_operation_data.original_value.indexOf(item)"
                  :gutter="4"
                  style="margin-top: 20px"
                >
                  <a-col :md="4" :lg="2">
                    <div style="margin-top: 5px; margin-left: 2px">
                      <a-badge
                        :count="
                          case_step_operation_data.original_value.indexOf(
                            item
                          ) + 1
                        "
                        :number-style="{ backgroundColor: '#14C393' }"
                        :overflowCount="100000"
                        :showZero="true"
                      />
                    </div>
                  </a-col>
                  <a-col :md="42" :lg="21">
                    <a-row :gutter="4">
                      <a-col :md="38" :lg="19" style="margin-left: -10px">
                        <a-input
                          type="textarea"
                          v-model="item.step_desc"
                          readOnly
                          :autoSize="true"
                          style="resize: none; border: none; overflow-y: hidden"
                        />
                      </a-col>
                      <a-col
                        :md="10"
                        :lg="5"
                        style="margin-top: 5px; margin-left: 10px"
                      >
                        <span v-if="item.step_execute_result === '0'">
                          <a-icon
                            type="check-circle"
                            :style="{
                              color: 'green',
                              marginLeft: '35px',
                              fontSize: '20px'
                            }"
                          />
                          <span style="margin-left: 5px">通过</span>
                        </span>
                        <span v-if="item.step_execute_result === '1'">
                          <a-icon
                            type="minus-circle"
                            :style="{
                              color: 'orange',
                              marginLeft: '35px',
                              fontSize: '20px'
                            }"
                          />
                          <span style="margin-left: 5px">阻塞</span>
                        </span>
                        <span v-if="item.step_execute_result === '2'">
                          <a-icon
                            type="close-circle"
                            :style="{
                              color: 'red',
                              marginLeft: '35px',
                              fontSize: '20px'
                            }"
                          />
                          <span style="margin-left: 5px">失败</span>
                        </span>
                        <span v-if="item.step_execute_result === '3'">
                          <a-icon
                            type="right-circle"
                            :style="{
                              color: 'blue',
                              marginLeft: '35px',
                              fontSize: '20px'
                            }"
                          />
                          <span style="margin-left: 5px">跳过</span>
                        </span>
                        <span
                          style="margin-left: 45px"
                          v-if="item.step_execute_result === ''">无</span>
                      </a-col>
                    </a-row>
                    <a-row :gutter="4" style="margin-top: 5px">
                      <a-col :md="24" :lg="12">
                        <a-row :gutter="4">
                          <a-col :md="12" :lg="6">
                            <span style="">预期：</span>
                          </a-col>
                          <a-col
                            :md="36"
                            :lg="18"
                            style="margin-left: -12%; margin-top: -1%"
                          >
                            <a-input
                              type="textarea"
                              v-model="item.expect_result"
                              readOnly
                              :autoSize="true"
                              style="
                                resize: none;
                                border: none;
                                overflow-y: hidden;
                              "
                            />
                          </a-col>
                        </a-row>
                      </a-col>
                      <a-col :md="14" :lg="7" style="margin-left: -18px">
                        <a-row :gutter="4">
                          <a-col :md="16" :lg="8">
                            <span style="">实际：</span>
                          </a-col>
                          <a-col
                            :md="32"
                            :lg="16"
                            style="margin-left: -7%; margin-top: -2%"
                          >
                            <a-input
                              v-model="item.actual_result"
                              type="textarea"
                              readOnly
                              :autoSize="true"
                              style="
                                resize: none;
                                border: none;
                                overflow-y: hidden;
                              "
                            />
                          </a-col>
                        </a-row>
                      </a-col>
                    </a-row>
                  </a-col>
                </a-row>
                <!-- <a-row
                  v-for="index in Math.max(case_step_operation_data.original_value.length, case_step_operation_data.original_value.length)"
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
                    <span>{{ case_step_operation_data.original_value ? case_step_operation_data.original_value[index - 1].step_desc : undefined }}</span>
                  </a-col>
                  <a-col :md="16" :lg="8">
                    <span>
                      <span>{{ case_step_operation_data.original_value ? case_step_operation_data.original_value[index - 1] : undefined }}</span>
                    </span>
                  </a-col>
                  <a-col :md="12" :lg="6">
                  </a-col>
                  <a-col :md="16" :lg="8">
                  </a-col>
                  <a-col :md="16" :lg="8">
                  </a-col>
                </a-row> -->
              </div>
            </div>
          </a-col>
          <a-col :md="24" :lg="12">
            <div
              style="
                height: 580px;
                overflow-y: auto;
                overflow-x: hidden;
                border: 1px solid #ced4de;
              "
            >
              <a-row :gutter="24" style="margin-top: 10px">
                <a-col :md="28" :lg="14">
                  <span style="margin-left: 10px">变更后</span>
                </a-col>
                <a-col :md="20" :lg="10">
                  <span :style="{ color: '#5B8FF9' }">{{
                    case_step_operation_data.operation_person
                  }}</span>
                  <span style="margin-left: 5px">修改于 {{ case_step_operation_data.operation_time }}</span
                  >
                </a-col>
              </a-row>
              <div style="margin-left: 15px; margin-top: 20px">
                <a-row :gutter="24">
                  <a-col :md="4" :lg="2">
                    <span>序号</span>
                  </a-col>
                  <a-col :md="34" :lg="17">
                    <span>步骤</span>
                  </a-col>
                  <a-col style="margin-left: 8px" :md="6" :lg="3">
                    <span>步骤结果</span>
                  </a-col>
                </a-row>
                <a-row
                  v-for="item in case_step_operation_data.present_value"
                  :key="case_step_operation_data.present_value.indexOf(item)"
                  :gutter="4"
                  style="margin-top: 20px"
                >
                  <a-col :md="4" :lg="2">
                    <div style="margin-top: 5px; margin-left: 2px">
                      <a-badge
                        :count="
                          case_step_operation_data.present_value.indexOf(item) + 1
                        "
                        :number-style="{ backgroundColor: '#14C393' }"
                        :overflowCount="100000"
                        :showZero="true"
                      />
                    </div>
                  </a-col>
                  <a-col :md="42" :lg="21">
                    <a-row :gutter="4">
                      <a-col :md="38" :lg="19" style="margin-left: -10px">
                        <a-input
                          type="textarea"
                          v-model="item.step_desc"
                          readOnly
                          :autoSize="true"
                          style="resize: none; border: none; overflow-y: hidden"
                        />
                      </a-col>
                      <a-col
                        :md="10"
                        :lg="5"
                        style="margin-top: 5px; margin-left: 10px"
                      >
                        <span v-if="item.step_execute_result === '0'">
                          <a-icon
                            type="check-circle"
                            :style="{
                              color: 'green',
                              marginLeft: '35px',
                              fontSize: '20px'
                            }"
                          />
                          <span style="margin-left: 5px">通过</span>
                        </span>
                        <span v-if="item.step_execute_result === '1'">
                          <a-icon
                            type="minus-circle"
                            :style="{
                              color: 'orange',
                              marginLeft: '35px',
                              fontSize: '20px'
                            }"
                          />
                          <span style="margin-left: 5px">阻塞</span>
                        </span>
                        <span v-if="item.step_execute_result === '2'">
                          <a-icon
                            type="close-circle"
                            :style="{
                              color: 'red',
                              marginLeft: '35px',
                              fontSize: '20px'
                            }"
                          />
                          <span style="margin-left: 5px">失败</span>
                        </span>
                        <span v-if="item.step_execute_result === '3'">
                          <a-icon
                            type="right-circle"
                            :style="{
                              color: 'blue',
                              marginLeft: '35px',
                              fontSize: '20px'
                            }"
                          />
                          <span style="margin-left: 5px">跳过</span>
                        </span>
                        <span
                          style="margin-left: 45px"
                          v-if="item.step_execute_result === ''">无</span>
                      </a-col>
                    </a-row>
                    <a-row :gutter="4" style="margin-top: 5px">
                      <a-col :md="24" :lg="12">
                        <a-row :gutter="4">
                          <a-col :md="12" :lg="6">
                            <span style="">预期：</span>
                          </a-col>
                          <a-col
                            :md="36"
                            :lg="18"
                            style="margin-left: -12%; margin-top: -1%"
                          >
                            <a-input
                              type="textarea"
                              v-model="item.expect_result"
                              readOnly
                              :autoSize="true"
                              style="
                                resize: none;
                                border: none;
                                overflow-y: hidden;
                              "
                            />
                          </a-col>
                        </a-row>
                      </a-col>
                      <a-col :md="14" :lg="7" style="margin-left: -18px">
                        <a-row :gutter="4">
                          <a-col :md="16" :lg="8">
                            <span style="">实际：</span>
                          </a-col>
                          <a-col
                            :md="32"
                            :lg="16"
                            style="margin-left: -7%; margin-top: -2%"
                          >
                            <a-input
                              v-model="item.actual_result"
                              type="textarea"
                              readOnly
                              :autoSize="true"
                              style="
                                resize: none;
                                border: none;
                                overflow-y: hidden;
                              "
                            />
                          </a-col>
                        </a-row>
                      </a-col>
                    </a-row>
                  </a-col>
                </a-row>
              </div>
              <!-- <div style="margin-left: 15px; margin-top: 20px;">
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
                  v-for="index in Math.max(case_step_operation_data.present_value.length, case_step_operation_data.present_value.length)"
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
                    <span>{{ case_step_operation_data.present_value ? case_step_operation_data.present_value[index - 1] : undefined }}</span>
                  </a-col>
                  <a-col :md="16" :lg="8">
                    <span>
                      <span>{{ case_step_operation_data.present_value ? case_step_operation_data.present_value[index - 1] : undefined }}</span>
                    </span>
                  </a-col>
                  <a-col :md="12" :lg="6">
                  </a-col>
                  <a-col :md="16" :lg="8">
                  </a-col>
                  <a-col :md="16" :lg="8">
                  </a-col>
                </a-row>
              </div> -->
            </div>
          </a-col>
        </a-row>
      </div>
    </a-modal>
  </div>
</template>
<script>

export default {
  name: 'CaseExecuteOperationRecordCompare',
  props: {
    caseExecuteOperationRecordCompareVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      visible: this.caseExecuteOperationRecordCompareVisible,
      confirmLoading: false,
      case_step_operation_data: {
        original_value: [{
          actual_result: '',
          step_desc: '',
          expect_result: '',
          step_execute_result: ''
        }],
        present_value: [{
          actual_result: '',
          step_desc: '',
          expect_result: '',
          step_execute_result: ''
        }],
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
    caseExecuteOperationRecordCompareVisible (val) {
      this.visible = val
    }

  },

  methods: {
    init (operationType, operationData) {
      console.log('in init function of OperationRecordCompare.vue ')
      console.log('operationType in init: ', operationType)
      console.log('operationData in init: ', operationData)
      this.case_step_operation_data = operationData
      this.stepCompareVisible = true
    },
    handleOk () {
      console.log('in handleOk')
      this.$emit('changeCaseExecuteOperationRecordCompareVisible')
    },
    handleCancel () {
      console.log('in handleCancel')
      this.$emit('changeCaseExecuteOperationRecordCompareVisible')
    }
  }
}

</script>

<style lang="less" scoped>
/deep/ .ant-tree-node-content-wrapper {
  width: 95%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
