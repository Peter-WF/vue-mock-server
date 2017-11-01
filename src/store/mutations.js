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
  updateAPIPath(state, payload) {
    state.APIPath = payload
  },
  updateMethod(state, payload) {
    state.method = payload
  }
}
