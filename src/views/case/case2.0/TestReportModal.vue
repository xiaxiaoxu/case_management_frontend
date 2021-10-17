<template>
  <div>
    <a-modal
      :title="'测试报告'"
      width="100%"
      :style="{ top: '0' }"
      :bodyStyle="{padding: '0'}"
      v-model="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      :confirmLoading="confirmLoading"
      :footer="null"
    >
      <TestPlanReport
        v-if="testPlanReportComp"
        ref="testPlanReport"
        :planId="plan_id"
        :testVersionName="test_version_name"
      />
    </a-modal>
  </div>
</template>
<script>
// import { findPlanById } from '@/api/case/plan_two'
import moment from 'moment'
import TestPlanReport from './component/report/TestPlanReport.vue'
export default {
  name: 'TestReportModal',
  components: {
    TestPlanReport
  },
  props: {
    testReportModalVisible: {
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
      visible: this.testReportModalVisible,
      confirmLoading: false,
      form: this.$form.createForm(this, { name: 'copyProjectForm' }),
      project_name: '',
      plan_id: 0,
      test_version_name: '',
      dateFormat: 'YYYY/MM/DD',
      startDateValue: moment(),
      endDateValue: moment(),
      project_id: 0,
      testPlanReportComp: true

    }
  },
  watch: {
  	// 这一步很关键，此时在父组件修改了组件的props，会同步到组件内对应的props上
  	// 但是不会同步到你刚刚在data对象中创建的 dialog 上
  	// 所以需要再创建一个针对props属性dialogFormVisible的watch（监听）
  	// 当props修改后对应data中的副本dialog 也要同步数据。
    testReportModalVisible (val) {
      this.visible = val
    }
  },
  created () {
    console.log('in created of TestReportModal')
    console.log('this.$store.state.caseTwo.case_two_global_project_name: ', this.$store.state.caseTwo.case_two_global_project_name)
    this.project_name = this.$store.state.caseTwo.case_two_global_project_name
    this.project_id = this.$store.state.caseTwo.case_two_global_project_id
  },
  methods: {
    moment,
    handleProjectChange (value) {
      console.log(`Selected: ${value}`);
      this.project_id = parseInt(`${value}`)
      console.log('this.project_id:', this.project_id)
    },
    handleStartDataChange (value) {
      console.log('value in handleStartDataChange:', value.format('YYYY-MM-DD'))
      this.startDateValue = value
    },
    handleEndDataChange (value) {
      console.log('value in handleEndDataChange:', value.format('YYYY-MM-DD'))
      this.endDateValue = value
    },
    range (start, end) {
      const result = [];
      for (let i = start; i < end; i++) {
        result.push(i);
      }
      return result;
    },
    disabledDate (current) {
      // Can not select days before today and today
      return current && current < moment().endOf('day');
    },
    disabledDateTime () {
      return {
        disabledHours: () => this.range(0, 24).splice(4, 20),
        disabledMinutes: () => this.range(30, 60),
        disabledSeconds: () => [55, 56]
      };
    },
    handleOk () {
      this.$emit('changeTestReportModalVisible')
      // this.form.validateFields((err, values) => {
        console.log('in handle ok')
        // if (!err) {
        //   this.confirmLoading = true
        //   const params = {
        //     plan_id: this.plan_id,
        //     project_id: this.project_id,
        //     plan_name: values.plan_name,
        //     owner: values.owner,
        //     requirements: values.requirements,
        //     start_date_value: this.startDateValue.format('YYYY-MM-DD'),
        //     end_date_value: this.endDateValue.format('YYYY-MM-DD')
        //   }
        //   console.log('params in handle ok:', params)
        //   planCopy(params).then(res => {
        //     console.log('plan_id of copy plan: ', res.data.plan_id)
        //     this.$message.success('操作成功')
        //     this.form.resetFields();
        //     this.$emit('changeCopyVisible')
        //     this.$emit('queryData', res.data.plan_id)
        //   }).catch(err => {
        //     this.$message.error(err.message)
        //   }).finally(() => {
        //     this.confirmLoading = false
        //   })
        // }
      // }
    },
    handleCancel () {
      // this.form.resetFields()
      this.$emit('changeTestReportModalVisible')
    },
    init (planId, testVersionName) {
      console.log('planId in init of TestReportModal.vue: ', planId)
      console.log('testVersionName in init of TestReportModal.vue: ', testVersionName)
      // this.$refs.testPlanReport.getPlanData(planId)
      this.plan_id = planId || 0
      this.test_version_name = testVersionName
      // 移除组件
      this.testPlanReportComp = false
      // 在组件移除后，重新渲染组件
      // this.$nextTick可实现在DOM 状态更新后，执行传入的方法。
      this.$nextTick(() => {
          this.testPlanReportComp = true
      })
    }
  }
}
</script>

<style lang="less" scoped>
  @import "./caseList.less";
  /deep/ .ant-form-item {
    margin-bottom: 8px ;
  }
  .scirpt-tip {
    margin-left: 20px;
    font-size: 12px;
  }

</style>
