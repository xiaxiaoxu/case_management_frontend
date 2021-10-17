<template>
  <div>
    <a-modal
      :title="!plan_id ? '新增测试计划' : '修改测试计划'"
      :width="600"
      v-model="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      :confirmLoading="confirmLoading"
    >
      <a-form :form="form">
        <a-form-item
          label="计划名称"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input v-decorator="['name', {rules:[{required: true, message: '请输入名称'}]}]" />
        </a-form-item>
        <a-form-item
          label="所属项目"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-select
            v-decorator="[
              'projectName',
              { rules: [{ required: true, message: '请选择项目' }] },
            ]"
            placeholder="请选择项目"
            @change="handleProjectChange"
          >
            <a-select-option v-for="item in projectList" :key="item.id" :value="item.id">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="所属类型"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-select
            v-decorator="[
              'category',
              { rules: [{ required: true, message: '请选择类型' }] },
            ]"
            placeholder="请选择类型"
          >
            <a-select-option v-for="value in categoryList" :key="value" :value="value">
              {{ value }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="git地址"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :validate-status="this.gitStatus"
          :help="this.gitErrorMsg"
        >
          <a-input
            v-decorator="['gitUrl', {rules:[{required: true, message: '请输入git地址'}]}]"
            @blur="handleGitChange"
          />
        </a-form-item>
        <a-form-item
          label="分支"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-select
            v-decorator="[
              'branch',
              { rules: [{ required: true, message: '请选择分支' }] },
            ]"
            placeholder="请选择分支"
          >
            <a-select-option v-for="value in branchList" :key="value" :value="value">
              {{ value }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="环境"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-select
            v-decorator="[
              'env',
              { rules: [{ required: true, message: '请选择环境' }] },
            ]"
            placeholder="请选择"
          >
            <a-select-option value="QA">QA</a-select-option>
            <a-select-option value="AUTO">AUTO</a-select-option>
            <a-select-option value="DEV">DEV</a-select-option>
            <a-select-option value="PROD">PROD</a-select-option>
          </a-select>
        </a-form-item>
        <!-- <a-form-item
          label="是否定时执行"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-radio-group v-model="timingFlag" >
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0"  :disabled="true">否</a-radio>
          </a-radio-group>
          <a-form-item
            label="cron表达式"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            help="使用jenkins cron表达式"
          >
            <a-input v-decorator="['cron', {rules:[{required: false, message: '请输入cron表达式'}]}]" />
          </a-form-item>
        </a-form-item> -->
        <a-form-item
          label="cron表达式"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          help="使用jenkins cron表达式"
        >
          <a-input v-decorator="['cron', {rules:[{required: true, message: '请输入cron表达式'}]}]" />
        </a-form-item>
        <a-form-item
          label="测试用例框架"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-select
            v-model="test_frame"
            placeholder="请选择测试框架"
          >
            <a-select-option value="robot">robot</a-select-option>
            <a-select-option value="pytest">pytest</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="脚本命令"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-textarea v-decorator="['scripts', {rules:[{required: true, message: '请输入脚本命令'}]}]" />
        </a-form-item>
        <div class="scirpt-tip" v-if="test_frame==='robot'">
          <span>脚本命令示例如下：</span>
          <ul>
            <li>执行指定某个用例：robot -s 'suite_name' -t 'testcase name' </li>
            <li>执行指定suite用例：robot -s 'suite_name'</li>
            <li>使用某个环境变量运行某个用例：robot -V servicePath/conf/QA.py -s 'suite_name' -t 'testcase name'，servicePath可以是项目下相对路径
            </li>
            <li>使用某个环境变量运行suite用例：robot -V servicePath/conf/QA.py -s 'suite_name'，servicePath可以是项目下相对路径
            </li>
            <li>自动化用例设计规范文档：<a href="http://wiki.jpushoa.com/pages/viewpage.action?pageId=13442949" target="_blank">自动化用例设计规范</a></li>
          </ul>
        </div>
        <div class="scirpt-tip" v-if="test_frame==='pytest'">
          <span>脚本命令示例如下：</span>
          <ul>
            <li>执行指定某个用例：pytest -v module.py::TestClass::test_method </li>
            <li>执行指定模块suite用例：pytest module </li>
            <li>使用某个环境变量执行指定某个用例：pytest -v module.py::TestClass::test_method --conf=qa </li>
            <li>使用某个环境变量执行指定模块suite用例：pytest module --conf=qa</li>
            <li>自动化用例设计规范文档：<a href="http://wiki.jpushoa.com/pages/viewpage.action?pageId=13442949" target="_blank">自动化用例设计规范</a></li>
          </ul>
        </div>
        <a-form-item
          label="收件人邮箱"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          help="如有多个收件人邮箱，使用英文逗号,分隔"
        >
          <a-input v-decorator="['email', {rules:[{required: true, message: '请输入收件人邮箱'}]}]" />
        </a-form-item>
        <a-form-item
          label="是否启用脚本："
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-switch v-model="enableChecked" @change="enableChange"/>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { autoTestProjectList, autoTestProjectById, getGitBranch } from '@/api/case/setting'
import { planAddOrModify, findPlanById } from '@/api/case/plan'
import { projectBranch } from '@/api/case/project'
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
      form: this.$form.createForm(this, { name: 'createPlanForm' }),
      projectList: [],
      categoryList: ['API', 'SDK', 'APP'],
      project: '',
      timingFlag: 1,
      enableChecked: true,
      plan_id: 0,
      gitUrl: '',
      modalTitle: '创建测试计划',
      branchList: [],
      gitErrorMsg: '',
      gitStatus: 'validating',
      test_frame: 'robot'
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
    this.getAutoTestProjectList()
    this.projectBranch = []
  },
  methods: {
    getAutoTestProjectList () {
      autoTestProjectList().then(res => {
       this.projectList = res.data
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    handleOk () {
      if (!this.test_frame) {
          this.$message.error('请选择测试框架')
          return
      }
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          const enable = this.enableChecked ? 1 : 0
          const params = {
            plan_id: this.plan_id,
            name: values.name,
            gitUrl: values.gitUrl,
            project: this.project,
            category: values.category,
            scripts: values.scripts,
            env: values.env,
            timingFlag: this.timingFlag,
            cron: values.cron,
            email: values.email,
            enable: enable,
            branch: values.branch,
            test_frame: this.test_frame
          }
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
    handleGitChange (e) {
      console.log('e.target.value:')
      console.log(e.target.value)
      this.branchList = []
      this.$message.info('分支查询中，请稍等。')
      const value = e.target.value
      if (this.git_url !== value) {
        console.log('git_url有变动,branch框清空')
        this.form.setFieldsValue({
                branch: ''
              })
      }
      const data = {
          git_url: value
        };
      getGitBranch(data).then(res => {
        const resCode = res.code
        console.log('resCode:')
        console.log(resCode)
        if (resCode === 0) {
          this.branchList = res.data
          this.gitStatus = 'validating'
          this.gitErrorMsg = ''
        }
      }).catch(err => {
        this.branchList = []
        this.gitStatus = 'error'
        this.gitErrorMsg = 'gitlab地址输入错误'
        this.$message.error(err.message)
      })
    },
    handleProjectChange (val) {
      autoTestProjectById(val).then(res => {
      //  this.categoryList = res.data.categories.split(',')
       this.project = res.data.name
      // this.queryProjectBranch(this.project)
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    init (id) {
      console.log('id')
      console.log(id)
      this.form.resetFields()
      this.plan_id = id || 0
      this.test_frame = 'robot'
      this.timingFlag = 1
      if (id) {
        findPlanById(id).then(res => {
          if (res.data) {
            this.project = res.data.project
            // this.timingFlag = res.data.timing_flag
            this.gitUrl = res.data.git_url
            this.enableChange(!!res.data.enable)
            const data = {
                git_url: res.data.git_url
              };
            getGitBranch(data).then(res => {
              const resCode = res.code
              if (resCode === 0) {
                this.branchList = res.data
              }
            })
            // this.queryProjectBranch(res.data.project)
            this.test_frame = res.data.test_frame
            setTimeout(() => {
              this.form.setFieldsValue({
                name: res.data.name,
                projectName: res.data.project,
                category: res.data.category,
                email: res.data.email,
                env: res.data.env,
                scripts: res.data.scripts,
                branch: res.data.branch,
                gitUrl: res.data.git_url
              })
              if (this.timingFlag) {
                 this.form.setFieldsValue({ cron: res.data.cron })
              }
            }, 50)
          }
        }).catch(err => {
          this.$message.error(err.message)
        })
      }
    },
    enableChange (checked) {
      this.enableChecked = checked
    },
    queryProjectBranch (projectName) {
      projectBranch(projectName).then(res => {
        this.branchList = res.data
      }).catch(err => {
        this.$message.error(err.message)
      })
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
