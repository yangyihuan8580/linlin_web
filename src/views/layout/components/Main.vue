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
            console.log(this.$route.path)
            return this.$route.path
          }
        },
        mounted() {
          console.log(this.$route.path)
        }
    }
</script>