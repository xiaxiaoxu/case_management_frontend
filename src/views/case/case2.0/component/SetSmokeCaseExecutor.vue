<template>
  <div ref="setSmokeCaseExecutor">
    <a-modal
      title="执行人"
      :width="300"
      v-model="visible"
      centered
      @ok="handleOk"
      @cancel="handleCancel"
      :confirmLoading="confirmLoading"
    >
      <div class="table-page-search-wrapper">
        <div style="height: 160px;">
          <a-select
            allowClear
            placeholder="请选择执行人"
            size="large"
            style="width: 80%;"
            @change="handleChange"
            v-model="initialExetorValue"
          >
            <a-select-option v-for="value in memberList" :key="value" :value="value">
              <a-icon type="user" />
              <span style="margin-left: 5px;">{{ value }}</span>
            </a-select-option>
          </a-select>
          <div style="margin-top: 15px; height: 30px; width: 100%; background-color: #F5F5F5">
            <a-icon type="user" style="margin-top: 8px;" />
            <span style="margin-left: 5px; cursor:pointer;" @click="setPlanSmokeCaseExecutorMyself()">{{ this.userNameCn }}</span>
            <span style="margin-left: 5px; color: #bfbfbf;">我自己</span>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { setPlanSmokeCaseExecutor } from '@/api/case/case_two'
import { mapGetters } from 'vuex'

export default {
  name: 'SetSmokeCaseExecutor',
  props: {
    setExecutorVisible: {
      type: Boolean,
      default: false
    },
    memberList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      visible: this.setExecutorVisible,
      confirmLoading: false,
      case_id: 0,
      case_id_list: [],
      execute_person: '',
      plan_case_id: 0,
      plan_cata_data: {},
      initialExetorValue: ''
    }
  },
  watch: {
  	// 这一步很关键，此时在父组件修改了组件的props，会同步到组件内对应的props上
  	// 但是不会同步到你刚刚在data对象中创建的 dialog 上
  	// 所以需要再创建一个针对props属性dialogFormVisible的watch（监听）
  	// 当props修改后对应data中的副本dialog 也要同步数据。
    setExecutorVisible (val) {
      this.visible = val
    }
  },
  created () {
    console.log('in created function')
  },
  computed: {
    ...mapGetters(['lastLoginTime', 'userNameCn', 'nickname', 'avatar'])
  },
  methods: {
    handleChange (value) {
      console.log(`Selected: ${value}`);
      console.log('value:', value)
      console.log('in handleChange')
      const params = {
        plan_case_id_list: this.plan_case_id_list,
        executor: value
      }
      console.log('params in handleChange:', params)
      setPlanSmokeCaseExecutor(params).then(res => {
        this.$emit('setExecutor', this.plan_case_id_list, value)
        this.$emit('changeHasSelected')
      }).catch(err => {
        this.$message.error(err.message)
      })
      this.handleCancel()
    },
    setPlanSmokeCaseExecutorMyself () {
      console.log('in setPlanSmokeCaseExecutorMyself')
      const params = {
        plan_case_id_list: this.plan_case_id_list,
        executor: this.userNameCn
      }
      console.log('params in setPlanSmokeCaseExecutorMyself:', params)
      setPlanSmokeCaseExecutor(params).then(res => {
        this.$emit('setExecutor', this.plan_case_id_list, this.userNameCn)
        this.$emit('changeHasSelected')
        this.handleCancel()
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    init (planCaseIdList) {
      console.log('planCaseIdList in init function: ', planCaseIdList)
      console.log('this.userNameCn: ', this.userNameCn)
      this.plan_case_id_list = planCaseIdList
      this.initialExetorValue = ''
    },
    initTwo (planCaseIdList) {
      console.log('planCaseIdList in initTwo function: ', planCaseIdList)
      console.log('this.userNameCn: ', this.userNameCn)
      this.initialExetorValue = ''
    },
    handleOk () {
      this.handleCancel()
    },
    handleCancel () {
      console.log('in handleCancel')
      this.$emit('changeSetExetorVisible')
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
