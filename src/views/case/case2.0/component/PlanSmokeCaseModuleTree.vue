<template>
  <a-spin :spinning="loading" style="height: 200px;">
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
      <template slot="custom_all_case" slot-scope="item" >
        <div style="width: 220px; display: inline-block; background-color: rgba(0,0,0,0~1)">
          <span>{{ item.title }}</span>
        </div>
      </template>
      <template slot="custom" slot-scope="item" >
        <div style="width: 100%; display: inline-block; background-color: rgba(0,0,0,0~1)" @mouseenter="onMouseEnter(item)" @mouseleave="onMouseOut(item)">
          <span>{{ item.title }}</span>
        </div>
      </template>
    </a-tree>
  </a-spin>
</template>
<script>
import { Tree } from 'ant-design-vue'
import { modifyModuleData, getPlanSmokeCaseModuleList } from '@/api/case/module_two'
import DeletePlanDetailModule from './DeletePlanDetailModule.vue'
const { DirectoryTree, TreeNode } = Tree;
export default {
  name: 'PlanSmokeCaseModuleTree',
  props: {
    projectId: {
      type: Number,
      default: 0
    },
    planId: {
      type: Number,
      default: 0
    }
  },
  components: {
    'a-directory-tree': DirectoryTree,
    'a-tree-node': TreeNode,
    DeletePlanDetailModule
  },
  data () {
    return {
      expandedKeys: [],
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: ['0'],
      moduleDataList: [],
      selectCases: [],
      loading: true,
      add_title: '',
      modify_title: '',
      span_title: 'hello',
      add_show: false,
      modify_show: false,
      deleteModuleVisible: false
    };
  },
  watch: {
    checkedKeys (val) {
      console.log('watch-Check:', val);
    }
  },
  created () {
    this.getPlanSmokeCaseModuleList()
  },
  methods: {
    changeDeleteModuleVisible () {
      this.deleteModuleVisible = false
    },
    getPlanSmokeCaseModuleList () {
      const params = {
        plan_id: this.planId
      }
      console.log('params in getPlanSmokeCaseModuleList:', params)
      getPlanSmokeCaseModuleList(params).then(res => {
        this.moduleDataList = res.data
        console.log('this.moduleDataList in getPlanSmokeCaseModuleList: ', this.moduleDataList)
        this.loading = false
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    onExpand (expandedKeys) {
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
      console.log('selectedKeys in onSelect:', selectedKeys)
      // 如果是新增时出发了OnSelect事件，则什么都不做
      this.selectedKeys = selectedKeys;
      console.log('this.selectedKeys in onSelect:', this.selectedKeys)
      const moduleIdFromModuleTree = info.node.dataRef.id
      console.log('info.node.dataRef.id:', info.node.dataRef.id)
      console.log('info.node.dataRef.key')
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
      console.log('removing item')
      console.log('data in remove func: ', data)
      console.log('node id in remove func: ', data.id)
      this.deleteModuleVisible = true
       // 查找节点所有子节点id
      var childNodeIdList = []
      childNodeIdList = this.getChildNodeIdList(childNodeIdList, data)
      this.$refs.deleteModule.init(data, childNodeIdList, this.projectId, this.planId)
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



