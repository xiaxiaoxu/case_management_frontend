<template>
  <div>
    <a-modal
      :title="'复制story'"
      :width="900"
      v-model="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      :confirmLoading="confirmLoading"
    >
      <a-form :form="form">
        <a-row :gutter="12">
          <a-col :md="46" :lg="23" style="margin-left: 15px">
            <a-form-item label="story名称">
              <a-input
                v-decorator="[
                  'plan_name',
                  { rules: [{ required: true, message: '请输入名称' }] }
                ]"
                placeholder="输入story名称"
                size="large"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="12" style="margin-top: 10px">
          <a-col :md="22" :lg="11" style="margin-left: 15px">
            <a-form-item label="所属项目">
              <a-select
                v-decorator="[
                  'belong_project',
                  {
                    initialValue: this.initialProjectName,
                    rules: [{ required: true, message: '请选择项目' }]
                  }
                ]"
                placeholder="请选择项目"
                size="large"
                @change="handleProjectChange"
              >
                <a-select-option
                  v-for="item in projectList"
                  :key="item.id"
                  :value="item.id"
                >
                  <a-avatar
                    size="small"
                    style="backgroundColor:#5B8FF9; margin-bottom: 3px"
                    icon="container"
                  />
                  <span style="margin-left: 10px">{{ item.project_name }}</span>
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="24" :lg="12">
            <a-form-item label="所属版本">
              <a-select
                v-decorator="[
                  'belong_test_version',
                  {
                    initialValue: this.test_version_name,
                    rules: [{ required: true, message: '请选择版本' }]
                  }
                ]"
                placeholder="请选择版本"
                size="large"
                @change="handleTestVersionChange"
              >
                <a-select-option
                  v-for="item in testVersionList"
                  :key="item.id"
                  :value="item.id"
                >
                  <span style="margin-left: 10px">{{ item.test_version_name }}</span>
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="12" style="margin-top: 10px">
          <a-col :md="22" :lg="11" style="margin-left: 15px">
            <a-form-item label="关联需求">
              <a-input
                v-decorator="[
                  'requirements',
                  { rules: [{ required: true, message: '请输入关联需求' }] }
                ]"
                placeholder="输入需求单号，逗号(英文)分隔"
                size="large"
              />
            </a-form-item>
          </a-col>
          <a-col :md="24" :lg="12">
            <a-form-item label="负责人">
              <a-select
                allowClear
                v-decorator="[
                  'owner',
                  {
                    rules: [{ required: false, message: '请选择负责人' }]
                  }
                ]"
                placeholder="请选择负责人"
                size="large"
              >
                <a-select-option
                  v-for="value in memberList"
                  :key="value"
                  :value="value"
                >
                  <a-icon type="user" />
                  <span style="margin-left: 5px">{{ value }}</span>
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="12" style="margin-top: 10px">
          <a-col :md="22" :lg="11" style="margin-left: 15px">
            <a-form-item label="开始时间">
              <!-- :disabled-date="disabledDate" :disabled-time="disabledDateTime" -->
              <a-date-picker
                :value="startDateValue"
                :format="dateFormat"
                size="large"
                style="width: 100%"
                @change="handleStartDataChange"
              />
            </a-form-item>
          </a-col>
          <a-col :md="24" :lg="12">
            <a-form-item label="结束时间">
              <a-date-picker
                :value="endDateValue"
                :format="dateFormat"
                size="large"
                style="width: 100%"
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
import { planCopy, findPlanById } from '@/api/case/plan_two'
import { getTestVersionList } from '@/api/case/test_version'
import { findProjectById } from '@/api/case/project_two'
import moment from 'moment'
export default {
  name: 'CopyPlanForm',
  props: {
    copyFormVisible: {
      type: Boolean,
      default: false
    },
    projectList: {
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
      visible: this.copyFormVisible,
      confirmLoading: false,
      form: this.$form.createForm(this, { name: 'copyProjectForm' }),
      project_name: '',
      plan_id: 0,
      dateFormat: 'YYYY/MM/DD',
      startDateValue: moment(),
      endDateValue: moment(),
      project_id: 0,
      test_version_name: '',
      test_version_id: 0,
      testVersionList: [],
      initialProjectName: ''
    }
  },
  watch: {
    // 这一步很关键，此时在父组件修改了组件的props，会同步到组件内对应的props上
    // 但是不会同步到你刚刚在data对象中创建的 dialog 上
    // 所以需要再创建一个针对props属性dialogFormVisible的watch（监听）
    // 当props修改后对应data中的副本dialog 也要同步数据。
    copyFormVisible (val) {
      this.visible = val
    }
  },
  created () {
    console.log('in created function')
    console.log('this.$store.state.caseTwo.case_two_global_project_name: ', this.$store.state.caseTwo.case_two_global_project_name)
    // this.initialProjectName = this.$store.state.caseTwo.case_two_global_project_name
    // this.project_id = this.$store.state.caseTwo.case_two_global_project_id
    if (this.$store.state.caseTwo.case_two_global_project_name && this.$store.state.caseTwo.case_two_global_project_id) {
        this.initialProjectName = this.$store.state.caseTwo.case_two_global_project_name
        this.project_id = this.$store.state.caseTwo.case_two_global_project_id
      } else if (this.$route.query.project_id) {
        this.project_id = parseInt(this.$route.query.project_id)
        findProjectById(this.$route.query.project_id).then(res => {
          this.initialProjectName = res.data.project_name
          this.$store.commit('case_two_global_project_name', res.data.project_name)
          this.$store.commit('case_two_global_project_id', res.data.id)
          console.log('this.$store.state.caseTwo: ', this.$store.state.caseTwo)
          console.log('this.initialProjectName in create of Planlist of findProjectById: ', this.initialProjectName)
        })
      } else {
        console.log('this.$store.state.caseTwo.case_two_global_project_id: ', this.$store.state.caseTwo.case_two_global_project_id)
        this.$router.push({
            name: 'caseTwoProjectList'
        })
      }
    this.getTestVersionList()
  },
  methods: {
    moment,
    handleTestVersionChange (value) {
      console.log(`Selected: ${value}`);
      this.test_version_id = parseInt(`${value}`)
      console.log('this.test_version_id:', this.test_version_id)
    },
    handleProjectChange (value) {
      console.log(`Selected: ${value}`);
      // 项目变化后，要重新获取testVersionlist，先清空
      // 清空test_version_name
      this.testVersionList = []
      this.form.setFieldsValue({
        belong_test_version: ''
      })
      this.test_version_name = ''
      this.project_id = parseInt(`${value}`)
      console.log('this.project_id:', this.project_id)
      // 根据project_id查询testVersionList
      this.getTestVersionList()
    },
    handleStartDataChange (value) {
      console.log('value in handleStartDataChange:', value.format('YYYY-MM-DD'))
      this.startDateValue = value
    },
    getTestVersionList () {
      const params = {
        project_id: this.project_id
      }
      console.log('params in getTestVersionList:', params)
      getTestVersionList(params).then(res => {
        this.testVersionList = res.data
      }).catch(err => {
        this.$message.error(err.message)
      })
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
            requirements: values.requirements,
            start_date_value: this.startDateValue.format('YYYY-MM-DD'),
            end_date_value: this.endDateValue.format('YYYY-MM-DD')
          }
          console.log('params in handle ok:', params)
          planCopy(params).then(res => {
            console.log('plan_id of copy plan: ', res.data.plan_id)
            this.$message.success('操作成功')
            this.form.resetFields();
            this.$emit('changeCopyVisible')
            this.$emit('queryData', res.data.plan_id)
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
      this.$emit('changeCopyVisible')
    },
    init (planId, testVersionId, testVersionName) {
      console.log('planId in init of CopyPlanForm.vue: ', planId)
      console.log('testVersionId in init of CopyPlanForm.vue: ', testVersionId)
      console.log('testVersionName in init of CopyPlanForm.vue: ', testVersionName)
      console.log('this.projectList: ', this.projectList)
      console.log('this.initialProjectName: ', this.initialProjectName)
      // 当页面没有获取到项目名称时，处理方式
      if (!this.initialProjectName) {
        this.projectList.forEach((item) => {
          console.log(' in foreach')
          console.log('item in foreach: ', item)
          if (item.id === this.project_id) {
            this.initialProjectName = item.project_name
            console.log('this.initialProjectName in foreach: ', this.initialProjectName)
          }
        })
      }
      this.form.resetFields()
      this.plan_id = planId || 0
      this.test_version_id = testVersionId
      this.test_version_name = testVersionName
      findPlanById(planId).then(res => {
        if (res.data) {
          this.project_id = res.data.project_id
          this.startDateValue = moment(res.data.start_time)
          this.endDateValue = moment(res.data.end_time)
          setTimeout(() => {
            this.form.setFieldsValue({
              plan_name: res.data.plan_name,
              owner: res.data.owner,
              belong_project: this.initialProjectName,
              belong_test_version: this.test_version_name,
              requirements: res.data.iteration
            })
          }, 50)
        }
      }).catch(err => {
        this.$message.error(err.message)
      })
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .ant-form-item {
  margin-bottom: 8px;
}
.scirpt-tip {
  margin-left: 20px;
  font-size: 12px;
}
</style>
