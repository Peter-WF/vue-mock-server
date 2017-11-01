import Vue from 'vue'
import merge from 'lodash/merge'
import debounce from 'lodash/debounce'

function error2String(e) {
  return JSON.stringify({
    message: e.message,
    stack: e.stack
  }, null, '  ')
}

function getMockDataString(localDataString, serverDataString) {
  let mockDataString
  let serverData
  let localData
  try {
    serverData = JSON.parse(serverDataString)
    localData = JSON.parse(localDataString)
    mockDataString = JSON.stringify(merge(serverData, localData), null, '  ')
  } catch (e) {
    mockDataString = error2String(e)
  }
  return mockDataString
}

// 延迟执行写入本地
const saveData = function(state, type, JSONString) {
  Vue.prototype.$ajax({
    url: `/mock-server/api/${state.method}/${type}${state.APIPath}`,
    method: 'post',
    data: {
      JSONString: JSONString
    }
  }).then(res => {
    if (!res.success) {
      // TODO 显示错误提示
    }
  })
}

export default {
  initAPIDataAction: debounce(({ commit, state, dispatch }) => {
    if (state.APIPath) {
      Vue.prototype.$ajax({
        url: `/mock-server/api/${state.method}/local${state.APIPath}`,
        method: 'get'
      }).then(res => {
        commit('updateLocalData', JSON.stringify(res, null, '  '))
        dispatch('updateMockDataAction', getMockDataString(state.localData, state.serverData))
      }).catch(e => {
        commit('updateLocalData', error2String(e))
      })
      Vue.prototype.$ajax({
        url: `/mock-server/api/${state.method}/server${state.APIPath}`,
        method: 'get'
      }).then(res => {
        commit('updateServerData', JSON.stringify(res, null, '  '))
        dispatch('updateMockDataAction', getMockDataString(state.localData, state.serverData))
      }).catch(e => {
        commit('updateServerData', error2String(e))
      })
    }
  }, 500),
  updateServerDataAction({ commit }, data) {
    commit('updateServerData', data)
  },
  updateLocalDataAction: debounce(({ commit, state, dispatch }, localDataString) => {
    if (state.localData !== localDataString) {
      commit('updateLocalData', localDataString)
      saveData(state, 'local', localDataString)
      dispatch('updateMockDataAction', getMockDataString(state.localData, state.serverData))
    }
  }, 500),
  updateMockDataAction({ commit, state }, mockDataString) {
    if (state.mockData !== mockDataString) {
      saveData(state, 'mock', mockDataString)
      commit('updateMockData', mockDataString)
    }
  },
  updateAPIPathAction({ commit, dispatch }, data) {
    commit('updateAPIPath', data)
    dispatch('initAPIDataAction')
  },
  updateMethodAction({ commit, dispatch }, data) {
    commit('updateMethod', data)
    dispatch('initAPIDataAction')
  }
}
