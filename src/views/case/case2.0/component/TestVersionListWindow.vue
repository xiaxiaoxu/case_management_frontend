<template>
  <div style="width: 280px;">
    <a-row style="margin-top: 5px;">
      <a-col :md="44" :lg="22">
        <a-input
          allowClear
          v-model="search_test_version_name"
          placeholder="搜索测试版本"
          @pressEnter="searchTestVersion"
          style="margin-bottom: 5px;"
        >
          <a-icon slot="prefix" type="search"/>
        </a-input>
      </a-col>
    </a-row>
    <div style="height: 350px; overflow-x: hidden; margin-bottom: 2px;">
      <a-row
        v-for="item in local_test_version_list"
        :key="local_test_version_list.indexOf(item)"
        :gutter="4"
        class="planListOption"
      >
        <div @click="handleChangeTestVersion(item.id)" style="margin-top: 6px;">
          <a-col :md="34" :lg="17" style="text-overflow: ellipsis;">
            <span style="margin-left: 5px; white-space: nowrap;">{{ item.test_version_name }}</span>
          </a-col>
          <a-col :md="14" :lg="7">
            <a-tag v-if="item.test_version_status === '0'" color="red">未开始</a-tag>
            <a-tag v-if="item.test_version_status === '1'" color="orange">运行中</a-tag>
            <a-tag v-if="item.test_version_status === '2'" color="green">已完成</a-tag>
          </a-col>
        </div>
      </a-row>
    </div>
    <a-card @click="gotoTestPlanListPage()" class="allPlanOption" :bodyStyle="{padding: 0 }" >
      <a-row>
        <a-col :md="44" :lg="22" style="margin-left: 23px; margin-top: 10px;">
          <span>全部测试版本</span>
          <a-icon style="margin-left: 120px;" type="right"></a-icon>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>
<script>
// import { findPlanById } from '@/api/case/plan_two'
import moment from 'moment'
export default {
  name: 'TestVersionListModal',
  components: {},
  props: {
    testVersionName: {
      type: String,
      default: ''
    },
    testVersionList: {
      type: Array,
        default: () => {
          return []
        }
    },
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
      form: this.$form.createForm(this, { name: 'copyPlanForm' }),
      Plan_name: '',
      search_test_version_name: '',
      local_test_version_list: this.testVersionList.slice(),
      plan_id: 0
    }
  },
  created () {
    this.$emit('testVersionListWindowInited')
    console.log('this.testVersionList: ', this.testVersionList)
  },
  methods: {
    handleChangeTestVersion (testVersionId) {
      console.log('in handleChangeTestVersion')
      console.log('this.projectId: ', this.projectId)
      console.log('testVersionId: ', testVersionId)
      // this.$router.push({
      //   name: 'caseTwoPlanDetail',
      //   query: { project_id: this.projectId, plan_id: planId }
      // })
      this.$emit('handleChangeTestVersion', testVersionId)
    },
    gotoTestPlanListPage () {
      console.log('in gotoTestPlanListPage')
      this.$router.push({
        name: 'caseTwoTestVersionList'
        })
    },
    searchTestVersion () {
      console.log('this.search_test_version_name in searchTestVersion: ', this.search_test_version_name)
      if (this.search_test_version_name.replace(/(^[ \t\n\r]+)|([ \t\n\r]+$)/g, '') === '') {
        this.local_test_version_list = this.testVersionList
        return
      }
      // 根据planList处理搜索
      var tempTestVersionList = []
      for (var i = 0; i < this.planList.length; i++) {
        if (this.planList[i].plan_name.search(this.search_test_version_name) !== -1) {
          console.log('符合搜索项：', this.testVersionList[i].plan_name)
          tempTestVersionList.push(this.testVersionList[i])
        }
      }
      console.log('tempTestVersionList: ', tempTestVersionList)
      this.local_test_version_list = tempTestVersionList
    },
    moment,
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
    init () {
      console.log('in init of TestVersionListWindow.vue')
      this.local_test_version_list = this.testVersionList
      this.search_test_version_name = ''
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

  .planListOption{
    cursor: pointer;
    margin-top: 10px;
    height: 35px;
  }
  .planListOption:hover{
    background-color: #D3EEF9;
  }

  .allPlanOption{
    height: 40px;
    margin-left: -16px;
    margin-right: -16px;
    margin-bottom: -12px;
  }
  .allPlanOption:hover{
    background-color: #D3EEF9;
  }

</style>
