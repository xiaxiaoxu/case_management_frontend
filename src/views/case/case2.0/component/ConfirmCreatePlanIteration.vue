<template>
  <div ref="confirmCreatePlanIteration">
    <a-modal
      title="确认创建迭代"
      :width="670"
      v-model="visible"
      style="top: 120px;"
      @ok="handleOk"
      @cancel="handleCancel"
      :confirmLoading="confirmLoading"
    >
      <div class="table-page-search-wrapper">
        <div style="width: 100%; height: 100px; overflow-x: hidden">
          <p>确认创建新迭代么？</p>
          <p>创建新迭代后，已有迭代数据将被冻结，迭代状态自动转为'已完成'。</p>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>

export default {
  name: 'ConfirmCreatePlanIteration',
  props: {
    confirmCreatePlanIterationVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      visible: this.confirmCreatePlanIterationVisible,
      confirmLoading: false
    }
  },
  watch: {
  	// 这一步很关键，此时在父组件修改了组件的props，会同步到组件内对应的props上
  	// 但是不会同步到你刚刚在data对象中创建的 dialog 上
  	// 所以需要再创建一个针对props属性dialogFormVisible的watch（监听）
  	// 当props修改后对应data中的副本dialog 也要同步数据。
    confirmCreatePlanIterationVisible (val) {
      this.visible = val
    }

  },

  methods: {
    handleOk () {
      this.$emit('changeConfirmCreatePlanIterationVisible')
      this.$emit('addIterationTab')
    },
    handleCancel () {
      console.log('in handleCancel')
      this.$emit('changeConfirmCreatePlanIterationVisible')
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
