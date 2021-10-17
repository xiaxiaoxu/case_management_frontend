<template>
  <div ref="deleteModal">
    <a-modal
      title="确认删除"
      :width="670"
      :getContainer="()=>$refs.deleteModal"
      v-model="visible"
      centered
      @ok="handleOk"
      @cancel="handleCancel"
      :confirmLoading="confirmLoading"
    >
      <div class="table-page-search-wrapper">
        <div style="width: 100%; height: 100px; overflow-x: hidden">
          <p v-if="this.delete_type !== 'multiple'" style="font-size: 16px;">{{ `确认删除该用例么？` }}</p>
          <p v-if="this.delete_type === 'multiple'" style="font-size: 16px;">{{ `确认删除选择的${case_id_list.length}个用例么？` }}</p>
          <p style="color: rgb(170, 170, 170); font-size: 16px;">删除后会一起删除测试计划内执行用例，可以通过设置内的回收站进行恢复。。</p>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { deleteTestCase } from '@/api/case/case_two'

export default {
  name: 'DeleteCase',
  props: {
    deleteCaseVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      visible: this.deleteCaseVisible,
      confirmLoading: false,
      case_id: 0,
      case_id_list: [],
      delete_type: ''
    }
  },
  watch: {
  	// 这一步很关键，此时在父组件修改了组件的props，会同步到组件内对应的props上
  	// 但是不会同步到你刚刚在data对象中创建的 dialog 上
  	// 所以需要再创建一个针对props属性dialogFormVisible的watch（监听）
  	// 当props修改后对应data中的副本dialog 也要同步数据。
    deleteCaseVisible (val) {
      this.visible = val
    }

  },

  methods: {
    deleteTestCase (caseIdList) {
      console.log('in deleteTestCase')
      console.log('caseIdList in deleteTestCase:', caseIdList)
      const params = {
        case_id_list: caseIdList
      }
      deleteTestCase(params).then(res => {
        const code = res.code
          if (code === 0) {
            this.$message.success('数据已删除')
            this.queryData()
          }
        }).catch(err => {
          this.$message.error(err.message)
        })
    },
    init (caseIdList, type) {
      console.log('in init function ')
      console.log('type in init: ', type)
      this.delete_type = type
      this.case_id_list = caseIdList
      console.log(`caseIdList: ${caseIdList}`)
    },
    handleOk () {
      const params = {}
      params['operation'] = this.operation
      params['project_id'] = this.project_id
      params['case_id_list'] = this.case_id_list
      params['module_id'] = this.module_id
      console.log('params in handleCopyMove:', params)
      deleteTestCase(params).then(res => {
        this.$message.success('操作成功')
        this.$emit('changeDeleteCaseVisible')
        this.$emit('changeHasSelected')
        this.$emit('queryData')
      }).catch(err => {
        this.$message.error(err.message)
      }).finally(() => {
        this.confirmLoading = false
      })
    },
    handleCancel () {
      console.log('in handleCancel')
      this.$emit('changeDeleteCaseVisible')
    }
  }
}

</script>

<style lang="less" scoped>
/deep/ .ant-tree-node-content-wrapper{
    width: 95%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
</style>
