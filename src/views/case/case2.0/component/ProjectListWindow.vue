<template>
  <div style="width: 280px;">
    <a-row style="margin-top: 5px;">
      <a-col :md="44" :lg="22">
        <a-input
          allowClear
          v-model="search_project_name"
          placeholder="搜索项目"
          @pressEnter="searchProject"
          style="margin-bottom: 5px;
          "
        >
          <a-icon slot="prefix" type="search"/>
        </a-input>
      </a-col>
    </a-row>
    <div style="height: 350px; overflow-x: hidden; margin-bottom: 2px;">
      <a-row
        v-for="item in local_project_list"
        :key="local_project_list.indexOf(item)"
        :gutter="4"
        class="projectListOption"
      >
        <a-col :md="48" :lg="24">
          <div @click="handleChangeProject(item)">
            <a-avatar size="default" style="backgroundColor:#5B8FF9; margin-left: 5px;" icon="container"/>
            <span style="margin-left: 10px;">{{ item.project_name }}</span>
          </div>
        </a-col>
      </a-row>
    </div>
    <a-card @click="gotoProjectListPage()" class="allProjectOption" :bodyStyle="{padding: 0 }" >
      <a-row>
        <a-col :md="44" :lg="22" style="margin-left: 23px; margin-top: 10px;">
          <span>全部项目</span>
          <a-icon style="margin-left: 120px;" type="right"></a-icon>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>
<script>
import TestPlanReport from './report/TestPlanReport.vue'
export default {
  name: 'ProjectListModal',
  components: {
    TestPlanReport
  },
  props: {
    projectListModalVisible: {
      type: Boolean,
      default: false
    },
    projectName: {
      type: String,
      default: ''
    },
    projectId: {
      type: Number,
      default: 0
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
      confirmLoading: false,
      visible: this.projectListModalVisible,
      form: this.$form.createForm(this, { name: 'copyProjectForm' }),
      project_name: '',
      search_project_name: '',
      local_project_list: this.projectList.slice(),
      plan_id: 0,
      project_id: 0
    }
  },
  created () {
    console.log('in created of TestReportModal')
    console.log('this.$store.state.caseTwo.case_two_global_project_name: ', this.$store.state.caseTwo.case_two_global_project_name)
    this.project_name = this.$store.state.caseTwo.case_two_global_project_name
    this.project_id = this.$store.state.caseTwo.case_two_global_project_id
    this.$emit('projectListWindowInited')
  },
  methods: {
    handleChangeProject (projectInfo) {
      console.log('in handleChangeProject')
      this.$emit('handleChangeProject', projectInfo)
    },
    gotoProjectListPage () {
      console.log('in gotoProjectListPage')
      this.$router.push({
        name: 'caseTwoProjectList'
        })
    },
    searchProject () {
      console.log('this.search_project_name in getTestPlanList: ', this.search_project_name)
      if (this.search_project_name.replace(/(^[ \t\n\r]+)|([ \t\n\r]+$)/g, '') === '') {
        this.local_project_list = this.projectList
        return
      }
      // 根据project_list处理搜索
      var tempProjectList = []
      for (var i = 0; i < this.projectList.length; i++) {
        if (this.projectList[i].project_name.search(this.search_project_name) !== -1) {
          console.log('符合搜索项：', this.projectList[i].project_name)
          tempProjectList.push(this.projectList[i])
        }
      }
      console.log('tempProjectList: ', tempProjectList)
      this.local_project_list = tempProjectList
    },
    handleOk () {
      this.$emit('changeTestReportModalVisible')
        console.log('in handle ok')
    },
    handleCancel () {
      // this.form.resetFields()
      this.$emit('changeProjectListModalVisible')
    },
    init () {
      console.log('in init of ProjectListWindow.vue')
      this.local_project_list = this.projectList
      this.search_project_name = ''
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

  .projectListOption{
    margin-top: 10px;
  }
  .projectListOption:hover{
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
