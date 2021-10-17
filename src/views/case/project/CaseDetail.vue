<template>
  <div class="page-header-index-wide page-header-wrapper-grid-content-main">
    <a-card title="用例详情" :bordered="false" >
      <a-button slot="extra" class="button" type="primary" @click="realtimeRun()" :loading="loading">立即运行</a-button>
      <a-button slot="extra" class="button" @click="syncCode()" :loading="updateLoading">同步用例</a-button>
      <a-row :gutter="24">
        <a-col :md="24" :lg="8">
          <a-card type="inner" title="TestSuite">
            <CaseTree
              v-if="updateTreeComp"
              ref="caseTreeRef"
              @getFileContent="getFileContent"
              @clearFileContent="clearFileContent"
              :projectName="this.projectName"
              :projectPath="this.projectPath"
              :parentName="this.parentName"/>
            <div slot="extra">
              环境：<a-select default-value="QA" @select="selectEnv" >
                <a-select-option value="QA">QA</a-select-option>
                <a-select-option value="AUTO">AUTO</a-select-option>
                <a-select-option value="DEV">DEV</a-select-option>
                <a-select-option value="PROD">PROD</a-select-option>
              </a-select>
            </div>
          </a-card>
        </a-col>
        <a-col :md="24" :lg="16">
          <a-card
            style="width:100%"
            :tabList="tabListNoTitle"
            :activeTabKey="noTitleKey"
            @tabChange="key => handleTabChange(key, 'noTitleKey')"
            :bodyStyle="{ padding: '16px  16px'}"
          >
            <div v-if="noTitleKey === 'Text'">
              <a-textarea
                v-model="caseContent"
                placeholder="testcase"
                :rows="35"
              />
            </div>
            <div v-else-if="noTitleKey === 'Result'">
              <div style="padding-bottom:8px">
                <span>状态：</span><span id="reportStatus">{{ runState | stateFilter }}</span>
                <a-button
                  class="button"
                  @click="stopRunCase()"
                  :loading="updateLoading"
                  :size="stopButtonSize"
                  :disabled="stopRunBtnDisabled" >终止
                </a-button>
                <span >报告地址：</span><a v-if="reportUrl" :href="reportUrl">{{ reportUrl }}</a>
              </div>
              <a-textarea
                v-model="runInfo"
                placeholder="result"
                :rows="35"
                id="runInfoTextarea"
              />
            </div>
          </a-card>
        </a-col>
      </a-row>
    </a-card>
    <a-modal
      title="选择测试设备"
      :width="750"
      v-model="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      :bodyStyle="{ padding: '24px 8px'}"
      destroyOnClose
    >
      <a-spin :spinning="deviceloading">
        <div v-if="deviceList.length !== 0">
          <Device
            v-for="(item, index) in deviceList"
            :key="index"
            :deviceData="item"
            @selectDevice="selectDevice"
          />
        </div>
        <a-empty v-else :image="simpleImage" ></a-empty>
      </a-spin>
    </a-modal>
  </div>
</template>
<script>
import { fileContent, syncCode } from '@/api/case/project'
import { runCase, getTcDevices, stopCase } from '@/api/case/case'
import { runLog } from '@/api/case/report'
import CaseTree from './component/CaseTree'
import Device from './component/Device'
const API = 'API'
const APP = 'APP'
const stateMap = {
  'notStart': '未开始',
  'running': '运行中',
  'end': '结束',
  '': '未开始'
}
export default {
  name: 'CaseDetail',
  components: {
    CaseTree,
    Device
  },
  data () {
    return {
      projectName: '',
      parentName: '',
      projectPath: '',
      caseContent: '',
      reportId: '',
      runState: '',
      runInfo: '',
      timer: null,
      loading: false,
      updateLoading: false,
      noTitleKey: 'Text',
      visible: false,
      deviceList: [],
      selectDeviceList: [],
      modalLoading: false,
      simpleImage: this.$store.getters.dataEmpty,
      reportUrl: '',
      deviceloading: false,
      stopButtonSize: 'small',
      stopRunBtnDisabled: true,
      notStartCount: 0,
      updateTreeComp: true,
      env: 'QA',
      tabListNoTitle: [
        {
          key: 'Text',
          tab: 'Text'
        },
        {
          key: 'Result',
          tab: 'Result'
        }
      ]
    };
  },
  created () {
    this.projectName = this.$route.query.projectName
    this.parentName = this.$route.query.parentName
    this.projectPath = this.$route.query.projectPath
  },
  filters: {
    stateFilter (state) {
      return stateMap[state]
    }
  },
  watch: {
        'runInfo': 'scrollToBottom'
  },
  methods: {
    callback (key) {
    },
    onTabChange (key, type) {
      this[type] = key;
    },
    getFileContent (params) {
      fileContent(params).then(res => {
        this.caseContent = res.data.content
      })
    },
    clearFileContent () {
      this.caseContent = ''
    },
    syncCode () {
      this.updateLoading = true
      syncCode({ project_path: this.projectPath }).then(res => {
        this.$message.success('同步完成')
        this.caseContent = ''
        // 移除组件
        this.updateTreeComp = false
        // 在组件移除后，重新渲染组件
        // this.$nextTick可实现在DOM 状态更新后，执行传入的方法。
        this.$nextTick(() => {
            this.updateTreeComp = true
        })
      }).catch(err => {
        this.$message.error(err.message)
      }).finally(() => {
        this.updateLoading = false
      })
    },
    realtimeRun () {
      const selectCases = this.$refs.caseTreeRef.selectCases
      if (selectCases.length < 1) {
        this.$message.error('请选择测试用例')
        return
      }
      // 清空数据和初始化数据
      this.runState = ''
      this.report_id = ''
      this.reportUrl = ''
      this.runInfo = ''
      let category = API
      // TODO:如果caseContent为空无法判断是API是APP
      if (this.contains(this.caseContent, 'AppiumLibrary')) {
        category = APP
      }
      if (category === APP) {
        this.queryDevices()
        this.visible = true
      }
      if (category === API) {
        this.runCase(category)
      }
    },
    runCase (category) {
      // 使用$refs方式获取子组件的值
        const data = {
          path: this.projectPath,
          testcases: this.$refs.caseTreeRef.selectCases,
          project: this.projectName,
          category: category,
          deviceList: this.selectDeviceList,
          env: this.env
        };
        this.loading = true
        runCase(data).then(res => {
          this.notStartCount = 0
          this.reportId = res.data.report_id
          this.reportUrl = window.location.protocol + '//' + window.location.host + '/case/report/Detail?reportId=' + this.reportId + '&project=' + this.projectName
          // 切换到result tab
          this.handleTabChange('Result', 'noTitleKey')
          this.runInfo = '正在加载运行用例结果'
          this.start_output_result()// 定时获取日志
        }).catch(err => {
          this.$message.error(err.message)
        }).finally(() => {
          this.loading = false
        })
    },
    handleTabChange (key, type) {
      this[type] = key
    },
    get_output_result () {
      const data = {
        report_id: this.reportId
      }
     // 获取subprocess上运行日志信息
     runLog(data).then(res => {
        this.runState = res.data.state
        if (res.data.content === undefined || this.runState === 'notStart') {
          this.runInfo = '正在加载运行用例结果'
        }
        if (res.data.content !== undefined) {
          this.runInfo = res.data.content
        }
        if (this.runState === 'notStart') {
          this.notStartCount = this.notStartCount + 1;
          if (this.notStartCount > 10) {
              this.stop_output_result()
          }
        }
        if (this.runState === 'running') {
          this.stopRunBtnDisabled = false
        }
         // 状态是结束，停止获取日志信息
        if (this.runState === 'end') {
          this.stop_output_result()
        }
      }).catch(err => {
        this.stop_output_result()
        this.$message.error(err.message)
      })
    },
    start_output_result () {
      if (this.loginterval != null) { // 判断计时器是否为空
        window.clearInterval(this.timer);
        this.timer = null;
      }
      this.timer = setInterval(this.get_output_result, 1000);// 启动计时器，
    },
    stop_output_result () {
      this.stopRunBtnDisabled = true
      window.clearInterval(this.timer);
      this.timer = null;
    },
    contains (str, substr) {
      // string match
      return str.indexOf(substr) > -1;
    },
    queryDevices () {
      this.deviceloading = true
      this.selectDeviceList.length = 0
      const params = {
        present: true,
        platform: '',
        brand: '',
        version: '',
        resolution: '',
        using: ''
      }
      getTcDevices(params).then(res => {
        this.deviceList = res.data
        this.deviceList.forEach(item => {
          item.isSelected = false
        })
        this.deviceList = this.deviceList.filter(item => {
          return item.present
        })
      }).catch(err => {
        this.$message.error(err.message)
      }).finally(() => {
          this.deviceloading = false
      })
    },
    handleOk () {
      this.visible = false
      if (this.selectDeviceList.length > 0) {
        this.runCase(APP)
      } else {
        this.$message.error('没有选择设备不能运行脚本')
      }
    },
    handleCancel () {
      this.visible = false
    },
    selectDevice () {
      const selectedList = this.deviceList.filter(item => {
        return item.isSelected
      })
      this.selectDeviceList = selectedList
    },
    // textarea滚到底部
    scrollToBottom () {
       this.$nextTick(() => {
          const textarea = document.getElementById('runInfoTextarea');
          if (textarea.scrollHeight) {
            textarea.scrollTop = textarea.scrollHeight;
          }
     })
    },
    stopRunCase () {
      if (!this.reportId) {
        this.$message.error('没有reportId，不能进行终止运行脚本')
        return
      }
      if (this.runState !== 'running') {
        this.$message.error('运行脚本不是运行中，不能进行终止运行脚本')
        return
      }
      stopCase({ 'report_id': this.reportId }).then(res => {
        this.stopRunBtnDisabled = true
         this.$message.success('终止成功')
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    selectEnv (val) {
      this.env = val
    }
  }
}
</script>
<style lang="less" scoped>
  /deep/ .ant-modal-body {
    padding: 16px 0px 16px 0px !important;
  }

  .case-suite{
    width: 32%;
    min-width: 250px;
    float: left;
    margin-right: 16px;
  }
  .case-display{
    display: inline;
  }
  .button{
    margin: 0px 10px 0px 10px ;
  }
  /deep/ .ant-card-extra .ant-select {
    width: 80px !important;
  }
</style>

