<template>
  <div class="YamlModel">
    <div class="yaml-btn">
      <a-button @click="yamlformdata" class="btn-change">YAML转换</a-button>
      <a-button @click="cleardata" class="btn-clear">清空</a-button>
    </div>
    <div class="yaml-body">
      <a-textarea placeholder="请输入YAML" v-model="inputVal" class="text-input"/>
      <a-textarea placeholder="YAML转换结果" v-model="outputVal" class="text-output"/>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'YamlModel',
    data () {
      return {
        inputVal: '',
        outputVal: ''
      }
    },
    methods: {
      yamlformdata () {
        const yaml = require('js-yaml');
        // eslint-disable-next-line no-unused-vars
        const fs = require('fs');

        try {
          const obj = yaml.safeLoad(this.inputVal, 'utf-8');
          this.outputVal = JSON.stringify(obj, null, 4);
        } catch (err) {
          console.log(err);
          this.outputVal = String(err);
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
  .YamlModel {
    .yaml-btn {
      .btn-change {
        background: #14C393;
        color: #FFFFFF;
        margin-left:24px;
      }
      .btn-clear {
        margin-left:8px;
      }
    }
    .yaml-body {
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
