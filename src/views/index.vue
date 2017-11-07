<template>
  <div class="m-index">
    <m-header/>
    <router-view/>
  </div>
</template>

<script>
  import MHeader from '../components/m-header/m-header.vue'

  export default {
    name: 'm-index',
    components: {
      MHeader
    }
  }
</script>
<style rel="stylesheet/less" lang="less">
  html, body, .m-root {
    height: 100%;
  }

  body {
    background: #f4f4f4;
  }

  .m-index {
    display: flex;
    height: 100%;
    flex-direction: column;
    .m-wrap {
      width: 85%;
      margin: auto;
    }
  }
</style>
