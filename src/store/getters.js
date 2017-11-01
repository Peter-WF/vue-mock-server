export default {
  getLocalData(state) {
    return state.localData
  },
  getServerData(state) {
    return state.serverData
  },
  getMockData(state) {
    return state.mockData
  },
  getAPIPath(state) {
    return state.APIPath
  },
  getMethod(state) {
    return state.method
  }
}

