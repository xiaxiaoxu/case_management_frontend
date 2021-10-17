<template>
  <div>
    <a-modal
      :title="'关联用例'"
      :width="1200"
      v-model="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      :confirmLoading="confirmLoading"
    >
      <div style="margin-top: 10px;">
        <a-row :gutter="24">
          <a-col :md="20" :lg="10">
            <div class="auto-case-select_module-section">
              <a-card
                :bordered="false"
                type="inner"
                title="TestSuite"
                :body-style="{padding: '10px 10px 0 0'}"
              >
                <a-spin :spinning="this.tree_loading" style="height: 200px;">
                  <a-directory-tree
                    :expanded-keys="expandedKeys"
                    :auto-expand-parent="autoExpandParent"
                    :selected-keys="selectedKeys"
                    :tree-data="testSuiteDataList"
                    @expand="onExpand"
                    @select="onSelectTestSuite"
                    :load-data="onLoadData"
                    show-icon
                  />
                </a-spin>
              </a-card>
            </div>
          </a-col>
          <a-col :md="28" :lg="14">
            <a-row :gutter="12">
              <a-col :md="38" :lg="19">
                <a-input
                  allowClear
                  size="large"
                  v-model="search_case_name"
                  placeholder="搜索用例标题（按enter搜索）"
                  @pressEnter="searchManulCase"
                >
                  <a-icon slot="prefix" type="search" :style="{ fontSize: '15px' }"/>
                </a-input>
              </a-col>
            </a-row>
            <div class="auto-case-select-case-section">
              <a-table
                bordered
                :showHeader="false"
                :columns="columns"
                :customRow="rowclick"
                rowKey="key"
                :data-source="testCaseList"
                :loading="loading"
                class="select-table"
                :pagination="pagination"
                style="margin-top: 20px;"
              >
                <template slot="case_name" slot-scope="text">
                  <a-row :gutter="1">
                    <a-col :span="22">
                      <div>
                        <span>{{ text }}</span>
                      </div>
                    </a-col>
                  </a-row>
                </template>
              </a-table>
            </div>
          </a-col>
        </a-row>
      </div>
    </a-modal>
  </div>
</template>

<script>

import { getTestSuiteData, getSuiteCases, bindAutoCase } from '@/api/case/code_repository'
import { Tree } from 'ant-design-vue'

  const { DirectoryTree, TreeNode } = Tree;

  export default {
    name: 'ConfigPlanCase',
    props: {
      autoCaseSelectWindowVisible: {
        type: Boolean,
        default: false
      },
      codeRepositoryId: {
        type: Number,
        default: 0
      }
    },
    components: {
      'a-directory-tree': DirectoryTree,
      'a-tree-node': TreeNode
    },
    data () {
      return {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 4 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 20 }
        },
        // columns定义到export里，便于访问this
        columns: [
          {
            title: '标题',
            dataIndex: 'case_name',
            key: 'case_name',
            scopedSlots: { customRender: 'case_name' },
            width: 420
          }
        ],
        expandedKeys: [],
        autoExpandParent: true,
        checkedKeys: { 'checked': [], 'halfChecked': [] },
        selectedKeys: [],
        tree_loading: true,
        visible: this.autoCaseSelectWindowVisible,
        selectedRowKeys: [], // Check here to configure the default column
        data: [],
        confirmLoading: false,
        loading: false,
        testSuiteDataList: [],
        search_case_name: '',
        testCaseList: [],
        localTestCaseList: [],
        keywords: [],
        variables: [],
        case_id: 0,
        project_id: 0,
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
    created () {
      console.log('in created of ConfigPlanCase:')
      console.log('this.$route.query: ', this.$route.query)
      this.project_id = parseInt(this.$route.query.project_id)
      console.log('this.project_id:', this.project_id)
      this.initialProjectName = this.$store.state.caseTwo.case_two_global_project_name
    },
    watch: {
      // 这一步很关键，此时在父组件修改了组件的props，会同步到组件内对应的props上
      // 但是不会同步到你刚刚在data对象中创建的 dialog 上
      // 所以需要再创建一个针对props属性dialogFormVisible的watch（监听）
      // 当props修改后对应data中的副本dialog 也要同步数据。
      autoCaseSelectWindowVisible (val) {
        this.visible = val
      },
      checkedKeys (val) {
        console.log('watch-Check:', val);
      }
    },
    methods: {
      onExpand (expandedKeys) {
        console.log('expandedKeys in onExpand: ', expandedKeys)
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        this.expandedKeys = expandedKeys;
        this.autoExpandParent = false;
      },
      rowclick (record, index) {
        return {
          on: {
            click: () => {
              console.log(record, index, 'in rowclick')
              this.bindAutoCase(record)
            }
          }
        }
      },
      bindAutoCase (autoCase) {
        console.log('autoCase in bindAutoCase: ', autoCase)
        // 绑定this.case_id和autoCase的suite_path、case_name
        const params = {
          code_repository_id: this.codeRepositoryId,
          manual_case_id: this.case_id,
          suite_path: autoCase.suite_path,
          auto_case_name: autoCase.case_name
        }
        console.log('params in bindAutoCase: ', params)
        this.$emit('changeSelectWindowVisible')
        bindAutoCase(params).then(res => {
          console.log(res.data)
          this.$emit('queryData')
        })
      },
      searchManulCase () {
        console.log('in searchManulCase')
        console.log('this.search_plan_name in getTestPlanList: ', this.search_plan_name)
        if (this.search_case_name.replace(/(^[ \t\n\r]+)|([ \t\n\r]+$)/g, '') === '') {
          this.testCaseList = this.localTestCaseList
          return
        }
        // 根据localTestCaseList处理搜索
        var tempCaseList = []
        for (var i = 0; i < this.localTestCaseList.length; i++) {
          if (this.localTestCaseList[i].case_name.search(this.search_case_name) !== -1) {
            console.log('符合搜索项：', this.localTestCaseList[i].case_name)
            tempCaseList.push(this.localTestCaseList[i])
          }
        }
        console.log('tempCaseList: ', tempCaseList)
        this.testCaseList = tempCaseList
      },
      onLoadData (treeNode) {
        console.log('treeNode in OnLoadData function: ', treeNode)
        return new Promise(resolve => {
          resolve()
        })
      },
      onSelectTestSuite (selectedKeys, info) {
        console.log('selectedKeys in onSelectTestSuite:', selectedKeys)
        console.log('info in onSelectTestSuite:', info)
        if (selectedKeys.length > 0) {
          this.selectedKeys = selectedKeys;
        }
        if (!info.node.dataRef.children) {
          const params = {
            suite_path: selectedKeys[0]
          }
          console.log('params in getSuiteInfo: ', params)
          getSuiteCases(params).then(res => {
            // treeNode.dataRef.children = res.data.testcases
            // this.testSuiteDataList = [...this.testSuiteDataList]
            if (res.data) {
              this.testCaseList = res.data.testcases
              this.localTestCaseList = res.data.testcases
              this.keywords = res.data.keywords
              this.variables = res.data.variables
            }
          }).catch(err => {
            this.$message.error(err.message)
          })
        }
      },
      handleCaseLevelSelectChange (value) {
        console.log('value in handleCaseLevelSelectChange of ConfigPlanCase: ', value)
        this.case_level = value
      },
      handleOk () {
        this.$emit('changeSelectWindowVisible')
      },
      handleCancel () {
        this.$emit('changeSelectWindowVisible')
      },
      init (caseId) {
        console.log('iterationId in init of CopyPlanForm.vue: ', caseId)
        this.case_id = caseId
        this.tree_loading = true
        console.log('this.case_id in init of ConfigPlanCase.vue: ', this.case_id)
        this.queryData()
      },
      queryData () {
        console.log('in queryData')
        this.testCaseList = []
        this.localTestCaseList = []
        this.getTestSuiteData()
      },
      getTestSuiteData () {
        // 先清空this.testCaseList和this.testSuiteDataList
        this.testSuiteDataList = []
        this.selectedKeys = []
        console.log('in getTestSuiteData')
        const params = {
          repository_id: this.codeRepositoryId
        }
        console.log('params in getTestSuiteData: ', params)
        getTestSuiteData(params).then(res => {
          if (res.data) {
            console.log('res.data.length: ', res.data.length)
            this.testSuiteDataList = res.data
            this.tree_loading = false
          }
        }).catch(err => {
          this.$message.error(err.message)
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../caseList.less";
  /deep/ .ant-tree-node-content-wrapper{
      width: 95%;
      white-space: nowrap;
      // text-overflow: ellipsis;
      overflow: hidden;
    }

  /deep/ .ant-tree li .ant-tree-node-content-wrapper.ant-tree-node-selected {
    background-color: #d2eafb;
    height: 35px;
    padding-top: 5px;
  }
   /deep/ .ant-tree li .ant-tree-node-content-wrapper{
    // background-color: #d2eafb;
    height: 35px;
    padding: 5px;
  }
  /deep/ .ant-tree li .ant-tree-node-content-wrapper.ant-tree-node {
    background-color: red;
    padding: 5px;
  }
  /deep/ .ant-tree li  {
    padding: 1px;
  }

  /deep/ .ant-tree li span.ant-tree-checkbox {
    margin-top: 5px;
    // border: green;
    // background-color:  green;
    }
  // 修改tabs滚动条粗细度
  /deep/ .ant-tabs-ink-bar-animated{
    bottom: 0;
  }

  .planOperationOption{
    width: 160px;
    height: 30px;
    cursor: pointer;
    margin-top: 5px;
    margin-bottom: 5px;
  }
  .planOperationOption:hover{
    background-color: #D3EEF9;
  }

  .executeResultOption{
    width: 160px;
    height: 30px;
    cursor: pointer;
    margin-bottom: 10px;
  }
  .executeResultOption:hover{
    background-color: #D3EEF9;
  }

  .executePriorityOption{
  width: 160px;
  height: 35px;
  cursor: pointer;
  margin-bottom: 10px;
  }
  .executePriorityOption:hover{
    background-color: #D3EEF9;
  }
  //直接在style中添加样式
  //这样使用会使得当前页面所有的table表格行样式都会改变
  //如果想要调整表头的行高，可以把下面的td改成th
  //调整body行属性
  /deep/ .ant-table-tbody > tr > td {
    padding: 12px;
  }
  //调整head行属性
  /deep/ .ant-table-thead > tr > th {
    padding: 12px;
  }

  /deep/ .ant-tree li span.ant-tree-switcher{
    width:16px;
    height:16px;
    margin:6px;
    // 修改树结构合起的icon
    &.ant-tree-switcher_close{
      // background:url('../../../assets/case/project.png') no-repeat;
      background-size:contain;
      // i{
      //   display: none;
      // }
    }
    // 修改树结构展开的icon
    &.ant-tree-switcher_open{
      // background:url('../../../assets/case/project_two.png') no-repeat;
      background-size:contain;
      // i{
      //   display: none;
      // }
    }
  }

  .links {
    a {
      display: block;
      margin: 12px 0;
      line-height: 24px;
      height: 24px;

      .link {
        font-size: 14px;
        color: #14C393;
        line-height: 24px;
        max-width: 100px;
        vertical-align: top;
        margin-left: 12px;
        transition: all 0.3s;
        display: inline-block;
        border-radius: 5px;
      }

      &:hover {
        span {
          color: #1890ff;
        }
      }
    }
  }

  .dashboard-img {
    img {
      width: 100%;
    }
  }
    .ant-card-body .but_type {
      float: right;
      position: absolute;
      right: 20px;
      width: 100px;
      text-align: right;
    }
  // new end
  /deep/ .ant-statistic-content {
    font-size: 19px;

  .active{
    margin-right: 5px;
  }

  .class_tag {
    font-weight: bold;
    color: white;
    font-size: 5px;
  }
  }
</style>
<style scoped>
  .ant-carousel >>> .slick-slide {
    text-align: center;
    overflow: hidden;
  }
  .ant-carousel >>> .slick-dots-bottom {
    bottom: 20px;
  }

  .ant-carousel >>> .slick-dots-bottom li {
    background: #bdbdbd;
  }

  .ant-carousel >>> .slick-dots li.slick-active button {
    background: #14C393;
  }
</style>
