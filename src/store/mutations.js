export default {
  updateLocalData(state, payload) {
    state.localData = payload
  },
  updateServerData(state, payload) {
    state.serverData = payload
  },
  updateMockData(state, payload) {
    state.mockData = payload
  },
  updateApiPath(state, payload) {
    state.apiPath = payload
  },
  updateMethod(state, payload) {
    state.method = payload
  }
}
