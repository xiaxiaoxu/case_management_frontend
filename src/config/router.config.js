// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'
import { dashboard, cloudTest, quality, testcase, backend } from '@/core/icons'

export const asyncRouterMap = [

  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: '/dashboard',
    children: [
      // dashboard
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/common/dashboard/Index'),
        meta: { title: 'DashBoard', keepAlive: true, icon: dashboard }
      },
      // 云测平台
      {
        path: '/stf',
        name: 'stf',
        component: PageView,
        redirect: '/stf/device',
        meta: { title: '云测平台', keepAlive: true, icon: cloudTest },
        children: [
          {
            path: '/stf/device',
            name: 'StfDevice',
            component: RouteView,
            meta: { title: '云机管理' },
            redirect: '/stf/device/DeviceList',
            children: [
              {
                path: '/stf/device/DeviceList',
                name: 'StfDeviceList',
                component: () => import('@/views/stf/device/DeviceList'),
                meta: { title: '云真机' }
              },
              // {
              //   path: '/stf/borrow',
              //   name: 'borrowDevice',
              //   component: () => import('@/views/stf/device/DeviceOrder'),
              //   meta: { title: '设备出借' }
              // },
              {
                path: '/stf/companydevice',
                name: 'companydevice',
                component: () => import('@/views/stf/device/companydevice'),
                meta: { title: '手机列表' }
              }
            ]
          },
          {
            path: '/stf/auto',
            name: 'StfTask',
            component: RouteView,
            meta: { title: '云自动化' },
            redirect: '/stf/auto/app/list',
            children: [
              {
                path: '/stf/auto/app/list',
                name: 'StfAutoAppList',
                component: () => import('@/views/stf/auto/app/AppList'),
                meta: { title: '应用管理' }
              },
              {
                path: '/stf/auto/task/add',
                name: 'StfAutoTaskAdd',
                component: () => import('@/views/stf/auto/task/TaskAdd'),
                meta: { title: '创建任务' }
              },
              {
                path: '/stf/auto/task/report',
                name: 'StfAutoTaskList',
                component: () => import('@/views/stf/auto/report/TestReport'),
                meta: { title: '查看报告' }
              }
            ]
          }
        ]
      },
      // android 设备页面
      {
        path: '/stf/machine/android/:udid',
        name: 'machineinfo_android',
        hidden: true,
        component: () => import('@/views/stf/device/androidpage'),
        meta: { title: 'android设备页面' }
      },
      // IOS 设备页面
      {
        path: '/stf/machine/ios/:udid',
        name: 'machineinfo_ios',
        hidden: true,
        component: () => import('@/views/stf/device/IOSPage'),
        meta: { title: 'IOS设备页面' }
      },
      // 度量平台
      {
        path: '/quality',
        name: 'quality',
        component: PageView,
        redirect: '/quality/dashboard',
        meta: { title: '度量平台', keepAlive: true, icon: quality },
        children: [
          {
            path: '/quality/dashboard',
            name: 'Dashboard',
            component: () => import('@/views/quality/Dashboard'),
            meta: { title: '总览' }
          },
          {
            path: '/quality/requirement',
            name: 'Requirement',
            component: RouteView,
            redirect: '/quality/requirement/metrics',
            meta: { title: '需求管理' },
            children: [
              {
                path: '/quality/requirement/metrics',
                name: 'Metrics',
                component: () => import('@/views/quality/requirement/Metrics'),
                meta: { title: '需求统计' }
              },
              {
                path: '/quality/requirement/deliver',
                name: 'Deliver',
                component: () => import('@/views/quality/requirement/Deliver'),
                meta: { title: '交付质量' }
              },
              {
                path: '/quality/requirement/progress',
                name: 'Progress',
                component: () => import('@/views/quality/requirement/Progress'),
                meta: { title: '需求进度' }
              }
            ]
          },
          {
            path: '/quality/task',
            name: 'Task',
            component: () => import('@/views/quality/task/Index'),
            meta: { title: '任务管理' }
          },
          {
            path: '/quality/bug',
            name: 'Bug',
            component: RouteView,
            redirect: '/quality/bug/index',
            meta: { title: '缺陷管理' },
            children: [
              {
                path: '/quality/bug/index',
                name: 'BugIndex',
                component: () => import('@/views/quality/bug/Index'),
                meta: { title: '缺陷统计' }
              },
              {
                path: '/quality/bug/analysis',
                name: 'BugAnalysis',
                component: () => import('@/views/quality/bug/Analysis'),
                meta: { title: '风险分析' }
              }
            ]
          },
          {
            path: '/quality/question',
            name: 'Question',
            component: RouteView,
            redirect: '/quality/question/list',
            meta: { title: '问题管理' },
            children: [
              {
                path: '/quality/question/list',
                name: 'QuestionIndex',
                component: () => import('@/views/quality/question/QuestionIndex'),
                meta: { title: '问题列表' }
              },
              {
                path: '/quality/question/analysis',
                name: 'Analysis',
                component: () => import('@/views/quality/question/Analysis'),
                meta: { title: '问题分析' }
              }
            ]
          },
          {
            path: '/quality/report',
            name: 'Report',
            component: RouteView,
            redirect: '/quality/report/monthly/list',
            meta: { title: '报告管理' },
            children: [
              {
                path: '/quality/report/monthly/list',
                name: 'MonthReport',
                component: () => import('@/views/quality/report/MonthReport'),
                meta: { title: '质量月报' }
              },
              {
                path: '/quality/report/monthly/config',
                name: 'MonthReportConfig',
                component: () => import('@/views/quality/report/MonthReportConfig'),
                meta: { title: '报告配置' }
              }
            ]
          }
        ]
      },
      // 质量月报详情页面
      {
        path: '/quality/report/monthly/detail/:reportId',
        name: 'report_show',
        hidden: true,
        component: () => import('@/views/quality/report/ReportChart')
      },
      // 用例平台
      {
        path: '/case',
        name: 'case',
        component: PageView,
        redirect: '/case/project/list',
        meta: { title: '用例平台222', keepAlive: true, icon: testcase },
        // hidden: true,
        children: [
          {
            path: '/case/project/list',
            name: 'projectList',
            component: () => import('@/views/case/project/List'),
            meta: { title: '项目用例' }
          },
          {
            path: '/case/project/detial',
            name: 'caseDetail',
            component: () => import('@/views/case/project/CaseDetail'),
            meta: { title: '用例详情' },
            hidden: true
          },
          {
            path: '/case/plan/list',
            name: 'planList',
            component: () => import('@/views/case/plan/List'),
            meta: { title: '测试计划' }
          },
          {
            path: '/case/plan/historyDetail',
            name: 'planHistoryDetail',
            component: () => import('@/views/case/plan/HistoryDetail'),
            meta: { title: '历史详情' },
            hidden: true
          },
          {
            path: '/case/report/list',
            name: 'reportList',
            component: () => import('@/views/case/report/List'),
            meta: { title: '测试报告' }
          },
          {
            path: '/case/report/ReportOverview',
            name: 'reportOverview',
            component: () => import('@/views/case/report/ReportOverview'),
            meta: { title: '测试报告总览' },
            hidden: true
          },
          {
            path: '/case/report/Detail',
            name: 'reportDetail',
            component: () => import('@/views/case/report/Detail'),
            meta: { title: '测试报告详情' },
            hidden: true
          },
          {
            path: '/case/report/SDKReportDetail',
            name: 'SDKReportDetail',
            component: () => import('@/views/case/report/SDKReportDetail'),
            meta: { title: '测试报告总览' },
            hidden: true
          },
          {
            path: '/case/stat/list',
            name: 'statList',
            component: () => import('@/views/case/stat/List'),
            meta: { title: '数据统计' },
            hidden: false
          },
          {
            path: '/case/stat/Detail',
            name: 'statDetail',
            component: () => import('@/views/case/stat/Detail'),
            meta: { title: '项目统计详情' },
            hidden: true
          }
        ]
      },
      // account
      {
        path: '/account',
        component: PageView,
        redirect: '/account/center',
        name: 'account',
        meta: { title: '用户中心', icon: 'user', keepAlive: true, permission: ['user'] },
        children: [
          {
            path: '/account/user',
            name: 'userInfo',
            component: () => import('@/views/common/user/UserInfo'),
            meta: { title: '个人信息', permission: ['user'] }
          }
        ]
      }
    ]
  },
  {
    path: '*', redirect: '/404', hidden: true
  }
]
// 高级用户后台管理菜单
export const seniorRouterMap = {
  path: '/adminMenu',
  name: 'adminMenu',
  component: PageView,
  redirect: '/adminMenu/audit',
  meta: { title: '后台管理', keepAlive: true, icon: backend },
  children: [
    {
      path: '/adminMenu/stat',
      name: 'Stat',
      component: RouteView,
      redirect: '/adminMenu/stat/overview',
      meta: { title: '数据统计' },
      children: [
        {
          path: '/adminMenu/stat/overview',
          name: 'Overview',
          component: () => import('@/views/common/admin/Overview'),
          meta: { title: '总览' }
        },
        {
          path: '/adminMenu/stat/devices',
          name: 'Devices',
          component: () => import('@/views/stf/admin/stat/Devices'),
          meta: { title: '云机管理' }
        }
      ]
    }
  ]
}

// 管理员后台管理菜单
export const adminRouterMap = {
  path: '/adminMenu',
  name: 'adminMenu',
  component: PageView,
  redirect: '/adminMenu/stat',
  meta: { title: '后台管理', keepAlive: true, icon: backend },
  children: [
    {
      path: '/adminMenu/stat',
      name: 'Stat',
      component: () => import('@/views/common/admin/Overview'),
      meta: { title: '总览' }
    },
    {
      path: '/adminMenu/permission',
      name: 'Permission',
      component: () => import('@/views/common/user/Permission'),
      meta: { title: '角色授权' }
    },
    {
      path: '/adminMenu/tc',
      name: 'adminMenuTc',
      component: RouteView,
      meta: { title: '云测平台' },
      redirect: '/adminMenu/audit',
      children: [
        {
          path: '/adminMenu/audit',
          name: 'audit',
          component: () => import('@/views/stf/admin/audit/index'),
          meta: { title: '云机审核' }
        },
        {
          path: '/adminMenu/config',
          name: 'config',
          component: () => import('@/views/common/admin/parmConfig'),
          meta: { title: '筛选配置' }
        },
        // 历史应用
        {
          path: '/history_apk',
          name: 'history_apk',
          hidden: false,
          component: () => import('@/views/stf/admin/historyapk/index'),
          meta: { title: '历史应用' }
        },
        // 设备出借
//        {
//          path: '/device_borrow',
//          name: 'device_borrow',
//          hidden: false,
//          component: () => import('@/views/common/admin/deviceborrow/index.vue'),
//          meta: { title: '设备出借' }
//        },
        {
          path: '/adminMenu/stat/devices',
          name: 'Devices',
          component: () => import('@/views/stf/admin/stat/DevicesView'),
          meta: { title: '云机管理' }
        }
      ]
    },
    {
      path: '/adminMenu/notice',
      name: 'adminNoticeList',
      component: () => import('@/views/common/admin/notice/List'),
      meta: { title: '通知列表' }
    },
    {
      path: 'views/common/industryDynamics',
      name: 'industryDynamics',
      component: RouteView,
      meta: { title: '行业动态', icon: 'test' },
      redirect: '/views/common/industryDynamics/list',
      children: [
        {
          path: '/views/common/industryDynamics/list',
          name: 'industryDynamicsList',
          component: () => import('@/views/common/industryDynamics/DynamicsList'),
          meta: { title: '行业动态列表' }
        },
        {
          path: '/views/common/industryDynamics/detail',
          name: 'industryDynamicsDetail',
          component: () => import('@/views/common/industryDynamics/DynamicsDetail'),
          meta: { title: '行业动态详情' }
        }
      ]
    }
    // 反馈列表暂时注释掉
    // {
    //   path: '/adminMenu/feedback',
    //   name: 'Feedback',
    //   component: () => import('@/views/common/feedback/Feedback'),
    //   meta: { title: '反馈列表' }
    // }
  ]
}
/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/common/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/common/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/common/user/RegisterResult')
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined
      }
    ]
  },

  {
    path: '/test',
    component: BlankLayout,
    redirect: '/test/home',
    children: [
      {
        path: 'home',
        name: 'TestHome',
        component: () => import('@/views/common/Home')
      }
    ]
  },
  // 通知列表
  {
    path: '/notice',
    component: BasicLayout,
    redirect: '/notice/list',
    hidden: true,
    children: [
      {
        path: 'list',
        name: 'noticeList',
        component: () => import('@/views/common/notice/List')
      },
      {
        path: 'detail',
        name: 'noticeDetail',
        component: () => import('@/views/common/notice/Detail')
      }
    ]
  },
  {
    path: '/tool',
    name: 'tool',
    component: BasicLayout,
    children: [
      {
        path: '/tool/lists',
        name: 'tools',
        component: () => import('@/views/common/tools/ToolList'),
        meta: { title: '小工具', keepAlive: true }
      }
    ]
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/common/exception/404')
  }

]
