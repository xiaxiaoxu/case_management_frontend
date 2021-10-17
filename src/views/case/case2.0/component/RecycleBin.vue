<template>
  <div ref="recycleBin">
    <a-modal
      title="用例回收站"
      :width="1400"
      :getContainer="()=>$refs.recycleBin"
      v-model="visible"
      centered
      @ok="handleOk"
      @cancel="handleCancel"
      :confirmLoading="confirmLoading"
    >
      <div class="table-page-search-wrapper">
        <a-card :bordered="false">
          <div class="table-page-search-wrapper">
            <a-form :form="form" layout="inline" @submit="handleSubmit">
              <a-row :gutter="12">
                <a-col :md="8" :lg="4">
                  <a-form-item
                    label="项目"
                  >
                    <a-select
                      v-decorator="[
                        'project_name',
                        {
                          initialValue: this.initialProjectName,
                          rules: [{ required: false, message: '请选择项目' }] },
                      ]"
                      placeholder="请选择"
                      @change="handleProjectChange"
                    >
                      <a-select-option v-for="item in project_list" :key="item.index" :value="item.id">
                        {{ item.project_name }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :md="8" :lg="4">
                  <a-form-item label="标题">
                    <a-input
                      allowClear
                      placeholder="请输入"
                      v-decorator="[
                        'case_title',
                        { rules: [{ required: false }] },
                      ]"
                    />
                  </a-form-item>
                </a-col>
                <a-col :md="12" :lg="6">
                  <a-form-item label="创建时间">
                    <a-range-picker
                      :value="createDateValue"
                      :ranges="createDateRangeValues"
                      :defaultPickerValue="createDateDefaultPickerValue"
                      @panelChange="handleCreateDatePanelChange"
                      @change="handleCreateDataChange"
                    />
                  </a-form-item>
                </a-col>
                <a-col :md="12" :lg="6">
                  <a-form-item label="删除时间">
                    <a-range-picker
                      :value="deleteDateValue"
                      :ranges="deleteDateRangeValues"
                      :defaultPickerValue="deleteDateDefaultPickerValue"
                      @panelChange="handleDeleteDatePanelChange"
                      @change="handleDeleteDateChange"
                    />
                  </a-form-item>
                </a-col>
                <a-col :md="6" :lg="3">
                  <a-button style="float: right; margin-right: 10px;" type="primary" html-type="submit">查询</a-button>
                </a-col>
              </a-row>
              <a-row :gutter="14" style="margin-top: 10px">
                <a-col :md="8" :lg="4">
                 <a-form-item label="创建人">
                    <a-input
                      allowClear
                      placeholder="请输入"
                      v-decorator="[
                        'maintainer',
                        { rules: [{ required: false }] },
                      ]"
                    />
                  </a-form-item>
                </a-col>
                <a-col :md="8" :lg="4">
                  <a-form-item label="删除人">
                    <a-input
                      allowClear
                      placeholder="请输入"
                      v-decorator="[
                        'maintainer',
                        { rules: [{ required: false }] },
                      ]"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </div>
        </a-card>
        <div class="recybin-section">
          <a-table
            bordered
            :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
            :columns="columns"
            rowKey="id"
            :data-source="case_list"
            :loading="loading"
            class="select-table"
            :pagination="pagination"
          >
            <template slot="operation" slot-scope="text, record">
              <a class="active" @click="createOrModifyTestCase(record.id)">编辑</a>
              <a-divider type="vertical"/>
            </template>
            <template slot="case_name" slot-scope="text, record">
              <a-row :gutter="1">
                <a-col :span="2">
                  <a-tag v-if="record.if_need_automated === 'Y'" color="#14C393"><span class="title_tag">auto</span></a-tag>
                </a-col>
                <a-col :span="22">
                  <div style="margin-left: 12px">
                    <span style="margin-left: 0px">{{ text }}</span>
                  </div>
                </a-col>
              </a-row>
            </template>
            <template slot="case_level" slot-scope="text, record">
              <a-tag v-if="record.case_level === 'Level 1'" color="#E86452"><div class="title_tag">{{ record.case_level }}</div></a-tag>
              <a-tag v-if="record.case_level === 'Level 2'" color="#FF9845"><div class="title_tag">{{ record.case_level }}</div></a-tag>
              <a-tag v-if="record.case_level === 'Level 3'" color="#F6BD16"><div class="title_tag">{{ record.case_level }}</div></a-tag>
            </template>
          </a-table>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { getCaseData } from '@/api/case/case_two'
import { getProjectList } from '@/api/case/project_two'
const columns = [
      {
        title: '编号',
        dataIndex: 'id',
        key: 'id',
        scopedSlots: { customRender: 'id' },
        width: 70
      },
      {
        title: '标题',
        dataIndex: 'case_name',
        key: 'case_name',
        scopedSlots: { customRender: 'case_name' },
        width: 420
      },
      {
        title: '维护人',
        dataIndex: 'maintainer',
        key: 'maintainer',
        width: 120
      },
      {
        title: '级别',
        dataIndex: 'case_level',
        key: 'case_level',
        scopedSlots: { customRender: 'case_level' }
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation ',
        scopedSlots: { customRender: 'operation' }
      }
    ]
const nowDate = new Date()
const startDate = moment(new Date(nowDate.getFullYear(), nowDate.getMonth() - 1, nowDate.getDate()))
const endDate = moment()
export default {
  name: 'CopyMoveCase',
  props: {
    recycleBinVisible: {
      type: Boolean,
      default: false
    },
    caseList: {
      type: Array,
      default: () => {
        return []
      }
    },
    projectList: {
      type: Array,
      default: () => {
        return []
      }
    },
    projectName: {
      type: String,
      default: ''
    },
    projectId: {
      type: Number,
      default: 0
    },
    initialProjectName: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      visible: this.recycleBinVisible,
      confirmLoading: false,
      case_id: 0,
      case_id_list: [],
      columns,
      case_list: this.caseList,
      project_list: this.projectList,
      selectedRowKeys: [],
      loading: false,
      form: this.$form.createForm(this, { name: 'createCaseForm' }),
      case_level_list: ['Level 1', 'Level 2', 'Level 3'],
      createDateValue: [],
      createDateDefaultPickerValue: [],
      createDateRangeValues: {},
      deleteDateValue: [],
      deleteDateDefaultPickerValue: [],
      deleteDateRangeValues: {},
      pagination: {
          defaultCurrent: 1, // 默认当前页数
          defaultPageSize: 20, // 默认当前页显示数据的大小
          total: 0, // 总数，必须先有
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ['10', '20', '30', '40'],
          showTotal: (total) => `共 ${total} 条`, // 显示总数
          onShowSizeChange: (current, pageSize) => {
            this.pagination.defaultCurrent = 1
            this.pagination.defaultPageSize = pageSize
          },
          // 改变每页数量时更新显示
          onChange: (current) => {
            this.pagination.defaultCurrent = current
          }
        }
    }
  },
  watch: {
  	// 这一步很关键，此时在父组件修改了组件的props，会同步到组件内对应的props上
  	// 但是不会同步到你刚刚在data对象中创建的 dialog 上
  	// 所以需要再创建一个针对props属性dialogFormVisible的watch（监听）
  	// 当props修改后对应data中的副本dialog 也要同步数据。
    recycleBinVisible (val) {
      this.visible = val
    }

  },
  created () {
    // console.log('in created:')
    // console.log('this.project_id:', this.project_id)
    // this.queryData()
    this.setCreateDateDefaultDate()
    this.setCreateDateRangeValue()
    this.setDeleteDateDefaultDate()
    this.setDeleteDateRangeValue()
  },

  methods: {
    setCreateDateDefaultDate () {
      this.createDateDefaultPickerValue.push(startDate)
      this.createDateDefaultPickerValue.push(endDate)
    },
    setCreateDateRangeValue () {
      const nowDate = new Date()
      let startDate = ''
      const valueDict = {}
      startDate = moment().subtract(7, 'days')
      valueDict['最近7天'] = [startDate, moment()]
      startDate = moment(new Date(nowDate.getFullYear(), nowDate.getMonth() - 2, nowDate.getDate()))
      valueDict['最近二月'] = [startDate, moment()]
      startDate = moment(new Date(nowDate.getFullYear(), nowDate.getMonth() - 3, nowDate.getDate()))
      valueDict['最近三月'] = [startDate, moment()]
      this.createDateRangeValues = valueDict
    },
    handleCreateDataChange (value) {
        this.createDateValue = value
    },
    handleCreateDatePanelChange (value, mode) {
      this.createDateValue = value
      this.mode = [mode[0] === 'date' ? 'month' : mode[0], mode[1] === 'date' ? 'month' : mode[1]]
    },
    setDeleteDateDefaultDate () {
      this.deleteDateDefaultPickerValue.push(startDate)
      this.deleteDateDefaultPickerValue.push(endDate)
    },
    setDeleteDateRangeValue () {
      const nowDate = new Date()
      let startDate = ''
      const valueDict = {}
      startDate = moment().subtract(7, 'days')
      valueDict['最近7天'] = [startDate, moment()]
      startDate = moment(new Date(nowDate.getFullYear(), nowDate.getMonth() - 2, nowDate.getDate()))
      valueDict['最近二月'] = [startDate, moment()]
      startDate = moment(new Date(nowDate.getFullYear(), nowDate.getMonth() - 3, nowDate.getDate()))
      valueDict['最近三月'] = [startDate, moment()]
      this.deleteDateRangeValues = valueDict
    },
    handleDeleteDateChange (value) {
        this.deleteDateValue = value
    },
    handleDeleteDatePanelChange (value, mode) {
      this.deleteDateValue = value
      this.mode = [mode[0] === 'date' ? 'month' : mode[0], mode[1] === 'date' ? 'month' : mode[1]]
    },
    handleProjectChange (value) {
      console.log(`Selected: ${value}`);
      console.log('value:', value)
      this.project_id = parseInt(`${value}`)
      console.log('this.project_id:', this.project_id)
      // this.module_id重新设为0
      this.module_id = 0
      // 移除组件，用于刷新模型树，ModuleTree组件重新渲染时会根据project_id查找模型数据
      // this.updateTreeComp = false
      // 在组件移除后，重新渲染组件
      // this.$nextTick可实现在DOM 状态更新后，执行传入的方法。
      // this.$nextTick(() => {
      //     this.updateTreeComp = true
      // })
      // 刷新模块树后，查询一遍用例，该项目下所有用例
      this.queryCaseData()
    },
    queryData () {
      console.log('in queryData')
      this.getProjectList()
      this.queryCaseData()
    },
    getProjectList () {
      const params = {
        project_name: ''
      }
      console.log('params in getProjectList:', params)
      getProjectList(params).then(res => {
        this.projectList = res.data
        console.log('res.data in getProjectList:', res.data)
        if (res.data) {
          for (var i in res.data) {
            // console.log(`res.data[${i}]:`, res.data[i])
            if (res.data[i].id === this.project_id) {
              this.initialProjectName = res.data[i].project_name
              console.log('this.initialProjectName:', this.initialProjectName)
              break
            }
          }
        }
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    queryCaseData (moduleId) {
      // this.$message.info('用例查询中。')
      console.log('moduleId in queryCaseData:', moduleId)
      const params = {
        project_id: this.project_id,
        module_id: moduleId || this.module_id,
        case_title: this.case_title,
        case_level: this.case_level,
        if_need_automated: this.if_need_automated,
        maintainer: this.maintainer
      }
      console.log('params in queryCaseData:', params)
      this.loading = true
      getCaseData(params).then(res => {
        this.testCaseList = res.data
      }).catch(err => {
        this.$message.error(err.message)
      }).finally(() => {
        this.loading = false
      })
    },
    onSelectChange (selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys;
    },
    handleSubmit (e) {
      e.preventDefault();
      const { form: { validateFields } } = this
      console.log()
      validateFields((errors, values) => {
        console.log('errors: ', errors)
        console.log('values: ', values)
        if (!errors) {
          const params = {
            project_id: values.id,
            case_title: values.case_title,
            case_level: values.case_level,
            if_need_automated: values.if_need_automated,
            module_id: this.module_id
          }
          getCaseData(params).then(res => {
            this.testCaseList = res.data
          }).catch(err => {
            this.$message.error(err.message)
          })
        }
      })
    },
    init (caseIdList) {
      console.log('in init function ')
    },
    handleOk () {
      console.log('in handleOk')
      this.$emit('changeRecycleBinVisible')
    },
    handleCancel () {
      console.log('in handleCancel')
      this.$emit('changeRecycleBinVisible')
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
