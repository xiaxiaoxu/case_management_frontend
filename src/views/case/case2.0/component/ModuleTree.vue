<template>
  <a-spin :spinning="loading">
    <a-tree
      v-model="checkedKeys"
      :expanded-keys="expandedKeys"
      :auto-expand-parent="autoExpandParent"
      :selected-keys="selectedKeys"
      :tree-data="moduleDataList"
      @expand="onExpand"
      @select="onSelect"
      :load-data="onLoadData"
      show-icon
    >
      <a-icon slot="folder-open" type="folder-open" />
      <a-icon slot="folder" type="folder" />
      <template slot="custom_add" slot-scope="item" >
        <div style="width: 220px; display: inline-block; background-color: rgba(0,0,0,0~1)">
          <!--@blur="handleAddModule(item)" -->
          <a-input
            ref="add_input"
            v-show="add_show"
            allowClear
            v-model="add_title"
            @pressEnter="handleAddModule(item)"
            placeholder="请输入"
            size="small"
          />
          <!-- <span v-show="span_show">{{ this.add_title }}</span> -->
          <div v-show="!add_show">{{ item.title }}</div>
        </div>
      </template>
      <template slot="custom_modify" slot-scope="item" >
        <div style="width: 220px; display: inline-block; background-color: rgba(0,0,0,0~1)">
          <!--" -->
          <a-input
            ref="modify_input"
            v-show="modify_show"
            @blur="hiddenModify(item)"
            allowClear
            v-model="modify_title"
            @pressEnter="handleModifyModule(item)"
          />
          <span v-show="!modify_show">{{ item.title }}</span>
          <!-- <div>{{ item.title }}</div> -->
        </div>
      </template>
      <template slot="custom" slot-scope="item" >
        <span style="width: 100%; display: inline-block; background-color: rgba(0,0,0,0~1)" @mouseenter="onMouseEnter(item)" @mouseleave="onMouseOut(item)">
          <span>{{ item.title }}</span>
          <span type="primary" class="but_type">
            <a-tooltip placement="top" v-model="item.tooltipVisible">
              <template slot="title">
                <span>更多</span>
              </template>
              <a-icon
                v-show="item.ellipsisSeen"
                type="ellipsis"
                @click.stop="(e)=> openPopOver(item)"
                style="fontSize: 20px;"
              />
            </a-tooltip>
            <a-popover v-model="item.popoverVisible" placement="bottom" :auto-adjust-overflow="true">
              <template slot="content">
                <p>
                  <a-icon type="plus-circle" />
                  <a style="margin: 10px 50px 10px 10px" @click="()=> append(item)">新建</a>
                </p>
                <p>
                  <a-icon type="edit" />
                  <a style="margin: 10px 50px 10px 10px" @click="()=> edit(item)">编辑</a>
                </p>
                <p>
                  <a-icon type="delete" />
                  <a style="margin: 10px 50px 10px 10px" @click="(e)=> move(item)">移动</a>
                </p>
                <p>
                  <a-icon type="delete" />
                  <a style="margin: 10px 50px 10px 10px" @click="(e)=> remove(item)">删除</a>
                </p>
              </template>
            </a-popover>
          </span>
        </span>
      </template>
    </a-tree>
    <div style="position: absolute; top: -55px; right: 15px;">
      <span @click="appendTreeNode">
        <a-icon style="color: #14C393;" type="plus" />
        <a-button style="margin-left: -12px;" type="link">新建模块</a-button>
      </span>
      <a-tooltip placement="top" >
        <template slot="title">
          <span v-if="!openAllModuleFolderVisible">全部展开</span>
        </template>
        <a-icon v-if="!openAllModuleFolderVisible" style="margin-left: 18px;" type="folder-open" @click="changeOpenAllModuleFolderVisible" />
      </a-tooltip>
      <a-tooltip placement="top" >
        <template slot="title">
          <span v-if="openAllModuleFolderVisible">全部收起</span>
        </template>
        <a-icon v-if="openAllModuleFolderVisible" style="margin-left: 18px;" type="folder" @click="changeOpenAllModuleFolderVisible" />
      </a-tooltip>
      <a-icon v-if="!verticalRightVisible" style="margin-left: 30px;" type="vertical-right" @click="changeVerticalRightVisible" />
      <a-icon v-if="verticalRightVisible" style="margin-left: 30px;" type="vertical-left" @click="changeVerticalRightVisible" />
    </div>
    <DeleteModule
      :deleteModuleVisible="this.deleteModuleVisible"
      ref="deleteModule"
      @changeDeleteModuleVisible="changeDeleteModuleVisible"
      @queryData="getModuleDataListAndTestCAse"
    />
  </a-spin>
</template>
<script>
import { Tree } from 'ant-design-vue'
import { modifyModuleData, addModuleData, getModuleList } from '@/api/case/module_two'
import DeleteModule from './DeleteModule.vue'
const { DirectoryTree, TreeNode } = Tree;
export default {
  name: 'ModuleTree',
  props: {
    projectId: {
      type: Number,
      default: 0
    }
  },
  components: {
    'a-directory-tree': DirectoryTree,
    'a-tree-node': TreeNode,
    DeleteModule
  },
  data () {
    return {
      expandedKeys: [],
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: [],
      moduleDataList: [],
      selectCases: [],
      loading: true,
      add_title: '',
      modify_title: '',
      span_title: 'hello',
      add_show: false,
      modify_show: false,
      openAllModuleFolderVisible: false,
      deleteModuleVisible: false,
      verticalRightVisible: false,
      new_module: {
        title: 'tempTitle',
        key: 'tempKey',
        scopedSlots: { title: 'custom_add', icon: 'folder' },
        ellipsisSeen: false,
        popoverVisible: false,
        tooltipVisible: false,
        parent_module_id: 0,
        isLeaf: true,
        children: [] }
    };
  },
  watch: {
    checkedKeys (val) {
      console.log('watch-Check:', val);
    }
  },
  created () {
    this.getModuleDataList()
  },
  methods: {
    changeDeleteModuleVisible () {
      this.deleteModuleVisible = false
    },
    // 递归获取所有节点id
    getAllNodeId (expandedKeys, moduleDataList) {
      for (let i = 0; i < moduleDataList.length; i++) {
        // console.log('i in getAllNodeId: ', i)
        console.log('moduleDataList[i].id  in getAllNodeId: ', moduleDataList[i].id)
        expandedKeys.push(moduleDataList[i].id)
        if (moduleDataList[i].children) {
          expandedKeys = this.getAllNodeId(expandedKeys, moduleDataList[i].children)
        }
      }
      return expandedKeys
    },
    changeOpenAllModuleFolderVisible () {
      console.log('in changeOpenAllModuleFolderVisible')
      this.openAllModuleFolderVisible = !this.openAllModuleFolderVisible
      if (!this.openAllModuleFolderVisible) {
          this.expandedKeys = []
      } else {
        this.expandedKeys = this.getAllNodeId(this.expandedKeys, this.moduleDataList)
      }
      console.log('this.expandedKeys: ', this.expandedKeys)
    },
    changeVerticalRightVisible () {
      console.log('in changeVerticalRightVisible')
      this.verticalRightVisible = !this.verticalRightVisible
    },
    getModuleDataList () {
      const params = {
        project_id: this.projectId
      }
      console.log('params in getModuleDataList:', params)
      getModuleList(params).then(res => {
        this.moduleDataList = res.data
        this.loading = false
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    getModuleDataListAndTestCAse () {
      const params = {
        project_id: this.projectId
      }
      console.log('params in getModuleDataList:', params)
      getModuleList(params).then(res => {
        this.moduleDataList = res.data
        this.loading = false
        this.$emit('getTestCase')
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    onExpand (expandedKeys) {
      console.log('expandedKeys in onExpand: ', expandedKeys)
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },
    onCheck (checkedKeys, info) {
      console.log('oncheck')
      this.checkedKeys = checkedKeys;
      console.log('info.node.dataRef.isLeaf: ', info.node.dataRef.isLeaf)
      // if (info.node.dataRef.isLeaf) {
      //   const data = { path: info.node.dataRef.suite_path }
      //   this.$emit('getFileContent', data)
      // }
      // 获取选择测试用例
      // this.selectCases = []
      // if (checkedKeys.length >= 0) {
      //     info.checkedNodes.forEach(item => {
      //       const selectCase = { path: item.data.props.suite_path, casename: item.data.props.title, isLeaf: item.data.props.isLeaf }
      //       this.selectCases.push(selectCase)
      //     });
      // }
    },
    onSelect (selectedKeys, info) {
      console.log('this.add_show:', this.add_show)
      // 如果是新增时出发了OnSelect事件，则什么都不做
      if (this.add_show) {
        return
      }
      console.log('onselect')
      this.selectedKeys = selectedKeys;
      const moduleIdFromModuleTree = info.node.dataRef.id
      console.log('info.node.dataRef.id:', info.node.dataRef.id)
      console.log('info.node.dataRef.children: ', info.node.dataRef.children)
      this.$emit('getTestCase', moduleIdFromModuleTree, info.node.dataRef.children)
      this.$emit('changeHasSelected')
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
    openPopOver (data) {
        console.log('open popover and close tooltip');
        data.popoverVisible = true;
        data.tooltipVisible = false;
    },
    append (data) {
      this.add_show = true
    // 添加节点
      const newChild = {
        title: 'tempTitle',
        key: 'tempKey',
        scopedSlots: { title: 'custom_add', icon: 'folder' },
        ellipsisSeen: false,
        popoverVisible: false,
        tooltipVisible: false,
        parent_module_id: data.id,
        isLeaf: true,
        children: [] }
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      data.scopedSlots.icon = 'folder-open'
      data.children.push(newChild)
      console.log('this.treeDataList after append:', this.treeDataList)
      this.expandedKeys.push(data.key)
      this.autoExpandParent = false
      // const params = {}
      // params['parent_module_id'] = data.id
      // params['add_children'] = newChild
      // addModuleData(params)
    },
    appendTreeNode () {
      this.add_show = true
    // 添加节点
      const newNode = {
        title: 'tempTitle',
        key: 'tempKey',
        scopedSlots: { title: 'custom_add', icon: 'folder' },
        ellipsisSeen: false,
        popoverVisible: false,
        tooltipVisible: false,
        parent_module_id: 0,
        isLeaf: true,
        children: [] }
      this.moduleDataList.push(newNode)
      console.log('this.treeDataList after append:', this.treeDataList)
      this.autoExpandParent = false
      // const params = {}
      // params['parent_module_id'] = data.id
      // params['add_children'] = newChild
      // addModuleData(params)
      this.$nextTick(function () {
          // DOM 更新了
          this.$refs.add_input.focus()
        })
    },
    handleAddModule (data) {
      console.log('data.id in handleAddModule: ', data.id)
      if (data.id) {
        console.log('新建模块，id为：', data.id)
        return
      }
      console.log('data:', data)
      console.log('this.add_title:', this.add_title)
      if (this.add_title.trim() === '') {
        console.log('模块名称为空，请输入名称')
        this.$message.error('模块名称为空，请输入名称')
        return
      }
      this.add_show = false
      // this.modify_show = true
      data.title = this.add_title
      data.project_id = this.projectId
      addModuleData(data).then(res => {
        this.getModuleDataList()
        this.add_title = ''
      })
    },
    // 递归获取所有节点id
    getNodeParent (parentNode, nodeList, nodeId) {
      console.log('in getNodeParent')
      // 遍历所有节点，获取节点的children，遍历所有chilren，查看children.id是否等于当前节点的id，是则说明当前节点是父节点
      // 否，则继续遍历所有children的children，同样的逻辑查找节点
      for (let i = 0; i < nodeList.length; i++) {
        console.log('nodeList[i].id  in getNodeParent: ', nodeList[i].id)
        if (nodeList[i].children.length > 0) {
          console.log('nodeList[i].children: ', nodeList[i].children)
          console.log('该节点有children，遍历children')
          const children = nodeList[i].children
          for (let j = 0; j < children.length; j++) {
            console.log('children[j].title: ', children[j].title)
            console.log('children[j].id: ', children[j].id)
            if (children[j].id === nodeId) {
              parentNode = nodeList[i]
              console.log('找到父节点，parenNode.title: ', parentNode.title)
              return parentNode
            } else {
              parentNode = this.getNodeParent(parentNode, children, nodeId)
              if (parentNode !== undefined) {
                return parentNode
              }
            }
          }
        }
      }
    },
    getChildNodeIdList (childNodeIdList, nodeData) {
      console.log('in getChildNodeIdList')
      if (nodeData.children.length > 0) {
        const nodeChildren = nodeData.children
        for (let i = 0; i < nodeChildren.length; i++) {
          childNodeIdList.push(nodeChildren[i].id)
          if (nodeChildren[i].children.length > 0) {
            childNodeIdList = this.getChildNodeIdList(childNodeIdList, nodeChildren[i])
          }
        }
      }
      console.log('childNodeIdList in getChildNodeIdList: ', childNodeIdList)
      return childNodeIdList
    },
    remove (data) {
      console.log('data in remove func: ', data)
      console.log('node id in remove func: ', data.id)
      this.deleteModuleVisible = true
       // 查找节点所有子节点id
      var childNodeIdList = []
      childNodeIdList = this.getChildNodeIdList(childNodeIdList, data)
      // 查找节点的父节点
      for (let i = 0; i < this.moduleDataList.length; i++) {
        // console.log('i in getAllNodeId: ', i)
        console.log('moduleDataList[i].id  in getAllNodeId: ', this.moduleDataList[i].id)
        if (this.moduleDataList[i].id === data.id) {
          console.log('在第一层节点找到该module，父节点为空')
          const parentNode = undefined
          this.$refs.deleteModule.init(data, parentNode, childNodeIdList, this.projectId)
          return
        }
      }
      var parentNode = ''
      parentNode = this.getNodeParent(parentNode, this.moduleDataList, data.id)
      console.log('parentNode in remove: ', parentNode)
      this.$refs.deleteModule.init(data, parentNode, childNodeIdList, this.projectId)
    },
    move (data) {
      console.log('移动模块，模块信息：', data)
      this.$emit('openMoveModuleWindow', data)
    },
    edit (data) {
      console.log('this.moduleDataList when edit:', this.moduleDataList)
      this.modify_show = true
      this.modify_title = data.title
      data.scopedSlots.title = 'custom_modify'
      // setTimeout(() => {
      //   this.$refs.modify_input.focus()
      // }, 1500)
      this.$nextTick(function () {
          // DOM 更新了
          this.$refs.modify_input.focus()
        })
    },
    handleModifyModule (data) {
      console.log('编辑模块，id为：', data.id)
      this.modify_show = false
      data.title = this.modify_title
      console.log('data in handleModifyModule:', data)
      console.log('this.modify_title:', this.modify_title)
      modifyModuleData(data).then(res => {
        this.getModuleDataList()
        this.modify_title = ''
      })
    },
    hiddenModify (data) {
      console.log('in hiddenModify:')
      this.modify_show = false
      // 重新渲染
      data.scopedSlots.title = 'custom'
      data.popoverVisible = false
    },
    onMouseEnter (data) {
      console.log('data in onMouseEnter:', data)
      data.ellipsisSeen = true
      // console.log('data.ellipsisSeen:', data.ellipsisSeen)
    },
    onMouseOut (data) {
      console.log('in onMouseOut')
      data.ellipsisSeen = false
      // console.log('data.ellipsisSeen:', data.ellipsisSeen)
    }
  }
};
</script>
<style lang="less" scoped>
  /deep/ .ant-tree-node-content-wrapper{
      width: 95%;
      white-space: nowrap;
      // text-overflow: ellipsis;
      overflow: hidden;
    }

  /deep/ .ant-tree li .ant-tree-node-content-wrapper.ant-tree-node-selected {
    background-color: #d2eafb;
    height: 36px;
    padding-top: 5px;
  }
   /deep/ .ant-tree li .ant-tree-node-content-wrapper{
    // background-color: #d2eafb;
    height: 35px;
    // position: relative;
    // left: -5px;
    // top: 5px;
    padding-top: 5px;
    padding-left: 0px;
  }
  /deep/ .ant-tree li .ant-tree-node-content-wrapper.ant-tree-node {
    background-color: red;
    padding: 5px;
  }
  /deep/ .ant-tree li  {
    padding: 1px;
  }

  .but_type {
      position: absolute;
      right: 20px;
      margin-top: 2px;
      // width: 10px;
      // text-align: right;
    }

  .active{
    margin-right: 5px;
  }

  .title_tag {
    font-weight: bold;
    color: white;
  }
</style>



