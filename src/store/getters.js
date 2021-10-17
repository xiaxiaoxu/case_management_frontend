const getters = {
  device: state => state.app.device,
  theme: state => state.app.theme,
  color: state => state.app.color,
  loginUrl: state => state.app.loginUrl,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  nickname: state => state.user.nickname,
  userId: state => state.user.userId,
  username: state => state.user.username,
  welcome: state => state.user.welcome,
  roles: state => state.user.roles,
  userInfo: state => state.user.info,
  addRouters: state => state.permission.addRouters,
  multiTab: state => state.app.multiTab,
  lang: state => state.i18n.lang,
  reportLogUrl: state => state.app.reportLogUrl,
  dataEmpty: state => state.app.dataEmpty,
  screenshotToken: state => state.quality.screenshotToken,
  isAdmin: state => state.user.isAdmin,
  userNameCn: state => state.user.userNameCn,
  lastLoginTime: state => state.user.lastLoginTime
}

export default getters
