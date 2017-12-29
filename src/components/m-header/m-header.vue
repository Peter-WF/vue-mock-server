<template>
  <div class="m-header">
    <div class="m-wrap">
      <el-tooltip
        effect="light"
        content="选择接口请求方式"
        placement="bottom"
      >
        <el-select
          v-model="method"
          class="req-method"
          placeholder="GET"
          @change="editMockData"
        >
          <el-option
            v-for="item in methodOptions"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-tooltip>
      <el-tooltip
        effect="light"
        content="对应操作的 URL。例如：/api/projects/2309"
        placement="bottom"
      >
        <el-autocomplete
          v-model="apiPath"
          class="api-path"
          placeholder="搜索接口并编辑"
          :fetch-suggestions="querySearch"
          @input="editMockData"
          @select="editMockData"
        >
          <template slot="prepend">{{ locationOrigin }}</template>
          <el-button slot="append" icon="el-icon-search"/>
        </el-autocomplete>
      </el-tooltip>
    </div>
    <div class="m-wrap">
      <el-tooltip
        effect="light"
        content="全局代理模式会将之前默认走后端的接口改为走缓存数据"
        placement="left"
      >
        <el-switch
          v-model="globalAgent"
          active-color="#55a8fd"
          active-text="全局模式开启"
          inactive-color="#999"
          inactive-text="全局模式关闭"
          :width="120"
          @change="globalAgentChange"
        />
      </el-tooltip>
    </div>
    <div class="m-wrap">
      <el-tooltip
        effect="light"
        content="根据选择的类型，实现接口代理。"
        placement="left"
      >
        <el-radio-group v-model="mockType">
          <el-radio label="0">无</el-radio>
          <el-radio label="local">本地数据</el-radio>
          <el-radio label="server">缓存数据</el-radio>
          <el-radio label="mock">MOCK 数据</el-radio>
        </el-radio-group>
      </el-tooltip>
      <el-tooltip
        effect="light"
        content="清除所有接口的代理设置"
        placement="left"
      >
        <el-button type="text" @click="clearAPIMockStorage">Clear</el-button>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'm-header',
    data() {
      return {
        cacheFiles: [],
        methodOptions: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'COPY', 'HEAD', 'OPTIONS'],
        apiMockStorage: JSON.parse(this.getCache('mockConfig') || '{}'),
        globalAgent: !!(this.getCache('globalAgent')),
        locationOrigin: location.origin
      }
    },
    computed: {
      ...mapGetters([
        'getMethod',
        'getApiPath'
      ]),
      apiPath: {
        get() {
          return this.getApiPath
        },
        set(value) {
          value = value.replace(/\/$/, '')
          this.updateApiPathAction(value)
        }
      },
      method: {
        get() {
          return this.getMethod
        },
        set(value) {
          this.updateMethodAction(value)
        }
      },
      mockType: {
        get() {
          return this.getMockType(this.apiPath, this.method)
        },
        set(value) {
          this.setMockType(this.apiPath, this.method, value)
        }
      }
    },
    watch: {
      '$route'() {
        if (this.$route.params.apiPath != null) {
          const apiPath = '/' + this.$route.params.apiPath
          if (apiPath !== this.apiPath) {
            this.updateApiPathAction(apiPath)
          }
        }

        const method = this.$route.params.method
        if (method != null && method !== this.method) {
          this.updateMethodAction(method)
        }
      }
    },
    methods: {
      ...mapActions([
        'updateMethodAction',
        'updateApiPathAction'
      ]),
      getCache(key) {
        return this.$utils.cookie.get(key)
      },
      setCache(key, value) {
        this.$utils.cookie.set(key, value || '', {
          domain: document.domain.split('.').slice(-2).join('.'), // api.wangfeia.com => wangfeia.com && localhost => localhost
          path: '/',
          expires: 365 // 天
        })
      },
      querySearch(queryString, cb) {
        const cacheFiles = this.cacheFiles
        const results = queryString ? cacheFiles.filter(this.createFilter(queryString, this.method)) : cacheFiles
        // 调用 callback 返回建议列表的数据
        cb(results.map(item => {
          return {
            value: item.value.replace(`_${this.method}.json`, '')
          }
        }))
      },
      // 模糊查询以当前输入开头的，${method}.json 结尾的接口
      createFilter(queryString, method) {
        return (restaurant) => {
          const filePath = restaurant.value
          const suffix = `${method}.json`
          return filePath.indexOf(`${queryString.toLowerCase()}`) === 0 &&
            filePath.indexOf(suffix) === filePath.length - suffix.length
        }
      },
      editMockData() {
        let key = this.apiPath.trim()
        // format path
        if (key) {
          if (key[0] !== '/') {
            key = '/' + key
          }
          this.$router.push(`/edit/${this.method}${key}`)
        } else {
          this.$router.push(`/`)
        }
      },
      getMockType(apiPath, method) {
        return this.apiMockStorage[`${apiPath}_${method}`] || `0`
      },
      setMockType(apiPath, method, type) {
        // 去掉结尾的 / 避免出现 /xxx/ != /xxx 的情况
        if (type !== '0') {
          this.$set(this.apiMockStorage, `${apiPath}_${method}`, type)
        } else {
          this.$delete(this.apiMockStorage, `${apiPath}_${method}`)
        }
        this.setCache('mockConfig', JSON.stringify(this.apiMockStorage))
      },
      clearAPIMockStorage() {
        this.apiMockStorage = {}
        this.setCache('mockConfig')
      },
      globalAgentChange() {
        if (this.globalAgent) {
          this.setCache('globalAgent', this.globalAgent)
        } else {
          this.setCache('globalAgent')
        }
      }
    },
    mounted() {
      this.$ajax({
        url: '/mock-server/api/getCacheFiles'
      }).then(res => {
        if (res.success) {
          this.cacheFiles = res.data.files.map(item => {
            return {
              value: item
            }
          })
        }
      })
    }
  }
</script>
<style rel="stylesheet/less" lang="less">
  .m-header {
    background-color: #fff;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    .m-wrap {
      display: flex;
      padding: 5px 0;
      .req-method {
        flex: 3;
        margin: 0 5px;
      }
      .api-path {
        flex: 17;
        margin: 0 5px;
      }
      .el-switch {
        margin: auto;
      }
      .el-radio-group {
        margin: auto;
      }
    }
  }
</style>
