<template>
  <a-modal
    width="800px"
    v-model="visible"
    title="新增数据"
    @ok="handleAddOk"
    @cancel="handleCancel"
    :keyboard="false"
    :maskClosable="false"
    :centered="true"
    destroyOnClose
    :confirmLoading="confirmLoading"
  >
    <a-form :form="form">
      <a-row :gutter="24">
        <a-col :span="24">
          <a-form-item
            label="数据分类"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 20 }"
          >
            <a-select v-decorator="['tags',{ rules: [{ required: true, message: '请选择分类' }] }]" mode="multiple" placeholder="请选择">
              <a-select-option v-for="item in category_list" :key="item">{{ item }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item
            label="数据标题"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 20 }"
          >
            <a-textarea v-decorator="['title', {rules:[{required: true, message: '请输入标题'}]}]"></a-textarea>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item
            label="数据来源"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 20 }"
          >
            <a-textarea v-decorator="['source', {rules:[{required: true, message: '请输入数据来源'}]}]"></a-textarea>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item
            label="链接地址"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 20 }"
          >
            <a-textarea v-decorator="['address', {rules:[{required: true, message: '请输入链接地址'}]}]"></a-textarea>
          </a-form-item>
        </a-col>
        <!-- <a-col :span="12">
          <a-form-item
            label="是否置顶"
            :label-col="{ span: 8 }"
            :wrapper-col="{ span: 16 }"
          >
            <a-select
              style="margin-left: 4px"
              v-decorator="['is_top']">
              <a-select-option v-for="[key, value] of Object.entries(isTopOptions)" :key="key">{{ value }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col> -->
        <!-- <a-col :span="12">
          <a-form-item
            label="是否精华"
            :label-col="{ span: 8 }"
            :wrapper-col="{ span: 16 }"
          >
            <a-select
              style="margin-left: 4px"
              v-decorator="['is_essence']">
              <a-select-option v-for="[key, value] of Object.entries(isEssenseOptions)" :key="key">{{ value }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col> -->
        <a-col :span="24">
          <a-form-item
            label="分享人"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 6 }"
          >
            <a-textarea v-decorator="['share_person', {rules:[{required: true, message: '请输入分享人'}]}]"></a-textarea>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>
<script>
  import * as qualityApi from '@/api/quality/quality'
  import * as industryDynamicApi from '@/api/common/extention'
  export default {
    data () {
      return {
        visible: this.createVisible,
        confirmLoading: false,
        form: this.$form.createForm(this, { name: 'addDynamic' }),
        isTopOptions: { 'Y': '是', 'N': '否' },
        isEssenseOptions: { 'Y': '是', 'N': '否' },
        category_list: ['测试基础', '接口测试', '性能测试', '渗透测试', '自动化测试', 'AI测试', '测试工具', '职业发展', '环境治理', '持续集成', '持续交付', '研发效能', '测试管理', 'Appium', 'Selenium', 'Robot', 'Framework', 'Pytest', 'Locust', 'JIRA', 'Android', 'iOS', 'Linux', 'JMeter', '全链路测试', '混沌工程', '质量保障', 'SQL', '公共组件']
      }
    },
    props: {
      createVisible: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      projectList () {
        return this.$store.state.quality.jiraProjectList
      },
      userList () {
        return this.$store.state.quality.jiraUserList
      }
    },
    methods: {
      filterOption (input, option) {
        return (
          option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        )
      },
      handleAddOk () {
        this.form.validateFields((errors, values) => {
          if (!errors) {
            this.confirmLoading = true
            const params = {}
            Object.keys(values).forEach(item => {
              if (item === 'questionDate') {
                params[item] = moment(values[item]).format('YYYY-MM-DD')
              } else {
                params[item] = values[item]
              }
            })
              console.log('params: ')
              console.log(params)
            industryDynamicApi.addIndustryDynamics(params).then(res => {
              this.$message.success('创建成功')
              this.form.resetFields()
              this.$emit('changeCreateVisible')
              this.$emit('queryData')
            }).catch(err => {
              this.$message.error(err.message)
            }).finally(() => {
              this.confirmLoading = false
            })
          }
        })
      },
      handleCancel () {
        this.$emit('changeCreateVisible')
      },
      handleChange (value) {
        const { form: { setFieldsValue } } = this
        if (value === undefined) {
          setFieldsValue({
            assigneeDepartName: ''
          })
          return
        }
        const params = {
          iportal_name: value
        }
        qualityApi.getUserDepartmentName(params).then(res => {
          setFieldsValue({
            assigneeDepartName: res.data.departmentName
          })
        }).catch(err => {
          this.$message.error(err.message)
        })
      },
      dateChange (value) {
        const { form: { setFieldsValue } } = this
        if (value === undefined) {
          setFieldsValue({
            questionDate: ''
          })
        }
        setFieldsValue({ questionDate: value })
      }
    },
    watch: {
      // 这一步很关键，此时在父组件修改了组件的props，会同步到组件内对应的props上
      // 但是不会同步到你刚刚在data对象中创建的 dialog 上
      // 所以需要再创建一个针对props属性dialogFormVisible的watch（监听）
      // 当props修改后对应data中的副本dialog 也要同步数据。
      createVisible (val) {
        this.visible = val
      }
    }
  }
</script>

<style lang="less" scoped>
  .ant-row {
    .ant-form-item {
      margin-bottom: 10px !important;
    }
  }
</style>
