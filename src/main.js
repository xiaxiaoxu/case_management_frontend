// with polyfills
import 'core-js/stable'
import 'regenerator-runtime/runtime'
import { Collapse, Pagination, Tree, TreeSelect, Empty, FormModel } from 'ant-design-vue'
import 'ant-design-vue/lib/collapse/style/css'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import { VueAxios } from './utils/request'

// mock
// WARNING: `mockjs` NOT SUPPORT `IE` PLEASE DO NOT USE IN `production` ENV.
// import './mock'

import bootstrap from './core/bootstrap'
import './core/lazy_use'
import './permission' // permission control
import './utils/filter' // global filter
import './components/global.less'
import { Dialog } from '@/components'
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/index.css'
// import { Empty } from 'node_modules/ant-design-vue/types/empty'

Vue.config.productionTip = false
Vue.component(Collapse.name, Collapse)
Vue.component(Collapse.Panel.name, Collapse.Panel)
Vue.component(Pagination.name, Pagination)
Vue.component(Tree.name, Tree)
Vue.component(TreeSelect.name, TreeSelect)
Vue.component(Empty.name, Empty)
Vue.component(FormModel.name, FormModel)
Vue.component(FormModel.Item.name, FormModel.Item)
// mount axios Vue.$http and this.$http
Vue.use(VueAxios)
Vue.use(Dialog)
Vue.use(VXETable)
new Vue({
  router,
  store,
  created: bootstrap,
  render: h => h(App)
}).$mount('#app')
