<template>
  <a-spin :spinning="loading">
    <a-directory-tree
      checkable
      v-model="checkedKeys"
      :expanded-keys="expandedKeys"
      :auto-expand-parent="autoExpandParent"
      :selected-keys="selectedKeys"
      :tree-data="subProjectDirList"
      @expand="onExpand"
      @select="onSelect"
      @check="onCheck"
      :load-data="onLoadData"
    />
  </a-spin>
</template>
<script>
import { subProjectDir, getSuite } from '@/api/case/project'
import { Tree } from 'ant-design-vue'
const { DirectoryTree, TreeNode } = Tree;
export default {
  name: 'CaseTree',
  props: {
    projectName: {
      type: String,
      default: ''
    },
    projectPath: {
      type: String,
      default: ''
    },
    parentName: {
      type: String,
      default: ''
    }
  },
  components: {
    'a-directory-tree': DirectoryTree,
    'a-tree-node': TreeNode
  },
  data () {
    return {
      expandedKeys: [],
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: [],
      subProjectDirList: [],
      selectCases: [],
      loading: true
    };
  },
  watch: {
    checkedKeys (val) {
      console.log('watch-Check:', val);
    }
  },
  created () {
    this.getSubProjectDir()
    this.$emit('clearFileContent')
  },
  methods: {
    onExpand (expandedKeys) {
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },
    onCheck (checkedKeys, info) {
      console.log('oncheck')
      this.checkedKeys = checkedKeys;
      if (info.node.dataRef.isLeaf) {
        const data = { path: info.node.dataRef.suite_path }
        this.$emit('getFileContent', data)
      }
      // 获取选择测试用例
      this.selectCases = []
      if (checkedKeys.length >= 0) {
          info.checkedNodes.forEach(item => {
            const selectCase = { path: item.data.props.suite_path, casename: item.data.props.title, isLeaf: item.data.props.isLeaf }
            this.selectCases.push(selectCase)
          });
      }
    },
    onSelect (selectedKeys, info) {
      console.log('onselect')
      this.selectedKeys = selectedKeys;
      if (this.matchFileType(info.node.dataRef.key) || info.node.dataRef.isLeaf) {
          const data = {}
          if (info.node.dataRef.isLeaf) {
            data['path'] = info.node.dataRef.suite_path;
          } else {
            data['path'] = info.node.dataRef.key;
          }
         this.$emit('getFileContent', data)
      } else {
        this.$emit('clearFileContent')
      }
    },
    onLoadData (treeNode) {
      return new Promise(resolve => {
        if (treeNode.dataRef.children) {
          resolve();
          return;
        }
        getSuite({ path: treeNode.dataRef.key }).then(res => {
          treeNode.dataRef.children = res.data.testcases
          this.subProjectDirList = [...this.subProjectDirList]
          resolve();
        }).catch(err => {
          this.$message.error(err.message)
        })
      });
    },
    getSubProjectDir () {
      subProjectDir({ path: this.projectPath, name: this.projectName }).then(res => {
        this.subProjectDirList = res.data
        this.loading = false
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    matchFileType (fileName) {
      // 后缀获取
      var suffix = '';
      // 获取类型结果
      var result = false;
      try {
        var flieArr = fileName.split('.');
        suffix = flieArr[flieArr.length - 1];
      } catch (err) {
        suffix = '';
      }
      // fileName无后缀返回 false
      if (!suffix) {
        return false;
      }
      // 匹配txt
      var txtlist = ['txt', 'robot'];
      result = txtlist.some(function (item) {
        return item === suffix.toLowerCase();
      });
      return result;
    }
  }
};
</script>
<style lang="less" scoped>
  /deep/ .ant-tree-node-content-wrapper{
    width: 95%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
</style>



