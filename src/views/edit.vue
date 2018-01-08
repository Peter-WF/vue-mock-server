<template>
  <div class="edit">
    <div class="edit-head">
      <ul class="edit-panel-trigger">
        <el-tooltip
          effect="light"
          content="自己编写的 mock 数据(${appDir}/mock/.local/**/${apiPath}_${method}.json)"
          placement="bottom"
        >
          <li :class="active.localData ? 'active' : ''" @click="active.localData = !active.localData">
            本地数据（.local）
          </li>
        </el-tooltip>
        <el-tooltip
          effect="light"
          content="上次从 server 端拿到的数据(/${appDir}/mock/.server/**/${apiPath}_${method}.json)"
          placement="bottom"
        >
          <li :class="active.serverData ? 'active' : ''" @click="active.serverData = !active.serverData">
            缓存数据（.server）
          </li>
        </el-tooltip>
        <el-tooltip
          effect="light"
          content="合并 local 与 server 生成的数据(/${appDir}/mock/.mock/**/${apiPath}_${method}.json)"
          placement="bottom"
        >
          <li :class="active.mockData ? 'active' : ''" @click="active.mockData = !active.mockData">
            MOCK 数据（.mock）
          </li>
        </el-tooltip>
      </ul>
    </div>
    <div class="edit-panel">
      <div v-if="active.localData" class="edit-panel-item">
        <codemirror
          v-model="localData"
          debounce='300'
          name='localData'
          @beforeChange="beforeChange"
          :options='editorOption'
        />
      </div>
      <div v-if="active.serverData" class="edit-panel-item">
        <codemirror
          :value="serverData"
          debounce='300'
          name='serverData'
          :options='Object.assign({}, editorOption, readOnlyEditor)'
        />
      </div>
      <div v-if="active.mockData" class="edit-panel-item">
        <codemirror
          :value="mockData"
          debounce='300'
          name='mockData'
          :options='Object.assign({}, editorOption, readOnlyEditor)'
        />
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import { codemirror } from 'vue-codemirror'
  import debounce from 'lodash/debounce'
  import vm from 'vm'

  require('codemirror/addon/fold/foldcode.js')
  require('codemirror/addon/fold/foldgutter.js')
  require('codemirror/addon/fold/brace-fold.js')
  require('codemirror/addon/fold/foldgutter.css')

  export default {
    name: 'edit',
    props: {},
    data() {
      return {
        active: {
          localData: true,
          serverData: true,
          mockData: false
        },
        editorOption: {
          tabSize: 2,
          styleActiveLine: true,
          lineNumbers: true,
          line: true,
          mode: {
            name: 'javascript',
            json: true
          },
          lineWrapping: true,
          theme: 'eclipse',
          foldGutter: true,
          gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter']
        },
        readOnlyEditor: {
          readOnly: true
        }
      }
    },
    computed: {
      ...mapGetters([
        'getLocalData',
        'getServerData',
        'getMockData'
      ]),
      localData: {
        get() {
          return this.getLocalData
        },
        set(value) {
          this._saveLoadData(value)
        }
      },
      serverData() {
        return this.getServerData
      },
      mockData() {
        return this.getMockData
      }
    },
    methods: {
      ...mapActions([
        'initAPIDataAction',
        'updateLocalDataAction',
        'updateServerDataAction',
        'updateMockDataAction',
        'updateApiPathAction',
        'updateMethodAction'
      ]),
      _saveLoadData: debounce(function(value) {
        this.updateLocalDataAction(value).then((rs) => {
          if (rs.success) {
            this.$notify.success({
              title: '成功',
              message: '保存成功'
            })
          } else {
            this.$notify.error({
              title: '错误',
              message: rs.description
            })
          }
        }).catch(e => {
          this.$notify.error({
            title: '错误',
            message: e
          })
        })
      }, 1000),
      beforeChange(codeMirror, { origin, text, update }) {
        // 如果是粘贴进来的字符串，会默认进行 json 格式化
        if (origin === 'paste') {
          update(null, null, this.formatJSONString(text.join('\n')).split(/\r\n?|\n/))
        }
      },
      /**
       * format JSONString by vm.runInThisContext
       * @param text
       * @returns {*}
       */
      formatJSONString(text) {
        try {
          return JSON.stringify(vm.runInThisContext(`(${text})`, {}, {
            displayErrors: false,
            timeout: 1000
          }), null, '  ')
        } catch (e) {
          console.warn(e)
          return text
        }
      }
    },
    mounted() {
      if (this.$route.params.apiPath != null) {
        this.updateApiPathAction(`/${this.$route.params.apiPath}`)
      }
      if (this.$route.params.method != null) {
        this.updateMethodAction(this.$route.params.method)
      }
    },
    components: {
      codemirror
    }
  }
</script>
<style rel="stylesheet/less" lang="less">
  html, body {
    height: 100%;
  }

  .edit {
    height: 100%;
    display: flex;
    flex-direction: column;
    .edit-head {
      height: 90%;
      flex: 1;
      background-color: @main-color-blue;
      .edit-panel-trigger {
        width: 900px;
        margin: auto;
        display: flex;
        li {
          margin-right: 10px;
          margin-left: 10px;
          flex: 1;
          line-height: 47px;
          text-align: center;
          cursor: pointer;
          color: white;
          &:hover, &.active {
            background-color: @main-color-blue-hover;
          }
        }
      }
    }
    .edit-panel {
      display: flex;
      flex: 19;
      height: 90%;
      .edit-panel-item {
        flex: 1;
        padding: 10px;
        overflow: auto;
        .CodeMirror {
          height: 100%;
        }
      }
    }
  }
</style>
