<template>
  <div>
    <a-modal
      :title="!project_id ? '新增项目' : '修改项目'"
      :width="600"
      v-model="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      :confirmLoading="confirmLoading"
    >
      <a-form :form="form">
        <a-form-item
          label="项目名称"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            v-decorator="['project_name', {rules:[{required: true, message: '请输入名称'}]}]"
            placeholder="请输入名称"
          />
        </a-form-item>
        <a-form-item
          label="描述"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-textarea v-decorator="['project_desc', {rules:[{required: true, message: '请输入项目描述'}]}]" />
        </a-form-item>
        <a-form-item
          label="成员"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-select
            mode="multiple"
            v-decorator="[
              'project_members',
              { rules: [{ required: true, message: '请选择成员' }] },
            ]"
            placeholder="请选择成员"
          >
            <a-select-option v-for="value in memberList" :key="value" :value="value">
              {{ value }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { projectAddOrModify, findProjectById, getMembers } from '@/api/case/project_two'
export default {
  name: 'CreatePlanForm',
  props: {
    createFormVisible: {
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
      visible: this.createFormVisible,
      confirmLoading: false,
      form: this.$form.createForm(this, { name: 'createProjectForm' }),
      projectList: [],
      memberList: [],
      project_name: '',
      project_members: [],
      project_desc: '',
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
    this.getMembersList()
  },
  methods: {
    getMembersList () {
      console.log('in getMembersList function')
      getMembers().then(res => {
       this.memberList = res.data
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    handleOk () {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          const params = {
            project_id: this.project_id,
            project_name: values.project_name,
            project_desc: values.project_desc,
            project_members: values.project_members
          }
          console.log('params in handle ok:')
          console.log(params)
          projectAddOrModify(params).then(res => {
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
    init (id) {
      console.log('id in createForm:')
      console.log(id)
      this.form.resetFields()
      this.project_id = id || 0
      if (id) {
        findProjectById(id).then(res => {
          if (res.data) {
            this.project_name = res.data.project_name
            this.project_desc = res.data.project_desc
            this.project_members = res.data.project_members.split(',')
            console.log('this.project_members:', this.project_members)
            setTimeout(() => {
              this.form.setFieldsValue({
                project_name: res.data.project_name,
                project_desc: res.data.project_name,
                project_members: res.data.project_members.split(',')
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
