<template>
  <div>
    <a-modal
      :title="!plan_id ? '新建story' : '修改story'"
      :width="900"
      v-model="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      :confirmLoading="confirmLoading"
    >
      <a-form :form="form">
        <a-row :gutter="12">
          <a-col :md="11" :lg="11" style="margin-left: 15px;">
            <a-form-item
              label="story名称"
            >
              <a-input
                v-decorator="['plan_name', {rules:[{required: true, message: '请输入名称'}]}]"
                placeholder="输入story名称"
                size="large"
              />
            </a-form-item>
          </a-col>
          <a-col :md="24" :lg="12">
            <a-form-item
              label="所属项目"
            >
              <a-input
                v-decorator="[
                  'belong_project',
                  {
                    initialValue: this.initialProjectName,
                    rules:[{required: false, message: ''}]
                  }
                ]"
                placeholder="请输入所选项目"
                size="large"
                :disabled="true"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="12" style="margin-top: 5px;">
          <a-col :md="22" :lg="11" style="margin-left: 15px;">
            <a-form-item
              label="所属版本"
            >
              <a-select
                v-decorator="[
                  'belong_test_version',
                  {
                    initialValue: this.test_version_name,
                    rules: [{ required: true, message: '请选择版本' }]
                  },
                ]"
                placeholder="请选择版本"
                size="large"
                @change="handleTestVersionChange"
              >
                <a-select-option v-for="item in testVersionList" :key="item.id" :value="item.id">
                  <a-avatar size="small" style="backgroundColor:#5B8FF9; margin-bottom: 3px;" icon="container"/>
                  <span style="margin-left: 10px;">{{ item.test_version_name }}</span>
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="24" :lg="12">
            <a-form-item
              label="负责人"
            >
              <a-select
                allowClear
                v-decorator="[
                  'owner',
                  {
                    rules: [{ required: false, message: '请选择负责人' }]
                  },
                ]"
                placeholder="请选择负责人"
                size="large"
              >
                <a-select-option v-for="value in memberList" :key="value" :value="value">
                  <a-icon type="user" />
                  <span style="margin-left: 5px;">{{ value }}</span>
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="12" style="margin-top: 5px;">
        </a-row>
        <a-row :gutter="12" style="margin-top: 5px;">
          <a-col :md="22" :lg="11" style="margin-left: 15px;">
            <a-form-item>
              <span slot="label">
                关联需求单号&nbsp;
                <a-tooltip :title="requirementsTooltip">
                  <a-icon type="question-circle-o" />
                </a-tooltip>
              </span>
              <a-input
                v-decorator="['requirements', {rules:[{required: true, message: '请输入关联需求'}]}]"
                placeholder="输入需求单号（仅限一个）"
                size="large"
              />
            </a-form-item>
          </a-col>
          <a-col :md="22" :lg="12">
            <a-form-item
              label="运行环境"
            >
              <a-select
                allowClear
                v-decorator="[
                  'env',
                  {
                    rules: [{ required: false, message: '请选择运行环境' }]
                  },
                ]"
                placeholder="请选择运行环境"
                size="large"
              >
                <a-select-option v-for="value in envList" :key="value" :value="value">
                  <span style="margin-left: 5px;">{{ value }}</span>
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="12" style="margin-top: 5px;">
          <a-col :md="46" :lg="23" style="margin-left: 15px;">
            <span style="color: rgba(0, 0, 0, 0.85); font-size: 14px;">是否定时运行自动化：</span>
            <a-switch style="margin-left: 2px; margin-top: -2px;" v-model="runAutoCaseChecked" @change="enableChange" />
          </a-col>
        </a-row>
        <a-row v-if="runAutoCaseChecked" :gutter="12" style="margin-top: 10px;">
          <a-col :md="46" :lg="23" style="margin-left: 15px;">
            <a-form-item
              label="cron表达式（使用jenkins cron表达式）"
            >
              <a-input
                v-decorator="['cron', {rules:[{required: runAutoCaseChecked, message: '请输入关联需求'}]}]"
                placeholder="输入cron表达式"
                size="large"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="12" style="margin-top: 5px;">
          <a-col :md="46" :lg="23" style="margin-left: 15px;">
            <a-form-item
              label="收件人邮箱"
            >
              <a-textarea
                :autoSize="true"
                style="resize: none; overflow-y: hidden;"
                v-decorator="['receiver_emails', {rules:[{required: false, message: '收件人邮箱'}]}]"
                placeholder="收件人邮箱地址，逗号(英文)分隔"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="12" style="margin-top: 5px;">
          <a-col :md="46" :lg="23" style="margin-left: 15px;">
            <a-form-item
              label="测试策略"
            >
              <a-textarea
                :autoSize="true"
                style="resize: none; overflow-y: hidden;"
                v-decorator="['test_strategy', {rules:[{required: false, message: '请输入测试策略'}]}]"
                placeholder="请输入测试策略"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="12" style="margin-top: 5px;">
          <a-col :md="22" :lg="11" style="margin-left: 15px;">
            <a-form-item
              label="开始时间"
            >
              <a-date-picker
                :value="startDateValue"
                :format="dateFormat"
                size="large"
                style="width: 100%;"
                @change="handleStartDataChange"
              />
            </a-form-item>
          </a-col>
          <a-col :md="24" :lg="12">
            <a-form-item
              label="结束时间"
            >
              <a-date-picker
                :value="endDateValue"
                :format="dateFormat"
                size="large"
                style="width: 100%;"
                @change="handleEndDataChange"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { planAddOrModify, findPlanById } from '@/api/case/plan_two'
import moment from 'moment'
export default {
  name: 'CreatePlanForm',
  props: {
    createFormVisible: {
      type: Boolean,
      default: false
    },
    projectList: {
      type: Array,
      default: () => {
        return []
      }
    },
    testVersionList: {
      type: Array,
      default: () => {
        return []
      }
    },
    memberList: {
      type: Array,
      default: () => {
        return []
      }
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
      visible: this.createFormVisible,
      confirmLoading: false,
      form: this.$form.createForm(this, { name: 'createProjectForm' }),
      project_name: '',
      test_version_name: '',
      plan_id: 0,
      test_version_id: 0,
      dateFormat: 'YYYY/MM/DD',
      startDateValue: moment(),
      endDateValue: moment(),
      project_id: 0,
      runAutoCaseChecked: false,
      envList: ['QA', 'AUTO', 'DEV', 'PROD'],
      requirementsTooltip: 'story与需求单号是一对一关系，请输入一个需求单号。'
    }
  },
  watch: {
  	// 这一步很关键，此时在父组件修改了组件的props，会同步到组件内对应的props上
  	// 但是不会同步到你刚刚在data对象中创建的 dialog 上
  	// 所以需要再创建一个针对props属性dialogFormVisible的watch（监听）
  	// 当props修改后对应data中的副本dialog 也要同步数据。
    createFormVisible (val) {
      this.visible = val
    }
  },
  created () {
    console.log('in created function of createPlanForm')
    console.log('this.$store.state.caseTwo.case_two_global_project_name: ', this.$store.state.caseTwo.case_two_global_project_name)
    this.initialProjectName = this.$store.state.caseTwo.case_two_global_project_name
    this.project_id = this.$store.state.caseTwo.case_two_global_project_id
  },
  methods: {
    enableChange (checked) {
      console.log(`runAutoCaseChecked ${checked}`)
      this.runAutoCaseChecked = checked
    },
    moment,
    handleTestVersionChange (value) {
      console.log(`Selected: ${value}`);
      this.test_version_id = parseInt(`${value}`)
      console.log('this.test_version_id:', this.test_version_id)
    },
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
      this.form.validateFields((err, values) => {
        console.log('values in handle ok:', values)
        if (!err) {
          this.confirmLoading = true
          const params = {
            plan_id: this.plan_id,
            project_id: this.project_id,
            test_version_id: this.test_version_id,
            plan_name: values.plan_name,
            owner: values.owner,
            timing_run: this.runAutoCaseChecked,
            cron: values.cron,
            env: values.env,
            receiver_emails: values.receiver_emails,
            test_strategy: values.test_strategy,
            requirements: values.requirements,
            start_date_value: this.startDateValue.format('YYYY-MM-DD'),
            end_date_value: this.endDateValue.format('YYYY-MM-DD')
          }
          console.log('params in handle ok:', params)
          planAddOrModify(params).then(res => {
            this.$message.success('操作成功')
            this.form.resetFields();
            this.$emit('changeCreateVisible')
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
      this.form.resetFields()
      this.$emit('changeCreateVisible')
    },
    init (planId, testVersionName, testVersionId, initialProjectName) {
      console.log('planId: ', planId)
      console.log('testVersionName in init: ', testVersionName)
      console.log('this.testVersionId: ', testVersionId)
      console.log('initialProjectName: ', initialProjectName)
      this.initialProjectName = initialProjectName
      this.test_version_name = testVersionName
      this.test_version_id = testVersionId
      this.form.resetFields()
      this.plan_id = planId || 0
      if (planId) {
        findPlanById(planId).then(res => {
          if (res.data) {
            this.project_id = res.data.project_id
            this.test_version_id = res.data.test_version_id
            this.startDateValue = moment(res.data.start_time)
            this.endDateValue = moment(res.data.end_time)
            this.runAutoCaseChecked = res.data.timing_run
            setTimeout(() => {
              this.form.setFieldsValue({
                plan_name: res.data.plan_name,
                belong_project: this.initialProjectName,
                belong_test_version: testVersionName,
                owner: res.data.owner,
                requirements: res.data.iteration,
                env: res.data.env,
                receiver_emails: res.data.receiver_emails,
                test_strategy: res.data.test_strategy
              })
              if (this.runAutoCaseChecked) {
                this.form.setFieldsValue({
                cron: res.data.cron
              })
              }
            }, 50)
          }
        }).catch(err => {
          this.$message.error(err.message)
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
  /deep/ .ant-form-item {
    margin-bottom: 8px ;
  }
  .scirpt-tip {
    margin-left: 20px;
    font-size: 12px;
  }

</style>
