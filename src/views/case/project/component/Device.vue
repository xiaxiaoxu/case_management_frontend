<template>
  <div
    class="device"
    :class="{'selected': this.isSelected, 'disable': (!deviceData.present || deviceData.nickname)}"
    @click="selectItem"
  >
    <div class="device-content">
      <div class="device-title">{{ `${deviceData.brand}  ${deviceData.alias}` }}</div>
      <div class="device-properties">
        <!-- <p>型号：{{ deviceData.properties.model }}</p>
        <p>版本：{{ deviceData.properties.version }}</p> -->
        型号：{{ deviceData.properties.model }}<br>
        版本：{{ deviceData.properties.version }}
      </div>
    </div>
    <div class="device-footer">
      <a-icon a-icon type="check-circle" class="icon-circle" :class="{'icon-selected':this.isSelected,'icon-disabled':!this.isSelected}"></a-icon>
      <div v-if="deviceData.present" class="phone-status">
        {{ deviceData.using ? '占用中' : '空闲中' }}
      </div>
      <div v-else class="phone-status">
        已离线
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    // eslint-disable-next-line vue/require-prop-types
    props: ['deviceData'],
    data () {
      return {
        isSelected: false
      }
    },
    watch: {
      deviceData () {
        this.deviceData.isSelected = this.isSelected
      }
    },
    methods: {
      selectItem () {
        // 离线或者占用中不可点击
        if (!this.deviceData.present || this.deviceData.nickname) {
          return
        }
        this.isSelected = !this.isSelected
        this.deviceData.isSelected = this.isSelected
        this.$emit('selectDevice')
      }
    }
  }
</script>

<style lang="less" scoped>
  .device {
    width: 225px;
    height: 115px;
    border: 1px solid rgba(0,0,0,0.09);
    border-radius: 2px;
    margin-left: 16px;
    margin-bottom: 16px;
    display: inline-block;
    cursor: pointer;
    .device-content {
      width: 100%;
      padding: 8px 16px;
      border-bottom: 1px solid rgba(0,0,0,0.09);
      .device-title {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        font-size: 16px;
        color: #000000;
        line-height: 24px;
        margin-bottom: 8px;
      }
      .device-properties {
        opacity: 0.45;
        font-size: 12px;
        color: #000000;
        line-height: 16px;
      }
    }
    .device-footer {
      width: 100%;
      padding: 8px 16px;
      .icon-circle {
        width: 16px;
        height: 16px;
        float: left;
        margin-top: 4px;
      }
      .icon-selected {
        color: #52c41a;
      }
      .icon-disabled {
        color: #9FAAC4;
      }
      .phone-status {
        height: 20px;
        margin-left: 7px;
        float: left;
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: #9FAAC4;
      }
    }
    &.selected {
      border: 1px solid #14C393;
    }
    &.disable {
      cursor: not-allowed;
      pointer-events: none;
    }
  }
</style>
