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
          <p style="font-size: 16px;">
            确认删除测试版本
            <a-tag color="red" style="font-size: 16px;">
              {{ this.test_version_name }}
            </a-tag>
            吗？
          </p>
          <p style="color: rgb(170, 170, 170); font-size: 16px;">测试版本删除后不可恢复，删除后会一起删除测试版本下的story及相关数据。</p>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { deleteTestVersion } from '@/api/case/test_version'

export default {
  name: 'DeleteTestVersion',
  props: {
    deleteTestVersionVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      visible: this.deleteTestVersionVisible,
      confirmLoading: false,
      test_version_id: 0,
      test_version_name: ''
    }
  },
  watch: {
  	// 这一步很关键，此时在父组件修改了组件的props，会同步到组件内对应的props上
  	// 但是不会同步到你刚刚在data对象中创建的 dialog 上
  	// 所以需要再创建一个针对props属性dialogFormVisible的watch（监听）
  	// 当props修改后对应data中的副本dialog 也要同步数据。
    deleteTestVersionVisible (val) {
      this.visible = val
    }

  },

  methods: {
    init (testVersionId, testVersionName) {
      console.log('testVersionId init function of deleteTestVersion: ', testVersionId)
      console.log('testVersionName init function of deleteTestVersion: ', testVersionName)
      this.test_version_id = testVersionId
      this.test_version_name = testVersionName
    },
    handleOk () {
      const params = {}
      params['test_version_id'] = this.test_version_id
      console.log('params in deleteTestVersion:', params)
      deleteTestVersion(params).then(res => {
        this.$emit('changeDeleteTestVersionVisible')
        this.$message.success('操作成功')
        this.$emit('queryData')
      }).catch(err => {
        this.$message.error(err.message)
      }).finally(() => {
        this.confirmLoading = false
      })
    },
    handleCancel () {
      console.log('in handleCancel')
      this.$emit('changeDeleteTestVersionVisible')
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
