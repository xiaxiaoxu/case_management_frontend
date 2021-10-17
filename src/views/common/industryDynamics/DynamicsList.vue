<template>
  <div>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="时间">
                <a-range-picker
                  :value="dateValue"
                  :ranges="rangeValues"
                  :placeholder="defaultDate"
                  :defaultPickerValue="defaultPickerValue"
                  @panelChange="handlePanelChange"
                  @change="handleChange"
                />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="20">
              <a-form-item label="标签">
                <a-input allowClear v-model="searchTags" placeholder="请输入标签名"/>
              </a-form-item>
            </a-col>
            <a-col :md="10" :sm="24">
              <a-button type="primary" @click="queryData">查询</a-button>
              <a-button style="margin-left: 40px" @click="createDynamic">新增数据</a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>
    <a-card
      style="margin-top: 24px"
      :bordered="false"
      title="行业动态列表">
      <a-table
        :columns="columns"
        :data-source="data"
        :pagination="paginationData"
        rowKey="id"
        @change="handleTableChange"
      >
        <template slot="tags" slot-scope="record">
          <span>
            <a-tag
              v-for="tag in record"
              :key="tag"
              :color="'green'"
            >
              {{ tag }}
            </a-tag>
          </span>
        </template>
        <template slot="operation" slot-scope="text, record">
          <div>
            <a @click="viewDynamicDetail(record)">详情</a>
            <a-divider type="vertical"/>
            <a @click="editDynamic(record)">编辑</a>
            <a-popconfirm v-show="deleteVisible" placement="top" ok-text="确定" cancel-text="取消" @confirm="deleteDynamic(record)">
              <a-divider type="vertical"/>
              <template slot="title">
                <p>确认删除该数据么？</p>
              </template>
              <a>删除</a>
            </a-popconfirm>
          </div>
        </template>
      </a-table>
    </a-card>
    <add-dynamic
      ref="addDynamic"
      :createVisible="createVisible"
      @changeCreateVisible="changeCreateVisible"
      @queryData="queryData"
    >
    </add-dynamic>
    <!-- 修改数据 -->
    <a-modal
      width="800px"
      v-model="editVisible"
      title="修改数据"
      @ok="handleEditOk"
      @cancel="handleEditCancel"
      :keyboard="false"
      :maskClosable="false"
      :centered="true"
      destroyOnClose
      okText="提交"
      cancelText="取消"
      okType="primary"
    >
      <a-form-model
        ref="dynamic_data"
        :model="dynamic_data"
        :rules="editRules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="数据标签" prop="tags">
          <a-input v-model="dynamic_data.tags"></a-input>
        </a-form-model-item>
        <a-form-model-item label="数据标题" prop="title">
          <a-textarea v-model="dynamic_data.title"></a-textarea>
        </a-form-model-item>
        <a-form-model-item label="数据来源" prop="source">
          <a-textarea v-model="dynamic_data.source"></a-textarea>
        </a-form-model-item>
        <a-form-model-item label="链接地址" prop="address">
          <a-textarea v-model="dynamic_data.address"></a-textarea>
        </a-form-model-item>
        <a-form-model-item v-show="topAndEssense" label="是否置顶" prop="is_top">
          <a-select v-model="dynamic_data.is_top">
            <a-select-option v-for="[key, value] of Object.entries(isTopOptions)" :key="key">{{ value }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item v-show="topAndEssense" label="是否精华" prop="is_essence">
          <a-select v-model="dynamic_data.is_essence">
            <a-select-option v-for="[key, value] of Object.entries(isEssenseOptions)" :key="key">{{ value }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="分享人" prop="share_person">
          <a-textarea v-model="dynamic_data.share_person"></a-textarea>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import moment from 'moment'
import * as industryDynamicApi from '@/api/common/extention'
import AddDynamic from './AddDynamic.vue';

const nowDate = new Date()
const startDate = moment(new Date(nowDate.getFullYear(), nowDate.getMonth() - 1, nowDate.getDate()))
const endDate = moment()
export default {
  components: { AddDynamic },
  data () {
    return {
      data: [],
      dateValue: [startDate, endDate],
      defaultDate: [],
      defaultPickerValue: [],
      rangeValues: {},
      createVisible: false,
      deleteVisible: false,
      topAndEssense: false,
      adminRoleName: 'AdminRole',
      content: '',
      receiver: '',
      isTopOptions: { 'Y': '是', 'N': '否' },
      isEssenseOptions: { 'Y': '是', 'N': '否' },
      tags: undefined,
      searchTags: undefined,
      title: '',
      source: '',
      address: '',
      is_top: '',
      is_essence: '',
      view_num: '',
      created_time: '',
      modified_time: '',
      editVisible: false,
      dealVisible: false,
      columns: [
            {
              title: '序号',
              dataIndex: 'id',
              key: 'id',
              scopedSlots: { customRender: 'id' },
              width: '8%',
              align: 'center'
            },
            {
              title: '标签',
              dataIndex: 'tags',
              key: 'tags',
              width: '20%',
              align: 'center',
              scopedSlots: { customRender: 'tags' }
            },
            {
              title: '标题',
              dataIndex: 'title',
              key: 'title',
              width: '20%',
              align: 'center'
            },
            {
              title: '创建时间',
              dataIndex: 'created_time',
              key: 'created_time',
              ellipsis: true,
              width: '20%',
              align: 'center'
            },
            {
              title: '操作',
              dataIndex: 'operation',
              scopedSlots: { customRender: 'operation' },
              width: 170,
              fixed: 'right',
              align: 'center'
            }
          ],
      paginationData: {
          current: 1,
          defaultCurrent: 1, // 默认当前页数
          defaultPageSize: 10, // 默认当前页显示数据的大小
          total: 0, // 总数，必须先有
          showSizeChanger: true,
          showQuickJumper: false,
          showTotal: (total) => `共 ${total} 条` // 显示总数
      },
      dynamic_data: {
        dynamic_id: undefined,
        tags: undefined,
        title: '',
        source: '',
        address: '',
        is_top: '',
        is_essence: '',
        created_time: '',
        modified_time: '',
        share_person: ''
      },
      editRules: {
          questionName: [
            { required: true, message: '问题名称不能为空', trigger: 'blur' }
          ],
          projectId: [
            { required: true, message: '所属项目不能为空', trigger: 'change' }
          ],
          questionCategory: [
            { required: true, message: '问题类型不能为空', trigger: 'change' }
          ],
          questionLevel: [
            { required: true, message: '问题等级不能为空', trigger: 'change' }
          ]
      },
      labelCol: { span: 4 },
      wrapperCol: { span: 20 }
    }
  },
  created () {
    this.setDefaultDate()
    this.setRangeValue()
    this.queryData()
  },
  methods: {
    moment,
    setDefaultDate () {
      this.defaultDate.push(startDate.format('YYYY-MM-DD'))
      this.defaultDate.push(endDate.format('YYYY-MM-DD'))
      this.defaultPickerValue.push(startDate)
      this.defaultPickerValue.push(endDate)
    },
    setRangeValue () {
      const nowDate = new Date()
      let startDate = ''
      const valueDict = {}
      startDate = moment().subtract(7, 'days')
      valueDict['最近7天'] = [startDate, moment()]
      startDate = moment(new Date(nowDate.getFullYear(), nowDate.getMonth() - 2, nowDate.getDate()))
      valueDict['最近二月'] = [startDate, moment()]
      startDate = moment(new Date(nowDate.getFullYear(), nowDate.getMonth() - 3, nowDate.getDate()))
      valueDict['最近三月'] = [startDate, moment()]
      this.rangeValues = valueDict
    },
    handleChange (value) {
        this.dateValue = value
    },
    handlePanelChange (value, mode) {
      this.dateValue = value
      this.mode = [mode[0] === 'date' ? 'month' : mode[0], mode[1] === 'date' ? 'month' : mode[1]]
    },
    handleTableChange (pagination) {
        this.paginationData.current = pagination.current
      },
    queryData () {
      const formData = []
      this.dateValue.forEach(item => {
        formData.push(item.format('YYYY-MM-DD'))
      })
      const params = {
        start_date: formData[0],
        end_date: formData[1],
        tags: this.searchTags
      }
      industryDynamicApi.getIndustryDynamicsList(params).then(res => {
        this.data = res.data.info
        this.paginationData.total = res.data.info.length
        const roleName = res.data.role
          if (roleName === this.adminRoleName) {
            this.deleteVisible = true
            this.topAndEssense = true
          }
      }).catch(err => {
          this.$message.error(`${err.message}`)
        })
    },
    createDynamic () {
        this.createVisible = true
      },
    changeCreateVisible () {
        this.createVisible = false
      },
    viewDynamicDetail (record) {
      this.$router.push({
        name: 'industryDynamicsDetail',
        query: { dynamic_id: record.id, delete_visible: this.deleteVisible, topAndEssense: this.topAndEssense }
      })
    },
    getDynamicDetail (dynamicId) {
        const params = {
          dynamic_id: dynamicId
        }
        console.log('params in getDynamicDetail func:')
        console.log(params)
        industryDynamicApi.getIndustryDynamicsDetail(params).then(res => {
          this.tags = res.data.info.tags
          console.log('res.data.info:')
          console.log(res.data.info)
          console.log('this.tags:')
          console.log(this.tags)
          this.dynamic_data.tags = res.data.info.tags
          this.dynamic_data.title = res.data.info.title
          this.dynamic_data.source = res.data.info.source
          this.dynamic_data.address = res.data.info.address
          this.dynamic_data.is_top = res.data.info.is_top
          this.dynamic_data.is_essence = res.data.info.is_essence
          this.dynamic_data.view_num = res.data.info.view_number
          this.dynamic_data.created_time = res.data.info.created_time
          this.dynamic_data.modified_time = res.data.info.modified_time
          this.dynamic_data.share_person = res.data.info.share_person
        }).catch(err => {
          this.$message.error(err.message)
        })
      },
    editDynamic (record) {
      console.log('record.id:')
      console.log(record.id)
      this.getDynamicDetail(record.id)
      console.log('this.tags:')
      console.log(this.tags)
      this.dynamic_data.dynamic_id = record.id
      this.dynamic_data.tags = this.tags
      this.dynamic_data.title = this.title
      this.dynamic_data.source = this.source
      this.dynamic_data.address = this.address
      this.dynamic_data.is_top = this.is_top
      this.dynamic_data.is_essence = this.is_essence
      this.dynamic_data.share_person = this.share_person
      this.editVisible = true
      console.log('this.dynamic_data:')
      console.log(this.dynamic_data)
      this.queryData()
      },
    deleteDynamic (record) {
        const params = {
          dynamic_id: record.id
        }
        console.log('params in deleteDynamic func:')
        console.log(params)
        industryDynamicApi.deleteIndustryDynamicsData(params).then(res => {
            const code = res.code
            if (code === 0) {
              this.$message.success('数据已删除')
              this.queryData()
            }
          }).catch(err => {
            this.$message.error(err.message)
          })
        this.queryData()
      },
      handleEditOk () {
        this.$refs.dynamic_data.validate(valid => {
          if (!valid) {
            return false
          }
          console.log('dynamic_data:');
          console.log(this.dynamic_data);
          industryDynamicApi.updateIndustryDynamicsData(this.dynamic_data).then(res => {
            this.$message.success('数据已保存')
            this.queryData()
            this.editVisible = false
            this.queryData()
          }).catch(err => {
            this.$message.error(err.message)
          })
        })
      },
      handleEditCancel () {
        this.editVisible = false
      }
  }
}
</script>
