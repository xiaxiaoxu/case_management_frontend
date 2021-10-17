import router from './router'
import store from './store'

import NProgress from 'nprogress' // progress bar
import '@/components/NProgress/nprogress.less' // progress bar custom style
import { setDocumentTitle, domTitle } from '@/utils/domUtil'


NProgress.configure({ showSpinner: false }) // NProgress Configuration

router.beforeEach((to, from, next) => {
  NProgress.start()
  console.log('to.path in beforeEach of case-management-frontend:', to.path)
  // 能进入到用例平台的请求，一定是经过了测试中台登录，这里不需要再次判断是否有token，直接在路由挂载结束后，跳入to.path路由
  // if (localStorage.getItem(ACCESS_TOKEN)) {
  to.meta && (typeof to.meta.title !== 'undefined' && setDocumentTitle(`${to.meta.title} - ${domTitle}`))
  next()
  // }
})

// （异步方法）接收测试中台传送的token，将token保存到本地，然后获取用例平台的路由，并将路由信息挂载在vue-router上
window.addEventListener('message', function (event) {
  console.log('event.data in case-management-frontend addEventListener:')
  console.log(event.data)
  const token = event.data.token
  if (token !== undefined) {
    store.commit('SET_TOKEN', token)
    store.commit('FLASH_TOKEN')
    // 从titan中拿到用例平台的菜单信息
    store.dispatch('GetUserMenu', { platform: 'caseTwo' }).then(res => {
      const menus = res.data
      // 将菜单信息转换为路由表
      store.dispatch('GenerateRoutes', { menus }).then(() => {
        router.addRoutes(store.getters.addRouters)
        NProgress.done()
      })
    })
  }
}, false)

router.afterEach((to) => {
  console.log('to.path in afterEach in case-management-frontend:', to.path)
  console.log('to.query in afterEach in case-management-frontend:', to.query)
  console.log('Object.getOwnPropertyNames(to.query): ', Object.getOwnPropertyNames(to.query))
  // （异步方法）用例平台监听到路由变化，将将路由信息传递给测试中台
  var queryPath = `${to.path}`
  var propertyNames = Object.getOwnPropertyNames(to.query)
  if (to.query) {
    console.log('to.query has more than two attribute')
    for (var i = 0; i < propertyNames.length; i++) {
      if (i === 0) {
        queryPath += `?${propertyNames[i]}=${to.query[propertyNames[i]]}`
      } else {
        queryPath += `&${propertyNames[i]}=${to.query[propertyNames[i]]}`
      }
    }
  } else {
    queryPath = to.path
  }
  console.log('queryPath in case-management-frontend:', queryPath)
  // window.top.postMessage(to.path, to.query)
  window.top.postMessage(queryPath, '*')
  // window.top.postMessage(to.path, '*')
  NProgress.done() // finish progress bar
})
