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
            <span>确认删除模板</span>
            <a-tag color="red" style="font-size: 16px; margin-left: 5px;">
              {{ this.template_name }}
            </a-tag>
            <span>吗？</span>
          </p>
          <p style="color: rgb(170, 170, 170); font-size: 16px;">模板删除后不可恢复，删除模板不会删除使用模板的用例。</p>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { deleteCaseTemplate } from '@/api/case/case_two'

export default {
  name: 'DeleteCase',
  props: {
    deleteTemplateVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      visible: this.deleteTemplateVisible,
      confirmLoading: false,
      template_id: 0,
      template_name: '',
      delete_type: ''
    }
  },
  watch: {
  	// 这一步很关键，此时在父组件修改了组件的props，会同步到组件内对应的props上
  	// 但是不会同步到你刚刚在data对象中创建的 dialog 上
  	// 所以需要再创建一个针对props属性dialogFormVisible的watch（监听）
  	// 当props修改后对应data中的副本dialog 也要同步数据。
    deleteTemplateVisible (val) {
      this.visible = val
    }

  },

  methods: {
    init (templateInfo) {
      console.log('templateInfo in init function: ', templateInfo)
      this.template_id = templateInfo.id
      this.template_name = templateInfo.template_name
    },
    handleOk () {
      const params = {}
      params['template_id'] = this.template_id
      console.log('params in handleCopyMove:', params)
      deleteCaseTemplate(params).then(res => {
        this.$message.success('操作成功')
        this.$emit('changeDeleteTemplateVisible')
        this.$emit('queryData')
      }).catch(err => {
        this.$message.error(err.message)
      }).finally(() => {
        this.confirmLoading = false
      })
    },
    handleCancel () {
      console.log('in handleCancel')
      this.$emit('changeDeleteTemplateVisible')
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
