// eslint-disable-next-linestf/device
import { BasicLayout } from '@/layouts'
import * as icons from '@/core/icons'

/**
 *添加vue页面映射，能在直接constantRouterComponents变量添加。
 * 如果添加PageView, RouteView则需要方法在addConstantRouterComponents添加
 */
// 前端路由表
var constantRouterComponents = {
  // 基础页面 layout 必须引入
  '403': () => import(/* webpackChunkName: "error" */ '@/views/common/exception/403'),
  '404': () => import(/* webpackChunkName: "error" */ '@/views/common/exception/404'),
  '500': () => import(/* webpackChunkName: "error" */ '@/views/common/exception/500'),

  // 你需要动态引入的页面组件
  // 用例平台2.0
  // '/case/caseTwo': () => import('@/views/case/case2.0/ProjectList'),
  '/case/caseTwo/project/list': () => import('@/views/case/case2.0/ProjectList'),
  '/case/caseTwo/testVersion/list': () => import('@/views/case/case2.0/TestVersionList'),
  '/case/caseTwo/plan/list': () => import('@/views/case/case2.0/PlanList'),
  '/case/caseTwo/plan/detail': () => import('@/views/case/case2.0/PlanDetail'),
  '/case/caseTwo/autoCase/list': () => import('@/views/case/case2.0/AutoCaseList'),
  '/case/caseTwo/setting': () => import('@/views/case/case2.0/Setting'),
  '/case/caseTwo/project/projectManager': () => import('@/views/case/case2.0/ProjectManager'),
  '/case/caseTwo/testCase/list': () => import('@/views/case/case2.0/CaseList'),
  '/case/caseTwo/testCase/detail': () => import('@/views/case/case2.0/CaseDetail'),
  // exception
  'Exception403': () => import(/* webpackChunkName: "fail" */ '@/views/common/exception/403'),
  'Exception404': () => import(/* webpackChunkName: "fail" */ '@/views/common/exception/404'),
  'Exception500': () => import(/* webpackChunkName: "fail" */ '@/views/common/exception/500')
}

// 前端路由name
const constantRouterName = {
  // 用例平台2.0
  // '/case/caseTwo': 'caseTwo',
  '/case/caseTwo/project/list': 'caseTwoProjectList',
  '/case/caseTwo/testVersion/list': 'caseTwoTestVersionList',
  '/case/caseTwo/plan/list': 'caseTwoPlanList',
  '/case/caseTwo/plan/detail': 'caseTwoPlanDetail',
  '/case/caseTwo/autoCase/list': 'caseTwoAutoCaseList',
  '/case/caseTwo/setting': 'caseTwoSetting',
  '/case/caseTwo/project/projectManager': 'caseTwoProjectManager',
  '/case/caseTwo/testCase/list': 'caseTwoTestCaseList',
  '/case/caseTwo/testCase/detail': 'caseTwoTestCaseDetail'
}

// 前端路由重定向
const constantRouterRedirect = {
  '/': '/case/caseTwo/project/list'
}

// 前端路由隐藏  '/case/caseTwo/testCase/list'
const routerHiddenList = ['/case/caseTwo/project/projectManager', '/case/caseTwo/project/list', '/case/caseTwo/plan/list', '/case/caseTwo/plan/detail', '/case/caseTwo/testCase/detail', '/adminMenu/industryDynamics/detail']

/**
 * 直接在constantRouterComponents添加layout，不能正常加载，延迟加载
 */
const addConstantRouterComponents = () => {
  constantRouterComponents['/'] = BasicLayout
  // 用例平台2.0
  // constantRouterComponents['/case/caseTwo/project/list'] = RouteView
  // constantRouterComponents['/case/caseTwo/project/projectManager'] = RouteView
  // constantRouterComponents['/case/caseTwo/testCase/list'] = RouteView
  // constantRouterComponents['/case/caseTwo/testCase/detail'] = RouteView
}

// 前端未找到页面路由（固定不用改）
const notFoundRouter = {
  path: '*', redirect: '/404', hidden: true
}

// 根级菜单
const rootRouter = {
  name: 'index',
  path: '/',
  meta: {
    title: '首页'
  },
  children: []
}

/**
 * 动态生成菜单
 * @param menus
 * @returns {Promise<Router>}
 */
export const generatorDynamicRouter = (menus) => {
  addConstantRouterComponents()
  return new Promise((resolve, reject) => {
      const menuNav = []
      rootRouter.children = menus[0]['children']
      menuNav.push(rootRouter)
      console.log('menuNav:', menuNav)
      const routers = generator(menuNav)
      routers.push(notFoundRouter)
      console.log('routers:', routers)
      resolve(routers)
  })
}

/**
 * 格式化树形结构数据 生成 vue-router 层级路由表
 *
 * @param routerMap
 * @param parent
 * @returns {*}
 */
export const generator = (routerMap, parent) => {
  return routerMap.map(item => {
    const title = item.name
    const icon = item.icon
    const path = item.path
    const currentRouter = {
      // 如果路由设置了 url，则作为默认 path
      path: path,
      // 路由名称，必须唯一
      name: (constantRouterName[path]) || (item.name),
      // 该路由对应页面的 组件 :方案1
      // component: constantRouterComponents[item.name],
      // 该路由对应页面的 组件 :方案2 (动态加载)
      component: (constantRouterComponents[path]) || (() => import(`@/views/${path}`)),
      // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
      meta: {
        title: title,
        icon: icons[icon] || icon,
        permission: item.permission_code
      }
    }
    // 是否设置了隐藏菜单
    if (routerHiddenList.includes(path)) {
      currentRouter.hidden = true
    }
    // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
    if (!currentRouter.path.startsWith('http')) {
      currentRouter.path = currentRouter.path.replace('//', '/')
    }
    // 重定向
    constantRouterRedirect[path] && (currentRouter.redirect = constantRouterRedirect[path])
    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
      // Recursion
      currentRouter.children = generator(item.children, currentRouter)
    }
    return currentRouter
  })
}


