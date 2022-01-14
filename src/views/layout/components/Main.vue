<template>
  <div class="main">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>

<script>
    export default {
        name: 'layout-main',
        computed: {
          key() {
            return this.$route.path
          }
        },
        mounted() {

        }
    }
</script>