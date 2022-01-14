<template>
    <el-container class="layout">
      <el-aside  width="200px" class="layout-left">
        <layout-menu />
      </el-aside>
      <el-container>
        <el-header height="60px" class="layout-header">
          <Header></Header>
        </el-header>
        <!-- <el-main class="layout-main"> -->
          <Main class="layout-main"></Main>
        <!-- </el-main> -->
      </el-container>
    </el-container>
</template>

<script>
    import Header from './components/Header'
    import Main from './components/Main'
    import LayoutMenu from './components/LayoutMenu'

    export default {
        name: 'layout',
        components: {Header, Main, LayoutMenu}
    }
</script>


<style lang="scss">

  .layout {
    width: 100%;
    height: 100%;
  }


  .layout-left {
    height: 100%;
    padding: 0px;
    background: #304156;
  }


  .layout-header {
    background-color: #b3c0d1;
  }


  .layout-main {
    position: relative;
    height: 100%;
    width: 100%;
  }

  .menu {
    height: 100%;
  }
</style>