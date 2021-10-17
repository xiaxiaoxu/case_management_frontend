const quality = {
  state: {
    jiraProjectList: [],
    jiraUserList: [],
    screenshotToken: 'cXVhbGl0eVJlcG9ydA'
  },
  mutations: {
    JIRA_PROJECT_LIST: (state, jiraProject) => {
      state.jiraProjectList = jiraProject
    },
    JIRA_USER_LIST: (state, jiraUserList) => {
      state.jiraUserList = jiraUserList
    }
  },
  actions: {}
}

export default quality
