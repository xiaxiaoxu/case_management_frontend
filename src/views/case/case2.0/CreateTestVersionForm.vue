<template>
  <div>
    <a-modal
      :title="!test_version_id ? '新建测试版本' : '修改测试版本'"
      :width="700"
      v-model="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      :confirmLoading="confirmLoading"
    >
      <a-form :form="form">
        <a-row :gutter="12">
          <a-col :md="46" :lg="23" style="margin-left: 15px;">
            <a-form-item
              label="测试版本名称"
            >
              <a-input
                v-decorator="['test_version_name', {rules:[{required: true, message: '请输入名称'}]}]"
                placeholder="输入版本名称"
                size="large"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="12" style="margin-top: 5px;">
          <a-col :md="46" :lg="23" style="margin-left: 15px;">
            <a-form-item
              label="所属项目"
            >
              <a-select
                v-decorator="[
                  'belong_project',
                  {
                    initialValue: this.initialProjectName,
                    rules: [{ required: true, message: '请选择项目' }]
                  },
                ]"
                placeholder="请选择项目"
                size="large"
                @change="handleProjectChange"
              >
                <a-select-option v-for="item in projectList" :key="item.id" :value="item.id">
                  <a-avatar size="small" style="backgroundColor:#5B8FF9; margin-bottom: 3px;" icon="container"/>
                  <span style="margin-left: 10px;">{{ item.project_name }}</span>
                </a-select-option>
              </a-select>
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
import { testVersionAddOrModify, findTestVersionById } from '@/api/case/test_version'
import moment from 'moment'
export default {
  name: 'CreateTestVersionForm',
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
      form: this.$form.createForm(this, { name: 'createTestVersionForm' }),
      test_version_id: 0,
      dateFormat: 'YYYY/MM/DD',
      startDateValue: moment(),
      endDateValue: moment().add(30, 'days'),
      project_id: 0
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
    console.log('in created function')
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
            test_version_id: this.test_version_id,
            project_id: this.project_id,
            test_version_name: values.test_version_name,
            start_date_value: this.startDateValue.format('YYYY-MM-DD'),
            end_date_value: this.endDateValue.format('YYYY-MM-DD')
          }
          console.log('params in handle ok:', params)
          testVersionAddOrModify(params).then(res => {
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
    init (testVersionId) {
      console.log('testVersionId: ', testVersionId)
      console.log('this.projectList: ', this.projectList)
      console.log('this.initialProjectName: ', this.initialProjectName)
      this.form.resetFields()
      this.test_version_id = testVersionId || 0
      if (testVersionId) {
        findTestVersionById(testVersionId).then(res => {
          if (res.data) {
            this.project_id = res.data.project_id
            this.startDateValue = moment(res.data.start_time)
            this.endDateValue = moment(res.data.end_time)
            setTimeout(() => {
              this.form.setFieldsValue({
                test_version_name: res.data.test_version_name,
                belong_project: this.initialProjectName
              })
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
