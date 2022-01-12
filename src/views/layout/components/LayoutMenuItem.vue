<template>
  <div>
    <router-link v-if="item.subMenu == null"  :to="item.url">
      <el-menu-item :index="item.url" :key="item.url">
        <template #title>
            <span>{{ item.name }}</span>
          </template>
      </el-menu-item>
    </router-link>
    <el-sub-menu v-else :key="item.id" :index="item.url">
         <template #title>
            <span>{{ item.name }}</span>
          </template>
      <layout-menu-item
        v-for="child in item.subMenu"
        :key="child.url"
        :item="child"
        :base-path="child.url"
        class="nest-menu"
      />
    </el-sub-menu>
  </div>
    
</template>

<script>

export default {
  name: 'LayoutMenuItem',
  props: {
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  methods: {
   
  }
}
</script>
