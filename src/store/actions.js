import Vue from 'vue'
import merge from 'lodash/merge'
import debounce from 'lodash/debounce'

function error2String(e) {
  if (typeof e === 'object') {
    return e.message
    // return JSON.stringify({
    //   message: e.message,
    //   stack: e.stack
    // }, null, '  ')
  } else {
    return e
  }
}

// 将获取 mock 数据，目前 mock 数据采用 merge(serverData, localData) 形式获取
function getMockDataString(localDataString, serverDataString) {
  const serverData = JSON.parse(serverDataString)
  const localData = JSON.parse(localDataString)
  return JSON.stringify(merge(serverData, localData), null, '  ')
}

// 延迟执行写入本地
const saveData = function(state, type, JSONString) {
  return Vue.prototype.$ajax({
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
/**
 * 从本地文件中读取数据
 * @param method api method
 * @param APIPath api path
 * @param type  数据类型 local / server / mock
 */
const getData = function(method, APIPath, type) {
  return Vue.prototype.$ajax({
    url: `/mock-server/api/${method}/${type}${APIPath}`,
    method: 'get'
  })
}

export default {
  initAPIDataAction: debounce(({ commit, state, dispatch }) => {
    if (!state.APIPath) {
      // 如果当前没有填写 apiPatch 则不发起请求
      return Promise.resolve()
    } else {
      return Promise.all([
        getData(state.method, state.APIPath, 'local'),
        getData(state.method, state.APIPath, 'server')
      ]).then(res => {
        commit('updateLocalData', JSON.stringify(res[0], null, '  '))
        commit('updateServerData', JSON.stringify(res[1], null, '  '))
        return dispatch('updateMockDataAction', getMockDataString(state.localData, state.serverData))
      })
    }
  }, 500),
  updateServerDataAction({ commit }, data) {
    commit('updateServerData', data)
  },
  // 保存 local 数据至本地文件
  updateLocalDataAction({ commit, state, dispatch }, localDataString) {
    return new Promise((resolve, reject) => {
      if (state.localData !== localDataString) {
        commit('updateLocalData', localDataString)
        try {
          // 根据 localData 与 serverData 合并生成 mockData
          const mockData = getMockDataString(state.localData, state.serverData)
          Promise.all([
            saveData(state, 'local', localDataString),
            dispatch('updateMockDataAction', mockData)
          ]).then(() => {
            resolve()
          })
        } catch (e) {
          reject(error2String(e))
        }
      }
    })
  },
  updateMockDataAction({ commit, state }, mockDataString) {
    return new Promise((resolve, reject) => {
      if (state.mockData === mockDataString) {
        // 内容不变则直接 resolve
        resolve()
      } else {
        saveData(state, 'mock', mockDataString).then(() => {
          resolve()
          commit('updateMockData', mockDataString)
        }).catch(e => {
          console.error(e)
          reject('更新 mock 数据失败')
        })
      }
    })
  },
  updateAPIPathAction({ commit, dispatch }, data) {
    commit('updateAPIPath', data)
    return dispatch('initAPIDataAction')
  },
  updateMethodAction({ commit, dispatch }, data) {
    commit('updateMethod', data)
    return dispatch('initAPIDataAction')
  }
}
