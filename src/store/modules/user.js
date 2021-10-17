import Vue from 'vue'
import { login, logout, getUserMenu } from '@/api/common/login'
import * as statisticsApi from '@/api/common/statistics'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import VueCookie from 'vue-cookie'
import VueJwtDecode from 'vue-jwt-decode'

const user = {
  state: {
    token: '',
    username: '',
    nickname: '',
    userId: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {},
    exp: 0,
    part: '',
    email: '',
    isAdmin: false,
    userNameCn: '',
    lastLoginTime: ''
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      if (token && token !== state.token) {
        localStorage.setItem(ACCESS_TOKEN, token)
        const decoded = VueJwtDecode.decode(token)
        console.log('decoded in SET_TOKEN: ')
        console.log(decoded)
        state.userId = decoded.userid || 0
        state.username = decoded.username || ''
        state.nickname = decoded.nickname || ''
        state.picture = decoded.picture || ''
        state.exp = decoded.exp || 0
        state.part = decoded.part || ''
        state.isAdmin = state.part === '1'
        state.email = decoded.email || ''
        state.token = token || ''
        state.userNameCn = decoded.user_name_cn || ''
        state.lastLoginTime = decoded.lastLoginTime || ''
      }
    },
    SET_NAME: (state, { username, welcome }) => {
      state.username = username
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
    FLASH_TOKEN: (state) => {
      const token = VueCookie.get(ACCESS_TOKEN)
      if (token && token !== state.token) {
        localStorage.setItem(ACCESS_TOKEN, token)
        const decoded = VueJwtDecode.decode(token)
        console.log('decoded in FLASH_TOKEN: ')
        console.log(decoded)
        state.userId = decoded.userid || 0
        state.username = decoded.username || ''
        state.nickname = decoded.nickname || ''
        state.picture = decoded.picture || ''
        state.exp = decoded.exp || 0
        state.part = decoded.part || ''
        state.isAdmin = state.part === 1
        state.email = decoded.email || ''
        state.token = token || ''
        state.userNameCn = decoded.user_name_cn || ''
        state.lastLoginTime = decoded.lastLoginTime || ''
      }
    },
    CLEAR_TOKEN: (state) => {
      state.userId = 0
      state.username = ''
      state.nickname = ''
      state.picture = ''
      state.exp = 0
      state.role = []
      state.part = ''
      state.email = ''
      state.token = ''
      state.userNameCn = ''
      state.lastLoginTime = ''
      localStorage.removeItem(ACCESS_TOKEN)
      VueCookie.delete(ACCESS_TOKEN, { domain: process.env.VUE_APP_COOKIE_DOMAIN })
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          const result = response.result
          Vue.ls.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
          commit('SET_TOKEN', result.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetUserMenu ({ commit }, platform) {
      return new Promise((resolve, reject) => {
        getUserMenu(platform).then(response => {
          const data = response.data
          if (!data) {
            reject(new Error('Verification failed, please Login again.'))
          }
          if (data && data.length > 0) {
            commit('SET_ROLES', data)
            // commit('SET_PERMISSIONS', stringResources)
          } else {
            reject(new Error('getInfo: roles must be a non-null array !'))
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        logout(state.token).then(() => {
          resolve()
        }).catch(() => {
          resolve()
        }).finally(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          Vue.ls.remove(ACCESS_TOKEN)
          commit('CLEAR_TOKEN')
        })
        })
      },
    // 添加发送
    SendLoginStat ({ commit }) {
      return new Promise((resolve) => {
        const data = {
          'platform': 'session',
          'func': 'login'
        };
        statisticsApi.statOerviewAdd(data).then(() => {
          console.log('add login stat')
          resolve()
        }).catch(() => {
          resolve()
        })
      })
    }
  }
}

export default user
