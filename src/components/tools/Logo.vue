<template>
  <div class="logo">
    <router-link :to="{name:'dashboard'}">
      <!--      <LogoSvg alt="logo" />-->
      <!--      <h1 v-if="showTitle">测试中台</h1>-->
    </router-link>
  </div>
</template>

<script>
import LogoSvg from '@/assets/logo.svg?inline'

export default {
  name: 'Logo',
  components: {
    LogoSvg
  },
  props: {
    title: {
      type: String,
      default: '测试中台',
      required: false
    },
    showTitle: {
      type: Boolean,
      default: true,
      required: false
    }
  }
}
</script>
