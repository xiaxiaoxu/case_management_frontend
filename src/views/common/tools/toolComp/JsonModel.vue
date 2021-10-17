<template>
  <div class="JsonModel">
    <div class="json-btn">
      <a-button @click="jsonformdata" class="btn-change">JSON转化</a-button>
      <a-button @click="cleardata" class="btn-clear">清空</a-button>
    </div>
    <div class="json-body">
      <a-textarea placeholder="请输入JSON" v-model="inputVal" class="text-input"/>
      <a-textarea placeholder="JSON转化结果" v-model="outputVal" class="text-output"/>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'JsonModel',
    data () {
      return {
        inputVal: '',
        outputVal: ''
      }
    },
    methods: {
      jsonformdata () {
        // 格式化json字符串
        try {
          this.outputVal = JSON.parse(this.inputVal);
          this.outputVal = JSON.stringify(
            this.outputVal,
            null,
            4
          );
        } catch (err) {
          this.outputVal = String(err);
          this.$message.warning('json格式错误');
        }
      },
      cleardata () {
        this.inputVal = ''
        this.outputVal = ''
      }
    }
  }
</script>

<style lang="less" scoped>
  .JsonModel {
    .json-btn {
      .btn-change {
        background: #14C393;
        color: #FFFFFF;
        margin-left:24px;
      }
      .btn-clear {
        margin-left:8px;
      }
    }
    .json-body {
      display: inline-flex;
      width:100%;
      margin-top: 16px;
      margin-bottom:24px;
      .text-input {
        height:550px;
        width:48%;
        margin-left:24px;
      }
      .text-output {
        height:550px;
        width:47%;
        margin-left:4%;
        margin-right:24px;
      }
    }
  }
</style>
