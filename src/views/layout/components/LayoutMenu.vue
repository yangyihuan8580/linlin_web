<template>
    <el-scrollbar wrap-class="scrollbar-wrapper" height="100%">
      <el-menu
        class="menu"
        unique-opened	
        :router="true"
        background-color="#304156"
        text-color="#fff"
        active-text-color="#409EFF"
        >
          <layout-menu-item
            v-for="menu in menuList" 
            :key="menu.url" 
            :item="menu"
            :base-path="menu.url" />
      </el-menu>
    </el-scrollbar>
</template>

<script>
  import LayoutMenuItem from './LayoutMenuItem'
  import { mapGetters } from 'vuex'

  export default {
      name: 'layout-menu',
      components: { LayoutMenuItem },
      computed: {
        ...mapGetters([
          'menuList'
        ])
      },
      mounted() {
      }
  }
</script>


<style lang="scss">
  .scrollbar-wrapper {
    overflow-x: hidden !important;
  }
</style>