<template>
  <div class="tool">
    <div class="page-header">
      <div class="page-header-index-wide">
        <a-breadcrumb>
          <a-breadcrumb-item>tool</a-breadcrumb-item>
          <a-breadcrumb-item v-if="activeKey === 'first'">JSON美化</a-breadcrumb-item>
          <a-breadcrumb-item v-else-if="activeKey === 'second'">YAML在线编辑器</a-breadcrumb-item>
          <a-breadcrumb-item v-else-if="activeKey === 'third'">IP获取</a-breadcrumb-item>
          <a-breadcrumb-item v-else>HTTP状态</a-breadcrumb-item>
        </a-breadcrumb>
      </div>
    </div>
    <div class="ToolList">
      <a-tabs v-model="activeKey" type="card">
        <a-tab-pane key="first" tab="JSON美化">
          <JsonModel></JsonModel>
        </a-tab-pane>
        <a-tab-pane key="second" tab="YAML在线编辑器">
          <YamlModel></YamlModel>
        </a-tab-pane>
        <a-tab-pane key="third" tab="IP获取">
          <IPModel></IPModel>
        </a-tab-pane>
        <a-tab-pane key="fourth" tab="HTTP状态">
          <HttpModel></HttpModel>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
  import JsonModel from './toolComp/JsonModel'
  import YamlModel from './toolComp/YamlModel'
  import IPModel from './toolComp/IPModel'
  import HttpModel from './toolComp/HttpModel'
  export default {
    name: 'ToolList',
    components: {
      JsonModel,
      YamlModel,
      IPModel,
      HttpModel
    },
    data () {
      return {
        activeKey: 'first'
      }
    }
  }
</script>

<style lang="less" scoped>
  .tool {
    margin: -24px -24px 0px;
    .page-header {
      background: #fff;
      padding: 8px 0px 8px 24px;
      border-bottom: 1px solid #e8e8e8;
      border-top: 1px solid #e8e8e8;
      height: 36px;
    }

    .ToolList {
      margin: 24px 24px 24px 24px;

      /deep/ .ant-tabs-nav-container {
        height: 64px !important;
      }

      /deep/ .ant-tabs-nav {
        margin-left: 26px !important;
      }

      /deep/ .ant-tabs {
        background: #fff !important;
      }

      /deep/ .ant-tabs-tab {
        margin-right: 0px !important;
        background: #fff !important;
        border-right: 0px !important;
        border-left: 0px !important;
        border-top: 0px !important;
        border-bottom: 1px solid #e8e8e8 !important;
        height: 64px !important;
        padding: 20px 24px !important;
        line-height: 24px !important;
        font-size: 16px !important;
        color: #000000 !important;
        opacity: 0.54 !important;
        letter-spacing: 0 !important;
        text-align: left !important;
      }

      /deep/ .ant-tabs-tab-active {
        border-bottom: 0px !important;
        border-right: 1px solid #e8e8e8 !important;
        border-left: 1px solid #e8e8e8 !important;
        height: 64px !important;
        color: rgba(0, 0, 0, 0.85) !important;
        opacity: 1 !important;
        letter-spacing: 0 !important;
      }
    }
  }
</style>
