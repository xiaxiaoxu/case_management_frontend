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
          <a-col :md="12" :lg="6">
            <div class="config-plan-case-module-section">
              <a-card
                :bordered="false"
                type="inner"
                title="模块"
                :body-style="{padding: '10px 10px 0 0'}"
              >
                <a-spin :spinning="tree_loading" style="height: 200px;">
                  <a-tree
                    checkable
                    checkStrictly
                    :expanded-keys="expandedKeys"
                    :auto-expand-parent="autoExpandParent"
                    :selectedKeys="selectedKeys"
                    :checkedKeys="checkedKeys"
                    :tree-data="moduleDataList"
                    @check="onCheckModule"
                    @expand="onExpand"
                    @select="onSelectModule"
                    :load-data="onLoadData"
                    show-icon
                  >
                    <a-icon slot="folder-open" type="folder-open" />
                    <a-icon slot="folder" type="folder" />
                    <template slot="custom_all_case" slot-scope="item" >
                      <div style="width: 220px; display: inline-block; background-color: rgba(0,0,0,0~1)">
                        <span>{{ item.title }}</span>
                      </div>
                    </template>
                    <template slot="custom" slot-scope="item" >
                      <div style="width: 220px; display: inline-block; background-color: rgba(0,0,0,0~1)">
                        <span>{{ item.title }}</span>
                      </div>
                    </template>
                  </a-tree>
                </a-spin>
              </a-card>
            </div>
          </a-col>
          <a-col :md="36" :lg="18">
            <a-row :gutter="12">
              <a-col :md="38" :lg="19">
                <span>提示： 当前story为</span>
                <span style="color: red; margin-left: 5px;">{{ this.plan_name }}</span>
                <span> ，所选用例将会挂到该story下</span>
              </a-col>
            </a-row>
            <a-row :gutter="12" style="margin-top: 8px;">
              <a-col :md="38" :lg="19">
                <a-input
                  allowClear
                  v-model="case_title"
                  placeholder="搜索用例标题（按enter搜索）"
                  @pressEnter="getConfigPlanCaseTestCases"
                  size="large"
                >
                  <a-icon slot="prefix" type="search" :style="{ fontSize: '15px' }"/>
                </a-input>
              </a-col>
              <a-col :md="8" :lg="4" style="float: right; margin-right: 25px;">
                <a-select
                  allowClear
                  style="width: 100%;"
                  placeholder="选择级别"
                  @change="handleCaseLevelSelectChange"
                  size="large"
                >
                  <a-select-option v-for="case_level_item in case_level_list" :key="case_level_item" :value="case_level_item">
                    <a-tag v-if="case_level_item === 'Level 1'" color="#E86452"><div class="title_tag">{{ case_level_item }}</div></a-tag>
                    <a-tag v-if="case_level_item === 'Level 2'" color="#FF9845"><div class="title_tag">{{ case_level_item }}</div></a-tag>
                    <a-tag v-if="case_level_item === 'Level 3'" color="#F6BD16"><div class="title_tag">{{ case_level_item }}</div></a-tag>
                  </a-select-option>
                </a-select>
              </a-col>
            </a-row>
            <div class="config-plan-case-section">
              <a-table
                bordered
                :showHeader="true"
                :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectCaseChange }"
                :columns="columns"
                rowKey="id"
                :data-source="testCaseList"
                :loading="loading"
                class="select-table"
                :pagination="pagination"
                style="margin-top: 10px;"
                :locale="{ emptyText: '用例已被关联或无数据' }"
              >
                <template slot="case_name" slot-scope="text, record">
                  <a-row :gutter="1">
                    <!-- <a-col :span="2">
                      <a-tag style="padding-left: 2px; padding-right: 2px;" v-if="record.if_need_automated === 'Y'" color="#14C393"><span class="class_tag">auto</span></a-tag>
                    </a-col> -->
                    <a-col :span="22" style="margin-left: 5px;">
                      <div>
                        <span>{{ text }}</span>
                        <a-tag style="margin-left: 5px; padding-left: 2px; padding-right: 2px;" v-if="record.if_smoke_test === 'Y'" color="#FAAD14"><span class="title_tag">smoke</span></a-tag>
                      </div>
                    </a-col>
                  </a-row>
                </template>
                <template slot="case_level" slot-scope="text">
                  <div>
                    <a-tag v-if="text === 'Level 1'" color="#E86452"><div class="title_tag">{{ text }}</div></a-tag>
                    <a-tag v-if="text === 'Level 2'" color="#FF9845"><div class="title_tag">{{ text }}</div></a-tag>
                    <a-tag v-if="text === 'Level 3'" color="#F6BD16"><div class="title_tag">{{ text }}</div></a-tag>
                  </div>
                </template>
                <template slot="set_smoke_test" slot-scope="text, record">
                  <div v-if="record.selected">
                    <a-checkbox v-model="record.set_smoke_test" @change="onChangeCheckSmokeTest">
                    </a-checkbox>
                  </div>
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

import { getConfigPlanCaseTestCases, addPlanAssociatedCases } from '@/api/case/case_two'
import { Tree } from 'ant-design-vue'
import { getConfigPlanCaseModuleList } from '@/api/case/module_two'
  const { DirectoryTree, TreeNode } = Tree;
  const stateMap = {
    '0': '未开始',
    '1': '运行中',
    '2': '已完成'
  }
  // case_priority: ['高', '中', '低'],
  //  execute_result: ['通过', '阻塞', '失败', '跳过', '未测'],
  const priorityMap = {
    '0': '高',
    '1': '中',
    '2': '低'
  }
  const executeResultMap = {
    '0': '通过',
    '1': '阻塞',
    '2': '失败',
    '3': '跳过',
    '4': '未测'
  }
  export default {
    name: 'ConfigPlanCase',
    props: {
      configPlanCaseVisible: {
        type: Boolean,
        default: false
      },
      projectId: {
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
            title: '编号',
            dataIndex: 'order_number',
            key: 'order_number',
            scopedSlots: { customRender: 'order_number' },
            width: 100
          },
          {
            title: '标题',
            dataIndex: 'case_name',
            key: 'case_name',
            scopedSlots: { customRender: 'case_name' },
            width: 400
          },
          {
            title: '用例级别',
            dataIndex: 'case_level',
            key: 'case_level',
            scopedSlots: { customRender: 'case_level' },
            width: 120,
            align: 'center'
          },
          {
            title: '设为冒烟测试',
            dataIndex: 'set_smoke_test',
            key: 'set_smoke_test',
            scopedSlots: { customRender: 'set_smoke_test' },
            width: 160,
            align: 'center'
          }
        ],
        expandedKeys: [],
        autoExpandParent: true,
        checkedKeys: { 'checked': [], 'halfChecked': [] },
        selectedKeys: [],
        selectCases: [],
        moduleDataList: [],
        tree_loading: false,
        moduleContainCaseNumberData: {},
        caseModuleRelationData: {},
        visible: this.configPlanCaseVisible,
        selectedRowKeys: [], // Check here to configure the default column
        data: [],
        dateValue: [],
        rangeValues: {},
        categoryList: [],
        checkedModuleIdList: [],
        configPlanCaseModuleTreeLoading: false,
        project_name: '',
        confirmLoading: false,
        loading: false,
        updateConfigPlanCaseModuleTreeComp: true,
        form: this.$form.createForm(this, { name: 'createCaseForm' }),
        case_title: '',
        case_level: '',
        case_level_list: ['Level 1', 'Level 2', 'Level 3'],
        priorityMap,
        value1: [],
        search_case_level: '',
        hasSelected: false,
        testCaseList: [],
        allTestCaseList: [],
        case_id_smoke_test_obj: {},
        caseList: [],
        project_id: 0,
        plan_id: 0,
        plan_name: '',
        stateMap,
        module_id: 0,
        totalPlanCases: 0,
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
    filters: {
      stateFilter (state) {
        return stateMap[state]
      },
      priorityFilter (state) {
        return priorityMap[state]
      },
      executeResultFilter (state) {
        return executeResultMap[state]
      },
      memberFilter (members) {
        if (members) {
          return members.join('、')
        } else {
          return ''
        }
      }
    },
    created () {
      console.log('in created of ConfigPlanCase:')
      console.log('this.$route.query: ', this.$route.query)
      this.project_id = parseInt(this.$route.query.project_id)
      // this.plan_id = parseInt(this.$route.query.plan_id)
      console.log('this.project_id:', this.project_id)
      // console.log('this.plan_id:', this.plan_id)
      this.initialProjectName = this.$store.state.caseTwo.case_two_global_project_name
      // this.queryData()
    },
    watch: {
      selectedRowKeys () {
        console.log('this.selectedRowKeys in watch selectedRowKeys: ', this.selectedRowKeys)
        this.hasSelected = this.selectedRowKeys.length > 0
        console.log('this.hasSelected:', this.hasSelected)
        for (let i = 0; i < this.testCaseList.length; i++) {
            // console.log('this.testCaseList[i].id: ', this.testCaseList[i].id)
            // console.log('selectedRowKeys.indexOf(this.testCaseList[i].id): ', selectedRowKeys.indexOf(this.testCaseList[i].id))
            if (this.selectedRowKeys.indexOf(this.testCaseList[i].id) !== -1) {
              this.testCaseList[i].selected = true
              console.log('选中：', this.testCaseList[i].id)
            } else {
              this.testCaseList[i].selected = false
            }
          }
      },
      // 这一步很关键，此时在父组件修改了组件的props，会同步到组件内对应的props上
      // 但是不会同步到你刚刚在data对象中创建的 dialog 上
      // 所以需要再创建一个针对props属性dialogFormVisible的watch（监听）
      // 当props修改后对应data中的副本dialog 也要同步数据。
      configPlanCaseVisible (val) {
        this.visible = val
      },
      checkedKeys (val) {
        console.log('watch-Check:', val);
      }
    },
    methods: {
      clickCheckBox (record) {
        console.log('record: ', record)
      },
      onChangeCheckSmokeTest (e) {
        console.log('e.target.checked: ', e.target.checked)
        // record.set_smoke_test = 'Y'
        // console.log(`checked = ${e.target.checked}`);
        // console.log('info: ', info)
      },
      onLoadData (treeNode) {
        console.log('in OnLoadData function')
        return new Promise(resolve => {
          if (treeNode.dataRef.children) {
            resolve();
            return;
          }
          this.getModuleDataList().then(res => {
            treeNode.dataRef.children = res.data
            this.moduleDataList = [...this.moduleDataList]
            resolve();
          }).catch(err => {
            this.$message.error(err.message)
          })
        });
      },
      onExpand (expandedKeys) {
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        this.expandedKeys = expandedKeys;
        this.autoExpandParent = false;
      },
      // 递归获取module_id所有子节点
      getModuleData (moduleId, moduleDataList) {
        var moduleData
        for (var i = 0; i < moduleDataList.length; i++) {
          // console.log(`moduleDataList[${i}].id: `, moduleDataList[i].id)
          if (moduleId === moduleDataList[i].id) {
            console.log('找到模块数据')
            return moduleDataList[i]
          } else if (moduleDataList[i].children.length > 0) {
            moduleData = this.getModuleData(moduleId, moduleDataList[i].children)
            if (moduleData) {
              return moduleData
            }
          }
        }
      },
      // 递归获取nodeChildren所有子节点
      getAllSubModuleId (treeNodeChildren, subModuleIdList) {
        for (var i = 0; i < treeNodeChildren.length; i++) {
          // console.log(`treeNodeChildren[${i}].id: `, treeNodeChildren[i].id)
          subModuleIdList.push(treeNodeChildren[i].id)
          if (treeNodeChildren[i].children.length > 0) {
            this.getAllSubModuleId(treeNodeChildren[i].children, subModuleIdList)
          }
        }
        return subModuleIdList
      },
      onCheckModule (checkedKeys, info) {
        console.log('checkedKeys in onCheckModule: ', checkedKeys)
        // console.log('checkedKeys.checked in onCheckModule: ', checkedKeys.checked)
        console.log('info.node.dataRef.id in onCheckModule:', info.node.dataRef.id)
        this.checkedKeys = checkedKeys;
        console.log('this.checkedModuleIdList in onCheckModule: ', this.checkedModuleIdList)
        console.log('this.selectedRowKeys: ', this.selectedRowKeys)
        const originalCheckedModuleIdList = this.checkedModuleIdList.slice()
        console.log('originalCheckedModuleIdList in onCheckModule: ', originalCheckedModuleIdList)
        console.log('checkedKeys.checked in onCheckModule: ', checkedKeys.checked)
        const moduleId = info.node.dataRef.id
        console.log('moduleId in onCheckModule: ', moduleId)
        // console.log('checkedKeys.checked.includes(parseInt(moduleId)): ', checkedKeys.checked.includes(moduleId))
        // console.log('!originalCheckedModuleIdList.includes(parseInt(moduleId)): ', !originalCheckedModuleIdList.includes(moduleId))
        // 捕获每个节点变化过程，判断checkedKeys.checked和thischeckedModuleIdList对比，判断id是否一个有一个无，有则是变动
        // module树结构之所以用checkStrictly模式，自己重写勾选交互是因为原生交互不满足需求场景，比如模块下没有用例，那么取消勾选模块后，父节不能设为halfChecked，
        // 并且“所有用例”模块勾选变化行为要单独实现
        if (checkedKeys.checked.includes(moduleId) && !originalCheckedModuleIdList.includes(moduleId)) {
            // 当前模块被勾选，则勾选该模块及所有子模块的所有用例
            console.log(`模块module_id: ${moduleId}被勾选，勾选该模块及所有子母快所有用例`)
            // 如果节点id为0（“所有用例”模块），勾选所有模块
            if (moduleId === 0) {
                console.log('选中“所有用例”模块，全部模块勾选')
                this.checkedKeys.checked = Object.keys(this.moduleContainCaseNumberData).map(i => parseInt(i, 0))
                this.checkedModuleIdList = this.checkedKeys.checked
                console.log('checkedKeys.checked in onCheckModule: ', checkedKeys.checked)
                console.log('this.checkedModuleIdList in onCheckModule: ', this.checkedModuleIdList)
            }
            // 获取该模块所有子模块id
            // this.checkedModuleIdList.push(moduleId)
            console.log('this.moduleDataList: ', this.moduleDataList)
            var moduleData = this.getModuleData(moduleId, this.moduleDataList)
            console.log('moduleData: in onCheckModule: ', moduleData)
            var tempSubModuleIdList = [moduleId]
            var subModuleIdList = this.getAllSubModuleId(moduleData.children, tempSubModuleIdList)
            console.log('subModuleIdList after getAllSubModuleId in onCheckModule: ', subModuleIdList)
            // 先判断subModuleIdList中元素是否在this.checkedModuleIdList存在，不存在再push到里面
            for (var sbIndex = 0; sbIndex < subModuleIdList.length; sbIndex++) {
              if (!this.checkedModuleIdList.includes(subModuleIdList[sbIndex])) {
                this.checkedModuleIdList.push(subModuleIdList[sbIndex])
              }
            }
            // this.checkedModuleIdList = Array.from(new Set(this.checkedModuleIdList.concat(subModuleIdList))) // 去重
            this.checkedKeys.checked = this.checkedModuleIdList
            console.log('this.checkedModuleIdList in onCheckModule: ', this.checkedModuleIdList)
            console.log('checkedKeys.checked in onCheckModule: ', checkedKeys.checked)

            // 当前模块被取消勾选，则取消勾选该模块所有用例
          } else if (!checkedKeys.checked.includes(moduleId) && originalCheckedModuleIdList.includes(moduleId)) {
              if (moduleId === 0) {
                  console.log('取消勾选“所有用例”模块，全部模块取消勾选')
                  this.checkedKeys.checked = []
                  this.checkedModuleIdList = []
                  console.log('checkedKeys.checked in onCheckModule: ', checkedKeys.checked)
              }
              // 当前模块被取消勾选，取消勾选该模块及所有子模块所有用例'
              console.log(`模块module_id: ${moduleId}被取消勾选，取消勾选该模块及所有子模块所有用例`)
              console.log('this.moduleDataList: ', this.moduleDataList)
              var delModuleData = this.getModuleData(moduleId, this.moduleDataList)
              console.log('delModuleData: in onCheckModule: ', delModuleData)
              var tempDelSubModuleIdList = [moduleId]
              var delSubModuleIdList = this.getAllSubModuleId(delModuleData.children, tempDelSubModuleIdList)
              console.log('delSubModuleIdList after getAllSubModuleId in onCheckModule: ', delSubModuleIdList)
              console.log('&&&&&this.checkedModuleIdList in onCheckModule: ', this.checkedModuleIdList)
              // 去除module及子moduleid
              for (var smIndex = 0; smIndex < delSubModuleIdList.length; smIndex++) {
                // 先判断下是否有该module_id，有再删除，没有说明已经取消勾选了
                if (this.checkedModuleIdList.includes(delSubModuleIdList[smIndex])) {
                  this.checkedModuleIdList.splice(this.checkedModuleIdList.findIndex(item => item === delSubModuleIdList[smIndex]), 1)
                }
              }
              this.checkedKeys.checked = this.checkedModuleIdList
              console.log('this.checkedModuleIdList in onCheckModule: ', this.checkedModuleIdList)
              console.log('checkedKeys.checked in onCheckModule: ', checkedKeys.checked)
              console.log('##########################')
          }
        // 勾选用例
        if (this.checkedModuleIdList.length > 0) {
          for (var i = 0; i < this.allTestCaseList.length; i++) {
            console.log('this.allTestCaseList[i].module_id: ', this.allTestCaseList[i].module_id)
            if (this.checkedModuleIdList.includes(parseInt(this.allTestCaseList[i].module_id))) {
              console.log('勾选模块包含当前用例，case_id：', this.allTestCaseList[i].id)
              // 先判断this.selectedRowKeys是否包含当前用例id，不包含再push
              if (!this.selectedRowKeys.includes(this.allTestCaseList[i].id)) {
                  console.log('当前用例尚未勾选，设置为勾选状态。')
                  this.selectedRowKeys.push(this.allTestCaseList[i].id)
              }
              // console.log('this.selectedRowKeys: ', this.selectedRowKeys)
            } else {
              console.log('勾选模块不包含当前用例, case_id: ', this.allTestCaseList[i].id)
              if (this.selectedRowKeys.includes(parseInt(this.allTestCaseList[i].id))) {
                  console.log('当前用例id在已选列表中存在')
                  // 先判断this.selectedRowKeys是否包含当前用例id，包含再splice
              if (this.selectedRowKeys.includes(this.allTestCaseList[i].id)) {
                  console.log('当前用例已经勾选，去掉勾选状态。')
                  this.selectedRowKeys.splice(this.selectedRowKeys.findIndex(item => item === this.allTestCaseList[i].id), 1)
              }
                //  console.log('this.selectedRowKeys after splice: ', this.selectedRowKeys)
              }
            }
          }
          console.log('this.selectedRowKeys: ', this.selectedRowKeys)
        } else {
          this.selectedRowKeys = []
        }
        // 根据已选用例，反向勾选module模块checkbox
        var tempModuleContainCaseDict = {}
        // for (var mccnIndex = 0; mccnIndex < Object.keys(this.moduleContainCaseNumberData).length; mccnIndex++) {
        //   tempModuleContainCaseDict[Object.keys(this.moduleContainCaseNumberData)[mccnIndex]] = 0
        // }
        // tempModuleContainCaseDict[0] = this.allTestCaseList.length
        console.log('tempModuleContainCaseDict in onCheckModule: ', tempModuleContainCaseDict)
        if (this.selectedRowKeys.length > 0) {
          // 遍历所有selectRowKeys用例，获取每个模块选中的用例数，与初始数据对比
          for (var srIndex = 0; srIndex < this.selectedRowKeys.length; srIndex++) {
            console.log(`this.selectedRowKeys[${srIndex}]: `, this.selectedRowKeys[srIndex])
            // 从case_id和module_id对应关系对象caseModuleRelationData(后端提供)中获取case_id对应的module_id
            const moduleId = parseInt(this.caseModuleRelationData[this.selectedRowKeys[srIndex]])
            console.log('moduleId in onCheckModule: ', moduleId)
            // 如果temp_module_contain_case_dict中没有该module_id属性，则先给个1
            if (tempModuleContainCaseDict[moduleId] === undefined) {
              tempModuleContainCaseDict[moduleId] = 1
            } else {
              tempModuleContainCaseDict[moduleId] += 1
            }
            console.log('tempModuleContainCaseDict in onCheckModule: ', tempModuleContainCaseDict)
          }
          // 再次遍历tempModuleContainCaseDict，把每个模块对应的用例汇总为包含其所有子模块的用例
          for (var tempModuleId in tempModuleContainCaseDict) {
            const moduleKeyId = parseInt(tempModuleId)
            console.log('moduleKeyId in tempModuleContainCaseDict: ', moduleKeyId)
            // if (moduleKeyId === 0) { continue }
            var moduleKeyData = this.getModuleData(moduleKeyId, this.moduleDataList)
            console.log('moduleKeyData: in onCheckModule: ', moduleKeyData)
            var tempModuleKeySubModuleIdList = []
            var moduleKeySubModuleIdList = this.getAllSubModuleId(moduleKeyData.children, tempModuleKeySubModuleIdList)
            console.log('moduleKeySubModuleIdList after getAllSubModuleId in onCheckModule: ', moduleKeySubModuleIdList)
            // 汇总当前模块_id用例数包含所有子模块id的用例数
            for (let smIndex = 0; smIndex < moduleKeySubModuleIdList.length; smIndex++) {
              // 如果moduleKeySubModuleIdList[smIndex]在tempModuleContainCaseDict.keys中存在则进行汇总
              if (Object.keys(tempModuleContainCaseDict).map(i => parseInt(i, 0)).includes(moduleKeySubModuleIdList[smIndex])) {
                console.log(`tempModuleContainCaseDict.keys包含${moduleKeySubModuleIdList[smIndex]})`)
                console.log(`tempModuleContainCaseDict[${tempModuleId}]: `, tempModuleContainCaseDict[tempModuleId])
                console.log(`tempModuleContainCaseDict[${moduleKeySubModuleIdList[smIndex]}]: `, tempModuleContainCaseDict[moduleKeySubModuleIdList[smIndex]])
                tempModuleContainCaseDict[tempModuleId] += tempModuleContainCaseDict[moduleKeySubModuleIdList[smIndex]]
                console.log(`tempModuleContainCaseDict[${tempModuleId}] after plus add: `, tempModuleContainCaseDict[tempModuleId])
              }
            }
            console.log(`tempModuleContainCaseDict after plus add: `, tempModuleContainCaseDict)
            console.log('this.moduleContainCaseNumberData: ', this.moduleContainCaseNumberData)
          }
        }
        // 对比tempModuleContainCaseDict和moduleContainCaseNumberData
        // 如果相同key的value小于module_contain_case_data，则该key的module_id加入halfChecked;
        // 等于module_contain_case_data，则设为checked
        // if (this.selectedRowKeys.length === 0) {
        //   this.checkedKeys = { 'checked': [], 'halfChecked': [] }
        // }
        console.log('this.checkedKeys.checked in  onCheckModule : ', this.checkedKeys.checked)
        for (const key in tempModuleContainCaseDict) {
          console.log('key in tempModuleContainCaseDict: ', key)
          if (tempModuleContainCaseDict[key] === this.moduleContainCaseNumberData[key]) {
            console.log('模块包含用例数相同，模块应该是checked状态')
            if (!this.checkedKeys.checked.includes(parseInt(key))) {
              console.log('未勾选，设为勾选')
              this.checkedKeys.checked.push(parseInt(key))
            }
            if (this.checkedKeys.halfChecked.includes(parseInt(key))) {
              console.log('halfChecked中包含该module_id，去掉')
              this.checkedKeys.halfChecked.splice(this.checkedKeys.halfChecked.findIndex(item => item === parseInt(key)), 1)
            }
          } else if (tempModuleContainCaseDict[key] < this.moduleContainCaseNumberData[key]) {
             console.log('当前模块所选用例数小于该模块所有用例数，模块应该是halfChecked状态')
            if (!this.checkedKeys.halfChecked.includes(parseInt(key))) {
              console.log('halfChecked未包含该module_id，设为halfChecked')
              this.checkedKeys.halfChecked.push(parseInt(key))
            }
            if (this.checkedKeys.checked.includes(parseInt(key))) {
              console.log('checked中存在该module_id，去掉')
              this.checkedKeys.checked.splice(this.checkedKeys.checked.findIndex(item => item === parseInt(key)), 1)
            }
          }
          console.log('this.checkedKeys in  onCheckModule : ', this.checkedKeys)
        }
        // 检查checked.halfChecked,如果module_id不在tempModuleContainCaseDict的keys中，说明该module_id模块下已经没有选中用例了，去掉halfChecked
        for (let index = 0; index < this.checkedKeys.halfChecked.length; index++) {
          if (!Object.keys(tempModuleContainCaseDict).map(i => parseInt(i, 0)).includes(this.checkedKeys.halfChecked[index])) {
            console.log(`this.checkedKeys.halfChecked中${this.checkedKeys.halfChecked[index]}已经没有勾选用例，去掉halfChecked`)
            this.checkedKeys.halfChecked.splice(this.checkedKeys.halfChecked.findIndex(item => item === this.checkedKeys.halfChecked[index]), 1)
          }
        }
        this.checkedModuleIdList = this.checkedKeys.checked
        console.log('this.checkedKeys in  onCheckModule : ', this.checkedKeys)
        console.log('this.selectedRowKeys: ', this.selectedRowKeys)
        this.setSmokeTestToCaseIdSmokeTestObj()
      },
      onSelectModule (selectedKeys, info) {
        console.log('selectedKeys in onSelectModule:', selectedKeys)
        if (selectedKeys.length > 0) {
          this.selectedKeys = selectedKeys;
        }
        console.log('info.node.dataRef.id in onSelectModule:', info.node.dataRef.id)
        console.log('info.node.dataRef.children in onSelectModule:', info.node.dataRef.children)
        this.module_id = info.node.dataRef.id
        console.log('this.module_id: ', this.module_id)
        this.tree_node_children = info.node.dataRef.children
        // 查询并覆盖testCaseList数据前，先把当前testCaseList中的set_smoke_test属性同步到case_id_smoke_test_obj中
        this.setSmokeTestToCaseIdSmokeTestObj()
        // for (let i = 0; i < this.testCaseList.length; i++) {
        //   if (this.testCaseList[i].set_smoke_test) {
        //     for (let j = 0; j < this.allTestCaseList.length; j++) {
        //       if (this.testCaseList[i].id === this.allTestCaseList[j].id) {
        //         console.log('找到数据并设置set_smoke_test到allTestCaselist')
        //         this.allTestCaseList[j].set_smoke_test = true
        //       }
        //     }
        //   }
        // }
        this.getConfigPlanCaseTestCases()
      },
      setSmokeTestToCaseIdSmokeTestObj () {
        // 查询并覆盖testCaseList数据前，先把当前testCaseList中的set_smoke_test属性同步到case_id_smoke_test_obj中
        console.log('doing set_smoke_test To case_id_smoke_test_obj')
        // 先遍历this.selectRowKeys,获取当前选中的用例号，再遍历this.testCaseList，把每条数据的set_smoke_test赋值到case_id_smoke_test_obj
        console.log('this.selectedRowKeys: ', this.selectedRowKeys)
        for (let i = 0; i < this.selectedRowKeys.length; i++) {
          console.log('this.selectedRowKeys[i]: ', this.selectedRowKeys[i])
          for (let j = 0; j < this.testCaseList.length; j++) {
            if (this.testCaseList[j].id === this.selectedRowKeys[i]) {
              if (this.testCaseList[j].set_smoke_test) {
                this.case_id_smoke_test_obj[this.selectedRowKeys[i]] = true
              } else {
                this.case_id_smoke_test_obj[this.selectedRowKeys[i]] = false
              }
            }
          }
        }
        console.log('this.case_id_smoke_test_obj: ', this.case_id_smoke_test_obj)
      },
      handleCaseLevelSelectChange (value) {
        console.log('value in handleCaseLevelSelectChange of ConfigPlanCase: ', value)
        this.case_level = value
        // 查询并覆盖testCaseList数据前，先把当前testCaseList中的set_smoke_test属性同步到allTestCaseList中
        this.setSmokeTestToCaseIdSmokeTestObj()
        this.getConfigPlanCaseTestCases()
      },
      getCaseList () {
        console.log('in getCaseList of ConfigPlanCase')
      },
      addPlanAssociatedCases () {
        console.log('this.selectedRowKeys in addPlanAssociatedCases: ', this.selectedRowKeys)
        this.setSmokeTestToCaseIdSmokeTestObj()
        const params = {
          associate_case_id_list: [...new Set(this.selectedRowKeys)],
          plan_id: this.plan_id,
          iteration_id: this.iteration_id,
          project_id: this.project_id,
          case_id_smoke_test_obj: this.case_id_smoke_test_obj

        }
        // // 添加用例的信息，便于判断冒烟测试标识
        // const caseData = []
        // for (let i = 0; i < this.allTestCaseList.length; i++) {
        //   if (this.selectedRowKeys.indexOf(this.allTestCaseList[i].id) !== -1) {
        //     caseData.push(this.allTestCaseList[i])
        //   }
        // }
        console.log('params in addPlanAssociatedCases: ', params)
        addPlanAssociatedCases(params).then(res => {
          console.log('关联用例成功')
          this.$emit('queryData')
        }).catch(err => {
          this.$message.error(err.message)
        })
      },
      handleOk () {
        this.addPlanAssociatedCases()
        this.$emit('changeConfigPlanCaseVisible')
      },
      handleCancel () {
        this.$emit('changeConfigPlanCaseVisible')
      },
      init (planId, planName, iterationId) {
        console.log('planId in init of CopyPlanForm.vue: ', planId)
        console.log('planName in init of CopyPlanForm.vue: ', planName)
        console.log('iterationId in init of CopyPlanForm.vue: ', iterationId)
        // this.updateConfigPlanCaseModuleTreeComp = false
        //   // 在组件移除后，重新渲染组件
        //   // this.$nextTick可实现在DOM 状态更新后，执行传入的方法。
        //   this.$nextTick(() => {
        //       this.updateConfigPlanCaseModuleTreeComp = true
        //   })
        this.plan_id = planId
        this.plan_name = planName
        this.iteration_id = iterationId
        this.selectedKeys = [0]
        this.moduleDataList = []
        this.module_id = 0
        this.selectedRowKeys = []
        this.checkedKeys = { 'checked': [], 'halfChecked': [] }
        this.case_id_smoke_test_obj = {}
        this.testCaseList = []
        this.checkedModuleIdList = []
        this.expandedKeys = []
        console.log('this.selectedKeys in init of ConfigPlanCase.vue: ', this.selectedKeys)
        console.log('this.selectedRowKeys in init of ConfigPlanCase.vue: ', this.selectedRowKeys)
        console.log('this.checkedKeys in init of ConfigPlanCase.vue: ', this.checkedKeys)
        console.log('this.testCaseList in init of ConfigPlanCase.vue: ', this.testCaseList)
        console.log('this.checkedModuleIdList in init of ConfigPlanCase.vue: ', this.checkedModuleIdList)
        console.log('this.expandedKeys in init of ConfigPlanCase.vue: ', this.expandedKeys)
        this.queryData()
      },
      // onExpand (expandedKeys) {
      //   console.log('onExpand', expandedKeys);
      //   // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      //   // or, you can remove all expanded children keys.
      //   this.expandedKeys.push(expandedKeys);
      //   console.log('this.expandedKeys:', this.expandedKeys)
      //   this.autoExpandParent = false;
      // },
      // onCheck (checkedKeys) {
      //   console.log('onCheck', checkedKeys);
      //   this.checkedKeys = checkedKeys;
      // },
      changeHasSelected () {
        console.log('in changeHasSelected');
        this.selectedRowKeys = []
        console.log('this.hasSelected:', this.hasSelected)
      },
      cancelSelectKeys () {
        this.selectedRowKeys = []
      },
      onSelectCaseChange (selectedRowKeys, info) {
        console.log('selectedRowKeys in onSelectCaseChange: ', selectedRowKeys);
        this.selectedRowKeys = selectedRowKeys;
        // 处理所有勾选的用例，添加selected属性，值为true
        // if (selectedRowKeys) {
        //   for (let i = 0; i < this.testCaseList.length; i++) {
        //     // console.log('this.testCaseList[i].id: ', this.testCaseList[i].id)
        //     // console.log('selectedRowKeys.indexOf(this.testCaseList[i].id): ', selectedRowKeys.indexOf(this.testCaseList[i].id))
        //     if (selectedRowKeys.indexOf(this.testCaseList[i].id) !== -1) {
        //       this.testCaseList[i].selected = true
        //       console.log('选中：', this.testCaseList[i].id)
        //     } else {
        //       this.testCaseList[i].selected = false
        //     }
        //   }
        // }
      },
      queryData () {
        console.log('in queryData')
        this.getConfigPlanCaseModuleList()
        this.getConfigPlanCaseTestCases('all')
      },
      getConfigPlanCaseTestCases (arg) {
        // this.$message.info('用例查询中。')
        const params = {
          project_id: this.projectId,
          plan_id: this.plan_id,
          iteration_id: this.iteration_id,
          module_id: this.module_id,
          case_title: this.case_title,
          case_level: this.case_level,
          tree_node_children: this.tree_node_children
        }
        console.log('params in getConfigPlanCaseTestCases:', params)
        this.loading = true
        getConfigPlanCaseTestCases(params).then(res => {
          this.testCaseList = res.data
          this.loading = false
          console.log('用例已经查询完')
          if (arg === 'all') {
            this.allTestCaseList = res.data
            // console.log('第一次查询用例，this.allTestCaseList： ', this.allTestCaseList)
          }
          if (this.checkedModuleIdList.includes(this.module_id)) {
            console.log('this.checkedModuleIdList: ', this.checkedModuleIdList)
            console.log('this.checkedModuleIdList.includes(this.module_id): ', this.checkedModuleIdList.includes(this.module_id))
            for (var i = 0; i < this.testCaseList.length; i++) {
              console.log('this.testCaseList[i].id: ', this.testCaseList[i].id)
              this.selectedRowKeys.push(this.testCaseList[i].id)
            }
          }
          // 处理勾选的用例，设为冒烟测试checkbox是否展示
          for (let i = 0; i < this.testCaseList.length; i++) {
              // console.log('this.testCaseList[i].id: ', this.testCaseList[i].id)
              // console.log('selectedRowKeys.indexOf(this.testCaseList[i].id): ', selectedRowKeys.indexOf(this.testCaseList[i].id))
              const dataIndex = this.selectedRowKeys.indexOf(this.testCaseList[i].id)
              if (dataIndex !== -1) {
                this.testCaseList[i].selected = true
                console.log('选中：', this.testCaseList[i].id)
                // 根据this.case_id_smoke_test_obj反向设置冒烟测试checkbox是否勾选
                console.log('this.testCaseList[i].id: ', this.testCaseList[i].id)
                if (this.case_id_smoke_test_obj[this.testCaseList[i].id]) {
                   this.testCaseList[i].set_smoke_test = true
                }
              } else {
                this.testCaseList[i].selected = false
              }
            }
          this.totalPlanCases = res.data.length
          console.log('this.selectedRowKeys  in getConfigPlanCaseTestCases ：', this.selectedRowKeys)
        }).catch(err => {
          this.$message.error(err.message)
        })
      },
      getConfigPlanCaseModuleList () {
        this.tree_loading = true
        const params = {
          project_id: this.projectId,
          plan_id: this.plan_id,
          iteration_id: this.iteration_id
        }
        console.log('params in getPlanConfigCaseModuleList:', params)
        getConfigPlanCaseModuleList(params).then(res => {
          this.moduleDataList = res.data.module_data
          this.moduleContainCaseNumberData = res.data.module_contain_case_data
          this.caseModuleRelationData = res.data.case_module_relation_data
          console.log('this.moduleContainCaseNumberData in getConfigPlanCaseModuleList: ', this.moduleContainCaseNumberData)
          console.log('this.caseModuleRelationData in getConfigPlanCaseModuleList: ', this.caseModuleRelationData)
          console.log('this.moduleDataList in getConfigPlanCaseModuleList of ConfigPlanCase: ', this.moduleDataList)
          // this.checkedKeys = { 'checked': [6, 10, 11], 'halfChecked': [2] }
          this.tree_loading = false
        }).catch(err => {
          this.$message.error(err.message)
        })
      }
      // queryPlanCaseData () {
      //   console.log('in queryPlanCaseData of ConfigPlanCase')
      //   const params = {
      //     module_id: this.module_id,
      //     plan_id: '',
      //     case_title: this.case_title,
      //     case_priority: '',
      //     execute_result: '',
      //     case_level: this.case_level,
      //     case_type: '',
      //     execute_person: '',
      //     tree_node_children: this.tree_node_children
      //   }
      //   console.log('params in queryPlanCaseData:', params)
      //   this.loading = true
      //   getPlanCaseData(params).then(res => {
      //     this.testCaseList = res.data
      //     this.totalPlanCases = res.data.length
      //   }).catch(err => {
      //     this.$message.error(err.message)
      //   }).finally(() => {
      //     this.loading = false
      //   })
      // }
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
