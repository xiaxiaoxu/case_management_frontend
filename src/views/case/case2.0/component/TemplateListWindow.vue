<template>
  <div style="width: 220px;">
    <a-row style="margin-top: 5px;">
      <a-col :md="48" :lg="24">
        <a-input
          allowClear
          v-model="search_template_name"
          placeholder="搜索模板"
          @pressEnter="searchTemplate"
          style="margin-bottom: 5px;"
        >
          <a-icon slot="prefix" type="search"/>
        </a-input>
      </a-col>
      <a-tooltip>
        <template slot="title">
          <span>模板管理</span>
        </template>
        <div class="templateSetting" @click="gotoTemplateListPage()">
          <a-icon style="font-size: 15px; margin-left: 6px; margin-top: 4px;" type="setting" />
        </div>
      </a-tooltip>
    </a-row>
    <div style="height: 200px; overflow-x: hidden; margin-bottom: 2px;">
      <a-row
        v-for="item in local_template_list"
        :key="local_template_list.indexOf(item)"
        :gutter="4"
        class="templateListOption"
      >
        <a-col :md="48" :lg="24">
          <div @click="handleChangeTemplate(item)">
            <!-- <a-avatar size="default" style="backgroundColor:#5B8FF9; margin-left: 5px;" icon="container"/> -->
            <a-icon size="default" style="margin-left: 5px;" type="profile" />
            <span style="margin-left: 5px;">{{ item.template_name }}</span>
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>
<script>
import { getCaseTemplateList } from '@/api/case/case_two'
export default {
  name: 'TemplateListWindow',
  components: {},
  props: {
    projectId: {
      type: Number,
      default: 0
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
      confirmLoading: false,
      project_name: '',
      project_id: 0,
      search_template_name: '',
      template_list: [],
      local_template_list: []
    }
  },
  created () {
    console.log('in created of TemplateListWindow')
    this.$emit('templateListWindowInited')
    console.log('this.$route.query.project_id: ', this.$route.query.project_id)
    this.project_id = parseInt(this.$route.query.project_id)
    console.log('this.project_id:', this.project_id)
    this.getCaseTemplateList()
  },
  methods: {
    gotoTemplateListPage () {
      console.log('in gotoTemplateListPage')
      this.$router.push({
        name: 'caseTwoSetting'
        })
    },
    handleChangeTemplate (temlateInfo) {
      console.log('in handleChangeTemplate')
      this.$emit('handleChangeTemplate', temlateInfo)
    },
    gotoProjectListPage () {
      console.log('in gotoProjectListPage')
      this.$router.push({
        name: 'caseTwoProjectList'
        })
    },
    searchTemplate () {
      console.log('this.search_template_name in searchTemplate: ', this.search_template_name)
      if (this.search_template_name.replace(/(^[ \t\n\r]+)|([ \t\n\r]+$)/g, '') === '') {
        return
      }
      // 根据template_list处理搜索
      var tempTemplateList = []
      for (var i = 0; i < this.template_list.length; i++) {
        if (this.template_list[i].template_name.search(this.search_template_name) !== -1) {
          console.log('符合搜索项：', this.template_list[i].template_name)
          tempTemplateList.push(this.template_list[i])
        }
      }
      console.log('tempProjectList: ', tempTemplateList)
      this.local_template_list = tempTemplateList
    },
    getCaseTemplateList () {
      const params = {
        project_id: this.project_id
      }
      console.log('params in getCaseTemplateList:', params)
       getCaseTemplateList(params).then(res => {
         this.template_list = res.data
         this.local_template_list = res.data
       }).catch(err => {
        this.$message.error(err.message)
      })
    },
    init () {
      console.log('this.project_id in init of TemplateListWindow: ', this.project_id)
      this.getCaseTemplateList()
    }
  }
}
</script>

<style lang="less" scoped>
  @import "../caseList.less";
  /deep/ .ant-form-item {
    margin-bottom: 8px ;
  }
  .scirpt-tip {
    margin-left: 20px;
    font-size: 12px;
  }

  .templateListOption{
    margin-top: 10px;
    cursor: pointer;
  }
  .templateListOption:hover{
    background-color: #D3EEF9;
  }
  .templateSetting{
    position: absolute;
    width: 28px;
    height: 24px;
    right: 5px;
    bottom: 58px;
  }
  .templateSetting:hover{
    background-color: #D3EEF9;
  }
  .allProjectOption{
    height: 40px;
    margin-left: -16px;
    margin-right: -16px;
    margin-bottom: -12px;
  }
  .allProjectOption:hover{
    background-color: #D3EEF9;
  }

</style>
