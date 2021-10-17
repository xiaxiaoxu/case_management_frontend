<template>
  <div>
    <a-modal
      :title="!repository_id ? '新增自动化代码库' : '修改自动化代码库'"
      :width="900"
      v-model="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      :confirmLoading="confirmLoading"
    >
      <a-form :form="form">
        <a-row :gutter="12">
          <a-col :md="46" :lg="23" style="margin-left: 15px;">
            <a-form-item
              label="标题"
            >
              <a-input
                v-decorator="['repository_name', {rules:[{required: true, message: '请输入标题'}]}]"
                placeholder=" 代码库名称支持英文、数字、下划线、中划线、左斜杠和点的组合"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="12" style="margin-top: 10px;">
          <a-col :md="46" :lg="23" style="margin-left: 15px;">
            <a-form-item
              label="代码库地址"
              :validate-status="this.repositoryAddressStatus"
              :help="this.repositoryErrorMsg"
            >
              <a-input
                v-decorator="['repository_address', {rules:[{required: true, message: '请输入关联需求'}]}]"
                placeholder="输入gitlab项目地址"
                @blur="handleRepositoryAddressChange"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <!-- <a-row :gutter="12" style="margin-top: 10px;">
          <a-col :md="46" :lg="23" style="margin-left: 15px;">
            <a-form-item
              label="代码分支"
            >
              <a-select
                v-decorator="[
                  'repository_branch',
                  {
                    rules: [{ required: true, message: '请选择分支' }]
                  },
                ]"
                placeholder="请选择代码分支"
                @change="handleBranchChange"
              >
                <a-select-option v-for="(item, index) in branch_list" :key="index" :value="item">
                  <span style="margin-left: 10px;">{{ item }}</span>
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row> -->
        <a-row :gutter="12" style="margin-top: 10px;">
          <a-col :md="46" :lg="23" style="margin-left: 15px;">
            <span style="color: red; font-size: 18px;">*</span>
            <span style="margin-left: 2px;">框架:</span>
            <a-checkbox :checked="!robotChecked" @change="changePytestChecked" style="margin-left: 15px;">
              Pytest
            </a-checkbox>
            <a-checkbox :checked="robotChecked" @change="changeRobotChecked">
              Robot
            </a-checkbox>
          </a-col>
        </a-row>
        <!-- <a-row :gutter="12" style="margin-top: 10px;">
          <a-col :md="46" :lg="23" style="margin-left: 15px;">
            <a-form-item
              label="环境变量文件位置"
            >
              <a-input
                v-decorator="['environment_file_path', {rules:[{required: false, message: '环境变量文件位置'}]}]"
                placeholder="请输入（可以是相对路径）"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="12" style="margin-top: 10px;">
          <a-col :md="46" :lg="23" style="margin-left: 15px;">
            <a-form-item
              label="自定义拼接参数"
            >
              <a-input
                v-decorator="['customize_params', {rules:[{required: false, message: '请输入自定义拼接参数'}]}]"
                placeholder="请输入自定义拼接参数"
              />
            </a-form-item>
          </a-col>
        </a-row> -->
        <a-row :gutter="12" style="margin-top: 10px;">
          <a-col :md="46" :lg="23" style="margin-left: 15px;">
            <a-form-item
              label="描述"
            >
              <a-textarea
                :autoSize="true"
                style="resize: none; overflow-y: hidden;"
                v-decorator="['repository_desc', {rules:[{required: false, message: '请输入代码库描述'}]}]"
                placeholder="请输入代码库描述"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { getRepositoryBranch, addOrModifyRepository, cloneCodeRepositoryProject } from '@/api/case/code_repository'
import moment from 'moment'
export default {
  name: 'CreateCodeRepositoryForm',
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
      robotChecked: true,
      form: this.$form.createForm(this, { name: 'createRepositoryForm' }),
      project_name: '',
      branch_list: [],
      repository_address: '',
      repository_id: 0,
      repositoryErrorMsg: '',
      repositoryAddressStatus: 'validating',
      dateFormat: 'YYYY/MM/DD',
      startDateValue: moment(),
      endDateValue: moment(),
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
    console.log('in created function of createCodeRepositoryForm')
    console.log('this.$store.state.caseTwo.case_two_global_project_name: ', this.$store.state.caseTwo.case_two_global_project_name)
    console.log('this.$store.state.caseTwo.case_two_global_project_id: ', this.$store.state.caseTwo.case_two_global_project_id)
    this.initialProjectName = this.$store.state.caseTwo.case_two_global_project_name
    this.project_id = this.$store.state.caseTwo.case_two_global_project_id || this.$route.query.project_id
    console.log('this.$route.query in createCodeRepositoryForm: ', this.$route.query)
    console.log('this.project_id in createCodeRepositoryForm: ', this.project_id)
  },
  methods: {
    handleRepositoryAddressChange (e) {
      console.log('e.target.value:')
      console.log(e.target.value)
      // 默认分支为master，暂时注释掉分支查询过程
      // this.branch_list = []
      // this.$message.info('分支查询中，请稍等。')
      // const value = e.target.value
      // if (this.repository_address !== value) {
      //   console.log('repository_address有变动,branch框清空')
      //   this.form.setFieldsValue({
      //           repository_branch: ''
      //         })
      // }
      // const data = {
      //     repository_url: value
      //   };
      // getRepositoryBranch(data).then(res => {
      //   const resCode = res.code
      //   console.log('resCode:', resCode)
      //   if (resCode === 0) {
      //     this.branch_list = res.data
      //     this.repositoryAddressStatus = 'validating'
      //     this.repositoryErrorMsg = ''
      //   }
      // }).catch(err => {
      //   this.branch_list = []
      //   this.repositoryAddressStatus = 'error'
      //   this.repositoryErrorMsg = '仓库地址输入错误'
      //   this.$message.error(err.message)
      // })
    },
    changeRobotChecked (e) {
      this.robotChecked = e.target.checked;
    },
    changePytestChecked (e) {
      this.robotChecked = !e.target.checked;
    },
    handleBranchChange () {
      console.log('in handleBranchChange')
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
          this.confirmLoading = false
          const params = {
            project_id: this.project_id,
            repository_id: this.repository_id,
            repository_name: values.repository_name,
            environment_file_path: values.environment_file_path,
            repository_address: values.repository_address,
            repository_branch: values.repository_branch,
            customize_params: values.customize_params,
            repository_desc: values.repository_desc,
            framework_type: this.robotChecked ? 'Robot' : 'Pytest'
          }
          console.log('params in handle ok:', params)
          addOrModifyRepository(params).then(res => {
            this.$message.success('操作成功')
            this.form.resetFields();
            this.$emit('changeCreateVisible')
            this.$emit('queryData')
            console.log('res.data.repository_id: ', res.data.repository_id)
            // 如果是新建代码库，则新建成功后，触发接口进行代码下载
            if (!this.repository_id) {
              this.cloneCodeRepositoryProject(res.data.repository_id)
            }
          }).catch(err => {
            this.$message.error(err.message)
          }).finally(() => {
            this.confirmLoading = false
          })
        }
      });
    },
    cloneCodeRepositoryProject (repositoryId) {
      console.log('in cloneCodeRepositoryProject')
      const params = {
        repository_id: repositoryId
      }
      cloneCodeRepositoryProject(params).then(res => {
        console.log('代码clone成功，params: ', params)
      })
    },
    handleCancel () {
      console.log('in handleCancel')
      this.form.resetFields()
      this.$emit('changeCreateVisible')
    },
    init (repositoryInfo) {
      console.log('repositoryInfo: ', repositoryInfo)
      this.form.resetFields()
      this.repository_id = 0
      if (repositoryInfo) {
        this.repository_id = repositoryInfo.id
          setTimeout(() => {
            this.form.setFieldsValue({
              repository_name: repositoryInfo.repository_title,
              environment_file_path: repositoryInfo.environment_file_path,
              repository_address: repositoryInfo.repository_address,
              repository_branch: repositoryInfo.branch,
              customize_params: repositoryInfo.customize_params,
              repository_desc: repositoryInfo.repository_desc
            })
          }, 50)
        this.robotChecked = repositoryInfo.framework_type === 'Robot'
        const data = {
            repository_url: repositoryInfo.repository_address
          };
        getRepositoryBranch(data).then(res => {
          const resCode = res.code
          console.log('resCode:', resCode)
          if (resCode === 0) {
            this.branch_list = res.data
            this.repositoryAddressStatus = 'validating'
            this.repositoryErrorMsg = ''
          }
        }).catch(err => {
          this.branch_list = []
          this.gitStatus = 'error'
          this.repositoryErrorMsg = '仓库地址输入错误'
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
