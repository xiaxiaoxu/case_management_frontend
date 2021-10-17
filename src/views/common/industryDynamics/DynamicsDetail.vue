<template>
  <div>
    <a-card title="数据详情" :loading="loading">
      <div slot="extra">
        <a-button style="float: right" @click="goback()">返回</a-button>
      </div>
      <a-card style="margin-top: 24px" title="数据信息">
        <div slot="extra">
          <div>
            <a-popconfirm v-show="deleteVisible" placement="top" ok-text="确定" cancel-text="取消" @confirm="deleteDynamic">
              <template slot="title">
                <p>确认删除该数据么？</p>
              </template>
              <a-button title="删除数据" class="dynamicButton">删除数据</a-button>
            </a-popconfirm>
            <a-button class="dynamicButton" @click="editDynamic">修改数据</a-button>
          </div>
        </div>
        <div class="dynamic-info">
          <div class="dynamicItem"><span>数据标签：{{ this.tags }}</span></div>
          <div class="dynamicItem"><span>数据标题：{{ this.title }}</span></div>
          <div class="dynamicItem"><span>数据来源：{{ this.source }}</span></div>
          <div class="dynamicItem"><span>创建时间：{{ this.created_time }}</span></div>
          <div class="dynamicItem"><span>链接地址：{{ this.address }}</span></div>
          <div class="dynamicItem"><span>修改时间：{{ this.modified_time }}</span></div>
          <div class="dynamicItem"><span>是否置顶：{{ this.is_top|optionFilter }}</span></div>
          <div class="dynamicItem"><span>阅读量：{{ this.view_num }}</span></div>
          <div class="dynamicItem"><span>是否精华：{{ this.is_essence|optionFilter }}</span></div>
          <div class="dynamicItem"><span>分享人：{{ this.share_person }}</span></div>
        </div>
      </a-card>
    </a-card>
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
      :confirmLoading="confirmLoading"
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
  import * as industryDynamicApi from '@/api/common/extention'
  const filterOptions = { 'Y': '是', 'N': '否' }
  export default {
    name: 'IndustryDynamicsDetail',
    props: {
      questionId: {
        type: Number,
        default: undefined
      }
    },
    data () {
      return {
        dynamic_id: '',
        isTopOptions: { 'Y': '是', 'N': '否' },
        isEssenseOptions: { 'Y': '是', 'N': '否' },
        deleteVisible: false,
        topAndEssense: false,
        tags: undefined,
        title: '',
        source: '',
        address: '',
        is_top: '',
        is_essence: '',
        view_num: '',
        share_person: '',
        created_time: '',
        modified_time: '',
        editVisible: false,
        dealVisible: false,
        resolveVisible: false,
        loading: false,
        confirmLoading: false,
        jiraLink: '',
        jiraKey: '',
        defaultQuestionDate: undefined,
        status: undefined,
        stepList: [],
        logColumns: [
          {
            title: '操作类型',
            dataIndex: 'operateType',
            align: 'center',
            scopedSlots: { customRender: 'operateType' }
          },
          {
            title: '操作人',
            dataIndex: 'userName',
            align: 'center'
          },
          {
            title: '操作时间',
            dataIndex: 'operateTime',
            align: 'center'
          },
          {
            title: '操作说明',
            dataIndex: 'comment',
            align: 'center'
          }
        ],
        logList: [],
        questionName: '',
        questionDesc: '',
        projectName: '',
        projectId: undefined,
        assignee: undefined,
        questionDate: '',
        resolutionCategory: undefined,
        assigneeDepartName: '',
        questionCategory: undefined,
        questionLevel: undefined,
        reason: '',
        resolution: '',
        questionFrom: undefined,
        comment: '',
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
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
        dynamic_data: {
          dynamic_id: undefined,
          tags: undefined,
          title: '',
          source: '',
          address: '',
          is_top: '',
          is_essence: '',
          share_person: ''
        }
      }
    },
    filters: {
      optionFilter (option) {
        return filterOptions[option]
      }
    },
    created () {
    this.dynamic_id = this.$route.query.dynamic_id
    this.getDynamicDetail(this.dynamic_id)
    this.deleteVisible = this.$route.query.delete_visible
    this.topAndEssense = this.$route.query.topAndEssense
    console.log('this.deleteVisible')
    console.log(this.deleteVisible)
    },
    methods: {
      getDynamicDetail (dynamicId) {
        const params = {
          dynamic_id: dynamicId
        }
        industryDynamicApi.getIndustryDynamicsDetail(params).then(res => {
          this.tags = res.data.info.tags
          this.title = res.data.info.title
          this.source = res.data.info.source
          this.address = res.data.info.address
          this.is_top = res.data.info.is_top
          this.is_essence = res.data.info.is_essence
          this.view_num = res.data.info.view_number
          this.share_person = res.data.info.share_person
          this.created_time = res.data.info.created_time
          this.modified_time = res.data.info.modified_time
          this.share_person = res.data.info.share_person
        }).catch(err => {
          this.$message.error(err.message)
        })
      },
      viewList () {
        if (this.$route.params.questionId !== undefined) {
          this.$router.push({ name: 'QuestionList' })
        } else {
          this.$emit('viewList')
        }
      },
      editDynamic () {
        this.dynamic_data.dynamic_id = this.dynamic_id
        this.dynamic_data.tags = this.tags
        this.dynamic_data.title = this.title
        this.dynamic_data.source = this.source
        this.dynamic_data.address = this.address
        this.dynamic_data.is_top = this.is_top
        this.dynamic_data.is_essence = this.is_essence
        this.dynamic_data.share_person = this.share_person
        this.editVisible = true
      },
      deleteDynamic () {
        const params = {
          dynamic_id: this.dynamic_id
        }
        industryDynamicApi.deleteIndustryDynamicsData(params).then(res => {
            console.log('this.dynamic_id:')
            console.log(this.dynamic_id)
            this.$message.success('数据已删除')
            this.goback();
          }).catch(err => {
            this.$message.error(err.message)
          })
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
            this.getDynamicDetail(this.dynamic_id)
            this.editVisible = false
            // this.getQuestionComment(this.questionId)
          }).catch(err => {
            this.$message.error(err.message)
          })
        })
      },
      handleEditCancel () {
        this.editVisible = false
      },
      filterOption (input, option) {
        return (
          option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        )
      },
      goback () {
      this.$router.push({ name: 'industryDynamicsList' })
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
  .dynamicButton {
    float: right;
    margin-right: 20px;
  }
  .dynamic-info {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    width: 100%;

    .dynamicItem {
      margin-bottom: 10px;
      flex-direction: column;
      width: 50%;
    }
  }
</style>
