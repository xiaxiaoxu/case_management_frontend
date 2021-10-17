<template>
  <div class="IPModel">
    <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol" style="width:100%;">
      <a-form-model-item label="IP地址：">
        <a-input v-model="form.ip" placeholder="请输入IP地址" style="width: 278px;"/>
        <a-button @click="ipcheckup" style="margin-left: 10px;">
          查询
        </a-button>
      </a-form-model-item>
      <a-form-model-item label="结果：">
        <a-input v-model="form.result" type="textarea" style="height: 210px;" />
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
  import * as toolApi from '@/api/common/tool'
  export default {
    name: 'IPModel',
    data () {
      return {
        labelCol: { span: 1, offset: 0 },
        wrapperCol: { span: 20 },
        form: {
          ip: '',
          result: ''
        }
      }
    },
    methods: {
      ipcheckup () {
      if (this.form.ip === '') {
        this.$message.warning('ip为空,请重新输入');
        return;
      }

      toolApi
        .getIpInfo({
          ip: this.form.ip
        })
        .then(res => {
          console.log(res.data.address_detail)
          const address = '地址：' + res.data.address + '\r\n'
          const detailAddress = '详细地址：' + JSON.stringify(res.data.address_detail) + '\r\n'
          const point = '横坐标：' + res.data.point.x + '  纵坐标：' + res.data.point.y
          this.form.result = address + detailAddress + point
        })
        .catch(err => {
          this.$message.error(err);
          this.form.result = '查询无数据'
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .IPModel {
    margin-left: 24px;
    margin-right: 24px;
    /deep/ .ant-form-item-label {
      width: 56px;
    }
  }
</style>

