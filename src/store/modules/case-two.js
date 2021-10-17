const caseTwo = {
  state: {
    case_two_global_project_name: '',
    case_two_global_project_id: 0
  },
  mutations: {
    case_two_global_project_name: (state, caseProject) => {
      state.case_two_global_project_name = caseProject
    },
    case_two_global_project_id: (state, projectId) => {
      state.case_two_global_project_id = projectId
    }
  },
  actions: {}
}

export default caseTwo
