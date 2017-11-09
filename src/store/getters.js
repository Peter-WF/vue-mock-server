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
  getApiPath(state) {
    return state.apiPath
  },
  getMethod(state) {
    return state.method
  }
}

